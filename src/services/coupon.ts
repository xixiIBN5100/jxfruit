import type { CouponItem} from "@/types/coupon"
import { http } from "@/utils/http"


export const getCoupon = () => {
    return http<CouponItem[]> ({
        url: '/coupon/query/self',
        method: 'GET'
    })
}

export const getCouponAvailable = () => {
    return http<CouponItem[]> ({
        url: '/coupon/query/self/available',
        method: 'GET'
    })
}

