import { NavLink, Outlet } from 'react-router-dom'

export default function App() {
  return (
    <div className="app">
      <header className="app-header">
        <span className="brand">xinghe-helper</span>
        <nav className="app-nav">
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
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  )
}
