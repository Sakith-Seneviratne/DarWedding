import { Route, Routes } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { PhotosPage } from './pages/PhotosPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/photos" element={<PhotosPage />} />
    </Routes>
  )
}
