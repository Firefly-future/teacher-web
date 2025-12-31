import { API_CODE } from '@/constants/Constants'
import { type IconEnumKeys } from '@/constants/Icon'

// 通用response
export type BaseResponse<T = never> = {
  code: API_CODE
  msg: string
  data: T
}
// 登录参数
export type LoginParams = {
  username: string
  password: string
  code: string
  sessionId: string
}
// 获取图形验证码参数
export type CaptchaCode = {
  code: string
  sessionId?: string
  text?: string
}
// 登录返回值
export type LoginResponse = {
  token: string
}
export type roleItem = {
  _id: string
  name: string
}
// 用户信息
export type UserInfo = {
  _id: string
  username: string
  sex: 0 | 1
  avator: string
  email: string
  age: number
  role: roleItem[]
  permission: PermissionItem[]
}

// 用户列表参数
export type UserListParams = {
  page: number
  pagesize: number
  username?: string
  status?: 0 | 1
}

// 用户列表信息
export type UserListItem = Partial<UserInfo> &
  Omit<UserInfo, 'permission'> & {
    lastOnlineTime: number
    creator: string
    status: 0 | 1
    password?: string
    createdAt: string
  }
// 权限
export type PermissionItem = {
  name: string
  path: string
  isBtn: boolean
  _id?: string
}

// 左侧菜单
export type MenuListItem = {
  component: string
  createTime: number
  createdAt: string
  creator: string
  disabled: string
  icon: string
  isBtn: boolean
  name: string
  path: string
  pid: string
  updatedAt: string
  _id: string
  children?: MenuListItem[]
}

export type UserListRes = {
  list: UserListItem[]
  total: number
  totalPage: number
  page: number
  pageSize: number
}
// 用户信息
export type UserInfo = {
  _id: string
  username: string
  sex: 0 | 1
  avator: string
  email: string
  age: number
  role: string[]
  permission: PermissionItem[]
}

// 创建和用户参数
export type CreateUserParams = Pick<
  UserListItem,
  'age' | 'email' | 'password' | 'sex' | 'username' | 'role'
>
// 更新用户参数
export type UpdateUserParams = Partial<
  Pick<
    UserListItem,
    'age' | 'email' | 'password' | 'role' | 'sex' | 'status' | 'username'
  >
> & {
  id: string
}

export type RoleRes = {
  list: RoleItem[]
}

// 用户列表参数
export type UserListParams = {
  page: number
  pagesize: number
}

// 用户列表信息
export type UserListItem = Omit<UserInfo, 'permission'> & {
  lastOnlineTime: number
  creator: string
  password: string
  status: 0 | 1
}

// 用户列表返回值
export type UserListResponse = {
  total: number
  list: UserListItem[]
  totalPage: number
}

// 创建用户参数
export type CreateUserParams = Pick<
  UserListItem,
  'username' | 'sex' | 'password' | 'email' | 'age' | 'role'
>

// 更新用户参数
export type UpdateUserParams = Partial<
  Pick<UserListItem, 'username' | 'sex' | 'password' | 'email' | 'age' | 'role'>
> & {
  id: string
}

// 角色列表
export type RoleItem = {
  createdAt(createdAt: any): unknown
  classify: string
  type(type: any): unknown
  question: string
  name: string
  value: string
  _id: string
  permission: string[]
}

// 角色列表返回值
export type RoleItemRes = {
  list: RoleItem[]
}

// 编辑角色参数
export type UpdateRoleParams = Partial<Omit<RoleItem, '_id'>> & {
  id: string
}
// 权限列
export type Permissionlit = {
  _id: string
  name: string
  pid: string
  path: string
  disabled: boolean
  createTime: number
  isBtn: boolean
}

// 权限列表
export type PermissionListRes = {
  total: number
  list: Permissionlit[]
  totalPage: number
}

// 创建菜单参数
export type CreateMenuParams = Partial<
  Pick<MenuListItem, 'name' | 'path' | 'isBtn' | 'status' | 'pid'>
> & {
  disabled?: boolean
}
// 更新菜单
export type UpMenuParams = {
  pid?: string
  id: string
  name?: string
  path?: string
  isBtn?: boolean
  status?: 0 | 1
}
// 更新菜单参数
export type UpdateMenuParams = Partial<MenuListItem> & {
  id: string
  status?: 0 | 1
}

export type Questions = {
  order: number
  question: string
  score: number
  _id: string
}

export type ExamListItem = {
  classify: string
  createdAt: string
  creator: string
  description: string
  duration: number
  name: string
  questions: Questions[]
  status: number
  totalScore: number
  updatedAt: string
  __v: number
  _id: string
}

// 试卷列表返回值
export type ExamListResponse = {
  total: number
  list: ExamListItem[]
  totalPage: number
}

//更新试卷
export type ExamUpdate = {
  id: string
  name: string
}
// 题目类型
export type ExamDetailQuestions = {
  answer: string
  classify: string
  options: string[]
  question: string
  type: string
  __v: number
  _id: string
} | null

// 试卷详情
export type ExamDetail = Pick<
  ExamListItem,
  'classify' | 'createTime' | 'creator' | 'name' | '__v' | '_id'
> & {
  questions: ExamDetailQuestions[]
}

// 试卷查询
export type ExamSearch = {
  name?: string
  creator?: string
  classify?: string
}

// 科目列表
export type ClassifyListResponse = {
  list: ClassifyListItem[]
}
// 科目列表项
export type ClassifyListItem = {
  _id: string
  name: string
  description: string
  icon: string
  sortOrder: number
  status: number
  creator: string
  createdAt: string
}
// 更新用户头像参数
export type UpdateAvatorParams = {
  id: string
  avatar: string
}
// 更新用户头像返回值
export type UpdateAvatorResponse = {
  url: string
  filename: string
  size: number
}
// 创建试题参数
export type questionCreateItem = {
  question: string
  type: string
  classify: string
  answer: boolean | string
  options?: options[]
  explanation: string
}

export type options = {
  label: string
  value: string
}

// 试题类型返回值
export type questionType = {
  list: TypeItem[]
}

// 试题批量创建参数
export type CreateMultiple = {
  list: questionCreateItem[]
}

export type TypeItem = {
  value: string
  name: string
}

// 创建试卷参数
export type CreatePaperParams = {
  name: string
  classify: string
  questions: string[]
  duration?: number
  difficulty?: 2 | 3 | 1
}
// 科目列表参数
export type ClassifyListParams = {
  page?: number
  pagesize?: number
  name?: string
  status?: 0 | 1
}
// 科目列
export type ClassifyItemList = {
  _id: string
  name: string
  value: string
  creator: string
  createTime: number
  description: string
}
// 科目列表
export type ClassifyItem = {
  name: any
  _id: any
  description: string
  status: 0 | 1
  creator: string
  createdAt: string
  total: number
  list: ClassifyItemList[]
  page: number
  pagesize: number
  totalPage: number
}

// 题目列表参数
export type QuestionListParams = {
  classify: string
}

// 题目list
export type QuestionItemList = {
  answer: string
  classify: string
  options: string[]
  question: string
  type: string
  _id: string
  score: number
  difficulty?: 2 | 3 | 1
  explanation?: string
  creator?: string
  status?: 0 | 1
  createdAt: string
  updatedAt: string
}
// 题目data返回值
export type QuestionItem = {
  total: number
  list: QuestionItemList[]
  totalPage: number
  page: number
  pagesize: number
}
// 题目list列表
export type QuestionTypeItem = {
  id?: string
  name: string
  value: number
}
// 创建科目参数
export type createClassifyParams = {
  name: string
  description?: string
  value?: string
}
// 更新科目参数
export type updateClassifyParams = {
  id: string
  name: string
  description?: string
  value?: string
}
// 科目列（表格数据）
export type ClassifyTableItem = {
  _id: string
  name: string
  value: string
}

// 创建考试
export type CreateExamParams = {
  name: string
  classify: string
  examId: string
  group: string
  examiner: string
  startTime: number
  endTime: number
}

// 科目分类
export type ClassifyItem = {
  // _id: string
  // name: string
  // value: string

  page?: number
  pagesize?: number
  name?: string
  status?: number
}
// 科目分类返回值
export type ClassifyListRes = {
  list: ClassifyItem[]
}

// 监考人
export type ExaminerItem = {
  _id: string
  username: string
}
// 监考人返回值
export type ExaminerListRes = {
  list: ExaminerItem[]
}

// 组合
export type TeacherItem = {
  _id: string
  username: string
}
// 学生
export type StudentItem = {
  _id: string
  username: string
  studentId: string
  email: string
}
// 考试班级
export type ClassItem = {
  capacity: number
  createdAt: string
  grade: string
  deletedAt: string
  status: 0 | 1
  _id: string
  updatedAt: string
  name: string
  description: string
  creator: string
  classify: teacherParams
  teacher: TeacherItem
  students: StudentItem[]
  // students?: StudentsItem[]
  createTime: number
  // classify?: string
  // _id: string
  // name: string
  // students?: StudentsItem[]
  // createTime?: number
  // classify?: string
  // creator?: string
  // teacher?: string
  // page?: number
  // pagesize?: number
  // name?: string
  // teacher?: string
  // classify?: string
  // status?: number
  // grade?: string
}
// 考试班级返回值
export type ClassListRes = {
  list: ClassItem[]
  total: number
  totalPage: number
  page: number
  pagesize: number
}
// 考试管理--配置试卷-- 试卷列表
export type ExamItem = {
  // _id: string
  // name: string
  // classify: string
  // examItem: string
  // group: string
  // examiner: string
  // startTime: number
  // endTime: number
  page?: number
  pagesize?: number
  name?: string
  classify?: string
  status?: number
  creator?: string
}
// 考试管理--配置试卷-- 试卷列表返回值
export type ExamListRes = {
  list: ExamItem[]
}

// 考试管理--发布考试--提交考试参数
export type SubmitExamParams = {
  id: string
  answers: string[]
}

// 考试班级--学生列表项
export type StudentsItem = {
  age: number
  avator: string
  classId: string
  className: string
  createTime: number
  creator: string
  email: string
  idCard: string
  password: string
  role: number
  username: string
  sex: 0 | 1
  _id: string
  exam: ExamItem[]
}
// 查询班级参数
export type ClassListParams = {
  name?: string
  teacher?: string
  classify?: string
  page?: number
  pagesize?: number
  grade?: string
  status?: 0 | 1
}

// 新建班级参数
export type CreateClassParams = {
  name: string
  teacher?: string
  classify?: string
  students?: string[] | number[]
  description?: string
  grade?: string
  capacity?: number
  status?: 0 | 1
}
// 更新班级参数
export type UpdateClassParams = {
  id: string
  name?: string
  teacher?: string
  classify?: string
  students?: string[] | number[]
  description?: string
  grade?: string
  capacity?: number
  status?: 0 | 1
}

export type teacherParams = {
  _id: string
  name: string
}
export type studentsParams = {
  _id: string
  username: string
  studentId: string
  email: string
}
// 班级详情返回值
export type ClassDetailRes = {
  _id: string
  name: string
  teacher?: teacherParams
  classify?: teacherParams
  students?: studentsParams[]
  description?: string
  grade?: string
  capacity?: number
  status?: 0 | 1
  creator?: string
  deleteAt?: null
  crreatAt: string
  updatedAt: string
}

// 查询学生列表参数
export type StudentListParams = {
  page?: number
  pagesize?: number
  sex?: 0 | 1
  className?: string
  age?: number
  username?: string
  classId?: string
}
// 学生列表项
export type StudentListItem = {
  _id: string
  password: string
  sex: 0 | 1
  age: number
  email: string
  className: string
  avator: string
  status: 0 | 1
  creator: string
  createTime: number
  __v: number
  role: string
  username: string
  createdAt: string
  updatedAt: string
  classId: string
}
// 查询学生列表返回值
export type StudentListRes = {
  total: number
  list: StudentListItem[]
  page: number
  pagesize: number
  totalPage: number
}
// 创建学生参数
export type CreateStudentParams = {
  username?: string
  password?: string
  classId?: string
  sex?: 0 | 1
  age?: number
  className?: string
  email?: string
  avatar?: string
  status?: 0 | 1
  idCard?: string
}
// 更新学生参数
export type UpdateStudentParams = {
  id: string
  username?: string
  password?: string
  sex?: 0 | 1
  idCard?: string
  age?: number
  className?: string
  email?: string
  avatar?: string
  status?: 0 | 1
  classId?: string
}

// 考试管理--发布考试--提交考试返回值
export type SubmitExamRes = {
  // score: number
  classify?: string
  endTime?: number
  examId?: string
  examiner?: string
  group?: string
  name?: string
  startTime?: number
}

// 考试记录--查询考试列表
export type ExamRecordItem = {
  // _id: string
  // examId: string
  // name: string
  // classify: string
  // examItem: string
  // group: string[]
  // examiner: string
  // startTime: number
  // endTime: number
  // status: number
  page?: number
  pagesize?: number
  name?: string
  status?: number
}

// 考试记录--查询考试列表返回值
export type ExamRecordListRes = {
  list: ExamRecordItem[]
}

// 考试记录 -- 删除考试记录
export type DeleteExamParams = {
  id: string
}
