import {
  Document, Packer, Paragraph, TextRun, ImageRun, Table, TableRow, TableCell,
  WidthType, AlignmentType, BorderStyle, ShadingType, LevelFormat, VerticalAlign,
} from "docx";
import cclpiLogo from "@/assets/cclpi-logo.png";
import katrinaSignature from "@/assets/katrina-signature.png";
import mvdSignature from "@/assets/mvd-signature.png";
import {
  LETTER_DATE, PERIOD_COVERED, IMPROVEMENT_DEADLINE, REQUIRED_COUNSELORS,
  REQUIRED_UNIT_MANAGERS, REQUIRED_FYP, SIGNATORY, NOTED_BY, RESPONSIBILITIES,
} from "@/components/letter/PerformanceAgency";

const BLANK = "________________";
const MM = 56.693; // twips per mm
const BODY = { size: 19 }; // 9.5pt
const SP = { after: 113, line: 293 }; // 2mm after, ~1.22 line height

const fmtCount = (v) => (v === null || v === undefined || v === "" ? BLANK : String(v));
const fmtPeso = (v) =>
  v === null || v === undefined || v === ""
    ? `₱${BLANK}`
    : `₱${Number(v).toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

async function loadImage(url) {
  const data = await (await fetch(url)).arrayBuffer();
  const { w, h } = await new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ w: img.naturalWidth, h: img.naturalHeight });
    img.onerror = reject;
    img.src = url;
  });
  return { data, ratio: w / h };
}

const NONE = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const NO_BORDERS = { top: NONE, bottom: NONE, left: NONE, right: NONE };
const LINE = { style: BorderStyle.SINGLE, size: 6, color: "B8C2CC" };
const GRID = { top: LINE, bottom: LINE, left: LINE, right: LINE };

const para = (text) =>
  new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    spacing: SP,
    children: [new TextRun({ text, ...BODY })],
  });

const cell = (text, { width, align, bold, size = 19, fill, pad = 170 }) =>
  new TableCell({
    width: { size: width, type: WidthType.DXA },
    borders: GRID,
    margins: { top: pad, bottom: pad, left: 170, right: 170 },
    verticalAlign: VerticalAlign.CENTER,
    shading: fill ? { type: ShadingType.CLEAR, fill, color: "auto" } : undefined,
    children: [
      new Paragraph({
        alignment: align,
        children: [new TextRun({ text, bold, size, font: "Arial" })],
      }),
    ],
  });

export async function downloadPerformanceAgencyDocx(sc) {
  const logo = await loadImage(cclpiLogo);
  const sig1 = await loadImage(katrinaSignature);
  const sig2 = await loadImage(mvdSignature);

  const mmToPx = (mm) => (mm / 25.4) * 96;
  const logoW = mmToPx(52);
  const sigH = mmToPx(11);

  const img = (i, w, h) =>
    new ImageRun({ type: "png", data: i.data, transformation: { width: w, height: h } });

  const addr = (t) =>
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      children: [new TextRun({ text: t, size: 15, color: "1A1A1A", font: "Arial" })],
    });

  // ---------- Letterhead ----------
  const letterhead = new Table({
    width: { size: 10540, type: WidthType.DXA },
    columnWidths: [4600, 5940],
    borders: { ...NO_BORDERS, insideHorizontal: NONE, insideVertical: NONE },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 4600, type: WidthType.DXA },
            borders: NO_BORDERS,
            children: [
              new Paragraph({ children: [img(logo, logoW, logoW / logo.ratio)] }),
            ],
          }),
          new TableCell({
            width: { size: 5940, type: WidthType.DXA },
            borders: NO_BORDERS,
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({ text: "COSMOPOLITAN ", bold: true, size: 22, color: "013F99", font: "Arial" }),
                  new TextRun({ text: "CLIMBS LIFE PLAN INC.", bold: true, size: 22, color: "F3CF47", font: "Arial" }),
                ],
              }),
              addr("35 Jesus V. Seriña St., Brgy. Carmen, Cagayan de Oro City"),
              addr("Tel. No: (088) 880-1574; Hotline No: +63 917 154 3459 / +63 998 953 4937"),
              addr("Email Address: cclpi.preneed@cclpi.com.ph; website: cclpi.com.ph"),
            ],
          }),
        ],
      }),
    ],
  });

  // ---------- Performance table ----------
  const W = [4216, 3028, 3296];
  const row = (label, current, required) =>
    new TableRow({
      children: [
        cell(label, { width: W[0], bold: true }),
        cell(current, { width: W[1], align: AlignmentType.RIGHT, bold: true, size: 20 }),
        cell(required, { width: W[2], align: AlignmentType.RIGHT, bold: true, size: 20 }),
      ],
    });

  const perfTable = new Table({
    width: { size: 10540, type: WidthType.DXA },
    columnWidths: W,
    borders: { ...GRID, insideHorizontal: LINE, insideVertical: LINE },
    rows: [
      new TableRow({
        children: [
          cell("Performance Indicator", { width: W[0], bold: true, fill: "EEF3F8", pad: 142 }),
          cell("Current Standing", { width: W[1], align: AlignmentType.RIGHT, bold: true, fill: "EEF3F8", pad: 142 }),
          cell("Required Standard", { width: W[2], align: AlignmentType.RIGHT, bold: true, fill: "EEF3F8", pad: 142 }),
        ],
      }),
      row("Active Sales Counselors", fmtCount(sc?.active_counselors), REQUIRED_COUNSELORS),
      row("Producing Unit Managers", fmtCount(sc?.producing_unit_managers), REQUIRED_UNIT_MANAGERS),
      row("First Year Premium (FYP)", fmtPeso(sc?.first_year_premium), fmtPeso(REQUIRED_FYP)),
    ],
  });

  const spacer = () =>
    new Paragraph({ spacing: { after: 0 }, children: [new TextRun({ text: " ", size: 8 })] });

  const bullets = RESPONSIBILITIES.map(
    (t) =>
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: 15, line: 293 },
        children: [new TextRun({ text: t, ...BODY })],
      })
  );

  const left = (children, after = 0) =>
    new Paragraph({ spacing: { after, line: 293 }, children });

  const doc = new Document({
    styles: { default: { document: { run: { font: "Times New Roman", size: 19 } } } },
    numbering: {
      config: [
        {
          reference: "bullets",
          levels: [
            {
              level: 0,
              format: LevelFormat.BULLET,
              text: "•",
              alignment: AlignmentType.LEFT,
              style: { paragraph: { indent: { left: 400, hanging: 200 } } },
            },
          ],
        },
      ],
    },
    sections: [
      {
        properties: {
          page: {
            size: { width: 12240, height: 18720 }, // 8.5 x 13 in
            margin: {
              top: Math.round(6 * MM),
              bottom: Math.round(6 * MM),
              left: Math.round(15 * MM),
              right: Math.round(15 * MM),
              header: 0,
              footer: 0,
            },
          },
        },
        children: [
          letterhead,
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 170, after: 170 },
            children: [new TextRun({ text: "AGENCY’S PERFORMANCE & COMPLIANCE REMINDER", bold: true, size: 22 })],
          }),
          left([new TextRun({ text: LETTER_DATE, ...BODY })], 100),
          left(
            [
              new TextRun({ text: "Dear ", ...BODY }),
              new TextRun({ text: `${sc?.agency_name || "Valued Agency Partner"},`, bold: true, ...BODY }),
            ],
            100
          ),
          para(
            "This letter serves as a formal reminder to all Agency Partners of CCLPI’s current annual performance standards and the responsibilities attached to the Agency agreement. The Agency Agreement, together with its Annex A and subsequent Company rules, circulars, memoranda, and written instructions, establishes the framework by which Agency Partners are expected to conduct their business and maintain their relationship with the Company."
          ),
          para(
            `Based on CCLPI’s official records from ${PERIOD_COVERED}, your Agency’s current performance is as follows:`
          ),
          perfTable,
          spacer(),
          left([new TextRun({ text: "CONTINUING RESPONSIBILITIES UNDER THE AGENCY AGREEMENT:", bold: true, ...BODY })], 40),
          ...bullets,
          spacer(),
          para(
            "Furthermore, the Agency Agreement provides specific grounds for termination with cause, including failure of the Agency with its three (3) Unit Managers to sell and deliver any policy for ninety (90) consecutive days and failure to sell and deliver ₱300,000.00 in New Business Premiums or First Year Premiums for the year, among other specified grounds under the Agreement."
          ),
          para(
            `Meanwhile, CCLPI recognizes that performance improvement requires a reasonable opportunity for Agency Partners to strengthen both production and manpower performance. Accordingly, all Agency Partners covered by this reminder are given the opportunity to improve and demonstrate compliance with the Company’s performance standards until ${IMPROVEMENT_DEADLINE}. During this period, Agency Partners are encouraged to coordinate with their respective Area Sales Manager for coaching, business planning, recruitment support, training coordination, and field development activities.`
          ),
          para(
            "Thereafter, CCLPI will conduct a review and evaluation of each Agency’s performance, production, manpower development, compliance, and other applicable responsibilities and requirements under the Agency Agreement, its Annex A, Company policies, and relevant issuances. The review shall take into consideration the applicable contractual grounds for termination with cause and other provisions of the Agreement. Any appropriate action, if warranted, shall be determined based on the results of such review and evaluation and the applicable provisions governing the Agency appointment."
          ),
          para("Thank you for your continued commitment, cooperation, and partnership with CCLPI."),
          left([new TextRun({ text: "Respectfully Yours,", ...BODY })]),
          new Paragraph({ children: [img(sig1, sigH * sig1.ratio, sigH)] }),
          left([new TextRun({ text: SIGNATORY.name, bold: true, ...BODY })]),
          left([new TextRun({ text: SIGNATORY.title, ...BODY })], 60),
          left([new TextRun({ text: "Noted By:", ...BODY })]),
          new Paragraph({ children: [img(sig2, sigH * sig2.ratio, sigH)] }),
          left([new TextRun({ text: NOTED_BY.name, bold: true, ...BODY })]),
          left([new TextRun({ text: NOTED_BY.title, ...BODY })]),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const safe = (sc?.agency_name || "Agency").replace(/[^\w\-]+/g, "_");
  a.href = url;
  a.download = `Performance_Letter_${safe}.docx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}