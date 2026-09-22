import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import StudentForm from './pages/StudentForm.jsx'
import Workbench from './pages/Workbench.jsx'
import Overview from './pages/Overview.jsx'
import './styles/global.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<App />}>
          <Route path="/form" element={<StudentForm />} />
          <Route path="/workbench" element={<Workbench />} />
          <Route path="/overview" element={<Overview />} />
          <Route path="*" element={<StudentForm />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
