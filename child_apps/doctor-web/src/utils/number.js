/**
 * 常见问题
 */
// // 加法 =====================
// 0.1 + 0.2 = 0.30000000000000004
// 0.7 + 0.1 = 0.7999999999999999
// 0.2 + 0.4 = 0.6000000000000001

// // 减法 =====================
// 1.5 - 1.2 = 0.30000000000000004
// 0.3 - 0.2 = 0.09999999999999998

// // 乘法 =====================
// 19.9 * 100 = 1989.9999999999998
// 0.8 * 3 = 2.4000000000000004
// 35.41 * 100 = 3540.9999999999995

// // 除法 =====================
// 0.3 / 0.1 = 2.9999999999999996
// 0.69 / 10 = 0.06899999999999999

// // 保留2位小数问题 =====================
// (1.335).toFixed(2); // '1.33'
// (6.265).toFixed(2); // '6.26'

/**
 * @description 重写toFixed方法 四舍五入保留2位小数（不够位数，则用0替补）
 * @param {number} num
 * @param {number} [decimalCount=2] 保留小数位数
 * @returns
 */
export function toFixed(num, decimalCount = 2) {
  var result = parseFloat(num)
  if (isNaN(result)) {
    return 0
  }
  result = Math.round(num * 100) / 100
  var s_x = result.toString()
  var pos_decimal = s_x.indexOf('.')
  if (pos_decimal < 0) {
    pos_decimal = s_x.length
    s_x += '.'
  }
  while (s_x.length <= pos_decimal + decimalCount) {
    s_x += '0'
  }
  return s_x
}

/**
 * @description js 计算精度问题
 * @param {string | number | () => (string | number)} o
 * @returns
 */
export function getNumber(o) {
  if (typeof o == 'function') {
    const n = o() // 计算结果
    if (n === undefined) {
      // 函数没有返回值
      throw new Error('getNumber入参是函数的话，需要有返回值')
    } else {
      return getNumber(n)
    }
  } else {
    // 处理
    if (!o) {
      return 0
    }
    const n = Number(o)
    if (isNaN(n)) {
      return 0
    }
    return Math.round(n * 100) / 100
  }
}

export default getNumber
