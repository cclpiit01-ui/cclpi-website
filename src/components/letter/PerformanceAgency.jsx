import cclpiLogo from "../../assets/cclpi-logo.png";
import katrinaSignature from "../../assets/katrina-signature.png";
import mvdSignature from "../../assets/mvd-signature.png";

// --- Letter content that changes per release ------------------------------
// Edit these when the letter is re-issued. The "Current Standing" values are
// NOT here on purpose: they will come from the API later, so for now they
// are read from `sc.active_counselors`, `sc.producing_unit_managers` and
// `sc.first_year_premium` (null/undefined -> prints a blank line to fill by hand).
const LETTER_DATE = "October 01, 2026";
const PERIOD_COVERED = "January 01-September 30, 2026";
const IMPROVEMENT_DEADLINE = "December 31, 2026";
const REQUIRED_COUNSELORS = "At least 13";
const REQUIRED_UNIT_MANAGERS = "At least 3";
const REQUIRED_FYP = 300000;

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
  "Solicit or procure applications for CCLPI Preneed Plans and collect and remit the corresponding premiums in accordance with the Agency Agreement and Company procedures.",
  "Submit all Preneed Plan applications procured by the Agency to CCLPI and not to any other company.",
  "Account for and turn over to CCLPI all Company funds received by the Agency within the period prescribed under the Agreement and applicable Company instructions.",
  "Comply with all CCLPI rules, regulations, rate sheets, circulars, memoranda, and other written instructions forming part of the Agency Agreement.",
  "Represent CCLPI exclusively and obtain prior written consent before engaging with or representing another life/non-life insurance or preneed company where such consent is required.",
  "Operate only within the authority granted under the Agency Agreement, the Agent’s Certificate of Authority, and applicable Company instructions.",
  "Maintain ethical sales practices and refrain from rebates, misrepresentation, overselling, churning, manufactured sales, fraudulent documentation, and other prohibited acts.",
  "Maintain the applicable requirements for commission release under Annex A, including the prescribed Agency/Unit Manager organization, training, examination, and license fee requirements.",
];

// Agency's Performance & Compliance Reminder — official letter
// (from CCLPI_Agency_Partner_Compliance_Reminder.docx).
//
// Fields still coming from the API are left null for now:
//   sc.active_counselors        -> "Active Sales Counselors" (current standing)
//   sc.producing_unit_managers  -> "Producing Unit Managers" (current standing)
//   sc.first_year_premium       -> "First Year Premium" (current standing)
// The salutation is the fixed "Dear Valued Agency Partner," from the docx.
//
// Print styling (.print-area) comes from PRINT_CSS in the parent page.
export default function PerformanceAgency({ sc }) {
  const activeCounselors = sc?.active_counselors ?? null; // TODO: from API
  const producingUnitManagers = sc?.producing_unit_managers ?? null; // TODO: from API
  const firstYearPremium = sc?.first_year_premium ?? null; // TODO: from API

  const p = { margin: "0 0 2mm" };
  const th = { textAlign: "left", padding: "1mm 8mm 1mm 0", fontWeight: 700 };
  const td = { textAlign: "left", padding: "0.5mm 8mm 0.5mm 0" };

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
      <div style={{ padding: "6mm 15mm 0" }}>
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
      <div style={{ flex: 1, padding: "3mm 15mm 6mm", fontSize: "9.5pt", lineHeight: 1.22, textAlign: "justify" }}>
        <p style={{ ...p, textAlign: "center", fontWeight: 700, fontSize: "11pt", margin: "0 0 3mm" }}>
          AGENCY’S PERFORMANCE &amp; COMPLIANCE REMINDER
        </p>

        <p style={{ ...p, marginBottom: 5 }}>{LETTER_DATE}</p>

        <p style={{ ...p, marginBottom: 5 }}>
  Dear <b>{sc?.agency_name || "Valued Agency Partner"},</b>
</p>

        <p style={p}>
          This letter serves as a formal reminder to all Agency Partners of CCLPI’s current annual performance
          standards and the responsibilities attached to the Agency agreement. The Agency Agreement, together with its
          Annex A and subsequent Company rules, circulars, memoranda, and written instructions, establishes the
          framework by which Agency Partners are expected to conduct their business and maintain their relationship
          with the Company.
        </p>

        <p style={p}>
          Based on CCLPI’s official records from {PERIOD_COVERED}, your Agency’s current performance is as follows:
        </p>

<div style={{ margin: "2mm 0 4mm" }}>
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
          Required Standard
        </th>
      </tr>
    </thead>

    <tbody>
      {/* Active Sales Counselors */}
      <tr>
        <td
          style={{
            padding: "3mm",
            border: "1px solid #b8c2cc",
            fontWeight: 600,
          }}
        >
          Active Sales Counselors
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
          {formatCount(activeCounselors)}
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
          {REQUIRED_COUNSELORS}
        </td>
      </tr>

      {/* Producing Unit Managers */}
      <tr>
        <td
          style={{
            padding: "3mm",
            border: "1px solid #b8c2cc",
            fontWeight: 600,
          }}
        >
          Producing Unit Managers
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
          {formatCount(producingUnitManagers)}
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
          {REQUIRED_UNIT_MANAGERS}
        </td>
      </tr>

      {/* First Year Premium */}
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
          {formatPeso(firstYearPremium)}
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
          {formatPeso(REQUIRED_FYP)}
        </td>
      </tr>
    </tbody>
  </table>
</div>
        <p style={{ ...p, fontWeight: 700, textAlign: "left", marginBottom: 2 }}>
          CONTINUING RESPONSIBILITIES UNDER THE AGENCY AGREEMENT:
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
          Furthermore, the Agency Agreement provides specific grounds for termination with cause, including failure of
          the Agency with its three (3) Unit Managers to sell and deliver any policy for ninety (90) consecutive days
          and failure to sell and deliver ₱300,000.00 in New Business Premiums or First Year Premiums for the year,
          among other specified grounds under the Agreement.
        </p>

        <p style={p}>
          Meanwhile, CCLPI recognizes that performance improvement requires a reasonable opportunity for Agency
          Partners to strengthen both production and manpower performance. Accordingly, all Agency Partners covered by
          this reminder are given the opportunity to improve and demonstrate compliance with the Company’s performance
          standards until {IMPROVEMENT_DEADLINE}. During this period, Agency Partners are encouraged to coordinate with
          their respective Area Sales Manager for coaching, business planning, recruitment support, training
          coordination, and field development activities.
        </p>

        <p style={p}>
          Thereafter, CCLPI will conduct a review and evaluation of each Agency’s performance, production, manpower
          development, compliance, and other applicable responsibilities and requirements under the Agency Agreement,
          its Annex A, Company policies, and relevant issuances. The review shall take into consideration the
          applicable contractual grounds for termination with cause and other provisions of the Agreement. Any
          appropriate action, if warranted, shall be determined based on the results of such review and evaluation and
          the applicable provisions governing the Agency appointment.
        </p>

        <p style={p}>
          Thank you for your continued commitment, cooperation, and partnership with CCLPI.
        </p>

        <p style={{ ...p, marginTop: "2mm", marginBottom: "0" }}>Respectfully Yours,</p>

        <div style={{ textAlign: "left" }}>
          <img
            src={katrinaSignature}
            alt="Signature"
            style={{ height: "11mm", width: "auto", display: "block", marginBottom: "-1mm", position: "relative" }}
          />
          <div style={{ fontWeight: 700 }}>{SIGNATORY.name}</div>
          <div style={{ marginBottom: "1mm" }}>{SIGNATORY.title}</div>

          <div style={{ marginBottom: "0" }}>Noted By:</div>

          <img
            src={mvdSignature}
            alt="Signature"
            style={{ height: "11mm", width: "auto", display: "block", marginBottom: "-1mm", position: "relative" }}
          />
          <div style={{ fontWeight: 700 }}>{NOTED_BY.name}</div>
          <div>{NOTED_BY.title}</div>
        </div>
      </div>
    </div>
  );
}