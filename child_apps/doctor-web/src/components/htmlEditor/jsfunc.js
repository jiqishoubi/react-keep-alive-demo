// 根据属性获取dom
export function getElementByAttr(tag, attr, value) {
  var aElements = document.getElementsByTagName(tag)
  var aEle = []
  for (var i = 0; i < aElements.length; i++) {
    var v = aElements[i].getAttribute(attr)
    if (v && v == value) {
      aEle.push(aElements[i])
    }
  }
  return aEle
}
