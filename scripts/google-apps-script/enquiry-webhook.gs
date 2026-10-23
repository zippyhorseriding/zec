/**
 * Zippy Equestrian — enquiry webhook (Google Apps Script)
 * ---------------------------------------------------------------------------
 * Receives form submissions from the website, appends them to a Google Sheet
 * and emails the team. No service-account keys are needed.
 *
 * SETUP
 * 1. Create a Google Sheet with a tab named "Enquiries" (the script creates
 *    it with headers on first use if missing).
 * 2. Open the sheet → Extensions → Apps Script, delete the placeholder code
 *    and paste this whole file.
 * 3. Project Settings → Script Properties → add:
 *      SHEET_ID       = the long id from the sheet URL
 *      NOTIFY_EMAILS  = zippyhorseriding@gmail.com (comma-separate for multiple)
 *      SHARED_SECRET  = a long random string (also set in the website env)
 * 4. Deploy → New deployment → type "Web app".
 *      Execute as:        Me
 *      Who has access:    Anyone
 *    Copy the /exec URL.
 * 5. Add to the website environment (local and hosting):
 *      GOOGLE_SHEETS_WEBHOOK_URL="https://script.google.com/macros/s/.../exec"
 *      GOOGLE_SHEETS_WEBHOOK_SECRET="same string as SHARED_SECRET"
 *
 * After editing this script, use Deploy → Manage deployments → Edit → New
 * version, otherwise the live URL keeps running the old code.
 */

const DEFAULTS = {
  SHEET_ID: "",
  SHEET_NAME: "Enquiries",
  NOTIFY_EMAILS: "zippyhorseriding@gmail.com",
  SHARED_SECRET: "",
  TIMEZONE: "Asia/Kolkata",
};

// Bump this whenever the script changes so you can confirm which version is live.
const SCRIPT_VERSION = "3";

const HEADERS = [
  "Received At",
  "Form",
  "Name",
  "Email",
  "Phone",
  "Interested In",
  "City / Location",
  "Land / Property Status",
  "Message",
  "Source",
  "User Agent",
];

function doGet() {
  return json_({ ok: true, service: "zippy-enquiry-webhook", version: SCRIPT_VERSION });
}

function doPost(e) {
  try {
    const config = getConfig_();

    if (!config.SHARED_SECRET) {
      return json_({ ok: false, error: "SHARED_SECRET is not configured" });
    }

    const raw = e && e.postData ? e.postData.contents : "";
    if (!raw) {
      return json_({ ok: false, error: "Empty request body" });
    }

    const body = JSON.parse(raw);
    if (!body || body.secret !== config.SHARED_SECRET) {
      return json_({ ok: false, error: "Unauthorized" });
    }

    const enquiry = normalise_(body);
    if (!enquiry.name || !enquiry.phone) {
      return json_({ ok: false, error: "Missing required fields" });
    }

    appendToSheet_(enquiry, config);

    let emailWarning = "";
    try {
      sendNotification_(enquiry, config);
    } catch (mailError) {
      // The row is already saved; report the mail problem without losing the lead.
      emailWarning = String(mailError);
      console.error("Notification email failed: " + emailWarning);
    }

    return json_({ ok: true, version: SCRIPT_VERSION, warning: emailWarning || undefined });
  } catch (error) {
    console.error("Enquiry webhook failed: " + error);
    return json_({ ok: false, error: String(error) });
  }
}

function getConfig_() {
  const props = PropertiesService.getScriptProperties();
  return {
    SHEET_ID: props.getProperty("SHEET_ID") || DEFAULTS.SHEET_ID,
    SHEET_NAME: props.getProperty("SHEET_NAME") || DEFAULTS.SHEET_NAME,
    NOTIFY_EMAILS: props.getProperty("NOTIFY_EMAILS") || DEFAULTS.NOTIFY_EMAILS,
    SHARED_SECRET: props.getProperty("SHARED_SECRET") || DEFAULTS.SHARED_SECRET,
    TIMEZONE: props.getProperty("TIMEZONE") || DEFAULTS.TIMEZONE,
  };
}

function normalise_(body) {
  const clean = function (value, maxLength) {
    return String(value == null ? "" : value)
      .replace(/\r\n?/g, "\n")
      .trim()
      .slice(0, maxLength);
  };

  return {
    formType: clean(body.formType, 40) || "contact",
    name: clean(body.name, 120),
    email: clean(body.email, 200),
    phone: clean(body.phone, 30),
    countryCode: clean(body.countryCode, 8) || "+91",
    interest: clean(body.interest, 120),
    city: clean(body.city, 120),
    landStatus: clean(body.landStatus, 160),
    message: clean(body.message, 4000),
    source: clean(body.source, 500),
    userAgent: clean(body.userAgent, 300),
    submittedAt: clean(body.submittedAt, 40),
  };
}

function appendToSheet_(enquiry, config) {
  if (!config.SHEET_ID) {
    throw new Error("SHEET_ID is not configured");
  }

  const lock = LockService.getScriptLock();
  lock.waitLock(15000);

  try {
    const spreadsheet = SpreadsheetApp.openById(config.SHEET_ID);
    let sheet = spreadsheet.getSheetByName(config.SHEET_NAME);

    if (!sheet) {
      sheet = spreadsheet.insertSheet(config.SHEET_NAME);
    }

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
      sheet.getRange(1, 1, 1, HEADERS.length).setNumberFormat("@");
      sheet.setFrozenRows(1);
    }

    const receivedAt = enquiry.submittedAt
      ? new Date(enquiry.submittedAt)
      : new Date();
    const timestamp = Utilities.formatDate(
      isNaN(receivedAt.getTime()) ? new Date() : receivedAt,
      config.TIMEZONE,
      "yyyy-MM-dd HH:mm:ss",
    );

    const values = [
      timestamp,
      enquiry.formType === "franchise" ? "Franchise" : "Contact",
      enquiry.name,
      enquiry.email,
      // Store without the leading "+": Sheets parses "+91 ..." as a formula
      // and shows #ERROR!. The email still displays the +.
      enquiry.countryCode.replace(/^\+/, "") + " " + enquiry.phone,
      enquiry.interest,
      enquiry.city,
      enquiry.landStatus,
      enquiry.message,
      enquiry.source,
      enquiry.userAgent,
    ].map(toTextCell_);

    const rowIndex = sheet.getLastRow() + 1;
    const range = sheet.getRange(rowIndex, 1, 1, values.length);
    range.setNumberFormat("@");
    range.setValues([values]);
  } finally {
    lock.releaseLock();
  }
}

function sendNotification_(enquiry, config) {
  if (!config.NOTIFY_EMAILS) return;

  const isFranchise = enquiry.formType === "franchise";
  const subject = isFranchise
    ? "New franchise enquiry: " + (enquiry.city || "New location") + " — " + enquiry.name
    : "New website enquiry: " + (enquiry.interest || "General") + " — " + enquiry.name;

  const rows = [
    ["Form", isFranchise ? "Franchise enquiry" : "Contact form"],
    ["Name", enquiry.name],
    ["Email", enquiry.email || "Not provided"],
    ["Phone", enquiry.countryCode + " " + enquiry.phone],
    ["Interested in", enquiry.interest || "—"],
    ["City / location", enquiry.city || "—"],
    ["Land / property status", enquiry.landStatus || "—"],
    ["Source", enquiry.source || "—"],
    ["Message", enquiry.message || "—"],
  ];

  const text = rows.map(function (row) {
    return row[0] + ": " + row[1];
  }).join("\n");

  const html =
    '<div style="font-family:Arial,Helvetica,sans-serif;color:#242424;line-height:1.5">' +
    '<h2 style="margin:0 0 4px;color:#85431E">' +
    escapeHtml_(subject) +
    "</h2>" +
    '<p style="margin:0 0 16px;color:#777;font-size:13px">Submitted via ' +
    escapeHtml_(enquiry.source || "the website") +
    "</p>" +
    '<table cellpadding="8" cellspacing="0" style="border-collapse:collapse;font-size:14px">' +
    rows.map(function (row) {
      return (
        '<tr><td style="border:1px solid #e5ddc8;background:#F2EBD9;font-weight:bold;vertical-align:top">' +
        escapeHtml_(row[0]) +
        '</td><td style="border:1px solid #e5ddc8;vertical-align:top;white-space:pre-wrap">' +
        escapeHtml_(String(row[1])) +
        "</td></tr>"
      );
    }).join("") +
    "</table></div>";

  const options = {
    to: config.NOTIFY_EMAILS,
    subject: subject,
    body: text,
    htmlBody: html,
    name: "Zippy Equestrian Website",
  };

  if (enquiry.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(enquiry.email)) {
    options.replyTo = enquiry.email;
  }

  MailApp.sendEmail(options);
}

/**
 * Sheets parses user-entered values starting with =, +, - or @ as formulas.
 * Prefixing with an apostrophe forces plain text; Sheets hides that apostrophe.
 */
function toTextCell_(value) {
  const text = String(value == null ? "" : value);
  return /^[=+\-@']/.test(text) ? "'" + text : text;
}

function escapeHtml_(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Run this manually from the Apps Script editor to verify sheet writing without
 * involving the website or sending an email:
 *   select "testAppend" in the function dropdown → Run → check the sheet.
 * If the phone and message cells look right here, the script is fine and the
 * deployed web app only needs a new version.
 */
function testAppend() {
  const config = getConfig_();
  appendToSheet_(
    {
      formType: "contact",
      name: "Apps Script test",
      email: "",
      phone: "9876543210",
      countryCode: "+91",
      interest: "Test",
      city: "",
      landStatus: "",
      message: "=SUM(1,2) — this must stay text, not become a formula",
      source: "manual test",
      userAgent: "",
      submittedAt: new Date().toISOString(),
    },
    config,
  );
  SpreadsheetApp.flush();

  const sheet = SpreadsheetApp.openById(config.SHEET_ID).getSheetByName(config.SHEET_NAME);
  const lastRow = sheet.getLastRow();
  console.log("Test row " + lastRow + " written. Phone cell: " + sheet.getRange(lastRow, 5).getDisplayValue());
}

function json_(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
