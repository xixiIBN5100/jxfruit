/** 购物车类型 */
export type CartItem = {
    id: number,
    userId: number,
    goodsId: number,
    num: number,
    purchased: boolean,
    selected: boolean,
    totalPrice: number
}

export type CartGoodsItem = CartItem & {
    goodsName: string,
    scaleId: number,
    price: number,
    scale: string,
    category: string,
    thumbNail: string
}