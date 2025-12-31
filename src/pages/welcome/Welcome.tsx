import React from 'react'
import { SmileOutlined } from '@ant-design/icons'
import { Button, Result } from 'antd'
import { useNavigate } from 'react-router-dom'
import userStore from '@/store/userStore'
const Welcome = () => {
  const getUserInfo = userStore((state) => state.userInfo)
  const navigate = useNavigate()
  return (
    <Result
      icon={<SmileOutlined />}
      title={`欢迎来到${getUserInfo?.role?.[0]?.name}系统，${getUserInfo?.username || '用户'}`}
      extra={<Button type="primary" onClick={() => navigate('/dashboard')}>进入系统</Button>}
    />
  )
}

export default Welcome
