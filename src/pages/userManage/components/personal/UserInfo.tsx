import { useState, useEffect } from 'react'
import PictureUp from './PictureUp'
import userStore from '@/store/userStore'
import { Button, Flex, Form, Input, message, Select } from 'antd'
import { updateUserInfo } from '@/services'
import { API_CODE } from '@/constants/Constants'
import SexEnum from '@/constants/SexEnum'

const UserInfo = () => {
  const userInfo = userStore((state) => state.userInfo)
  const [form] = Form.useForm()
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [userInfoAvator, setUserInfoAvator] = useState(userInfo!.avator)
  // 进入编辑时，把远端数据一次性灌进表单
  useEffect(() => {
    if (editing) {
      form.setFieldsValue({
        username: userInfo?.username || '',
        sex: userInfo?.sex || '',
        age: userInfo?.age || '',
        email: userInfo?.email || '',
      })
    }
  }, [editing, userInfo, form])
  const save = async () => {
    try {
      setLoading(true)
      const res = await updateUserInfo({
        ...form.getFieldsValue(),
        id: userInfo?._id || '',
        password: userInfo?.password || '',
      })
      if (res.code === API_CODE.SUCCESS) {
        message.success('更新成功')
        userStore.setState({ userInfo: res.data })
        setEditing(false)
      } else {
        message.error(res.msg)
      }
    } catch (e) {
      console.log(e)
    } finally {
      setLoading(false)
    }
  }

  // 纯文本展示
  const renderText = (val: any) => (
    <span style={{ lineHeight: '32px' }}>{val ?? ''}</span>
  )

  return (
    <div style={{ padding: 20 }}>
      <PictureUp
        onAvatarChange={setUserInfoAvator}
        initialAvatar={userInfoAvator}
      />
      <Form
        form={form}
        style={{ maxWidth: '100%', marginTop: 20 }}
      >
        <Flex justify='space-around'>
          <Form.Item label='用户名称' style={{ flex: 1 }}>
            {editing ? (
              <Form.Item name='username' noStyle>
                <Input />
              </Form.Item>
            ) : (
              renderText(userInfo!.username)
            )}
          </Form.Item>

          <Form.Item label='性别' style={{ flex: 1 }}>
            {editing ? (
              <Form.Item name='sex' noStyle>
                <Select
                  options={[
                    { label: '男', value: 1 },
                    { label: '女', value: 0 },
                  ]}
                />
              </Form.Item>
            ) : (
              renderText(SexEnum[userInfo!.sex])
            )}
          </Form.Item>

          <Form.Item label='年龄' style={{ flex: 1 }}>
            {editing ? (
              <Form.Item name='age' noStyle>
                <Input />
              </Form.Item>
            ) : (
              renderText(userInfo!.age || '')
            )}
          </Form.Item>
        </Flex>

        {/* 邮箱 */}
        <Form.Item label='邮箱地址' style={{ width: 300 }}>
          {editing ? (
            <Form.Item name='email' noStyle>
              <Input />
            </Form.Item>
          ) : (
            renderText(userInfo?.email || '')
          )}
        </Form.Item>

        {/* 操作按钮 */}
        <Form.Item>
          {!editing ? (
            <Button type='primary' onClick={() => setEditing(true)}>
              点击编辑
            </Button>
          ) : (
            <Flex gap={12}>
              <Button type='primary' onClick={save} loading={loading}>
                保存
              </Button>
              <Button
                onClick={() => {
                  form.resetFields()
                  setEditing(false)
                }}
              >
                取消
              </Button>
            </Flex>
          )}
        </Form.Item>
      </Form>
    </div>
  )
}

export default UserInfo
