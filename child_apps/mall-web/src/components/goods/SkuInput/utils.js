//笛卡尔积运算
export function calcDescartes(array) {
  if (array.length < 2) return array[0] || []
  array = array.filter((arr) => arr.length > 0) // tongzhou 1651153893992
  return [].reduce.call(array, function (col, set) {
    let res = []
    col.forEach(function (c) {
      set.forEach(function (s) {
        let t = [].concat(Array.isArray(c) ? c : [c])
        t.push(s)
        res.push(t)
      })
    })
    return res
  })
}

// 写入你的代码
// 从form.getFiledsValue 中 格式化 sku字段
export function formatSkuFromValues(values = {}) {
  const propertyArr = values?.sku?.propertyArr ?? []
  const skuJsonArr = values?.sku?.skuJsonArr ?? []

  // 计算 1
  const goodsPropertyList = propertyArr.map((property) => {
    return {
      propertyName: property.name,
      propertyValueList: property.children?.join(','),
    }
  })

  // 计算 2
  let skuList = []
  skuJsonArr.forEach((goodsPropertyStr) => {
    let obj = {
      goodsPropertyStr,
    }
    for (let key in values) {
      if (key.indexOf(`${goodsPropertyStr}-`) > -1) {
        const realSkuKey = key.split(`${goodsPropertyStr}-`)[1]
        obj[realSkuKey] = values[key]
      }
    }
    if (JSON.stringify(obj) !== '{}') {
      skuList.push(obj)
    }
  })

  return {
    goodsPropertyList,
    skuList,
  }
}
