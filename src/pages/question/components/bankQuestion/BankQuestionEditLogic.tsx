import { useState } from 'react'
import { message } from 'antd'
import { useRequest } from 'ahooks'
import { updateQuestion, deleteQuestion } from '@/services'
import type { ApiResponse} from './types'
import type { MenuListItem } from '@/services/types'

// 定义对外暴露的属性类型
export interface BankQuestionEditLogicProps {
  refreshQuestionList: () => void
}

// 定义对外暴露的状态和方法类型（已添加 setCurrentEditId 类型）
export interface BankQuestionEditLogicReturn {
  currentEditId: string | null
  editFormData: Record<string, any>
  setEditFormData: (data: Record<string, any>) => void
  setCurrentEditId: React.Dispatch<React.SetStateAction<string | null>> // 已添加：setCurrentEditId 类型定义
  currentDetailId: string | null
  setCurrentDetailId: (id: string | null) => void
  drawerVisible: boolean
  setDrawerVisible: (visible: boolean) => void
  deleteLoading: boolean
  doCancelEdit: () => void
  handleSave: (id: string) => Promise<void>
  handleDelete: (id: string) => void
  handleViewDetail: (id: string) => void
}

// 拆分后的编辑/删除核心逻辑
export const useBankQuestionEditLogic = ({
  refreshQuestionList
}: BankQuestionEditLogicProps): BankQuestionEditLogicReturn => {
  // 编辑状态相关State
  const [currentEditId, setCurrentEditId] = useState<string | null>(null)
  const [editFormData, setEditFormData] = useState<Record<string, any>>({})
  const [currentDetailId, setCurrentDetailId] = useState<string | null>(null)
  const [drawerVisible, setDrawerVisible] = useState(false)

  // 编辑接口请求
  const { run: runUpdateQuestion } = useRequest<ApiResponse<MenuListItem>, any>(
    updateQuestion,
    { manual: true }
  )

  // 删除接口请求
  const { run: runDeleteQuestion, loading: deleteLoading } = useRequest<ApiResponse<MenuListItem>, any>(
    deleteQuestion,
    {
      manual: true,
      onSuccess: () => {
        message.success('试题删除成功！')
        refreshQuestionList()
        if (currentEditId) {
          doCancelEdit()
        }
        if (drawerVisible) {
          setDrawerVisible(false)
        }
      },
      onError: (err) => {
        message.error('试题删除失败，请重试！')
        console.error('删除失败原因：', err)
      }
    }
  )

  // 取消编辑
  const doCancelEdit = () => {
    setCurrentEditId(null)
    setEditFormData({})
  }

  // 保存编辑（已添加 await 增强稳定性）
  const handleSave = async (id: string) => {
    try {
      await runUpdateQuestion({ id, ...editFormData }) // 新增 await，确保请求完成后再执行后续操作
      refreshQuestionList()
      doCancelEdit()
      message.success('试题更新成功！')
    } catch (err) {
      message.error('试题更新失败，请重试！')
      console.error('保存失败：', err)
    }
  }

  // 删除试题
  const handleDelete = (id: string) => {
    console.log('要删除的试题ID:', id)
    runDeleteQuestion({ _id: id })
  }

  // 查看试题详情（关联编辑状态的抽屉控制）
  const handleViewDetail = (id: string) => {
    setCurrentDetailId(id)
    setDrawerVisible(true)
  }

  return {
    currentEditId,
    editFormData,
    setEditFormData,
    setCurrentEditId, // 已添加：暴露 setCurrentEditId 方法（编辑功能可用的关键）
    currentDetailId,
    setCurrentDetailId,
    drawerVisible,
    setDrawerVisible,
    deleteLoading,
    doCancelEdit,
    handleSave,
    handleDelete,
    handleViewDetail
  }
}