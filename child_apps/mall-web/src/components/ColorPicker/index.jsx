import React from 'react'
import { ChromePicker } from 'react-color'
import { Button, Row, Col } from 'antd'
import './index_localName.less'

/**
 * @param {object} props
 * @param {string} props.value
 * @param {function} props.onChange
 * @param {string} props.key
 */
function Index(props) {
  const { value, key } = props

  function onColorChange(e) {
    const color = (e && e.hex) || ''
    if (props.onChange) props.onChange(color)
  }

  function clickClear() {
    if (props.onChange) props.onChange('')
  }

  return (
    <div className="my_colorpicker_chromepicker_div">
      <Row type="flex">
        <ChromePicker key={key} color={value} onChange={onColorChange} />
        <Button size="small" onClick={clickClear} style={{ marginLeft: 10 }}>
          清空
        </Button>
      </Row>
    </div>
  )
}

export default Index
