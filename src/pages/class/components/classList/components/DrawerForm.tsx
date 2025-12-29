import React, { useState } from 'react'
import { Button, Drawer, Flex, message, Select, Space } from 'antd'
import type { DrawerProps } from 'antd'
import type { FormProps } from 'antd'
import { Checkbox, Form, Input } from 'antd'
import type { ClassifyListRes, UserListResponse } from '@/services/types'
import { createClass } from '@/services'
import { API_CODE } from '@/constants/Constants'

interface DrawerFormProps {
  open: boolean
  size?: DrawerProps['size']
  onClose: () => void
  classifyList?: ClassifyListRes['list']
  teacherList?: UserListResponse['list']
  actionRef?: React.MutableRefObject<any> 
}

type FieldType = {
  name?: string
  teacher?: string
  classify?: string
  students?: string[] | number[] | []
}

const DrawerForm: React.FC<DrawerFormProps> = ({
  open,
  size,
  onClose,
  classifyList,
  teacherList,
  actionRef,
}) => {
  const [form] = Form.useForm()
  const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    console.log('Success:', values)
  }

  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (
    errorInfo
  ) => {
    console.log('Failed:', errorInfo)
  }
  const onHandleOk = () => {
    const values = form.getFieldsValue()
    if (!values.students) {
      values.students = []
    }
    console.log(values)
    createClass(values).then((res) => {
      if (res.code === API_CODE.SUCCESS) {
        message.success('新建班级成功')
        actionRef?.current?.reload()
        onClose()
      } else {
        message.error(res.msg || '新建班级失败')
        onClose()
      }
    })
  }
  return (
    <>
      <Drawer
        title='新建班级'
        placement='right'
        size={size}
        onClose={onClose}
        open={open}
        footer={
          <Space style={{ float: 'right' }}>
            <Button onClick={onClose}>取消</Button>
            <Button type='primary' onClick={onHandleOk}>
              确定
            </Button>
          </Space>
        }
      >
        <Form
          form={form}
          // labelCol={{ span: 8 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete='off'
        >
          <Flex gap={20}>
            <Form.Item<FieldType>
              label='班级名称'
              name='name'
              rules={[{ required: true, message: '请输入名称' }]}
            >
              <Input placeholder='请输入名称' />
            </Form.Item>

            <Form.Item<FieldType>
              label='老师'
              name='teacher'
              rules={[{ required: true, message: '请选择' }]}
            >
              <Select
                placeholder='请选择'
                style={{ width: 100 }}
                options={teacherList?.map((item) => ({
                  label: item.username,
                  value: item._id,
                }))}
              />
            </Form.Item>
          </Flex>
          <Form.Item<FieldType>
            label='班级进度'
            name='classify'
            rules={[{ required: true, message: '请选择' }]}
          >
            <Select
              placeholder='请选择'
              style={{ width: 100 }}
              options={classifyList?.map((item) => ({
                label: item.name,
                value: item._id,
              }))}
            />
          </Form.Item>
          <Form.Item<FieldType> label='学生' name='students' hidden={true}>
            <Input placeholder='请输入学生ID' />
          </Form.Item>
        </Form>
      </Drawer>
    </>
  )
}

export default DrawerForm
