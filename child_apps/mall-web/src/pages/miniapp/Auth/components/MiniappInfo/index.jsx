import React, { Component } from 'react'
import { connect } from 'dva'
import { Row, Col, Button, Divider, Spin, message, Modal } from 'antd'
import PublishDrawer from '../PublishDrawer'
import { getAuthUrlAjax, verifyListAjax, pushCodeAjax } from '../../../services/miniapp'
import { getUrlParam, mConfirm } from '@/utils/utils'
import styles from './index.less'

class MiniappInfo extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading_getUrl: false,
      loading_upload: false, //上传模板
    }
  }
  async componentDidMount() {
    const { dispatch, miniapp } = this.props
    const { miniappInfo } = miniapp

    //授权
    let auth_code = getUrlParam('auth_code')
    let expires_in = getUrlParam('expires_in')
    if (auth_code && expires_in && !miniappInfo) {
      if (!window.isProd) console.log('授权')
      dispatch({
        type: 'miniapp/getAuth',
        payload: {
          auth_code,
          expires_in,
        },
      })
    }

    //获取小程序信息
    if (!miniappInfo) {
      console.log('去查小程序信息')
      dispatch({
        type: 'miniapp/getMiniappInfo',
      })
    }
  }

  getAuth = async () => {
    const postData = {
      authUrl: window.isProd ? 'https://saas.bld365.com/#/web/company/miniapp/auth' : 'https://saas.bld365.com/test/#/web/company/miniapp/auth',
    }
    this.setState({ loading_getUrl: true })
    const res = await getAuthUrlAjax(postData)
    this.setState({ loading_getUrl: false })
    const url = res
    window.location.href = url
  }

  //上传代码
  upload = async () => {
    // this.publishDrawer.open();
    const postData = {
      app_id: this.props.miniapp.appid, //companyCode 后端从token中取
    }
    this.setState({ loading_upload: true })
    const res1 = await pushCodeAjax(postData)
    if (!window.isProd) console.log('上传代码结果', res1)
    this.setState({ loading_upload: false })

    Modal.info({
      title: '提示',
      content: '上传代码成功',
    })
  }

  //提交审核
  submitVerify = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'miniapp/submitVerify',
    })
  }

  //撤销审核
  cancelVerify = () => {
    mConfirm('确认撤销审核？', () => {
      const { dispatch } = this.props
      dispatch({
        type: 'miniapp/cancelVerify',
      })
    })
  }

  //发布上线
  publish = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'miniapp/publishApp',
    })
  }

  render() {
    const { loading_getUrl, loading_upload } = this.state
    const {
      miniapp,
      //loading
      loadingGetMiniappInfo,
      loadingSubmitVerify,
      loadingCancelVerify,
      loadingPublishApp,
    } = this.props
    const { miniappInfo, appid, miniappStatus } = miniapp

    return (
      <div>
        <Row>
          <Col flex="auto">
            <div className={styles.miniapp}>
              <div className={styles.info}>
                {loadingGetMiniappInfo ? <Spin /> : <div className={styles.logo_box}>{miniappInfo && miniappInfo.headImg ? <img src={miniappInfo.headImg} /> : null}</div>}
                <div>{miniappInfo && miniappInfo.nickName ? miniappInfo.nickName : '暂未授权小程序'}</div>
                <div>
                  {miniappInfo && appid && (
                    <div>
                      <div>{`appid:${appid}`}</div>
                      {miniappStatus && <div style={{ textAlign: 'center' }}>状态：{miniappStatus}</div>}
                    </div>
                  )}
                </div>
              </div>

              {/* 操作 */}
              <div className={styles.ctrl_wrap}>
                {miniappInfo ? (
                  <div>
                    <Button type="primary" onClick={this.upload} loading={loading_upload}>
                      同步模板
                    </Button>
                    <Button type="primary" onClick={this.submitVerify} style={{ marginLeft: 10 }} loading={loadingSubmitVerify} disabled={miniappStatus == '审核中'}>
                      提交审核
                    </Button>
                    <Button type="primary" onClick={this.cancelVerify} style={{ marginLeft: 10 }} loading={loadingCancelVerify} disabled={miniappStatus !== '审核中'}>
                      撤销审核
                    </Button>
                    <Button type="primary" onClick={this.publish} style={{ marginLeft: 10 }} loading={loadingPublishApp} disabled={miniappStatus !== '审核成功'}>
                      发布上线
                    </Button>
                  </div>
                ) : (
                  <Button type="primary" onClick={this.getAuth} loading={loading_getUrl}>
                    绑定小程序
                  </Button>
                )}
              </div>
            </div>
          </Col>
          {/* <Col>
            <Divider type="vertical" dashed={true} style={{ height: 250 }} />
          </Col>
          <Col flex="200px">
            <Row justify="center">
              <div className={styles.code_box}>
                {miniappInfo && miniappInfo.qrcodeUrl && (
                  <img className={styles.code} src={miniappInfo.qrcodeUrl} />
                )}
              </div>
            </Row>
          </Col> */}
        </Row>

        <PublishDrawer
          ref={(e) => {
            this.publishDrawer = e
          }}
          {...this.props}
        />
      </div>
    )
  }
}

export default connect(({ miniapp, loading }) => ({
  miniapp,
  //loading
  loadingGetMiniappInfo: loading.effects['miniapp/getMiniappInfo'],
  loadingSubmitVerify: loading.effects['miniapp/submitVerify'],
  loadingCancelVerify: loading.effects['miniapp/cancelVerify'], //撤销审核
  loadingPublishApp: loading.effects['miniapp/publishApp'],
}))(MiniappInfo)
