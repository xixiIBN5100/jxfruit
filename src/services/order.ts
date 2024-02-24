import type { OrderItem, OrderPreResult } from '@/types/order'
import type { AddressItem } from '@/types/address'
import { http } from '@/utils/http'

export const getOrderPre = () => {
  return http<OrderPreResult>({
    url: '/cart/preOrder',
    method: 'GET',
  })
}

export const getMemberOrderPreNow = (data: { skuId: string }) => {
  return http<OrderPreResult>({
    url: `/cart/preOrder/now/${data.skuId}`,
    method: 'GET',
  })
}

export const getMemberOrderRepurchaseById = (orderId: number) => {
  return http<OrderPreResult>({
    url: `/order/repurchase/${orderId}`,
    method: 'GET',
  })
}

export const getDefaultAddress = () => {
  return http<AddressItem>({
    url: '/address/default',
    method: 'GET',
  })
}

export const postOrder = (data: any) => {
  return http({
    url: '/order/submit',
    method: 'POST',
    data,
  })
}

export const getMemberOrder = (data: any) => {
  return http({
    url: '/order/query',
    method: 'GET',
    data,
  })
}

export const deleteMemberOrder = (id) => {
  return http({
    url: `/order/delete/${id}`,
    method: 'DELETE',
  })
}

export const getMemberOrderById = (id: number) => {
  return http({
    url: `/order/query/${id}`,
    method: 'GET',
  })
}

export const getMemberOrderCancelById = (id: number, data: { cancelReason: string }) => {
  return http({
    url: `/order/cancel/${id}`,
    method: 'POST',
    data,
  })
}

export const putMemberOrderReceiptById = (id: number) => {
  return http({
    url: `/order/receive/${id}`,
    method: 'PUT',
  })
}

export const submitRefundData = (data) => {
  return http({
    url: '/order/refund',
    method: 'POST',
    data,
  })
}
