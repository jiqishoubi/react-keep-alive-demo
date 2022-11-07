import { randomStrKey } from '@/utils/utils'
import { defaultImg } from '@/pages/miniapp/Editor/utils_editor'

const itemProps = {
  imgUrl: defaultImg,
  title: '商品名称',
  price: '11.00',
  isInternation: false,
}

export const defaultItem = () => ({
  id: randomStrKey(),
  type: 'productPanel2',
  //常规
  backgroundColor: 'rgb(110 144 193)',
  //标题
  isHaveTitle: true,
  titleText: '标题',
  titleFontSize: 14,
  titleColor: '#fff',
  isHaveTitleDesc: true,
  titleDescText: '标题介绍',
  titleDescColor: '#fff',
  //样式
  marginTop: 7,
  marginBottom: 7,
  marginLeftRight: 0,
  borderRadius: 0,
  // item列表
  list: [
    {
      id: randomStrKey(),
      goType: undefined,
      goUrl: '',
      ...itemProps,
    },
    {
      id: randomStrKey(),
      goType: undefined,
      goUrl: '',
      ...itemProps,
    },
    {
      id: randomStrKey(),
      goType: undefined,
      goUrl: '',
      ...itemProps,
    },
  ],
})
