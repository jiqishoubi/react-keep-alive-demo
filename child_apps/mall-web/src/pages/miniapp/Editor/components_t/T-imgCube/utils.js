import { randomStrKey } from '@/utils/utils'
import { defaultImg } from '@/pages/miniapp/Editor/utils_editor'

export const defaultItem = () => ({
  id: randomStrKey(),
  type: 'imgCube',
  //常规
  // item列表
  list: [
    {
      id: randomStrKey(),
      imgUrl: defaultImg,
      title: '标题',
      desc: '介绍',
      goType: undefined, // miniapp h5
      goUrl: '',
    },
    {
      id: randomStrKey(),
      imgUrl: defaultImg,
      title: '标题',
      desc: '介绍',
      goType: undefined,
      goUrl: '',
    },
  ],
  // wrap属性
  marginTopBottom: 0,
  marginLeftRight: 0,
  paddingTopBottom: 0,
  paddingLeftRight: 0,
  backgroundColor: 'transparent',
  borderRadius: 0,
  // item属性
  lineNum: 2, //一行有几个
  marginTopItem: 0,
  marginBottomItem: 0,
  marginLeftRightItem: 0,
  borderRadiusItem: 0,
  paddingTopBottomItem: 0,
  paddingLeftRightItem: 0,
  backgroundColorItem: 'transparent',
  //item标题
  haveTitle: false,
  titleFontSize: 12,
  titleTextAlign: 'left',
  //item描述
  isHaveItemDesc: false,
  itemDescHeight: 0,
  descLineNum: 2,
  itemDescLeftRightMargin: 0,
  itemDescColor: '#8c8c8c',
  itemDescFontSize: 11,
  //图片属性
  imgHeight: 90,
  imgPaddingLeftRight: 0,
  borderRadiusImg: 0,
})
