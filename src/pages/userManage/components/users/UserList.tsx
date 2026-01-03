import React,{useEffect, useState} from 'react'
import {getUserList} from '@/services/index'
import { useRequest } from 'ahooks'
import { Space, Table, Switch, Image, message, Popconfirm, Button, Tag } from 'antd'
import type { TableProps, PopconfirmProps } from 'antd'
import type { UserListItem } from '@/services/types'
import {getUserRemove} from '@/services/index'
import {API_CODE} from '@/constants/Constants'
import style from './UserList.module.scss'
import FormModal from './components/formModal/FormModal'
import {updateUser} from '@/services/index'
import Search from './components/search/Search'

const presets = [
  'magenta',
  'red',
  'volcano',
  'orange',
  'gold',
  'lime',
  'green',
  'cyan',
  'blue',
  'geekblue',
  'purple',
]

const UserList = () => {
  const [id,setId] = useState('')
  const [showModal,setShowModal] = useState(false)
  const [query, setQuery] = useState({
    page: 1,
    pagesize: 5
  }) 
  const [updateItem,setUpdateItem] = useState<UserListItem | null>(null)
  const [filterQuery, setFilterQuery] = useState({})

  const { data: listRes, loading, run } = useRequest(getUserList, {
    refreshOnWindowFocus: true,
    defaultParams: [query]
  })

  useEffect(() => {
    // 手动触发接口执行
    run({...query, ...filterQuery})
  }, [query,filterQuery])

  const onChangeStatus = async (id: string, checked:boolean)=> {
    try{
      const res = await updateUser({id: id, status: checked ? 1 : 0})
      console.log(res)
      if(res.code === API_CODE.SUCCESS){
        message.success('用户账号状态修改成功')
        run(query)
      }else{
        message.error(res.msg)
      }
    }catch(e){
      console.log(e)
    }
  }
  
  const columns: TableProps<UserListItem>['columns'] = [
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
      fixed: 'start',
      width: 150,
      align: 'center'
    },
    {
      title: '账号状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      align: 'center',
      render: (_, record) => (
        <Switch
          checkedChildren="启用"
          unCheckedChildren="禁用"
          checked={record.status === 1}
          onChange={checked => {
            console.log(record,checked)
            onChangeStatus(record._id, checked)
          }}
        />
      )
    },
    {
      title: '头像',
      dataIndex: 'avator',
      key: 'avator',
      width: 150,
      align: 'center',
      render: (_, record) => <Image style={{width: '30px',borderRadius: '15px'}} src={record.avator} fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3PTWBSGcbGzM6GCKqlIBRV0dHRJFarQ0eUT8LH4BnRU0NHR0UEFVdIlFRV7TzRksomPY8uykTk/zewQfKw/9znv4yvJynLv4uLiV2dBoDiBf4qP3/ARuCRABEFAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghgg0Aj8i0JO4OzsrPv69Wv+hi2qPHr0qNvf39+iI97soRIh4f3z58/u7du3SXX7Xt7Z2enevHmzfQe+oSN2apSAPj09TSrb+XKI/f379+08+A0cNRE2ANkupk+ACNPvkSPcAAEibACyXUyfABGm3yNHuAECRNgAZLuYPgEirKlHu7u7XdyytGwHAd8jjNyng4OD7vnz51dbPT8/7z58+NB9+/bt6jU/TI+AGWHEnrx48eJ/EsSmHzx40L18+fLyzxF3ZVMjEyDCiEDjMYZZS5wiPXnyZFbJaxMhQIQRGzHvWR7XCyOCXsOmiDAi1HmPMMQjDpbpEiDCiL358eNHurW/5SnWdIBbXiDCiA38/Pnzrce2YyZ4//59F3ePLNMl4PbpiL2J0L979+7yDtHDhw8vtzzvdGnEXdvUigSIsCLAWavHp/+qM0BcXMd/q25n1vF57TYBp0a3mUzilePj4+7k5KSLb6gt6ydAhPUzXnoPR0dHl79WGTNCfBnn1uvSCJdegQhLI1vvCk+fPu2ePXt2tZOYEV6/fn31dz+shwAR1sP1cqvLntbEN9MxA9xcYjsxS1jWR4AIa2Ibzx0tc44fYX/16lV6NDFLXH+YL32jwiACRBiEbf5KcXoTIsQSpzXx4N28Ja4BQoK7rgXiydbHjx/P25TaQAJEGAguWy0+2Q8PD6/Ki4R8EVl+bzBOnZY95fq9rj9zAkTI2SxdidBHqG9+skdw43borCXO/ZcJdraPWdv22uIEiLA4q7nvvCug8WTqzQveOH26fodo7g6uFe/a17W3+nFBAkRYENRdb1vkkz1CH9cPsVy/jrhr27PqMYvENYNlHAIesRiBYwRy0V+8iXP8+/fvX11Mr7L7ECueb/r48eMqm7FuI2BGWDEG8cm+7G3NEOfmdcTQw4h9/55lhm7DekRYKQPZF2ArbXTAyu4kDYB2YxUzwg0gi/41ztHnfQG26HbGel/crVrm7tNY+/1btkOEAZ2M05r4FB7r9GbAIdxaZYrHdOsgJ/wCEQY0J74TmOKnbxxT9n3FgGGWWsVdowHtjt9Nnvf7yQM2aZU/TIAIAxrw6dOnAWtZZcoEnBpNuTuObWMEiLAx1HY0ZQJEmHJ3HNvGCBBhY6jtaMoEiJB0Z29vL6ls58vxPcO8/zfrdo5qvKO+d3Fx8Wu8zf1dW4p/cPzLly/dtv9Ts/EbcvGAHhHyfBIhZ6NSiIBTo0LNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiEC/wGgKKC4YMA4TAAAAABJRU5ErkJggg=="/>
    },
    {
      title: '用户角色',
      dataIndex: 'role',
      key: 'role',
      align: 'center',
      width: 150,
      render: (_, record) => (
        <Space>
          {record.role.map((role, index) =>
            <Tag key={role._id} color={presets[index]}>{role.name}</Tag>
          )}
        </Space>
      )
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
      width: 100,
      align: 'center',
      render: _ => _ ?? '--'
    },
    {
      title: '性别',
      dataIndex: 'sex',
      key: 'sex',
      width: 100,
      align: 'center',
      render: (_, record)=> Number(record.sex) === 1 ? '男' : '女'
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      width: 250,
      align: 'center',
      render: _ => _ ?? '--'
    },
    {
      title: '密码',
      dataIndex: 'password',
      key: 'password',
      width: 150,
      align: 'center',
    },
    {
      title: '最近登陆时间',
      dataIndex: 'lastOnlineTime',
      key: 'lastOnlineTime',
      width: 200,
      align: 'center',
      render: _ => new Date(_).toLocaleString()
    },
    {
      title: '创建人',
      dataIndex: 'creator',
      key: 'creator',
      align: 'center',
      width: 150
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'end',
      align: 'center',
      width: 200,
      render: (_, record) => (
        <Space size="middle">
          <a onClick={()=>updateModal(record)}>编辑</a>
          <Popconfirm
            title="删除用户"
            description={`确定删除用户${record.username}吗?`}
            onConfirm={confirm}
            onCancel={cancel}
            okText="确定"
            cancelText="取消"
          >
            <a onClick={() => setId(record._id)}>删除</a>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  const UserRemove = async (id:string) => {
    try{
      const res = await getUserRemove(id)
      console.log(res)
      if(res.code === API_CODE.SUCCESS){
        message.success('删除成功')
        run(query)
      }else{
        message.error(res.msg)
      }
    } catch(e) {
      console.log(e)
    }
  }

  const confirm: PopconfirmProps['onConfirm'] = async (e) => {
    UserRemove(id)
  }

  const cancel: PopconfirmProps['onCancel'] = (e) => {
    message.error('取消删除')
  }

  const createModal = () => {
    setShowModal(true)
    setUpdateItem(null)
  }

  const updateModal = (item:UserListItem)=>{
    setShowModal(true)
    setUpdateItem(item)
  }

  return (
    <div>
      <Search 
        onFilterList={value=>{
          setFilterQuery(value)
          console.log(value)
          setQuery({
            ...query,
            page: 1
          })
        }}
        onListRes = {listRes?.data.list}
      />
      <Button type="primary" className={style.btn} onClick={createModal}>创建用户</Button>
      <Table<UserListItem>
        loading={loading}
        scroll={{ x: 1200 }}
        columns={columns}
        dataSource={listRes?.data.list}
        rowKey={row => row._id}
        size="small"
        pagination={{
          current: query.page,
          pageSize: query.pagesize,
          total: listRes?.data.total,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: total => `共 ${total} 条`,
          pageSizeOptions: [5, 10, 15, 20],
          onChange: (page, pagesize) => {
            setQuery({
              page,
              pagesize
            })
          },
          locale: {
            jump_to: '跳至', // 前缀文字
            page: '页',       // 输入框后缀文字
            items_per_page: '条/页'
          }
        }}
      />
      <FormModal 
        showModal={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={()=>run(query)}
        updateItem={updateItem}
      />
    </div>
  )
}

export default UserList