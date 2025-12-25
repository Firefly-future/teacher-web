import React,{useState, useEffect} from 'react'
import { Button, Select, Form, Input,Space } from 'antd'
import style from './Search.module.scss'
import type { FormProps } from 'antd'
import type {UserListItem} from '@/services/types'

type FieldType = {
  username?: string | undefined
  status?: 0 | 1 | undefined
  role?: string[] | []
  age?: number | undefined
  sex?: 0 | 1 | undefined
  email?: string | undefined
  lastOnlineTime?: number | undefined
}

interface Props{
  onFilterList:(obj:Partial<UserListItem>)=>void
}

const Search:React.FC<Props> = ({onFilterList}) => {
  const [form] = Form.useForm<FieldType>()
  const [filterForm, setFilterForm] = useState<FieldType>({
    username: undefined,
    status: undefined,
    role: [],
    age: undefined,
    sex: undefined,
    email: undefined,
    lastOnlineTime: undefined
  })

  const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
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
    onFilterList(filterForm)
  },[filterForm])

  const reset = ()=> {
    form.resetFields()
    setFilterForm({
      username: undefined,
      status: undefined,
      role: [],
      age: undefined,
      sex: undefined,
      email: undefined,
      lastOnlineTime: undefined
    })
  }

  return (
    <div className={style.list}>
      <Form
        name="basic"
        className={style.form}
        onFinish={onFinish}
        form={form}
        autoComplete="off"
      >
        <div className={style.formItem}>
          <Form.Item<FieldType>
            label="用户名"
            name="username"
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label="账号状态"
            name="status"
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label="角色"
            name="role"
          >
            <Input />
          </Form.Item>
            
          <Form.Item<FieldType>
            label="年龄"
            name="age"
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label="性别"
            name="sex"
            className={style.select}
          >
            <Select options={[
              { label: '男', value: 0 },
              { label: '女', value: 1 },
            ]} />
          </Form.Item>

          <Form.Item<FieldType>
            label="邮箱"
            name="email"
          >
            <Input />
          </Form.Item>

          <Form.Item 
            label="登陆时间" 
            name="lastOnlineTime"
          >
            <Input />
          </Form.Item>
        </div>

        <Form.Item className={style.btns}>
          <Space>
            <Button type="primary" htmlType="submit">搜索</Button>
            <Button type="default" onClick={reset}>重置</Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  )
}

export default Search