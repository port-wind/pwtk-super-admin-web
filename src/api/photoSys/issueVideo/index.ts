import http from '@/utils/http/index'
import type { IResponse, IBaseResponse } from '@/api/type'
import type {
  IIssueVideo,
  IIssueVideoListParams,
  IIssueVideoListResponse,
  IIssueVideoCreateParams,
  IUploadResponse
} from './type'

const prefix = 'super'

// Get issue video list
export const getIssueVideoList = (data: IIssueVideoListParams): Promise<IResponse<IIssueVideoListResponse>> => {
  console.log(data)

  // return new Promise((resolve) => {
  //   resolve({
  //     success: true,
  //     errCode: '0',
  //     errMessage: 'success',
  //     data: {
  //       total: '830',
  //       list: [
  //         {
  //           id: '20252292',
  //           gameType: 2032,
  //           year: 2025,
  //           issue: 2025229,
  //           videoTitle: '2025229期开奖视频',
  //           videoPath: 'devmedia/video/lottery/video/25/08/18/8489819dc8644afab6e785e1af03e3f6.mp4',
  //           videoSize: '53.59 MB',
  //           uploadVideoTime: 1755450809000
  //         },
  //         {
  //           id: '20252282',
  //           gameType: 2032,
  //           year: 2025,
  //           issue: 2025228,
  //           videoTitle: '2025228期开奖视频',
  //           videoPath: 'devmedia/video/lottery/video/25/08/16/60e361bdebfe4e8e8d6d859fbf7ccde8.mp4',
  //           videoSize: '58.51 MB',
  //           uploadVideoTime: 1755363095000
  //         },
  //         {
  //           id: '20252272',
  //           gameType: 2032,
  //           year: 2025,
  //           issue: 2025227,
  //           videoTitle: '2025227期开奖视频',
  //           videoPath: 'devmedia/video/lottery/video/25/08/16/ad079fcaeaff40b585bf43769a260dce.mp4',
  //           videoSize: '51.28 MB',
  //           uploadVideoTime: 1755279208000
  //         },
  //         {
  //           id: '20252262',
  //           gameType: 2032,
  //           year: 2025,
  //           issue: 2025226,
  //           videoTitle: '2025226期开奖视频',
  //           videoPath: 'devmedia/video/lottery/video/25/08/15/bd43ddb11d484588802f445e54425ad7.mp4',
  //           videoSize: '53.06 MB',
  //           uploadVideoTime: 1755192454000,
  //           videoPicture: ''
  //         },
  //         {
  //           id: '20252252',
  //           gameType: 2032,
  //           year: 2025,
  //           issue: 2025225,
  //           videoTitle: '2025225期开奖视频',
  //           videoPath: 'devmedia/video/lottery/video/25/08/14/de662fe9695143188307b968b6d64ad7.mp4',
  //           videoSize: '56.79 MB',
  //           uploadVideoTime: 1755136794000
  //         },
  //         {
  //           id: '20252242',
  //           gameType: 2032,
  //           year: 2025,
  //           issue: 2025224,
  //           videoTitle: '2025224期开奖视频',
  //           videoPath: 'devmedia/video/lottery/video/25/08/13/79bf7e9561b948548dc5f271d8d5c833.mp4',
  //           videoSize: '53.67 MB',
  //           uploadVideoTime: 1755076956000,
  //           videoPicture: ''
  //         },
  //         {
  //           id: '20252232',
  //           gameType: 2032,
  //           year: 2025,
  //           issue: 2025223,
  //           videoTitle: '2025223期开奖视频',
  //           videoPath: 'devmedia/video/lottery/video/25/08/13/fa049e67605042dc946df12a3346b22a.mp4',
  //           videoSize: '54.56 MB',
  //           uploadVideoTime: 1755047864000
  //         },
  //         {
  //           id: '20252222',
  //           gameType: 2032,
  //           year: 2025,
  //           issue: 2025222,
  //           videoTitle: '2025222期开奖视频',
  //           videoPath: 'devmedia/video/lottery/video/25/08/13/1833cc75d5524bf7ab13044946059120.mp4',
  //           videoSize: '50.45 MB',
  //           uploadVideoTime: 1755047845000
  //         },
  //         {
  //           id: '20252212',
  //           gameType: 2032,
  //           year: 2025,
  //           issue: 2025221,
  //           videoTitle: '2025221期开奖视频',
  //           videoPath: 'devmedia/video/lottery/video/25/08/10/d943d123c0fc46d19e230c002a1dab28.mp4',
  //           videoSize: '58.89 MB',
  //           uploadVideoTime: 1754764643000
  //         },
  //         {
  //           id: '20252202',
  //           gameType: 2032,
  //           year: 2025,
  //           issue: 2025220,
  //           videoTitle: '2025220期开奖视频',
  //           videoPath: 'devmedia/video/lottery/video/25/08/09/9bd1efa3a85a4f83948c247a037f4624.mp4',
  //           videoSize: '57.60 MB',
  //           uploadVideoTime: 1754673802000
  //         },
  //         {
  //           id: '20252192',
  //           gameType: 2032,
  //           year: 2025,
  //           issue: 2025219,
  //           videoTitle: '2025219期开奖视频',
  //           videoPath: 'devmedia/video/lottery/video/25/08/07/66c025cf7902401aa42f962bdda12be5.mp4',
  //           videoSize: '56.52 MB',
  //           uploadVideoTime: 1754585662000
  //         },
  //         {
  //           id: '20252182',
  //           gameType: 2032,
  //           year: 2025,
  //           issue: 2025218,
  //           videoTitle: '2025218期开奖视频',
  //           videoPath: 'devmedia/video/lottery/video/25/08/07/ebaf27c6f8c24646a23a2c9d29436de0.mp4',
  //           videoSize: '53.33 MB',
  //           uploadVideoTime: 1754500640000
  //         },
  //         {
  //           id: '20252172',
  //           gameType: 2032,
  //           year: 2025,
  //           issue: 2025217,
  //           videoTitle: '2025217期开奖视频',
  //           videoPath: 'devmedia/video/lottery/video/25/08/06/8a3110f461f446569da6e0331f6a7dfd.mp4',
  //           videoSize: '50.38 MB',
  //           uploadVideoTime: 1754474107000
  //         },
  //         {
  //           id: '20252162',
  //           gameType: 2032,
  //           year: 2025,
  //           issue: 2025216,
  //           videoTitle: '2025216期开奖视频',
  //           videoPath: 'devmedia/video/lottery/video/25/08/06/19aba986bfcf439aa4241374c258ad35.mp4',
  //           videoSize: '49.71 MB',
  //           uploadVideoTime: 1754474127000
  //         },
  //         {
  //           id: '20252152',
  //           gameType: 2032,
  //           year: 2025,
  //           issue: 2025215,
  //           videoTitle: '2025215期开奖视频',
  //           videoPath: 'devmedia/video/lottery/video/25/08/06/febaee6f11cd4031974062bc98999eeb.mp4',
  //           videoSize: '50.44 MB',
  //           uploadVideoTime: 1754474147000
  //         }
  //       ]
  //     }
  //   })
  // })
  return http.post(`webgw/${prefix}/issueVideo/list`, data)
}

// Get issue video detail
export const getIssueVideoDetail = (data: { id: string }): Promise<IBaseResponse<IIssueVideo>> => {
  return http.post(`webgw/${prefix}/issueVideo/detail`, data)
}

// Check if issue video exists
export const checkIssueVideoExist = (data: {
  gameType: string
  year: string
  issue: string
}): Promise<IBaseResponse<boolean>> => {
  return http.post(`webgw/${prefix}/issueVideo/exist`, data)
}

// Create or update issue video
export const createIssueVideo = (data: IIssueVideoCreateParams): Promise<IBaseResponse<any>> => {
  const { id } = data
  if (id) {
    return http.post(`webgw/${prefix}/issueVideo/update`, data)
  }
  return http.post(`webgw/${prefix}/issueVideo/insert`, data)
}

// Upload file (video or image)
export const uploadUrlToGetPath = (data: {
  videoUrl: string
  uploadType: string
}): Promise<IBaseResponse<IUploadResponse>> => {
  // Using the specific upload endpoint mentioned in the API doc
  return http.post(`webgw/${prefix}/issueVideo/upload`, data)
}
