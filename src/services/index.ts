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
  PermissionListRes,
  CreateMenuParams
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

export const getUserList = (params: UserListParams) => {
  return get<BaseResponse<UserListResponse>>('/user/list', { params })
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
// 获取角色列表
export const getRoleList = () => {
  return get<BaseResponse<RoleItemRes[]>>('/role/list')
}

// 编辑角色
export const updateRole = (params: UpdateRoleParams) =>{
  return post<BaseResponse>('/role/update', params)
}
//删除角色
export const deleteRole = (id: string) =>{
  return post<BaseResponse>('/role/remove', {id})
}
// 创建角色
export const createRole = (params: UpdateRoleParams) =>{
  return post<BaseResponse>('/role/create', params)
}
// 获取权限列表
export const getPermissionList = () =>{
  return get<BaseResponse<PermissionListRes>>('/permission/list')
}

// 创建菜单
export const createMenu = (params: CreateMenuParams) =>{
  return post<BaseResponse>('/permission/create', params)
}
// 删除菜单
export const deleteMenu = (id: string) =>{
  return post<BaseResponse>('/permission/remove', {id})
}
// 更新菜单
export const updateMenu = (id:string) =>{
  return post<BaseResponse>('/permission/update', {id})
}
//获取试题列表
export const getQuestionList = () =>{
  return get<BaseResponse>('/question/list')
}
//分类列表
export const getQuestionTypeList = () =>{
  return get<BaseResponse>('/question/type/list')
}
//类型列表
export const getQuestionClassifyList = () =>{
  return get<BaseResponse>('/classify/list')
}
// 编辑试题
export const updateQuestion = () =>{
  return post<BaseResponse>('/question/update')
}
// 删除试题
export const deleteQuestion = (id: string) =>{
  return post<BaseResponse>('/question/remove', {id})
}
// 试题详情
export const getQuestionDetail = (id: string) =>{
  return get<BaseResponse>('/exam/detail', {params: {id} })
}
