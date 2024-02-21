import type { CouponResult, CouponItem, subTypeParams, NewCoupon, NewCouponData} from "@/types/coupon"
import { http } from "@/utils/http"
import type { PageParams } from '@/types/global'
/*
export const getCoupon = (data?: CouponParams) => {
  return http<CouponResult>({
    method: 'GET',
    url: '/coupon/query/self',
    data,
  })
}

*/


export const getDefaultCoupon = () => {
    return http<CouponItem> ({
        url: '/coupon/query/default',
        method: 'GET'
    })
}


export const getCoupon = (data:subTypeParams) => {
    return http<CouponResult>({
        url: '/coupon/query/self',
        method: 'GET',
        data
    })
}

export const getCouponAdmin = (data:subTypeParams) => {
    return http<CouponResult> ({
        url: '/coupon/admin/query',
        method: 'GET',
        data
    })
}

export const getNewCoupon = (data:NewCouponData) =>{
  return http(
    {
      url: '/coupon/add',
      method:'POST',
      data
    })
}

export const deleteCouponById = (id:string) => {
  return http({
       url: `/coupon/admin/delete/${id}`,
       method:'DELETE'
    }
  )
}
