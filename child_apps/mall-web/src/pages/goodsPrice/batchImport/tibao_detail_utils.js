import md5 from 'md5'

/**
 * 这个文件 与 小程序中的tibao-detail-utils文件 同步
 */

export const itemTypeKeyMap = {
  input: '_s',
  radio: '_s',
  upload: '_s',
  datepicker: '_dt', //2020-10-10
  rangepicker: '_s', //startDate endDate
  location: '_s', //position positionTime latitude longitude
  count: '_i',
  uploadfile: '_s',
  //子字段
  startDate: '_dt',
  endDate: '_dt',
  position: '_s',
  positionTime: '_dt',
  latitude: '_s',
  longitude: '_s',
  //打卡
  clockInId: '_s', //两个id逗号分隔
  clockInTime: '_i', //时间间隔 s
}

//处理 获取规格
export const getSkuObj = (s) => {
  // selectedSkuJsonStr 或者 selectedSkuJson   返回 {specsId,specsValue}
  let specificationObj = {}
  if (Object.prototype.toString.call(s) === '[object Object]') {
    specificationObj = {
      ...s,
    }
  } else if (s !== 'null') {
    try {
      specificationObj = JSON.parse(s)
    } catch (e) {}
  }
  let property = specificationObj && specificationObj.skuProperty
  if (property) {
    let specsValue = {}
    let md5Key = md5(property).substring(8, 24)
    let key = `specs_${md5Key}_s`
    specsValue.specsId = key
    specsValue.specsValue = property
    return specsValue
  }
}

//处理提交数据
export const dealPostData = (postData) => {
  let reportData = {} // key value 数据
  let finishInfoArr = []
  if (postData.finishInfo) {
    try {
      finishInfoArr = JSON.parse(postData.finishInfo)
    } catch (e) {}
  }
  if (Array.isArray(finishInfoArr)) {
    finishInfoArr.forEach((item) => {
      if (item.id !== undefined) {
        //因为有可能是0
        //拆解组件里的字段 //特殊处理
        //一、定位
        if (item.name == 'location') {
          let stamp = item.id.split('_')[1]
          let valueObj = {}
          if (item.valueTemp) {
            try {
              valueObj = JSON.parse(item.valueTemp)
            } catch (e) {}
          }
          for (let key in valueObj) {
            let keyTemp = `${item.name}-${key}_${stamp}${itemTypeKeyMap[key] || '_s'}`
            reportData[keyTemp] = valueObj[key] || ''
          }
          //如果是 打卡组件
          //是结束打卡组件
          if (item.clockInProp && item.clockInProp == '2' && valueObj.positionTime) {
            let startId = item.startClockIn
            //记录两个 打卡id
            reportData[`clockInId_${stamp}${itemTypeKeyMap['clockInId']}`] = startId + ',' + item.id
            //记录打卡时间段
            let startIdStamp = startId.split('_')[1]
            let startDate = reportData[`location-positionTime_${startIdStamp}_dt`]
            let startStamp = new Date(startDate).getTime()
            let endStamp = new Date(valueObj.positionTime).getTime()
            let timeRange = endStamp >= startStamp ? Math.round((endStamp - startStamp) / 1000) : 0
            reportData[`clockInTime_${stamp}${itemTypeKeyMap['clockInTime']}`] = timeRange
          }
        }
        //二、日期区间
        else if (item.name == 'rangepicker') {
          let stamp = item.id.split('_')[1]
          let dateRange = (item.valueTemp && item.valueTemp.indexOf(',') > -1 && item.valueTemp.split(',')) || []
          if (dateRange[0]) reportData[`rangepicker-startDate_${stamp}_s`] = dateRange[0] || ''
          if (dateRange[1]) reportData[`rangepicker-endDate_${stamp}_s`] = dateRange[1] || ''
        } else {
          reportData[item.id] = item.valueTemp || ''
        }
      }
    })
  }

  console.log('最终提交的key value对象', reportData)

  let resultPostData = {
    ...postData,
    formValueJson: JSON.stringify(reportData),
  }

  //处理规格
  if (resultPostData.specification) {
    let skuObj = getSkuObj(resultPostData.specification)
    let specsValueObj = {}
    specsValueObj[skuObj.specsId] = skuObj.specsValue
    resultPostData.specsValueJson = JSON.stringify(specsValueObj)
  }

  console.log('最终提交的postData', resultPostData)

  return resultPostData
}

/**
 * 回显展示
 */
//处理初始的customFormList，把formValueJson放进去
export const preDealcustomFormList = (arr, formValueJson) => {
  let valueObj = {}
  if (formValueJson) {
    try {
      valueObj = JSON.parse(formValueJson || '{}')
    } catch (e) {}
  }

  //方法
  const getValueFromValueObj = (keyStr, idKey) => {
    let v = ''
    for (let key in valueObj) {
      const parentStamp = idKey && idKey.split('_')[1]
      const firstNameKey = key.split('_')[0]
      const childStamp = key.split('_')[1]
      if (firstNameKey == keyStr && childStamp == parentStamp) {
        v = valueObj[key] || ''
        break
      }
    }
    return v
  }

  //处理customFormList
  let arr2 = JSON.parse(JSON.stringify(arr))
  arr2.forEach((item, index) => {
    let idKey = item.id
    let nameType = item.name //location input
    //定位
    if (nameType == 'location') {
      let position = getValueFromValueObj('location-position', idKey)
      let positionTime = getValueFromValueObj('location-positionTime', idKey)
      let latitude = getValueFromValueObj('location-latitude', idKey)
      let longitude = getValueFromValueObj('location-longitude', idKey)
      if (position || positionTime || latitude || longitude) {
        let valueTempObj = {
          position,
          positionTime,
          latitude,
          longitude,
        }
        item.valueTemp = JSON.stringify(valueTempObj)
      }
    }
    //时间区间
    else if (nameType == 'rangepicker') {
      let startDate = getValueFromValueObj('rangepicker-startDate', idKey)
      let endDate = getValueFromValueObj('rangepicker-endDate', idKey)
      if (startDate || endDate) {
        item.valueTemp = startDate + ',' + endDate
      }
    } else {
      item.valueTemp = valueObj[idKey] || ''
    }
  })

  return arr2
}
