import Login from "../pages/login/Login"
import Home from "@/pages/home/Home"
import DashBoard from "@/pages/dashboard/DashBoard"
import RoleList from "@/pages/role/RoleList"
import UserList from "@/pages/users/UserList"
import Permission from "@/pages/permission/Permission"
import NotFound from "@/pages/404/NotFound"
const router = [
  { path: "/", element: <Home /> },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/dashboard",
    element: <DashBoard />,
  },
  {
    path: "/roles",
    element: <RoleList />,
  },
  {
    path: "/users",
    element: <UserList />,
  },
  {
    path: "/permission",
    element: <Permission />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]

export default router
