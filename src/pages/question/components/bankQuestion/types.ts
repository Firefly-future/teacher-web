// 导入外部依赖类型
import type { TableProps } from 'antd'
import type {  RoleItem } from '@/services/types'

// 1. 下拉框选项类型
export interface OptionType {
  label: string
  value: string
  key: string
}

// 2. 搜索表单组件 Props 类型
export interface AdvancedSearchFormProps {
  typeOptions?: OptionType[]
  classifyOptions?: OptionType[]
  onSearch: (values: Record<string, any>) => void
}

// 3. 题型接口返回项类型
export interface TypeItem {
  name: string
  value: string | number
  _id: string
  id?: string
}

// 4. 分类接口返回项类型
export interface ClassifyItem {
  createTime: any
  createdAt: any
  name: string
  value: string | number
  _id: string
}

// 5. 通用接口返回格式（泛型，可复用）
export interface ApiResponse<T> {
  code: number;
  data: {
    createTime: (createdAt: any) => import("react").ReactNode
    id: any;
    _id: any;
    createdAt(createdAt: any): import("react").ReactNode
    type(type: any): unknown
    classify: string
    question: string
    list: T[]
  }
}

// 6. 试题列表单项类型
export interface QuestionItem {
  createTime: string
  _id: string
  question: string
  type: string | number
  classify: string
  createdAt: string
}

// 7. 试题列表接口完整返回类型
export interface QuestionListResponse {
  code: number
  data: {
    list: QuestionItem[]
  }
}

// 8. 表格列类型（可选：简化表格列定义的类型标注）
export type QuestionTableColumns = TableProps<RoleItem>['columns']

export interface QuestionRecord {
  createdAt(createdAt: any): unknown
  _id: string
  question: string
  type: string | number
  classify: string
  createTime: string | number
}

