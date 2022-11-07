//自定义时间范围选择
import React, { Component } from 'react'
import moment from 'moment'
//组件
import { DatePicker, message, Row, Col } from 'antd'
//样式
import styles from './index.less'

/*
const {
  value, //moment 数组
  onChange,
  isBlock, //默认inline-block  有一个自己的长度
  placeholder, //str数组
  range, //范围，number 单位天
  allowClear,
  canToday, //可以选择当天吗 默认可以
  endDateNoLimit
} = this.props
*/

class RangeMPicker extends Component {
  //方法方法方法方法方法方法方法方法方法方法方法方法方法方法
  //限制范围
  disabledStartDate = (startValue) => {
    const { value } = this.props
    const endValue = value[1]
    if (!startValue || !endValue) {
      return false
    }
    //-100000 毫秒为了 开始时间可以选择今天
    return startValue.valueOf() - 100000 > endValue.valueOf()
  }
  disabledEndDate = (endValue) => {
    const { value, canToday, endDateNoLimit } = this.props
    const startValue = value[0]
    if (!endValue || !startValue) {
      return false
    }
    if (endDateNoLimit) {
      return endValue.valueOf() <= startValue.valueOf() - 100000
    }
    if (canToday == undefined) {
      //可以选今天
      return endValue.valueOf() <= startValue.valueOf() - 100000 || endValue > moment(new Date().getTime())
    } else {
      //不可以选今天
      return endValue.valueOf() <= startValue.valueOf() - 100000 || endValue > moment(new Date().getTime() - 1 * 86400 * 1000)
    }
  }
  //限制范围 end
  //发射事件，onChange发射到父级
  onChange = (field, valueM) => {
    const { value, onChange, range } = this.props
    let valueTemp = [...value]
    if (field === 'startValue') {
      let startValueNew = valueM
      let endValueOld = valueTemp[1]
      if (startValueNew.valueOf() >= endValueOld.valueOf()) {
        let endValueNew = moment(startValueNew.valueOf() + 86400000)
        valueTemp[1] = endValueNew
      }
      valueTemp[0] = valueM
    } else if (field === 'endValue') {
      let startValueOld = valueTemp[0]
      let endValueNew = valueM
      if (startValueOld.valueOf() >= endValueNew.valueOf()) {
        let startValueNew = moment(endValueNew.valueOf() - 86400000)
        valueTemp[0] = startValueNew
      }
      valueTemp[1] = valueM
    }

    //验证
    if (range) {
      let stamps = range * 86400000
      //时间范围限制
      if (valueTemp[1].valueOf() - valueTemp[0].valueOf() > stamps) {
        message.error(`不能查询超过${range}天的数据`)
        return
      }
    }
    //验证 end

    onChange(valueTemp)
  }
  onStartChange = (value) => {
    this.onChange('startValue', value)
  }
  onEndChange = (value) => {
    this.onChange('endValue', value)
  }
  //渲染渲染渲染渲染渲染渲染渲染渲染渲染渲染渲染渲染渲染渲染渲染渲染渲染渲染渲染
  render() {
    const {
      value: [startValue, endValue],
      style,
      isBlock,
      placeholder,
      allowClear,
      disabledDate,
    } = this.props

    //样式
    let styleTemp = {
      display: isBlock ? 'block' : 'inline-block',
      ...style,
    }
    //domdomdomdomdomdomdomdomdomdomdomdomdomdomdomdomdomdomdomdom
    return (
      <div style={styleTemp}>
        <Row gutter={10} type="flex" align="middle">
          <Col span={12}>
            <DatePicker
              disabledDate={disabledDate == false ? null : this.disabledStartDate}
              format="YYYY-MM-DD"
              value={startValue}
              onChange={this.onStartChange}
              allowClear={allowClear ? true : false}
              style={{ width: '100%' }}
              placeholder={placeholder && placeholder[0] ? placeholder[0] : '开始时间'}
            />
          </Col>
          <Col span={12}>
            <DatePicker
              disabledDate={disabledDate == false ? null : this.disabledEndDate}
              format="YYYY-MM-DD"
              value={endValue}
              onChange={this.onEndChange}
              allowClear={allowClear ? true : false}
              style={{ width: '100%' }}
              placeholder={placeholder && placeholder[1] ? placeholder[1] : '终止时间'}
            />
          </Col>
        </Row>
      </div>
    )
  }
}
export default RangeMPicker
