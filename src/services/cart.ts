import type { CartItem } from "@/types/cart"
import { http } from "@/utils/http"
export const deleteMemberCart = (id: number) => {
    return http({
      url: `/cart/delete?id=${id}`,
      method: 'DELETE'
    })
}
export const getMemberCart = () => {
    return http({
      url: '/cart/query',
      method: 'GET'
    })
}
export const postMemberCart = (data: any) => {
    return http({
      url: '/cart/add',
      method: 'POST',
      data
    })
}
export const putMemberCartBySkuId = (id: number, count: number) => {
    return http({
      url: `/cart/update?id=${id}&count=${count}`,
      method: 'POST'
    })
}
export const putMemberCartSelected = (id: number) => {
    return http({
      url: `/cart/select?id=${id}`,
      method: 'POST'
    })
}

export const putMemberCartAllSelected = (selected: boolean) => {
  return http({
    url: `/cart/select/all?selected=${selected}`,
    method: 'POST'
  })
}