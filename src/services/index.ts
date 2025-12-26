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
  CreateMenuParams,
  UserListItem,
  UpdateAvatorParams,
  UpdateAvatorResponse,
  CreatePaperParams,
  ClassifyItem,
  ClassifyListParams
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
  return get<BaseResponse<UserListItem>>('/user/info')
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

// 修改用户信息
export const updateUserInfo = (params: UserListItem) => {
  return post<BaseResponse>('/user/update/info', params)
}
// 修改用户头像
export const updateAvator = (params: UpdateAvatorParams) => {
  return post<BaseResponse<UpdateAvatorResponse>>('/profile', params)
}

// 创建试卷
export const createPaper = (params: CreatePaperParams) =>{
  return post<BaseResponse>('exam/create', params)  
}
// 查询科目列表
export const getClassifyList = (params: ClassifyListParams) =>{
  return get<BaseResponse<ClassifyItem>>('classify/list', {params})
}