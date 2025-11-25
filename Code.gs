/**
 * Read-only API for Google Sheets
 */

const SHEET_ID = "1-EKiOh1DQHPXaMgtUI6C1Nr52y7zrUirf8KtDIXI3Eg";

function doGet(e) {
  const action = e.parameter.action;
  const sheetName = e.parameter.sheet;

  const ss = SpreadsheetApp.openById(SHEET_ID);

  // List all sheet names
  if (action === "listSheets") {
    const names = ss.getSheets().map(s => s.getName());
    return jsonOutput(names);
  }

  // Get sheet data
  if (action === "get" && sheetName) {
    const sheet = ss.getSheetByName(sheetName);
    if (!sheet) return jsonOutput({ error: "Sheet not found" });

    const values = sheet.getDataRange().getValues();
    if (values.length === 0) return jsonOutput({ headers: [], rows: [] });

    const headers = values.shift(); // first row
    return jsonOutput({ headers, rows: values });
  }

  return jsonOutput({ error: "Invalid request" });
}

function jsonOutput(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

