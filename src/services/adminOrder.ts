import { http } from '@/utils/http'

export const queryOrders = async (params: any) => {
  return await http({
    url: '/order/admin/query',
    method: 'GET',
    data: params,
  })
}

export const queryRefundOrders = async (params: any) => {
  return await http({
    url: '/order/refund/query',
    method: 'GET',
    data: params,
  })
}

export const deliverOrder = async (data: string[]) => {
  return await http({
    url: '/order/deliver',
    method: 'POST',
    data: {
      ids: data,
    },
  })
}

export const refundOrder = async (refundId: Number) => {
  return await http({
    url: '/wechat/refund/approve',
    method: 'POST',
    data: {
      refundId: refundId,
    },
  })
}

export const sendOrderSMS = async (ids: string[]) => {
  const numberIds: number[] = ids.map(Number)
  return await http({
    url: '/sms/send/batch',
    method: 'POST',
    data: {
      ids: [0],
    },
  })
}
