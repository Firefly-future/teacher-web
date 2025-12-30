/* ClassList/index.tsx */
import React, { useEffect, useState, useMemo } from 'react'
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
import dayjs from 'dayjs'

const ClassList = () => {
  const [classifyList, setClassifyList] = useState<ClassifyListRes['list']>([])
  const [teacherList, setTeacherList] = useState<UserListResponse['list']>([])

  /* 1. 拉取下拉所需基础数据 */
  useEffect(() => {
    getClassifyList().then((res) => setClassifyList(res.data.list))
    getUserList({ page: 1, pagesize: 100 }).then((res) =>
      setTeacherList(res.data.list)
    )
  }, [])

  /* 2. 下拉选项（memo 避免重复计算） */
  const teacherOptions = useMemo(
    () => teacherList.map((t) => ({ label: t.username, value: t._id })),
    [teacherList]
  )
  const classifyOptions = useMemo(
    () => classifyList.map((c) => ({ label: c.name, value: c._id })),
    [classifyList]
  )

  /* 3. ProTable 请求函数 */
  const getClass: ProTableProps<
    ClassListRes['list'][0],
    any
  >['request'] = async (params) => {
    console.log('ProTable 查询参数', params)
    const res = await getClassList({
      name: params.name,
      teacher: params.teacherId, // 一级字段
      classify: params.classifyId, // 一级字段
      page: 1,
      pagesize: 100,
    })
    return {
      data: res.data.list,
      success: true,
      total: res.data.list?.length,
    }
  }
  const columns = useMemo<ProColumns<ClassListRes['list'][0]>[]>(() => {
    return [
      { title: '排序', valueType: 'indexBorder', editable: false, width: 48 },
      { title: '班级名称', dataIndex: 'name', search: true },
      {
        title: '老师',
        dataIndex: 'teacherId',
        search: true,
        valueType: 'select',
        fieldProps: { options: teacherOptions },
        render: (_, record) => record?.teacher?.username ?? '-',
      },
      {
        title: '科目类别',
        dataIndex: 'classifyId', 
        search: true,
        valueType: 'select',
        fieldProps: { options: classifyOptions },
        render: (_, record) => record?.classify?.name ?? '-',
      },
      {
        title: '创建时间',
        dataIndex: 'createdAt',
        render: (_, record) => dayjs(record.createdAt).format('YYYY-MM-DD'),
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
  }, [teacherOptions, classifyOptions])

  /* 5. 行编辑保存 / 删除 */
  const actionRef = useRef<any>(null)

  const saveClass: ProTableProps['editable']['onSave'] = async (
    key,
    row,
    oriRow
  ) => {
    const payload: UpdateClassParams = {
      id: oriRow._id,
      name: row.name ?? oriRow.name,
      teacher: row.teacherId ?? oriRow.teacher._id, // 用 teacherId
      classify: row.classifyId ?? oriRow.classify._id, // 用 classifyId
      students: row.students?.map((s: any) => s._id) ?? oriRow.students.map((s: any) => s._id),
    }

    try {
      const res = await updateClass(payload)
      if (res.code === API_CODE.SUCCESS) {
        message.success('更新成功')
        actionRef.current?.reload()
      }
    } catch (e) {
      message.error('更新失败')
      throw e
    }
  }

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

  /* 6. 新建抽屉 */
  const [open, setOpen] = useState(false)
  const [size, setSize] = useState<DrawerProps['size']>()
  const showLargeDrawer = () => {
    setSize('large')
    setOpen(true)
  }
  const onClose = () => setOpen(false)

  /* 7. 渲染 */
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
