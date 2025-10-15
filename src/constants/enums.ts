export const EStorageType = {
  S3: 's3' as const,
  R2: 'r2' as const
} as const

export const Environment = {
  DEV: 'dev' as const,
  TEST: 'test' as const,
  UAT: 'uat' as const,
  PROD: 'prod' as const,
  DEVELOPMENT: 'development' as const
} as const

export const FileType = {
  IMG: 'img' as const,
  ICO: 'ico' as const,
  VIDEO: 'video' as const,
  FILE: 'file' as const
} as const
