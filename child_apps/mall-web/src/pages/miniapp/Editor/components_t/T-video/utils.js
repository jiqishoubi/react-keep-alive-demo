import { randomStrKey } from '@/utils/utils'

export const defaultItem = () => ({
  id: randomStrKey(),
  type: 'video',
  //常规
  videoUrl: '',
  //样式
  height: 0, // 0代表自适应
  marginTop: 0,
  marginBottom: 0,
  marginLeftRight: 0,
})
