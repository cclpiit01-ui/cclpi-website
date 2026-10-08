require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { google } = require("googleapis");
const { Readable } = require("stream");

const app = express();

// -----------------------------------------------------
// MIDDLEWARE
// -----------------------------------------------------

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));

// -----------------------------------------------------
// GOOGLE OAUTH CONFIG
// -----------------------------------------------------

console.log("Gmail OAuth config:", {
  clientIdLoaded: Boolean(process.env.GMAIL_CLIENT_ID),
  clientSecretLoaded: Boolean(process.env.GMAIL_CLIENT_SECRET),
  redirectUri: process.env.GMAIL_REDIRECT_URI,
});

const oauth2Client = new google.auth.OAuth2(
  process.env.GMAIL_CLIENT_ID,
  process.env.GMAIL_CLIENT_SECRET,
  process.env.GMAIL_REDIRECT_URI
);

// -----------------------------------------------------
// LOAD SAVED REFRESH TOKEN
// -----------------------------------------------------

if (process.env.GMAIL_REFRESH_TOKEN) {
  oauth2Client.setCredentials({
    refresh_token: process.env.GMAIL_REFRESH_TOKEN,
  });

  console.log("Saved Gmail refresh token loaded.");
} else {
  console.log("No saved Gmail refresh token. Authorization required.");
}

// -----------------------------------------------------
// CC CONFIG
// -----------------------------------------------------

const PERFORMANCE_EMAIL_CC = [
  "sales.distributionhead@cclpi.com.ph",
  "damascoalvinj@gmail.com",
];

// -----------------------------------------------------
// TEST BACKEND
// -----------------------------------------------------

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "CCLPI Gmail backend is running.",
  });
});

// -----------------------------------------------------
// START GOOGLE AUTHORIZATION
// -----------------------------------------------------

app.get("/auth/google", (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/gmail.send",
      "https://www.googleapis.com/auth/drive.file",
    ],
  });

  res.redirect(authUrl);
});

// -----------------------------------------------------
// GOOGLE CALLBACK
// -----------------------------------------------------

app.get("/auth/google/callback", async (req, res) => {
  try {
    const { code } = req.query;

    if (!code) {
      return res.status(400).send("Authorization code missing.");
    }

    const { tokens } = await oauth2Client.getToken(code);

    oauth2Client.setCredentials(tokens);

    console.log("Google authorization successful.");
    console.log("Access token received:", Boolean(tokens.access_token));
    console.log("Refresh token received:", Boolean(tokens.refresh_token));
    if (tokens.refresh_token) {
      // console.log("NEW_REFRESH_TOKEN:");
      // console.log(tokens.refresh_token);
    }

    res.send(`
      <h2>CCLPI Gmail + Google Drive Connected Successfully</h2>
      <p>
        ${process.env.GMAIL_SENDER}
        has authorized Gmail and Google Drive access.
      </p>
      <p>You can close this window.</p>
    `);
  } catch (error) {
    console.error(
      "Google OAuth error:",
      error.response?.data || error.message
    );

    res
      .status(500)
      .send("Google authorization failed: " + error.message);
  }
});

// -----------------------------------------------------
// SEND TEST EMAIL
// -----------------------------------------------------

app.post("/api/send-test-email", async (req, res) => {
  try {
    const { to } = req.body;

    if (!to) {
      return res.status(400).json({
        success: false,
        message: "Recipient email is required.",
      });
    }

    if (
      !oauth2Client.credentials.access_token &&
      !oauth2Client.credentials.refresh_token
    ) {
      return res.status(401).json({
        success: false,
        message: "Gmail is not authorized. Open /auth/google first.",
      });
    }

    const gmail = google.gmail({
      version: "v1",
      auth: oauth2Client,
    });

    const subject = "CCLPI Performance Email System - Test Email";

    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #172033;">
        <h2 style="color:#013F99;">CCLPI Plans</h2>

        <p>Hello,</p>

        <p>
          This is a test email from the
          <strong>CCLPI Performance Letter Email System</strong>.
        </p>

        <p>
          If you received this message,
          the Gmail integration is working correctly.
        </p>

        <br>

        <p>
          Regards,<br>
          <strong>CCLPI Plans</strong>
        </p>
      </div>
    `;

    const message = [
      `From: CCLPI Plans <${process.env.GMAIL_SENDER}>`,
      `To: ${to}`,
      ...(PERFORMANCE_EMAIL_CC.length > 0
        ? [`Cc: ${PERFORMANCE_EMAIL_CC.join(", ")}`]
        : []),
      `Subject: ${subject}`,
      "MIME-Version: 1.0",
      'Content-Type: text/html; charset="UTF-8"',
      "",
      html,
    ].join("\r\n");

    const encodedMessage = Buffer.from(message)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    const result = await gmail.users.messages.send({
      userId: "me",
      requestBody: {
        raw: encodedMessage,
      },
    });

    console.log("Test email sent successfully:", result.data.id);

    return res.json({
      success: true,
      message: "Test email sent successfully.",
      messageId: result.data.id,
    });
  } catch (error) {
    console.error("Test email error:", error.response?.data || error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to send test email.",
      error: error.response?.data?.error?.message || error.message,
    });
  }
});

// -----------------------------------------------------
// GOOGLE DRIVE HELPERS
// -----------------------------------------------------

const bufferToStream = (buffer) => {
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);
  return stream;
};

const safeDriveName = (value, fallback = "Performance Letters") =>
  String(value || fallback)
    .replace(/[<>:"/\\|?*\r\n]+/g, "_")
    .trim();

async function uploadPerformanceLettersToDrive(
  coordinatorName,
  recipientEmail,
  attachments
) {
  const drive = google.drive({ version: "v3", auth: oauth2Client });

  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
const folderName = safeDriveName(
  `${coordinatorName || "Sales Coordinator"} - Performance Letters - Second Batch - ${stamp}`
);

  const folder = await drive.files.create({
    requestBody: {
      name: folderName,
      mimeType: "application/vnd.google-apps.folder",
    },
    fields: "id,name,webViewLink",
  });

  const folderId = folder.data.id;
  if (!folderId) throw new Error("Google Drive folder could not be created.");

  for (const attachment of attachments) {
    if (!attachment?.filename || !attachment?.contentBase64) continue;

    const fileBuffer = Buffer.from(attachment.contentBase64, "base64");

    await drive.files.create({
      requestBody: {
        name: safeDriveName(attachment.filename, "Performance_Letters.zip"),
        parents: [folderId],
      },
      media: {
        mimeType: attachment.contentType || "application/zip",
        body: bufferToStream(fileBuffer),
      },
      fields: "id,name",
    });
  }

  await drive.permissions.create({
    fileId: folderId,
    requestBody: {
      type: "anyone",
      role: "reader",
    },
    fields: "id",
  });

  const details = await drive.files.get({
    fileId: folderId,
    fields: "id,name,webViewLink",
  });

  return {
    folderId,
    folderName: details.data.name || folderName,
    folderUrl:
      details.data.webViewLink ||
      `https://drive.google.com/drive/folders/${folderId}`,
  };
}

// -----------------------------------------------------
// SEND PERFORMANCE EMAIL
// -----------------------------------------------------

app.post("/api/send-performance-email", async (req, res) => {
  try {
    const {
      batchId,
      coordinatorId,
      coordinatorName,
      recipientEmail,
      to,
      agencyCount = 0,
      unitManagerCount = 0,
      salesCounselorCount = 0,
      totalRecords = 0,
      attachments = [],
    } = req.body;

    const destinationEmail = recipientEmail || to;

    if (!destinationEmail) {
      return res
        .status(400)
        .json({ success: false, message: "Recipient email is required." });
    }

    if (!Array.isArray(attachments) || attachments.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No ZIP files were received." });
    }

    const { folderId, folderName, folderUrl } =
      await uploadPerformanceLettersToDrive(
        coordinatorName,
        destinationEmail,
        attachments
      );

    const gmail = google.gmail({ version: "v1", auth: oauth2Client });

    const subject = "CCLPI Plans - Performance Letters (Second Batch)";
    const cellStyle = "padding:10px; border:1px solid #ddd;";
    const valueStyle = `${cellStyle} font-weight:bold;`;

    const html = `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#172033;max-width:650px;">
        <h2 style="color:#013F99;">CCLPI Plans</h2>
        <p>Dear ${coordinatorName || "Sales Coordinator"},</p>
        <p>Please find the second batch of performance letters assigned to your area.</p>
        <table style="border-collapse:collapse;width:100%;margin:20px 0;">
          <tr><td style="${cellStyle}">Agency</td><td style="${valueStyle}">${agencyCount}</td></tr>
          <tr><td style="${cellStyle}">Unit Managers</td><td style="${valueStyle}">${unitManagerCount}</td></tr>
          <tr><td style="${cellStyle}">Sales Counselors</td><td style="${valueStyle}">${salesCounselorCount}</td></tr>
          <tr><td style="${cellStyle}">Total Performance Letters</td><td style="${valueStyle}">${totalRecords}</td></tr>
        </table>
        <p>Your performance letters have been uploaded securely to Google Drive.</p>
        <p style="margin:26px 0;">
          <a href="${folderUrl}" style="display:inline-block;background:#013F99;color:#fff;text-decoration:none;padding:12px 20px;border-radius:7px;font-weight:bold;">Open Performance Letters</a>
        </p>
        <p style="font-size:12px;color:#64748b;">Google Drive folder: ${folderName}</p>
        <p>Regards,<br><strong>CCLPI Plans</strong></p>
      </div>
    `;

    const message = [
      `From: CCLPI Plans <${process.env.GMAIL_SENDER}>`,
      `To: ${destinationEmail}`,
      ...(PERFORMANCE_EMAIL_CC.length > 0
        ? [`Cc: ${PERFORMANCE_EMAIL_CC.join(", ")}`]
        : []),
      `Subject: ${subject}`,
      "MIME-Version: 1.0",
      'Content-Type: text/html; charset="UTF-8"',
      "",
      html,
    ].join("\r\n");

    const encodedMessage = Buffer.from(message)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    const result = await gmail.users.messages.send({
      userId: "me",
      requestBody: { raw: encodedMessage },
    });

    console.log(`Performance email sent to ${destinationEmail}:`, result.data.id);
    console.log("CC:", PERFORMANCE_EMAIL_CC.join(", ") || "(none)");
    console.log("Drive folder:", folderUrl);

    return res.json({
      success: true,
      message:
        "Performance letters uploaded to Google Drive and email sent successfully.",
      messageId: result.data.id,
      recipient: destinationEmail,
      cc: PERFORMANCE_EMAIL_CC,
      driveFolderId: folderId,
      driveFolderUrl: folderUrl,
    });
  } catch (error) {
    console.error(
      "Performance email error:",
      error.stack || error.response?.data || error.message
    );

    return res.status(500).json({
      success: false,
      message: "Failed to upload performance letters or send email.",
      error: error.response?.data?.error?.message || error.message,
    });
  }
});

// -----------------------------------------------------
// START SERVER
// -----------------------------------------------------

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log(`CCLPI Gmail backend running on http://localhost:${PORT}`);
});