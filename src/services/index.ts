import request from './request'
import type {
  LoginParams,
  CaptchaCode,
  LoginResponse,
  UserInfo,
  MenuListItem,
  BaseResponse
} from './types'

// 获取图形验证码
export const getCaptchaCode = () => {
  return request.get<CaptchaCode>('/login/captcha')
}

// 获取登录
export const getLogin = (params: LoginParams) => {
  return request.post<LoginResponse>('/login', params)
}

// 用户信息
export const getUserInfo = () => {
  return request.get<UserInfo>('/user/info')
}
// 获取用户菜单
export const getUserMenuList = () => {
  return request.get<BaseResponse<{list: MenuListItem[]}>>('/user/menulist')
}
