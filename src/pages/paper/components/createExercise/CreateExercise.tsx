/* eslint-disable react-hooks/rules-of-hooks */
import {
  ProCard,
  ProFormDependency,
  ProFormDigit,
  ProFormGroup,
  ProFormItem,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  StepsForm,
} from '@ant-design/pro-components'
import { Button, message, Space } from 'antd'
import { getClassifyList, getQuestionList, createPaper } from '@/services'
import ModalQuestion from './ModalQuestion'
import type {
  ClassifyItemList,
  ClassifyListParams,
  QuestionItemList,
  QuestionListParams,
  CreatePaperParams,
} from '@/services/types'
import { useEffect, useState, useRef } from 'react'
import { API_CODE } from '@/constants/Constants'
import type { FormInstance } from 'antd'

const parseQuestionIds = (val: unknown): string[] => {
  if (Array.isArray(val)) return val.filter(Boolean).map(String)
  if (typeof val === 'string') {
    return val
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
  }
  return []
}

const waitTime = (time: number = 1) =>
  new Promise((resolve) => setTimeout(() => resolve(true), time * 1000))

// ... existing code ...
const CreateExercise = () => {
  const [selectQuestions, setSelectQuestions] = useState<QuestionItemList[]>([])
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [options, setOptions] = useState<ClassifyItemList[]>([])
  const [allValues, setAllValues] = useState<Record<string, any>>({
    choiceQuestions: [] as QuestionItemList[],
    name: '',
    remark: '',
    classify: '',
    type: 'manual',
    randomNum: 0,
  })

  const stepsFormRef = useRef<FormInstance>(null)
  const subOptions = options.map((item) => ({ label: item.name, value: item._id }))
  const defaultPage = { page: 1, pagesize: 100 }

  const CreateClassifyList = async (p: ClassifyListParams) => {
    try {
      const res = await getClassifyList(p)
      if (res.code === API_CODE.SUCCESS) setOptions(res.data?.list || [])
    } catch (e) {
      console.error('获取分类失败:', e)
    }
  }

  const [questionOptions, setQuestionOptions] = useState<QuestionItemList[]>([])
  const CreateQuestionList = async (p: QuestionListParams) => {
    try {
      const res = await getQuestionList(p)
      if (res.code === API_CODE.SUCCESS) {
        const list = (res.data?.list || []).map((q: any) => ({
          ...q,
          answer: q.answer ?? '', 
        }))
        setQuestionOptions(list)
        message.success('获取题目成功')
        return list
      } else {
        message.error(`创建失败：${res.msg || '未知错误'}`)
      }
    } catch (e) {
      console.error('获取题目失败:', e)
    }
  }

  /* ----------------  弹窗相关  ---------------- */
  const [isModalOpen, setIsModalOpen] = useState(false)
  const showModal = () => setIsModalOpen(true)
  const handleCancel = () => setIsModalOpen(false)

  const handleModalConfirm = (selectedQuestions: QuestionItemList[]) => {
    if (selectedQuestions.length === 0) {
      message.warning('请至少选择一道题目')
      return
    }
    setSelectQuestions(selectedQuestions)
    const ids = selectedQuestions.map((q) => q._id.toString())
    stepsFormRef.current?.setFieldsValue({ choice: ids }) // 数组
    setAllValues((prev) => ({ ...prev, choiceQuestions: selectedQuestions }))
    message.success(`已选择 ${selectedQuestions.length} 道题目`)
  }

  /* ----------------  随机抽题  ---------------- */
  const select = async () => {
    if (!stepsFormRef.current) return message.error('表单未初始化')
    const randomNum = stepsFormRef.current.getFieldValue('randomNum')
    if (!randomNum || randomNum <= 0) return message.error('请输入大于0的随机抽题数量')
    if (questionOptions.length === 0) return message.error('当前分类下暂无题目')

    const finalNum = Math.min(randomNum, questionOptions.length)
    if (randomNum > questionOptions.length)
      message.warning(`当前分类下仅有 ${questionOptions.length} 道题目，请调整随机抽题数量`)

    try {
      const shuffled = [...questionOptions]
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
      }
      const pickedQuestions = shuffled.slice(0, finalNum)
      const pickedIds = pickedQuestions.map((q) => q._id.toString())

      stepsFormRef.current.setFieldsValue({ choice: pickedIds }) // 数组
      setSelectQuestions(pickedQuestions)
      setAllValues((prev) => ({
        ...prev,
        choiceQuestions: pickedQuestions,
        randomNum: finalNum,
        choice: pickedIds,
      }))
      message.success(`已随机抽取 ${finalNum} 道题目`)
    } catch (e) {
      console.error('随机抽题失败:', e)
      message.error('随机抽题过程中出现错误，请重试')
    }
  }

  useEffect(() => {
    CreateClassifyList(defaultPage)
  }, [])

  const handleStep0Submit = async () => {
    if (!stepsFormRef.current) return message.error('表单未初始化')
    const step0Values = stepsFormRef.current.getFieldsValue(['name', 'remark'])
    setAllValues((prev) => ({ ...prev, ...step0Values }))
  }

  const handleStep1Submit = async () => {
    if (!stepsFormRef.current) return message.error('表单未初始化')
    const step1Values = stepsFormRef.current.getFieldsValue(['classify', 'type', 'choice', 'randomNum'])
    setAllValues((prev) => ({
      ...prev,
      ...step1Values,
      choiceQuestions: selectQuestions,
    }))
  }

  /* ----------------  信息展示  ---------------- */
  const PaperInfoDisplay = () => {
    const classifyName = subOptions.find((i) => i.value === allValues.classify)?.label || '未选择'
    const questionList = allValues.choiceQuestions || []
    return (
      <div style={{ width: 960, margin: '0 auto', fontSize: 14, color: '#000' }}>
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>试卷信息</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px 48px', lineHeight: '28px' }}>
            <div><strong>试卷名称：</strong>{allValues.name || '---'}</div>
            <div><strong>组卷方式：</strong>{allValues.type === 'manual' ? '选题组卷' : '随机组卷'}</div>
            <div><strong>科目：</strong>{classifyName}</div>
            <div><strong>备注：</strong>{allValues.remark || '---'}</div>
            {allValues.type === 'random' && (
              <div><strong>随机组卷数量：</strong>{allValues.randomNum ?? '---'}</div>
            )}
          </div>
        </div>

        <div>
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>试题展示</div>
          <div style={{ border: '1px solid #e8e8e8', borderRadius: 4, background: '#fff' }}>
            <div style={{ padding: '8px 16px', borderBottom: '1px solid #e8e8e8', background: '#fafafa', fontWeight: 500 }}>
              List of test questions
            </div>
            <div style={{ padding: '0 16px' }}>
              {questionList.length === 0 ? (
                <div style={{ padding: '16px 0', color: '#999' }}>暂无试题</div>
              ) : (
                questionList.map((q:any, idx:any) => (
                  <div
                    key={q._id || idx}
                    style={{
                      padding: '10px 0',
                      borderBottom: idx === questionList.length - 1 ? 'none' : '1px dashed #e8e8e8',
                      display: 'flex',
                      alignItems: 'flex-start',
                    }}
                  >
                    <span style={{ marginRight: 8, flexShrink: 0 }}>
                      科目：{typeof q.classify === 'object' ? q.classify.name || '---' : q.classify || '---'}
                    </span>|
                    <span>题目：{typeof q.question === 'object' ? JSON.stringify(q.question) : q.question || '---'}</span>|：
                    <span style={{ flexShrink: 0 }}>
                      答案：{typeof q.answer === 'object' ? JSON.stringify(q.answer) : q.answer || '---'}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <ProCard>
      <StepsForm<{
        name: string
        remark: string
        classify: string
        type: 'manual' | 'random'
        choice?: string[]
        randomNum: number
      }>
        formRef={stepsFormRef}
        onFinish={async (values) => {
          await waitTime(0.5)
          const res = await createPaper({
            name: values.name,
            classify: values.classify,
            questions: parseQuestionIds(values.choice), 
          })
          if (res.code === API_CODE.SUCCESS) {
            message.success('创建试卷成功')
          } else {
            message.error(`创建失败：${res.msg || '未知错误'}`)
          }
          return true
        }}
        formProps={{ validateMessages: { required: '此项为必填项' } }}
        submitter={{
          render: (props) => {
            if (props.step === 0)
              return (
                <Button
                  type="primary"
                  onClick={async () => {
                    await handleStep0Submit()
                    props.onSubmit?.()
                  }}
                >
                  下一步 {'>'}
                </Button>
              )
            if (props.step === 1)
              return [
                <Button key="pre" onClick={() => props.onPre?.()}>上一步</Button>,
                <Button
                  type="primary"
                  key="next"
                  onClick={async () => {
                    await handleStep1Submit()
                    props.onSubmit?.()
                  }}
                >
                  下一步 {'>'}
                </Button>,
              ]
            return [
              <Button key="pre" onClick={() => props.onPre?.()}>{'<'} 上一步</Button>,
              <Button type="primary" key="submit" onClick={() => props.onSubmit?.()}>提交 √</Button>,
            ]
          },
        }}
      >
        <StepsForm.StepForm name="base" title="试卷基础信息">
          <ProFormText name="name" label="试卷名称" width="md" placeholder="请输入名称" rules={[{ required: true }]} />
          <ProFormTextArea name="remark" label="备注" width="lg" placeholder="请输入备注" />
        </StepsForm.StepForm>

        <StepsForm.StepForm name="checkbox" title="选择组卷方式&科目">
          <ProFormSelect
            name="classify"
            label="科目"
            width="md"
            placeholder="请选择科目"
            rules={[{ required: true }]}
            options={subOptions}
            onChange={async (v: string) => {
              const target = options.find((item) => item._id === v)
              if (target) {
                await CreateQuestionList({ classify: target._id })
                setAllValues((prev) => ({ ...prev, classify: target._id }))
              }
            }}
          />
          <ProFormRadio.Group
            name="type"
            label="组卷方式"
            initialValue="manual"
            options={[
              { label: '选题组卷', value: 'manual' },
              { label: '随机组卷', value: 'random' },
            ]}
          />
          <ProFormDependency name={['type']}>
            {({ type }) => (
              <>
                {type === 'manual' && (
                  <>
                    <ProFormText name="choice" hidden />
                    <ProFormItem>
                      <Button type="primary" size="middle" style={{ width: 100 }} onClick={showModal}>
                        选择试题
                      </Button>
                    </ProFormItem>
                  </>
                )}
                {type === 'random' && (
                  <>
                    <ProFormText name="choice" hidden />
                    <ProFormGroup style={{ marginBottom: 20 }}>
                      <Space align="center">
                        <span style={{ whiteSpace: 'nowrap' }}>试题数量:</span>
                        <ProFormDigit
                          name="randomNum"
                          width={100}
                          initialValue={0}
                          noStyle
                          rules={[{ type: 'number', message: '请输入试卷数量', max: 10 }]}
                        />
                        <Button type="primary" size="middle" onClick={select}>
                          确定
                        </Button>
                      </Space>
                    </ProFormGroup>
                  </>
                )}
              </>
            )}
          </ProFormDependency>
        </StepsForm.StepForm>

        <StepsForm.StepForm name="deploy" title="试卷信息确认">
          <PaperInfoDisplay />
        </StepsForm.StepForm>
      </StepsForm>

      <ModalQuestion
        showModal={showModal}
        onConfirm={handleModalConfirm}
        handleCancel={handleCancel}
        setIsModalOpen={setIsModalOpen}
        isOpen={isModalOpen}
        list={questionOptions}
        selectedRowKeys={selectedRowKeys}
        setSelectedRowKeys={setSelectedRowKeys}
      />
    </ProCard>
  )
}

export default CreateExercise