import type { CouponItem } from '@/types/coupon'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCouponStore = defineStore('coupon', () => {
  const selectedCoupon = ref<CouponItem>()

  const changeSelectedCoupon = (val: CouponItem) => {
    selectedCoupon.value = val
  }

  return {
    selectedCoupon,
    changeSelectedCoupon,
  }
})
