import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { SiteLayout } from '../components/SiteLayout'
import { PhotosSection } from '../components/sections/PhotosSection'
import { openPhotoUploadPicker } from '../lib/photoUploadUi'

export function PhotosPage() {
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    if (!location.state?.openUpload) return

    navigate('.', { replace: true, state: {} })
    const timer = window.setTimeout(openPhotoUploadPicker, 150)
    return () => window.clearTimeout(timer)
  }, [location.state, navigate])

  return (
    <SiteLayout>
      <PhotosSection />
    </SiteLayout>
  )
}
