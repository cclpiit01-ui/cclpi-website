import { useEffect, useMemo, useState } from "react";
import { supabaseEmployees } from "@/lib/supabaseEmployees";
import PerformanceAgency from "@/components/letter/PerformanceAgency";
import Toast from "@/components/Toast";

const AGENCY_TABLE = "production_agency";
const ITEMS_PER_PAGE = 10;

const formatPeso = (value) => {
  const number = Number(value ?? 0);

  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number.isFinite(number) ? number : 0);
};

export default function AgencyManagerManagement() {
  const [agencies, setAgencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [openMenuId, setOpenMenuId] = useState(null);
  const [menuPosition, setMenuPosition] = useState({
    top: 0,
    right: 0,
  });

  const [editingAgency, setEditingAgency] = useState(null);
  const [agencyManager, setAgencyManager] = useState("");
  const [saving, setSaving] = useState(false);

  const [performanceData, setPerformanceData] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (
    message,
    type = "success",
    duration = 4000
  ) => {
    setToast({
      message,
      type,
      duration,
    });
  };

  // =========================================================
  // LOAD AGENCIES
  // =========================================================
  useEffect(() => {
    fetchAgencies();
  }, []);

  useEffect(() => {
    if (!openMenuId) return;

    const closeMenu = () => setOpenMenuId(null);

    document.addEventListener("click", closeMenu);

    return () => {
      document.removeEventListener("click", closeMenu);
    };
  }, [openMenuId]);

  const fetchAgencies = async () => {
    setLoading(true);
    setErrorMsg("");

    try {
      const { data, error } = await supabaseEmployees
        .from(AGENCY_TABLE)
        .select(`
          agency_key,
          agency_name,
          agency_manager,
          id_no,
          unit_manager_count,
          agent_count,
          fyp_production,
          spotcash,
          premium1,
          salescoordinator
        `)
        .order("agency_name", { ascending: true });

      if (error) throw error;

      setAgencies(data || []);
    } catch (err) {
      console.error("Failed to load agencies:", err);

      setErrorMsg(
        err.message || "Failed to load agencies."
      );

      showToast(
        "Failed to load agencies: " + err.message,
        "error",
        5000
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // SEARCH
  // =========================================================
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    if (!q) return agencies;

    return agencies.filter((agency) => {
      return (
        agency.agency_name?.toLowerCase().includes(q) ||
        agency.agency_manager?.toLowerCase().includes(q) ||
        agency.salescoordinator?.toLowerCase().includes(q) ||
        agency.id_no?.toLowerCase().includes(q)
      );
    });
  }, [agencies, search]);

  // =========================================================
  // SUMMARY
  // =========================================================
  const totalAgencies = agencies.length;

  const withAgencyManager = agencies.filter(
    (agency) => agency.agency_manager?.trim()
  ).length;

  const withoutAgencyManager =
    totalAgencies - withAgencyManager;

  const totalFypProduction = agencies.reduce(
    (sum, agency) =>
      sum + Number(agency.fyp_production || 0),
    0
  );

  // =========================================================
  // PAGINATION
  // =========================================================
  const totalPages = Math.max(
    1,
    Math.ceil(filtered.length / ITEMS_PER_PAGE)
  );

  const safeCurrentPage = Math.min(
    currentPage,
    totalPages
  );

  const paginated = filtered.slice(
    (safeCurrentPage - 1) * ITEMS_PER_PAGE,
    safeCurrentPage * ITEMS_PER_PAGE
  );

  // =========================================================
  // EDIT AGENCY MANAGER
  // =========================================================
  const openEdit = (agency) => {
    setEditingAgency(agency);
    setAgencyManager(agency.agency_manager || "");
    setOpenMenuId(null);
  };

  const closeEdit = () => {
    if (saving) return;

    setEditingAgency(null);
    setAgencyManager("");
  };

  const handleSaveAgencyManager = async (e) => {
    e.preventDefault();

    if (!editingAgency) return;

    setSaving(true);

    try {
      const cleanManager =
        agencyManager.trim() || null;

      const { error } = await supabaseEmployees
        .from(AGENCY_TABLE)
        .update({
          agency_manager: cleanManager,
        })
        .eq(
          "agency_key",
          editingAgency.agency_key
        );

      if (error) throw error;

      // Update only the affected row locally.
      setAgencies((prev) =>
        prev.map((agency) =>
          agency.agency_key ===
          editingAgency.agency_key
            ? {
                ...agency,
                agency_manager: cleanManager,
              }
            : agency
        )
      );

      setEditingAgency(null);
      setAgencyManager("");

      showToast(
        "Agency Manager updated successfully.",
        "success"
      );
    } catch (err) {
      console.error(
        "Failed to update Agency Manager:",
        err
      );

      showToast(
        "Failed to update Agency Manager: " +
          err.message,
        "error",
        5000
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // PERFORMANCE LETTER
  // =========================================================
  const openPerformance = (agency) => {
    setPerformanceData({
      ...agency,

      // Aliases expected by PerformanceAgency.jsx
      full_name:
        agency.agency_manager ||
        agency.agency_name,

      active_counselors:
        agency.agent_count,

      producing_unit_managers:
        agency.unit_manager_count,

      first_year_premium:
        agency.fyp_production,
    });

    setOpenMenuId(null);
  };

  const handlePrintPerformance = () => {
    window.print();
  };

  return (
    <div>
      <style>{PRINT_CSS}</style>

      <div className="no-print">
        {/* HEADER */}
        <div style={{ marginBottom: 28 }}>
          <h1
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: "#0b1a3b",
              margin: 0,
              fontFamily:
                "'Montserrat', sans-serif",
            }}
          >
            Agency Management
          </h1>

          <p
            style={{
              fontSize: 13,
              color: "#64748b",
              margin: "4px 0 0",
            }}
          >
            Manage agency production and Agency
            Manager information
          </p>
        </div>

        {/* SUMMARY CARDS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(4, minmax(0, 1fr))",
            gap: 20,
            marginBottom: 28,
          }}
        >
          <SummaryCard
            label="Total Agencies"
            value={totalAgencies}
            color="#013F99"
          />

          <SummaryCard
            label="With Agency Manager"
            value={withAgencyManager}
            color="#16a34a"
          />

          <SummaryCard
            label="Without Agency Manager"
            value={withoutAgencyManager}
            color="#dc2626"
          />

          <SummaryCard
            label="Total FYP"
            value={formatPeso(
              totalFypProduction
            )}
            color="#b8860b"
            small
          />
        </div>

        {/* TABLE CARD */}
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            border:
              "1px solid rgba(1,63,153,0.08)",
            overflow: "hidden",
          }}
        >
          {/* TOOLBAR */}
          <div
            style={{
              padding: "20px 24px",
              borderBottom:
                "1px solid rgba(1,63,153,0.08)",
              display: "flex",
              gap: 12,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                position: "relative",
                flex: 1,
                minWidth: 260,
              }}
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#94a3b8"
                strokeWidth="2"
                strokeLinecap="round"
                style={{
                  position: "absolute",
                  left: 12,
                  top: "50%",
                  transform:
                    "translateY(-50%)",
                }}
              >
                <circle
                  cx="11"
                  cy="11"
                  r="8"
                />
                <line
                  x1="21"
                  y1="21"
                  x2="16.65"
                  y2="16.65"
                />
              </svg>

              <input
                placeholder="Search agency, manager, ID, or coordinator..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding:
                    "10px 16px 10px 36px",
                  border:
                    "1px solid rgba(1,63,153,0.12)",
                  borderRadius: 10,
                  fontSize: 13,
                  color: "#0b1a3b",
                  outline: "none",
                  fontFamily:
                    "'Poppins', sans-serif",
                }}
              />
            </div>

            <button
              onClick={fetchAgencies}
              disabled={loading}
              style={{
                padding: "9px 18px",
                borderRadius: 10,
                border: "none",
                background:
                  "linear-gradient(90deg, #013F99, #4CB1E9)",
                color: "#fff",
                fontSize: 12,
                fontWeight: 600,
                cursor: loading
                  ? "not-allowed"
                  : "pointer",
                opacity: loading ? 0.7 : 1,
                fontFamily:
                  "'Poppins', sans-serif",
              }}
            >
              {loading
                ? "Loading..."
                : "Refresh"}
            </button>
          </div>

          {/* TABLE */}
          {loading ? (
            <div
              style={{
                padding: 50,
                textAlign: "center",
                color: "#94a3b8",
              }}
            >
              Loading agencies...
            </div>
          ) : errorMsg ? (
            <div
              style={{
                padding: 50,
                textAlign: "center",
                color: "#dc2626",
              }}
            >
              {errorMsg}
            </div>
          ) : (
            <>
              <div
                style={{
                  overflowX: "auto",
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
                        background: "#f6fbfe",
                      }}
                    >
                      {[
                        "Agency",
                        "Agency Manager",
                        "Unit Managers",
                        "Counselors",
                        "FYP Production",
                        "Sales Coordinator",
                        "Actions",
                      ].map((heading) => (
                        <th
                          key={heading}
                          style={{
                            padding:
                              "12px 16px",
                            textAlign: "left",
                            fontSize: 11,
                            fontWeight: 700,
                            color: "#64748b",
                            textTransform:
                              "uppercase",
                            letterSpacing: 0.7,
                            borderBottom:
                              "1px solid rgba(1,63,153,0.08)",
                            whiteSpace:
                              "nowrap",
                          }}
                        >
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {paginated.length === 0 ? (
                      <tr>
                        <td
                          colSpan={7}
                          style={{
                            padding: 50,
                            textAlign:
                              "center",
                            color:
                              "#94a3b8",
                          }}
                        >
                          No agencies found.
                        </td>
                      </tr>
                    ) : (
                      paginated.map(
                        (agency, index) => (
                          <tr
                            key={
                              agency.agency_key
                            }
                            style={{
                              borderBottom:
                                "1px solid rgba(1,63,153,0.05)",
                              background:
                                index % 2 === 0
                                  ? "#fff"
                                  : "#fafcff",
                            }}
                          >
                            {/* AGENCY */}
                            <td
                              style={{
                                padding:
                                  "12px 16px",
                                color:
                                  "#0b1a3b",
                                fontWeight: 600,
                                minWidth: 250,
                              }}
                            >
                              {
                                agency.agency_name
                              }
                            </td>

                            {/* AGENCY MANAGER */}
                            <td
                              style={{
                                padding:
                                  "12px 16px",
                                minWidth: 180,
                              }}
                            >
                              {agency.agency_manager ? (
                                <span
                                  style={{
                                    color:
                                      "#0b1a3b",
                                    fontWeight: 600,
                                  }}
                                >
                                  {
                                    agency.agency_manager
                                  }
                                </span>
                              ) : (
                                <span
                                  style={{
                                    color:
                                      "#dc2626",
                                    background:
                                      "#fef2f2",
                                    padding:
                                      "4px 9px",
                                    borderRadius:
                                      20,
                                    fontSize: 11,
                                    fontWeight: 600,
                                  }}
                                >
                                  Not Assigned
                                </span>
                              )}
                            </td>

                            {/* UM COUNT */}
                            <td
                              style={{
                                padding:
                                  "12px 16px",
                              }}
                            >
                              {
                                agency.unit_manager_count
                              }
                            </td>

                            {/* AGENT COUNT */}
                            <td
                              style={{
                                padding:
                                  "12px 16px",
                              }}
                            >
                              {
                                agency.agent_count
                              }
                            </td>

                            {/* FYP */}
                            <td
                              style={{
                                padding:
                                  "12px 16px",
                                color:
                                  "#16a34a",
                                fontWeight: 600,
                                whiteSpace:
                                  "nowrap",
                              }}
                            >
                              {formatPeso(
                                agency.fyp_production
                              )}
                            </td>

                            {/* COORDINATOR */}
                            <td
                              style={{
                                padding:
                                  "12px 16px",
                                color:
                                  "#64748b",
                                minWidth: 180,
                              }}
                            >
                              {agency.salescoordinator ||
                                "—"}
                            </td>

                            {/* ACTION */}
                            <td
                              style={{
                                padding:
                                  "12px 16px",
                              }}
                            >
                              <button
                                onClick={(
                                  e
                                ) => {
                                  e.stopPropagation();

                                  if (
                                    openMenuId ===
                                    agency.agency_key
                                  ) {
                                    setOpenMenuId(
                                      null
                                    );
                                    return;
                                  }

                                  const rect =
                                    e.currentTarget.getBoundingClientRect();

                                  setMenuPosition(
                                    {
                                      top:
                                        rect.bottom +
                                        6,
                                      right:
                                        window.innerWidth -
                                        rect.right,
                                    }
                                  );

                                  setOpenMenuId(
                                    agency.agency_key
                                  );
                                }}
                                style={{
                                  width: 32,
                                  height: 32,
                                  borderRadius: 8,
                                  border:
                                    "1px solid rgba(1,63,153,0.15)",
                                  background:
                                    "#fff",
                                  color:
                                    "#013F99",
                                  cursor:
                                    "pointer",
                                }}
                              >
                                ⋮
                              </button>

                              {openMenuId ===
                                agency.agency_key && (
                                <div
                                  onClick={(
                                    e
                                  ) =>
                                    e.stopPropagation()
                                  }
                                  style={{
                                    position:
                                      "fixed",
                                    top:
                                      menuPosition.top,
                                    right:
                                      menuPosition.right,
                                    background:
                                      "#fff",
                                    borderRadius:
                                      10,
                                    border:
                                      "1px solid rgba(1,63,153,0.12)",
                                    boxShadow:
                                      "0 8px 24px rgba(0,0,0,0.12)",
                                    zIndex:
                                      99999,
                                    minWidth:
                                      190,
                                    overflow:
                                      "hidden",
                                  }}
                                >
                                  <MenuItem
                                    onClick={() =>
                                      openEdit(
                                        agency
                                      )
                                    }
                                    color="#013F99"
                                  >
                                    ✎ Edit Agency
                                    Manager
                                  </MenuItem>

                                  <MenuItem
                                    onClick={() =>
                                      openPerformance(
                                        agency
                                      )
                                    }
                                    color="#0d9488"
                                  >
                                    Performance
                                    Letter
                                  </MenuItem>
                                </div>
                              )}
                            </td>
                          </tr>
                        )
                      )
                    )}
                  </tbody>
                </table>
              </div>

              {/* PAGINATION */}
              {filtered.length > 0 && (
                <div
                  style={{
                    padding: "16px 24px",
                    borderTop:
                      "1px solid rgba(1,63,153,0.08)",
                    display: "flex",
                    justifyContent:
                      "space-between",
                    alignItems: "center",
                    gap: 16,
                    flexWrap: "wrap",
                  }}
                >
                  <div
                    style={{
                      fontSize: 12,
                      color: "#64748b",
                    }}
                  >
                    Showing{" "}
                    {(safeCurrentPage - 1) *
                      ITEMS_PER_PAGE +
                      1}
                    –
                    {Math.min(
                      safeCurrentPage *
                        ITEMS_PER_PAGE,
                      filtered.length
                    )}{" "}
                    of {filtered.length} agencies
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: 6,
                      alignItems: "center",
                    }}
                  >
                    <PaginationButton
                      disabled={
                        safeCurrentPage === 1
                      }
                      onClick={() =>
                        setCurrentPage(
                          (page) =>
                            Math.max(
                              1,
                              page - 1
                            )
                        )
                      }
                    >
                      ← Prev
                    </PaginationButton>

                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#013F99",
                        padding:
                          "7px 10px",
                      }}
                    >
                      Page {safeCurrentPage} of{" "}
                      {totalPages}
                    </span>

                    <PaginationButton
                      disabled={
                        safeCurrentPage ===
                        totalPages
                      }
                      onClick={() =>
                        setCurrentPage(
                          (page) =>
                            Math.min(
                              totalPages,
                              page + 1
                            )
                        )
                      }
                    >
                      Next →
                    </PaginationButton>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* =====================================================
          EDIT MODAL
      ===================================================== */}
      {editingAgency && (
        <div
          className="no-print"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100000,
            background:
              "rgba(15,23,42,0.65)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
          onClick={closeEdit}
        >
          <form
            onSubmit={
              handleSaveAgencyManager
            }
            onClick={(e) =>
              e.stopPropagation()
            }
            style={{
              width: "100%",
              maxWidth: 500,
              background: "#fff",
              borderRadius: 16,
              boxShadow:
                "0 20px 50px rgba(0,0,0,0.25)",
              overflow: "hidden",
            }}
          >
            {/* MODAL HEADER */}
            <div
              style={{
                padding: "20px 24px",
                borderBottom:
                  "1px solid #e2e8f0",
              }}
            >
              <h2
                style={{
                  margin: 0,
                  fontSize: 18,
                  color: "#0b1a3b",
                }}
              >
                Edit Agency Manager
              </h2>

              <p
                style={{
                  margin: "5px 0 0",
                  fontSize: 12,
                  color: "#64748b",
                }}
              >
                {editingAgency.agency_name}
              </p>
            </div>

            {/* BODY */}
            <div
              style={{
                padding: 24,
              }}
            >
              <label
                style={{
                  display: "block",
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#334155",
                  marginBottom: 7,
                }}
              >
                Agency Manager
              </label>

              <input
                autoFocus
                type="text"
                value={agencyManager}
                onChange={(e) =>
                  setAgencyManager(
                    e.target.value
                  )
                }
                placeholder="Enter Agency Manager name"
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "11px 13px",
                  border:
                    "1px solid #cbd5e1",
                  borderRadius: 9,
                  outline: "none",
                  fontSize: 13,
                  color: "#0b1a3b",
                }}
              />

              <div
                style={{
                  marginTop: 9,
                  fontSize: 11,
                  color: "#94a3b8",
                  lineHeight: 1.5,
                }}
              >
                This value is manually maintained
                and is separate from the production
                API data.
              </div>
            </div>

            {/* FOOTER */}
            <div
              style={{
                padding: "16px 24px",
                borderTop:
                  "1px solid #e2e8f0",
                display: "flex",
                justifyContent: "flex-end",
                gap: 10,
              }}
            >
              <button
                type="button"
                disabled={saving}
                onClick={closeEdit}
                style={{
                  padding: "9px 16px",
                  borderRadius: 8,
                  border:
                    "1px solid #cbd5e1",
                  background: "#fff",
                  color: "#475569",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                style={{
                  padding: "9px 18px",
                  borderRadius: 8,
                  border: "none",
                  background:
                    "linear-gradient(90deg, #013F99, #4CB1E9)",
                  color: "#fff",
                  fontWeight: 600,
                  cursor: saving
                    ? "not-allowed"
                    : "pointer",
                  opacity: saving ? 0.7 : 1,
                }}
              >
                {saving
                  ? "Saving..."
                  : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* =====================================================
          PERFORMANCE LETTER
      ===================================================== */}
      {performanceData && (
        <div
          className="performance-modal no-print"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100000,
            background:
              "rgba(15,23,42,0.75)",
            overflowY: "auto",
            padding: "30px 20px",
          }}
        >
          <div
            style={{
              maxWidth: 900,
              margin: "0 auto",
            }}
          >
            <div
              style={{
                background: "#fff",
                borderRadius: 12,
                padding: "12px 16px",
                marginBottom: 14,
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <strong
                  style={{
                    color: "#0b1a3b",
                  }}
                >
                  Agency Performance Letter
                </strong>

                <div
                  style={{
                    fontSize: 12,
                    color: "#64748b",
                    marginTop: 3,
                  }}
                >
                  {
                    performanceData.agency_name
                  }
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: 8,
                }}
              >
                <button
                  onClick={
                    handlePrintPerformance
                  }
                  style={{
                    padding: "9px 16px",
                    border: "none",
                    borderRadius: 8,
                    background: "#013F99",
                    color: "#fff",
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  Print
                </button>

                <button
                  onClick={() =>
                    setPerformanceData(null)
                  }
                  style={{
                    padding: "9px 16px",
                    border:
                      "1px solid #e2e8f0",
                    borderRadius: 8,
                    background: "#fff",
                    cursor: "pointer",
                  }}
                >
                  Close
                </button>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <PerformanceAgency
                sc={performanceData}
              />
            </div>
          </div>
        </div>
      )}

      {performanceData && (
        <div className="performance-print-only">
          <PerformanceAgency
            sc={performanceData}
          />
        </div>
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

function SummaryCard({
  label,
  value,
  color,
  small = false,
}) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 16,
        padding: 24,
        border:
          "1px solid rgba(1,63,153,0.08)",
        borderLeft: `4px solid ${color}`,
      }}
    >
      <div
        style={{
          fontSize: 11,
          color: "#64748b",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: 0.8,
        }}
      >
        {label}
      </div>

      <div
        style={{
          fontSize: small ? 21 : 32,
          fontWeight: 700,
          color,
          marginTop: 8,
          overflowWrap: "anywhere",
        }}
      >
        {value}
      </div>
    </div>
  );
}

function MenuItem({
  children,
  onClick,
  color = "#013F99",
}) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        border: "none",
        background: "#fff",
        padding: "11px 14px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: 9,
        fontSize: 12,
        fontWeight: 600,
        color,
        textAlign: "left",
      }}
    >
      {children}
    </button>
  );
}

function PaginationButton({
  children,
  disabled,
  onClick,
}) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      style={{
        padding: "7px 14px",
        borderRadius: 8,
        border:
          "1px solid rgba(1,63,153,0.12)",
        background: disabled
          ? "#f6fbfe"
          : "#fff",
        color: disabled
          ? "#94a3b8"
          : "#013F99",
        fontSize: 12,
        fontWeight: 600,
        cursor: disabled
          ? "not-allowed"
          : "pointer",
      }}
    >
      {children}
    </button>
  );
}

const PRINT_CSS = `
.performance-print-only {
  display: none;
}

@media print {
  body * {
    visibility: hidden !important;
  }

  .performance-print-only,
  .performance-print-only * {
    visibility: visible !important;
  }

  .performance-print-only {
    display: block !important;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
  }

  .performance-print-only .print-area {
    box-shadow: none !important;
    margin: 0 !important;
  }

  @page {
    size: A4;
    margin: 0;
  }
}
`;