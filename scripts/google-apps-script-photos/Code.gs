/**
 * Guest photo uploads → Google Drive, with a JSON list endpoint for the site gallery.
 *
 * Setup:
 * 1. In Google Drive, create a folder for guest photos (or run createPhotosFolder() once
 *    from the editor and copy the logged folder ID).
 * 2. Paste the folder ID into PHOTOS_FOLDER_ID below.
 * 3. Deploy → New deployment → Type: Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 4. Copy the Web app URL and set VITE_PHOTOS_API_URL in your .env
 *
 * Endpoints (same deployment URL):
 *   GET  ?action=list   → { ok, photos: [{ id, name, imageName, guestName, message, uploadedAt, thumbnailUrl }] }
 *   POST action=upload  → file_data (base64), file_name, mime_type, guest_name (optional), message_to_couple (optional)
 */

var PHOTOS_FOLDER_ID = 'PASTE_YOUR_DRIVE_FOLDER_ID_HERE'

var MAX_BYTES = 10 * 1024 * 1024

function jsonOut(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON,
  )
}

/** Run once from the editor to create a folder; copy the ID from the execution log. */
function createPhotosFolder() {
  var folder = DriveApp.createFolder('DarWedding Guest Photos')
  Logger.log('Created folder. Set PHOTOS_FOLDER_ID to: ' + folder.getId())
  return folder.getId()
}

function doGet(e) {
  try {
    var action = ((e && e.parameter && e.parameter.action) || 'status').toString()
    if (action === 'list') {
      return listPhotos()
    }
    return jsonOut({
      ok: true,
      message: 'Photos API is running. Use GET ?action=list or POST to upload.',
    })
  } catch (err) {
    return jsonOut({ ok: false, error: err.message || String(err) })
  }
}

function doPost(e) {
  try {
    if (!e || !e.parameter) {
      throw new Error('Invalid request')
    }

    var action = (e.parameter.action || 'upload').toString()
    if (action === 'upload') {
      return uploadPhoto(e.parameter)
    }

    throw new Error('Unknown action')
  } catch (err) {
    return jsonOut({ ok: false, error: err.message || String(err) })
  }
}

function getPhotosFolder() {
  if (!PHOTOS_FOLDER_ID || PHOTOS_FOLDER_ID.indexOf('PASTE_') === 0) {
    throw new Error('PHOTOS_FOLDER_ID is not configured in Code.gs')
  }
  return DriveApp.getFolderById(PHOTOS_FOLDER_ID)
}

function uploadPhoto(p) {
  var fileData = p.file_data
  if (!fileData) {
    throw new Error('No file data')
  }

  var fileName = (p.file_name || 'photo.jpg').toString()
  var mimeType = (p.mime_type || 'image/jpeg').toString()
  var guestName = (p.guest_name || '').toString().trim()
  var message = (p.message_to_couple || '').toString().trim().substring(0, 500)

  if (mimeType.indexOf('image/') !== 0) {
    throw new Error('Only images are allowed')
  }

  var bytes = Utilities.base64Decode(fileData)
  if (bytes.length > MAX_BYTES) {
    throw new Error('File too large (max 10 MB)')
  }

  var blob = Utilities.newBlob(bytes, mimeType, fileName)
  var folder = getPhotosFolder()

  var safeGuest = guestName
    .replace(/[^a-zA-Z0-9 _-]/g, '')
    .trim()
    .substring(0, 50)
  var prefix = Utilities.formatDate(
    new Date(),
    Session.getScriptTimeZone(),
    'yyyyMMdd-HHmmss',
  )
  var finalName = prefix + (safeGuest ? ' - ' + safeGuest + ' - ' : ' - ') + fileName

  var file = folder.createFile(blob.setName(finalName))
  var meta = {}
  if (safeGuest) {
    meta.guestName = safeGuest
  }
  if (message) {
    meta.message = message
  }
  if (Object.keys(meta).length) {
    file.setDescription(JSON.stringify(meta))
  }
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW)

  return jsonOut({
    ok: true,
    id: file.getId(),
    thumbnailUrl: 'https://drive.google.com/thumbnail?id=' + file.getId() + '&sz=w600',
  })
}

function parsePhotoMeta(description) {
  var raw = (description || '').toString().trim()
  if (!raw) {
    return { guestName: '', message: '' }
  }

  try {
    var parsed = JSON.parse(raw)
    if (parsed && typeof parsed === 'object') {
      return {
        guestName: (parsed.guestName || '').toString().trim(),
        message: (parsed.message || '').toString().trim(),
      }
    }
  } catch (parseErr) {
    // Legacy plain-text descriptions stored only the guest name.
  }

  return { guestName: raw, message: '' }
}

function originalImageNameFromDriveName(name) {
  var match = name.match(/^\d{8}-\d{6} - (.+)$/)
  if (!match) {
    return name
  }

  var rest = match[1]
  var lastSep = rest.lastIndexOf(' - ')
  if (lastSep === -1) {
    return rest
  }

  return rest.substring(lastSep + 3)
}

function guestNameFromFileName(name) {
  var match = name.match(/^\d{8}-\d{6} - (.+)$/)
  if (!match) {
    return ''
  }

  var rest = match[1]
  var lastSep = rest.lastIndexOf(' - ')
  if (lastSep === -1) {
    return ''
  }

  var guest = rest.substring(0, lastSep).trim()
  if (!guest || /\.(jpe?g|png|webp|gif|heic|heif)$/i.test(guest)) {
    return ''
  }

  return guest
}

function listPhotos() {
  var folder = getPhotosFolder()
  var files = folder.getFiles()
  var photos = []

  while (files.hasNext()) {
    var file = files.next()
    if (file.getMimeType().indexOf('image/') !== 0) {
      continue
    }

    try {
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW)
    } catch (shareErr) {
      // Continue — file may already be shared.
    }

    var fileName = file.getName()
    var meta = parsePhotoMeta(file.getDescription())
    var guestName = meta.guestName
    var message = meta.message
    if (!guestName) {
      guestName = guestNameFromFileName(fileName)
    }

    photos.push({
      id: file.getId(),
      name: fileName,
      imageName: originalImageNameFromDriveName(fileName),
      guestName: guestName,
      message: message,
      uploadedAt: file.getDateCreated().toISOString(),
      thumbnailUrl:
        'https://drive.google.com/thumbnail?id=' + file.getId() + '&sz=w600',
    })
  }

  photos.sort(function (a, b) {
    return new Date(b.uploadedAt) - new Date(a.uploadedAt)
  })

  return jsonOut({ ok: true, photos: photos })
}
