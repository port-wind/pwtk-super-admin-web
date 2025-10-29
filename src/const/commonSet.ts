export const TableHeaderColors: string[] = ['#D6EEFF', '#E0F0F5', '#E6E0FF', '#FFF0D6', '#FFE0D6', '#FFD6D6', '#FFE6F0']
export const filterColor = {
  'thumb-up':
    'brightness(0) saturate(100%) invert(57%) sepia(42%) saturate(4671%) hue-rotate(191deg) brightness(103%) contrast(101%)',
  'thumb-down':
    'brightness(0) saturate(100%) invert(0%) sepia(9%) saturate(4%) hue-rotate(279deg) brightness(101%) contrast(101%)',
  'star-filled':
    'brightness(0) saturate(100%) invert(78%) sepia(68%) saturate(510%) hue-rotate(345deg) brightness(99%) contrast(104%)',
  default:
    'brightness(0) saturate(100%) invert(99%) sepia(90%) saturate(4%) hue-rotate(120deg) brightness(106%) contrast(70%)'
}

export const GameTypeMap: { [key: string]: string } = {
  a6: 'aSix',
  hk6: 'hkSix',
  tw6: 'twSix',
  sg6: 'sgSix',
  xa6: 'xaSix',
  kl8: 'kl8'
}

export const UPLOAD_FILE_LIMIT = 20 // 20M
