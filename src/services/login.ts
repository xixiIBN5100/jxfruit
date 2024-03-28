import type { LoginResult, LoginParams } from "@/types/user"
import { http } from "@/utils/http"

/**
 * 传统登录 用户名 密码
 * @param data
 */
export const loginByPwd = (data: LoginParams, role: number) => {
    return http<LoginResult>({
        method: 'POST',
        url: `/login/${role}`,
        data
    })
}

/**
 * 微信一键登录
 */
export const loginByWechat = (data: {code: string}) => {
    return http<LoginResult> ({
        method: 'POST',
        url: '/login/wechat',
        data
    })
}

/**
 * 微信一键注册
 */
export const registerByWechat = (data: {code: string}) => {
    return http<LoginResult> ({
        method: 'POST',
        url: '/register/wechat',
        data
    })
}