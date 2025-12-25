import Login from '../pages/login/Login'
import Home from '@/pages/home/Home'
import DashBoard from '@/pages/dashboard/DashBoard'
import RoleList from '@/pages/system/component/role/RoleList'
import UserList from '@/pages/system/component/users/UserList'
import UserInfo from '@/pages/system/component/user/UserInfo'
import Permission from '@/pages/system/component/permission/Permission'

import NotFound from '@/pages/404/NotFound'

import Welcome from '@/pages/welcome/Welcome'
import Class from '@/pages/class/Class'
import Exercise from '@/pages/exercise/Exercise'
import Question from '@/pages/question/Question'
import System from '@/pages/system/System'
import Test from '@/pages/test/Test'

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
