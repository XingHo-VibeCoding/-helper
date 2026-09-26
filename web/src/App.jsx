import { NavLink, Outlet, useLocation } from 'react-router-dom'
import OceanScene from './components/OceanScene.jsx'

// 组织者页面路径:导航只在这些页面显示
// 学生能接触到的只有 /form(根网址/输错网址都会跳过去),导航对学生完全隐藏
const ORGANIZER_PATHS = ['/home', '/workbench', '/overview']

export default function App() {
  const { pathname } = useLocation()
  const isOrganizer = ORGANIZER_PATHS.includes(pathname)

  return (
    <div className="app">
      <OceanScene />
      <header className="app-header">
        <span className="brand">xinghe-helper</span>
        {isOrganizer && (
          <nav className="app-nav">
            <NavLink to="/home" className={({ isActive }) => (isActive ? 'active' : '')}>
              入口
            </NavLink>
            <NavLink to="/form" className={({ isActive }) => (isActive ? 'active' : '')}>
              填写页
            </NavLink>
            <NavLink to="/workbench" className={({ isActive }) => (isActive ? 'active' : '')}>
              分房工作台
            </NavLink>
            <NavLink to="/overview" className={({ isActive }) => (isActive ? 'active' : '')}>
              名单总览
            </NavLink>
          </nav>
        )}
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  )
}
