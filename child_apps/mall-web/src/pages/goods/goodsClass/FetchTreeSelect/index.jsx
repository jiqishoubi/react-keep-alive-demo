import React, { useState, useEffect } from 'react'
import { TreeSelect } from 'antd'
import requestw from '@/utils/requestw'

const { TreeNode } = TreeSelect

/**
 * @param { object } props
 * @param { string } props.api 请求接口
 * @param { object } props.formData 携带参数
 * @param { string } [props.valueKey='codeParam']
 * @param { string } [props.textKey='codeValue']
 * @param { string } [props.placeholder='请选择']
 * @param { function } props.dealResFunc 处理返回的res 返回数组
 */

const Index = (props) => {
  const { value, disabled, api, formData = {}, valueKey = 'codeKey', textKey = 'codeValue', placeholder = '请选择', dealResFunc, ...restProps } = props
  const [optionArr, setOptionArr] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getOptions()
  }, [])

  const getOptions = async () => {
    if (!api || loading || optionArr.length) return
    setLoading(true)
    const data = await requestw({
      url: api,
      data: {
        ...formData,
      },
      isNeedCheckResponse: true,
    })
    setLoading(false)
    let arr = []
    if (dealResFunc) {
      arr = dealResFunc(data ?? [])
    } else {
      arr = data?.data ?? []
    }
    setOptionArr(arr)
  }

  const onSelectChange = (code) => {
    if (props.onChange) {
      const isArray = Array.isArray(code)
      if (isArray) {
        let selectedOption = []
        code.map((r) => {
          selectedOption.push(optionArr.find((itm) => itm[valueKey] == r))
        })
        props.onChange(code, selectedOption || undefined)
      } else {
        const selectedOption = optionArr.find((itm) => itm[valueKey] == code)
        props.onChange(code, selectedOption || undefined)
      }
    }
  }

  return (
    <TreeSelect
      placeholder={placeholder}
      value={value}
      onChange={onSelectChange}
      style={{
        width: '100%',
        ...(props.style ?? {}),
      }}
      loading={loading}
      allowClear
      disabled={disabled}
      {...restProps}
    >
      <TreeNode value={''} title={'根级别'}>
        {Array.isArray(optionArr) && optionArr.map((item, index) => <TreeNode key={item[valueKey]} value={item[valueKey] || index} title={item[textKey]}></TreeNode>)}
      </TreeNode>
      )
    </TreeSelect>
  )
}

export default Index
