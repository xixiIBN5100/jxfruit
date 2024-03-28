import type { CouponResult, CouponItem ,SubTypeParams,NewCouponData,CouponCode, QrCodeVerify} from "@/types/coupon"
import type { PageParams } from "@/types/global"
import { http } from "@/utils/http"
export const getDefaultCoupon = () => {
    return http<CouponItem> ({
        url: '/coupon/query/default',
        method: 'GET'
    })
}


export const getCoupon = (data:SubTypeParams) => {
    return http<CouponResult>({
        url: `/coupon/query/self?subType=${data.subType}&pageSize=${data.pageSize}&pageNum=${data.pageNum}`,
        method: 'GET',
    })
}

export const getCouponAdmin = (data:SubTypeParams) => {
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

export const queryCouponCodeList = (data: PageParams) => {
  return http<CouponCode[]>({
    url: `/coupon/qrCode?pageSize=${data.pageSize}&pageNum=${data.pageNum}`,
    method: 'GET',
   })
}

export const qrCodeVerify = (data:QrCodeVerify) => {
  return http({
         url: '/coupon/qrCode/verify',
         method: 'POST',
         data
       })
}
