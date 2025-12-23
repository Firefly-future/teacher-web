import { create } from "zustand"
import { getUserInfo } from "@/services"

interface State {
  userInfo: null
  getUserInfo: () => void
}

const userStore = create<State>((set) => ({
  userInfo:null,
  getUserInfo:async () =>{
    try {
      const res = await getUserInfo()
      console.log(res.data)
      set(()=>({userInfo:res.data.data}))
    } catch (e) {
      console.log(e)
    }
  }
}))

export default userStore