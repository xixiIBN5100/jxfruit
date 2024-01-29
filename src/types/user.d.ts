export type LoginParams = {
    username: string,
    password: string
}

export type userItem = {
    id: number,
    nickName: string,
    password: string,
    phoneNum: string,
    isVip: boolean,
    grade: string,
    campus: string,
    username: string,
    avatarUrl: string,
    gender: Gender,
    openId: string
}



export type Gender = '女' | '男'

export type LoginResult = {
    userInfo: userItem,
    token: string
}

export type ProfileDetail = {
    nickName: string,
    gender: Gender,
    stuNo: string,
    username: string,
    campus: string,
    avatarUrl: string,
    token: string
    userId: number
}