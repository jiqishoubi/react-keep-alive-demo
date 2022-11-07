// 规格
export interface IProperty {
  name: string // 规格名 颜色
  children: string[] // 规格值 ['白色', '蓝色']
}

export interface ISku {
  goodsPropertyStr: string
  [prop: string]: any
}

export interface IValue {
  propertyArr: IProperty[]
  skuJsonArr: string[]
}

// InputModal
export interface IInputModal {
  open: () => Promise<string>
}
