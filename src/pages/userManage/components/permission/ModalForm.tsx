import React from 'react'
import { Modal, Form, Input, Select } from 'antd'

interface ModalFormProps {
  openEdit: boolean
  confirmLoading: boolean
  handleCancel: () => void
  form: any // 精确的 Form 实例类型
  onFinish: (values: any) => void // 定义为异步函数
}

const ModalForm = ({
  openEdit,
  confirmLoading,
  handleCancel,
  form,
  onFinish,
}: ModalFormProps) => {
  const checkPath = (_: any, value: string) => {
    if (!value) return Promise.reject(new Error('请输入路径'))

    // 检查是否以 / 开头
    if (!value.startsWith('/')) {
      return Promise.reject(new Error('路径必须以 / 开头'))
    }
    if (/(\/\/|--)/.test(value)) {
      return Promise.reject(new Error('路径中不能连续出现 / 或 -'))
    }
    if (!/^\/[a-zA-Z]+(?:[/-][a-zA-Z]+)*$/.test(value)) {
      return Promise.reject(
        new Error(
          '路径格式不正确：必须以/开头，后面可包含字母、/、-，但不能连续出现/或-'
        )
      )
    }
    return Promise.resolve()
  }
  const handleModalOk = () => {
    form.submit() // 关键：调用 Form 的 submit 方法，触发 onFinish
  }
  return (
    <Modal
      title='编辑菜单'
      open={openEdit}
      onOk={handleModalOk}
      confirmLoading={confirmLoading}
      onCancel={handleCancel}
    >
      <Form form={form} onFinish={onFinish}>
        <Form.Item label='菜单名称' name='name' rules={[{ required: true }]}>
          <Input placeholder='请输入名称' />
        </Form.Item>
        <Form.Item label='菜单路径' name='path' rules={[{ required: true, validator: checkPath }]}>
          <Input placeholder='请输入路径' />
        </Form.Item>
        <Form.Item label='权限类型' name='isBtn' rules={[{ required: true }]}>
          <Select
            placeholder='请选择'
            options={[
              {
                label: '按钮',
                value: true,
              },
              {
                label: '页面',
                value: false,
              },
            ]}
          />
        </Form.Item>
        <Form.Item name='_id' hidden>
          <Input />
        </Form.Item>
        <Form.Item name='pid' hidden>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default ModalForm
