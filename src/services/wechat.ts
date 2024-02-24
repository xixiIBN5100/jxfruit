import { http } from "@/utils/http";
// import type { ProfileDetail } from "@/types/user";
export const getQrCode = () =>{
    return http({
        url: '/wechat/qrCode',
        method: 'GET'
    })
}
export const getShortLink = (data) => {
    return http({
        url: '/wechat/shortLink',
        method: 'POST',
        data
    })
}

