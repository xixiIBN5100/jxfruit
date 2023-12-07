import { http } from "@/utils/http"

export const getPayWxPayMiniPay = (data:{orderId: number}) => {
    return http ({
        url: '/order/pay',
        method: 'POST',
        data: data
    })
}

export const wxPay = (data) => {
    return http ({
        url: `/wechat/pay/unifiedOrder?amount=${data.amount}&orderId=${data.orderId}&userId=${data.userId}&openId=${data.openId}`,
        method: 'POST'
    })
}