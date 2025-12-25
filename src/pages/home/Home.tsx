import type { ProSettings } from "@ant-design/pro-components"
import { PageContainer, ProCard, ProLayout } from "@ant-design/pro-components"
import defaultProps from "./DefaultProps"
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom"
import {
  DownOutlined,
  PoweroffOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons"
import type { MenuProps } from "antd"
import { Button, Dropdown, Space } from "antd"
import userStore from "@/store/userStore"
import style from "./Home.module.scss"
const Home = () => {
  const settings: ProSettings | undefined = {
    fixSiderbar: true,
    layout: "mix",
    splitMenus: true,
  }
  const navigate = useNavigate()
  const items: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <a
          type="link"
          onClick={() => {
            console.log("帮助")
          }}
        >
          <QuestionCircleOutlined style={{ marginRight: 10 }} />
          帮助
        </a>
      ),
    },
    {
      key: "2",
      label: (
        <a
          type="link"
          onClick={() => {
            navigate("/login")
          }}
        >
          <PoweroffOutlined style={{ marginRight: 10 }} />
          退出登录
        </a>
      ),
    },
  ]

  const userInfo = userStore((state) => state.userInfo)
  const menuList = userStore((state) => state.menuList)
  console.log(userInfo, menuList)
  const location = useLocation()
  return (
    <div
      id="test-pro-layout"
      style={{
        height: "100vh",
      }}
    >
      <ProLayout
        {...defaultProps}
        location={location}
        menu={{
          type: "group",
        }}
        avatarProps={{
          src:
            userInfo?.avator ||
            "https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg",
          size: "small",
          title: userInfo?.username || "用户",
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
        menuItemRender={(item, dom) => <Link to={item.path || "/"}>{dom}</Link>}
        {...settings}
      >
        <PageContainer>
          <ProCard
            style={{
              height: "100vh",
              width: "100%",
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
