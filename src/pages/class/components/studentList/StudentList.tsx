/* StudentList/index.tsx */
import React, { useEffect, useState, useMemo } from 'react'
import {
  getStudentList,
  createStudent,
  updateStudent,
  deleteStudent,
  getClassList,
} from '@/services'
import type {
  StudentListItem,
  StudentListRes,
  UpdateStudentParams,
  ClassListRes,
  StudentListParams,
} from '@/services/types'
import { PlusOutlined } from '@ant-design/icons'
import type { ProColumns } from '@ant-design/pro-components'
import { ProTable } from '@ant-design/pro-components'
import { Button, ConfigProvider, message, type DrawerProps } from 'antd'
import { useRef } from 'react'
import { API_CODE } from '@/constants/Constants'
import DrawerForm from './components/DrawForm'
import dayjs from 'dayjs'

const StudentList = () => {
  const [classList, setClassList] = useState<ClassListRes['list']>([])

  useEffect(() => {
    getClassList()
      .then((res) => {
        if (res.code === API_CODE.SUCCESS) setClassList(res.data.list)
      })
      .catch(console.error)
  }, [])

  const actionRef = useRef<any>(null)
  const fetchStudents = async (params: StudentListParams) => {
    const res = await getStudentList({
      page: params.page || 1,
      pagesize: params.pagesize || 100,
      classId: params.classId,
      username: params.username,
      sex: params.sex,
      age: params.age,
    })
    if (res.code === API_CODE.SUCCESS) {
      return {
        data: res.data.list.map((item) => ({
          ...item,
          classId: item.classId?._id || item.classId,
        })),
        total: res.data.total ?? res.data.list.length,
        success: true,
      }
    }
    return { data: [], total: 0, success: false }
  }

  const columns = useMemo<ProColumns<StudentListItem>[]>(() => {
    return [
      { title: '序号', valueType: 'indexBorder', editable: false, width: 50 },
      { title: '姓名', dataIndex: 'username' },
      {
        title: '性别',
        dataIndex: 'sex',
        valueType: 'select',
        valueEnum: {
          1: '男',
          0: '女',
        },
        search: true,
        render: (_, r) => (r.sex == 1 ? '男' : r.sex == 0 ? '女' : '-'),
      },
      {
        title: '年龄',
        dataIndex: 'age',
        search: true,
        valueType: 'number',
      },
      {
        title: '班级',
        dataIndex: 'classId',
        valueType: 'select',
        search: true,
        fieldProps: {
          options: classList.map((c) => ({ label: c.name, value: c._id })),
        },
        render: (_, r) => {
          // 兼容两种数据格式：字符串 ID 或对象 { _id, name }
          const classId = r.classId?._id || r.classId
          return classList.find((c) => c._id === classId)?.name || '-'
        },
      },
      {
        title: '创建时间',
        dataIndex: 'createdAt',
        search: false,
        render: (_, r) =>
          r.createdAt ? dayjs(r.createdAt).format('YYYY-MM-DD') : '-',
      },
      {
        title: '操作',
        valueType: 'option',
        width: 120,
        fixed: 'right',
        render: (_, r) => [
          <a
            key='edit'
            onClick={() => actionRef.current?.startEditable?.(r._id)}
          >
            编辑
          </a>,
        ],
      },
    ]
  }, [classList])

  const saveStudent: ProTableProps<StudentListItem>['editable']['onSave'] =
    async (_key, row, originRow) => {
      const payload: UpdateStudentParams = {
        id: originRow._id,
        username: row.username ?? originRow.username,
        sex: row.sex ?? originRow.sex,
        age: row.age ?? originRow.age,
        classId: row.classId ?? originRow.classId,
      }

      try {
        const res = await updateStudent(payload)
        if (res.code === API_CODE.SUCCESS) {
          message.success('更新成功')
          actionRef.current?.reload()
        } else {
          message.error('更新失败')
          throw new Error(res.msg ?? '更新失败')
        }
      } catch (e) {
        message.error('更新失败')
        throw e
      }
    }

  const delStudent = async (id: string) => {
    const res = await deleteStudent(id)
    if (res.code === API_CODE.SUCCESS) {
      message.success('删除成功')
      actionRef.current?.reload()
    } else {
      message.error('删除失败')
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
  /* 6. 渲染 */
  return (
    <ConfigProvider>
      <ProTable<StudentListItem>
        rowKey={(record) => record._id}
        actionRef={actionRef}
        columns={columns}
        request={fetchStudents}
        pagination={{ pageSize: 5 }}
        search={{ labelWidth: 'auto' }}
        toolBarRender={() => [
          <Button
            key='add'
            type='primary'
            icon={<PlusOutlined />}
            onClick={showLargeDrawer}
          >
            添加学生
          </Button>,
        ]}
        editable={{
          type: 'multiple',
          onSave: saveStudent,
          onDelete: delStudent,
        }}
      />
      <DrawerForm
        open={open}
        onClose={onClose}
        actionRef={actionRef}
        size={size}
        classList={classList}
      />
    </ConfigProvider>
  )
}

export default StudentList
