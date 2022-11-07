import React, { useState, useImperativeHandle, forwardRef } from 'react'
import { Input, Row } from 'antd'
import { SafetyOutlined } from '@ant-design/icons'
import { randomStrKey } from '@/utils/utils'

/**
 *
 * @param {object} props
 * @param {object} props.value  // {v,key}
 * @param {function} props.onChange
 *  * @param {function} props.getImgSrc  // key
 */

const Index = (props, ref) => {
  const { value = {}, onChange, getImgSrc, ...restProps } = props
  const {
    v,
    // key
  } = value

  const [keyStr, setKeyStr] = useState(randomStrKey())

  const onInputChange = (e) => {
    const curV = e.target.value
    const emitValue = {
      v: curV,
      key: keyStr,
    }
    onChange && onChange(emitValue)
  }

  const reset = () => {
    setKeyStr(randomStrKey())
  }

  useImperativeHandle(ref, () => ({
    reset,
  }))

  return (
    <Row type="flex" align="middle">
      <Input
        placeholder="请输入验证码"
        prefix={<SafetyOutlined />}
        allowClear
        {...restProps}
        value={v}
        onChange={onInputChange}
        style={{ width: 'auto', flex: '1 0 0' }}
      />
      <img src={getImgSrc(keyStr)} style={{ width: 'auto', height: 38, marginLeft: 8 }} onClick={reset} />
    </Row>
  )
}

export default forwardRef(Index)
