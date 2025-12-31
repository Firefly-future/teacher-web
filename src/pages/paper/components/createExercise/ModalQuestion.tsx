import React, { useState } from 'react'
import { Button, Form, Modal, Flex, Table } from 'antd'
import type { QuestionItemList, QuestionTypeItem } from '@/services/types'
import type { TableColumnsType, TableProps } from 'antd'
import Type from '@/constants/Type'

interface ModalQuestionProps {
  showModal: () => void
  //接收选中题目后的回调
  onConfirm: (selectedQuestions: QuestionItemList[]) => void
  handleCancel: () => void
  setIsModalOpen: (isOpen: boolean) => void
  isOpen: boolean
  list: QuestionItemList[]
  selectedRowKeys: React.Key[]
  setSelectedRowKeys: (selectedRowKeys: React.Key[]) => void
}

type TableRowSelection<T extends object = object> = TableProps<T>['rowSelection']

interface DataType {
  key: React.Key
  question: string
  name: string
  answer: string
}

const columns: TableColumnsType<DataType> = [
  { title: '题干', dataIndex: 'question' },
  { title: '题型', dataIndex: 'name' },
  { title: '答案', dataIndex: 'answer' },
]

const ModalQuestion: React.FC<ModalQuestionProps> = ({
  showModal,
  onConfirm, 
  handleCancel,
  setIsModalOpen,
  isOpen,
  list,
  selectedRowKeys,
  setSelectedRowKeys,
}) => {
  const handleModalOk = () => {
    const selectedQuestions = list.filter(item => 
      selectedRowKeys.includes(item._id!)
    )
    console.log(selectedQuestions)
    onConfirm(selectedQuestions)
    setIsModalOpen(false)
    setSelectedRowKeys([])
  }

  const [loading, setLoading] = useState(false)
  const dataSource = list.map((item) => ({
    key: item._id,
    question: item.question,
    name: Type.find((type) => type.type === item.type)?.name || '',
    answer: item.answer,
  }))
  
  const start = () => {
    setLoading(true)
    setTimeout(() => {
      setSelectedRowKeys([])
      setLoading(false)
    }, 1000)
  }
  
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys)
  }
  
  const rowSelection: TableRowSelection<DataType> = {
    selectedRowKeys,
    onChange: onSelectChange,
  }
  
  return (
    <Modal
      title='试题列表'
      open={isOpen}
      onOk={handleModalOk}
      onCancel={handleCancel}
    >
      <Flex gap='middle' vertical>
        <Table<DataType>
          rowSelection={rowSelection}
          columns={columns}
          dataSource={dataSource}
        />
      </Flex>
    </Modal>
  )
}

export default ModalQuestion