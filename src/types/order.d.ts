import type { AddressItem } from './address'
import type { GoodsItem, SkuItem } from './goods'

export type OrderItem = {
  id: number
  userId: number
  skuId: number
  submitTime: string
  number: number
  addressId: number
  notes: string
  orderState: number
}

export type OrderRefundItem = {
  address: AddressItem,
  nickname: string,
  notes: string,
  orderId: number,
  orderState: number,
  orderTradeNo: string,
  payMoney: number,
  postFee: number,
  skus: SkuItem[],
  submitTime: string,
  totalMoney: Number,
  totalNum: number,
  userId: number
}

export type OrderPreResult = {
  category: string
  goodsName: string
  id: number
  goodsId: number
  imgUrl: string
  num: number
  price: number
  purchased: number
  skuId: number
  selected: number
  totalPrice: number
  userId: number
  scale: string
}

export type OrderPreItem = {
  count: number
  goodsInfo: GoodsItem
}

export type OrderListParams = {
  pageNum: number
  pageSize: number
  orderState: number
  campus?: string
  roomAddress?: string
  date?: string
}
