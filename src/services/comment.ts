import type { CommentItem } from "@/types/comment";
import { http } from "@/utils/http";
export const getSelfComments = (params) => {
    return http ({
        url: `/comment/query/self?pageNum=${params.pageNum}&pageSize=${params.pageSize}`,
        method: 'GET'
    })
}

export const getCommentsByGoodsId = (params, goodsId: number) => {
    return http ({
        url: `/comment/query?pageNum=${params.pageNum}&pageSize=${params.pageSize}&goodsId=${goodsId}`,
        method: 'GET'
    })
}

export const addComment = (data: CommentItem, orderId: number) => {
    return http ({
        url: `/comment/add/${orderId}`,
        method: 'POST',
        data
    })
}