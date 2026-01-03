import React, { useState } from 'react'
import { getRoleList, getPermissionList, updateRole, deleteRole, createRole } from '@/services'
import type { RoleItem } from '@/services/types'
import { useRequest } from 'ahooks'
import type { TableProps } from 'antd'
import {
  Table, Button, message, Space, Drawer, Tree, Popconfirm,
  Form, Input, Modal
} from 'antd'
import { API_CODE } from '@/constants/Constants'
import { PlusOutlined } from '@ant-design/icons'

const RoleList = () => {
  const [open, setOpen] = useState(false)
  const [createModalVisible, setCreateModalVisible] = useState(false)
  const [updateId, setUpdateId] = useState<string | null>(null)
  const [createForm] = Form.useForm() 
  
  const { data: listRes, loading, run: fetchRoleList } = useRequest(getRoleList, { manual: false })
  const { data: PerRes } = useRequest(getPermissionList)
  const resetCreateForm = () => {
    createForm.resetFields()
    setCreateModalVisible(false)
  }

  const columns: TableProps<RoleItem>['columns'] = [
    {
      title: '角色名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '角色值',
      dataIndex: 'value',
      key: 'value',
    },
    {
      title: '角色描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '创建人',
      dataIndex: 'creator',
      key: 'creator',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      render: (time: string) => new Date(time).toLocaleString()
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'end',
      render: (_, record) => (
        <Space size="middle">
          <Button size="small" type="primary" onClick={() => {
            setOpen(true)
            setCheckedKeys(record.permission || [])
            setUpdateId(record._id)
          }}>分配角色</Button>
          <Popconfirm
            title="确定删除该角色吗？"
            onConfirm={() => handleDelete(record._id)}
            okText="确定"
            cancelText="取消"
          >
            <Button size="small" danger>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  const [checkedKeys, setCheckedKeys] = useState<string[]>([])
  
  const handleDelete = async (roleId: string) => {
    try {
      const res = await deleteRole(roleId)
      if (res.code === API_CODE.SUCCESS) {
        message.success('删除成功！')
        fetchRoleList()
      } else {
        message.error(res.msg || '删除失败，请重试')
      }
    } catch (e) {
      console.error('删除角色失败:', e)
      message.error('删除角色时发生错误，请稍后重试')
    }
  }

  const onCheck = (checkedKeysValue: React.Key[] | { checked: React.Key[]; halfChecked: React.Key[] }) => {
    const keys = Array.isArray(checkedKeysValue) ? checkedKeysValue : checkedKeysValue.checked
    console.log('onCheck', keys)
    setCheckedKeys(keys.map(key => String(key)))
  }
  
  const onClose = () => {
    setOpen(false)
    setUpdateId(null)
  }

  const onSave = async () => {
    try {
      const res = await updateRole({
        id: updateId!,
        permission: checkedKeys
      })
      console.log(res)
      if (res.code === API_CODE.SUCCESS) {
        message.success('修改成功！')
        onClose()
        fetchRoleList()
      } else {
        message.error(res.msg)
      }
    } catch (e) {
      console.log(e)
      message.error('修改权限失败，请稍后重试')
    }
  }

  const handleCreateSubmit = async () => {
    try {
      const values = await createForm.validateFields()
      const res = await createRole({
        name: values.name,
        value: values.value,
        description: values.description,
        permission: []
      })
      
      if (res.code === API_CODE.SUCCESS) {
        message.success('角色创建成功！')
        resetCreateForm()
        fetchRoleList()
      } else {
        message.error(res.msg || '创建角色失败，请重试')
      }
    } catch (e) {
      console.error('创建角色失败:', e)
      message.error('创建角色时发生错误，请稍后重试')
    }
  }

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={() => setCreateModalVisible(true)}
        >
          新增角色
        </Button>
      </div>
      
      <Table<RoleItem>
        loading={loading}
        columns={columns}
        dataSource={listRes?.data.list}
        rowKey={row => row._id}
      />
      <Drawer
        title="分配权限"
        onClose={onClose}
        open={open}
        footer={<Button type="primary" onClick={onSave}>保存</Button>}
      >
        <Tree
          defaultExpandAll
          checkable
          onCheck={onCheck}
          checkedKeys={checkedKeys}
          treeData={PerRes?.data.list}
          fieldNames={{ title: 'name', key: '_id' }}
        />
      </Drawer>
      <Modal
        title="创建角色"
        open={createModalVisible}
        onCancel={resetCreateForm}
        footer={[
          <Button key="cancel" onClick={resetCreateForm}>取消</Button>,
          <Button key="submit" type="primary" onClick={handleCreateSubmit}>
            提交
          </Button>
        ]}
        width={500}
        destroyOnClose 
      >
        <Form
          form={createForm}
          layout="vertical"
          initialValues={{ description: '' }}
        >
          <Form.Item
            name="name"
            label="角色名称"
            rules={[{ required: true, message: '请输入角色名称' }]}
          >
            <Input placeholder="请输入角色名称" autoComplete="off" />
          </Form.Item>
          
          <Form.Item
            name="value"
            label="角色值"
            rules={[{ required: true, message: '请输入角色值' }]}
          >
            <Input placeholder="请输入角色值" autoComplete="off"/>
          </Form.Item>
          
          <Form.Item
            name="description"
            label="角色描述"
          >
            <Input.TextArea rows={4} placeholder="请输入角色描述" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default RoleList