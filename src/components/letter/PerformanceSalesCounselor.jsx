import cclpiLogo from "../../assets/cclpi-logo.png";
import katrinaSignature from "../../assets/katrina-signature.png";
import mvdSignature from "../../assets/mvd-signature.png";
// --- Letter content that changes per release ------------------------------
// Edit these when the letter is re-issued. The production amount is NOT
// here on purpose: it will come from the API later, so for now it is read
// from `sc.production` (null/undefined -> prints a blank line to fill by hand).
const LETTER_DATE = "October 01, 2026";
const PERIOD_COVERED = "January 01-September 30, 2026";
const IMPROVEMENT_DEADLINE = "December 31, 2026";
const ANNUAL_QUOTA = 30000;
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
    : `₱${Number(value).toLocaleString("en-PH")}`;
const RESPONSIBILITIES = [
  "Submit all Preneed Plan applications taken to CCLPI and not to any other company.",
  "Turn over all premiums and other Company funds collected within twenty-four (24) hours.",
  "Observe all CCLPI rules, regulations, circulars, memoranda, and instructions.",
  "Represent CCLPI solely and exclusively unless prior written consent has been obtained from the Company.",
  "Refrain from rebates, misrepresentation, overselling, churning, manufactured sales, fraudulent documentation, and other prohibited practices.",
  "Ensure that applications are completely accomplished, properly verified, and that payment has been remitted and received before commission release.",
];
// Sales Counselor's Performance & Compliance Reminder — official letter
// (from CCLPI_SC_Performance_Compliance_Reminder.docx).
//
// Fields still coming from the API are left null for now:
//   sc.production  -> "Current Production" (FYP) amount
// The name in the salutation uses sc.full_name from the row.
//
// Print styling (.print-area) comes from PRINT_CSS in the parent page.
export default function PerformanceSalesCounselor({ sc }) {
  const production = sc?.production ?? null; // TODO: from API
  const name = sc?.full_name || BLANK_LINE;
  const p = { margin: "0 0 3.5mm" };
  const th = { textAlign: "left", padding: "1.5mm 4mm 1.5mm 0", fontWeight: 700 };
  const td = { textAlign: "left", padding: "1.5mm 4mm 1.5mm 0" };
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
      <div style={{ padding: "10mm 18mm 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
          {/* Left: logo + "CCLPI Plans" logotype */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <img src={cclpiLogo} alt="CCLPI Plans" style={{ width: "52mm", height: "auto" }} />
          </div>
          {/* Right: company name + address/contact block */}
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
      <div style={{ flex: 1, padding: "7mm 18mm 10mm", fontSize: "10pt", lineHeight: 1.3, textAlign: "justify" }}>
        <p style={{ ...p, textAlign: "center", fontWeight: 700, fontSize: "11pt", margin: "0 0 5mm" }}>
          SALES COUNSELOR’S PERFORMANCE &amp; COMPLIANCE REMINDER
        </p>
        <p style={{ ...p, marginBottom: 5 }}>{LETTER_DATE}</p>
        <p style={{ ...p, marginBottom: 5 }}>Dear Mr./Ms.<b> {name},</b></p>
        <p style={p}>
          This communication serves as a formal reminder to all Sales Counselors of the Company’s annual performance
          standard and the continuing responsibilities attached to your Sales Counselor agreement with Cosmopolitan
          CLIMBS Life Plan Inc. (CCLPI).
        </p>
        <p style={p}>
          Accordingly, based on Company records from {PERIOD_COVERED}, your production is as follows:
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
          Current Production
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
          First Year Premium (FYP)
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
          {formatPeso(production)}
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
          {formatPeso(ANNUAL_QUOTA)}
        </td>
      </tr>
    </tbody>
  </table>
</div>
        <p style={{ ...p, fontWeight: 700, textAlign: "left", marginBottom: 2 }}>
          CONTINUING RESPONSIBILITIES UNDER THE SALES COUNSELOR AGREEMENT:
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
          Furthermore, the Sales Counselor Agreement provides specific contractual grounds for termination with cause,
          including failure to sell and deliver any policy for ninety (90) consecutive days and failure to sell and
          deliver ₱30,000.00 in New Business Premiums or First Year Premiums for one year, among other grounds stated
          in the Agreement.
        </p>
        <p style={p}>
          Meanwhile, CCLPI recognizes that performance improvement requires a reasonable opportunity for Sales
          Counselors to strengthen their production and business activity. Accordingly, all Sales Counselors covered by
          this reminder are given the opportunity to improve and demonstrate compliance with the Company’s performance
          standards until {IMPROVEMENT_DEADLINE}. During this period, Sales Counselors are encouraged to coordinate with
          their Unit Manager, Agency Manager, or Area Sales Manager for coaching, business planning, field support, and
          other appropriate assistance.
        </p>
        <p style={p}>
          Thereafter, CCLPI will conduct a review and evaluation of each Sales Counselor’s performance, production,
          compliance, and other applicable responsibilities and requirements under the Sales Counselor Agreement,
          Company policies, and relevant issuances. The review shall take into consideration the applicable contractual
          grounds for termination with cause and other provisions of the Agreement. Any appropriate action, if
          warranted, shall be determined based on the results of such review and evaluation and the applicable
          provisions governing the Sales Counselor appointment.
        </p>
        <p style={p}>
          CCLPI appreciates your continued professionalism, commitment, and contribution to the growth of the Company.
        </p>
<p style={{ ...p, marginTop: "5mm", marginBottom: "2mm" }}>Respectfully Yours,</p>
<div style={{ textAlign: "left" }}>
  <img
    src={katrinaSignature}
    alt="Signature"
    style={{ height: "14mm", width: "auto", display: "block", marginBottom: "-2mm", position: "relative" }}
  />
  <div style={{ fontWeight: 700 }}>{SIGNATORY.name}</div>
  <div style={{ marginBottom: "4mm" }}>{SIGNATORY.title}</div>
  <div style={{ marginBottom: "2mm" }}>Noted by:</div>
  <img
    src={mvdSignature}
    alt="Signature"
    style={{ height: "14mm", width: "auto", display: "block", marginBottom: "-2mm", position: "relative" }}
  />
  <div style={{ fontWeight: 700 }}>{NOTED_BY.name}</div>
  <div>{NOTED_BY.title}</div>
</div>
      </div>
    </div>
  );
}
