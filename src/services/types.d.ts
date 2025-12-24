import { API_CODE } from "@/constants/Constants"

export type BaseResponse<T=never> = {
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
  sex: string
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
  sex: '男' | '女'
  status: 0 | 1
}