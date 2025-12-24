import {
  CrownOutlined,
  FileUnknownOutlined,
  FormOutlined,
  SmileOutlined,
  SnippetsOutlined,
  TeamOutlined,
} from "@ant-design/icons"
import Welcome from "../welcome/Welcome"

import System from "../system/System"
import Question from "../question/Question"
import Exercise from "../exercise/Exercise"
import Test from "../test/Test"
import Class from "../class/Class"
import UserInfo from "../system/component/user/UserInfo"
import Permission from "../system/component/permission/Permission"
import DashBoard from "../system/component/dashboard/DashBoard"
import RoleList from "../system/component/role/RoleList"
import UserList from "../system/component/users/UserList"

import ExerciseBank from "@/pages/exercise/component/bankExercise/ExerciseBank"
import CreateExercise from "@/pages/exercise/component/createExercise/CreateExercise"

import CreateTest from "@/pages/test/component/createTest/CreateTest"
import HistoryTest from "@/pages/test/component/historyTest/HistoryTest"

import AddQuestion from "@/pages/question/component/addQuestion/AddQuestion"
import BankQuestion from "@/pages/question/component/bankQuestion/BankQuestion"
import CreateCourse from "@/pages/question/component/courseCreate/Creatcourse"

import ClassList from "@/pages/class/conponent/classList/ClassList"
import DelClass from "@/pages/class/conponent/delClass/DelClass"
import EditStudent from "@/pages/class/conponent/editStudent/EditStudent"
import StudentList from "@/pages/class/conponent/studentList/StudentList"
import { Outlet } from "react-router-dom"

export default {
  route: {
    path: "/",
    exact: true,
    routes: [
      {
        path: "/",
        name: "欢迎",
        icon: <SmileOutlined />,
        element: <Welcome />,
      },
      {
        path: "/system",
        name: "系统管理",
        icon: <CrownOutlined />,
        element: <System />,
        routes: [
          {
            path: "/system/dashboard",
            name: "仪表盘",
            element: <DashBoard />,
          },
          {
            path: "/system/role",
            name: "角色管理",
            element: <RoleList />,
          },
          {
            path: "/system/users",
            name: "用户管理",
            element: <UserList />,
          },
          {
            path: "/system/userinfo",
            name: "用户信息",
            element: <UserInfo />,
          },
          {
            path: "/system/permission",
            name: "权限管理",
            element: <Permission />,
          },
        ],
      },
      {
        name: "试卷管理",
        icon: <FileUnknownOutlined />,
        path: "/exercise",
        element: <Exercise />,
        routes: [
          {
            path: "/exercise/bank",
            name: "试卷库",
            element: <ExerciseBank />,
          },
          {
            path: "/exercise/create",
            name: "创建试卷",
            element: <CreateExercise />,
          },
        ],
      },
      {
        name: "考试管理",
        icon: <FormOutlined />,
        path: "/test",
        element: <Test />,
        routes: [
          {
            path: "/test/create",
            name: "创建考试",
            element: <CreateTest />,
          },
          {
            path: "/test/history",
            name: "考试记录",
            element: <HistoryTest />,
          },
        ],
      },
      {
        name: "试题管理",
        icon: <SnippetsOutlined />,
        path: "/question",
        element: <Question />,
        routes: [
          {
            path: "/question/add",
            name: "添加试题",
            element: <AddQuestion />,
          },
          {
            path: "/question/bank",
            name: "试题库",
            element: <BankQuestion />,
          },
          {
            path: "/question/create",
            name: "创建课程",
            element: <CreateCourse />,
          },
        ],
      },
      {
        name: "班级管理",
        icon: <TeamOutlined />,
        path: "/class",
        element: <Class />,
        routes: [
          {
            path: "/class/list",
            name: "班级列表",
            element: <ClassList />,
          },
          {
            path: "/class/student",
            name: "学生列表",
            element: <StudentList />,
          },
          {
            path: "/class/edit",
            name: "学生编辑",
            element: <EditStudent />,
          },
          {
            path: "/class/del",
            name: "删除班级",
            element: <DelClass />,
          },
        ],
      },
    ],
  },
  location: {
    pathname: "/",
  },
}
