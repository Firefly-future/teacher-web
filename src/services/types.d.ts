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
}
// 获取图形验证码参数
export type CaptchaCode = {
  code: string
}
// 登录返回值
export type LoginResponse = {
  token: string
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
// 权限
export type PermissionItem = {
  name: string
  path: string
  isBtn: boolean
}

// 左侧菜单
export type MenuListItem = {
  component:string
  createTime:number
  createdAt:string
  creator:string
  disabled:string
  icon:string
  isBtn:boolean
  name:string
  path:string
  pid:string
  updatedAt:string
  _id:string
  children?:MenuListItem[]
}

export type UserListRes = {
  list: UserListItem[]
  total: number
  totalPage: number
}
// 用户信息
export type UserInfo = {
  _id: string
  username: string
  sex: 1 | 0
  avator: string
  email: string
  age: number
  role: string[]
  permission: PermissionItem[]
}

// 创建和用户参数
export type CreateUserParams = Pick<UserListItem, 'age' | 'email' | 'password' | 'sex' | 'username' | 'role'>
// 更新用户参数
export type UpdateUserParams = Partial<Pick<UserListItem, 'age' | 'email' | 'password' | 'role' | 'sex' | 'status' | 'username'>> & {
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

// 权限列表
export type PermissionListRes = {
  list: MenuListItem[]
}

// 创建菜单参数
export type CreateMenuParams = Pick<MenuListItem, 'name' | 'path' | 'isBtn' | 'status'>

// 更新菜单参数
export type UpdateMenuParams = Partial<MenuListItem> & {
  id: string
  status?: 0 | 1
}



// 创建考试
export type CreateExamParams = {
  name: string
  classify: string
  examItem: string
  group: string
  examiner: string
  startTime: number
  endTime: number
}

// 科目分类
export type ClassifyItem = {
  _id: string
  name: string
  value: string
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
// 考试班级
export type ClassItem = {
  _id: string
  name: string
  value: string
}
// 考试班级返回值
export type ClassListRes = {
  list: ClassItem[]
}
// 考试管理--配置试卷-- 试卷列表
export type ExamItem = {
  _id: string
  name: string
  classify: string
  examItem: string
  group: string
  examiner: string
  startTime: number
  endTime: number
}
// 考试管理--配置试卷-- 试卷列表返回值
export type ExamListRes = {
  list: ExamItem[]
}

// 考试管理--发布考试--提交考试参数
export type SubmitExamParams = {
  examId: string
  answers: string[]
}