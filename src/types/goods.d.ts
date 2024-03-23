export type GoodsItem = {
  id: number
  goodsName: string
  price: number
  discount: string
  productRegion: string
  productTime: string
  submitTime: string
  thumbNail: string
  category: string
  description: string
  note: string
  onShelf: number
}

export type GoodsResult = {
  goodsInfo: GoodsItem
  images: GoodsImageItem[]
  skus: SkuItem[]
}

export type SkuItem = {
  id: number
  scale: string
  price: number
  goodsId: number
  totalInventory: number
  nowInventory: number
  soldAmount: number
}
export type GoodsImageItem = {
  id: number
  imgUrl: string
  goodsId: number
}

export type newGood = {
  goodsName: string
  price: number
  discount: string
  productRegion?: string
  productTime?: string
  thumbNail: string
  category: string
  description?: string
  notes?: string
}
