import React from 'react'
import { Outlet } from 'react-router-dom'
import { useLocation } from 'react-router-dom'

const Test = () => {
  const location = useLocation()
  return (
    <div>
      {location.pathname === '/exam' && <h1>此处为考试管理</h1>}
      <Outlet />
    </div>
  )
}

export default Test