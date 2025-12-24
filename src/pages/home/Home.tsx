import type { ProSettings } from "@ant-design/pro-components"
import { PageContainer, ProCard, ProLayout } from "@ant-design/pro-components"
import defaultProps from "./DefaultProps"
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom"

const Home = () => {
  const settings: ProSettings | undefined = {
    fixSiderbar: true,
    layout: "mix",
    splitMenus: true,
  }
  const location = useLocation()
  const navigate = useNavigate()
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
          src: "https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg",
          size: "small",
          title: "七妮妮",
        }}
        menuItemRender={(item, dom) => <Link to={item.path || '/'}>{dom}</Link>}
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
