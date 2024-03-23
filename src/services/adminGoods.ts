import type { newScale, SkuItem } from '@/types/goods'
import { http } from '@/utils/http'

export const setOnShelf = async (data: any) => {
  return await http({
    url: `/goods/admin/shelf/${data.state}`,
    method: 'POST',
    data: {
      ids: [data.id],
    },
  })
}

export const deleteById = (id: string) => {
  return http({
    url: `/goods/admin/delete/${id}`,
    method: 'DELETE',
  })
}

export const updateGood = (data: any) => {
  return http({
    url: '/goods/admin/update',
    method: 'POST',
    data: data,
  })
}

export const deletImage = (id: number) => {
  return http({
    url: `/goods/admin/delete/image/${id}`,
    method: 'DELETE',
  })
}

export const deleteScale = (id: number) => {
  return http({
    url: `/goods/admin/delete/scale?ids=${id}`,
    method: 'DELETE',
  })
}

export const updateScale = (data: SkuItem) => {
  return http({
    url: '/goods/admin/update/scale',
    method: 'POST',
    data: data,
  })
}

export const addScale = (id: number, data: newScale) => {
  return http({
    url: `/goods/admin/add/scale/${id}`,
    method: 'POST',
    data: data,
  })
}
