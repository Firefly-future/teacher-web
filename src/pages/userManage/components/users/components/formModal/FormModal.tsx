import React,{useEffect, useMemo, useState} from 'react'
import { Modal, Form, Input,Select,message  } from 'antd'
import type { UserListItem, CreateUserParams } from '@/services/types'
import {createUser, updateUser, getRoleList} from '@/services/index'
import { useRequest } from 'ahooks'
import {API_CODE} from '@/constants/Constants'

interface Props {
  showModal: boolean
  onClose: () => void
  onSuccess?: () => void
  updateItem: UserListItem | null
}

type FieldType = Partial<CreateUserParams>

const FormModal:React.FC<Props> = ({
  showModal,
  onClose,
  onSuccess,
  updateItem
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const { data: roleRes } = useRequest(getRoleList)

  const title = updateItem === null ? '创建用户' : '编辑用户'

  const roleOptions = useMemo(()=>{
    return roleRes?.data.list.map(item=>({
      label: item.name,
      value: item.value
    })) ?? []
  },[roleRes])

  useEffect(()=>{
    setIsModalOpen(showModal)
    if(showModal){
      if (showModal && updateItem === null) {
        form.resetFields()
      }else{
        form.setFieldsValue({...updateItem})
      }
    }
  },[showModal, form, updateItem])

  const handleOk = async () => {
    try{
      const values = await form.validateFields()
      setLoading(true)
      console.log(values)
      const res = await createUser(values)
      console.log(res)
      if(res.code === API_CODE.SUCCESS){
        message.success('创建用户成功')
        onSuccess?.()
      }else{
        message.error(res.msg)
      }
      setIsModalOpen(false)
      onClose()
    }catch(e){
      message.error('网络错误，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  const updateOk = async ()=>{
    try{
      const values = await form.validateFields()
      setLoading(true)
      console.log(values)
      const res = await updateUser({...values,id: updateItem!._id})
      console.log(res)
      if(res.code === API_CODE.SUCCESS){
        message.success('更新用户成功')
        onSuccess?.()
      }else{
        message.error(res.msg)
      }
      setIsModalOpen(false)
      onClose()
    }catch(e){
      message.error('网络错误，请稍后重试')
    }finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setIsModalOpen(false)
    onClose()
  }

  const submit = ()=>{
    if(updateItem === null){
      handleOk()
    }else{
      updateOk()
    }
  }

  return (
    <Modal
      title = {title}
      closable = {true}
      open = {isModalOpen}
      onOk = {submit}
      cancelText = "取消"
      okText = "确定"
      onCancel = {handleCancel}
      confirmLoading = {loading}
    >
      <Form
        name = {updateItem === null ? 'basic1' : 'basic2'}
        labelCol = {{ span: 6 }}
        wrapperCol = {{ span: 16 }}
        form = {form}
        autoComplete = "off"
      >
        <Form.Item<FieldType>
          label = "用户名"
          name = "username"
          rules = {[{ required: true, message: '请输入用户名!' }]}
        >
          <Input placeholder = '用户名' />
        </Form.Item>

        <Form.Item<FieldType>
          label = "密码"
          name = "password"
          rules = {[{ required: true, message: '请输入密码!' }]}
        >
          <Input.Password placeholder='密码' />
        </Form.Item>

        <Form.Item<FieldType>
          label = "用户角色"
          name = "role"
          rules = {[{ required: true, message: '请选择角色名!' }]}
        >
          <Select
            mode = "multiple"
            placeholder = "选择角色"
            options = {roleOptions}
          />
        </Form.Item>

        <Form.Item<FieldType>
          label = "年龄"
          name = "age"
          rules = {[
            { required: true, message: '请输入年龄!' },
            { min: 1, max: 120, message: '年龄需在1-120之间' }
          ]}
        >
          <Input placeholder='年龄' type="number" />
        </Form.Item>

        <Form.Item<FieldType>
          label = "性别"
          name = "sex"
          rules = {[{ required: true, message: '请输入性别!' }]}
        >
          <Select options = {[
            { label: '男', value: 1 },
            { label: '女', value: 0 },
          ]} />
        </Form.Item>

        <Form.Item<FieldType>
          label = "邮箱"
          name = "email"
          rules = {[
            { required: true, message: '请输入邮箱!' },
            { type: 'email', message: '请输入合法的邮箱地址!' }
          ]}
        >
          <Input placeholder='邮箱' />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default FormModal