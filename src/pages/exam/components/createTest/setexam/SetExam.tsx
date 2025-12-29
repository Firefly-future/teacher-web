import React, { useEffect, useState } from 'react'
import { message, Table } from 'antd'
import type { TableColumnsType, TableProps } from 'antd'
import type { ExamItem } from '@/services/types'
import { getExamList } from '@/services'
import style from './SetExam.module.scss'

interface DataType extends ExamItem {
  key: React.Key;
}

interface SetExamProps {
  onSelect: (examId: string) => void;
  selectedExamId?: string;
}

const columns: TableColumnsType<DataType> = [
  {
    title: '试卷名称',
    dataIndex: 'name',
    render: (text: string) => <a>{text}</a>,
  },
  {
    title: '科目分类',
    dataIndex: 'classify',
  },
  {
    title: '试卷创建人',
    dataIndex: 'creator',
    // dataIndex: 'examiner',
  },
  {
    title: '试卷创建时间',
    dataIndex: 'createTime',
    // dataIndex: 'startTime',
    render: (time: string) => new Date(time).toLocaleString(),
  }
]




const SetExam: React.FC<SetExamProps> = ({ onSelect,selectedExamId = '' }) => {
  const [selectionType, setSelectionType] = useState<'checkbox' | 'radio'>('radio')
  const [examList, setExamList] = useState<DataType[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

  useEffect(() => {
    if (selectedExamId) {
      setSelectedRowKeys([selectedExamId])
    }else{
      setSelectedRowKeys([])
    }
  }, [selectedExamId])

  useEffect(() => {
    const hanExamList = async () => {
      setLoading(true)
      try {
        const res = await getExamList()
        if (res.code === 200) {

          const formattedData = res.data.list.map((item: ExamItem) => ({
            ...item,
            key: item._id,
          }))
          setExamList(formattedData)
        } else {
          message.error(res.msg || '获取试卷列表失败,请重试')
        }
      } catch (err) {
        message.error('获取试卷列表失败,请重试')
      } finally {
        setLoading(false)
      }
    }
    hanExamList()
  }, [])


  const rowSelection: TableProps<DataType>['rowSelection'] = {
    type: selectionType,
    selectedRowKeys,
    onChange: (selectedKeys, selectedRows) => {
      setSelectedRowKeys(selectedKeys)
      if (selectedKeys.length > 0) {
        const examId = String(selectedKeys[0])
        onSelect(examId)
      }
    },
    getCheckboxProps: (record: DataType) => ({
      disabled: false,
      name: record.name,
    }),
  }

  return (
    <div className={style.tab}>
      <Table
        rowSelection={rowSelection}
        // rowSelection={{ type: selectionType, ...rowSelection }}
        columns={columns}
        dataSource={examList}
        loading={loading}
        pagination={{ pageSize: 5 }}
      />
    </div>
  )
}

export default SetExam