/**
 * Daniel Photo - App Component
 * Main router setup
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import HomePage from './pages/HomePage'
import GalleryPage from './pages/GalleryPage'

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/gallery/:slug" element={<GalleryPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
