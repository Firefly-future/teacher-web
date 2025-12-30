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
  const [currentType, setCurrentType] = useState<number>(1)
  const getInitialValues = (type: number): Partial<questionCreateItem> => {
    switch (type) {
    case 1: // 单选题
      return {
        options: ['', '', '', ''],
        answer: '1'
      }
    case 2: // 多选题
      return {
        options: ['', '', '', ''],
        answer: ''
      }
    case 3: // 判断题
      return {
        options: ['对', '错'],
        answer: '对'
      }
    case 4: // 填空题
      return {
        options: [''],
        answer: ''
      }
    default:
      return {
        options: ['', '', '', ''],
        answer: '1'
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
      const uniqueList = Array.from(new Map(res.data.list.map(item => [item._id, item])).values())
      setList(uniqueList)
    }catch(e){
      console.log(e)
    }
  }
  // 科目列表
  const classifyListItem = async () => {
    try{
      const res = await classifyList({page: 1,pagesize: 9999})
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
    createQuestion(values)
  }

  useEffect(()=>{
    questionType()
    classifyListItem()
    form.setFieldsValue(getInitialValues(currentType))
  },[])

  const handleTypeChange = (value: number) => {
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
    case 1:
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
                  <Radio value='1'>
                    <span style={{ color: 'red' }}>*</span> A 
                  </Radio>
                  <Form.Item<questionCreateItem>
                    name={['options', 0]}
                    noStyle
                    rules={[{ required: true, message: '选项内容不能为空!' }]}
                  >
                    <Input placeholder="请输入" style={{ marginTop: '4px', width: '200px' }} />
                  </Form.Item>
                </Col>

                <Col span={8} style={{marginBottom: '10px'}}>
                  <Radio value='2'>
                    <span style={{ color: 'red' }}>*</span> B
                  </Radio>
                  <Form.Item<questionCreateItem>
                    name={['options', 1]}
                    noStyle
                    rules={[{ required: true, message: '选项内容不能为空!' }]}
                  >
                    <Input placeholder="请输入" style={{ marginTop: '4px', width: '200px' }} />
                  </Form.Item>
                </Col>

                <Col span={8} style={{marginBottom: '10px'}}>
                  <Radio value='3'>
                    <span style={{ color: 'red' }}>*</span> C
                  </Radio>
                  <Form.Item<questionCreateItem>
                    name={['options', 2]}
                    noStyle
                    rules={[{ required: true, message: '选项内容不能为空!' }]}
                  >
                    <Input placeholder="请输入" style={{ marginTop: '4px', width: '200px' }} />
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Radio value='4'>
                    <span style={{ color: 'red' }}>*</span> D
                  </Radio>
                  <Form.Item<questionCreateItem>
                    name={['options', 3]}
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
    case 2:
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
                  <Checkbox value='1'>
                    <span style={{ color: 'red' }}>*</span> A 
                  </Checkbox>
                  <Form.Item<questionCreateItem>
                    name={['options', 0]}
                    noStyle
                    rules={[{ required: true, message: '选项内容不能为空!' }]}
                  >
                    <Input placeholder="请输入" style={{ marginTop: '4px', width: '200px' }} />
                  </Form.Item>
                </Col>

                <Col span={8} style={{marginBottom: '10px'}}>
                  <Checkbox value='2'>
                    <span style={{ color: 'red' }}>*</span> B
                  </Checkbox>
                  <Form.Item<questionCreateItem>
                    name={['options', 1]}
                    noStyle
                    rules={[{ required: true, message: '选项内容不能为空!' }]}
                  >
                    <Input placeholder="请输入" style={{ marginTop: '4px', width: '200px' }} />
                  </Form.Item>
                </Col>

                <Col span={8} style={{marginBottom: '10px'}}>
                  <Checkbox value='3'>
                    <span style={{ color: 'red' }}>*</span> C
                  </Checkbox>
                  <Form.Item<questionCreateItem>
                    name={['options', 2]}
                    noStyle
                    rules={[{ required: true, message: '选项内容不能为空!' }]}
                  >
                    <Input placeholder="请输入" style={{ marginTop: '4px', width: '200px' }} />
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Checkbox value='4'>
                    <span style={{ color: 'red' }}>*</span> D
                  </Checkbox>
                  <Form.Item<questionCreateItem>
                    name={['options', 3]}
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
    case 3:
      return (
        <Form.Item<questionCreateItem>
          label="选项"
          layout="vertical"  
        >
          <Form.Item<questionCreateItem>
            name="options"
            noStyle
            initialValue={['对', '错']}
          >
            <input type="hidden" />
          </Form.Item>
          
          <Form.Item<questionCreateItem>
            name="answer"
            noStyle
            rules={[{ required: true, message: '请选择答案!' }]}
          >
            <Radio.Group>
              <Row>
                <Col span={12} style={{marginBottom: '10px'}}>
                  <Radio value='对'>
                    <span></span> 对 
                  </Radio>
                </Col>
                <Col span={12}>
                  <Radio value='错'>
                    <span></span> 错
                  </Radio>
                </Col>
              </Row>
            </Radio.Group>
          </Form.Item>
        </Form.Item>
      )
    case 4:
      return (
        <Form.Item<questionCreateItem>
          label="正确答案"
          layout="vertical" 
          required={true} 
        >
          <Form.Item<questionCreateItem>
            name="options"
            noStyle
            initialValue={[]}
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
          const clean = excelData.map(row => ({
            question: String(row.question),
            type: Number(row.type),
            classify: String(row.classify),
            answer: row.answer + '',
            options: JSON.parse(String(row.options)),
            desc: String(row.desc)
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
                <Select options={typeList.map(v=>({ label: v.name,value: v.value }))} placeholder = '选择科目' />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item<questionCreateItem>
            label="题目"
            name="question"
            layout="vertical"
            rules={[{ required: true, message: '题目不能为空!' }]}
          >
            <TextArea rows={4} placeholder="请输入题目" maxLength={12} size = "middle" />
          </Form.Item>
          
          {renderQuestionContent()}

          <Form.Item<questionCreateItem>
            label="解析"
            name="desc"
            layout="vertical"
            rules={[{ required: false }]}
          >
            <TextArea rows={4} placeholder="请输入" maxLength={12} size = "middle" />
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