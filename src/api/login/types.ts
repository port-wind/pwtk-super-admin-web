export interface loginData {
  username: string
  password: string
  salt: string
  cid: string
  imageCode?: string
  googleToken?: string
}
export interface logoutData {}
export interface ILogin {
  expireTime: string
  key: string
  token: string
  manageSiteId: string
}
