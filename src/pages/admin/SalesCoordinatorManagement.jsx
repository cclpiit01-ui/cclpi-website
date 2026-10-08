import { useEffect, useMemo, useState } from "react";
import {
  Search,
  RefreshCw,
  MoreVertical,
  Pencil,
  X,
  Save,
  Users,
} from "lucide-react";

import { supabaseEmployees } from "@/lib/supabaseEmployees";

const TABLE = "sales_coordinators";

const normalizeStatus = (value) =>
  String(value || "").trim().toLowerCase() === "inactive"
    ? "Inactive"
    : "Active";

export default function SalesCoordinatorManagement() {
  const [coordinators, setCoordinators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [openMenuId, setOpenMenuId] = useState(null);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    status: "Active",
    transfer_to_coordinator_id: "",
  });

  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });

    window.setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const loadCoordinators = async (showRefresh = false) => {
    if (showRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const { data, error } = await supabaseEmployees
        .from(TABLE)
        .select(
          `
            id,
            full_name,
            email,
            status,
            transfer_to_coordinator_id,
            created_at,
            updated_at
          `
        )
        .order("full_name", { ascending: true });

      if (error) throw error;

      setCoordinators(data || []);
    } catch (err) {
      console.error(err);
      showToast(
        "Failed to load Sales Coordinators: " + err.message,
        "error"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadCoordinators();
  }, []);

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return coordinators.filter((row) => {
      const matchesSearch =
        !keyword ||
        String(row.full_name || "")
          .toLowerCase()
          .includes(keyword) ||
        String(row.email || "")
          .toLowerCase()
          .includes(keyword);

      const rowStatus = normalizeStatus(row.status);

      const matchesStatus =
        statusFilter === "All" ||
        rowStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [coordinators, search, statusFilter]);

  const activeCoordinators = useMemo(() => {
    return coordinators.filter(
      (row) =>
        normalizeStatus(row.status) === "Active" &&
        row.id !== editing?.id
    );
  }, [coordinators, editing]);

  const getCoordinatorName = (id) => {
    if (!id) return "—";

    return (
      coordinators.find(
        (row) => String(row.id) === String(id)
      )?.full_name || "—"
    );
  };

  const openEdit = (row) => {
    setEditing(row);
    setOpenMenuId(null);

    setForm({
      full_name: row.full_name || "",
      email: row.email || "",
      status: normalizeStatus(row.status),
      transfer_to_coordinator_id:
        row.transfer_to_coordinator_id || "",
    });
  };

  const closeEdit = () => {
    if (saving) return;
    setEditing(null);
  };

  const handleStatusChange = (status) => {
    setForm((prev) => ({
      ...prev,
      status,
      transfer_to_coordinator_id:
        status === "Active"
          ? ""
          : prev.transfer_to_coordinator_id,
    }));
  };

  const handleSave = async () => {
    if (!editing) return;

    if (!form.full_name.trim()) {
      showToast("Full name is required.", "error");
      return;
    }

    if (
      form.status === "Inactive" &&
      form.transfer_to_coordinator_id &&
      String(form.transfer_to_coordinator_id) ===
        String(editing.id)
    ) {
      showToast(
        "A coordinator cannot be transferred to themselves.",
        "error"
      );
      return;
    }

    setSaving(true);

    try {
      const payload = {
        full_name: form.full_name.trim(),
        email: form.email.trim() || null,
        status: form.status,
        transfer_to_coordinator_id:
          form.status === "Inactive" &&
          form.transfer_to_coordinator_id
            ? Number(form.transfer_to_coordinator_id)
            : null,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabaseEmployees
        .from(TABLE)
        .update(payload)
        .eq("id", editing.id)
        .select()
        .single();

      if (error) throw error;

      setCoordinators((prev) =>
        prev.map((row) =>
          row.id === editing.id ? data : row
        )
      );

      setEditing(null);

      showToast(
        "Sales Coordinator updated successfully."
      );
    } catch (err) {
      console.error(err);

      showToast(
        "Failed to update Sales Coordinator: " +
          err.message,
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      style={{
        padding: 24,
        fontFamily: "Arial, sans-serif",
        color: "#172033",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 20,
          marginBottom: 22,
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              color: "#013F99",
              fontSize: 25,
            }}
          >
            Sales Coordinator Management
          </h1>

          <p
            style={{
              margin: "6px 0 0",
              color: "#64748b",
              fontSize: 14,
            }}
          >
            Manage coordinator emails, status, and
            reassignment.
          </p>
        </div>

        <button
          type="button"
          onClick={() => loadCoordinators(true)}
          disabled={refreshing}
          style={{
            border: "none",
            borderRadius: 9,
            padding: "10px 15px",
            background:
              "linear-gradient(135deg, #013F99, #4CB1E9)",
            color: "#fff",
            fontWeight: 700,
            cursor: refreshing
              ? "not-allowed"
              : "pointer",
            display: "flex",
            alignItems: "center",
            gap: 7,
          }}
        >
          <RefreshCw
            size={15}
            className={refreshing ? "spin" : ""}
          />

          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* SUMMARY */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(190px, 1fr))",
          gap: 14,
          marginBottom: 18,
        }}
      >
        <SummaryCard
          label="Total Coordinators"
          value={coordinators.length}
        />

        <SummaryCard
          label="Active"
          value={
            coordinators.filter(
              (row) =>
                normalizeStatus(row.status) === "Active"
            ).length
          }
        />

        <SummaryCard
          label="Inactive"
          value={
            coordinators.filter(
              (row) =>
                normalizeStatus(row.status) === "Inactive"
            ).length
          }
        />

        <SummaryCard
          label="Without Email"
          value={
            coordinators.filter(
              (row) => !String(row.email || "").trim()
            ).length
          }
        />
      </div>

      {/* TABLE CARD */}
      <div
        style={{
          background: "#fff",
          border: "1px solid #e5edf5",
          borderRadius: 14,
          overflow: "visible",
          boxShadow:
            "0 4px 18px rgba(15, 23, 42, 0.05)",
        }}
      >
        {/* FILTERS */}
        <div
          style={{
            padding: 16,
            borderBottom: "1px solid #e8eef5",
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              position: "relative",
              flex: "1 1 300px",
            }}
          >
            <Search
              size={16}
              style={{
                position: "absolute",
                left: 13,
                top: "50%",
                transform: "translateY(-50%)",
                color: "#94a3b8",
              }}
            />

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search name or email..."
              style={{
                width: "100%",
                height: 40,
                padding: "0 14px 0 39px",
                border: "1px solid #dbe4ee",
                borderRadius: 9,
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
            style={{
              height: 40,
              minWidth: 150,
              padding: "0 12px",
              border: "1px solid #dbe4ee",
              borderRadius: 9,
              background: "#fff",
              color: "#334155",
            }}
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">
              Inactive
            </option>
          </select>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: 13,
            }}
          >
            <thead>
              <tr style={{ background: "#f6fbfe" }}>
                {[
                  "Name",
                  "Email",
                  "Status",
                  "Transfer To",
                  "Actions",
                ].map((header) => (
                  <th
                    key={header}
                    style={{
                      padding: "12px 16px",
                      textAlign: "left",
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#64748b",
                      textTransform: "uppercase",
                      letterSpacing: 0.7,
                      borderBottom:
                        "1px solid #e5edf5",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={5}
                    style={{
                      padding: 40,
                      textAlign: "center",
                      color: "#94a3b8",
                    }}
                  >
                    Loading Sales Coordinators...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    style={{
                      padding: 40,
                      textAlign: "center",
                      color: "#94a3b8",
                    }}
                  >
                    No Sales Coordinators found.
                  </td>
                </tr>
              ) : (
                filtered.map((row) => {
                  const status =
                    normalizeStatus(row.status);

                  return (
                    <tr
                      key={row.id}
                      style={{
                        borderBottom:
                          "1px solid #edf2f7",
                      }}
                    >
                      <td
                        style={{
                          padding: "13px 16px",
                          fontWeight: 600,
                          minWidth: 220,
                        }}
                      >
                        {row.full_name}
                      </td>

                      <td
                        style={{
                          padding: "13px 16px",
                          color: row.email
                            ? "#475569"
                            : "#94a3b8",
                          minWidth: 220,
                        }}
                      >
                        {row.email || "No email"}
                      </td>

                      <td
                        style={{
                          padding: "13px 16px",
                        }}
                      >
                        <StatusBadge
                          status={status}
                        />
                      </td>

                      <td
                        style={{
                          padding: "13px 16px",
                          color: "#475569",
                          minWidth: 210,
                        }}
                      >
                        {row.transfer_to_coordinator_id
                          ? getCoordinatorName(
                              row.transfer_to_coordinator_id
                            )
                          : "—"}
                      </td>

                      <td
                        style={{
                          padding: "13px 16px",
                          position: "relative",
                        }}
                      >
                        <button
                          type="button"
                          onClick={() =>
                            setOpenMenuId(
                              openMenuId === row.id
                                ? null
                                : row.id
                            )
                          }
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: 8,
                            border:
                              "1px solid #d6e1ef",
                            background: "#fff",
                            color: "#0057a8",
                            cursor: "pointer",
                            fontSize: 20,
                            lineHeight: 1,
                          }}
                        >
                          ⋮
                        </button>

                        {openMenuId === row.id && (
                          <div
                            style={{
                              position:
                                "absolute",
                              right: 16,
                              top: 48,
                              zIndex: 100,
                              width: 150,
                              padding: 5,
                              background: "#fff",
                              border:
                                "1px solid #dbe4ee",
                              borderRadius: 8,
                              boxShadow:
                                "0 8px 24px rgba(15,23,42,.12)",
                            }}
                          >
                            <button
                              type="button"
                              onClick={() =>
                                openEdit(row)
                              }
                              style={{
                                width: "100%",
                                padding:
                                  "9px 10px",
                                border: "none",
                                borderRadius: 6,
                                background:
                                  "transparent",
                                cursor:
                                  "pointer",
                                display: "flex",
                                alignItems:
                                  "center",
                                gap: 8,
                                color: "#013F99",
                                fontWeight: 600,
                              }}
                            >
                              <Pencil size={14} />
                              Edit
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* EDIT MODAL */}
      {editing && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            background: "rgba(15,23,42,.55)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 520,
              background: "#fff",
              borderRadius: 15,
              boxShadow:
                "0 25px 60px rgba(15,23,42,.25)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "18px 20px",
                borderBottom:
                  "1px solid #e8eef5",
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    color: "#013F99",
                  }}
                >
                  Edit Sales Coordinator
                </div>

                <div
                  style={{
                    marginTop: 3,
                    fontSize: 12,
                    color: "#64748b",
                  }}
                >
                  Update email, status and
                  reassignment.
                </div>
              </div>

              <button
                type="button"
                onClick={closeEdit}
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  color: "#64748b",
                }}
              >
                <X size={20} />
              </button>
            </div>

            <div
              style={{
                padding: 20,
                display: "grid",
                gap: 16,
              }}
            >
              <Field label="Full Name">
                <input
                  value={form.full_name}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      full_name:
                        e.target.value,
                    }))
                  }
                  style={INPUT_STYLE}
                />
              </Field>

              <Field label="Email Address">
                <input
                  type="email"
                  value={form.email}
                  placeholder="coordinator@cclpi.com.ph"
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  style={INPUT_STYLE}
                />
              </Field>

              <Field label="Status">
                <select
                  value={form.status}
                  onChange={(e) =>
                    handleStatusChange(
                      e.target.value
                    )
                  }
                  style={INPUT_STYLE}
                >
                  <option value="Active">
                    Active
                  </option>
                  <option value="Inactive">
                    Inactive
                  </option>
                </select>
              </Field>

              {form.status === "Inactive" && (
                <Field label="Transfer To">
                  <select
                    value={
                      form.transfer_to_coordinator_id
                    }
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        transfer_to_coordinator_id:
                          e.target.value,
                      }))
                    }
                    style={INPUT_STYLE}
                  >
                    <option value="">
                      No transfer
                    </option>

                    {activeCoordinators.map(
                      (coordinator) => (
                        <option
                          key={coordinator.id}
                          value={
                            coordinator.id
                          }
                        >
                          {
                            coordinator.full_name
                          }
                        </option>
                      )
                    )}
                  </select>

                  <div
                    style={{
                      marginTop: 6,
                      color: "#64748b",
                      fontSize: 11,
                      lineHeight: 1.4,
                    }}
                  >
                    Future emails assigned to
                    this inactive coordinator can
                    be redirected to the selected
                    active coordinator.
                  </div>
                </Field>
              )}
            </div>

            <div
              style={{
                padding: "15px 20px",
                borderTop:
                  "1px solid #e8eef5",
                display: "flex",
                justifyContent: "flex-end",
                gap: 10,
              }}
            >
              <button
                type="button"
                onClick={closeEdit}
                disabled={saving}
                style={{
                  padding: "10px 16px",
                  border:
                    "1px solid #dbe4ee",
                  borderRadius: 8,
                  background: "#fff",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                style={{
                  padding: "10px 17px",
                  border: "none",
                  borderRadius: 8,
                  background: "#013F99",
                  color: "#fff",
                  cursor: saving
                    ? "not-allowed"
                    : "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  fontWeight: 700,
                }}
              >
                <Save size={15} />

                {saving
                  ? "Saving..."
                  : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast && (
        <div
          style={{
            position: "fixed",
            right: 24,
            top: 24,
            zIndex: 2000,
            padding: "12px 16px",
            borderRadius: 9,
            background:
              toast.type === "error"
                ? "#b91c1c"
                : "#047857",
            color: "#fff",
            fontSize: 13,
            fontWeight: 600,
            boxShadow:
              "0 10px 25px rgba(15,23,42,.18)",
          }}
        >
          {toast.message}
        </div>
      )}

      <style>{`
        .spin {
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}

const INPUT_STYLE = {
  width: "100%",
  height: 42,
  padding: "0 12px",
  border: "1px solid #dbe4ee",
  borderRadius: 8,
  outline: "none",
  background: "#fff",
  color: "#172033",
  boxSizing: "border-box",
};

function Field({ label, children }) {
  return (
    <label>
      <div
        style={{
          marginBottom: 6,
          fontSize: 12,
          fontWeight: 700,
          color: "#475569",
        }}
      >
        {label}
      </div>

      {children}
    </label>
  );
}

function StatusBadge({ status }) {
  const active = status === "Active";

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "5px 9px",
        borderRadius: 999,
        fontSize: 11,
        fontWeight: 700,
        background: active
          ? "#ecfdf5"
          : "#f1f5f9",
        color: active ? "#047857" : "#64748b",
      }}
    >
      {status}
    </span>
  );
}

function SummaryCard({ label, value }) {
  return (
    <div
      style={{
        padding: "15px 17px",
        background: "#fff",
        border: "1px solid #e5edf5",
        borderRadius: 12,
      }}
    >
      <div
        style={{
          fontSize: 11,
          color: "#64748b",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: 0.6,
        }}
      >
        {label}
      </div>

      <div
        style={{
          marginTop: 6,
          fontSize: 23,
          fontWeight: 700,
          color: "#013F99",
        }}
      >
        {value}
      </div>
    </div>
  );
}