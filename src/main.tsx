import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import ChatPage from './pages/ChatPage'
import RecordPage from './pages/RecordPage'
import RecordListPage from './pages/RecordListPage'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ChatPage />} />
        <Route path="/record" element={<RecordPage />} />
        <Route path="/recordings" element={<RecordListPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
