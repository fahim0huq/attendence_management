import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import AttendanceLog from './AttendanceLog.jsx'
import EditStudent from './EditStudent.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/attendance/:matricId" element={<AttendanceLog />} />
      <Route path="/edit/:matricId" element={<EditStudent />} />    </Routes>
  </BrowserRouter>
)
