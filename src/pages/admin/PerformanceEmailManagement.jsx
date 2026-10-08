import { useEffect, useMemo, useState } from "react";
import {
  RefreshCw,
  Mail,
  Eye,
  Building2,
  Users,
  UserRound,
  Send,
} from "lucide-react";
import { supabaseEmployees } from "../../lib/supabaseEmployees";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { createRoot } from "react-dom/client";
import PerformanceAgency from "../../components/letter/PerformanceAgency";
import PerformanceUnitManager from "../../components/letter/PerformanceUnitManager";
import PerformanceSalesCounselor from "../../components/letter/PerformanceSalesCounselor";
import JSZip from "jszip";
// -----------------------------------------------------
// FILE NAME HELPERS
// -----------------------------------------------------
const safeFileName = (value, fallback) =>
  String(value || fallback)
    .replace(/[<>:"**\/\\**|?*]+/g, "")
    .trim()
    .replace(/\s+/g, "_");
// Format: <Agency>_<Person>_Performance_Letter.pdf
const buildLetterFileName = (agencyName, personName, fallback) =>
  `${safeFileName(agencyName, "No_Agency")}_${safeFileName(
    personName,
    fallback
  )}_Performance_Letter.pdf`;
const blobToBase64 = (blob) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(String(reader.result).split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
// -----------------------------------------------------
// SUPABASE SELECT COLUMNS
// -----------------------------------------------------
const AGENCY_COLUMNS = `
  agency_key,
  agency_name,
  agency_manager,
  id_no,
  unit_manager_count,
  agent_count,
  fyp_production,
  spotcash,
  premium1,
  salescoordinator,
  sending_status
`;
const UNIT_MANAGER_COLUMNS = `
  id_no,
  unit_manager,
  agency,
  agent_count,
  fyp_production,
  spotcash,
  premium1,
  salescoordinator,
  sending_status
`;
const SALES_COUNSELOR_COLUMNS = `
  id_no,
  agent_name,
  agency,
  fyp_production,
  spotcash,
  premium1,
  salescoordinator,
  period_start,
  period_end,
  sending_status
`;
export default function PerformanceEmailManagement() {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [records, setRecords] = useState([]);
  const [previewMode, setPreviewMode] = useState("all");
  const [loadingRecords, setLoadingRecords] = useState(false);
  const [generatingAgencyPdf, setGeneratingAgencyPdf] = useState(false);
  const [, setAgencyPdfRecords] = useState([]);
  const [generatingUnitManagerPdf, setGeneratingUnitManagerPdf] = useState(false);
  const [generatingSalesCounselorPdf, setGeneratingSalesCounselorPdf] = useState(false);
  const [sendingWithAttachments, setSendingWithAttachments] = useState(false);
  const loadBatches = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabaseEmployees
        .from("coordinator_email_batches")
        .select("*")
        .order("coordinator_name");
      if (error) throw error;
      setBatches(data || []);
    } catch (error) {
      console.error("Failed to load email batches:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadBatches();
  }, []);
  const stats = useMemo(() => {
    return {
      coordinators: batches.length,
      records: batches.reduce(
        (total, row) => total + Number(row.total_records || 0),
        0
      ),
      pending: batches.filter((row) => row.status === "Pending").length,
      sent: batches.filter((row) => row.status === "Sent").length,
    };
  }, [batches]);
  const openPreview = async (batch, mode = "all") => {
    try {
      setPreviewMode(mode);
      setSelectedBatch(batch);
      setLoadingRecords(true);
      setRecords([]);
      const { data, error } = await supabaseEmployees
        .from("coordinator_email_assignments")
        .select("*")
        .eq("final_coordinator_id", batch.coordinator_id)
        .order("record_type")
        .order("record_name");
      if (error) throw error;
      if (mode === "pending") {
        const assignments = data || [];
        const configs = [
          { type: "Agency", table: "production_agency", key: "agency_name", assignmentKey: "record_name" },
          { type: "Unit Manager", table: "production_unit_manager", key: "unit_manager", assignmentKey: "record_name" },
          { type: "Sales Counselor", table: "production_sales_counselor", key: "id_no", assignmentKey: "record_id" },
        ];
        const pendingKeys = new Map();
        for (const config of configs) {
          const keys = [...new Set(assignments.filter(row => row.record_type === config.type).map(row => row[config.assignmentKey]).filter(Boolean))];
          const found = new Set();
          for (let i = 0; i < keys.length; i += 200) {
            const { data: matches, error: lookupError } = await supabaseEmployees.from(config.table).select(config.key).in(config.key, keys.slice(i, i + 200)).eq("sending_status", false);
            if (lookupError) throw lookupError;
            (matches || []).forEach(row => found.add(String(row[config.key])));
          }
          pendingKeys.set(config.type, { config, found });
        }
        setRecords(assignments.filter(row => {
          const entry = pendingKeys.get(row.record_type);
          return entry && entry.found.has(String(row[entry.config.assignmentKey]));
        }));
      } else {
        setRecords(data || []);
      }
    } catch (error) {
      console.error("Failed to load assigned records:", error);
      alert(error.message);
    } finally {
      setLoadingRecords(false);
    }
  };
  const closePreview = () => {
    setSelectedBatch(null);
    setPreviewMode("all");
    setRecords([]);
  };
  // -----------------------------------------------------
  // GENERATE AGENCY PDF (individual downloads)
  // -----------------------------------------------------
  const generateAgencyPdf = async () => {
    if (!selectedBatch || generatingAgencyPdf) return;
    let renderHost = null;
    let root = null;
    try {
      setGeneratingAgencyPdf(true);
      const agencyAssignments = records.filter(
        (row) => row.record_type === "Agency"
      );
      if (agencyAssignments.length === 0) {
        throw new Error("No Agency records found for this coordinator.");
      }
      const agencyNames = agencyAssignments.map((row) => row.record_name);
      const { data: agencies, error } = await supabaseEmployees
        .from("production_agency")
        .select(AGENCY_COLUMNS)
        .in("agency_name", agencyNames);
      if (error) throw error;
      if (!agencies || agencies.length === 0) {
        throw new Error("No matching production_agency records were found.");
      }
      const agencyByName = new Map(
        agencies.map((agency) => [agency.agency_name, agency])
      );
      const mappedAgencies = agencyAssignments
        .map((assignment) => agencyByName.get(assignment.record_name))
        .filter(Boolean)
        .map((agency) => ({
          ...agency,
          full_name: agency.agency_manager || agency.agency_name,
          active_counselors: agency.agent_count,
          producing_unit_managers: agency.unit_manager_count,
          first_year_premium: agency.fyp_production,
        }));
      if (mappedAgencies.length !== agencyAssignments.length) {
        const foundNames = new Set(
          mappedAgencies.map((agency) => agency.agency_name)
        );
        const missingNames = agencyAssignments
          .map((assignment) => assignment.record_name)
          .filter((name) => !foundNames.has(name));
        throw new Error(
          `Some Agency records were not found: ${missingNames.join(", ")}`
        );
      }
      setAgencyPdfRecords(mappedAgencies);
      renderHost = document.createElement("div");
      renderHost.style.position = "fixed";
      renderHost.style.left = "-10000px";
      renderHost.style.top = "0";
      renderHost.style.width = "210mm";
      renderHost.style.background = "#fff";
      document.body.appendChild(renderHost);
      root = createRoot(renderHost);
      root.render(
        <div>
          {mappedAgencies.map((agency) => (
            <div
              key={agency.agency_key || agency.agency_name}
              className="agency-pdf-page"
              style={{
                width: "215.9mm",
                height: "330.2mm",
                overflow: "hidden",
                background: "#fff",
              }}
            >
              <PerformanceAgency sc={agency} />
            </div>
          ))}
        </div>
      );
      await new Promise((resolve) => setTimeout(resolve, 500));
      const images = Array.from(renderHost.querySelectorAll("img"));
      await Promise.all(
        images.map(
          (img) =>
            new Promise((resolve) => {
              if (img.complete) {
                resolve();
                return;
              }
              img.onload = resolve;
              img.onerror = resolve;
            })
        )
      );
      if (document.fonts?.ready) {
        await document.fonts.ready;
      }
      const pages = Array.from(
        renderHost.querySelectorAll(".agency-pdf-page")
      );
      if (pages.length !== mappedAgencies.length) {
        throw new Error("Agency letter pages were not rendered completely.");
      }
      for (let index = 0; index < pages.length; index += 1) {
        const canvas = await html2canvas(pages[index], {
          scale: 2,
          useCORS: true,
          backgroundColor: "#ffffff",
          logging: false,
        });
        const imageData = canvas.toDataURL("image/jpeg", 0.95);
        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: "a4",
          compress: true,
        });
        pdf.addImage(imageData, "JPEG", 0, 0, 210, 297);
        const safeAgencyName = safeFileName(
          mappedAgencies[index]?.agency_name,
          `Agency_${index + 1}`
        );
        pdf.save(`${safeAgencyName}_Performance_Letter.pdf`);
        await new Promise((resolve) => setTimeout(resolve, 250));
      }
    } catch (error) {
      console.error("Agency PDF generation failed:", error);
      alert(`Agency PDF generation failed: ${error.message}`);
    } finally {
      if (root) root.unmount();
      if (renderHost?.parentNode) {
        renderHost.parentNode.removeChild(renderHost);
      }
      setGeneratingAgencyPdf(false);
    }
  };
  // -----------------------------------------------------
  // GENERATE UNIT MANAGER PDF (individual downloads)
  // -----------------------------------------------------
  const generateUnitManagerPdf = async () => {
    if (!selectedBatch || generatingUnitManagerPdf) return;
    let renderHost = null;
    let root = null;
    try {
      setGeneratingUnitManagerPdf(true);
      const unitManagerAssignments = records.filter(
        (row) => row.record_type === "Unit Manager"
      );
      if (unitManagerAssignments.length === 0) {
        throw new Error("No Unit Manager records found for this coordinator.");
      }
      const unitManagerNames = unitManagerAssignments.map(
        (row) => row.record_name
      );
      const { data: unitManagers, error } = await supabaseEmployees
        .from("production_unit_manager")
        .select(UNIT_MANAGER_COLUMNS)
        .in("unit_manager", unitManagerNames);
      if (error) throw error;
      if (!unitManagers || unitManagers.length === 0) {
        throw new Error("No matching production_unit_manager records were found.");
      }
      const unitManagerByName = new Map(
        unitManagers.map((manager) => [manager.unit_manager, manager])
      );
      const mappedUnitManagers = unitManagerAssignments
        .map((assignment) => unitManagerByName.get(assignment.record_name))
        .filter(Boolean)
        .map((manager) => ({
          ...manager,
          full_name: manager.unit_manager,
          producing_counselors: manager.agent_count,
          group_premium: manager.fyp_production,
        }));
      if (mappedUnitManagers.length !== unitManagerAssignments.length) {
        const foundNames = new Set(
          mappedUnitManagers.map((manager) => manager.unit_manager)
        );
        const missingNames = unitManagerAssignments
          .map((assignment) => assignment.record_name)
          .filter((name) => !foundNames.has(name));
        throw new Error(
          `Some Unit Manager records were not found: ${missingNames.join(", ")}`
        );
      }
      renderHost = document.createElement("div");
      renderHost.style.position = "fixed";
      renderHost.style.left = "-10000px";
      renderHost.style.top = "0";
      renderHost.style.width = "215.9mm";
      renderHost.style.background = "#fff";
      document.body.appendChild(renderHost);
      root = createRoot(renderHost);
      root.render(
        <div>
          {mappedUnitManagers.map((manager) => (
            <div
              key={manager.id_no || manager.unit_manager}
              className="unit-manager-pdf-page"
              style={{
                width: "215.9mm",
                height: "330.2mm",
                overflow: "hidden",
                background: "#fff",
              }}
            >
              <PerformanceUnitManager sc={manager} />
            </div>
          ))}
        </div>
      );
      await new Promise((resolve) => setTimeout(resolve, 500));
      const images = Array.from(renderHost.querySelectorAll("img"));
      await Promise.all(
        images.map(
          (img) =>
            new Promise((resolve) => {
              if (img.complete) {
                resolve();
                return;
              }
              img.onload = resolve;
              img.onerror = resolve;
            })
        )
      );
      if (document.fonts?.ready) await document.fonts.ready;
      const pages = Array.from(
        renderHost.querySelectorAll(".unit-manager-pdf-page")
      );
      if (pages.length !== mappedUnitManagers.length) {
        throw new Error("Unit Manager letter pages were not rendered completely.");
      }
      for (let index = 0; index < pages.length; index += 1) {
        const canvas = await html2canvas(pages[index], {
          scale: 2,
          useCORS: true,
          backgroundColor: "#ffffff",
          logging: false,
        });
        const imageData = canvas.toDataURL("image/jpeg", 0.95);
        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: [215.9, 330.2],
          compress: true,
        });
        pdf.addImage(imageData, "JPEG", 0, 0, 215.9, 330.2);
        pdf.save(
          buildLetterFileName(
            mappedUnitManagers[index]?.agency,
            mappedUnitManagers[index]?.unit_manager,
            `Unit_Manager_${index + 1}`
          )
        );
        await new Promise((resolve) => setTimeout(resolve, 250));
      }
    } catch (error) {
      console.error("Unit Manager PDF generation failed:", error);
      alert(`Unit Manager PDF generation failed: ${error.message}`);
    } finally {
      if (root) root.unmount();
      if (renderHost?.parentNode) renderHost.parentNode.removeChild(renderHost);
      setGeneratingUnitManagerPdf(false);
    }
  };
  // -----------------------------------------------------
  // GENERATE SALES COUNSELOR PDF (individual downloads)
  // -----------------------------------------------------
  const generateSalesCounselorPdf = async () => {
    if (!selectedBatch || generatingSalesCounselorPdf) return;
    let renderHost = null;
    let root = null;
    try {
      setGeneratingSalesCounselorPdf(true);
      const salesCounselorAssignments = records.filter(
        (row) => row.record_type === "Sales Counselor"
      );
      if (salesCounselorAssignments.length === 0) {
        throw new Error("No Sales Counselor records found for this coordinator.");
      }
      const salesCounselorIds = salesCounselorAssignments
        .map((row) => row.record_id)
        .filter(Boolean);
      const { data: salesCounselors, error } = await supabaseEmployees
        .from("production_sales_counselor")
        .select(SALES_COUNSELOR_COLUMNS)
        .in("id_no", salesCounselorIds);
      if (error) throw error;
      if (!salesCounselors || salesCounselors.length === 0) {
        throw new Error("No matching production_sales_counselor records were found.");
      }
      const counselorById = new Map(
        salesCounselors.map((counselor) => [
          String(counselor.id_no),
          counselor,
        ])
      );
      const mappedSalesCounselors = salesCounselorAssignments
        .map((assignment) => {
          const counselor = counselorById.get(String(assignment.record_id));
          if (!counselor) return null;
          return {
            ...counselor,
            full_name: assignment.record_name || counselor.agent_name,
            production: counselor.fyp_production,
          };
        })
        .filter(Boolean);
      if (mappedSalesCounselors.length !== salesCounselorAssignments.length) {
        const foundIds = new Set(
          mappedSalesCounselors.map((counselor) => String(counselor.id_no))
        );
        const missing = salesCounselorAssignments
          .filter((assignment) => !foundIds.has(String(assignment.record_id)))
          .map((assignment) => `${assignment.record_name} (${assignment.record_id})`);
        throw new Error(
          `Some Sales Counselor records were not found: ${missing.join(", ")}`
        );
      }
      renderHost = document.createElement("div");
      renderHost.style.position = "fixed";
      renderHost.style.left = "-10000px";
      renderHost.style.top = "0";
      renderHost.style.width = "215.9mm";
      renderHost.style.background = "#fff";
      document.body.appendChild(renderHost);
      root = createRoot(renderHost);
      root.render(
        <div>
          {mappedSalesCounselors.map((counselor) => (
            <div
              key={counselor.id_no}
              className="sales-counselor-pdf-page"
              style={{
                width: "215.9mm",
                height: "330.2mm",
                overflow: "hidden",
                background: "#fff",
              }}
            >
              <PerformanceSalesCounselor sc={counselor} />
            </div>
          ))}
        </div>
      );
      await new Promise((resolve) => setTimeout(resolve, 500));
      const images = Array.from(renderHost.querySelectorAll("img"));
      await Promise.all(
        images.map(
          (img) =>
            new Promise((resolve) => {
              if (img.complete) {
                resolve();
                return;
              }
              img.onload = resolve;
              img.onerror = resolve;
            })
        )
      );
      if (document.fonts?.ready) await document.fonts.ready;
      const pages = Array.from(
        renderHost.querySelectorAll(".sales-counselor-pdf-page")
      );
      if (pages.length !== mappedSalesCounselors.length) {
        throw new Error("Sales Counselor letter pages were not rendered completely.");
      }
      for (let index = 0; index < pages.length; index += 1) {
        const canvas = await html2canvas(pages[index], {
          scale: 2,
          useCORS: true,
          backgroundColor: "#ffffff",
          logging: false,
        });
        const imageData = canvas.toDataURL("image/jpeg", 0.95);
        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: [215.9, 330.2],
          compress: true,
        });
        pdf.addImage(imageData, "JPEG", 0, 0, 215.9, 330.2);
        pdf.save(
          buildLetterFileName(
            mappedSalesCounselors[index]?.agency,
            mappedSalesCounselors[index]?.full_name,
            `Sales_Counselor_${index + 1}`
          )
        );
        await new Promise((resolve) => setTimeout(resolve, 250));
      }
    } catch (error) {
      console.error("Sales Counselor PDF generation failed:", error);
      alert(`Sales Counselor PDF generation failed: ${error.message}`);
    } finally {
      if (root) root.unmount();
      if (renderHost?.parentNode) renderHost.parentNode.removeChild(renderHost);
      setGeneratingSalesCounselorPdf(false);
    }
  };
  // -----------------------------------------------------
  // RENDER ONE LETTER TO PDF BLOB (for ZIP)
  // -----------------------------------------------------
  const renderLetterPdfBlob = async (Component, data) => {
    let renderHost = null;
    let root = null;
    try {
      renderHost = document.createElement("div");
      renderHost.style.position = "fixed";
      renderHost.style.left = "-10000px";
      renderHost.style.top = "0";
      renderHost.style.width = "215.9mm";
      renderHost.style.background = "#fff";
      document.body.appendChild(renderHost);
      root = createRoot(renderHost);
      root.render(
        <div
          style={{
            width: "215.9mm",
            height: "330.2mm",
            overflow: "hidden",
            background: "#fff",
          }}
        >
          <Component sc={data} />
        </div>
      );
      await new Promise((resolve) => setTimeout(resolve, 250));
      const images = Array.from(renderHost.querySelectorAll("img"));
      await Promise.all(
        images.map(
          (img) =>
            new Promise((resolve) => {
              if (img.complete) return resolve();
              img.onload = resolve;
              img.onerror = resolve;
            })
        )
      );
      if (document.fonts?.ready) await document.fonts.ready;
      const page = renderHost.firstElementChild;
      const canvas = await html2canvas(page, {
        scale: 1.35,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
      });
      const imageData = canvas.toDataURL("image/jpeg", 0.82);
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [215.9, 330.2],
        compress: true,
      });
      pdf.addImage(imageData, "JPEG", 0, 0, 215.9, 330.2);
      return pdf.output("blob");
    } finally {
      if (root) root.unmount();
      if (renderHost?.parentNode) renderHost.parentNode.removeChild(renderHost);
    }
  };
  // -----------------------------------------------------
  // BUILD ZIP ATTACHMENTS
  // -----------------------------------------------------
  const buildPerformanceZipAttachments = async () => {
    const agencyAssignments = records.filter(
      (row) => row.record_type === "Agency"
    );
    const unitManagerAssignments = records.filter(
      (row) => row.record_type === "Unit Manager"
    );
    const salesCounselorAssignments = records.filter(
      (row) => row.record_type === "Sales Counselor"
    );
    const attachments = [];
    const coordinatorSafeName = safeFileName(
      selectedBatch.coordinator_name,
      "Coordinator"
    );
    // ---------- AGENCY ----------
    if (agencyAssignments.length > 0) {
      const names = agencyAssignments.map((row) => row.record_name);
      const { data, error } = await supabaseEmployees
        .from("production_agency")
        .select(AGENCY_COLUMNS)
        .in("agency_name", names);
      if (error) throw error;
      const byName = new Map((data || []).map((row) => [row.agency_name, row]));
      const zip = new JSZip();
      for (const assignment of agencyAssignments) {
        const agency = byName.get(assignment.record_name);
        if (!agency) {
          throw new Error(`Agency not found: ${assignment.record_name}`);
        }
        const mapped = {
          ...agency,
          full_name: agency.agency_manager || agency.agency_name,
          active_counselors: agency.agent_count,
          producing_unit_managers: agency.unit_manager_count,
          first_year_premium: agency.fyp_production,
        };
        const pdfBlob = await renderLetterPdfBlob(PerformanceAgency, mapped);
        zip.file(
          `${safeFileName(agency.agency_name, "Agency")}_Performance_Letter.pdf`,
          pdfBlob
        );
      }
      const zipBlob = await zip.generateAsync({
        type: "blob",
        compression: "DEFLATE",
        compressionOptions: { level: 6 },
      });
      attachments.push({
        filename: `${coordinatorSafeName}_Agency_Letters.zip`,
        contentType: "application/zip",
        contentBase64: await blobToBase64(zipBlob),
      });
    }
    // ---------- UNIT MANAGER ----------
    if (unitManagerAssignments.length > 0) {
      const names = unitManagerAssignments.map((row) => row.record_name);
      const { data, error } = await supabaseEmployees
        .from("production_unit_manager")
        .select(UNIT_MANAGER_COLUMNS)
        .in("unit_manager", names);
      if (error) throw error;
      const byName = new Map((data || []).map((row) => [row.unit_manager, row]));
      const zip = new JSZip();
      for (const assignment of unitManagerAssignments) {
        const manager = byName.get(assignment.record_name);
        if (!manager) {
          throw new Error(`Unit Manager not found: ${assignment.record_name}`);
        }
        const mapped = {
          ...manager,
          full_name: manager.unit_manager,
          producing_counselors: manager.agent_count,
          group_premium: manager.fyp_production,
        };
        const pdfBlob = await renderLetterPdfBlob(
          PerformanceUnitManager,
          mapped
        );
        zip.file(
          buildLetterFileName(
            manager.agency,
            manager.unit_manager,
            "Unit_Manager"
          ),
          pdfBlob
        );
      }
      const zipBlob = await zip.generateAsync({
        type: "blob",
        compression: "DEFLATE",
        compressionOptions: { level: 6 },
      });
      attachments.push({
        filename: `${coordinatorSafeName}_Unit_Manager_Letters.zip`,
        contentType: "application/zip",
        contentBase64: await blobToBase64(zipBlob),
      });
    }
    // ---------- SALES COUNSELOR ----------
    if (salesCounselorAssignments.length > 0) {
      const ids = salesCounselorAssignments
        .map((row) => row.record_id)
        .filter(Boolean);
      const { data, error } = await supabaseEmployees
        .from("production_sales_counselor")
        .select(SALES_COUNSELOR_COLUMNS)
        .in("id_no", ids);
      if (error) throw error;
      const byId = new Map(
        (data || []).map((row) => [String(row.id_no), row])
      );
      const zip = new JSZip();
      for (const assignment of salesCounselorAssignments) {
        const counselor = byId.get(String(assignment.record_id));
        if (!counselor) {
          throw new Error(
            `Sales Counselor not found: ${assignment.record_name}`
          );
        }
        const mapped = {
          ...counselor,
          full_name: assignment.record_name || counselor.agent_name,
          production: counselor.fyp_production,
        };
        const pdfBlob = await renderLetterPdfBlob(
          PerformanceSalesCounselor,
          mapped
        );
        zip.file(
          buildLetterFileName(
            mapped.agency,
            mapped.full_name,
            "Sales_Counselor"
          ),
          pdfBlob
        );
      }
      const zipBlob = await zip.generateAsync({
        type: "blob",
        compression: "DEFLATE",
        compressionOptions: { level: 6 },
      });
      attachments.push({
        filename: `${coordinatorSafeName}_Sales_Counselor_Letters.zip`,
        contentType: "application/zip",
        contentBase64: await blobToBase64(zipBlob),
      });
    }
    return attachments;
  };
  // -----------------------------------------------------
  // SEND EMAIL
  // -----------------------------------------------------
  const sendEmail = async () => {
    if (!selectedBatch || sendingWithAttachments || (previewMode === "pending" && records.length === 0)) return;
    try {
      setSendingWithAttachments(true);
      const attachments = await buildPerformanceZipAttachments();
      if (attachments.length === 0) {
        throw new Error("No performance letters were generated.");
      }
      const response = await fetch(
        "http\://localhost:3002/api/send-performance-email",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            batchId: selectedBatch.id,
            coordinatorId: selectedBatch.coordinator_id,
            coordinatorName: selectedBatch.coordinator_name,
            recipientEmail: selectedBatch.recipient_email,
            agencyCount: previewMode === "pending" ? records.filter(row => row.record_type === "Agency").length : selectedBatch.agency_count,
            unitManagerCount: previewMode === "pending" ? records.filter(row => row.record_type === "Unit Manager").length : selectedBatch.unit_manager_count,
            salesCounselorCount: previewMode === "pending" ? records.filter(row => row.record_type === "Sales Counselor").length : selectedBatch.sales_counselor_count,
            totalRecords: previewMode === "pending" ? records.length : selectedBatch.total_records,
            attachments,
          }),
        }
      );
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || data.message || "Failed to send email.");
      }
      if (previewMode === "pending") {
        const configs = [
          { type: "Agency", table: "production_agency", key: "agency_name", assignmentKey: "record_name" },
          { type: "Unit Manager", table: "production_unit_manager", key: "unit_manager", assignmentKey: "record_name" },
          { type: "Sales Counselor", table: "production_sales_counselor", key: "id_no", assignmentKey: "record_id" },
        ];
        const failures = [];
        for (const config of configs) {
          const keys = [...new Set(records.filter(row => row.record_type === config.type).map(row => row[config.assignmentKey]).filter(Boolean))];
          for (let i = 0; i < keys.length; i += 200) {
            const { error: updateError } = await supabaseEmployees.from(config.table).update({ sending_status: true }).in(config.key, keys.slice(i, i + 200)).eq("sending_status", false);
            if (updateError) failures.push(`${config.type}: ${updateError.message}`);
          }
        }
        if (failures.length) {
          alert(`Email was sent successfully, but some sending statuses could not be updated. Do not resend until checked in Supabase.\n${failures.join("\n")}`);
          return;
        }
        setRecords([]);
      }
      alert(`Performance email sent to ${data.recipient || selectedBatch.recipient_email}.`);
    } catch (error) {
      console.error("Send email failed:", error);
      alert(`Send email failed: ${error.message}`);
    } finally {
      setSendingWithAttachments(false);
    }
  };
  const statusStyle = (status) => {
    switch (status) {
      case "Sent":
        return { background: "#dcfce7", color: "#166534" };
      case "Failed":
        return { background: "#fee2e2", color: "#991b1b" };
      case "Ready":
        return { background: "#dbeafe", color: "#1d4ed8" };
      default:
        return { background: "#fef3c7", color: "#92400e" };
    }
  };
  return (
    <div style={{ padding: 28, background: "#f7fbfe", minHeight: "100vh" }}>
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <div>
          <h1 style={{ margin: 0, color: "#013F99", fontSize: 27 }}>
            Performance Letter Email Management
          </h1>
          <p style={{ margin: "7px 0 0", color: "#64748b", fontSize: 14 }}>
            Review coordinator assignments before sending performance letters.
          </p>
        </div>
        <button
          onClick={loadBatches}
          disabled={loading}
          style={{
            border: 0,
            borderRadius: 9,
            background: "linear-gradient(90deg, #0752a5, #45afe5)",
            color: "#fff",
            padding: "11px 17px",
            fontWeight: 700,
            cursor: "pointer",
            display: "flex",
            gap: 8,
            alignItems: "center",
          }}
        >
          <RefreshCw size={16} />
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>
      {/* SUMMARY */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(170px, 1fr))",
          gap: 14,
          marginBottom: 20,
        }}
      >
        <SummaryCard label="Recipients" value={stats.coordinators} />
        <SummaryCard label="Performance Letters" value={stats.records} />
        <SummaryCard label="Pending" value={stats.pending} />
        <SummaryCard label="Sent" value={stats.sent} />
      </div>
      {/* TABLE */}
      <div
        style={{
          background: "#fff",
          border: "1px solid #e4ebf2",
          borderRadius: 14,
          overflow: "hidden",
        }}
      >
        <div style={{ overflowX: "auto" }}>
          <table
            style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}
          >
            <thead>
              <tr style={{ background: "#f6fbfe" }}>
                {[
                  "Coordinator",
                  "Email",
                  "Agency",
                  "UM",
                  "SC",
                  "Total",
                  "Status",
                  "Actions",
                ].map((heading) => (
                  <th
                    key={heading}
                    style={{
                      padding: "13px 16px",
                      textAlign: "left",
                      color: "#64748b",
                      fontSize: 11,
                      textTransform: "uppercase",
                      letterSpacing: 0.7,
                      borderBottom: "1px solid #e4ebf2",
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
                      padding: 40,
                      textAlign: "center",
                      color: "#94a3b8",
                    }}
                  >
                    Loading email batches...
                  </td>
                </tr>
              ) : batches.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    style={{
                      padding: 40,
                      textAlign: "center",
                      color: "#94a3b8",
                    }}
                  >
                    No email batches found.
                  </td>
                </tr>
              ) : (
                batches.map((row) => (
                  <tr key={row.id} style={{ borderBottom: "1px solid #eef2f7" }}>
                    <td
                      style={{
                        padding: "14px 16px",
                        fontWeight: 700,
                        color: "#172033",
                        minWidth: 200,
                      }}
                    >
                      {row.coordinator_name}
                    </td>
                    <td style={{ padding: "14px 16px", color: "#475569" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 7,
                        }}
                      >
                        <Mail size={15} color="#013F99" />
                        {row.recipient_email}
                      </div>
                    </td>
                    <td style={countCell}>{row.agency_count}</td>
                    <td style={countCell}>{row.unit_manager_count}</td>
                    <td style={countCell}>{row.sales_counselor_count}</td>
                    <td
                      style={{
                        ...countCell,
                        fontWeight: 800,
                        color: "#013F99",
                      }}
                    >
                      {row.total_records}
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <span
                        style={{
                          ...statusStyle(row.status),
                          padding: "5px 10px",
                          borderRadius: 999,
                          fontSize: 12,
                          fontWeight: 700,
                        }}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <button
                        onClick={() => openPreview(row)}
                        style={{
                          border: "1px solid #dbe4ee",
                          background: "#fff",
                          borderRadius: 8,
                          padding: "8px 12px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: 7,
                          color: "#013F99",
                          fontWeight: 700,
                        }}
                      >
                        <Eye size={15} />
                        Preview
                      </button>
                      <button onClick={() => openPreview(row, "pending")} style={{ border: "1px solid #bfdbfe", background: "#eff6ff", borderRadius: 8, padding: "8px 12px", cursor: "pointer", display: "flex", alignItems: "center", gap: 7, color: "#0752a5", fontWeight: 700, marginTop: 7 }}>
                        <Mail size={15} /> Pending Emails
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* SENDING OVERLAY */}
      {sendingWithAttachments && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.62)",
            zIndex: 20000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
          }}
        >
          <div
            style={{
              width: "min(430px, 92vw)",
              background: "#fff",
              borderRadius: 16,
              padding: "30px 28px",
              textAlign: "center",
              boxShadow: "0 24px 70px rgba(0,0,0,.28)",
            }}
          >
            <RefreshCw
              size={38}
              color="#0752a5"
              style={{ animation: "performanceEmailSpin 1s linear infinite" }}
            />
            <h3 style={{ margin: "16px 0 8px", color: "#172033", fontSize: 19 }}>
              Preparing Performance Letters
            </h3>
            <p style={{ margin: 0, color: "#64748b", fontSize: 14, lineHeight: 1.6 }}>
              Generating PDF files, creating ZIP attachments, and sending the
              email to {selectedBatch?.recipient_email || "the recipient"}.
              Please wait and do not close this page.
            </p>
          </div>
          <style>{`
            @keyframes performanceEmailSpin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      )}
      {/* PREVIEW MODAL */}
      {selectedBatch && (
        <div style={overlayStyle}>
          <div style={modalStyle}>
            <div style={modalHeaderStyle}>
              <div>
                <h2 style={{ margin: 0, fontSize: 20, color: "#172033" }}>
                  {previewMode === "pending" ? "Pending Emails Preview" : "Email Preview"}
                </h2>
                <div style={{ marginTop: 5, color: "#64748b", fontSize: 13 }}>
                  {selectedBatch.coordinator_name}
                  {" • "}
                  {selectedBatch.recipient_email}
                </div>
              </div>
              <button onClick={closePreview} style={closeButton}>
                Close
              </button>
            </div>
            {/* COUNTS */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: 10,
                padding: "18px 22px",
                background: "#f8fafc",
                borderBottom: "1px solid #e2e8f0",
              }}
            >
              <MiniCard
                icon={<Building2 size={16} />}
                label="Agency"
                value={previewMode === "pending" ? records.filter(row => row.record_type === "Agency").length : selectedBatch.agency_count}
              />
              <MiniCard
                icon={<Users size={16} />}
                label="Unit Managers"
                value={previewMode === "pending" ? records.filter(row => row.record_type === "Unit Manager").length : selectedBatch.unit_manager_count}
              />
              <MiniCard
                icon={<UserRound size={16} />}
                label="Sales Counselors"
                value={previewMode === "pending" ? records.filter(row => row.record_type === "Sales Counselor").length : selectedBatch.sales_counselor_count}
              />
              <MiniCard
                icon={<Mail size={16} />}
                label="Total"
                value={previewMode === "pending" ? records.length : selectedBatch.total_records}
              />
            </div>
            {/* RECORDS */}
            <div style={{ padding: 22, overflowY: "auto", flex: 1 }}>
              {loadingRecords ? (
                <div style={{ padding: 40, textAlign: "center" }}>
                  Loading assigned records...
                </div>
              ) : (
                <>
                  {previewMode === "pending" && records.length === 0 && <div style={{ padding: 14, color: "#64748b" }}>No pending performance letters for this coordinator.</div>}
                  <RecordSection
                    title="Agency Performance Letters"
                    type="Agency"
                    records={records}
                  />
                  <RecordSection
                    title="Unit Manager Performance Letters"
                    type="Unit Manager"
                    records={records}
                  />
                  <RecordSection
                    title="Sales Counselor Performance Letters"
                    type="Sales Counselor"
                    records={records}
                  />
                </>
              )}
            </div>
            {/* FOOTER */}
            <div
              style={{
                padding: "15px 22px",
                borderTop: "1px solid #e2e8f0",
                display: "flex",
                justifyContent: "flex-end",
                gap: 10,
                background: "#fff",
              }}
            >
              <button onClick={closePreview} style={closeButton}>
                Close
              </button>
              <button
                onClick={generateAgencyPdf}
                disabled={generatingAgencyPdf || loadingRecords}
                style={{
                  border: 0,
                  borderRadius: 8,
                  background:
                    generatingAgencyPdf || loadingRecords
                      ? "#94a3b8"
                      : "#0f766e",
                  color: "#fff",
                  padding: "10px 16px",
                  fontWeight: 700,
                  cursor:
                    generatingAgencyPdf || loadingRecords
                      ? "not-allowed"
                      : "pointer",
                }}
              >
                {generatingAgencyPdf
                  ? "Loading Agency Data..."
                  : "Generate Agency PDF"}
              </button>
              <button
                onClick={generateUnitManagerPdf}
                disabled={generatingUnitManagerPdf || loadingRecords}
                style={{
                  border: 0,
                  borderRadius: 8,
                  background:
                    generatingUnitManagerPdf || loadingRecords
                      ? "#94a3b8"
                      : "#7c3aed",
                  color: "#fff",
                  padding: "10px 16px",
                  fontWeight: 700,
                  cursor:
                    generatingUnitManagerPdf || loadingRecords
                      ? "not-allowed"
                      : "pointer",
                }}
              >
                {generatingUnitManagerPdf
                  ? "Generating Unit Manager PDFs..."
                  : "Generate Unit Manager PDF"}
              </button>
              <button
                onClick={generateSalesCounselorPdf}
                disabled={generatingSalesCounselorPdf || loadingRecords}
                style={{
                  border: 0,
                  borderRadius: 8,
                  background:
                    generatingSalesCounselorPdf || loadingRecords
                      ? "#94a3b8"
                      : "#ea580c",
                  color: "#fff",
                  padding: "10px 16px",
                  fontWeight: 700,
                  cursor:
                    generatingSalesCounselorPdf || loadingRecords
                      ? "not-allowed"
                      : "pointer",
                }}
              >
                {generatingSalesCounselorPdf
                  ? "Generating Sales Counselor PDFs..."
                  : "Generate Sales Counselor PDF"}
              </button>
              <button
                onClick={sendEmail}
                disabled={sendingWithAttachments || loadingRecords || (previewMode === "pending" && records.length === 0)}
                style={{
                  border: 0,
                  borderRadius: 8,
                  background:
                    sendingWithAttachments || loadingRecords
                      ? "#94a3b8"
                      : "linear-gradient(90deg, #0752a5, #45afe5)",
                  color: "#fff",
                  padding: "10px 16px",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  cursor:
                    sendingWithAttachments || loadingRecords
                      ? "not-allowed"
                      : "pointer",
                }}
              >
                <Send size={16} />
                {sendingWithAttachments ? "Preparing & Sending..." : "Send Email"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
function SummaryCard({ label, value }) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e1e8f0",
        borderRadius: 12,
        padding: "17px 18px",
      }}
    >
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: "#64748b",
          textTransform: "uppercase",
          letterSpacing: 0.6,
        }}
      >
        {label}
      </div>
      <div
        style={{
          marginTop: 8,
          fontSize: 24,
          fontWeight: 800,
          color: "#013F99",
        }}
      >
        {value}
      </div>
    </div>
  );
}
function MiniCard({ icon, label, value }) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e2e8f0",
        borderRadius: 9,
        padding: 12,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          color: "#64748b",
          fontSize: 11,
        }}
      >
        {icon}
        {label}
      </div>
      <div
        style={{
          fontWeight: 800,
          fontSize: 19,
          color: "#013F99",
          marginTop: 5,
        }}
      >
        {value}
      </div>
    </div>
  );
}
function RecordSection({ title, type, records }) {
  const items = records.filter((row) => row.record_type === type);
  return (
    <div style={{ marginBottom: 25 }}>
      <h3 style={{ margin: "0 0 10px", color: "#172033", fontSize: 15 }}>
        {title} ({items.length})
      </h3>
      {items.length === 0 ? (
        <div style={{ color: "#94a3b8", fontSize: 13 }}>No records.</div>
      ) : (
        <div
          style={{
            border: "1px solid #e2e8f0",
            borderRadius: 9,
            overflow: "hidden",
          }}
        >
          {items.map((item) => (
            <div
              key={`${item.record_type}-${item.record_id}`}
              style={{
                padding: "9px 12px",
                borderBottom: "1px solid #eef2f7",
                display: "flex",
                justifyContent: "space-between",
                gap: 20,
                fontSize: 13,
              }}
            >
              <span style={{ fontWeight: 600, color: "#172033" }}>
                {item.record_name}
              </span>
              <span style={{ color: "#64748b" }}>{item.record_id}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
const countCell = {
  padding: "14px 16px",
  textAlign: "center",
};
const overlayStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(15, 23, 42, 0.58)",
  zIndex: 9999,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 24,
};
const modalStyle = {
  width: "min(1000px, 95vw)",
  height: "min(800px, 90vh)",
  background: "#fff",
  borderRadius: 14,
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
  boxShadow: "0 24px 70px rgba(0,0,0,.25)",
};
const modalHeaderStyle = {
  padding: "17px 22px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  borderBottom: "1px solid #e2e8f0",
};
const closeButton = {
  border: "1px solid #dbe4ee",
  background: "#fff",
  borderRadius: 8,
  padding: "9px 15px",
  cursor: "pointer",
  color: "#172033",
};