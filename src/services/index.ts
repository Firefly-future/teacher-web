import  {get, post } from './request'
import type {
  LoginParams,
  CaptchaCode,
  LoginResponse,
  UserInfo,
  MenuListItem,
  BaseResponse,
  UserListParams,
  UserListRes,
  CreateUserParams,
  UpdateUserParams,
  RoleRes
} from './types'

// 获取图形验证码
export const getCaptchaCode = () => {
  return get<CaptchaCode>('/login/captcha')
}

// 获取登录
export const getLogin = (params: LoginParams) => {
  return post<LoginResponse>('/login', params)
}

// 用户信息
export const getUserInfo = () => {
  return get<UserInfo>('/user/info')
}
// 获取用户菜单
export const getUserMenuList = () => {
  return get<BaseResponse<{list: MenuListItem[]}>>('/user/menulist')
}

export const getUserList = (params: UserListParams) => {
  return get<BaseResponse<UserListRes>>('/user/list', { params })
}
// 删除用户
export const getUserRemove = (id: string) => {
  return post<BaseResponse>('/user/remove', {id})
}
// 创建用户
export const createUser = (params: CreateUserParams) => {
  return post<BaseResponse>('/user/create', params)
}
// 更新用户
export const updateUser = (params: UpdateUserParams) => {
  return post<BaseResponse>('/user/update', params)
}

export const getRoleList = () => {
  return get<BaseResponse<RoleRes>>('/role/list')
}