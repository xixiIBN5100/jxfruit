import type { GoodsItem } from './goods'

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
