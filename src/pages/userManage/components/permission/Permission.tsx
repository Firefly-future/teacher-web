import {
  Button,
  Flex,
  Space,
  Table,
  Tag,
  Form,
  message,
  Popconfirm,
} from 'antd'
import type { FormProps, TableProps, PopconfirmProps } from 'antd'
import {
  getPermissionList,
  createMenu,
  deleteMenu,
  updateMenu,
} from '@/services'
import { useRequest } from 'ahooks'
import type { MenuListItem, Permissionlit } from '@/services/types'
import { useEffect, useState } from 'react'
import type { DrawerProps } from 'antd'
import userStore from '@/store/userStore'
import Draw from './Draw'
import ModalForm from './ModalForm'
import { API_CODE } from '@/constants/Constants'

const Permission = () => {
  const permissionList = userStore((state) => state.userInfo?.permission)
  const getUserInfo = userStore((state) => state.getUserInfo)
  const [path, setPath] = useState('')
  const [open, setOpen] = useState(false)
  const [size, setSize] = useState<DrawerProps['size']>()
  const [openEdit, setOpenEdit] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [editForm] = Form.useForm()
  const [createForm] = Form.useForm()
  const { data, loading, run } = useRequest(getPermissionList)
  const showModal = (record: Permissionlit) => {
    let pidPath = '__new_level__'
    if (record.pid) {
      const parentItem = data?.data.list.find((item) => item._id === record.pid)
      if (parentItem) {
        pidPath = parentItem.path
      }
    }
    editForm.setFieldsValue({
      ...record,
      _id: record._id || '',
      pid: pidPath,
      status: (record as any).status ?? 1, 
    })
    setOpenEdit(true)
  }

  const handleCancel = () => {
    setOpenEdit(false)
    editForm.resetFields()
  }

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

  const showLargeDrawer = () => {
    setSize('large')
    setOpen(true)
  }

  const onClose = () => {
    setOpen(false)
    createForm.resetFields()
  }

  const handleDeleteConfirm = async (id: string) => {
    try {
      await deleteMenu(id)
      messageApi.success('删除成功')
      run()
      await getUserInfo()
    } catch (error) {
      messageApi.error('删除失败，请重试')
      console.error('删除失败：', error)
    }
  }

  const cancel: PopconfirmProps['onCancel'] = (e) => {
    console.log(e)
    messageApi.warning('取消删除')
  }

  const [messageApi, holder] = message.useMessage()

  const handleCreateFinish: FormProps<any>['onFinish'] = async (values) => {
    try {
      let pid: string | undefined = undefined
      if (values.pid && values.pid !== '__new_level__') {
        const parentMenu = data?.data.list.find(
          (item) => item.path === values.pid
        )
        if (parentMenu) {
          pid = parentMenu._id
        }
      }
      const createParams = {
        name: values.name,
        path: values.path,
        isBtn: values.isBtn,
        status: values.status,
        pid, 
      }
      const res = await createMenu(createParams)
      if (res.code === API_CODE.SUCCESS) {
        messageApi.success('菜单创建成功！')
        run()
        await getUserInfo()
        onClose()
        createForm.resetFields()
      } else {
        messageApi.error(res.msg || '创建失败，请重试')
      }
    } catch (error) {
      messageApi.error('创建失败，请重试')
      console.error('创建失败：', error)
    }
  }

  const handleEditFinish: FormProps<any>['onFinish'] = async (values) => {
    try {
      setConfirmLoading(true)
      let pid: string | undefined = undefined
      if (values.pid && values.pid !== '__new_level__') {
        const parentMenu = data?.data.list.find(
          (item) => item.path === values.pid
        )
        if (parentMenu) {
          pid = parentMenu._id
        }
      }
      const payload = {
        id: values._id,
        name: values.name,
        path: values.path,
        isBtn: values.isBtn,
        status: values.status,
        pid, 
      }

      const res = await updateMenu(payload)
      if (res.code === API_CODE.SUCCESS) {
        messageApi.success('菜单更新成功！')
        run()
        await getUserInfo()
        setOpenEdit(false)
        editForm.resetFields()
      } else {
        messageApi.error(res.msg || '更新失败，请重试')
      }
    } catch (error) {
      messageApi.error('更新失败，请重试')
      console.error('更新失败：', error)
    } finally {
      setConfirmLoading(false)
    }
  }

  const columns: TableProps<Permissionlit>['columns'] = [
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
  }, [run])

  return (
    <>
      {holder}
      <Table<Permissionlit>
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
        form={editForm}
        onFinish={handleEditFinish}
      />

      <Draw
        open={open}
        onClose={onClose}
        onFinish={handleCreateFinish}
        size={size}
        options={options}
        form={createForm}
        path={path}
        setPath={setPath}
      />
    </>
  )
}

export default Permission
