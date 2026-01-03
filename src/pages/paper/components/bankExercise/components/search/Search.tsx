import React, { useEffect, useState } from 'react'
import type { FormProps } from 'antd'
import { Button, Form, Input, Space, Row, Col, Select } from 'antd'
import type {ExamSearch, ClassifyListItem} from '@/services/types'
import style from './Search.module.scss'
import {getUserList, classifyList} from '@/services/index'

interface Props {
  onFilterSearch: (list: ExamSearch) => void
}

const Search:React.FC<Props> = ({onFilterSearch}) => {
  const [form] = Form.useForm<ExamSearch>()
  const [list, setList] = useState<string[]>([])
  const [data, setData] = useState<ClassifyListItem[]>([])
  const [filterForm, setFilterForm] = useState<ExamSearch>({
    name: undefined,
    creator: undefined,
    classify: undefined
  })

  const UserList = async ()=>{
    try{
      const res = await getUserList({page: 1, pagesize: 99})
      console.log(res)
      setList(res.data.list.map(v=>v.username))
      const res1 = await classifyList()
      console.log(res1)
      setData(res1.data.list)
    }catch(e){
      console.log(e)
    }
  }
  
  useEffect(()=>{
    UserList()
  },[])

  const onFinish: FormProps<ExamSearch>['onFinish'] = (values) => {
    console.log('Success:', values)
    setFilterForm(prev=>{
      const filteredValues = Object.fromEntries(
        Object.entries(values).filter(([key, val]) => val !== undefined)
      )
      return {
        ...filteredValues
      }
    })
  }

  useEffect(()=>{
    onFilterSearch(filterForm)
  },[filterForm])

  const reset = ()=>{
    form.resetFields()
    setFilterForm({
      name: undefined,
      creator: undefined,
      classify: undefined
    })
  }

  return (
    <div className={style.search}>
      <Form
        name="basic"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        onFinish={onFinish}
        form={form}
        autoComplete="off"
      >
        <Row>
          <Col span={6}>
            <Form.Item<ExamSearch>
              label="试卷名称"
              name="name"
              layout="vertical"
              labelCol={{span: 8}}
              rules={[{ required: false }]}
            >
              <Input />
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item<ExamSearch>
              label="创建人"
              name="creator"
              layout="vertical"
              labelCol={{span: 8}}
              rules={[{ required: false }]}
            >
              <Select options={list.map(item => ({ label: item, value: item }))} />
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item<ExamSearch>
              label="查询科目"
              name="classify"
              layout="vertical"
              labelCol={{span: 8}}
              rules={[{ required: false }]}
            >
              <Select options={data.map(item => ({ label: item.name, value: item._id }))} />
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item style={{marginTop: '30px'}}>
              <Space>
                <Button type="primary" htmlType="submit">查询</Button>
                <Button color="primary" variant="outlined" onClick={()=>reset()}>重置</Button>
              </Space>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  )
}

export default Search