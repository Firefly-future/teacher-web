import React from 'react'

import { Drawer, Form, Input, Select, Space, Button, Flex, Tooltip, type FormProps, type DrawerProps } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'

interface DrawProps {
  open: boolean
  onClose: () => void
  onFinish: FormProps<any>['onFinish']  // 表单提交回调
  size: DrawerProps['size']             // 抽屉尺寸
  options: { label: string; value: string }[]  // 菜单等级选项
  form: any        // Form 实例
  path: string                               // 路径输入值
  setPath: (value: string) => void           // 更新路径的方法
}

// // 校验函数
const checkPath = (_: any, value: string) => {
  if (!value) return Promise.reject(new Error('请输入路径'))
  if (!/^(\/[A-Za-z]+)+$/.test(value)) {
    return Promise.reject(new Error('路径必须以 / 开头，且只能包含英文字母'))
  }
  return Promise.resolve()
}

const Draw = ({ open, onClose, onFinish, size, options, form, path, setPath }: DrawProps) => {  
  return (
    <Drawer
      title={'添加菜单'}
      size={size}
      onClose={onClose}
      open={open}
      footer={
        <Flex justify='flex-end'>
          <Space>
            <Button onClick={onClose}>取消</Button>
            <Button type='primary' onClick={() => form.submit()}>
              确认
            </Button>
          </Space>
        </Flex>
      }
    >
      <Form form={form} layout='vertical' onFinish={onFinish}>
        <Flex vertical>
          <Form.Item
            label='选择菜单等级'
            name='level'
            rules={[{ required: true }]}
            labelCol={{ span: 20 }}
          >
            <Select
              placeholder='请选择'
              style={{ width: 260 }}
              options={options}
            />
          </Form.Item>
          <Flex>
            <Space>
              <Form.Item
                label={
                  <Tooltip title='菜单名称，用于显示在菜单中'>
                    <span>
                      菜单名字 <QuestionCircleOutlined />
                    </span>
                  </Tooltip>
                }
                name='name'
                rules={[{ required: true }]}
                style={{ width: 260 }}
              >
                <Input placeholder='请输入名称' />
              </Form.Item>
              <Form.Item
                label='状态'
                name='status'
                rules={[{ required: true }]}
                style={{ width: 120 }}
              >
                <Select
                  placeholder='请选择'
                  style={{ width: 120 }}
                  options={[
                    {
                      label: '禁用',
                      value: 0,
                    },
                    {
                      label: '可用',
                      value: 1,
                    },
                  ]}
                />
              </Form.Item>
              <Form.Item
                label='权限类型'
                name='isBtn'
                rules={[{ required: true }]}
                style={{ width: 120 }}
              >
                <Select
                  placeholder='请选择'
                  style={{ width: 120 }}
                  options={[
                    {
                      label: '页面',
                      value: false,
                    },
                    {
                      label: '按钮',
                      value: true,
                    },
                  ]}
                />
              </Form.Item>
            </Space>
          </Flex>
          <Form.Item
            label={
              <Tooltip title='路径格式：/path'>
                <span>
                  路径 <QuestionCircleOutlined />
                </span>
              </Tooltip>
            }
            name='path'
            rules={[{ required: true, validator: checkPath }]}
            style={{ width: 260 }}
          >
            <Input
              placeholder='请输入路径'
              onChange={(e) => {
                if (path) {
                  checkPath(null, e.target.value)
                }
              }}
            />
          </Form.Item>
        </Flex>
      </Form>
    </Drawer>
  )
}

export default Draw
