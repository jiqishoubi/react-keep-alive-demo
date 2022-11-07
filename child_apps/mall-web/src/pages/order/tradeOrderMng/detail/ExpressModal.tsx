import React, { useEffect, useState } from 'react'
import { Modal, Form, Input, Timeline, Spin } from 'antd'
import { UpCircleOutlined } from '@ant-design/icons'
import { IUseModalController } from '@/hooks/useModalController'
import requestw from '@/utils/requestw'

// 接口继承
interface IProps extends IUseModalController {}

function Index(props: IProps) {
  const { modalProps, controller } = props

  const { tradeNo } = controller.payload

  const [expressItemList, setExpressItemList] = useState([])
  const [loading, setLoading] = useState(false)

  function getData() {
    setLoading(true)
    requestw({
      url: '/web/system/trade/getExpressInfo',
      data: { tradeNo },
      isNeedCheckResponse: true,
    })
      .finally(() => setLoading(false))
      .then((data) => {
        setExpressItemList(data?.data ?? [])
      })
  }

  useEffect(() => {
    if (modalProps.visible && tradeNo) {
      getData()
    }
  }, [modalProps.visible, tradeNo])

  return (
    <Modal title="物流详情" {...modalProps} onCancel={controller.close} footer={null} width={800}>
      <Spin spinning={loading}>
        <div style={{ marginLeft: -300, minHeight: 200 }}>
          {expressItemList.map((item, index) => {
            return (
              <Timeline key={index} mode="left">
                <Timeline.Item key={index} label={item.time} dot={<UpCircleOutlined />}>
                  {item.context}
                </Timeline.Item>
              </Timeline>
            )
          })}
        </div>
      </Spin>
    </Modal>
  )
}
export default Index
