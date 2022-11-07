export function tryJSONParse(jsonStr, defaultValue = {}) {
  let jsonObj = defaultValue
  try {
    const o = JSON.parse(jsonStr)
    if (['[object Object]', '[object Array]'].includes(Object.prototype.toString.call(o))) {
      jsonObj = o
    }
  } catch (err) {}
  return jsonObj
}
