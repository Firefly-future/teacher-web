import React, { useEffect, useState, useMemo, Children } from 'react'
import {
  getClassifyList,
  getUserList,
  getClassList,
  updateClass,
  createClass,
  deleteClass,
} from '@/services'
import type {
  ClassifyListRes,
  UserListResponse,
  ClassListRes,
  UpdateClassParams,
  CreateClassParams,
} from '@/services/types'
import { PlusOutlined } from '@ant-design/icons'
import type { ProColumns, ProTableProps } from '@ant-design/pro-components'
import { ProTable } from '@ant-design/pro-components'
import { Button, ConfigProvider, message, type DrawerProps } from 'antd'
import { useRef } from 'react'
import { API_CODE } from '@/constants/Constants'
import DrawerForm from './components/DrawerForm'

const ClassList = () => {
  const [classifyList, setClassifyList] = useState<ClassifyListRes['list']>([])
  const [teacherList, setTeacherList] = useState<UserListResponse['list']>([])

  useEffect(() => {
    getClassifyList().then((res) => setClassifyList(res.data.list))
    getUserList({ page: 1, pagesize: 1000 }).then((res) =>
      setTeacherList(res.data.list)
    )
  }, [])

  const getClass: ProTableProps<
    ClassListRes['list'][0],
    any
  >['request'] = async (params, sort, filter) => {
    const res = await getClassList({
      name: params?.name,
      teacher: params?.teacher,
      classify: params?.classify,
      page: 1,
      pagesize: 1000,
    })
    console.log('ProTable 收集到的查询参数', params)
    return {
      data: res.data.list,
      success: true,
      total: res.data.list.length,
    }
  }

  const columns = useMemo<ProColumns<ClassListRes['list'][0]>[]>(() => {
    const teacherEnum = teacherList.reduce((prev, cur) => {
      prev[cur._id] = cur.username
      return prev
    }, {} as Record<string, string>)

    const classifyEnum = classifyList.reduce((prev, cur) => {
      prev[cur._id] = cur.name
      return prev
    }, {} as Record<string, string>)

    return [
      { title: '排序', valueType: 'indexBorder', editable: false, width: 48 },
      { title: '班级名称', dataIndex: 'name', search: true },
      {
        title: '老师',
        dataIndex: 'teacher',
        search: true,
        valueEnum: teacherEnum,
        render: (_, record) => teacherEnum[record.teacher!] ?? record.teacher,
      },
      {
        title: '科目类别',
        dataIndex: 'classify',
        search: true,
        valueEnum: classifyEnum,
        render: (_, record) => classifyEnum[record.classify!] ?? record.classify,
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        render: (_, record) =>
          record.createTime
            ? new Date(record.createTime).toLocaleString()
            : '-',
        search: false,
      },
      {
        title: '操作',
        valueType: 'option',
        render: (_, record, __, action) => [
          <a key='editable' onClick={() => action?.startEditable?.(record._id)}>
            编辑
          </a>,
          <Button key='view' type='link'>
            查看
          </Button>,
        ],
      },
    ]
  }, [teacherList, classifyList])

  const actionRef = useRef<any>(null)

  const saveClass = async (id: string, params: UpdateClassParams) => {
    const payload = {
      id,
      name: params.name,
      teacher: params.teacher,
      classify: params.classify,
      students: params.students,
    }
    try {
      // 关键：把 id 也放进 body
      const res = await updateClass(id, { ...payload })
      if (res.code === API_CODE.SUCCESS) {
        updateClass(id, {...payload})
        message.success('更新成功')
        actionRef.current?.reload()
      }
    } catch (error) {
      message.error('更新失败')
      console.error(error)
    }
  }
  // 删除班级
  const delClass = async (id: string) => {
    try {
      const res = await deleteClass(id)
      if (res.code === API_CODE.SUCCESS) {
        message.success('删除成功')
        actionRef.current?.reload()
      }
    } catch (error) {
      message.error('删除失败')
      console.error(error)
    }
  }

  const [open, setOpen] = useState(false)
  const [size, setSize] = useState<DrawerProps['size']>()
  const showLargeDrawer = () => {
    setSize('large')
    setOpen(true)
  }

  const onClose = () => {
    setOpen(false)
  }
  return (
    <ConfigProvider>
      <ProTable<ClassListRes['list'][0]>
        rowKey='_id'
        actionRef={actionRef}
        request={getClass}
        columns={columns}
        pagination={{ pageSize: 5 }}
        dateFormatter='string'
        cardBordered
        search={{ labelWidth: 'auto' }}
        toolBarRender={() => [
          <Button
            key='add'
            type='primary'
            icon={<PlusOutlined />}
            onClick={showLargeDrawer}
          >
            新建班级
          </Button>,
        ]}
        editable={{ type: 'multiple', onSave: saveClass, onDelete: delClass }}
      />
      <DrawerForm
        open={open}
        size={size}
        onClose={onClose}
        teacherList={teacherList}
        classifyList={classifyList}
        actionRef={actionRef}
      />
    </ConfigProvider>
  )
}

export default ClassList
