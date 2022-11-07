import React, { useEffect, useState } from 'react'
import { Select, Row, Col } from 'antd'
import requestw from '@/utils/requestw'

/**
 * props
 *
 * value  // Array<string>
 * onChange
 *
 * api
 * postData
 * textKey
 * valueKey
 * items [
 *  {
 *    api, //非必传 如果外面有api就取外面的
 *    getPostDataFunc //从前一个选中对象中获取data
 *    textKey, //非必传 如果外面有textKey就取外面的
 *    valueKey, //非必传 如果外面有valueKey就取外面的
 *    placeholder
 *    dealResFunc  //需要return 一个数组
 *  }
 * ]
 */

const { Option } = Select

function useLoading() {
  const [loadingArr, setLoadingArr] = useState([])
  const getLoading = (index) => {
    return loadingArr[index]
  }
  const setLoading = (index, value) => {
    let newLoadingArr = [...loadingArr]
    newLoadingArr[index] = value
    setLoadingArr(newLoadingArr)
  }
  return {
    getLoading,
    setLoading,
  }
}

const Index = (props) => {
  const { value, api, textKey, valueKey, postData, items, dealResFunc } = props
  const valueTemp = (value && Array.isArray(value) && value) || Array(items.length).fill(undefined)

  //state
  const [firstOptionArr, setFirstOptionArr] = useState([]) //初始 一级select
  const [loadingFirst, setLoadingFirst] = useState(false)
  //其它下级的options
  const [optionArr, setOptionArr] = useState([])
  const { getLoading, setLoading } = useLoading()

  useEffect(() => {
    getFirtData()
  }, [])

  useEffect(() => {
    renderBack()
  }, [valueTemp])

  //回显获取option
  const renderBack = () => {
    items.forEach(async (itemObj, i) => {
      const v = valueTemp[i]
      const valueKeyTemp = valueKey || itemObj.valueKey
      if (v) {
        await getNextData({ [valueKeyTemp]: v }, i)
      }
    })
  }

  //获取第一级的数据
  const getFirtData = () => {
    const firtItem = (items && items[0] && items[0]) || {}
    setLoadingFirst(true)
    let postData = {}
    if (firtItem.getPostDataFunc) {
      postData = firtItem.getPostDataFunc()
    }
    requestw({
      url: api || firtItem.api || '',
      data: postData,
      isNeedCheckResponse: true,
    }).then((data) => {
      setLoadingFirst(false)
      let arr = []
      if (dealResFunc || firtItem.dealResFunc) {
        arr = (dealResFunc || firtItem.dealResFunc)(data)
      } else {
        arr = data ?? []
      }
      setFirstOptionArr(arr)
    })
  }

  //获取下一级数据
  const getNextData = (selectedObj, index) => {
    //当前操作选中的obj和item的index
    const nextIndex = index + 1
    if (items[nextIndex]) {
      const nextItem = items[nextIndex]
      let postData = {}
      if (nextItem.getPostDataFunc) {
        postData = nextItem.getPostDataFunc(selectedObj)
      }
      setLoading(nextIndex, true)
      requestw({
        url: api || nextItem.api || '',
        data: postData,
        isNeedCheckResponse: true,
      }).then((data) => {
        setLoading(nextIndex, false)
        let arr = []
        if (dealResFunc || nextItem.dealResFunc) {
          arr = (dealResFunc || nextItem.dealResFunc)(data)
        } else {
          arr = data ?? []
        }
        let newArr = [...optionArr]
        newArr[nextIndex] = arr
        setOptionArr(newArr)
      })
    }
  }

  const onSelectChange = (val, index, options, valueKeyTemp) => {
    const selectedObj = options.find((i) => i[valueKeyTemp] == val)
    getNextData(selectedObj, index)
    if (props.onChange) {
      let newValue = [...valueTemp]
      newValue[index] = selectedObj[valueKeyTemp]
      //清空后面的下级
      for (let i = index + 1; i < newValue.length; i++) {
        newValue[i] = undefined
      }
      props.onChange(newValue)
    }
  }

  /**
   * 渲染
   */
  return (
    <Row type="flex" gutter={10}>
      {items &&
        items.map((itemObj, index) => {
          const valueKeyTemp = valueKey || itemObj.valueKey
          const textKeyTemp = textKey || itemObj.textKey
          const options = index == 0 ? firstOptionArr : optionArr[index] || []
          const val = (value && Array.isArray(value) && value[index]) || undefined
          const loading = index == 0 ? loadingFirst : getLoading(index)

          return (
            <Col key={index} span={24 / items.length}>
              <Select
                placeholder={itemObj.placeholder || '请选择'}
                value={val}
                onChange={(val) => {
                  onSelectChange(val, index, options, valueKeyTemp)
                }}
                loading={loading}
                style={{ width: '100%' }}
              >
                {options &&
                  options.map((optionObj, idx) => (
                    <Option key={idx} value={optionObj[valueKeyTemp]}>
                      {optionObj[textKeyTemp]}
                    </Option>
                  ))}
              </Select>
            </Col>
          )
        })}
    </Row>
  )
}

export default Index
