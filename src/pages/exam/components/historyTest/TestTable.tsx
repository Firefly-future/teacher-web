import React, { useEffect, useState } from 'react'
import { Button, Space, Table, Tag, message, Modal } from 'antd'
import type { TableProps } from 'antd'
import { deleteExam, getExamList, getExamRecordList,getClassifyList,getExaminerList } from '@/services'
import type { ExamItem, ExamRecordItem,ClassifyItem,ExaminerItem } from '@/services/types'


interface DataType {
  key: string;
  status: string | number;
}

interface TestTableProps {
  searchParams?: any
}

// const columns: TableProps<DataType>['columns'] = [
//   {
//     title: '考试名称',
//     dataIndex: 'name',
//     key: 'name',
//     render: (text) => <a>{text}</a>,
//     fixed: 'start',
//   },
//   {
//     title: '科目分类',
//     dataIndex: 'classify',
//     key: 'classify',
//     render: (classifyId) => classifyId,
//   },
//   {
//     title: '创建者',
//     dataIndex: 'creator',
//     key: 'creator',
//   },
//   {
//     title: '创建时间',
//     dataIndex: 'createTime',
//     key: 'createTime',
//     render: (time) => time ? new Date(time).toLocaleString() : '-',
//   },
//   {
//     title: '状态',
//     key: 'status',
//     dataIndex: 'status',
//     render: (status) => {
//       let color = 'default'
//       let text = '未选择'
//       if (status === '0') {
//         color = 'blue'
//         text = '未开始'
//       } else if (status === '1') {
//         color = 'green'
//         text = '进行中'
//       } else if (status === '2') {
//         color = 'red'
//         text = '已结束'
//       }
//       return <Tag color={color}>{text}</Tag>
//     }
//   },
//   {
//     title: '监考人',
//     dataIndex: 'examiner',
//     key: 'examiner',
//   },
//   {
//     title: '考试班级',
//     dataIndex: 'group',
//     key: 'group',
//     render: (groupId) => groupId,
//   },
//   {
//     title: '开始时间',
//     dataIndex: 'startTime',
//     key: 'startTime',
//     render: (time) => time ? new Date(time).toLocaleString() : '-',
//   },
//   {
//     title: '结束时间',
//     dataIndex: 'endTime',
//     key: 'endTime',
//     render: (time) => time ? new Date(time).toLocaleString() : '-',
//   },
//   {
//     title: '设置',
//     dataIndex: 'set',
//     key: 'set',
//     render: (_, record) => (
//       <Space>
//         <Button type="primary" size="small">
//           预览试卷
//         </Button>
//         <Button type="primary"  size="small" onClick={() => handleDelete(record as DataType & ExamRecordItem)}>
//           删除
//         </Button>
//       </Space>
//     ),
//   },
//   {
//     title: '操作',
//     dataIndex: 'operation',
//     key: 'operation',
//     fixed: 'end',
//     render: (_, record) => (
//       <Button type="primary" size="small">
//         成绩分析
//       </Button>
//     ),
//   }
// ]

const TestTable: React.FC<TestTableProps> = ({ searchParams }) => {
  const [data, setData] = useState<DataType[]>([])
  const [loading, setLoading] = useState(false)



  const columns: TableProps<DataType>['columns'] = [
    {
      title: '考试名称',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <a>{text}</a>,
      fixed: 'start',
    },
    {
      title: '科目分类',
      dataIndex: 'classify',
      key: 'classify',
      render: (classifyId) => classifyId,
    },
    {
      title: '创建者',
      dataIndex: 'creator',
      key: 'creator',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      render: (time) => time ? new Date(time).toLocaleString() : '-',
    },
    {
      title: '状态',
      key: 'status',
      dataIndex: 'status',
      render: (status) => {
        let color = 'default'
        let text = '未选择'
        if (status === '0') {
          color = 'blue'
          text = '未开始'
        } else if (status === '1') {
          color = 'green'
          text = '进行中'
        } else if (status === '2') {
          color = 'red'
          text = '已结束'
        }
        return <Tag color={color}>{text}</Tag>
      }
    },
    {
      title: '监考人',
      dataIndex: 'examiner',
      key: 'examiner',
    },
    {
      title: '考试班级',
      dataIndex: 'group',
      key: 'group',
      render: (groupId) => groupId,
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
      key: 'startTime',
      render: (time) => time ? new Date(time).toLocaleString() : '-',
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
      key: 'endTime',
      render: (time) => time ? new Date(time).toLocaleString() : '-',
    },
    {
      title: '设置',
      dataIndex: 'set',
      key: 'set',
      render: (_, record) => (
        <Space>
          <Button type="primary" size="small">
            预览试卷
          </Button>
          <Button
            type="primary"
            size="small"
            onClick={() => handleDelete(record as DataType & ExamRecordItem)}
            disabled={record.status === '1' || record.status === '2'}
          >
            删除
          </Button>
        </Space>
      ),
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      fixed: 'end',
      render: (_, record) => {
        // 
        let btnText = '成绩分析'
        if (record.status === '0') {
          btnText = '编辑'
        } else if (record.status === '1') {
          btnText = '在线监考'
        }

        return (
          <Button type="primary" size="small">
            {btnText}
          </Button>
        )
      }
    }
  ]

  // const fetchExamData = async () => {
  //   setLoading(true)
  //   try {
  //     const res = await getExamRecordList(searchParams)
  //     if (res.code === 200) {
  //       // 转换数据格式，添加key状态
  //       const formattedData = res.data.list.map((item: ExamRecordItem) => ({
  //         ...item,
  //         key: item._id,
  //         status: getExamStatus(item.startTime, item.endTime),
  //       }))
  //       setData(formattedData)
  //     } else {
  //       message.error(res.msg || '获取考试记录失败')
  //     }
  //   } catch (err) {
  //     message.error('获取考试数据失败,请重试')
  //     console.error('获取考试数据失败:', err)
  //   } finally {
  //     setLoading(false)
  //   }
  // }


  // 删除考试记录
  const handleDelete = (record: DataType & ExamRecordItem) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除考试记录 "${record.name}" 吗？`,
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          const res = await deleteExam(record._id)
          if (res.code === 200) {
            message.success('删除成功')
            // 重新获取数据
            fetchExamData()
          } else {
            message.error(res.msg || '删除失败')
          }
        } catch (err) {
          message.error('删除失败，请重试')
          console.error('删除考试记录失败:', err)
        }
      }
    })
  }


  const fetchExamData = async () => {
    setLoading(true)
    try {
      // 处理搜索参数，转换为后端API期望的格式
      const processedParams: any = {}

      // 转换参数名称和格式
      if (searchParams) {
        // 考试名称
        if (searchParams.examName) processedParams.name = searchParams.examName

        // 科目分类
        if (searchParams.classify) processedParams.classify = searchParams.classify

        // 创建者
        if (searchParams.creator) processedParams.creator = searchParams.creator

        // 创建时间范围（转换为时间戳）
        if (searchParams.createTime && searchParams.createTime.length === 2) {
          processedParams.createTimeStart = searchParams.createTime[0].getTime()
          processedParams.createTimeEnd = searchParams.createTime[1].getTime()
        }

        // 状态（转换为数字）
        if (searchParams.status) processedParams.status = Number(searchParams.status)

        // 监考人
        if (searchParams.examiner) processedParams.examiner = searchParams.examiner

        // 考试班级
        if (searchParams.group) processedParams.group = searchParams.group

        // 考试时间范围（转换为时间戳）
        if (searchParams.examTime && searchParams.examTime.length === 2) {
          processedParams.startTime = searchParams.examTime[0].getTime()
          processedParams.endTime = searchParams.examTime[1].getTime()
        }
      }

      // 添加分页参数
      processedParams.page = 1
      processedParams.pagesize = 10

      const res = await getExamRecordList(processedParams)
      if (res.code === 200) {
        // 转换数据格式，添加key和状态
        const formattedData = res.data.list.map((item: ExamRecordItem) => ({
          ...item,
          key: item._id,
          status: getExamStatus(item.startTime, item.endTime),
        }))
        setData(formattedData)
      } else {
        message.error(res.msg || '获取考试记录失败')
      }
    } catch (err) {
      message.error('获取考试数据失败,请重试')
      console.error('获取考试数据失败:', err)
    } finally {
      setLoading(false)
    }
  }



  // 根据时间判断考试状态
  const getExamStatus = (startTime: number, endTime: number): string => {
    const now = Date.now()
    if (now < startTime) {
      return '0'
    } else if (now >= startTime && now <= endTime) {
      return '1'
    } else {
      return '2'
    }
  }

  useEffect(() => {
    fetchExamData()
  }, [searchParams])

  return (
    <div>
      <h3>考试记录</h3>
      <Table<DataType>
        scroll={{ x: 1600 }}
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条`
        }}
      />
    </div>
  )
}

export default TestTable
