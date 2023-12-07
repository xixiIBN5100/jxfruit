import type { AddressItem, AddressParams } from '@/types/address'
import { http } from '@/utils/http'

export const postAddress = (data: AddressParams) => {
    return http({
        method: 'POST',
        url: '/address/add',
        data
    })
}

export const getAddress = () => {
    return http<AddressItem[]>({
        method: 'GET',
        url: '/address/query/info'
    })
}

export const getAddressById = (id: number) => {
    return http<AddressItem> ({
        method: 'GET',
        url: `/address/query/${id}`
    })
}

export const deleteAddressById = (id: number) => {
    return http({
        method: 'DELETE',
        url: `/address/delete/${id}`,
    })
}

export const updateAddressById = (data: AddressItem) => {
    return http({
        method: 'POST',
        url: '/address/update',
        data
    })
}