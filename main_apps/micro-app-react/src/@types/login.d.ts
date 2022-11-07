interface MenuType {
  id: number
  menuCode: string
  menuLevel: number
  menuName: string
  menuTitle: string
  menuType: string
  menuUrl: string
  parentCode: string
}

// 处理过的menu
interface MenuItemType extends MenuType {
  name: string
  path?: string
  children?: MenuItemType[]
}
