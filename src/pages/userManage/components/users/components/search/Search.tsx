import React,{useState, useEffect} from 'react'
import { Button, Select, Form, Input, Space, DatePicker } from 'antd'
import type { DatePickerProps, GetProps } from 'antd'
import style from './Search.module.scss'
import type { FormProps } from 'antd'
import type {UserListItem, roleItem} from '@/services/types'
import dayjs, { Dayjs } from 'dayjs'
 
type FieldType = {
  username?: string | undefined
  status?: 0 | 1 | undefined
  role?: string | undefined
  age?: number | undefined
  sex?: 0 | 1 | undefined
  email?: string | undefined
  lastOnlineTimeFrom: string | undefined,
  lastOnlineTimeTo: string | undefined
}

type RangePickerProps = GetProps<typeof DatePicker.RangePicker>

interface Props{
  onFilterList:(obj:Partial<FieldType>)=>void
  onListRes: UserListItem[] | undefined
}

const Search:React.FC<Props> = ({
  onFilterList,
  onListRes
}) => {
  const [form] = Form.useForm<FieldType>()
  const [filterForm, setFilterForm] = useState<FieldType>({
    username: undefined,
    status: undefined,
    role: undefined,
    age: undefined,
    sex: undefined,
    email: undefined,
    lastOnlineTimeFrom: undefined,
    lastOnlineTimeTo: undefined
  })
  const [list, setList] = useState<roleItem[] | undefined>([])
  const { RangePicker } = DatePicker
  const [timeHorizon, setTimeHorizon] = useState<Dayjs[]>([])

  useEffect(()=>{
    const listRes = onListRes?.map(v=>v.role[0])
    console.log(listRes)
    setList(listRes)
  },[onListRes])

  const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    console.log('Success:', values)
    if(values.role){
      values = {
        ...values,
        role: list?.filter(v=>v.name === values.role)[0]._id
      }
    }
    if(timeHorizon.length > 0){
      values = {
        ...values,
        lastOnlineTimeFrom: timeHorizon[0].format('YYYY-MM-DD HH:mm'),
        lastOnlineTimeTo: timeHorizon[1].format('YYYY-MM-DD HH:mm'),
      }
    }else {
      values = {
        ...values,
        lastOnlineTimeFrom: undefined,
        lastOnlineTimeTo: undefined
      }
    }
    console.log(values)
    setFilterForm(prev => {
      return Object.fromEntries(
        Object.entries(values).filter(([_, val]) => val !== undefined)
      ) as FieldType
    })
  }

  useEffect(()=>{
    onFilterList(filterForm)
  },[filterForm])

  const reset = ()=> {
    form.resetFields()
    setTimeHorizon([])
    setFilterForm({
      username: undefined,
      status: undefined,
      role: undefined,
      age: undefined,
      sex: undefined,
      email: undefined,
      lastOnlineTimeFrom: undefined,
      lastOnlineTimeTo: undefined
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
              { label: '男', value: 1 },
              { label: '女', value: 0 },
            ]} />
          </Form.Item>

          <Form.Item<FieldType>
            label="邮箱"
            name="email"
          >
            <Input />
          </Form.Item>

          <Form.Item
            label='时间范围'
          >
            <RangePicker
              value={timeHorizon.length === 2 ? [timeHorizon[0], timeHorizon[1]] : undefined}
              showTime={{ format: 'HH:mm' }}
              format="YYYY-MM-DD HH:mm"
              onChange={(value) => {
                if (value && value.length === 2) {
                  setTimeHorizon([value[0]!, value[1]!])
                } else {
                  setTimeHorizon([])
                }
              }}
            />
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