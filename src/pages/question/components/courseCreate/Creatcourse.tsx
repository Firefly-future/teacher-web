import type {
  EditableFormInstance,
  ProColumns,
  ProFormInstance,
} from '@ant-design/pro-components'
import {
  EditableProTable,
  ProForm,
  ProFormSegmented,
} from '@ant-design/pro-components'
import { Button, message } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import { createClassify, getClassifyList, updateClassify } from '@/services'
import type { ClassifyListParams, ClassifyItemList } from '@/services/types'

const CreateCourse: React.FC = () => {
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>(() => [])
  const [position, setPosition] = useState<'top' | 'bottom' | 'hidden'>(
    'bottom'
  )
  const [controlled, setControlled] = useState<boolean>(false)

  const formRef = useRef<ProFormInstance<any>>(null)
  const editorFormRef = useRef<EditableFormInstance<ClassifyItemList>>(null)
  const [defaultPage] = useState<ClassifyListParams>({ page: 1, pagesize: 2 })

  /* 获取分类数据 */
  const getClassify = async (params: ClassifyListParams) => {
    try {
      const res = await getClassifyList(params)
      formRef.current?.setFieldsValue({ table: res.data.list })
    } catch (e) {
      console.error(e)
    }
  }

  const handleSave = async (
    key: React.Key, 
    row: ClassifyItemList & { index?: number },
    originRow: ClassifyItemList & { index?: number },
    newLineConfig?: any
  ): Promise<any> => {
    try {
      if (row._id && !String(row._id).startsWith('new_')) {
        await updateClassify({ id: row._id, name: row.name })
      } else {
        await createClassify({ name: row.name, value: row.value })
      }
      message.success('操作成功')
      getClassify(defaultPage)
    } catch (e) {
      console.error(e)
      message.error('操作失败')
    }
  }

  useEffect(() => {
    getClassify(defaultPage)
  }, [])

  const columns: ProColumns<ClassifyItemList>[] = [
    {
      title: '科目名称',
      dataIndex: 'name',
      tooltip: '不可以重复科目',
      width: '20%',
    },
    { title: '科目内容', dataIndex: 'value' },
    {
      title: '操作',
      valueType: 'option',
      width: 200,
      render: (text, record, _, action) => [
        <a key='editable' onClick={() => action?.startEditable?.(record._id)}>
          编辑
        </a>,
      ],
    },
  ]

  const createEmptyRecord = (): ClassifyItemList => ({
    _id: `new_${Date.now()}`,
    name: '',
    value: '',
    creator: '',
    createTime: Date.now(),
  })

  return (
    <ProForm<{ table: ClassifyItemList[] }>
      formRef={formRef}
      initialValues={{ table: [] }}
      submitter={false}
    >
      <EditableProTable<ClassifyItemList>
        rowKey={(record) => record._id}
        scroll={{ x: 960 }}
        editableFormRef={editorFormRef}
        headerTitle='科目创建表'
        name='table'
        controlled={controlled}
        recordCreatorProps={
          position === 'hidden'
            ? false
            : {
              position: position as 'top' | 'bottom',
              record: createEmptyRecord,
            }
        }
        toolBarRender={() => [
          <ProFormSegmented
            key='render'
            fieldProps={{
              style: { marginBlockEnd: 0 },
              value: position,
              onChange: (v) => setPosition(v as any),
            }}
            noStyle
            request={async () => [
              { label: '添加到顶部', value: 'top' },
              { label: '添加到底部', value: 'bottom' },
              { label: '隐藏', value: 'hidden' },
            ]}
          />,
          <Button
            key='rows'
            onClick={() => console.log(editorFormRef.current?.getRowsData?.())}
          >
            获取 table 的数据
          </Button>,
        ]}
        columns={columns}
        editable={{
          type: 'multiple',
          editableKeys,
          onChange: setEditableRowKeys,
          onSave: handleSave, // 现在类型完全匹配
        }}
      />
    </ProForm>
  )
}

export default CreateCourse
