import { useLocation, useNavigate } from 'react-router-dom'
import { openPhotoUploadPicker } from '../lib/photoUploadUi'

export function PhotoFab() {
  const location = useLocation()
  const navigate = useNavigate()

  function handleClick() {
    if (location.pathname === '/photos') {
      openPhotoUploadPicker()
      return
    }

    navigate('/photos', { state: { openUpload: true } })
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Add photos"
      className="from-boho-gold-light via-boho-gold to-boho-gold-foil fixed right-6 bottom-[max(1.5rem,env(safe-area-inset-bottom))] z-40 flex size-14 items-center justify-center rounded-full bg-gradient-to-br text-3xl font-light leading-none text-white shadow-lg transition hover:brightness-105 active:scale-95 sm:hidden"
    >
      <span aria-hidden="true">+</span>
    </button>
  )
}
