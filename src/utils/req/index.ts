import http from '@/utils/http/index'

const reqHttp = (val: any, url: string, data: any) => {
  return new Promise(async (resolve, reject) => {
    let res = await http[val]
  })
}
