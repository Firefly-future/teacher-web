import React, { useState, useMemo } from 'react'
import style from './BankQuestion.module.scss'
import { QuestionCircleOutlined, ExclamationCircleOutlined, DownloadOutlined } from '@ant-design/icons'
import { getQuestionList, getQuestionTypeList, getQuestionClassifyList, getQuestionDetail, createQuestion } from '@/services'
import { useRequest } from 'ahooks'
import { Button, Flex, Col, Form, Input, Row, Select, theme, Space, type TableProps, Table, Popconfirm, message, Drawer, Descriptions } from 'antd'
import type { MenuListItem} from '@/services/types'
import type {
  AdvancedSearchFormProps,
  TypeItem,
  ClassifyItem,
  ApiResponse,
  QuestionListResponse,
  QuestionRecord
} from './types'
import { useBankQuestionEditLogic } from './BankQuestionEditLogic'
import { Link } from 'react-router-dom'

const AdvancedSearchForm: React.FC<AdvancedSearchFormProps> = ({ typeOptions = [], classifyOptions = [], onSearch }) => {
  const { token } = theme.useToken()
  const [form] = Form.useForm()

  const formStyle: React.CSSProperties = {
    maxWidth: 'none',
    background: token.colorBgContainer,
    margin: '24px 0 0 10px',
    padding: 24,
    borderRadius: token.borderRadiusLG,
  }

  const handleFinish = (values: any) => {
    console.log('Received values of form: ', values)
    onSearch(values)
  }
  const getFields = () => {
    const children: React.ReactNode[] = [
      <Col span={24} key="question-form-row">
        <Flex gap={24} align="flex-end" className={style.formFlexContainer}>
          <Form.Item
            name="QuestionSearch"
            label={<span className={style.specialFormLabel}>试题搜索</span>}
            className={style.questionSearchItem}
          >
            <Input placeholder="请输入题干关键词" className={style.questionInput} autoComplete='off' />
          </Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className={style.searchBtn}
          >
            搜索
          </Button>
          <Form.Item
            name='Classify'
            label={<span className={style.specialFormLabel}>试题分类</span>}
            className={style.formItemCommon}
          >
            <Select
              options={classifyOptions}
              placeholder="请选择"
            />
          </Form.Item>
          <Form.Item
            name='Type'
            label={<span className={style.specialFormLabel}>试题类型</span>}
            className={style.formItemCommon}
          >
            <Select
              placeholder="请输入题型"
              options={typeOptions}
            />
          </Form.Item>
        </Flex>
      </Col>
    ]
    return children
  }

  return (
    <Form form={form} name="advanced_search" style={formStyle} onFinish={handleFinish}>
      <Row gutter={24}>{getFields()}</Row>
    </Form>
  )
}

const BankQuestion = () => {
  const [searchParams, setSearchParams] = useState<Record<string, any>>({})

  // 接口请求（保持原有逻辑，无改动）
  const { data: listRes, loading, run: refreshQuestionList } = useRequest<QuestionListResponse, any>(getQuestionList)
  const { data: _typeRes } = useRequest<ApiResponse<TypeItem>, any>(getQuestionTypeList)
  const { data: _classifyRes } = useRequest<ApiResponse<ClassifyItem>, any>(getQuestionClassifyList)
  const { data: _createRes } = useRequest<ApiResponse<QuestionRecord>, any>(createQuestion)
  // 导入拆分后的编辑/删除逻辑
  const {
    currentEditId,
    editFormData,
    setEditFormData,
    setCurrentEditId, 
    currentDetailId,
    drawerVisible,
    setDrawerVisible,
    deleteLoading,
    doCancelEdit,
    handleSave,
    handleDelete,
    handleViewDetail
  } = useBankQuestionEditLogic({ refreshQuestionList })
  const { data: detailRes, loading: getDetailLoading } = useRequest<ApiResponse<MenuListItem>, any>(
    () => {
      if (!currentDetailId) return Promise.reject(new Error('试题ID不存在'))
      return getQuestionDetail(currentDetailId)
    },
    {
      manual: false,
      refreshDeps: [currentDetailId],
    }
  )
  const classifyTimeMap = useMemo(() => {
    if (!_classifyRes || _classifyRes.code !== 200 || !_classifyRes.data?.list) {
      return new Map()
    }
    const timeMap = new Map<string, string | number>()
    _classifyRes.data.list.forEach(classifyItem => {
      const classifyTime = classifyItem.createdAt ?? classifyItem.createTime
      timeMap.set(classifyItem._id, classifyTime)
      timeMap.set(String(classifyItem.value).toLowerCase(), classifyTime)
      timeMap.set(classifyItem.name.toLowerCase(), classifyTime)
    })
    return timeMap
  }, [_classifyRes])
  const typeOptions = React.useMemo(() => {
    if (!_classifyRes || _classifyRes.code !== 200 || !_classifyRes.data?.list) {
      return []
    }
    return _classifyRes.data.list.map(item => ({
      label: item.name,
      value: item.value.toString(),
      key: item._id
    }))
  }, [_classifyRes])

  const classifyOptions = React.useMemo(() => {
    if (!_typeRes || _typeRes.code !== 200 || !_typeRes.data?.list) {
      return []
    }
    return _typeRes.data.list.map(item => ({
      label: item.name,
      value: item.value.toString(),
      key: item._id || item.id || String(item.value)
    }))
  }, [_typeRes])
  const filteredDataSource = useMemo<QuestionRecord[]>(() => {
    if (!listRes || !listRes.data || !Array.isArray(listRes.data.list)) {
      return []
    }
    const originalList = listRes.data.list
    const { QuestionSearch = '', Classify = '', Type = '' } = searchParams
    return originalList.map(item => {
      const questionClassifyStr = String(item.classify).toLowerCase()
      const targetClassifyTime = classifyTimeMap.get(item.classify) || 
                                 classifyTimeMap.get(questionClassifyStr) ||
                                 classifyTimeMap.get(String(item.classify))
      return {
        ...item,
        createdAt: item.createdAt || item.createTime || targetClassifyTime
      }
    }).filter(item => {
      const questionMatch = QuestionSearch
        ? item.question?.toLowerCase().includes(QuestionSearch.toLowerCase())
        : true
      const classifyMatch = Classify
        ? String(item.classify) === Classify
        : true
      const typeMatch = Type
        ? String(item.type) === Type
        : true
      return questionMatch && classifyMatch && typeMatch
    })
  }, [listRes, searchParams, classifyTimeMap])

  const handleSearch = (values: Record<string, any>) => {
    setSearchParams(values)
  }

  const handleExportPdf = () => {
    if (!currentDetailId || !detailRes?.data) {
      message.warning('暂无试题数据,无法导出PDF!')
      return
    }
    console.log('导出试题PDF,试题ID:', currentDetailId)
    message.info('正在导出PDF,请稍后...')
  }

  const handleOk = () => {
    setDrawerVisible(false)
    message.success('操作完成！')
  }

  const typeMap: Record<string, string> = {
    '1': '单选题',
    '2': '多选题',
    '3': '判断题',
    '4': '填空题'
  }

  const formatCreatedAt = (createdAt?: number | string): string => {
    if (!createdAt) return '无数据'
    try {
      return new Date(createdAt).toLocaleString()
    } catch (e) {
      return '无效时间'
    }
  }
  const columns: TableProps<QuestionRecord>['columns'] = [
    {
      title: <span className={style.tableHeaderCommon}>试题列表</span>,
      dataIndex: 'question',
      key: 'question',
      className: style.tableColumnName,
      align: 'center',
      width: 300,
      render: (_, record) => {
        if (currentEditId === record._id) {
          return (
            <div style={{ width: '100%', boxSizing: 'border-box' }}>
              <Input
                value={editFormData.question ?? ''}
                onChange={(e) => {
                  setEditFormData((prev: any) => ({ ...prev, question: e.target.value }))
                }}
                className={style.editInput}
                style={{
                  width: '100%',
                  margin: 0,
                  padding: '4px 8px',
                  border: '1px solid #d9d9d9',
                  textAlign: 'center'
                }}
              />
            </div>
          )
        }
        return (
          <div className={style.tableColumnName}>
            {record.question || '-'}
          </div>
        )
      }
    },
    {
      title: <span className={style.tableHeaderCommon}>分类</span>,
      dataIndex: 'type',
      key: 'type',
      className: style.tableColumnClassify,
      align: 'center',
      width: 120,
      render: (_, record) => {
        const typeStr = String(record.type)
        const formatTypeText = typeMap[typeStr] || `未知题型(${typeStr})`

        if (currentEditId === record._id) {
          return (
            <div style={{ width: '100%', boxSizing: 'border-box' }}>
              <Input
                value={editFormData.formatTypeText ?? ''}
                onChange={(e) => {
                  setEditFormData((prev: any) => ({
                    ...prev,
                    type: record.type,
                    formatTypeText: e.target.value
                  }))
                }}
                className={style.editInput}
                style={{
                  width: '100%',
                  margin: 0,
                  padding: '4px 8px',
                  textAlign: 'center'
                }}
              />
            </div>
          )
        }
        return <div style={{ width: '100%', padding: '4px 0' }}>{formatTypeText}</div>
      }
    },
    {
      title: <span className={style.tableHeaderCommon}>题型</span>,
      dataIndex: 'classify',
      key: 'classify',
      className: style.tableColumnType,
      align: 'center',
      width: 120,
      render: (_, record) => {
        if (currentEditId === record._id) {
          return (
            <div style={{ width: '100%', boxSizing: 'border-box' }}>
              <Input
                value={editFormData.classify ?? ''}
                onChange={(e) => {
                  setEditFormData((prev: any) => ({ ...prev, classify: e.target.value }))
                }}
                className={style.editInput}
                style={{
                  width: '100%',
                  margin: 0,
                  padding: '4px 8px',
                  textAlign: 'center'
                }}
              />
            </div>
          )
        }
        return <div style={{ width: '100%', padding: '4px 0' }}>{record.classify || '-'}</div>
      }
    },
    {
      title: <span className={style.tableHeaderCommon}>创建时间</span>,
      dataIndex: 'createdAt',
      key: 'createdAt',
      className: style.tableColumnTime,
      align: 'center',
      width: 200,
      render: (_, record) => {
        const formatTimeText = formatCreatedAt(record.createdAt)

        if (currentEditId === record._id) {
          return (
            <div style={{ width: '100%', boxSizing: 'border-box' }}>
              <Input
                value={editFormData.formatTimeText ?? ''}
                onChange={(e) => {
                  setEditFormData((prev: any) => ({
                    ...prev,
                    createdAt: record.createdAt,
                    formatTimeText: e.target.value
                  }))
                }}
                className={style.editInput}
                style={{
                  width: '100%',
                  margin: 0,
                  padding: '4px 8px',
                  textAlign: 'center'
                }}
              />
            </div>
          )
        }

        return <div style={{ width: '100%', padding: '4px 0' }}>{formatTimeText}</div>
      }
    },
    {
      title: <span className={style.tableHeaderCommon}>操作</span>,
      key: 'action',
      fixed: 'end',
      className: style.tableColumnOperation,
      align: 'center',
      width: 220,
      render: (_, record) => {
        if (currentEditId === record._id) {
          return (
            <Space size="middle">
              <Button size="small" type="primary" onClick={() => handleSave(record._id)}>保存</Button>
              <Popconfirm
                title="Sure to cancel?"
                description=""
                icon={<ExclamationCircleOutlined style={{ color: '#faad14' }} />}
                okText="确定"
                cancelText="取消"
                onConfirm={() => doCancelEdit()}
                placement="top"
                style={{ borderRadius: '8px' }}
              >
                <Button size="small">取消</Button>
              </Popconfirm>
            </Space>
          )
        }
        return (
          <Space size="middle">
            <Button
              size="small"
              type="primary"
              onClick={() => {
                const typeStr = String(record.type)
                const formatTypeText = typeMap[typeStr] || `未知题型(${typeStr})`
                const formatTimeText = formatCreatedAt(record.createdAt)
                setCurrentEditId(record._id)
                setEditFormData({
                  ...record,
                  formatTypeText: formatTypeText,
                  formatTimeText: formatTimeText
                })
              }}
            >
              编辑
            </Button>
            <Popconfirm
              title="删除试题"
              description="此操作不可撤销，确定要删除吗？"
              icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
              okText="确定"
              cancelText="取消"
              placement="top"
              onConfirm={() => handleDelete(record._id)}
            >
              <Button size="small" danger loading={deleteLoading}>删除</Button>
            </Popconfirm>
            <Button size="small" onClick={() => handleViewDetail(record._id)}>试题详情</Button>
          </Space>
        )
      },
    },
  ]

  const detailData = useMemo(() => {
    if (!detailRes || detailRes.code !== 200 || !detailRes.data) {
      return null
    }
    return detailRes.data
  }, [detailRes])

  return (
    <div>
      <Link to="/question/create-item"><Button type="primary" className={style.title}>添加试题</Button></Link>  
      <AdvancedSearchForm
        typeOptions={typeOptions}
        classifyOptions={classifyOptions}
        onSearch={handleSearch}
      />
      <Table<QuestionRecord>
        loading={loading}
        columns={columns}
        dataSource={filteredDataSource}
        rowKey={row => row._id}
        className={style.globalTable}
        scroll={{ x: '100%' }}
        pagination={{ pageSize: 10 }}
      />

      <Drawer
        title="试题详情"
        placement="right"
        width={600}
        open={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        maskClosable={true}
        loading={getDetailLoading}
        extra={
          <Space size="small">
            <Button
              type="default"
              icon={<DownloadOutlined />}
              onClick={handleExportPdf}
              disabled={!detailData}
            >
              导出PDF
            </Button>
            <Button
              type="primary"
              onClick={handleOk}
            >
              OK
            </Button>
          </Space>
        }
      >
        {detailData ? (
          <Descriptions column={1} bordered size="middle" style={{ marginTop: 16 }}>
            <Descriptions.Item label="试题题干">{detailData.question || '-'}</Descriptions.Item>
            <Descriptions.Item label="试题类型">
              {typeMap[String(detailData.type)] || `未知题型(${detailData.type || '-'})`}
            </Descriptions.Item>
            <Descriptions.Item label="试题分类">{detailData.classify || '-'}</Descriptions.Item>
            <Descriptions.Item label="创建时间">
            </Descriptions.Item>
            <Descriptions.Item label="试题ID">{detailData._id || detailData.id || '-'}</Descriptions.Item>
          </Descriptions>
        ) : (
          <div style={{ textAlign: 'center', padding: 40 }}>
            {getDetailLoading ? '加载中...' : '暂无试题详情数据'}
          </div>
        )}
      </Drawer>
    </div>
  )
}
export default BankQuestion