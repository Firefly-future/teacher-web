import { API_CODE } from "@/constants/Constants"

export type BaseResponse<T> = {
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
