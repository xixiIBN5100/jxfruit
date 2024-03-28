import { createPinia } from 'pinia'
import persist from 'pinia-plugin-persistedstate'

import { useAddressStore } from "./modules/address";
import { useCouponStore } from "./modules/coupon";
import { useMemberStore } from "./modules/member";
import { useRoleStore } from "./modules/role";
// 创建 pinia 实例
const pinia = createPinia()
// 使用持久化存储插件
pinia.use(persist)

// 默认导出，给 main.ts 使用
export default pinia

// 模块统一导出
export { useAddressStore, useCouponStore, useMemberStore, useRoleStore }
