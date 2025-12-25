import React from 'react'
import { Outlet } from 'react-router-dom'
import { useLocation } from 'react-router-dom'

const Class = () => {
  const location = useLocation()
  return (
    <div>
      {location.pathname === '/manage-group' && <h1>此处为班级管理</h1>}
      <Outlet />
    </div>
  )
}

export default Class