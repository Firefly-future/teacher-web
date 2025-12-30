import React, { Suspense, useEffect } from 'react'
import router from './router'
import { useLocation, useRoutes } from 'react-router-dom'
import userStore from './store/userStore'
import Loading from '@/components/Loading'
const App = () => {
  const getUserInfo = userStore((state) => state.getUserInfo)
  const location = useLocation()

  useEffect(() => {
    if (location.pathname !== '/login') {
      getUserInfo()
    }
  }, [])
  return (
    <Suspense fallback={<Loading />}>
      {useRoutes(router)}
    </Suspense>
  )
}

export default App
