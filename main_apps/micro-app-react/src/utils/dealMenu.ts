import _ from 'lodash'

export default function dealMenu(arr: MenuType[]): {
  allMenu: MenuItemType[]
  menuTree: MenuItemType[]
  rightsArr: MenuItemType[]
} {
  const allMenu = _.cloneDeep(arr) as MenuItemType[]

  const itemMap = {}
  const childrenMap = {}
  const rootArr: MenuItemType[] = []
  const rightsArr: MenuItemType[] = [] // 权限级别

  allMenu.forEach((item: MenuItemType) => {
    // 修改item
    item.name = item.menuTitle || ''
    item.path = item.menuUrl || ''

    if (item.path?.indexOf('-') > -1 && item.path?.indexOf('/') == -1) {
      // 权限
      // 这里是权限 每个项目判断不一样
      rightsArr.push(item)
    } else {
      // 菜单
      itemMap[item.menuCode] = item
      if (!childrenMap[item.menuCode]) childrenMap[item.menuCode] = []
      item.children = childrenMap[item.menuCode]

      if (!item.parentCode && item.menuLevel === 0) {
        // 一级目录
        rootArr.push(item)
      } else {
        // 找到它的父级的children
        if (!childrenMap[item.parentCode]) childrenMap[item.parentCode] = []
        childrenMap[item.parentCode].push(item)
      }
    }
  })

  return {
    allMenu,
    menuTree: rootArr,
    rightsArr,
  }
}

/**
 * 获取第一个菜单
 */
export const findFirstMenuUrl = ({ list = [], childrenkey = 'children', urlKey = 'menuUrl' }) => {
  let url = ''
  const getFirst = (arr: any[]) => {
    if (arr && arr[0]) {
      if (arr[0][childrenkey] && arr[0][childrenkey].length > 0) {
        getFirst(arr[0][childrenkey])
      } else {
        url = arr[0][urlKey]
      }
    }
  }
  getFirst(list)
  return url
}
