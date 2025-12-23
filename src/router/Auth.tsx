import { Navigate } from "react-router-dom"
import { getToken } from "@/utils"


const Auth = ({ children }: { children: React.ReactNode }) => {
  const token = getToken()
  if (!token) {
    return <Navigate to="/login" />
  }
  return children
}

export default Auth