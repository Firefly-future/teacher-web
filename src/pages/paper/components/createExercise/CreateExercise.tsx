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
  CreatePaperParams
} from '@/services/types'
import { useEffect, useState, useRef } from 'react'
import { API_CODE } from '@/constants/Constants'
// 改用 antd 原生的 FormInstance（ProFormInstance 可能与 StepsForm 不兼容）
import type { FormInstance } from 'antd'

const waitTime = (time: number = 1) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(true), time * 1000)
  })
}

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

  // 1. 修正：使用 antd 原生 FormInstance
  const stepsFormRef = useRef<FormInstance>(null)
  const subOptions = options.map((item) => ({
    label: item.name,
    value: item._id,
  }))
  const defaultPage = { page: 1, pagesize: 2 }

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
        setQuestionOptions(res.data?.list || [])
        message.success('获取题目成功')
        return res.data?.list || []
      }else {
        message.error(`创建失败：${res.msg || '未知错误'}`)
      }
    } catch (e) {
      console.error('获取题目失败:', e)
    }
  }

  const [isModalOpen, setIsModalOpen] = useState(false)
  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleModalConfirm = (selectedQuestions: QuestionItemList[]) => {
    if (selectedQuestions.length === 0) {
      message.warning('请至少选择一道题目')
      return
    }
    setSelectQuestions(selectedQuestions)
    // 2. 增加空值防护：使用可选链
    stepsFormRef.current?.setFieldsValue({
      choice: JSON.stringify(selectedQuestions.map((q) => q._id)),
    })
    setAllValues((prev) => ({
      ...prev,
      choiceQuestions: selectedQuestions,
    }))
    message.success(`已选择 ${selectedQuestions.length} 道题目`)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  useEffect(() => {
    CreateClassifyList(defaultPage)
  }, [])

  // 3. 增加空值防护：先判断 ref 是否存在
  const handleStep0Submit = async () => {
    if (!stepsFormRef.current) {
      message.error('表单未初始化')
      return
    }
    const step0Values = stepsFormRef.current.getFieldsValue(['name', 'remark'])
    setAllValues((prev) => ({ ...prev, ...step0Values }))
  }

  const handleStep1Submit = async () => {
    if (!stepsFormRef.current) {
      message.error('表单未初始化')
      return
    }
    const step1Values = stepsFormRef.current.getFieldsValue([
      'classify',
      'type',
      'choice',
      'randomNum',
    ])
    setAllValues((prev) => ({
      ...prev,
      ...step1Values,
      choiceQuestions: selectQuestions,
    }))
  }

  const PaperInfoDisplay = () => {
    const classifyName =
      subOptions.find((i) => i.value === allValues.classify)?.label || '未选择'
    const questionList = allValues.choiceQuestions || []

    return (
      <div
        style={{ width: 960, margin: '0 auto', fontSize: 14, color: '#000' }}
      >
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>
            试卷信息
          </div>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '12px 48px',
              lineHeight: '28px',
            }}
          >
            <div>
              <strong>试卷名称：</strong>
              {allValues.name || '未填写'}
            </div>
            <div>
              <strong>组卷方式：</strong>
              {allValues.type === 'manual'
                ? '选题组卷'
                : allValues.type === 'random'
                  ? '随机组卷'
                  : '未选择'}
            </div>
            <div>
              <strong>科目：</strong>
              {classifyName}
            </div>
            <div>
              <strong>备注：</strong>
              {allValues.remark || '无'}
            </div>
            {allValues.type === 'random' && (
              <div>
                <strong>随机组卷数量：</strong>
                {allValues.randomNum ?? '未输入'}
              </div>
            )}
          </div>
        </div>

        <div>
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>
            试题展示
          </div>
          <div
            style={{
              border: '1px solid #e8e8e8',
              borderRadius: 4,
              background: '#fff',
            }}
          >
            <div
              style={{
                padding: '8px 16px',
                borderBottom: '1px solid #e8e8e8',
                background: '#fafafa',
                fontWeight: 500,
              }}
            >
              List of test questions
            </div>
            <div style={{ padding: '0 16px' }}>
              {questionList.length === 0 ? (
                <div style={{ padding: '16px 0', color: '#999' }}>暂无试题</div>
              ) : (
                questionList.map((q: any, idx: any) => (
                  <div
                    key={q._id || idx}
                    style={{
                      padding: '10px 0',
                      borderBottom:
                        idx === questionList.length - 1
                          ? 'none'
                          : '1px dashed #e8e8e8',
                      display: 'flex',
                      alignItems: 'flex-start',
                    }}
                  >
                    <span style={{ marginRight: 8, flexShrink: 0 }}>
                      {idx + 1}.
                    </span>
                    <span style={{ flex: 1 }}>{q.question}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const select = () => {
    // 4. 增加空值防护
    if (!stepsFormRef.current) {
      message.error('表单未初始化')
      return
    }
    const need = stepsFormRef.current.getFieldValue('randomNum')
    if (!need || need <= 0) {
      message.error('请输入随机抽题数量')
      return
    }
    if (need > questionOptions.length) {
      message.error('随机抽题数量不能大于题目总数')
      return
    }

    const pool = [...questionOptions]
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[pool[i], pool[j]] = [pool[j], pool[i]]
    }
    const picked = pool.slice(0, need)

    stepsFormRef.current.setFieldsValue({
      choice: JSON.stringify(picked.map((q) => q._id)),
    })
    setSelectQuestions(picked)
    setAllValues((prev) => ({
      ...prev,
      choiceQuestions: picked,
      randomNum: need,
    }))
    message.success(`已随机抽取 ${need} 道题目`)
  }

  return (
    <ProCard>
      {/* 5. 确保 StepsForm 是 ProCard 的直接子元素，避免嵌套异常 */}
      <StepsForm<{
        name: string
        remark: string
        classify: string
        type: 'manual' | 'random'
        choice?: string
        randomNum: number
      }>
        // 6. 绑定 formRef（确保是 StepsForm 的顶层属性）
        formRef={stepsFormRef}
        onFinish={async (values) => {
          try {
            await waitTime(0.5)
            const res = await createPaper({
              name: values.name,
              classify: values.classify,
              questions: values.choice?.split(',') || [],
            })
            if (res.code === API_CODE.SUCCESS) {
              message.success('创建试卷成功')
            } else {
              message.error(`创建失败：${res.msg || '未知错误'}`)
            }
          } catch (e) {
            console.log(e)
          }
          return true
        }}
        formProps={{
          validateMessages: { required: '此项为必填项' },
        }}
        submitter={{
          render: (props) => {
            if (props.step === 0) {
              return (
                <Button
                  type='primary'
                  onClick={async () => {
                    await handleStep0Submit()
                    props.onSubmit?.()
                  }}
                >
                  下一步 {'>'}
                </Button>
              )
            }
            if (props.step === 1) {
              return [
                <Button key='pre' onClick={() => props.onPre?.()}>
                  上一步
                </Button>,
                <Button
                  type='primary'
                  key='next'
                  onClick={async () => {
                    await handleStep1Submit()
                    props.onSubmit?.()
                  }}
                >
                  下一步 {'>'}
                </Button>,
              ]
            }
            return [
              <Button key='pre' onClick={() => props.onPre?.()}>
                {'<'} 上一步
              </Button>,
              <Button
                type='primary'
                key='submit'
                onClick={() => props.onSubmit?.()}
              >
                提交 √
              </Button>,
            ]
          },
        }}
      >
        <StepsForm.StepForm name='base' title='试卷基础信息'>
          <ProFormText
            name='name'
            label='试卷名称'
            width='md'
            placeholder='请输入名称'
            rules={[{ required: true }]}
          />
          <ProFormTextArea
            name='remark'
            label='备注'
            width='lg'
            placeholder='请输入备注'
          />
        </StepsForm.StepForm>

        <StepsForm.StepForm name='checkbox' title='选择组卷方式&科目'>
          <ProFormSelect
            name='classify'
            label='科目'
            width='md'
            placeholder='请选择科目'
            rules={[{ required: true }]}
            options={subOptions}
            onChange={async (v: string) => {
              const target = options.find((item) => item._id === v)
              if (target) {
                await CreateQuestionList({ classify: target.name})
              }
              setAllValues((prev) => ({
                ...prev,
                classify: v,
              }))
            }}
          />
          <ProFormRadio.Group
            name='type'
            label='组卷方式'
            initialValue='manual'
            options={[
              { label: '选题组卷', value: 'manual' },
              { label: '随机组卷', value: 'random' },
            ]}
          />
          <ProFormDependency name={['type']}>
            {({ type }) => (
              <>
                {type === 'manual' && (
                  <ProFormItem name='choice'>
                    <Button
                      type='primary'
                      size='middle'
                      style={{ width: 100 }}
                      onClick={showModal}
                    >
                      选择试题
                    </Button>
                  </ProFormItem>
                )}
                {type === 'random' && (
                  <ProFormGroup style={{ marginBottom: 20 }}>
                    <Space align='center'>
                      <span style={{ whiteSpace: 'nowrap' }}>试题数量:</span>
                      <ProFormDigit
                        name='randomNum'
                        width={100}
                        initialValue={0}
                        noStyle
                        rules={[
                          {
                            type: 'number',
                            message: '请输入试卷数量',
                            max: 10,
                          },
                        ]}
                      />
                      <Button type='primary' size='middle' onClick={select}>
                        确定
                      </Button>
                    </Space>
                  </ProFormGroup>
                )}
              </>
            )}
          </ProFormDependency>
        </StepsForm.StepForm>

        <StepsForm.StepForm name='deploy' title='试卷信息确认'>
          <PaperInfoDisplay />
        </StepsForm.StepForm>
      </StepsForm>

      {/* 7. 把 ModalQuestion 移到 StepsForm 外部（避免嵌套影响 ref 绑定） */}
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
