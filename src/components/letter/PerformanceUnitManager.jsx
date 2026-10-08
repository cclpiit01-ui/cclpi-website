import cclpiLogo from "../../assets/cclpi-logo.png";
import katrinaSignature from "../../assets/katrina-signature.png";
import mvdSignature from "../../assets/mvd-signature.png";
// --- Letter content that changes per release ------------------------------
// Edit these when the letter is re-issued. The "Current Standing" values are
// NOT here on purpose: they will come from the API later, so for now they
// are read from `sc.producing_counselors` and `sc.group_premium`
// (null/undefined -> prints a blank line to fill by hand).
const LETTER_DATE = "October 01, 2026";
const PERIOD_COVERED = "January 01-September 30, 2026";
const IMPROVEMENT_DEADLINE = "December 31, 2026";
const QUOTA_COUNSELORS = "At least 3";
const QUOTA_GROUP_PREMIUM = 500000;
const SIGNATORY = {
  name: "KATRINA AMOR D. CORPUZ",
  title: "National Sales and Distribution Manager",
};
const NOTED_BY = {
  name: "MANSUETO V. DELA PEÑA",
  title: "President and CEO",
};
const BLANK_LINE = "________________";
const formatPeso = (value) =>
  value === null || value === undefined || value === ""
    ? `₱${BLANK_LINE}`
    : `₱${Number(value).toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const formatCount = (value) =>
  value === null || value === undefined || value === "" ? BLANK_LINE : String(value);
const RESPONSIBILITIES = [
  "Submit all Preneed Plan applications taken by the Unit Manager to CCLPI and not to any other company.",
  "Turn over all premiums and other Company funds collected within twenty-four (24) hours.",
  "Observe all CCLPI rules, regulations, circulars, memoranda, rate sheets, and instructions issued from time to time.",
  "Represent CCLPI solely and exclusively unless prior written consent has been obtained from the Company.",
  "Refrain from rebates, misrepresentation, overselling, churning, manufactured sales, fraudulent documentation, and other prohibited practices.",
  "Ensure that applications are completely accomplished, properly verified, and that payment has been remitted and received before applicable commissions are released.",
];
// Unit Manager's Performance & Compliance Reminder — official letter
// (from UNIT_MANAGER_PERFORMANCE & COMPLIANCE REMINDER.docx).
//
// Fields still coming from the API are left null for now:
//   sc.producing_counselors -> "Producing Sales Counselors" (current standing)
//   sc.group_premium        -> "Annual Group Premium" (current standing)
// The name in the salutation uses sc.full_name from the row.
//
// Print styling (.print-area) comes from PRINT_CSS in the parent page.
export default function PerformanceUnitManager({ sc }) {
  const producingCounselors = sc?.producing_counselors ?? null; // TODO: from API
  const groupPremium = sc?.group_premium ?? null; // TODO: from API
  const name = sc?.full_name || BLANK_LINE;
  const p = { margin: "0 0 3mm" };
  const th = { textAlign: "left", padding: "1.5mm 8mm 1.5mm 0", fontWeight: 700 };
  const td = { textAlign: "left", padding: "1mm 8mm 1mm 0" };
  return (
    <div
      className="print-area"
      style={{
        width: "215.9mm",
        minHeight: "330.2mm",
        background: "#fff",
        boxShadow: "0 2px 12px rgba(0,0,0,0.25)",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Times New Roman', Times, serif",
        color: "#000",
      }}
    >
      {/* --- Letterhead ------------------------------------------------ */}
      <div style={{ padding: "8mm 15mm 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <img src={cclpiLogo} alt="CCLPI Plans" style={{ width: "52mm", height: "auto" }} />
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: "'Roboto', Arial, sans-serif", fontWeight: 700, fontSize: "11pt" }}>
              <span style={{ color: "#013F99" }}>COSMOPOLITAN </span>
              <span style={{ color: "#F3CF47" }}>CLIMBS LIFE PLAN INC.</span>
            </div>
            <div style={{ fontFamily: "'Roboto', Arial, sans-serif", fontSize: "7.5pt", color: "#1a1a1a", lineHeight: 1.4, marginTop: 2 }}>
              <div>35 Jesus V. Seriña St., Brgy. Carmen, Cagayan de Oro City</div>
              <div>Tel. No: (088) 880-1574; Hotline No: +63 917 154 3459 / +63 998 953 4937</div>
              <div>Email Address: cclpi.preneed@cclpi.com.ph; website: cclpi.com.ph</div>
            </div>
          </div>
        </div>
      </div>
      {/* --- Body -------------------------------------------------------- */}
      <div style={{ flex: 1, padding: "5mm 15mm 8mm", fontSize: "10pt", lineHeight: 1.3, textAlign: "justify" }}>
        <p style={{ ...p, textAlign: "center", fontWeight: 700, fontSize: "11pt", margin: "0 0 3mm" }}>
          UNIT MANAGER’S PERFORMANCE &amp; COMPLIANCE REMINDER
        </p>
        <p style={{ ...p, marginBottom: 5 }}>{LETTER_DATE}</p>
        <p style={{ ...p, marginBottom: 5 }}>Dear Mr./Ms. <b>{name},</b></p>
        <p style={p}>
          This communication serves as a formal reminder to all Unit Managers of the Company’s annual performance
          standards and the continuing responsibilities attached to your Unit Manager agreement with Cosmopolitan
          CLIMBS Life Plan Inc. (CCLPI).
        </p>
        <p style={p}>
          Accordingly, based on Company records from {PERIOD_COVERED}, your current standing is as follows:
        </p>
<div style={{ margin: "2mm 0 5mm" }}>
  <table
    style={{
      width: "100%",
      borderCollapse: "collapse",
      fontFamily: "Arial, sans-serif",
      fontSize: "9.5pt",
      border: "1px solid #b8c2cc",
    }}
  >
    <thead>
      <tr style={{ background: "#eef3f8" }}>
        <th
          style={{
            padding: "2.5mm 3mm",
            textAlign: "left",
            fontWeight: 700,
            border: "1px solid #b8c2cc",
          }}
        >
          Performance Indicator
        </th>
        <th
          style={{
            padding: "2.5mm 3mm",
            textAlign: "right",
            fontWeight: 700,
            border: "1px solid #b8c2cc",
          }}
        >
          Current Standing
        </th>
        <th
          style={{
            padding: "2.5mm 3mm",
            textAlign: "right",
            fontWeight: 700,
            border: "1px solid #b8c2cc",
          }}
        >
          Annual Sales Quota
        </th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td
          style={{
            padding: "3mm",
            border: "1px solid #b8c2cc",
            fontWeight: 600,
          }}
        >
          Producing Sales Counselors
        </td>
        <td
          style={{
            padding: "3mm",
            border: "1px solid #b8c2cc",
            textAlign: "right",
            fontWeight: 700,
            fontSize: "10pt",
          }}
        >
          {formatCount(producingCounselors)}
        </td>
        <td
          style={{
            padding: "3mm",
            border: "1px solid #b8c2cc",
            textAlign: "right",
            fontWeight: 700,
            fontSize: "10pt",
          }}
        >
          {QUOTA_COUNSELORS}
        </td>
      </tr>
      <tr>
        <td
          style={{
            padding: "3mm",
            border: "1px solid #b8c2cc",
            fontWeight: 600,
          }}
        >
          Annual Group Premium
        </td>
        <td
          style={{
            padding: "3mm",
            border: "1px solid #b8c2cc",
            textAlign: "right",
            fontWeight: 700,
            fontSize: "10pt",
          }}
        >
          {formatPeso(groupPremium)}
        </td>
        <td
          style={{
            padding: "3mm",
            border: "1px solid #b8c2cc",
            textAlign: "right",
            fontWeight: 700,
            fontSize: "10pt",
          }}
        >
          {formatPeso(QUOTA_GROUP_PREMIUM)}
        </td>
      </tr>
    </tbody>
  </table>
</div>
        <p style={{ ...p, fontWeight: 700, textAlign: "left", marginBottom: 2 }}>
          CONTINUING RESPONSIBILITIES UNDER THE UNIT MANAGER AGREEMENT:
        </p>
<ul style={{ margin: "0 0 2mm", padding: "0 0 0 4mm", listStyle: "none" }}>
  {RESPONSIBILITIES.map((item) => (
    <li key={item} style={{ display: "flex", gap: "2.5mm", marginBottom: 1 }}>
      <span>•</span>
      <span>{item}</span>
    </li>
  ))}
</ul>
        <p style={p}>
          Furthermore, the Unit Manager Agreement provides that the Company may terminate the Agreement with cause if
          the Unit Manager fails to sell and deliver any policy for ninety (90) consecutive days, or if the Unit Manager
          with three (3) producing Sales Counselors fails to sell and deliver ₱500,000.00 in New Business Premiums or
          First Year Premiums during the calendar year, together with other grounds stated in the Agreement.
        </p>
        <p style={p}>
          Meanwhile, CCLPI recognizes that performance improvement requires a reasonable opportunity for Unit Managers
          to strengthen both group production and manpower development. Accordingly, all Unit Managers covered by this
          reminder are given the opportunity to improve and demonstrate compliance with the Company’s performance
          standards until {IMPROVEMENT_DEADLINE}. During this period, Unit Managers are encouraged to coordinate with
          their Agency Manager or Area Sales Manager for coaching, business planning, manpower development, recruitment
          support, and field development activities.
        </p>
        <p style={p}>
          Thereafter, CCLPI will conduct a review and evaluation of each Unit Manager’s performance, group production,
          manpower development, compliance, and other applicable responsibilities and requirements under the Unit
          Manager Agreement, Company policies, and relevant issuances. The review shall take into consideration the
          applicable contractual grounds for termination with cause and other provisions of the Agreement. Any
          appropriate action, if warranted, shall be determined based on the results of such review and evaluation and
          the applicable provisions governing the Unit Manager appointment.
        </p>
        <p style={p}>
          CCLPI appreciates your leadership, professionalism, and continued contribution to the growth and development
          of your unit.
        </p>
        <div style={{ textAlign: "left", marginTop: "5mm" }}>
          <img
            src={katrinaSignature}
            alt="Signature"
            style={{ height: "13mm", width: "auto", display: "block", marginBottom: "-1mm", position: "relative" }}
          />
          <div style={{ fontWeight: 700 }}>{SIGNATORY.name}</div>
          <div style={{ marginBottom: "2mm" }}>{SIGNATORY.title}</div>
          <div style={{ marginBottom: "1mm" }}>Noted By:</div>
          <img
            src={mvdSignature}
            alt="Signature"
            style={{ height: "13mm", width: "auto", display: "block", marginBottom: "-1mm", position: "relative" }}
          />
          <div style={{ fontWeight: 700 }}>{NOTED_BY.name}</div>
          <div>{NOTED_BY.title}</div>
        </div>
      </div>
    </div>
  );
}
