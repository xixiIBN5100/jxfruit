/**  添加地址：请求参数 */
export type AddressParams = {
    receiverName: string,
    receiverPhone: string,
    campus: string,
    roomAddress: string,
    isDefault: number
}
/** 收货地址项 */
export type AddressItem = AddressParams & {
    id: number,
    userId: number
}

export type UpdateAddressParams = AddressParams & {id: number}