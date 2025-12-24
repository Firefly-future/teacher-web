import { API_CODE } from "@/constants/Constants"

// 通用response
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
// 权限
export type PermissionItem = {
  name:string
  path:string
}

// 用户信息
export type UserInfo = BaseResponse<{
  _id:string
  username:string
  sex:string
  avator:string
  email:string
  age:number
  role:string[]
  permission:PermissionItem[]
}>

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