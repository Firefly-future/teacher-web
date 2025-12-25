import  {get, post } from './request'
import type {
  LoginParams,
  CaptchaCode,
  LoginResponse,
  UserInfo,
  MenuListItem,
  BaseResponse,
  UserListParams,
  UserListResponse,
  CreateUserParams,
  UpdateUserParams,
  RoleItemRes,
  UpdateRoleParams,
  PermissionListRes
} from './types'

// 获取图形验证码
export const getCaptchaCode = () => {
  return get<BaseResponse<CaptchaCode>>('/login/captcha')
}

// 获取登录
export const getLogin = (params: LoginParams) => {
  return post<BaseResponse<LoginResponse>>('/login', params)
}

// 用户信息
export const getUserInfo = () => {
  return get<BaseResponse<UserInfo>>('/user/info')
}
// 获取用户左侧菜单
export const getUserMenuList = () => {
  return get<BaseResponse<{list: MenuListItem[]}>>('/user/menulist')
}

// 获取用户列表
export const getUserList = (params: UserListParams) =>{
  return get<BaseResponse<UserListResponse>>('/user/list', {params})
}

// 创建用户
export const createUser = (params: CreateUserParams) =>{
  return post<BaseResponse>('/user/create', params)
}

// 编辑用户
export const updateUser = (params: UpdateUserParams) => {
  return post<BaseResponse>('/user/update', params)
}

// 获取角色列表
export const getRoleList = () =>{
  return get<BaseResponse<RoleItemRes>>('/role/list')
}

// 编辑角色
export const updateRole = (params: UpdateRoleParams) =>{
  return post<BaseResponse>('/role/update', params)
}

// 获取权限列表
export const getPermissionList = () =>{
  return get<BaseResponse<PermissionListRes>>('/permission/list')
}