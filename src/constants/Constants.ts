export const API_CODE = {
  SUCCESS: 200, // 成功
  EXPIRED_CAPTCHA: 1005, // 验证码过期
} as const

export type API_CODE = typeof API_CODE[keyof typeof API_CODE]
