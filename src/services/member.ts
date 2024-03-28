import type { MemberItem} from "@/types/member"
import { http } from "@/utils/http"

export const getMemberInfo = () => {
    return http<MemberItem> ({
        url: '/membership/query',
        method: 'GET'
    })
}
