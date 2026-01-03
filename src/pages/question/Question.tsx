import React from 'react'
import { Outlet } from 'react-router-dom'
import { useLocation } from 'react-router-dom'

const Question = () => {
  const location = useLocation()
  return (
    <div>
      {location.pathname === '/question' && <h1>此处为题库管理</h1>}
      <Outlet />
    </div>
  )
}

export default Question