import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'

const System = () => {
  const location = useLocation()
  return (
    <div>
      {location.pathname === '/userManage' && <h1>此处为系统管理</h1>}
      <Outlet />
    </div>
  )
}

export default System