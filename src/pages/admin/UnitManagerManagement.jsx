import { useEffect, useMemo, useState } from "react";
import { supabaseEmployees } from "@/lib/supabaseEmployees";
import PerformanceUnitManager from "@/components/letter/PerformanceUnitManager";
import Toast from "@/components/Toast";

const UM_TABLE = "production_unit_manager";
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

export default function UnitManagerManagement() {
  const [unitManagers, setUnitManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [openMenuId, setOpenMenuId] = useState(null);
  const [menuPosition, setMenuPosition] = useState({
    top: 0,
    right: 0,
  });

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
  // LOAD UNIT MANAGERS
  // =========================================================
  useEffect(() => {
    fetchUnitManagers();
  }, []);

  useEffect(() => {
    if (!openMenuId) return;

    const closeMenu = () => {
      setOpenMenuId(null);
    };

    document.addEventListener("click", closeMenu);

    return () => {
      document.removeEventListener("click", closeMenu);
    };
  }, [openMenuId]);

  const fetchUnitManagers = async () => {
    setLoading(true);
    setErrorMsg("");

    try {
      const { data, error } = await supabaseEmployees
        .from(UM_TABLE)
        .select(`
          id_no,
          unit_manager,
          agent_count,
          fyp_production,
          spotcash,
          premium1,
          salescoordinator
        `)
        .order("unit_manager", { ascending: true });

      if (error) throw error;

      setUnitManagers(data || []);
    } catch (err) {
      console.error("Failed to load Unit Managers:", err);

      setErrorMsg(
        err.message || "Failed to load Unit Managers."
      );

      showToast(
        "Failed to load Unit Managers: " + err.message,
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

    if (!q) return unitManagers;

    return unitManagers.filter((um) => {
      return (
        um.unit_manager?.toLowerCase().includes(q) ||
        um.id_no?.toLowerCase().includes(q) ||
        um.salescoordinator?.toLowerCase().includes(q)
      );
    });
  }, [unitManagers, search]);

  // =========================================================
  // SUMMARY
  // =========================================================
  const totalUnitManagers = unitManagers.length;

  const totalProducingCounselors = unitManagers.reduce(
    (sum, um) => sum + Number(um.agent_count || 0),
    0
  );

  const totalFypProduction = unitManagers.reduce(
    (sum, um) => sum + Number(um.fyp_production || 0),
    0
  );

  // =========================================================
  // PAGINATION
  // =========================================================
  const totalPages = Math.max(
    1,
    Math.ceil(filtered.length / ITEMS_PER_PAGE)
  );

  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginated = filtered.slice(
    (safeCurrentPage - 1) * ITEMS_PER_PAGE,
    safeCurrentPage * ITEMS_PER_PAGE
  );

  // =========================================================
  // PERFORMANCE LETTER
  // =========================================================
  const openPerformance = (um) => {
    // No additional lookup is required.
    // production_unit_manager is already the source of truth.
    setPerformanceData({
      ...um,

      // These aliases keep the existing
      // PerformanceUnitManager component compatible.
      full_name: um.unit_manager,
      producing_counselors: um.agent_count,
      group_premium: um.fyp_production,
    });

    setOpenMenuId(null);
  };

  const handlePrintPerformance = () => {
    window.print();
  };

  return (
    <div>
      <style>{PRINT_CSS}</style>

      {/* =====================================================
          NORMAL PAGE
      ===================================================== */}
      <div className="no-print">
        {/* HEADER */}
        <div style={{ marginBottom: 28 }}>
          <h1
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: "#0b1a3b",
              margin: 0,
              fontFamily: "'Montserrat', sans-serif",
            }}
          >
            Unit Manager Management
          </h1>

          <p
            style={{
              fontSize: 13,
              color: "#64748b",
              margin: "4px 0 0",
            }}
          >
            View Unit Manager production records
          </p>
        </div>

        {/* =================================================
            SUMMARY CARDS
        ================================================= */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: 20,
            marginBottom: 28,
          }}
        >
          <SummaryCard
            label="Total Unit Managers"
            value={totalUnitManagers}
            color="#013F99"
          />

          <SummaryCard
            label="Producing Sales Counselors"
            value={totalProducingCounselors}
            color="#16a34a"
          />

          <SummaryCard
            label="Total FYP Production"
            value={formatPeso(totalFypProduction)}
            color="#b8860b"
            small
          />
        </div>

        {/* =================================================
            TABLE CARD
        ================================================= */}
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            border: "1px solid rgba(1,63,153,0.08)",
            overflow: "hidden",
          }}
        >
          {/* TOOLBAR */}
          <div
            style={{
              padding: "20px 24px",
              borderBottom: "1px solid rgba(1,63,153,0.08)",
              display: "flex",
              gap: 12,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            {/* SEARCH */}
            <div
              style={{
                position: "relative",
                flex: 1,
                minWidth: 240,
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
                  transform: "translateY(-50%)",
                }}
              >
                <circle cx="11" cy="11" r="8" />
                <line
                  x1="21"
                  y1="21"
                  x2="16.65"
                  y2="16.65"
                />
              </svg>

              <input
                placeholder="Search Unit Manager, ID, or Sales Coordinator..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "10px 16px 10px 36px",
                  border:
                    "1px solid rgba(1,63,153,0.12)",
                  borderRadius: 10,
                  fontSize: 13,
                  color: "#0b1a3b",
                  outline: "none",
                  fontFamily: "'Poppins', sans-serif",
                }}
              />
            </div>

            {/* REFRESH */}
            <button
              onClick={fetchUnitManagers}
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
                fontFamily: "'Poppins', sans-serif",
                display: "flex",
                alignItems: "center",
                gap: 7,
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <polyline points="23 4 23 10 17 10" />
                <polyline points="1 20 1 14 7 14" />
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
              </svg>

              {loading ? "Loading..." : "Refresh"}
            </button>
          </div>

          {/* =================================================
              TABLE
          ================================================= */}
          {loading ? (
            <div
              style={{
                padding: 50,
                textAlign: "center",
                color: "#94a3b8",
                fontSize: 13,
              }}
            >
              Loading Unit Managers...
            </div>
          ) : errorMsg ? (
            <div
              style={{
                padding: 50,
                textAlign: "center",
                color: "#dc2626",
                fontSize: 13,
              }}
            >
              {errorMsg}
            </div>
          ) : (
            <>
              <div style={{ overflowX: "auto" }}>
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
                        "ID No.",
                        "Unit Manager",
                        "Producing SC",
                        "FYP Production",
                        "Spot Cash",
                        "Premium",
                        "Sales Coordinator",
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
                            letterSpacing: 0.7,
                            borderBottom:
                              "1px solid rgba(1,63,153,0.08)",
                            whiteSpace: "nowrap",
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
                          colSpan={8}
                          style={{
                            padding: 50,
                            textAlign: "center",
                            color: "#94a3b8",
                          }}
                        >
                          No Unit Managers found.
                        </td>
                      </tr>
                    ) : (
                      paginated.map((um, index) => (
                        <tr
                          key={um.id_no}
                          style={{
                            borderBottom:
                              "1px solid rgba(1,63,153,0.05)",
                            background:
                              index % 2 === 0
                                ? "#fff"
                                : "#fafcff",
                          }}
                        >
                          <td
                            style={{
                              padding: "12px 16px",
                              fontWeight: 600,
                              color: "#013F99",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {um.id_no || "—"}
                          </td>

                          <td
                            style={{
                              padding: "12px 16px",
                              color: "#0b1a3b",
                              fontWeight: 600,
                              minWidth: 180,
                            }}
                          >
                            {um.unit_manager || "—"}
                          </td>

                          <td
                            style={{
                              padding: "12px 16px",
                            }}
                          >
                            <span
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                minWidth: 32,
                                padding: "4px 10px",
                                borderRadius: 20,
                                background:
                                  "rgba(1,63,153,0.08)",
                                color: "#013F99",
                                fontWeight: 700,
                              }}
                            >
                              {um.agent_count ?? 0}
                            </span>
                          </td>

                          <td
                            style={{
                              padding: "12px 16px",
                              color: "#16a34a",
                              fontWeight: 600,
                              whiteSpace: "nowrap",
                            }}
                          >
                            {formatPeso(
                              um.fyp_production
                            )}
                          </td>

                          <td
                            style={{
                              padding: "12px 16px",
                              color: "#64748b",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {formatPeso(um.spotcash)}
                          </td>

                          <td
                            style={{
                              padding: "12px 16px",
                              color: "#64748b",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {formatPeso(um.premium1)}
                          </td>

                          <td
                            style={{
                              padding: "12px 16px",
                              color: "#64748b",
                              minWidth: 180,
                            }}
                          >
                            {um.salescoordinator ||
                              "—"}
                          </td>

                          {/* ACTION */}
                          <td
                            style={{
                              padding: "12px 16px",
                            }}
                          >
                            <button
                              onClick={(e) => {
                                e.stopPropagation();

                                if (
                                  openMenuId === um.id_no
                                ) {
                                  setOpenMenuId(null);
                                  return;
                                }

                                const rect =
                                  e.currentTarget.getBoundingClientRect();

                                setMenuPosition({
                                  top: rect.bottom + 6,
                                  right:
                                    window.innerWidth -
                                    rect.right,
                                });

                                setOpenMenuId(
                                  um.id_no
                                );
                              }}
                              style={{
                                width: 32,
                                height: 32,
                                borderRadius: 8,
                                border:
                                  "1px solid rgba(1,63,153,0.15)",
                                background: "#fff",
                                color: "#013F99",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent:
                                  "center",
                              }}
                              title="Actions"
                            >
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                              >
                                <circle
                                  cx="12"
                                  cy="5"
                                  r="1.8"
                                />
                                <circle
                                  cx="12"
                                  cy="12"
                                  r="1.8"
                                />
                                <circle
                                  cx="12"
                                  cy="19"
                                  r="1.8"
                                />
                              </svg>
                            </button>

                            {openMenuId === um.id_no && (
                              <div
                                onClick={(e) =>
                                  e.stopPropagation()
                                }
                                style={{
                                  position: "fixed",
                                  top:
                                    menuPosition.top,
                                  right:
                                    menuPosition.right,
                                  background: "#fff",
                                  borderRadius: 10,
                                  border:
                                    "1px solid rgba(1,63,153,0.12)",
                                  boxShadow:
                                    "0 8px 24px rgba(0,0,0,0.12)",
                                  zIndex: 99999,
                                  minWidth: 190,
                                  overflow: "hidden",
                                }}
                              >
                                <MenuItem
                                  onClick={() =>
                                    openPerformance(
                                      um
                                    )
                                  }
                                  color="#0d9488"
                                >
                                  <svg
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                  >
                                    <path d="M3 3v18h18" />
                                    <path d="M18.7 8l-5.1 5.1-2.8-2.8L7 14" />
                                  </svg>

                                  Performance Letter
                                </MenuItem>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* =============================================
                  PAGINATION
              ============================================= */}
              {filtered.length > 0 && (
                <div
                  style={{
                    padding: "16px 24px",
                    borderTop:
                      "1px solid rgba(1,63,153,0.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent:
                      "space-between",
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
                    of {filtered.length} Unit
                    Managers
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: 6,
                    }}
                  >
                    <PaginationButton
                      disabled={
                        safeCurrentPage === 1
                      }
                      onClick={() =>
                        setCurrentPage((page) =>
                          Math.max(
                            1,
                            page - 1
                          )
                        )
                      }
                    >
                      ← Prev
                    </PaginationButton>

                    <div
                      style={{
                        padding: "7px 12px",
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#013F99",
                      }}
                    >
                      Page {safeCurrentPage} of{" "}
                      {totalPages}
                    </div>

                    <PaginationButton
                      disabled={
                        safeCurrentPage ===
                        totalPages
                      }
                      onClick={() =>
                        setCurrentPage((page) =>
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
          PERFORMANCE LETTER MODAL
      ===================================================== */}
      {performanceData && (
        <div
          className="performance-modal no-print"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100000,
            background: "rgba(15,23,42,0.75)",
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
            {/* MODAL TOOLBAR */}
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
                gap: 10,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#0b1a3b",
                  }}
                >
                  Unit Manager Performance
                  Letter
                </div>

                <div
                  style={{
                    fontSize: 12,
                    color: "#64748b",
                    marginTop: 2,
                  }}
                >
                  {performanceData.unit_manager}
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
                    color: "#475569",
                    cursor: "pointer",
                    fontWeight: 600,
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
              <PerformanceUnitManager
                sc={performanceData}
              />
            </div>
          </div>
        </div>
      )}

      {/* PRINT ONLY */}
      {performanceData && (
        <div className="performance-print-only">
          <PerformanceUnitManager
            sc={performanceData}
          />
        </div>
      )}

      {/* TOAST */}
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

// =========================================================
// SUMMARY CARD
// =========================================================
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
          fontSize: 12,
          color: "#64748b",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: 1,
        }}
      >
        {label}
      </div>

      <div
        style={{
          fontSize: small ? 23 : 32,
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

// =========================================================
// MENU ITEM
// =========================================================
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
        fontFamily: "'Poppins', sans-serif",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background =
          "#f8fafc";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background =
          "#fff";
      }}
    >
      {children}
    </button>
  );
}

// =========================================================
// PAGINATION BUTTON
// =========================================================
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
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      {children}
    </button>
  );
}

// =========================================================
// PRINT CSS
// =========================================================
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