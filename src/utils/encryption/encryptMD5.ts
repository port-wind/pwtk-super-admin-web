import CryptoJS from './crypto.js'
const encryptMD5 = (text: any) => {
  if (typeof text !== 'string') {
    text = JSON.stringify(text)
  }
  let md5 = CryptoJS.MD5(text).toString()
  return md5
}
export default encryptMD5
