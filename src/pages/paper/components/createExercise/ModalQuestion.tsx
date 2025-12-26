import React, { useState } from 'react'
import { Button, Form, Modal, Flex, Table } from 'antd'
import type { QuestionItemList, QuestionTypeItem } from '@/services/types'
import type { TableColumnsType, TableProps } from 'antd'
import Type from '@/constants/Type'

interface ModalQuestionProps {
  showModal: () => void
  // 新增：接收选中题目后的回调
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
  onConfirm, // 新增回调
  handleCancel,
  setIsModalOpen,
  isOpen,
  list,
  selectedRowKeys,
  setSelectedRowKeys,
}) => {
  // 新增：Modal 确认按钮逻辑
  const handleModalOk = () => {
    // 根据选中的 rowKeys 筛选对应的题目数据
    const selectedQuestions = list.filter(item => 
      selectedRowKeys.includes(item._id!)
    )
    // 调用回调，把选中的题目传给主组件
    onConfirm(selectedQuestions)
    // 关闭 Modal
    setIsModalOpen(false)
    // 清空选中状态（可选）
    setSelectedRowKeys([])
  }

  const [loading, setLoading] = useState(false)
  const dataSource = list.map((item) => ({
    key: item._id,
    question: item.question,
    name: Type.find((type) => type.type === item.type)!.name,
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
      // 修改：使用自定义的确认逻辑
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