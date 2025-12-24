import axios from "axios"
import type { LoginParams, CaptchaCode, LoginResponse } from "./types"
import { getToken } from "@/utils"
axios.defaults.baseURL = "/api"

// 获取图形验证码
export const getCaptchaCode = () => {
  return axios.get<CaptchaCode>("/login/captcha")
}

// 获取登录
export const getLogin = (params: LoginParams) => {
  return axios.post<LoginResponse>("/login", params)
}

// 用户信息
export const getUserInfo = () =>{
  return axios.get<LoginResponse>('/user/info',{
    headers:{
      authorization:"Bearer " + getToken()
    }
  })
}