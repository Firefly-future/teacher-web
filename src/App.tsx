import React, { Suspense, useEffect } from 'react'
import router from './router'
import { useLocation, useRoutes } from 'react-router-dom'
import userStore from './store/userStore'
import { Spin } from 'antd'

const App = () => {
  const getUserInfo = userStore((state) => state.getUserInfo)
  const location = useLocation()

  useEffect(() => {
    if (location.pathname !== '/login') {
      getUserInfo()
    }
  }, [])
  return (
    <Suspense fallback={<Spin size="large" style={{ width: '100vw',height: '100vh',display: 'flex',justifyContent: 'center',alignItems: 'center' }} />}>
      {useRoutes(router)}
    </Suspense>
  )
}

export default App
