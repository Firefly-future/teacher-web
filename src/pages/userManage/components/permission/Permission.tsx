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
import Draw from './Draw'
import ModalForm from './ModalForm'
import { API_CODE } from '@/constants/Constants'
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
  const showModal = (record: MenuListItem) => {
    form.setFieldsValue({ ...record, _id: record._id || '' })
    setOpenEdit(true)
  }
  const handleEditFinish: FormProps<any>['onFinish'] = async (values) => {
    try {
      setConfirmLoading(true)
      // 调用更新接口，传入包含 _id 的完整数据
      const res = await updateMenu(values)
      if (res.code === API_CODE.SUCCESS) {
        updateMenu(values)
        messageApi.success('菜单更新成功！')
        run() // 重新拉取列表
        setOpenEdit(false) // 关闭弹窗
      }
    } catch (error) {
      messageApi.error('更新失败，请重试')
      console.error('更新失败：', error)
    } finally {
      setConfirmLoading(false)
      form.resetFields() // 重置表单
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
      <ModalForm
        openEdit={openEdit}
        confirmLoading={confirmLoading}
        handleCancel={handleCancel}
        form={form}
        onFinish={handleEditFinish} // 传入编辑专属的提交逻辑
      />

      <Draw
        open={open}
        onClose={onClose}
        onFinish={onFinish}
        size={size}
        options={options}
        form={form}
        path={path}
        setPath={setPath}
      />
    </>
  )
}

export default Permission
