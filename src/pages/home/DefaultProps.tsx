// import {
//   CrownOutlined,
//   FileUnknownOutlined,
//   FormOutlined,
//   SmileOutlined,
//   SnippetsOutlined,
//   TeamOutlined,
// } from "@ant-design/icons"
// import Welcome from "../welcome/Welcome"

// import System from "../system/System"
// import Question from "../question/Question"
// import Exercise from "../exercise/Exercise"
// import Test from "../test/Test"
// import Class from "../class/Class"
// import UserInfo from "../system/component/user/UserInfo"
// import Permission from "../system/component/permission/Permission"
// import DashBoard from "../system/component/dashboard/DashBoard"
// import RoleList from "../system/component/role/RoleList"
// import UserList from "../system/component/users/UserList"

// import ExerciseBank from "@/pages/exercise/component/bankExercise/ExerciseBank"
// import CreateExercise from "@/pages/exercise/component/createExercise/CreateExercise"

// import CreateTest from "@/pages/test/component/createTest/CreateTest"
// import HistoryTest from "@/pages/test/component/historyTest/HistoryTest"

// import AddQuestion from "@/pages/question/component/addQuestion/AddQuestion"
// import BankQuestion from "@/pages/question/component/bankQuestion/BankQuestion"
// import CreateCourse from "@/pages/question/component/courseCreate/Creatcourse"

// import ClassList from "@/pages/class/conponent/classList/ClassList"
// import DelClass from "@/pages/class/conponent/delClass/DelClass"
// import EditStudent from "@/pages/class/conponent/editStudent/EditStudent"
// import StudentList from "@/pages/class/conponent/studentList/StudentList"

// export default {
//   route: {
//     path: "/",
//     exact: true,
//     routes: [
//       {
//         path: "/",
//         name: "欢迎",
//         icon: <SmileOutlined />,
//         element: <Welcome />,
//       },
//       {
//         path: "/dashboard",
//         name: "仪表盘",
//         icon: <CrownOutlined />,
//         element: <DashBoard />,
//       },
//       {
//         path: "/system",
//         name: "系统管理",
//         icon: <CrownOutlined />,
//         element: <System />,
//         routes: [
//           {
//             path: "/system/role",
//             name: "角色管理",
//             element: <RoleList />,
//           },
//           {
//             path: "/system/users",
//             name: "用户管理",
//             element: <UserList />,
//           },
//           {
//             path: "/system/userinfo",
//             name: "用户信息",
//             element: <UserInfo />,
//           },
//           {
//             path: "/system/permission",
//             name: "权限管理",
//             element: <Permission />,
//           },
//         ],
//       },
//       {
//         name: "试卷管理",
//         icon: <FileUnknownOutlined />,
//         path: "/exercise",
//         element: <Exercise />,
//         routes: [
//           {
//             path: "/exercise/bank",
//             name: "试卷库",
//             element: <ExerciseBank />,
//           },
//           {
//             path: "/exercise/create",
//             name: "创建试卷",
//             element: <CreateExercise />,
//           },
//         ],
//       },
//       {
//         name: "考试管理",
//         icon: <FormOutlined />,
//         path: "/test",
//         element: <Test />,
//         routes: [
//           {
//             path: "/test/create",
//             name: "创建考试",
//             element: <CreateTest />,
//           },
//           {
//             path: "/test/history",
//             name: "考试记录",
//             element: <HistoryTest />,
//           },
//         ],
//       },
//       {
//         name: "试题管理",
//         icon: <SnippetsOutlined />,
//         path: "/question",
//         element: <Question />,
//         routes: [
//           {
//             path: "/question/add",
//             name: "添加试题",
//             element: <AddQuestion />,
//           },
//           {
//             path: "/question/bank",
//             name: "试题库",
//             element: <BankQuestion />,
//           },
//           {
//             path: "/question/create",
//             name: "创建课程",
//             element: <CreateCourse />,
//           },
//         ],
//       },
//       {
//         name: "班级管理",
//         icon: <TeamOutlined />,
//         path: "/class",
//         element: <Class />,
//         routes: [
//           {
//             path: "/class/list",
//             name: "班级列表",
//             element: <ClassList />,
//           },
//           {
//             path: "/class/student",
//             name: "学生列表",
//             element: <StudentList />,
//           },
//           {
//             path: "/class/edit",
//             name: "学生编辑",
//             element: <EditStudent />,
//           },
//           {
//             path: "/class/del",
//             name: "删除班级",
//             element: <DelClass />,
//           },
//         ],
//       },
//     ],
//   },
//   location: {
//     pathname: "/",
//   },
// }

// import userStore from "@/store/userStore";
// import type { MenuListItem } from "@/services/types"

// const formatMenuList = (list: MenuListItem[]) => {
//   list.map(item=>{
//     const other = item.children?{children:formatMenuList(item.children)}:{}
//     return {
//       path:item.path,
//       name:item.name,
//       icon:item.icon,
//       ...other
//     }
//   })
// }

// const DefaultProps = {

// }

import type { MenuListItem } from '@/services/types'
import { IconEnum } from '@/constants/Icon'

/* ===== 1. 引入所有可能用到的组件（与注释里保持一致） ===== */
import {
  CrownOutlined,
  FileUnknownOutlined,
  FormOutlined,
  SmileOutlined,
  SnippetsOutlined,
  TeamOutlined,
} from '@ant-design/icons'
import Welcome from '../welcome/Welcome'

import System from '../system/System'
import Question from '../question/Question'
import Exercise from '../exercise/Exercise'
import Test from '../test/Test'
import Class from '../class/Class'
import UserInfo from '../system/component/user/UserInfo'
import Permission from '../system/component/permission/Permission'
import DashBoard from '../system/component/dashboard/DashBoard'
import RoleList from '../system/component/role/RoleList'
import UserList from '../system/component/users/UserList'

import ExerciseBank from '@/pages/exercise/component/bankExercise/ExerciseBank'
import CreateExercise from '@/pages/exercise/component/createExercise/CreateExercise'

import CreateTest from '@/pages/test/component/createTest/CreateTest'
import HistoryTest from '@/pages/test/component/historyTest/HistoryTest'

import AddQuestion from '@/pages/question/component/addQuestion/AddQuestion'
import BankQuestion from '@/pages/question/component/bankQuestion/BankQuestion'
import CreateCourse from '@/pages/question/component/courseCreate/Creatcourse'

import ClassList from '@/pages/class/conponent/classList/ClassList'
import DelClass from '@/pages/class/conponent/delClass/DelClass'
import EditStudent from '@/pages/class/conponent/editStudent/EditStudent'
import StudentList from '@/pages/class/conponent/studentList/StudentList'

/* ===== 2. 路径 → 组件 的映射表，用于自动补全 element ===== */
const routeElementMap: Record<string, React.ReactNode> = {
  '/': <Welcome />,
  '/dashboard': <DashBoard />,
  '/userManage': <System />,
  '/userManage/role': <RoleList />,
  '/userManage/users': <UserList />,
  '/userManage/userinfo': <UserInfo />,
  '/userManage/permission': <Permission />,
  '/paper': <Exercise />,
  '/paper/bank': <ExerciseBank />,
  '/paper/create': <CreateExercise />,
  '/test': <Test />,
  '/test/create': <CreateTest />,
  '/test/history': <HistoryTest />,
  '/question': <Question />,
  '/question/add': <AddQuestion />,
  '/question/bank': <BankQuestion />,
  '/question/create': <CreateCourse />,
  '/class': <Class />,
  '/class/list': <ClassList />,
  '/class/student': <StudentList />,
  '/class/edit': <EditStudent />,
  '/class/del': <DelClass />,
}

/* ===== 3. 图标映射（与注释保持一致） ===== */
const iconMap: Record<string, React.ReactNode> = {
  SmileOutlined: <SmileOutlined />,
  CrownOutlined: <CrownOutlined />,
  FileUnknownOutlined: <FileUnknownOutlined />,
  FormOutlined: <FormOutlined />,
  SnippetsOutlined: <SnippetsOutlined />,
  TeamOutlined: <TeamOutlined />,
}

/* ===== 4. 递归转换函数 ===== */
const buildRoutes = (list: MenuListItem[]) => {
  return list.map((item) => {
    const route : any  = {
      path: item.path,
      name: item.name,
    }

    // 图标
    if (item.icon && iconMap[item.icon]) {
      route.icon = iconMap[item.icon]
    }

    // 组件
    route.element = item.component
      ? (() => {
        /* 如果后端给了 component 字段，这里用动态 import 或 eval 处理 */
        /* 示例直接取 map 里的，也可以自己扩展 */
        return routeElementMap[item.path]
      })()
      : routeElementMap[item.path]

    // 子路由
    if (item.children && item.children.length) {
      route.routes = buildRoutes(item.children)
    }

    return route
  })
}

/* ===== 5. 主函数：把后端菜单树转成前端需要的数据结构 ===== */
const formatMenuList = (list: MenuListItem[]) => {
  const routes = buildRoutes(list)

  return {
    route: {
      path: '/',
      exact: true,
      routes,
    },
    location: {
      pathname: '/',
    },
  }
}

export default formatMenuList
