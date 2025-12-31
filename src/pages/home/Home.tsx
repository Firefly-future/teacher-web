import type { ProSettings } from '@ant-design/pro-components'
import { PageContainer, ProCard, ProLayout } from '@ant-design/pro-components'
import FormatMenuList from './FormatMenuList.tsx'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  DownOutlined,
  PoweroffOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { Dropdown, message, Space, Spin } from 'antd'
import userStore from '@/store/userStore'
import style from './Home.module.scss'
import { useEffect, useState } from 'react'
import { removeToken } from '@/utils'
import { getLogout } from '@/services'
import { API_CODE } from '@/constants/Constants.ts'

const Home = () => {
  const goout = async () => {
    try {
      const res = await getLogout()
      if (res.code === API_CODE.SUCCESS) {
        message.success('退出登录成功')
        removeToken()
        navigate('/login')
      } else {
        message.error(res.msg)
      }
    } catch (e) {
      console.log(e)
      message.error('退出登录失败')
    }
  }
  const settings: ProSettings | undefined = {
    fixSiderbar: true,
    layout: 'mix',
    splitMenus: true,
  }
  const navigate = useNavigate()
  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <a
          type='link'
          onClick={() => {
            message.info('点击了帮助文档')
          }}
        >
          <QuestionCircleOutlined style={{ marginRight: 10 }} />
          帮助
        </a>
      ),
    },
    {
      key: '2',
      label: (
        <a
          type='link'
          onClick={() => {
            goout()
          }}
        >
          <span style={{ color: 'red' }}>
            <PoweroffOutlined style={{ marginRight: 10 }} />
            退出登录
          </span>
        </a>
      ),
    },
  ]
  const getUserInfo = userStore((state) => state.getUserInfo)
  const userInfo = userStore((state) => state.userInfo)
  const userMenuList = userStore((state) => state.menuList)
  // console.log(userMenuList)
  // console.log(getUserInfo)

  useEffect(() => {
    getUserInfo()
  }, [])
  const location = useLocation()
  if (!userMenuList || userMenuList.length === 0) {
    return (
      <Spin
        spinning={true}
        style={{
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      />
    )
  }
  return (
    <div
      id='test-pro-layout'
      style={{
        height: '100vh',
      }}
    >
      <ProLayout
        {...FormatMenuList(userMenuList)}
        location={location}
        menu={{
          type: 'group',
        }}
        avatarProps={{
          src:
            userInfo?.avator ||
            userInfo?.avator ||
            'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg',
          size: 'small',
          title: userInfo?.username || '用户',
          render: (_, dom) => {
            return (
              <Dropdown menu={{ items }}>
                <a onClick={(e) => e.preventDefault()}>
                  <Space>
                    {dom}
                    <DownOutlined />
                  </Space>
                </a>
              </Dropdown>
            )
          },
        }}
        menuItemRender={(item, dom) => <Link to={item.path || '/'}>{dom}</Link>}
        {...settings}
      >
        <PageContainer>
          <ProCard
            style={{
              height: 'auto',
              width: '100%',
            }}
          >
            <Outlet />
          </ProCard>
        </PageContainer>
      </ProLayout>
    </div>
  )
}

export default Home
