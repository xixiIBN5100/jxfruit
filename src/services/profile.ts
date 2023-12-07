import { http } from "@/utils/http";
import type { ProfileDetail } from "@/types/user";
export const getProfile = () =>{
    return http<ProfileDetail>({
        url: '/profile',
        method: 'GET'
    })
}

export const updateProfile = (data: ProfileDetail) =>{
    return http({
        url: '/profile/update',
        method: 'POST',
        data
    })
}
