import React from 'react'
import type { MenuListItem } from '@/services/types'
import { IconEnum, type IconEnumKeys } from '@/constants/Icon'
import { PieChartOutlined, SmileTwoTone } from '@ant-design/icons'

const buildRoutes = (list: MenuListItem[]) => {
  return list.map((item) => {
    const route: any = {
      path: item.path,
      name: item.name,
    }

    // 图标
    if (item.icon && IconEnum[item.icon as IconEnumKeys]) {
      const IconComponent = IconEnum[item.icon as keyof typeof IconEnum]
      route.icon = <IconComponent />
    }
    if (item.children && item.children.length) {
      route.routes = buildRoutes(item.children)
    }

    return route
  })
}
const FormatMenuList = (list: MenuListItem[]) => {
  const routes = buildRoutes(list)
  const defaultRoute = [
    {
      path: '/',
      name: '欢迎页',
      icon: <SmileTwoTone />,
    },
    {
      path: '/dashboard',
      name: '仪表盘',
      icon: <PieChartOutlined />,
    },
    ...routes,
  ]

  return {
    route: {
      path: '/',
      exact: true,
      routes: defaultRoute,
    },
    location: {
      pathname: '/',
    },
  }
}

export default FormatMenuList
