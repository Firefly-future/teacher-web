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
  ExamListResponse,
  ExamUpdate,
  ClassifyListResponse,
  UserListItem,
  UpdateAvatorParams,
  UpdateAvatorResponse,
  questionCreateItem,
  questionType,
  CreatePaperParams,
  ClassifyItem,
  ClassifyListParams,
  QuestionListParams,
  QuestionItem,
  QuestionTypeItem,
  CreateMultiple
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
  return get<BaseResponse<RoleItemRes>>('/role/list')
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
// 试卷列表
export const examList = (params:UserListParams) =>{
  return get<BaseResponse<ExamListResponse>>('/exam/list', {params})
}
// 删除试卷
export const examRemove = (id:string) =>{
  return post<BaseResponse>('/exam/remove', {id})
}
// 编辑试卷
export const examUpdata = (params:ExamUpdate) => {
  return post<BaseResponse>('/exam/update', params)
}
//试卷详情
export const examDetail = (id:string) => {
  return get<BaseResponse>(`/exam/detail?id=${id}`)
}
// 科目列表
export const classifyList = (params:UserListParams) => {
  return get<BaseResponse<ClassifyListResponse>>('/classify/list', {params})
}
// 修改用户信息
export const updateUserInfo = (params: UserListItem) => {
  return post<BaseResponse>('/user/update/info', params)
}
// 修改用户头像
export const updateAvator = (params: UpdateAvatorParams) => {
  return post<BaseResponse<UpdateAvatorResponse>>('/profile', params)
}
// 创建试题
export const questionCreate = (params: questionCreateItem) => {
  return post<BaseResponse>('/question/create', params)
}
// 试题类型
export const questionTypeList = () => {
  return get<BaseResponse<questionType>>('/question/type/list')
}

// 创建试卷
export const createPaper = (params: CreatePaperParams) =>{
  return post<BaseResponse>('exam/create', params)  
}
// 查询科目列表
export const getClassifyList = (params: ClassifyListParams) =>{
  return get<BaseResponse<ClassifyItem>>('classify/list', {params})
}
// 查询题目列表
export const getQuestionList = (params: QuestionListParams) =>{
  return get<BaseResponse<QuestionItem>>('question/list', {params})
}

// 查询题目类型列表
export const getQuestionTypeList = () =>{
  return get<BaseResponse<QuestionTypeItem[]>>('/question/type/list')
}
// 批量导入试题
export const questionCreateMultiple = (params: CreateMultiple) => {
  return post<BaseResponse>('/question/create/multiple',params)
}