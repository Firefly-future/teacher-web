import React from "react"
import { SmileOutlined } from "@ant-design/icons"
import { Button, Result } from "antd"
import { useNavigate } from "react-router-dom"
const Welcome = () => {
  const navigate = useNavigate()
  return (
    <Result
      icon={<SmileOutlined />}
      title="欢迎来到系统"
      extra={<Button type="primary" onClick={() => navigate("/dashboard")}>进入系统</Button>}
    />
  )
}

export default Welcome
