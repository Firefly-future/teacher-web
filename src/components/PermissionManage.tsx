import React from 'react'
import userStore from '@/store/userStore'

interface Props {
  perkey:string
  children:React.ReactNode
}

const PermissionManage:React.FC<Props> = (props) => {
  const permission = userStore((state) => state.userInfo?.permission)
  if(permission?.find((item) => item.path === props.perkey)){
    return props.children
  }
  return null
}

export default PermissionManage
