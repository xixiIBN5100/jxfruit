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

export type NewCoupon = {
  type: string
  price: number
  effectivePrice: number
  effectiveTime: string
}

export type NewCouponData = {
  type: string
  price: number
  effectivePrice: number
  effectiveTime: string
  username:string
}

//管理员查询优惠券结果类型
export type AdminCouponResult = {
  current: number
  pages: number
  records: CouponItem[]
  size: number
  total:number
}







//（优惠券获取数据结果）类型
export type CouponResult = {
  /** id信息 */
  id: string
  /** 活动图片 */
  bannerPicture: string
  /** 活动标题 */
  title: string
  /* 子类列表 */
  subTypes: SubTypeItem[]
}

/* 优惠券-子类 */
export type SubTypeItem = {
  /** 子类id */
  id: string
  /** 子类标题 */
  title: string
  /** 子类对应的优惠券集合（含分页参数） */
  couponItems: PageResult<CouponItem>
}

export type CouponQueryParams = {
  subType?: number
  pageSize?: number
  pageNum?:number
}
