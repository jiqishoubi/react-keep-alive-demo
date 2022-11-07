import React, { useState, useEffect } from 'react'
import { Radio } from 'antd'
import requestw from '@/utils/requestw'

/**
 *
 * @param {object} props
 * @param {string} props.api
 * @param {object} [props.formData={}] 额外参数
 * @param {string} props.valueKey
 * @param {string} props.textKey
 * @param {string} props.placeholder
 * @param {object} [props.style]
 * @param {fucntion} [props.dealResFunc]
 * @param {function} [props.disabedFunc]
 * @param {function} [props.isHideFunc]
 */
const Index = (props) => {
  const {
    value,
    //
    api,
    formData = {},
    //
    valueKey,
    textKey,
    //
    style = {},
    dealResFunc,
    disabedFunc,
    isHideFunc,
  } = props

  const [optionArr, setOptionArr] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getOptions()
  }, [])

  const getOptions = async () => {
    if (!api || loading || optionArr.length) return
    setLoading(true)
    const res = await requestw({
      url: api,
      data: {
        ...formData,
      },
    })
    setLoading(false)
    let arr = []
    if (dealResFunc) {
      arr = dealResFunc(res)
    } else {
      if (res && res.code == 200 && res.data && res.data.length) {
        arr = res.data
      }
    }
    setOptionArr(arr)
  }

  const onComponentChange = (code) => {
    if (props.onChange) props.onChange(code)
  }

  return (
    <Radio.Group value={value} onChange={onComponentChange} style={style}>
      {optionArr &&
        Array.isArray(optionArr) &&
        optionArr.map((obj, index) => {
          let isHide = false
          if (isHideFunc) {
            isHide = isHideFunc(obj, index)
          }
          if (isHide) {
            return null
          }

          let isDisabled = false
          if (disabedFunc) {
            isDisabled = disabedFunc(obj, index)
          }
          return (
            <Radio key={index} value={obj[valueKey]} disabled={isDisabled}>
              {obj[textKey]}
            </Radio>
          )
        })}
    </Radio.Group>
  )
}

export default Index
