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
import { useEffect } from 'react'
import { useState } from 'react'
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
  const { data, loading, run } = useRequest(getPermissionList)
  const showModal = (record: Permissionlit) => {
    form.setFieldsValue({ ...record, _id: record._id || '' })
    setOpenEdit(true)
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
    id: null,
  }
  const options = [
    defaultOption,
    ...(optionsItem?.map((item) => ({
      label: item.name,
      value: item.path,
      id: item._id,
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
      const selectedMenu = options.find((item) => item.value === values.pid)
      const createParams: any = {
        name: values.name,
        path: values.path,
        isBtn: values.isBtn,
        status: values.status,
      }

      if (values.level !== '__new_level__' && selectedMenu?.id) {
        createParams.pid = selectedMenu.id
      }
      const res = await createMenu(createParams)
      if (res.code === API_CODE.SUCCESS) {
        messageApi.success('菜单创建成功！')
        await getUserInfo()
        run()
        setTimeout(() => {
          setOpen(false)
          form.resetFields()
        }, 500)
      } else {
        messageApi.error(res.msg || '操作失败，请重试')
      }
    } catch (error) {
      messageApi.error('操作失败，请重试')
      console.error('操作失败：', error)
    }
  }
  const handleEditFinish: FormProps<any>['onFinish'] = async (values) => {
    try {
      setConfirmLoading(true)
      const payload = {
        id: values._id,
        name: values.name,
        path: values.path,
        isBtn: values.isBtn,
        pid: values.pid === '__new_level__' ? '' : values.pid,
      }
      const res = await updateMenu(payload)
      if (res.code === API_CODE.SUCCESS) {
        messageApi.success('菜单更新成功！')
        run()
        setTimeout(() => {
          setOpenEdit(false)
          form.resetFields()
        }, 500)
      } else {
        messageApi.error(res.msg || '操作失败，请重试')
        setOpenEdit(false)
      }
    } catch (error) {
      messageApi.error('更新失败，请重试')
    } finally {
      setConfirmLoading(false)
    }
  }
  // 表格列配置
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
  }, [])

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
        form={form}
        onFinish={handleEditFinish}
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
