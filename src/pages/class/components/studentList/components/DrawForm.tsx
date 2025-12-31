import React from 'react'
import { Button, Drawer, Flex, InputNumber, message, Select, Space } from 'antd'
import type { DrawerProps } from 'antd'
import type { FormProps } from 'antd'
import { Form, Input } from 'antd'
import type { ClassListRes, CreateStudentParams } from '@/services/types'
import { createStudent } from '@/services'
import { API_CODE } from '@/constants/Constants'

interface DrawerFormProps {
  open: boolean
  size?: DrawerProps['size']
  onClose: () => void
  actionRef?: React.MutableRefObject<any>
  classList?: ClassListRes['list']
}
const DrawerForm: React.FC<DrawerFormProps> = ({
  open,
  size,
  onClose,
  actionRef,
  classList,
}) => {
  const [form] = Form.useForm()
  const onFinish: FormProps<CreateStudentParams>['onFinish'] = (values) => {
    console.log('Success:', values)
  }

  const onFinishFailed: FormProps<CreateStudentParams>['onFinishFailed'] = (
    errorInfo
  ) => {
    console.log('Failed:', errorInfo)
  }
  const onHandleOk = () => {
    const values = form.getFieldsValue()
    console.log(values)
    const params = {
      ...values,
      avator: values.avator || '',
      password: values.password || 123,
      status: values.status || 1,
    }
    createStudent(params).then((res) => {
      if (res.code === API_CODE.SUCCESS) {
        message.success('新增学生成功')
        actionRef?.current?.reload()
        onClose()
      } else {
        message.error(res.msg || '新建学生失败')
        onClose()
      }
    })
  }
  return (
    <>
      <Drawer
        title='添加学生'
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
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete='off'
        >
          <Flex gap={20}>
            <Form.Item<CreateStudentParams>
              label='姓名'
              name='username'
              tooltip='最长为24位'
              rules={[{ required: true, message: '请输入名称' }]}
            >
              <Input placeholder='请输入名称' />
            </Form.Item>
            <Form.Item<CreateStudentParams>
              label='性别'
              name='sex'
              rules={[{ required: true, message: '请选择' }]}
            >
              <Select
                placeholder='请选择'
                style={{ width: 100 }}
                options={[
                  {
                    label: '男',
                    value: 1,
                  },
                  {
                    label: '女',
                    value: 0,
                  },
                ]}
              />
            </Form.Item>
            <Form.Item<CreateStudentParams>
              label='年龄'
              name='age'
              tooltip='最长为3位'
              rules={[{ required: true, message: '请输入真实年龄' }]}
            >
              <InputNumber placeholder='请输入年龄' maxLength={3} />
            </Form.Item>
          </Flex>
          <Flex>
            <Form.Item<CreateStudentParams>
              label='身份证号'
              name='idCard'
              tooltip='最长为18位'
              style={{ flex: 1 }}
              rules={[{ required: true, message: '请输入正确的身份证号' }]}
            >
              <InputNumber placeholder='请输入正确的身份证号' maxLength={18} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item<CreateStudentParams>
              label='邮箱'
              name='email'
              tooltip='最长为24位'
              style={{ flex: 1 , marginLeft: 10 }}
              rules={[{ required: true, message: '请输入邮箱', type: 'email' }]}
            >
              <Input placeholder='请输入邮箱' />
            </Form.Item>
          </Flex>
          <Form.Item<CreateStudentParams>
            label='班级名称'
            name='className'
            rules={[{ required: true, message: '请选择班级' }]}
          >
            <Select
              placeholder='请选择'
              style={{ width: 200 }}
              options={classList?.map((item) => ({
                label: item.name,
                value: item._id,
              }))}
            />
          </Form.Item>
        </Form>
      </Drawer>
    </>
  )
}

export default DrawerForm
