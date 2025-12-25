import React, { useEffect } from "react"
import router from "./router"
import { useLocation, useRoutes } from "react-router-dom"
import userStore from "./store/userStore"

const App = () => {
  const getUserInfo = userStore((state) => state.getUserInfo)
  const location = useLocation()

  useEffect(() => {
    if (location.pathname !== "/login") {
      getUserInfo()
    }
  }, [])
  return useRoutes(router)
}

export default App
