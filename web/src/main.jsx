import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import App from './App.jsx'
import Home from './pages/Home.jsx'
import StudentForm from './pages/StudentForm.jsx'
import Workbench from './pages/Workbench.jsx'
import Overview from './pages/Overview.jsx'
import './styles/global.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<App />}>
          {/* 学生只会落在填写页:根网址、输错网址一律跳 /form */}
          <Route path="/" element={<Navigate to="/form" replace />} />
          <Route path="/form" element={<StudentForm />} />
          {/* 组织者入口:不在导航外露面,手动输网址/书签进入 */}
          <Route path="/home" element={<Home />} />
          <Route path="/workbench" element={<Workbench />} />
          <Route path="/overview" element={<Overview />} />
          <Route path="*" element={<Navigate to="/form" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
