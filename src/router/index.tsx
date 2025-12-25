import Login from '../pages/login/Login'
import Home from '@/pages/home/Home'
import DashBoard from '@/pages/dashboard/DashBoard'
import RoleList from '@/pages/userManage/components/role/RoleList'
import UserList from '@/pages/userManage/components/users/UserList'
import UserInfo from '@/pages/userManage/components/personal/UserInfo'
import Permission from '@/pages/userManage/components/permission/Permission'

import NotFound from '@/pages/404/NotFound'

import Welcome from '@/pages/welcome/Welcome'
import Class from '@/pages/class/Class'
import Exercise from '@/pages/paper/Exercise'
import Question from '@/pages/question/Question'
import System from '@/pages/userManage/System'
import Test from '@/pages/exam/Test'

import ExerciseBank from '@/pages/paper/components/bankExercise/ExerciseBank'
import CreateExercise from '@/pages/paper/components/createExercise/CreateExercise'

import CreateTest from '@/pages/exam/components/createTest/CreateTest'
import HistoryTest from '@/pages/exam/components/historyTest/HistoryTest'

import AddQuestion from '@/pages/question/components/addQuestion/AddQuestion'
import BankQuestion from '@/pages/question/components/bankQuestion/BankQuestion'
import CreateCourse from '@/pages/question/components/courseCreate/Creatcourse'

import ClassList from '@/pages/class/components/classList/ClassList'
import DelClass from '@/pages/class/components/delClass/DelClass'
import EditStudent from '@/pages/class/components/editStudent/EditStudent'
import StudentList from '@/pages/class/components/studentList/StudentList'

import Auth from './Auth'

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
          { path: '/manage-group/del-group', element: <DelClass /> },
          { path: '/manage-group/edit-group', element: <EditStudent /> },
        ],
      },
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
]

export default router
