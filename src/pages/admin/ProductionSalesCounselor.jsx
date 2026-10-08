import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Search,
  RefreshCw,
  MoreVertical,
  FileText,
  X,
  Printer,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { supabaseEmployees } from "@/lib/supabaseEmployees";
import PerformanceSalesCounselor from "@/components/letter/PerformanceSalesCounselor";

const TABLE = "production_sales_counselor";
const PAGE_SIZE = 25;

const PRODUCTION_API_URL =
  import.meta.env.VITE_PRODUCTION_SC_API_URL ||
  "https://sys.cclpi.com.ph/api/ProductionSummarySC";

const API_TOKEN =
  import.meta.env.VITE_PRODUCTION_API_TOKEN ||
  import.meta.env.VITE_SALES_COUNSELOR_API_TOKEN;

// ============================================================
// HELPERS
// ============================================================

const formatPeso = (value) => {
  if (value === null || value === undefined || value === "") {
    return "—";
  }

  return `₱${Number(value).toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const formatDate = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-PH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// ============================================================
// COMPONENT
// ============================================================

export default function ProductionSalesCounselor() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [openMenuId, setOpenMenuId] = useState(null);
  const [performanceData, setPerformanceData] = useState(null);

  const [toast, setToast] = useState(null);

  // ============================================================
  // TOAST
  // ============================================================

  const showToast = (message, type = "success") => {
    setToast({
      message,
      type,
    });

    window.setTimeout(() => {
      setToast(null);
    }, 5000);
  };

  // ============================================================
  // LOAD PRODUCTION DATA
  // ============================================================

  const loadProduction = useCallback(async () => {
    setLoading(true);

    try {
      const { data, error } = await supabaseEmployees
        .from(TABLE)
        .select(`
          id_no,
          agent_name,
          fyp_production,
          spotcash,
          premium1,
          salescoordinator,
          period_start,
          period_end,
          imported_at
        `)
        .order("agent_name", { ascending: true });

      if (error) throw error;

      setRows(data || []);
    } catch (error) {
      console.error("Failed to load Sales Counselor production:", error);

      showToast(
        "Failed to load Sales Counselor production: " + error.message,
        "error"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProduction();
  }, [loadProduction]);

  // ============================================================
  // SEARCH
  // ============================================================

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return rows;
    }

    return rows.filter((row) => {
      return (
        row.id_no?.toLowerCase().includes(query) ||
        row.agent_name?.toLowerCase().includes(query) ||
        row.salescoordinator?.toLowerCase().includes(query)
      );
    });
  }, [rows, search]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  // ============================================================
  // PAGINATION
  // ============================================================

  const totalPages = Math.max(
    1,
    Math.ceil(filteredRows.length / PAGE_SIZE)
  );

  const currentPage = Math.min(page, totalPages);

  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;

    return filteredRows.slice(start, start + PAGE_SIZE);
  }, [filteredRows, currentPage]);

  const startRow =
    filteredRows.length === 0
      ? 0
      : (currentPage - 1) * PAGE_SIZE + 1;

  const endRow = Math.min(
    currentPage * PAGE_SIZE,
    filteredRows.length
  );

  // ============================================================
  // SYNC SALES COUNSELOR PRODUCTION ONLY
  // ============================================================

  const handleSyncProduction = async () => {
    setSyncing(true);

    try {
      const response = await fetch(PRODUCTION_API_URL, {
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
        },
      });

      if (!response.ok) {
        throw new Error(
          `Production API request failed (${response.status})`
        );
      }

      const json = await response.json();

      const productionRows = Array.isArray(json)
        ? json
        : json?.data || [];

      if (productionRows.length === 0) {
        throw new Error(
          "Production API returned no Sales Counselor records."
        );
      }

      const { data, error } = await supabaseEmployees.rpc(
        "import_production_sales_counselor",
        {
          p_rows: productionRows,
        }
      );

      if (error) throw error;

      const inserted = data?.inserted ?? 0;
      const skipped = data?.skipped ?? 0;

      showToast(
        `Sales Counselor production synced. ${inserted} inserted${
          skipped ? `, ${skipped} skipped` : ""
        }.`
      );

      await loadProduction();
    } catch (error) {
      console.error("Production sync failed:", error);

      showToast(
        "Production sync failed: " + error.message,
        "error"
      );
    } finally {
      setSyncing(false);
    }
  };

  // ============================================================
  // PERFORMANCE LETTER
  // ============================================================

  const openPerformance = (row) => {
    /*
     * PerformanceSalesCounselor expects:
     *
     * sc.full_name
     * sc.production
     *
     * production_sales_counselor already contains everything
     * required for the performance amount.
     */

    setPerformanceData({
      ...row,

      full_name:
        row.agent_name ||
        row.id_no,

      production:
        row.fyp_production ?? null,
    });

    setOpenMenuId(null);
  };

  // ============================================================
  // PRINT
  // ============================================================

  const handlePrint = () => {
    window.print();
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <>
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }

          .print-area,
          .print-area * {
            visibility: visible !important;
          }

          .print-area {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 210mm !important;
            min-height: 297mm !important;
            box-shadow: none !important;
          }

          .no-print,
          .no-print-overlay {
            display: none !important;
          }

          @page {
            size: A4 portrait;
            margin: 0;
          }

          body {
            margin: 0 !important;
            background: #ffffff !important;
          }
        }
      `}</style>

      {/* ======================================================
          PAGE
      ====================================================== */}

      <div
        style={{
          minHeight: "100vh",
          background: "#f7f9fc",
          padding: 24,
          fontFamily:
            "'Inter', 'Poppins', Arial, sans-serif",
        }}
      >
        {/* HEADER */}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 20,
            marginBottom: 24,
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: 26,
                fontWeight: 800,
                color: "#0f172a",
              }}
            >
              Sales Counselor Production
            </h1>

            <p
              style={{
                margin: "6px 0 0",
                color: "#64748b",
                fontSize: 14,
              }}
            >
              Production and performance records of Sales
              Counselors
            </p>
          </div>

          <button
            onClick={handleSyncProduction}
            disabled={syncing}
            style={{
              border: "none",
              borderRadius: 10,
              padding: "11px 16px",
              background: "#013F99",
              color: "#ffffff",
              fontWeight: 700,
              cursor: syncing ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
              opacity: syncing ? 0.7 : 1,
            }}
          >
            <RefreshCw
              size={17}
              style={{
                animation: syncing
                  ? "spin 1s linear infinite"
                  : "none",
              }}
            />

            {syncing
              ? "Syncing..."
              : "Sync Production"}
          </button>
        </div>

        {/* SUMMARY */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(3, minmax(0, 1fr))",
            gap: 16,
            marginBottom: 20,
          }}
        >
          <SummaryCard
            label="Production Records"
            value={rows.length.toLocaleString()}
          />

          <SummaryCard
            label="Total FYP"
            value={formatPeso(
              rows.reduce(
                (sum, row) =>
                  sum +
                  Number(row.fyp_production || 0),
                0
              )
            )}
          />

          <SummaryCard
            label="Sales Coordinators"
            value={
              new Set(
                rows
                  .map((row) =>
                    row.salescoordinator?.trim()
                  )
                  .filter(Boolean)
              ).size
            }
          />
        </div>

        {/* TABLE CARD */}

        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e8edf4",
            borderRadius: 14,
            boxShadow:
              "0 2px 8px rgba(15,23,42,0.04)",
            overflow: "visible",
          }}
        >
          {/* SEARCH */}

          <div
            style={{
              padding: 16,
              borderBottom: "1px solid #edf1f6",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
            }}
          >
            <div
              style={{
                width: 360,
                maxWidth: "100%",
                position: "relative",
              }}
            >
              <Search
                size={17}
                style={{
                  position: "absolute",
                  left: 13,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#94a3b8",
                }}
              />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search ID, name or coordinator..."
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "11px 14px 11px 40px",
                  border: "1px solid #dce3ec",
                  borderRadius: 9,
                  outline: "none",
                  fontSize: 13,
                  color: "#0f172a",
                }}
              />
            </div>

            <div
              style={{
                fontSize: 13,
                color: "#64748b",
              }}
            >
              {filteredRows.length.toLocaleString()} records
            </div>
          </div>

          {/* TABLE */}

          <div
            style={{
              overflowX: "auto",
              overflowY: "visible",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 13,
              }}
            >
              <thead>
                <tr
                  style={{
                    background: "#f8fafc",
                  }}
                >
                  {[
                    "ID No.",
                    "Sales Counselor",
                    "FYP",
                    "Spot Cash",
                    "Premium 1",
                    "Sales Coordinator",
                    "Period",
                    "Actions",
                  ].map((heading) => (
                    <th
                      key={heading}
                      style={{
                        padding: "12px 16px",
                        textAlign: "left",
                        fontSize: 11,
                        fontWeight: 700,
                        color: "#64748b",
                        textTransform: "uppercase",
                        letterSpacing: 0.6,
                        borderBottom:
                          "1px solid #e8edf4",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={8}
                      style={{
                        padding: 50,
                        textAlign: "center",
                        color: "#64748b",
                      }}
                    >
                      Loading production records...
                    </td>
                  </tr>
                ) : paginatedRows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      style={{
                        padding: 50,
                        textAlign: "center",
                        color: "#94a3b8",
                      }}
                    >
                      No production records found.
                    </td>
                  </tr>
                ) : (
                  paginatedRows.map((row) => (
                    <tr
                      key={row.id_no}
                      style={{
                        borderBottom:
                          "1px solid #edf1f6",
                      }}
                    >
                      <td
                        style={{
                          padding: "13px 16px",
                          fontWeight: 700,
                          color: "#013F99",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {row.id_no}
                      </td>

                      <td
                        style={{
                          padding: "13px 16px",
                          fontWeight: 600,
                          color: "#172033",
                          minWidth: 200,
                        }}
                      >
                        {row.agent_name || "—"}
                      </td>

                      <td
                        style={{
                          padding: "13px 16px",
                          fontWeight: 700,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {formatPeso(
                          row.fyp_production
                        )}
                      </td>

                      <td
                        style={{
                          padding: "13px 16px",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {formatPeso(row.spotcash)}
                      </td>

                      <td
                        style={{
                          padding: "13px 16px",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {formatPeso(row.premium1)}
                      </td>

                      <td
                        style={{
                          padding: "13px 16px",
                          color: "#475569",
                          minWidth: 190,
                        }}
                      >
                        {row.salescoordinator || "—"}
                      </td>

                      <td
                        style={{
                          padding: "13px 16px",
                          color: "#64748b",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {formatDate(
                          row.period_start
                        )}
                        {" – "}
                        {formatDate(row.period_end)}
                      </td>

                      <td
                        style={{
                          padding: "13px 16px",
                          position: "relative",
                        }}
                      >
                        <button
                          onClick={() =>
                            setOpenMenuId(
                              openMenuId === row.id_no
                                ? null
                                : row.id_no
                            )
                          }
                          style={{
                            width: 34,
                            height: 34,
                            borderRadius: 8,
                            border:
                              "1px solid #e1e7ef",
                            background: "#ffffff",
                            cursor: "pointer",
                            display: "grid",
                            placeItems: "center",
                          }}
                        >
                          <MoreVertical size={17} />
                        </button>

                        {openMenuId === row.id_no && (
                          <div
                            style={{
                              position: "absolute",
                              right: 16,
                              top: 48,
                              zIndex: 50,
                              width: 205,
                              background: "#ffffff",
                              border:
                                "1px solid #e2e8f0",
                              borderRadius: 10,
                              boxShadow:
                                "0 12px 30px rgba(15,23,42,0.14)",
                              padding: 6,
                            }}
                          >
                            <button
                              onClick={() =>
                                openPerformance(row)
                              }
                              style={{
                                width: "100%",
                                border: "none",
                                background:
                                  "transparent",
                                padding: "10px 11px",
                                borderRadius: 7,
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: 9,
                                textAlign: "left",
                                color: "#172033",
                                fontSize: 13,
                              }}
                            >
                              <FileText
                                size={16}
                                color="#013F99"
                              />

                              Performance Letter
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}

          {!loading && filteredRows.length > 0 && (
            <div
              style={{
                padding: "14px 16px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderTop: "1px solid #edf1f6",
                gap: 16,
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  color: "#64748b",
                }}
              >
                Showing {startRow}–{endRow} of{" "}
                {filteredRows.length}
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <button
                  onClick={() =>
                    setPage((current) =>
                      Math.max(1, current - 1)
                    )
                  }
                  disabled={currentPage === 1}
                  style={paginationButtonStyle}
                >
                  <ChevronLeft size={16} />
                </button>

                <span
                  style={{
                    minWidth: 90,
                    textAlign: "center",
                    fontSize: 13,
                    color: "#475569",
                  }}
                >
                  Page {currentPage} of{" "}
                  {totalPages}
                </span>

                <button
                  onClick={() =>
                    setPage((current) =>
                      Math.min(
                        totalPages,
                        current + 1
                      )
                    )
                  }
                  disabled={
                    currentPage === totalPages
                  }
                  style={paginationButtonStyle}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ======================================================
          PERFORMANCE LETTER PREVIEW
      ====================================================== */}

      {performanceData && (
        <div
          className="no-print-overlay"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            background: "#eef2f7",
            overflow: "auto",
            padding: 16,
          }}
        >
          {/* UNIFORM HEADER */}

          <div
            className="no-print"
            style={{
              maxWidth: 1000,
              margin: "0 auto 14px",
              background: "#ffffff",
              borderRadius: 14,
              padding: "12px 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
              boxShadow:
                "0 1px 3px rgba(15,23,42,0.08)",
            }}
          >
            <div
              style={{
                minWidth: 0,
                flex: 1,
              }}
            >
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: "#0b1a3b",
                }}
              >
                Sales Counselor Performance Letter
              </div>

              <div
                style={{
                  marginTop: 4,
                  fontSize: 12,
                  color: "#64748b",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {performanceData.agent_name ||
                  performanceData.id_no}
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <button
                onClick={handlePrint}
                style={{
                  padding: "10px 16px",
                  border: "none",
                  borderRadius: 9,
                  background: "#064da5",
                  color: "#ffffff",
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                }}
              >
                <Printer size={16} />
                Print
              </button>

              <button
                onClick={() =>
                  setPerformanceData(null)
                }
                style={{
                  padding: "9px 15px",
                  border:
                    "1px solid #d7dee8",
                  borderRadius: 9,
                  background: "#ffffff",
                  color: "#111827",
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                }}
              >
                <X size={16} />
                Close
              </button>
            </div>
          </div>

          {/* A4 LETTER */}

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              paddingBottom: 30,
            }}
          >
            <PerformanceSalesCounselor
              sc={performanceData}
            />
          </div>
        </div>
      )}

      {/* ======================================================
          TOAST
      ====================================================== */}

      {toast && (
        <div
          style={{
            position: "fixed",
            right: 20,
            top: 20,
            zIndex: 2000,
            minWidth: 300,
            maxWidth: 430,
            background:
              toast.type === "error"
                ? "#fff1f2"
                : "#effcf4",
            border:
              toast.type === "error"
                ? "1px solid #fecdd3"
                : "1px solid #bbf7d0",
            color:
              toast.type === "error"
                ? "#be123c"
                : "#166534",
            borderRadius: 10,
            padding: "13px 16px",
            boxShadow:
              "0 12px 30px rgba(15,23,42,0.12)",
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          {toast.message}
        </div>
      )}

      <style>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </>
  );
}

// ============================================================
// SMALL COMPONENTS
// ============================================================

function SummaryCard({ label, value }) {
  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #e8edf4",
        borderRadius: 12,
        padding: "16px 18px",
        boxShadow:
          "0 2px 6px rgba(15,23,42,0.03)",
      }}
    >
      <div
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: "#64748b",
          marginBottom: 7,
        }}
      >
        {label}
      </div>

      <div
        style={{
          fontSize: 21,
          fontWeight: 800,
          color: "#0f172a",
        }}
      >
        {value}
      </div>
    </div>
  );
}

const paginationButtonStyle = {
  width: 34,
  height: 34,
  border: "1px solid #dce3ec",
  borderRadius: 8,
  background: "#ffffff",
  cursor: "pointer",
  display: "grid",
  placeItems: "center",
  color: "#475569",
};