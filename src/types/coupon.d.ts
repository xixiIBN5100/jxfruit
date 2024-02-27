import type { PageResult} from './global'

export type CouponItem = {
    id: number,
    type: string,
    price: number,
    effectiveTime: string,
    effectivePrice: number,
    userId: number,
    isUsed: number,
    expired: number
    username:string
}
export type NewCouponData = {
  type: string
  price: number
  effectivePrice: number
  effectiveTime: string
  username:string
}

//查询优惠券结果类型
export type CouponResult = {
  current: number
  pages: number
  records: CouponItem[]
  size: number
  total:number
}

/* 优惠券-子类 */
export type SubTypeItem = {
  subTypeParams:SubTypeParams
  couponItems: CouponItem[]
}

export type SubTypeParams = {
  subType?: number
  pageSize?: number
  pageNum?:number
}

export type CouponCode= {
  couponCodeId: number
  codeNo: string
  userId: number
  verified: number
  scale: string
  price: number
  goodsName: string
  description:string
}

export type QrCodeVerify = {
  codeNo:string
}
