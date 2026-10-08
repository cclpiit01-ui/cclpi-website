import { supabaseEmployees } from "@/lib/supabaseEmployees";

/**
 * Sync Production (Main API -> Supabase)
 * ---------------------------------------------------------------
 * Pulls production data for:
 *   - Sales Counselors
 *   - Unit Managers
 *   - Agencies
 *
 * Then sends each "data" array to the matching Supabase RPC:
 *   - import_production_sales_counselor
 *   - import_production_unit_manager
 *   - import_production_agency
 *
 * IMPORTANT:
 * production_agency.id_no is manually assigned.
 * The Agency import RPC must preserve existing id_no values during sync.
 *
 * Optional .env overrides:
 *   VITE_PRODUCTION_SC_API_URL
 *   VITE_PRODUCTION_UM_API_URL
 *   VITE_PRODUCTION_AGENCY_API_URL
 *
 * Returns:
 * {
 *   sc: {...},
 *   um: {...},
 *   agency: {...}
 * }
 * ---------------------------------------------------------------
 */

const API_TOKEN =
  import.meta.env.VITE_PRODUCTION_API_TOKEN ||
  import.meta.env.VITE_SALES_COUNSELOR_API_TOKEN;

const SC_URL =
  import.meta.env.VITE_PRODUCTION_SC_API_URL ||
  "https://sys.cclpi.com.ph/api/ProductionSummarySC";

const UM_URL =
  import.meta.env.VITE_PRODUCTION_UM_API_URL ||
  "https://sys.cclpi.com.ph/api/ProductionSummaryUM";

const AGENCY_URL =
  import.meta.env.VITE_PRODUCTION_AGENCY_API_URL ||
  "https://sys.cclpi.com.ph/api/ProductionSummaryAgency";


async function fetchRows(url, label) {
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
    },
  });

  if (!res.ok) {
    throw new Error(`${label} API request failed (${res.status})`);
  }

  const json = await res.json();

  const rows = Array.isArray(json)
    ? json
    : json.data || [];

  if (rows.length === 0) {
    throw new Error(
      `${label} API returned no rows - nothing was changed.`
    );
  }

  return rows;
}


export async function runProductionSync() {
  /**
   * Fetch ALL production data first.
   *
   * If any API request fails, no Supabase production table
   * will be changed.
   */
  const [scRows, umRows, agencyRows] = await Promise.all([
    fetchRows(SC_URL, "Sales Counselor production"),
    fetchRows(UM_URL, "Unit Manager production"),
    fetchRows(AGENCY_URL, "Agency production"),
  ]);


  // ------------------------------------------------------------
  // Sales Counselor Production
  // ------------------------------------------------------------

  const sc = await supabaseEmployees.rpc(
    "import_production_sales_counselor",
    {
      p_rows: scRows,
    }
  );

  if (sc.error) {
    throw new Error(
      `Sales Counselor production: ${sc.error.message}`
    );
  }


  // ------------------------------------------------------------
  // Unit Manager Production
  // ------------------------------------------------------------

  const um = await supabaseEmployees.rpc(
    "import_production_unit_manager",
    {
      p_rows: umRows,
    }
  );

  if (um.error) {
    throw new Error(
      `Unit Manager production: ${um.error.message}`
    );
  }


  // ------------------------------------------------------------
  // Agency Production
  // ------------------------------------------------------------

  const agency = await supabaseEmployees.rpc(
    "import_production_agency",
    {
      p_rows: agencyRows,
    }
  );

  if (agency.error) {
    throw new Error(
      `Agency production: ${agency.error.message}`
    );
  }


  return {
    sc: sc.data,
    um: um.data,
    agency: agency.data,
  };
}