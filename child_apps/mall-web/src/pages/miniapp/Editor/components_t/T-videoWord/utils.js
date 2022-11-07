import { randomStrKey } from '@/utils/utils'
import { defaultImg } from '@/pages/miniapp/Editor/utils_editor'

const itemProps = {
  itemType: 'img', //img video
  itemUrl: defaultImg,
  title: '标题',
  desc: '介绍',
  goType: undefined,
  goUrl: '',
  details: null, //detailList []
}

export const defaultItem = () => ({
  id: randomStrKey(),
  type: 'videoWord',
  //wrap
  lineNum: 2, //一行有几个
  marginTop: 4,
  marginBottom: 0,
  marginLeftRight: 6,
  paddingTopBottom: 0,
  paddingLeftRight: 0,
  backgroundColor: 'transparent',
  borderRadius: 0,
  // item属性
  itemHeight: 130,
  itemDescHeight: 33, //介绍高度
  // item列表
  list: [
    {
      id: randomStrKey(),
      ...itemProps,
    },
    {
      id: randomStrKey(),
      ...itemProps,
    },
  ],
})
