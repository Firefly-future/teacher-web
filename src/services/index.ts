import { get, post } from './request'
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
  CreateMultiple,
  createClassifyParams,
  updateClassifyParams,
  CreateExamParams,
  ClassifyListRes,
  ExaminerListRes,
  ClassListRes,
  ExamListRes,
  SubmitExamParams,
  CreateClassParams,
  UpdateClassParams,
  StudentListParams,
  StudentListRes,
  CreateStudentParams,
  UpdateStudentParams,
  UpMenuParams,
  ClassListParams,
  ClassDetailRes,
  ExamRecordListRes,
  SubmitExamRes,
  DeleteExamParams,
} from './types'

// 获取图形验证码
export const getCaptchaCode = () => {
  return get<BaseResponse<CaptchaCode>>('/login/captcha')
}

// 获取登录
export const getLogin = (params: LoginParams) => {
  return post<BaseResponse<LoginResponse>>('/login', params)
}
// 退出登录
export const getLogout = () => {
  return post<BaseResponse>('/user/logout')
}
// 用户信息
export const getUserInfo = () => {
  return get<BaseResponse<UserListItem>>('/user/info')
}
// 获取用户左侧菜单
export const getUserMenuList = () => {
  return get<BaseResponse<{ list: MenuListItem[] }>>('/user/menulist')
}
// 获取用户列表
export const getUserList = (params: UserListParams) => {
  return get<BaseResponse<UserListResponse>>('/user/list', { params })
}
// 删除用户
export const getUserRemove = (id: string) => {
  return post<BaseResponse>('/user/remove', { id })
}
// 创建用户
export const createUser = (params: CreateUserParams) => {
  return post<BaseResponse>('/user/create', params)
}
// 更新用户
export const updateUserAvatarUrl = (params: UpdateAvatorParams) => {
  return post<BaseResponse>('/user/update', params)
}
// 上传头像
export const uploadImageFile = (file: File) => {
  const formData = new FormData()
  formData.append('file', file)
  return post<BaseResponse<UpdateAvatorResponse>>('/upload/image', formData)
}
// 获取角色列表
export const getRoleList = () => {
  return get<BaseResponse<RoleItemRes>>('/role/list')
}

// 编辑角色
export const updateRole = (params: UpdateRoleParams) => {
  return post<BaseResponse>('/role/update', params)
}
//删除角色
export const deleteRole = (id: string) => {
  return post<BaseResponse>('/role/remove', { id })
}
// 创建角色
export const createRole = (params: UpdateRoleParams) => {
  return post<BaseResponse>('/role/create', params)
}
// 获取权限列表
export const getPermissionList = () => {
  return get<BaseResponse<PermissionListRes>>('/permission/list')
}
// 更新用户
export const updateUser = (params: UpdateUserParams) => {
  return post<BaseResponse>('/user/update', params)
}
// 创建菜单
export const createMenu = (params: CreateMenuParams) => {
  return post<BaseResponse>('/permission/create', params)
}
// 删除菜单
export const deleteMenu = (id: string) => {
  return post<BaseResponse>('/permission/remove', { id })
}
// 更新菜单权限
export const updateMenu = (params: UpMenuParams) => {
  return post<BaseResponse>('/permission/update', params)
}
// 试卷列表
export const examList = (params: UserListParams) => {
  return get<BaseResponse<ExamListResponse>>('/exam/list', { params })
}
// 删除试卷
export const examRemove = (id: string) => {
  return post<BaseResponse>('/exam/remove', { id })
}
// 编辑试卷
export const examUpdata = (params: ExamUpdate) => {
  return post<BaseResponse>('/exam/update', params)
}
//试卷详情
export const examDetail = (id: string) => {
  return get<BaseResponse>(`/exam/detail?id=${id}`)
}
// 科目列表
export const classifyList = () => {
  return get<BaseResponse<ClassifyListResponse>>('/classify/list')
}
// 修改用户信息
export const updateUserInfo = (params: UserListItem) => {
  return post<BaseResponse>('/user/update/info', params)
}
// 修改用户头像
export const updateAvator = (params: UpdateAvatorParams) => {
  return post<BaseResponse<UpdateAvatorResponse>>('/user/update', params)
}
// 创建试题
export const questionCreate = (params: questionCreateItem) => {
  return post<BaseResponse>('/question/create', params)
}
// 试题类型
export const questionTypeList = () => {
  return get<BaseResponse<questionType>>('/question/type/list')
}
export const getQuestionClassifyList = () => {
  return get<BaseResponse>('/classify/list')
}
// 编辑试题
export const updateQuestion = () => {
  return post<BaseResponse>('/question/update')
}
// 删除试题
export const deleteQuestion = (id: string) => {
  return post<BaseResponse>('/question/remove', { id })
}
// 试题详情
export const getQuestionDetail = (id: string) => {
  return get<BaseResponse>('/exam/detail', { params: { id } })
}
// 创建试卷
export const createPaper = (params: CreatePaperParams) => {
  return post<BaseResponse>('exam/create', params)
}
// export const createPaper = (params: CreatePaperParams) =>{
//   return post<BaseResponse>('/exam/create', params)
// }
// 查询科目列表
// export const getClassifyList = (params: ClassifyListParams) =>{
//   return get<BaseResponse<ClassifyItem>>('/classify/list', {params})
// }
// 查询题目列表
// export const getQuestionList = (params: QuestionListParams) => {
//   return get<BaseResponse<QuestionItem>>('question/list', { params })
// }
export const getQuestionList = (params: QuestionListParams) =>{
  return get<BaseResponse<QuestionItem>>('/question/list', {params})
}
// 查询题目类型列表
export const getQuestionTypeList = () => {
  return get<BaseResponse<QuestionTypeItem[]>>('/question/type/list')
}
// 批量导入试题
export const questionCreateMultiple = (params: CreateMultiple) => {
  return post<BaseResponse>('/question/create/multiple', params)
}
// 创建科目
export const createClassify = (params: createClassifyParams) => {
  return post<BaseResponse>('/classify/create', params)
}
// 编辑科目
export const updateClassify = (params: updateClassifyParams) => {
  return post<BaseResponse>('/classify/update', params)
}
// 删除科目
export const deleteClassify = (id: string) => {
  return post<BaseResponse>('/classify/remove', { id })
}

// 考试管理--创建考试
export const createExam = (params: CreateExamParams) => {
  return post<BaseResponse>('/examination/create', params)
}
// 考试管理--获取科目分类
// export const getClassifyList = (params?: ClassifyListParams) => {
//   return get<BaseResponse<ClassifyListRes>>('/classify/list', { params })
// }
export const getClassifyList = (params?: ClassifyListParams) => {
  return get<BaseResponse<ClassifyListRes>>('/classify/list', {params})
}
// 考试管理--获取监考人
export const getExaminerList = () => {
  return get<BaseResponse<ExaminerListRes>>('/user/list')
}

// 考试管理--获取考试班级
// 查询班级
export const getClassList = (params?: ClassListParams) => {
  return get<BaseResponse<ClassListRes>>('/studentGroup/list', { params })
}

//考试管理--配置试卷-- 查询试卷列表
export const getExamList = (params: ExamListRes) => {
  return get<BaseResponse<ExamListRes>>('/exam/list', { params }) ///exam/list?page=1&pagesize=10
}

// 考试管理--发布考试--提交考试
// export const submitExam = () => {
//   return post<BaseResponse<SubmitExamParams>>('/student/exam/submit')
// }

export const submitExam = (params: SubmitExamParams) => {
  return post<BaseResponse<SubmitExamRes>>('/student/exam/submit', params)
}

// 新建班级
export const createClass = (params: CreateClassParams) => {
  return post<BaseResponse>('/studentGroup/create', params)
}
// 班级详情
export const getClassDetail = (id: string) => {
  return get<BaseResponse<ClassDetailRes>>(`/studentGroup/detail?id=${id}`)
}

// 编辑班级
export const updateClass = (params: UpdateClassParams) => {
  return post<BaseResponse>(`/studentGroup/update?${Date.now()}`, params)
}

// 删除班级
export const deleteClass = (id: string) => {
  return post<BaseResponse>('/studentGroup/remove', { id })
}

// 查询学生列表
export const getStudentList = (params: StudentListParams) => {
  return get<BaseResponse<StudentListRes>>('/student/list', { params })
}
// 创建学生
export const createStudent = (params: CreateStudentParams) => {
  return post<BaseResponse>('/student/create', params)
}
// 编辑学生
export const updateStudent = (params: UpdateStudentParams) => {
  return post<BaseResponse>(`/student/update?${Date.now()}`, params)
}
// 删除学生
export const deleteStudent = (id: string) => {
  return post<BaseResponse>('/student/remove', { id })
}


// 考试记录--查询考试列表
export const getExamRecordList = (params: any) => {
  return get<BaseResponse<ExamRecordListRes>>('/examination/list', { params })
}

// 考试记录 -- 删除考试记录
export const deleteExam = (id: string) => {
  return post<BaseResponse>('/examination/remove', { id })
}
//创建试题
export const createQuestion = () =>{
  return post<BaseResponse>('/question/create')
}
