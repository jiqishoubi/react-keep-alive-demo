import { randomStrKey } from '@/utils/utils'
import { GoldOutlined, PictureOutlined, ColumnHeightOutlined, FontColorsOutlined, AppstoreOutlined, HddOutlined, DatabaseOutlined } from '@ant-design/icons'

//组件列表
export const com_map = {
  //轮播图
  banner: {
    group: 'unit',
    title: '轮播图',
    icon: <GoldOutlined />,
    component: () => {
      return require('./T-banner/index')
    },
    panel: () => {
      return require('./T-banner/panel')
    },
    createItem: () => {
      return require('./T-banner/utils').defaultItem()
    },
  },
  //图片
  img: {
    group: 'unit',
    title: '图片',
    icon: <PictureOutlined />,
    component: () => {
      return require('./T-img/index')
    },
    panel: () => {
      return require('./T-img/panel')
    },
    createItem: () => {
      return require('./T-img/utils').defaultItem()
    },
  },
  //视频
  video: {
    group: 'unit',
    title: '视频',
    icon: <PictureOutlined />,
    component: () => {
      return require('./T-video/index')
    },
    panel: () => {
      return require('./T-video/panel')
    },
    createItem: () => {
      return require('./T-video/utils').defaultItem()
    },
  },
  //间隔
  height: {
    group: 'unit',
    title: '间隔',
    icon: <ColumnHeightOutlined />,
    component: () => {
      return require('./T-height/index')
    },
    panel: () => {
      return require('./T-height/panel')
    },
    createItem: () => {
      return require('./T-height/utils').defaultItem()
    },
  },
  //文字
  text: {
    group: 'unit',
    title: '文字内容',
    icon: <FontColorsOutlined />,
    component: () => {
      return require('./T-text/index')
    },
    panel: () => {
      return require('./T-text/panel')
    },
    createItem: () => {
      return require('./T-text/utils').defaultItem()
    },
  },
  //图片魔方 //可以生成 导航
  imgCube: {
    group: 'unit',
    title: '图片魔方',
    icon: <AppstoreOutlined />,
    component: () => {
      return require('./T-imgCube/index')
    },
    panel: () => {
      return require('./T-imgCube/panel')
    },
    createItem: () => {
      return require('./T-imgCube/utils').defaultItem()
    },
  },
  //视频软文
  videoWord: {
    group: 'unit',
    title: '视频软文',
    icon: <AppstoreOutlined />,
    component: () => {
      return require('./T-videoWord/index')
    },
    panel: () => {
      return require('./T-videoWord/panel')
    },
    createItem: () => {
      return require('./T-videoWord/utils').defaultItem()
    },
  },
  //商品模块
  productRecommend: {
    group: 'product',
    title: '推荐商品',
    icon: <DatabaseOutlined />,
    component: () => {
      return require('./T-productRecommend/index')
    },
    panel: () => {
      return require('./T-productRecommend/panel')
    },
    createItem: () => {
      return require('./T-productRecommend/utils').defaultItem()
    },
  },
  // //商品模块 横着滚动
  // productPanel2: {
  //   group: 'product',
  //   title: '商品列表2',
  //   icon: <DatabaseOutlined />,
  //   component: () => {
  //     return require('./T-productPanel2/index');
  //   },
  //   panel: () => {
  //     return require('./T-productPanel2/panel');
  //   },
  //   createItem: () => {
  //     return require('./T-productPanel2/utils').defaultItem();
  //   },
  // },
}

export const getComponent = (item) => {
  let key = item.type
  return (com_map[key] && com_map[key].component && com_map[key].component().default) || null
}

export const getComponentPanel = (item) => {
  if (item) {
    let key = item.type
    return (com_map[key] && com_map[key].panel && com_map[key].panel().default) || null
  }
  return null
}
