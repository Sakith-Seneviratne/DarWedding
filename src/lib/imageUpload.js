const MAX_UPLOAD_BYTES = 10 * 1024 * 1024
const MAX_WIDTH = 1920
const JPEG_QUALITY = 0.85

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(reader.error ?? new Error('Could not read file'))
    reader.readAsDataURL(file)
  })
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('Could not load image'))
    img.src = src
  })
}

function canvasToJpegBlob(canvas, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Could not compress image'))
          return
        }
        resolve(blob)
      },
      'image/jpeg',
      quality,
    )
  })
}

/**
 * Resize large photos and re-encode as JPEG to keep uploads within Apps Script limits.
 * GIF and formats the browser cannot decode are returned unchanged.
 */
export async function prepareImageForUpload(file) {
  if (!file.type.startsWith('image/')) {
    throw new Error('Only image files are allowed')
  }

  if (file.type === 'image/gif') {
    if (file.size > MAX_UPLOAD_BYTES) {
      throw new Error('GIF must be under 10 MB')
    }
    return file
  }

  let dataUrl
  try {
    dataUrl = await readFileAsDataUrl(file)
    const img = await loadImage(dataUrl)

    const scale = Math.min(1, MAX_WIDTH / Math.max(img.width, img.height))
    const width = Math.max(1, Math.round(img.width * scale))
    const height = Math.max(1, Math.round(img.height * scale))

    if (scale === 1 && file.type === 'image/jpeg' && file.size <= MAX_UPLOAD_BYTES) {
      return file
    }

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      throw new Error('Could not process image')
    }
    ctx.drawImage(img, 0, 0, width, height)

    const blob = await canvasToJpegBlob(canvas, JPEG_QUALITY)
    if (blob.size > MAX_UPLOAD_BYTES) {
      throw new Error('Image is still too large after compression (max 10 MB)')
    }

    const baseName = file.name.replace(/\.[^.]+$/, '') || 'photo'
    return new File([blob], `${baseName}.jpg`, { type: 'image/jpeg' })
  } catch {
    if (file.size > MAX_UPLOAD_BYTES) {
      throw new Error('Image must be under 10 MB')
    }
    return file
  }
}

export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result
      if (typeof result !== 'string') {
        reject(new Error('Could not read file'))
        return
      }
      const comma = result.indexOf(',')
      resolve(comma >= 0 ? result.slice(comma + 1) : result)
    }
    reader.onerror = () => reject(reader.error ?? new Error('Could not read file'))
    reader.readAsDataURL(file)
  })
}

export async function uploadPhotoToDrive({
  apiUrl,
  file,
  guestName,
  messageToCouple = '',
}) {
  const prepared = await prepareImageForUpload(file)
  const fileData = await fileToBase64(prepared)

  const body = new URLSearchParams({
    action: 'upload',
    file_data: fileData,
    file_name: prepared.name,
    mime_type: prepared.type,
    guest_name: guestName.trim(),
    message_to_couple: messageToCouple.trim(),
  })

  const res = await fetch(apiUrl.trim(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
    body: body.toString(),
  })

  const data = await res.json().catch(() => null)
  if (!res.ok || !data?.ok) {
    const msg =
      (typeof data?.error === 'string' && data.error) ||
      (typeof data?.message === 'string' && data.message) ||
      'Upload failed. Please try again.'
    throw new Error(msg)
  }

  return data
}
