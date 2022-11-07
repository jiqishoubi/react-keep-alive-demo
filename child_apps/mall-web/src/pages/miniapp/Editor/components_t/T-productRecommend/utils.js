import { randomStrKey } from '@/utils/utils'
import { defaultImg } from '@/pages/miniapp/Editor/utils_editor'

export const defaultItem = () => ({
  id: randomStrKey(),
  type: 'productRecommend',
  //常规
  backgroundColor: '#fff',
  //标题
  isHaveTitle: true,
  titleText: '标题',
  titleFontSize: 14,
  titleColor: '#000',
  isHaveTitleDesc: true,
  titleDescText: '标题介绍',
  titleDescColor: '#8c8c8c',
  titleMarginLeftRight: 8,
  //样式
  marginTop: 7,
  marginBottom: 7,
  marginLeftRight: 8,
  borderRadius: 8,
  // item列表
  list: [
    {
      id: randomStrKey(),
      productId: '',
    },
    {
      id: randomStrKey(),
      productId: '',
    },
  ],
  //item样式
  itemBackgroundColor: 'transparent',
  itemBorderRadius: 0,
  isItemHaveBottomBorder: true,
  itemMarginTop: 0,
  itemMarginBottom: 0,
  itemMarginLeftRight: 8,
  itemPaddingTopBottom: 8,
  itemPaddingLeftRight: 0,
  //图片样式
  imgBorderRadius: 5,
})
