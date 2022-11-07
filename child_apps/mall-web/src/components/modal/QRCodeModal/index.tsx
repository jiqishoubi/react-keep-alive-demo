import React, { useEffect } from 'react'
import { Modal, Form, Input, Row, Button } from 'antd'
import { IUseModalController } from '@/hooks/useModalController'
import QRCode from 'qrcode.react'

// 接口继承
interface IProps extends IUseModalController {}

/**
 *
 * open payload
 *
 * title modal title
 * url 链接地址
 * desc 说明
 */

interface IPayload {
  title?: string
  url: string
  desc?: string
}

function Index(props: IProps) {
  const { modalProps, controller } = props

  const { title = '二维码', url, desc = '' } = controller.payload as IPayload // 打开这个modal 时的传参

  function handleDownload() {
    let body = document.body || document.getElementsByTagName('body')[0]
    let canvas = document.getElementById('qrcode_modal_box_canvas')
    if (canvas) {
      let a = document.createElement('a')
      a.href = canvas.toDataURL('image/png')
      a.download = desc + ' 推荐码' + '.png'
      body.appendChild(a)
      a.click()
      setTimeout(() => {
        body.removeChild(a)
      }, 50)
    }
  }

  return (
    <Modal
      title={title}
      {...modalProps}
      onCancel={() => {
        controller.close()
      }}
      onOk={() => {
        controller.close()
      }}
      width={600}
    >
      <div>
        <Form.Item label="链接地址">
          <div>{url}</div>
        </Form.Item>
        <Form.Item label="说明">
          <div>{desc}</div>
        </Form.Item>
        <Row justify="center">
          <QRCode id="qrcode_modal_box_canvas" value={url} renderAs="canvas" size={200} />
        </Row>
        <Row justify="center" style={{ marginTop: 10 }}>
          <Button type="link" onClick={handleDownload}>
            保存到本地
          </Button>
        </Row>
      </div>
    </Modal>
  )
}
export default Index
