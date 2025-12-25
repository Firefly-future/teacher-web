import React from 'react'
import { Outlet } from 'react-router-dom'
import { useLocation } from 'react-router-dom'

const Exercise = () => {
  const location = useLocation()
  return (
    <div>
      {location.pathname === '/paper' && <h1>此处为试卷管理</h1>}
      <Outlet />
    </div>
  )
}

export default Exercise