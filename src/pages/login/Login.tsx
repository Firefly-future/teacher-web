import React, { useEffect, useState } from 'react'
import style from './login.module.scss'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Flex, Form, Input, message } from 'antd'
import { useNavigate } from 'react-router-dom'
import type { LoginParams } from '@/services/types'
import { API_CODE } from '@/constants/Constants'
import { setToken } from '@/utils'
import { getCaptchaCode, getLogin } from '@/services'
import userStore from '@/store/userStore'
const Login = () => {
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [captcha, setCaptcha] = useState('')
  const getUserInfo = userStore((state) => state.getUserInfo)
  const getCaptcha = async () => {
    try {
      const res = await getCaptchaCode()
      console.log(res.data)
      if (res.data.code === API_CODE.SUCCESS) {
        setCaptcha(res.data.data.code)
      } else {
        message.error(res.data.msg)
      }
    } catch (e) {
      console.log(e)
    }
  }

  const onFinish = async (values: LoginParams) => {
    console.log(values)
    try {
      setLoading(true)
      const res = await getLogin(values)
      console.log(res.data)
      if (res.data.code === API_CODE.SUCCESS) {
        message.success('登录成功')
        setToken(res.data.data.token)
        getUserInfo()
        navigate('/')
      } else if (res.data.code === API_CODE.EXPIRED_CAPTCHA) {
        message.error(res.data.msg)
        getCaptcha()
      }
    } catch (e) {
      console.log(e)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    getCaptcha()
  }, [])

  return (
    <div className={style.login}>
      <Form
        form={form}
        name="login"
        initialValues={{ remember: true }}
        style={{
          width: 360,
          border: '1px solid #ccc',
          padding: 20,
          backgroundColor: '#f5f5f5',
          borderRadius: 20,
        }}
        onFinish={onFinish}
      >
        <Form.Item style={{ textAlign: 'center' }}>
          <h2>登录考试系统教师端</h2>
        </Form.Item>
        <Form.Item
          name="username"
          rules={[{ required: true, message: '请输入用户名!' }]}
        >
          <Input prefix={<UserOutlined />} placeholder="用户名" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: '请输入密码!' }]}
        >
          <Input prefix={<LockOutlined />} type="password" placeholder="密码" />
        </Form.Item>
        <Form.Item
          name="code"
          rules={[{ required: true, message: '请输出验证码' }]}
        >
          <Flex>
            <Input placeholder="验证码" />
            <img
              src={captcha || undefined}
              onClick={getCaptcha}
              style={{
                width: 100,
                height: 32,
                flexShrink: 0,
                borderRadius: 6,
                background: '#FFFDF7',
                marginLeft: 10,
              }}
            />
          </Flex>
        </Form.Item>
        <Form.Item>
          <Button block type="primary" htmlType="submit" loading={loading}>
            登录
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default Login
