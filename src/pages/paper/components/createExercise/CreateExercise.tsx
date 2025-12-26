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
import { getClassifyList } from '@/services'
import type { ClassifyItemList, ClassifyListParams } from '@/services/types'
import { useEffect, useState, useRef } from 'react'
import { API_CODE } from '@/constants/Constants'
import type { ProFormInstance } from '@ant-design/pro-components'

const waitTime = (time: number = 1) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(true), time * 1000)
  })
}

const CreateExercise = () => {
  const [options, setOptions] = useState<ClassifyItemList[]>([])
  /* 用于第三步即时展示 */
  const [allValues, setAllValues] = useState<Record<string, any>>({})
  const stepsFormRef = useRef<ProFormInstance>(null)

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
      console.log(e)
    }
  }
  useEffect(() => {
    CreateClassifyList(defaultPage)
  }, [])

  // 核心修改：手动实现表单值监听（兼容所有 ProForm 版本）
  // 1. 第一步提交时保存基础数据
  const handleStep0Submit = async () => {
    if (stepsFormRef.current) {
      // 获取第一步的表单值
      const step0Values = stepsFormRef.current.getFieldsValue([
        'name',
        'remark',
      ])
      // 合并到总数据中
      setAllValues((prev) => ({ ...prev, ...step0Values }))
    }
  }
  // 2. 第二步提交时保存组卷相关数据
  const handleStep1Submit = async () => {
    if (stepsFormRef.current) {
      // 获取第二步的表单值
      const step1Values = stepsFormRef.current.getFieldsValue([
        'classify',
        'type',
        'choice',
        'randomNum',
      ])
      // 合并到总数据中
      setAllValues((prev) => ({ ...prev, ...step1Values }))
    }
  }
  /* 第三步展示组件：匹配参考图样式 */
  const PaperInfoDisplay = () => {
    const classifyName =
      subOptions.find((i) => i.value === allValues.classify)?.label || '未选择'
    // 模拟试题列表（实际项目中替换为真实的试题数据）
    return (
      <div style={{ width: '100%' }}>
        {/* 试卷信息区域 */}
        <div style={{ marginBottom: '24px' }}>
          <h3
            style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: 600 }}
          >
            试卷信息
          </h3>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '16px 48px',
              fontSize: '14px',
            }}
          >
            <p style={{ margin: 0 }}>
              <strong>试卷名称：</strong>
              {allValues.name || '未填写'}
            </p>
            <p style={{ margin: 0 }}>
              <strong>组卷方式：</strong>
              {allValues.type === 'manual'
                ? '选题组卷'
                : allValues.type === 'random'
                  ? '随机组卷'
                  : '未选择'}
            </p>
            <p style={{ margin: 0 }}>
              <strong>科目：</strong>
              {classifyName}
            </p>
            <p style={{ margin: 0 }}>
              <strong>备注：</strong>
              {allValues.remark || '无'}
            </p>
            {allValues.type === 'manual' && (
              <p style={{ margin: 0 }}>
                <strong>选择的试题：</strong>
                {allValues.choice || '未选择'}
              </p>
            )}
            {allValues.type === 'random' && (
              <p style={{ margin: 0 }}>
                <strong>随机组卷数量：</strong>
                {allValues.randomNum ?? '未输入'}
              </p>
            )}
          </div>
        </div>

        {/* 试题展示区域 */}
        <div>
          <h3
            style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: 600 }}
          >
            试题展示
          </h3>
          <div style={{ border: '1px solid #e8e8e8', borderRadius: '4px' }}>
            <div
              style={{
                padding: '8px 16px',
                borderBottom: '1px solid #e8e8e8',
                backgroundColor: '#f5f5f5',
                fontSize: '14px',
              }}
            >
              List of test questions
            </div>
            <div style={{ padding: '8px 0', fontSize: '14px' }}>
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
        choice?: string
        randomNum: number
      }>
        formRef={stepsFormRef}
        /* 最终提交逻辑 */
        onFinish={async (values) => {
          await waitTime(0.5)
          message.success('提交成功')
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
                    // 第一步提交时先保存数据
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
                    // 第二步提交时保存数据
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
        {/* 第一步 */}
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

        {/* 第二步 */}
        <StepsForm.StepForm name='checkbox' title='选择组卷方式&科目'>
          <ProFormSelect
            name='classify'
            label='科目'
            width='md'
            placeholder='请选择科目'
            rules={[{ required: true }]}
            options={subOptions}
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
                    <Button type='primary' size='middle' style={{ width: 100 }}>
                      选择试题
                    </Button>
                  </ProFormItem>
                )}
                {type === 'random' && (
                  <ProFormGroup style={{marginBottom: 20}}>
                    <Space align='center'>
                      <span style={{ whiteSpace: 'nowrap' }}>试题数量:</span>
                      <ProFormDigit
                        name='randomNum'
                        width={100}
                        initialValue={0}
                        noStyle
                        rules={[{ type: 'number', message: '请输入试卷数量' }]}
                      />
                      <Button type='primary' size='middle'>
                        确定
                      </Button>
                    </Space>
                  </ProFormGroup>
                )}
              </>
            )}
          </ProFormDependency>
        </StepsForm.StepForm>

        {/* 第三步：展示全部数据 */}
        <StepsForm.StepForm name='deploy' title='试卷信息确认'>
          <PaperInfoDisplay />
        </StepsForm.StepForm>
      </StepsForm>
    </ProCard>
  )
}

export default CreateExercise
