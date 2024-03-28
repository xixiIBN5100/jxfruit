export type CommentParams = {
    content: string,
    score: number,
    goodsId: number
}

export type CommentItem = CommentParams & {
    commentId: string,
    publishTime: string,
    publisherId: number,
    avatarUrl: string,
    publisher: string,
    images: string[]
}