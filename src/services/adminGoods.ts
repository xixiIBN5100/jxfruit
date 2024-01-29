import {http} from "@/utils/http";

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
