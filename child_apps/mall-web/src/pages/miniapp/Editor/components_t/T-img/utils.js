import { randomStrKey } from '@/utils/utils'
import { defaultImg } from '@/pages/miniapp/Editor/utils_editor'

export const defaultItem = () => ({
  id: randomStrKey(),
  type: 'img',
  //常规
  imgUrl: defaultImg,
  goType: undefined, // miniapp h5
  goUrl: '',
  //样式
  height: 0, // 0代表自适应
  marginTop: 0,
  marginBottom: 0,
  marginLeftRight: 0,
  borderRadius: 0,
})
