import React, { useEffect, useState } from 'react'
import { Divider, message, Steps } from 'antd'
import style from './CreateTest.module.scss'
import {
  Button,
  DatePicker,
  Form,
  Input,
  Select,
  TreeSelect,
} from 'antd'
import { createExam, getClassifyList, getClassList, getExaminerList } from '@/services'
import type { ClassifyItem, ClassItem, CreateExamParams, ExaminerItem } from '@/services/types'

import SetExam from './setexam/SetExam'

const { RangePicker } = DatePicker

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 },
  },
}

// 考试类型定义
interface ExamValues {
  name: string
  classify: string
  group: string[]
  examiner: string[]
  // examiner?: string
  examTime?: Date[]
  // 配置试卷
  // examItem: string
  examId: string
  pageName?: string
  questionCount?: number
  totalScore?: number
  // 发布考试
  examDec?: string
  status?: number
}

const CreateTest: React.FC = () => {
  const [current, setCurrent] = useState(0)
  const [loading, setLoading] = useState(false)

  //科目分类
  const [classifyOptions, setClassifyOptions] = useState<ClassifyItem[]>([])

  // 监考人
  const [examinerOptions, setExaminerOptions] = useState<ExaminerItem[]>([])
  // 考试班级
  const [classOptions, setClassOptions] = useState<ClassItem[]>([])

  const [form] = Form.useForm<ExamValues>()

  useEffect(() => {
    const hasExamData = async () => {
      try {
        const [classifyRes, examinerRes, classRes] = await Promise.all([
          getClassifyList({ page: 1, pagesize: 100 }),
          getExaminerList(),
          getClassList(),
        ])

        // 设置科目分类
        if (classifyRes.code === 200) {
          setClassifyOptions(classifyRes.data.list)
        }
        // 设置监考人
        if (examinerRes.code === 200) {
          setExaminerOptions(examinerRes.data.list)
        }
        // 设置考试班级
        if (classRes.code === 200) {
          setClassOptions(classRes.data.list)
        }
      } catch (err) {
        console.log(err)
        message.error('获取考试基本信息失败')
      }
    }
    hasExamData()
  }, [])

  // 选择试卷
  const handleExamSelect = (examId: string) => {
    form.setFieldsValue({
      examId: examId,
    })
    form.validateFields(['examId'])
  }

  // 下一步
  const handleNext = async () => {
    try {
      // 验证当前步骤的表单
      if (current === 0) {
        await form.validateFields(['name', 'examTime', 'classify', 'examiner', 'group'])
      } else if (current === 1) {
        await form.validateFields(['examId'])
      }

      // 点击进入下一步
      setCurrent(current + 1)
    } catch (err) {
      console.log(err)
      message.error('请填写完整信息')
    }
  }

  // 点击上一步
  const handleBack = () => {
    setCurrent(current - 1)
  }

  // 提交表单
  // const handleSubmit = async () => {
  //   try {
  //     setLoading(true)
  //     // 验证所有表单字段
  //     await form.validateFields()
  //     const formValues = form.getFieldsValue()

  //     // 确保examItem存在且不为空
  //     if (!formValues.examId) {
  //       message.error('请选择试卷')
  //       return
  //     }

  //     // 转换日期格式为时间戳
  //     let startTime = 0
  //     let endTime = 0
  //     if (formValues.examTime && formValues.examTime.length === 2) {
  //       startTime = new Date(formValues.examTime[0]).getTime()
  //       endTime = new Date(formValues.examTime[1]).getTime()
  //     }

  //     // 
  //     const examParams: CreateExamParams = {
  //       name: formValues.name,
  //       classify: formValues.classify,
  //       // examItem: formValues.examItem,
  //       examId: formValues.examId,
  //       group: formValues.group,
  //       examiner: formValues.examiner,
  //       startTime,
  //       endTime
  //     }

  //     const res = await createExam(examParams)
  //     console.log(res)
  //     if (res.code === 200) {
  //       message.success('创建成功')
  //       // 重置表单
  //       form.resetFields()
  //       setCurrent(0)
  //     } else {
  //       message.error(res.msg || '创建失败')
  //     }
  //   } catch (err) {
  //     console.log(err)
  //     message.error('创建考试失败,请重试')
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  // 提交表单
  const handleSubmit = async () => {
    try {
      setLoading(true)

      // 强制获取所有字段值，包括未渲染的字段
      const formValues = form.getFieldsValue(true)
      console.log('表单数据:', formValues)

      if (!formValues.examId) {
        message.error('请选择试卷')
        return
      }
      // 验证必填字段
      // if (!formValues.name) {
      //   message.error('请输入考试名称')
      //   return
      // }
      // if (!formValues.examTime || formValues.examTime.length !== 2) {
      //   message.error('请选择考试时间')
      //   return
      // }
      // if (!formValues.classify) {
      //   message.error('请选择科目分类')
      //   return
      // }
      // if (!formValues.examiner) {
      //   message.error('请选择监考人')
      //   return
      // }
      // if (!formValues.group) {
      //   message.error('请选择考试班级')
      //   return
      // }
      // if (!formValues.examId) {
      //   message.error('请选择试卷')
      //   return
      // }

      // 转换日期格式为时间戳
      let startTime = 0
      let endTime = 0
      if (formValues.examTime && formValues.examTime.length === 2) {
        startTime = new Date(formValues.examTime[0]).getTime()
        endTime = new Date(formValues.examTime[1]).getTime()
        console.log('时间戳:', { startTime, endTime })

        // 将毫秒级时间戳转换为秒级时间戳
        // startTime = Math.floor(new Date(formValues.examTime[0]).getTime() / 1000)
        // endTime = Math.floor(new Date(formValues.examTime[1]).getTime() / 1000)
        // console.log('时间戳:', { startTime, endTime })

        // 验证时间戳是否有效
        if (isNaN(startTime) || isNaN(endTime)) {
          message.error('考试时间格式无效，请重新选择')
          return
        }

        // 验证结束时间是否晚于开始时间
        if (endTime <= startTime) {
          message.error('考试结束时间必须晚于开始时间')
          return
        }
      }

      const examParams: CreateExamParams = {
        name: formValues.name,
        classify: formValues.classify,
        examId: formValues.examId,
        // group: formValues.group,
        group: Array.isArray(formValues.group) ? formValues.group : [formValues.group],
        examiner: formValues.examiner,
        startTime,
        endTime
      }

      console.log('提交参数:', examParams)

      const res = await createExam(examParams)
      console.log('API返回:', res)

      if (res.code === 200) {
        message.success('创建成功')
        // 重置表单
        form.resetFields()
        setCurrent(0)
      } else {
        message.error(res.msg || '创建失败')
      }
    } catch (err) {
      console.log('错误详情:', err)
      message.error('创建考试失败,请重试')
    } finally {
      setLoading(false)
    }
  }



  return (
    <div className={style.box}>
      <Steps
        className={style.steps}
        current={current}
        // onChange={onChange}
        items={[
          { title: '考试基本信息' },
          { title: '配置试卷' },
          { title: '发布考试' },
        ]}
      />

      {/* <Divider /> */}



      <Form
        className={style.form}
        {...formItemLayout}
        form={form}
      // onFinish={handleSubmit}
      >
        <Form.Item
          name="examId"
          rules={[{ required: true, message: '请选择试卷' }]}
          // hidden
          shouldUpdate
        >
          <Input type="hidden" />
        </Form.Item>
        {/* 创建信息 */}
        {current === 0 && (
          <>
            <Form.Item
              label="考试名称"
              name="name"
              rules={[{ required: true, message: '请输入考试名称' }]}
            >
              <Input style={{ width: 250 }} placeholder='请输入名称' />
            </Form.Item>

            <Form.Item
              label="考试时间"
              name="examTime"
              rules={[{ required: true, message: '请选择考试时间' }]}
            >
              <RangePicker style={{ width: 300 }} showTime />
            </Form.Item>


            <Form.Item
              label="科目分类"
              name="classify"
              rules={[{ required: true, message: '请选择科目分类' }]}
            >
              <Select
                options={classifyOptions.map(item => ({
                  label: item.name,
                  value: item._id,
                }))}
                placeholder='请选择' />
            </Form.Item>

            <Form.Item
              label="监考人"
              name="examiner"
              rules={[{ required: true, message: '请选择监考人' }]}
            >
              <Select
                mode="multiple"
                options={examinerOptions.map(item => ({
                  label: item.username,
                  value: item._id,
                }))}
                placeholder='请选择' />
            </Form.Item>

            <Form.Item
              label="考试班级"
              name="group"
              rules={[{ required: true, message: '请选择考试班级' }]}
            >
              <TreeSelect
                treeCheckable
                // mode="multiple"
                treeData={classOptions.map(item => ({
                  title: item.name,
                  value: item._id,
                  // value: item.grade,
                }))}
                placeholder='请选择'
                treeDefaultExpandAll
                showSearch
              />
            </Form.Item>
          </>
        )}

        {/* 配置试卷 */}
        {current === 1 && (
          <>
            <SetExam
              onSelect={handleExamSelect}
              selectedExamId={form.getFieldValue('examId')}
            />
          </>
        )}

        {current === 2 && (
          <>
            <Divider><h4>配置信息</h4></Divider>
            <Form.Item label="考试名称">
              <span>{form.getFieldValue('name')}</span>
            </Form.Item>



            <Form.Item label="科目分类">
              <span>
                {classifyOptions.find(item => item._id === form.getFieldValue('classify'))?.name}
              </span>
            </Form.Item>
            <Form.Item label="监考人">
              <span>
                {/* {examinerOptions.find(item => item._id === form.getFieldValue('examiner'))?.username} */}
                {/* 监考人多选 */}
                {Array.isArray(form.getFieldValue('examiner'))
                  ? form.getFieldValue('examiner').map((id: string) => examinerOptions.find(item => item._id === id)?.username).filter(Boolean).join(', ')
                  : examinerOptions.find(item => item._id === form.getFieldValue('examiner'))?.username
                }
              </span>
            </Form.Item>

            <Form.Item label="考试班级">
              <span>
                {/* {classOptions.find(item => item._id === form.getFieldValue('group'))?.name} */}
                {/* {classOptions.find(item => item.grade === form.getFieldValue('group'))?.name} */}
               
                {/* 班级多选 */}
                {Array.isArray(form.getFieldValue('group'))
                  ? form.getFieldValue('group').map((id: string) => classOptions.find(item => item._id === id)?.name).filter(Boolean).join(', ')
                  : classOptions.find(item => item._id === form.getFieldValue('group'))?.name
                }
              </span>
            </Form.Item>

            <Form.Item label="考试时间">
              <span>
                {new Date(form.getFieldValue('examTime')?.[0]).toLocaleString()} - {new Date(form.getFieldValue('examTime')?.[1]).toLocaleString()}
              </span>
            </Form.Item>

          </>
        )}

        <Form.Item label={null}>
          {current > 0 && (
            <Button  style={{ marginRight: 10 }} onClick={handleBack}>
              上一步
            </Button>
          )}

          {current < 2 ? (
            <Button  type="primary" onClick={handleNext} loading={loading}>
              下一步
            </Button>
          ) : (
            <Button type="primary" onClick={handleSubmit} loading={loading}>
              发布考试
            </Button>
          )}
        </Form.Item>
      </Form>

    </div>
  )
}

export default CreateTest