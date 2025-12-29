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
  StudentListItem, // 统一泛型
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

  /* 1. 获取班级列表 */
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
      page: 1,
      pagesize: 10000,
      className: classList.find((c) => c._id === params.classId)?.name,
      username: params.username,
      sex: params.sex,
      age: params.age,
    })
    if (res.code === API_CODE.SUCCESS) {
      return {
        data: res.data.list,
        total: res.data.total ?? res.data.list.length,
        success: true,
      }
    }
    return { data: [], total: 0, success: false }
  }

  /* 3. 表格列（依赖 classList） */
  const columns = useMemo<ProColumns<StudentListItem>[]>(() => {
    return [
      { title: '序号', valueType: 'indexBorder', editable: false, width: 50 },
      { title: '姓名', dataIndex: 'username' },
      {
        title: '性别',
        dataIndex: 'sex',
        valueEnum: {
          男: '男',
          女: '女',
        },
      },
      { title: '年龄', dataIndex: 'age' },
      {
        title: '班级',
        dataIndex: 'classId',
        valueType: 'select',
        fieldProps: {
          options: classList.map((c) => ({ label: c.name, value: c._id })),
        },
        render: (_, r) => r.className || '-',
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        search: false,
        render: (_, r) =>
          r.createTime ? dayjs(r.createTime).format('YYYY-MM-DD') : '-',
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

  /* 4. 行编辑保存 / 删除 */
  /* 行编辑保存 */
  const saveStudent: ProTableProps<StudentListItem>['editable']['onSave'] =
    async (
      _key,
      row, // 仅包含被修改的字段
      originRow // 原始整行数据
    ) => {
      // 合并出完整参数
      const payload: UpdateStudentParams = {
        id: originRow._id,
        username: row.username ?? originRow.username,
        sex: row.sex ?? originRow.sex,
        age: row.age ?? originRow.age,
        className: row.className ?? originRow.className,
      }

      try {
        const res = await updateStudent(payload)
        if (res.code === API_CODE.SUCCESS) {
          message.success('更新成功')
          actionRef.current?.reload()
        } else {
          message.error('更新失败')
          throw new Error(res.msg ?? '更新失败') // 让 ProTable 知道失败了
        }
      } catch (e) {
        message.error('更新失败')
        throw e // 必须继续抛出去
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

  /* 5. 新建抽屉 */
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
