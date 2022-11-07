import React, { useState, useRef, useImperativeHandle, forwardRef } from 'react'
import { Card, Form, Input, Select, Row, Col, Button, Image, Modal, Descriptions, Spin, Divider, Tag } from 'antd'
import request from '@/utils/request'
import { getInfo } from './services'
import { isArray } from 'lodash'
const title = '供应商详情'
const modalWidth = 900
const Index = (props, ref) => {
  const [show, setShow] = useState(false)
  const [info, setInfo] = useState({})

  useImperativeHandle(ref, () => ({
    show: async (params) => {
      var info = await getInfo({ supplierCode: params.orgCode })
      info = loadParamsDeal(info)
      setInfo(info)
      setShow(true)
    },
  }))
  const cancel = async () => {
    setShow(false)
    setInfo({})
    props?.cancel && props.cancel()
  }
  const loadParamsDeal = (info) => {
    info = { ...info, ...info.attrMap }
    info.showList = [
      { type: 'divide', label: '供应商信息' },
      { type: 'common', label: '供应商名称', value: info?.orgName },
      { type: 'common', label: '管理员名称', value: info?.adminName },
      { type: 'common', label: '管理员手机号', value: info?.adminPhoneNumber },
      { type: 'common', label: '管理员登录账号', value: info?.adminLoginName },
      {
        type: 'img',
        label: '企业营业执照',
        value: info?.enterpriseBusinessLicense,
      },
      {
        type: 'common',
        label: '客服热线',
        value: info?.customerServiceHotline,
      },
      {
        type: 'common',
        label: '是否建立商城',
        value: info?.ifCreateMall == 1 ? '是' : '否',
      },
      {
        type: 'common',
        label: '技术服务费率',
        value: info?.technicalServiceRate + '%',
      },
      { type: 'divide', label: '退货信息' },
      { type: 'common', label: '是否包邮', value: info?.ifShip == 1 ? '是' : '否' },
      { type: 'common', label: '收件人姓名', value: info?.recipientName },
      { type: 'common', label: '收件人手机号', value: info?.recipientPhone },
      { type: 'common', label: '退货地址', value: info?.returnAddress },
    ]
    if (info?.wechatConfigDTO) {
      info = { ...info, ...info.wechatConfigDTO }
      info.showList.push(
        ...[
          { type: 'divide', label: '微信小程序信息' },
          {
            type: 'common',
            label: '是否有启动页',
            value: info?.ifStartPage ? '是' : '否',
          },
          { type: 'img', label: '启动页图片', value: info?.startPageImg },
          {
            type: 'component',
            label: '小程序热词',
            vaelue: info?.hotWord || '',
            render: () => {
              if (info?.hotWord.length > 0) {
                return info?.hotWord?.split(',').map((e) => <Tag>{e}</Tag>)
              }
              return ''
            },
          },
          // { type: 'common', label: '小程序APPId', value: info?.appId },
          // { type: 'common', label: '小程序秘钥', value: info?.appSecret },
          // { type: 'divide', label: '微信商户信息' },
          // { type: 'common', label: '微信商户号', value: info?.mchId },
          // { type: 'common', label: '微信秘钥', value: info?.secretKey },
          // { type: 'link', label: '微信证书', value: info?.certUrl },
          { type: 'divide', label: '小程序分享设置' },
          { type: 'common', label: '分享小程序名称', value: info?.appName },
          { type: 'common', label: '分享描述信息', value: info?.shareDesc },
          { type: 'img', label: '分享信息logo', value: info?.shareLogo },
          { type: 'img', label: '分享信息图片', value: info?.shareImage },
        ]
      )
    }
    return info
  }
  return (
    <>
      {
        <Modal
          title={title}
          visible={show}
          destroyOnClose={true}
          maskClosable={false}
          centered={true}
          width={modalWidth}
          onOk={cancel}
          cancelText={false}
          onCancel={cancel}
          footer={[
            <Button key="submit" type="primary" onClick={cancel}>
              确定
            </Button>,
          ]}
        >
          <>
            {info?.showList?.map((e) => {
              if (!e?.type || e.type == 'common') {
                return (
                  <Row justify="center" style={{ marginTop: 30 }}>
                    <Col xs={6} style={{ textAlign: 'right' }}>
                      {e.label} ：
                    </Col>
                    <Col xs={12}>{e.value}</Col>
                  </Row>
                )
              }
              if (e.type == 'divide') {
                return (
                  <Row justify="center" style={{ marginTop: 30, borderBottom: '1px solid #eee' }}>
                    <Col xs={6} style={{ textAlign: 'right' }}>
                      {' '}
                      <h2>{e.label} </h2>{' '}
                    </Col>
                    <Col xs={18}>{e.value}</Col>
                    {/* <Divider orientation="left" style={{marginBottom:30}} >{e.label}</Divider> */}
                  </Row>
                )
              }
              if (e.type == 'component') {
                return (
                  <Row justify="center" style={{ marginTop: 30 }}>
                    <Col xs={6} style={{ textAlign: 'right' }}>
                      {e.label} ：
                    </Col>
                    <Col xs={12}>{e.render()}</Col>
                  </Row>
                )
              }
              if (e.type == 'img') {
                return (
                  <Row justify="center" style={{ marginTop: 30 }}>
                    <Col xs={6} style={{ textAlign: 'right' }}>
                      {e.label} ：
                    </Col>
                    <Col xs={12}>
                      {' '}
                      {isArray(e.value) ? (
                        e.value.map((item) => <Image preview={true} style={{ width: 120, height: 120, marginRight: 20 }} src={item} />)
                      ) : (
                        <Image preview={true} style={{ width: 120, height: 120 }} src={e.value} />
                      )}
                    </Col>
                  </Row>
                )
              }
              if (e.type == 'link') {
                return (
                  <Row justify="center" style={{ marginTop: 30 }}>
                    <Col xs={6} style={{ textAlign: 'right' }}>
                      {e.label} ：
                    </Col>
                    <Col xs={12}>
                      {' '}
                      <Button type="download" href={e.value} target="_blank">
                        点击下载
                      </Button>
                    </Col>
                  </Row>
                )
              }
            })}
          </>
        </Modal>
      }
    </>
  )
}

export default forwardRef(Index)
