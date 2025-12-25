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
export type CaptchaCode = BaseResponse<{
  code: string
}>
// 登录返回值
export type LoginResponse = BaseResponse<{
  token: string
}>

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
export type UserInfo = BaseResponse<{
  _id: string
  username: string
  sex: string
  avator: string
  email: string
  age: number
  role: string[]
  permission: PermissionItem[]
}>

// 创建和用户参数
export type CreateUserParams = Pick<UserListItem, 'age' | 'email' | 'password' | 'sex' | 'username' | 'role'>
// 更新用户参数
export type UpdateUserParams = Partial<Pick<UserListItem, 'age' | 'email' | 'password' | 'role' | 'sex' | 'status' | 'username'>> & {
  id: string
}

export type RoleRes = {
  list: RoleItem[]
}
