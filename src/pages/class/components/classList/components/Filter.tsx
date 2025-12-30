import type { ClassifyItem, ClassifyListRes, UserListResponse } from '@/services/types'
import {
  ProFormSelect,
  ProFormText,
  QueryFilter,
} from '@ant-design/pro-components'

interface FilterProps {
  classifyList?: ClassifyListRes['list']
  teacherList?: UserListResponse['list']
}

const Filter = ({ classifyList, teacherList }: FilterProps) => {
  const classifyOptions = classifyList?.map((item) => {
    return {
      label: item.name,
      value: item._id,
    }
  })
  const teacherOptions = teacherList?.map((item) => {
    return {
      label: item.username,
      value: item._id,
    }
  })
  return (
    <QueryFilter defaultCollapsed split span={8}>
      <ProFormText name='name' label='班级名称' />
      <ProFormSelect name='teacher' label='老师' options={teacherOptions} />
      <ProFormSelect name='classify' label='科目类别' options={classifyOptions} />
    </QueryFilter>
  )
}

export default Filter
