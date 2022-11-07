/**
 * 审核列表
 */
import React, { Component, Fragment } from 'react'
import { connect } from 'dva'
import { Spin, Row, Popover } from 'antd'
import moment from 'moment'

const formTime = (str) => {
  let d = ''
  let dateStr = str.substring(0, 10)
  let nowDateStr = moment().format('YYYY-MM-DD')
  if (nowDateStr == dateStr) {
    d = '今天'
  } else {
    d = dateStr
  }
  let timeStr = str.substring(11, 16)
  return d + ' ' + timeStr
}

class index extends Component {
  render() {
    const {
      miniapp,
      //loading
      loadingGetVerifyList,
    } = this.props
    const { verifyList } = miniapp

    return (
      <Fragment>
        {loadingGetVerifyList ? (
          <div style={{ textAlign: 'center' }}>
            <Spin />
          </div>
        ) : (
          <div>
            {verifyList && verifyList.length > 0 ? (
              verifyList.map((obj, index) => {
                const content = <p style={{ maxWidth: 270 }}>{obj.reason || '无'}</p>

                return (
                  <Row key={index} justify="space-between" style={{ margin: '5px 0' }}>
                    <div>{(obj.createDateStr && formTime(obj.createDateStr)) || ''}</div>
                    <Popover content={content} title="提示" placement="leftBottom">
                      <div>{obj.statusStr}</div>
                    </Popover>
                  </Row>
                )
              })
            ) : (
              <div>暂无数据</div>
            )}
          </div>
        )}
      </Fragment>
    )
  }
}

export default connect(({ miniapp, loading }) => ({
  miniapp,
  loadingGetVerifyList: loading.effects['miniapp/getVerifyList'],
}))(index)
