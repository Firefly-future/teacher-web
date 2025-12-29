import { lazy } from 'react'

import Login from '../pages/login/Login'
import Home from '@/pages/home/Home'
import Forbidden from '@/pages/403/Forbidden'
import NotFound from '@/pages/404/NotFound'
import Welcome from '@/pages/welcome/Welcome'
import Auth from './Auth'

const Class = lazy(() => import('@/pages/class/Class'))
const Exercise = lazy(() => import('@/pages/paper/Exercise'))
const Question = lazy(() => import('@/pages/question/Question'))
const System = lazy(() => import('@/pages/userManage/System'))
const Test = lazy(() => import('@/pages/exam/Test'))

const DashBoard = lazy(() => import('@/pages/dashboard/DashBoard'))
const RoleList = lazy(
  () => import('@/pages/userManage/components/role/RoleList')
)
const UserList = lazy(
  () => import('@/pages/userManage/components/users/UserList')
)
const UserInfo = lazy(
  () => import('@/pages/userManage/components/personal/UserInfo')
)
const Permission = lazy(
  () => import('@/pages/userManage/components/permission/Permission')
)

const ExerciseBank = lazy(
  () => import('@/pages/paper/components/bankExercise/ExerciseBank')
)
const CreateExercise = lazy(
  () => import('@/pages/paper/components/createExercise/CreateExercise')
)

const CreateTest = lazy(
  () => import('@/pages/exam/components/createTest/CreateTest')
)
const HistoryTest = lazy(
  () => import('@/pages/exam/components/historyTest/HistoryTest')
)

const AddQuestion = lazy(
  () => import('@/pages/question/components/addQuestion/AddQuestion')
)
const BankQuestion = lazy(
  () => import('@/pages/question/components/bankQuestion/BankQuestion')
)
const CreateCourse = lazy(
  () => import('@/pages/question/components/courseCreate/Creatcourse')
)

const ClassList = lazy(
  () => import('@/pages/class/components/classList/ClassList')
)
const StudentList = lazy(
  () => import('@/pages/class/components/studentList/StudentList')
)

const router = [
  {
    path: '/',
    element: (
      <Auth>
        <Home />
      </Auth>
    ),
    children: [
      { path: '/', element: <Welcome /> },
      {
        path: '/dashboard',
        element: <DashBoard />,
      },
      {
        path: '/userManage',
        element: <System />,
        children: [
          { path: '/userManage/system', element: <RoleList /> },
          { path: '/userManage/userOptions', element: <UserList /> },
          { path: '/userManage/personal', element: <UserInfo /> },
          { path: '/userManage/menuManage', element: <Permission /> },
        ],
      },
      {
        path: '/paper',
        element: <Exercise />,
        children: [
          { path: '/paper/paper-bank', element: <ExerciseBank /> },
          { path: '/paper/create-paper', element: <CreateExercise /> },
        ],
      },
      {
        path: '/exam',
        element: <Test />,
        children: [
          { path: '/exam/create', element: <CreateTest /> },
          { path: '/exam/record', element: <HistoryTest /> },
        ],
      },
      {
        path: '/question',
        element: <Question />,
        children: [
          { path: '/question/create-item', element: <AddQuestion /> },
          { path: '/question/item-bank', element: <BankQuestion /> },
          { path: '/question/create-subject', element: <CreateCourse /> },
        ],
      },
      {
        path: '/manage-group',
        element: <Class />,
        children: [
          { path: '/manage-group/group-list', element: <ClassList /> },
          { path: '/manage-group/group-students', element: <StudentList /> },
        ],
      },
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/403',
    element: <Forbidden />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
]

export default router
