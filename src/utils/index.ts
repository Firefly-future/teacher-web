const TOKEN_KEY = "token"

export const setToken = (token: string) => {
  if(!token) throw new Error("token错误！")
  localStorage.setItem(TOKEN_KEY, token)
}

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY)
}

export const removeToken = () =>{
  return localStorage.removeItem(TOKEN_KEY)
}