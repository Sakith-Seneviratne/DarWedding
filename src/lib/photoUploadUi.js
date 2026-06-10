export const PHOTO_UPLOAD_SECTION_ID = 'photo-upload'
export const PHOTO_FILE_INPUT_ID = 'photos'

export function openPhotoUploadPicker() {
  document.getElementById(PHOTO_UPLOAD_SECTION_ID)?.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  })
  document.getElementById(PHOTO_FILE_INPUT_ID)?.click()
}
