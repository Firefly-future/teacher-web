import React, { useEffect, useState } from 'react'
import { Space, Button, Form, Input, Row, Col, Select, Radio, message } from 'antd'
import type { FormProps } from 'antd'
import type {questionCreateItem, TypeItem, ClassifyListItem} from '@/services/types'
import style from './AddQuestion.module.scss'
import {questionTypeList, classifyList, questionCreate} from '@/services/index'
import {API_CODE} from '@/constants/Constants'
import { useNavigate } from 'react-router-dom'

const AddQuestion = () => {
  const [show, setShow] = useState(true)
  const [form] = Form.useForm<questionCreateItem>()
  const [list, setList] = useState<TypeItem[]>([])
  const [typeList, setTypeList] = useState<ClassifyListItem[]>([])
  const { TextArea } = Input
  const initialValues: Partial<questionCreateItem> = {
    options: ['', '', '', ''],
    answer: '1'
  }
  const navigate = useNavigate()

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
    form.resetFields()
  }

  useEffect(()=>{
    questionType()
    classifyListItem()
  },[])

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
          initialValues={initialValues}
        >
          <Row>
            <Col span={8}>
              <Form.Item<questionCreateItem>
                label="题型"
                name="type"
                layout="vertical"
                rules={[{ required: true, message: '请选择题型!' }]}
              >
                <Select options={list.map(v=>({ label: v.name, value: v.value }))} placeholder = '选择题型' />
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
        
      </> }
      
    </div>
  )
}

export default AddQuestion