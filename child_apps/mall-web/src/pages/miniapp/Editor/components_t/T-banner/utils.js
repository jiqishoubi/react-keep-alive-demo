import { randomStrKey } from '@/utils/utils'
import { defaultImg } from '@/pages/miniapp/Editor/utils_editor'

export const defaultItem = () => ({
  id: randomStrKey(),
  type: 'banner',
  //常规
  list: [
    //img
    {
      id: randomStrKey(),
      imgUrl: defaultImg,
      goType: undefined,
      goUrl: '',
    },
  ],
  //样式
  marginTop: 5,
  marginBottom: 5,
  marginLeftRight: 7,
  height: 123,
  borderRadius: 8,
})
