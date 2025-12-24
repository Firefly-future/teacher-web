import React from 'react'
import { Flex, Space, Table, Tag } from 'antd'
import type { TableProps } from 'antd'

interface DataType {
  key: string
  name: string
  age: number
  address: string
  tags: string[]
}

const UserList = () => {
  
  const columns: TableProps<DataType>['columns'] = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a>Invite {record.name}</a>
          <a>Delete</a>
        </Space>
      ),
    },
  ];

  return (
    <div>
      {/* <Table<DataType> columns={columns} dataSource={data} /> */}
    </div>
  )
}

export default UserList