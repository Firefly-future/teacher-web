import { Navigate, useLocation } from 'react-router-dom'
import { getToken } from '@/utils'
import userStore from '@/store/userStore'
import { Spin } from 'antd'

const WHITE_LIST = ['/','/dashboard']

const Auth = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation()
  const permission = userStore((state) => state.userInfo?.permission)
  console.log(permission, location.pathname)
  const token = getToken()
  if (!token) {
    return <Navigate to="/login" replace />
  }
  if (WHITE_LIST.includes(location.pathname)) return <>{children}</>
  if (!permission)
    return (
      <Spin
        spinning={true}
        style={{
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      />
    )
  const hasPermission = permission.some(
    (item) => item.path === location.pathname
  )
  if (!hasPermission) return <Navigate to="/403" replace />
  return children
}

export default Auth
