/**
 * Google Sheets RSVP receiver — paste this into a Google Apps Script project
 * bound to your spreadsheet (Extensions → Apps Script), or as a standalone
 * script with SPREADSHEET_ID below.
 *
 * Setup:
 * 1. Create a Google Sheet. Copy its ID from the URL:
 *    https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/edit
 * 2. Paste the ID into SPREADSHEET_ID below.
 * 3. Run createRsvpSheetIfNeeded() once from the editor (select function + Run),
 *    authorize when prompted — adds tab "RSVPs" and header row.
 * 4. Deploy → New deployment → Type: Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5. Copy the Web app URL and set VITE_GOOGLE_APPS_SCRIPT_URL in your .env
 *
 * If row 1 ever shows wrong headers (e.g. "Timestamp" in every column), run
 * fixRsvpHeaders() once, or submit any RSVP — ensureCorrectHeaderRow() repairs row 1.
 */

var SPREADSHEET_ID = 'PASTE_YOUR_SPREADSHEET_ID_HERE'
var SHEET_NAME = 'RSVPs'

/** Must match the append order in doPost — single source of truth for row 1. */
var RSVP_HEADER_ROW = ['Timestamp', 'Full name', 'Guest count']

/**
 * Sets row 1 to RSVP_HEADER_ROW when the sheet is new or headers are wrong
 * (e.g. duplicate "Timestamp" in every cell).
 */
function ensureCorrectHeaderRow(sheet) {
  var width = RSVP_HEADER_ROW.length
  if (sheet.getLastRow() === 0) {
    sheet
      .getRange(1, 1, 1, width)
      .setValues([RSVP_HEADER_ROW])
      .setFontWeight('bold')
    return
  }

  var row = sheet.getRange(1, 1, 1, width).getValues()[0]
  var i
  var mismatch = false
  for (i = 0; i < width; i++) {
    var cell = (row[i] || '').toString().trim()
    if (cell !== RSVP_HEADER_ROW[i]) {
      mismatch = true
      break
    }
  }

  // Catch "Timestamp" repeated in all columns even if trim somehow matched weirdly
  if (!mismatch && width > 1) {
    var first = (row[0] || '').toString().trim()
    var allSame = true
    for (i = 1; i < width; i++) {
      if ((row[i] || '').toString().trim() !== first) {
        allSame = false
        break
      }
    }
    if (allSame && first !== '') {
      mismatch = true
    }
  }

  if (mismatch) {
    sheet
      .getRange(1, 1, 1, width)
      .setValues([RSVP_HEADER_ROW])
      .setFontWeight('bold')
  }
}

/** Run from the Apps Script editor once to fix row 1 without submitting the form. */
function fixRsvpHeaders() {
  var sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME)
  if (!sheet) {
    createRsvpSheetIfNeeded()
    return
  }
  ensureCorrectHeaderRow(sheet)
}

function createRsvpSheetIfNeeded() {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID)
  var sheet = ss.getSheetByName(SHEET_NAME)
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME)
  }
  ensureCorrectHeaderRow(sheet)
}

function doPost(e) {
  try {
    if (!e || !e.parameter) {
      throw new Error('Invalid request')
    }

    var p = e.parameter
    var fullName = (p.full_name || '').toString().trim()
    var guestCount = parseInt(p.guest_count, 10)

    if (!fullName) {
      throw new Error('Full name is required')
    }
    if (isNaN(guestCount) || guestCount < 1 || guestCount > 6) {
      throw new Error('Guest count must be between 1 and 6')
    }

    var sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME)
    if (!sheet) {
      createRsvpSheetIfNeeded()
      sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME)
    }

    ensureCorrectHeaderRow(sheet)

    sheet.appendRow([new Date(), fullName, guestCount])

    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON)
  } catch (err) {
    var message = err.message || String(err)
    return ContentService.createTextOutput(
      JSON.stringify({ ok: false, error: message }),
    ).setMimeType(ContentService.MimeType.JSON)
  }
}

function doGet() {
  return ContentService.createTextOutput(
    JSON.stringify({ ok: true, message: 'RSVP endpoint is running. Use POST.' }),
  ).setMimeType(ContentService.MimeType.JSON)
}
