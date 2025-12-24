import { create } from "zustand"
import { getUserInfo,getUserMenuList } from "@/services"
import type { UserInfo,MenuListItem } from "@/services/types"
interface State {
  userInfo: UserInfo | null
  menuList:MenuListItem[]
  getUserInfo: () => void
}

const userStore = create<State>((set) => ({
  userInfo:null,
  menuList:[],
  getUserInfo:async () =>{
    try {
      const res = await getUserInfo()
      console.log(res.data)
      set(()=>({userInfo:res.data}))
      const menuRes = await getUserMenuList()
      set(()=>({menuList:menuRes.data.data.list}))
    } catch (e) {
      console.log(e)
    }
  }
}))

export default userStore