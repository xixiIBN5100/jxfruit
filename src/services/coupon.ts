import type { CouponResult, CouponItem, subTypeParams,NewCouponData} from "@/types/coupon"
import { http } from "@/utils/http"
export const getDefaultCoupon = () => {
    return http<CouponItem> ({
        url: '/coupon/query/default',
        method: 'GET'
    })
}


export const getCoupon = (data:subTypeParams) => {
    return http<CouponResult>({
        url: `/coupon/query/self?subType=${data.subType}&pageSize=${data.pageSize}&pageNum=${data.pageNum}`,
        method: 'GET',
    })
}

export const getCouponAdmin = (data:subTypeParams) => {
    return http<CouponResult> ({
        url: `/coupon/admin/query?subType=${data.subType}&pageSize=${data.pageSize}&pageNum=${data.pageNum}`,
        method: 'GET',
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
