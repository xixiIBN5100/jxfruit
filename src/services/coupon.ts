import type { AdminCouponResult, CouponItem, CouponQueryParams, NewCoupon, NewCouponData} from "@/types/coupon"
import { http } from "@/utils/http"
import type { PageParams } from '@/types/global'
/*
type CouponParams = PageParams & {
  //Tab 项的 id，默认查询全部 Tab 项的第 1 页数据
  subType?: string
}
*/
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
    return http<CouponItem[]> ({
        url: '/coupon/query/default',
        method: 'GET'
    })
}


export const getCoupon = (data:CouponQueryParams) => {
    return http ({
        url: '/coupon/query/self',
        method: 'GET',
        data
    })
}

export const getCouponAdmin = (data:PageParams) => {
    return http<AdminCouponResult> ({
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
