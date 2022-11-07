/**
 * 体验账号
 */
import React, { Component, Fragment } from 'react'
import { Row, Button, Modal, message } from 'antd'
import { unbindTesterAjax } from '../../../services/miniapp'
import { mConfirm } from '@/utils/utils'

class index extends Component {
  unbindTester = (obj) => {
    mConfirm('确认解绑？', () => {
      return new Promise(async (resolve) => {
        const { miniapp, dispatch } = this.props
        const { appid } = miniapp
        let postData = {
          app_id: appid,
          ...obj,
        }
        let res = await unbindTesterAjax(postData)
        if (!window.isProd) console.log('解绑体验者结果', res)
        resolve()
        if (res && res.code == 200 && res.data && res.data.errcode == 0) {
          message.success('解绑成功')
          dispatch({
            type: 'miniapp/getTesterList',
          })
        } else {
          message.warning((res.data && res.data.errmsg) || res.message || '解绑失败')
        }
      })
    })
  }
  render() {
    const { miniapp } = this.props
    const { testerList } = miniapp
    return (
      <Fragment>
        {testerList && testerList.length > 0 ? (
          testerList.map((obj, index) => (
            <Row key={index} justify="space-between" style={{ margin: '5px 0' }}>
              <div>{obj.wechatId}</div>
              <Button
                size="small"
                onClick={() => {
                  this.unbindTester(obj)
                }}
              >
                解绑成员
              </Button>
            </Row>
          ))
        ) : (
          <div>暂无数据</div>
        )}
      </Fragment>
    )
  }
}

export default index
