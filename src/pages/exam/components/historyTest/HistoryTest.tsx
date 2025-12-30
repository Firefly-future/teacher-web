import React, { useState, useEffect } from 'react'
import { DownOutlined } from '@ant-design/icons'
import { Button, Col, Form, Input, Row, Select, Space, theme, DatePicker } from 'antd'
import { getClassifyList, getExaminerList, getClassList } from '@/services'
import type { ClassifyItem, ClassItem, ExaminerItem } from '@/services/types'
import style from './HistoryTest.module.scss'
import TestTable from './testTable'

const { RangePicker } = DatePicker

interface searchParams {
  examName?: string;
  classify?: string;
  creator?: string;
  createTime?: [Date, Date];
  status?: string;
  examiner?: string;
  group?: string;
  examTime?: [Date, Date];
}

interface AdvancedSearchFormProps {
  onSearch: (params: searchParams) => void;
}

const AdvancedSearchForm:React.FC<AdvancedSearchFormProps> = ({ onSearch }) => {
  const { token } = theme.useToken()
  const [form] = Form.useForm()
  const [expand, setExpand] = useState(false)

  // 科目分类选项
  const [classifyOptions, setClassifyOptions] = useState<ClassifyItem[]>([])
  // 监考人选项
  const [examinerOptions, setExaminerOptions] = useState<ExaminerItem[]>([])
  // 考试班级选项
  const [classOptions, setClassOptions] = useState<ClassItem[]>([])

  const formStyle: React.CSSProperties = {
    maxWidth: 'none',
    borderRadius: token.borderRadiusLG,
    padding: 24,
  }

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [classifyRes, examinerRes, classRes] = await Promise.all([
          getClassifyList(),
          getExaminerList(),
          getClassList(),
        ])

        if (classifyRes.code === 200) {
          setClassifyOptions(classifyRes.data.list)
        }
        if (examinerRes.code === 200) {
          setExaminerOptions(examinerRes.data.list)
        }
        if (classRes.code === 200) {
          setClassOptions(classRes.data.list)
        }
      } catch (err) {
        console.error('加载选项失败:', err)
      }
    }
    loadOptions()
  }, [])

  const getFields = () => {
    const basicFields = [
      // 考试名称
      {
        name: 'examName',
        label: '考试名称',
        component: <Input placeholder="请输入考试名称" />,
        rules: [{ required: false, message: '请输入' }]
      },
      // 科目分类
      {
        name: 'classify',
        label: '科目分类',
        component: (
          <Select
            options={classifyOptions.map(item => ({
              label: item.name,
              value: item._id,
            }))}
            placeholder="请选择"
          />
        ),
        rules: [{ required: false, message: '请选择科目分类' }]
      },
      // 创建者
      {
        name: 'creator',
        label: '创建者',
        component: <Input placeholder="请输入" />
      }
    ]

    const advancedFields = [
      // 创建时间
      {
        name: 'createTime',
        label: '创建时间',
        component: <RangePicker style={{ width: '100%' }} showTime placeholder={['创建时间','创建时间']} />,
      },
      // 考试状态
      {
        name: 'status',
        label: '考试状态',
        component: (
          <Select
            options={[
              { label: '全部', value: '' },
              { label: '未开始', value: '0' },
              { label: '进行中', value: '1' },
              { label: '已结束', value: '2' }
            ]}
            placeholder="请选择"
          />
        ),
        rules: [{ required: false, message: '请选择考试状态' }]
      },
      // 监考人
      {
        name: 'examiner',
        label: '监考人',
        component: <Input placeholder="请输入" />
      },
      // 考试班级
      {
        name: 'group',
        label: '考试班级',
        component: (
          <Select
            options={classOptions.map(item => ({
              label: item.name,
              value: item._id,
            }))}
            placeholder="请选择"
          />
        ),
        rules: [{ required: false, message: '请选择考试班级' }]
      },
      // 考试时间
      {
        name: 'examTime',
        label: '考试时间',
        component: <RangePicker style={{ width: '100%' }} showTime />,
        rules: [{ required: false, message: '请选择考试时间' }]
      },

    ]

    const fields = expand ? [...basicFields, ...advancedFields] : basicFields

    return fields.map((field, index) => (
      <Col span={8} key={field.name}>
        <Form.Item
          name={field.name}
          label={field.label}
          rules={field.rules}
        >
          {field.component}
        </Form.Item>
      </Col>
    ))
  }

  const onFinish = (values: any) => {
    console.log('查询条件:', values)
    onSearch(values)
    // 这里可以添加实际的查询逻辑
  }

  const handleReset = () => {
    form.resetFields()
    onSearch({}) // 重置时触发查询
  }

  return (
    <Form form={form} name="history_exam_search" style={formStyle} onFinish={onFinish}>
      <Row gutter={24}>{getFields()}</Row>
      <div style={{ textAlign: 'end' }}>
        <Space size="small">
          <Button type="primary" htmlType="submit">
            查询
          </Button>
          <Button onClick={handleReset}>
            重置
          </Button>
          <a
            style={{ fontSize: 12 }}
            onClick={() => {
              setExpand(!expand)
            }}
          >
            <DownOutlined rotate={expand ? 180 : 0} />
            {expand ? '收起' : '展开'}
          </a>
        </Space>
      </div>
    </Form>
  )
}

const HistoryTest: React.FC = () => {
  const { token } = theme.useToken()
  const [searchParams, setSearchParams] = useState<searchParams>({})

  const listStyle: React.CSSProperties = {
    lineHeight: '200px',
    textAlign: 'center',
    borderRadius: token.borderRadiusLG,
    marginTop: 16,
  }

  const handleSearch = (params: searchParams) => {
    setSearchParams(params)
  }

  return (
    <div className={style.testFilter}>
      <>
        <AdvancedSearchForm onSearch={handleSearch} />
        {/* <div style={listStyle}>Search Result List</div> */}
        <TestTable searchParams={searchParams} />
      </>
    </div>
  )
}

export default HistoryTest