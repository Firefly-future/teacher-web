import {
  Button,
  Flex,
  Space,
  Table,
  Tag,
  Drawer,
  Form,
  Input,
  Select,
  message,
  Popconfirm,
  Tooltip,
  Modal,
} from 'antd'
import type { FormProps, TableProps, PopconfirmProps } from 'antd'
import {
  getPermissionList,
  createMenu,
  deleteMenu,
  updateMenu,
} from '@/services'
import { useRequest } from 'ahooks'
import type { MenuListItem } from '@/services/types'
import { useEffect } from 'react'
import { useState } from 'react'
import type { DrawerProps } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'
import userStore from '@/store/userStore'

// // 校验函数
const checkPath = (_: any, value: string) => {
  if (!value) return Promise.reject(new Error('请输入路径'))
  if (!/^(\/[A-Za-z]+)+$/.test(value)) {
    return Promise.reject(new Error('路径必须以 / 开头，且只能包含英文字母'))
  }
  return Promise.resolve()
}

const Permission = () => {
  const permissionList = userStore((state) => state.userInfo?.permission)
  const [path, setPath] = useState('')
  const [open, setOpen] = useState(false)
  const [size, setSize] = useState<DrawerProps['size']>()
  const [openEdit, setOpenEdit] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [modalText, setModalText] = useState('确认更新吗？')
  const showModal = (record: MenuListItem) => {
    setOpenEdit(true)
  }

  const handleOk = async (values: any) => {
    setModalText('更新将在2秒后生效')
    setConfirmLoading(true)
    try {
      await updateMenu(values)
      messageApi.success('更新成功')
      // 更新成功后重新请求列表数据
      run()
      // 关闭弹窗
      form.resetFields()
      setOpenEdit(false)
      setConfirmLoading(false)
    } catch (error) {
      messageApi.error('更新失败，请重试')
      console.error('更新失败：', error)
    }
  }
  const handleCancel = () => {
    console.log('点击了取消按钮')
    setOpenEdit(false)
  }
  // 权限等级选择列表
  const optionsItem = permissionList?.filter((item) => !item.isBtn)
  const defaultOption = {
    label: '创建新的一级菜单',
    value: '__new_level__',
  }
  const options = [
    defaultOption,
    ...(optionsItem?.map((item) => ({
      label: item.name,
      value: item.path,
    })) || []),
  ]
  // 显示添加菜单抽屉
  const showLargeDrawer = () => {
    setSize('large')
    setOpen(true)
  }
  // 关闭抽屉
  const onClose = () => {
    setOpen(false)
    form.resetFields()
  }
  // 删除菜单
  const handleDeleteConfirm = async (id: string) => {
    try {
      // 这里可以调用删除接口
      await deleteMenu(id)
      console.log('删除菜单ID：', id)
      messageApi.success('删除成功')
      // 删除成功后重新请求列表数据
      run()
    } catch (error) {
      messageApi.error('删除失败，请重试')
      console.error('删除失败：', error)
    }
  }
  // 取消删除
  const cancel: PopconfirmProps['onCancel'] = (e) => {
    console.log(e)
    messageApi.error('取消删除')
  }
  const [messageApi, holder] = message.useMessage()
  const [form] = Form.useForm()
  // 提交表单
  const onFinish: FormProps<any>['onFinish'] = async (values) => {
    console.log('Success:', values)
    try {
      await createMenu({
        name: values.name,
        path: values.path,
        isBtn: values.isBtn,
        status: values.status,
      })
      messageApi.success('操作成功')
      // 操作成功后重新请求列表数据
      run()
      // 关闭抽屉
      form.resetFields()
      onClose()
    } catch (error) {
      messageApi.error('操作失败，请重试')
      console.error('操作失败：', error)
    }
  }
  const { data, loading, run } = useRequest(getPermissionList)
  // 表格列配置
  const columns: TableProps<MenuListItem>['columns'] = [
    {
      title: '菜单名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '菜单路径',
      dataIndex: 'path',
      key: 'path',
    },
    {
      title: '权限类型',
      dataIndex: 'isBtn',
      key: 'isBtn',
      render: (_, record) =>
        record.isBtn ? (
          <Tag color='red' variant='solid'>
            按钮
          </Tag>
        ) : (
          <Tag color='green' variant='solid'>
            页面
          </Tag>
        ),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      align: 'center',
      render: (_, record) => new Date(record.createTime).toLocaleString(),
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <Space size='middle'>
          <Button type='link' onClick={() => showModal(record)}>
            编辑
          </Button>
          <Popconfirm
            title='删除此菜单'
            description='确认删除此菜单吗？'
            onConfirm={() => handleDeleteConfirm(record._id)}
            onCancel={cancel}
            okText='确定'
            cancelText='取消'
          >
            <Button type='link' danger>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]
  useEffect(() => {
    run()
  }, [])

  return (
    <>
      {holder}
      <Table<MenuListItem>
        columns={columns}
        dataSource={data?.data.list}
        loading={loading}
        rowKey={(record) => record._id}
        title={() => (
          <Flex justify='space-between' align='center'>
            <div style={{ fontSize: 16, fontWeight: 'bold' }}>菜单列表</div>
            <div>
              <Button type='primary' onClick={showLargeDrawer}>
                添加菜单
              </Button>
            </div>
          </Flex>
        )}
        pagination={false}
      />
      <Modal
        title='编辑菜单'
        open={openEdit}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <Form form={form} onFinish={onFinish}>
          <Form.Item label='菜单名称' name='name' rules={[{ required: true }]}>
            <Input placeholder='请输入名称' />
          </Form.Item>
          <Form.Item label='菜单路径' name='path' rules={[{ required: true }]}>
            <Input placeholder='请输入路径' />
          </Form.Item>
          <Form.Item label='权限类型' name='isBtn' rules={[{ required: true }]}>
            <Select
              placeholder='请选择'
              style={{ width: 260 }}
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
        </Form>
      </Modal>
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
    </>
  )
}

export default Permission
