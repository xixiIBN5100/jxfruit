import type { ProfileDetail } from '@/types/user'
import { defineStore } from 'pinia'
import { ref } from 'vue'

// 定义 Store
export const useRoleStore = defineStore(
  'role',
  () => {
    // 角色信息
    const role = ref<number>()

    // 保存角色信息，登录时使用
    const setRole = (val: number) => {
      role.value = val
    }

    // 清理角色信息，退出时使用
    const clearRole = () => {
      role.value = undefined
    }

    // 记得 return
    return {
      role,
      setRole,
      clearRole,
    }
  },
  {
    // 网页端配置
    // persist: true,
    // 小程序端配置
    persist: {
      storage: {
        getItem(key) {
          return uni.getStorageSync(key)
        },
        setItem(key, value) {
          uni.setStorageSync(key, value)
        },
      },
    },
  },
)