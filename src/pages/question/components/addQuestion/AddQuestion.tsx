import React, { useEffect, useState } from 'react'
import { Space, Button, Form, Input, Row, Col, Select, Radio, message, Checkbox, Upload } from 'antd'
import type { FormProps, UploadProps, UploadFile  } from 'antd'
import type {questionCreateItem, TypeItem, ClassifyListItem} from '@/services/types'
import style from './AddQuestion.module.scss'
import {questionTypeList, classifyList, questionCreate, questionCreateMultiple} from '@/services/index'
import {API_CODE} from '@/constants/Constants'
import { useNavigate } from 'react-router-dom'
import { InboxOutlined } from '@ant-design/icons'
import * as XLSX from 'xlsx'

const AddQuestion = () => {
  const [show, setShow] = useState(true)
  const [form] = Form.useForm<questionCreateItem>()
  const [list, setList] = useState<TypeItem[]>([])
  const [typeList, setTypeList] = useState<ClassifyListItem[]>([])
  const { TextArea } = Input
  const option = ['A', 'B', 'C', 'D']
  const [currentType, setCurrentType] = useState<string>('single')
  const getInitialValues = (type: string): Partial<questionCreateItem> => {
    switch (type) {
    case 'single': // 单选题
      return {
        options: [
          { label: 'A', value: '' },
          { label: 'B', value: '' },
          { label: 'C', value: '' },
          { label: 'D', value: '' }
        ],
        answer: 'A'
      }
    case 'multiple': // 多选题
      return {
        options: [
          { label: 'A', value: '' },
          { label: 'B', value: '' },
          { label: 'C', value: '' },
          { label: 'D', value: '' }
        ],
        answer: ''
      }
    case 'judge': // 判断题
      return {
        answer: true
      }
    case 'fill': // 填空题
      return {
        answer: ''
      }
    default:
      return {
        options: [
          { label: 'A', value: '' },
          { label: 'B', value: '' },
          { label: 'C', value: '' },
          { label: 'D', value: '' }
        ],
        answer: 'A'
      }
    }
  }
  const navigate = useNavigate()
  const { Dragger } = Upload
  const [parsedQuestions, setParsedQuestions] = useState<questionCreateItem[]>([])
  const [uploading, setUploading] = useState(false)
  const [fileList, setFileList] = useState<UploadFile[]>([])

  // 题型列表
  const questionType = async () => {
    try{
      const res = await questionTypeList()
      console.log(res)
      setList(res.data.list)
    }catch(e){
      console.log(e)
    }
  }
  // 科目列表
  const classifyListItem = async () => {
    try{
      const res = await classifyList()
      setTypeList(res.data.list)
    }catch(e){
      console.log(e)
    }
  }
  // 手动添加试题
  const createQuestion = async (value:questionCreateItem) => {
    try{
      const res = await questionCreate(value)
      console.log(res)
      if(res.code === API_CODE.SUCCESS){
        message.success('添加试题成功!')
        form.resetFields()
      }else{
        message.error(res.msg)
      }
    }catch(e){
      console.log(e)
    }
  }

  const onFinish: FormProps<questionCreateItem>['onFinish'] = (values) => {
    console.log('Success:', values)
    const transformedValues = {
      ...values,
      options: values.options?.map((opt, index) => ({
        label: option[index],
        value: opt.value
      }))
    }
    console.log(transformedValues)
    createQuestion(transformedValues)
  }

  useEffect(()=>{
    questionType()
    classifyListItem()
    form.setFieldsValue(getInitialValues(currentType))
  },[])

  const handleTypeChange = (value: string) => {
    console.log(value)
    setCurrentType(value)
    form.setFieldsValue(getInitialValues(value))
  }

  const handleCheckboxChange = (checkedValues: string[]) => {
    const answer = checkedValues.join(',')
    form.setFieldValue('answer', answer)
  }

  const renderQuestionContent = () =>{
    switch(currentType){
    case 'single':
      return (
        <Form.Item<questionCreateItem>
          label="选项"
          layout="vertical"
        >
          <Form.Item<questionCreateItem>
            name="answer"
            noStyle
            rules={[{ required: true, message: '请选择答案!' }]}
          >
            <Radio.Group>
              <Row>
                <Col span={8} style={{marginBottom: '10px'}}>
                  <Radio value='A'>
                    <span style={{ color: 'red' }}>*</span> A 
                  </Radio>
                  <Form.Item<questionCreateItem>
                    name={['options', 0, 'value']}
                    noStyle
                    rules={[{ required: true, message: '选项内容不能为空!' }]}
                  >
                    <Input placeholder="请输入" style={{ marginTop: '4px', width: '200px' }} />
                  </Form.Item>
                </Col>

                <Col span={8} style={{marginBottom: '10px'}}>
                  <Radio value='B'>
                    <span style={{ color: 'red' }}>*</span> B
                  </Radio>
                  <Form.Item<questionCreateItem>
                    name={['options', 1, 'value']}
                    noStyle
                    rules={[{ required: true, message: '选项内容不能为空!' }]}
                  >
                    <Input placeholder="请输入" style={{ marginTop: '4px', width: '200px' }} />
                  </Form.Item>
                </Col>

                <Col span={8} style={{marginBottom: '10px'}}>
                  <Radio value='C'>
                    <span style={{ color: 'red' }}>*</span> C
                  </Radio>
                  <Form.Item<questionCreateItem>
                    name={['options', 2, 'value']}
                    noStyle
                    rules={[{ required: true, message: '选项内容不能为空!' }]}
                  >
                    <Input placeholder="请输入" style={{ marginTop: '4px', width: '200px' }} />
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Radio value='D'>
                    <span style={{ color: 'red' }}>*</span> D
                  </Radio>
                  <Form.Item<questionCreateItem>
                    name={['options', 3, 'value']}
                    noStyle
                    rules={[{ required: true, message: '选项内容不能为空!' }]}
                  >
                    <Input placeholder="请输入" style={{ marginTop: '4px', width: '200px' }} />
                  </Form.Item>
                </Col>
              </Row>
            </Radio.Group>
          </Form.Item>
        </Form.Item>
      )
    case 'multiple':
      return (
        <Form.Item<questionCreateItem>
          label="选项"
          layout="vertical"  
        >
          <Form.Item<questionCreateItem>
            name="answer"
            noStyle
            rules={[{ required: true, message: '请选择答案!' }]}
          >
            <Checkbox.Group
              value={form.getFieldValue('answer')?.split(',') || []}
              onChange={handleCheckboxChange}
            >
              <Row>
                <Col span={8} style={{marginBottom: '10px'}}>
                  <Checkbox value='A'>
                    <span style={{ color: 'red' }}>*</span> A 
                  </Checkbox>
                  <Form.Item<questionCreateItem>
                    name={['options', 0, 'value']}
                    noStyle
                    rules={[{ required: true, message: '选项内容不能为空!' }]}
                  >
                    <Input placeholder="请输入" style={{ marginTop: '4px', width: '200px' }} />
                  </Form.Item>
                </Col>

                <Col span={8} style={{marginBottom: '10px'}}>
                  <Checkbox value='B'>
                    <span style={{ color: 'red' }}>*</span> B
                  </Checkbox>
                  <Form.Item<questionCreateItem>
                    name={['options', 1, 'value']}
                    noStyle
                    rules={[{ required: true, message: '选项内容不能为空!' }]}
                  >
                    <Input placeholder="请输入" style={{ marginTop: '4px', width: '200px' }} />
                  </Form.Item>
                </Col>

                <Col span={8} style={{marginBottom: '10px'}}>
                  <Checkbox value='C'>
                    <span style={{ color: 'red' }}>*</span> C
                  </Checkbox>
                  <Form.Item<questionCreateItem>
                    name={['options', 2, 'value']}
                    noStyle
                    rules={[{ required: true, message: '选项内容不能为空!' }]}
                  >
                    <Input placeholder="请输入" style={{ marginTop: '4px', width: '200px' }} />
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Checkbox value='D'>
                    <span style={{ color: 'red' }}>*</span> D
                  </Checkbox>
                  <Form.Item<questionCreateItem>
                    name={['options', 3, 'value']}
                    noStyle
                    rules={[{ required: true, message: '选项内容不能为空!' }]}
                  >
                    <Input placeholder="请输入" style={{ marginTop: '4px', width: '200px' }} />
                  </Form.Item>
                </Col>
              </Row>
            </Checkbox.Group>
          </Form.Item>
        </Form.Item>
      )
    case 'judge':
      return (
        <Form.Item<questionCreateItem>
          label="选项"
          layout="vertical"  
        >
          <Form.Item<questionCreateItem>
            name="answer"
            noStyle
            rules={[{ required: true, message: '请选择答案!' }]}
          >
            <Radio.Group>
              <Row>
                <Col span={12} style={{marginBottom: '10px'}}>
                  <Radio value={true}>
                    <span></span> 对 
                  </Radio>
                </Col>
                <Col span={12}>
                  <Radio value={false}>
                    <span></span> 错
                  </Radio>
                </Col>
              </Row>
            </Radio.Group>
          </Form.Item>
        </Form.Item>
      )
    case 'fill':
      return (
        <Form.Item<questionCreateItem>
          label="正确答案"
          layout="vertical" 
          required={true} 
        >
          <Form.Item<questionCreateItem>
            name="options"
            noStyle
          >
            <input type="hidden" />
          </Form.Item>
          
          <Form.Item<questionCreateItem>
            name="answer"
            noStyle
            rules={[{ required: true, message: '请输入答案!' }]}
          >
            <Input placeholder="请输入答案" style={{ width: '673px' }} />
          </Form.Item>
        </Form.Item>
      )
    }
  }

  const props: UploadProps = {
    name: 'file',
    multiple: true,
    fileList, 
    accept: '.xlsx,.xls',
    onRemove: () => setFileList([]),
    beforeUpload: (file) => {
      setFileList([file])
      const reader = new FileReader()
      reader.onload = (e) => {
        try{
          const data = new Uint8Array(e.target?.result as ArrayBuffer)
          const workbook = XLSX.read(data, { type: 'array' })
          const worksheet = workbook.Sheets[workbook.SheetNames[0]]
          const excelData = XLSX.utils.sheet_to_json(worksheet) as any[]
          console.log(excelData)
          const clean = excelData.map(row => ({
            question: String(row.question),
            type: String(row.type),
            classify: String(row.classify),
            answer: row.answer + '',
            options: JSON.parse(String(row.options)),
            explanation: String(row.explanation)
          }))
          console.log(clean)
          setParsedQuestions(clean)
        }catch(e){
          console.log(e)
        }
      }
      reader.readAsArrayBuffer(file)
      return false 
    }
  }

  const headerAdd = async () => {
    if(parsedQuestions.length === 0){
      message.error('请先上传试题文件！')
      return
    }
    setUploading(true)
    try{
      const res = await questionCreateMultiple({ list: parsedQuestions })
      console.log(res)
      if(res.code === API_CODE.SUCCESS){
        message.success('批量添加成功!')
        setParsedQuestions([])
        setFileList([])
      }else{
        message.error(res.msg)
      }
    }catch(e){
      console.log(e)
    }finally{
      setUploading(false)
    }
  }

  return (
    <div>
      <Space style={{marginBottom: '20px'}}>
        <Button type={show ? 'primary' : 'default'} onClick={()=>setShow(true)}>手动添加</Button>
        <Button type={show ? 'default' : 'primary'} onClick={()=>setShow(false)}>批量导入</Button>
      </Space>
      { show ? <>
        <Form
          className={style.question}
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          onFinish={onFinish}
          form={form}
          autoComplete="off"
        >
          <Row>
            <Col span={8}>
              <Form.Item<questionCreateItem>
                label="题型"
                name="type"
                layout="vertical"
                rules={[{ required: true, message: '请选择题型!' }]}
              >
                <Select 
                  options={list.map(v=>({ label: v.name, value: v.value }))} 
                  placeholder = '选择题型' 
                  value={currentType}
                  onChange={handleTypeChange}
                />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item<questionCreateItem>
                label="分类"
                name="classify"
                layout="vertical"
                rules={[{ required: true, message: '请选择分类!' }]}
              >
                <Select options={typeList?.map(v=>({ label: v.name,value: v._id })) || []} placeholder = '选择科目' />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item<questionCreateItem>
            label="题目"
            name="question"
            layout="vertical"
            rules={[{ required: true, message: '题目不能为空!' }]}
          >
            <TextArea rows={4} placeholder="请输入题目" maxLength={100} size = "middle" />
          </Form.Item>
          
          {renderQuestionContent()}

          <Form.Item<questionCreateItem>
            label="解析"
            name="explanation"
            layout="vertical"
            rules={[{ required: false }]}
          >
            <TextArea rows={4} placeholder="请输入" maxLength={100} size = "middle" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button onClick={()=>form.resetFields()}>重置</Button>
              <Button type="primary" htmlType="submit">提交</Button>
              <Button onClick={()=>navigate('/question/item-bank')}>返回</Button>
            </Space>
          </Form.Item>
        </Form>
      </> : <>
        <Dragger {...props}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">单击或拖动文件到此区域进行上传</p>
          <p className="ant-upload-hint">支持单次或批量上传</p>
        </Dragger>
        <Space style={{marginTop: '15px'}}>
          <Button type="primary" onClick={headerAdd} loading={uploading}>提交</Button>
          <Button type="default" onClick={() => {
            setParsedQuestions([])
            setFileList([])
          }}>重置</Button>
        </Space>
      </> }
    </div>
  )
}

export default AddQuestion