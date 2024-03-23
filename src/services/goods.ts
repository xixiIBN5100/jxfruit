import type { GoodsItem, SkuItem } from '@/types/goods'
import { http } from '@/utils/http'

export const getGoodsById = (id: number) => {
  return http<GoodsItem>({
    url: `/goods/info?id=${id}`,
    method: 'GET',
  })
}

export const getSkuInfo = (goodsId: string) => {
  return http<SkuItem[]>({
    url: `/goods/scale/${goodsId}`,
    method: 'GET',
  })
}

export const searchGoods = (name: string) => {
  return http({
    url: `/goods/search?name=${name}`,
    method: 'GET',
  })
}
