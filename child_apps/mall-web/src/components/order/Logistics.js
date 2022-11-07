import { Button, Timeline, message, Spin } from 'antd'
import { UpCircleOutlined } from '@ant-design/icons'
import React, { useEffect, useState } from 'react'
import { getExpressQuery } from '@/services/order'
import { CopyOutlined } from '@ant-design/icons'
function logistics(props) {
  const [logisticeData, setLogisticeData] = useState([])

  const [spinShow, setSpinShow] = useState(true)
  async function getExpressQuery_(data) {
    let res = await getExpressQuery(data)
    if (res && res.code === '0') {
      setLogisticeData(res.data.data)
    }
    setSpinShow(false)
  }

  useEffect(() => {
    let data = {
      expressName: props.show ? props.orderValue.expressCompanyName : props.orderValue.disputeOrderDTO.expressCompanyName,
      expressNo: props.show ? props.orderValue.expressNo : props.orderValue.disputeOrderDTO.expressNo,
      tradeNo: props.orderValue.tradeNo,
    }
    getExpressQuery_(data)
  }, [])

  const copy = () => {
    let copyDOM = document.getElementById('expressCompanyName') //需要复制文字的节点
    let range = document.createRange() //创建一个range
    window.getSelection().removeAllRanges() //清楚页面中已有的selection
    range.selectNode(copyDOM) // 选中需要复制的节点
    window.getSelection().addRange(range) // 执行选中元素
    let successful = document.execCommand('copy') // 执行 copy 操作
    if (successful) {
      message.success('复制成功！')
    } else {
      message.error('复制失败，请手动复制！')
    }
    // 移除选中的元素
    window.getSelection().removeAllRanges()
  }

  return (
    <>
      <div className="fontMb positionre " style={{ border: '1px solid #fefffe', minHeight: 400 }}>
        <div className="marginlr20 "> 物流信息</div>
        <div className="logistics">
          <span>{props.show ? props.orderValue.expressCompanyName : props.orderValue.disputeOrderDTO.expressCompanyName}</span>
          <span>:</span>
          <span onClick={copy} style={{ marginLeft: 10 }} id="expressCompanyName">
            {props.show ? props.orderValue.expressNo : props.orderValue.disputeOrderDTO.expressNo}
            <span>
              <CopyOutlined style={{ width: 40 }} />
            </span>
          </span>
        </div>
        {logisticeData ? (
          <>
            <div style={{ display: 'flex', marginTop: 40 }}>
              <div
                style={{
                  width: ' calc(50% - 12px)',
                  textAlign: 'right',
                  paddingRight: 24,
                  fontWeight: 'bold',
                }}
              >
                时间
              </div>
              <div
                style={{
                  width: ' calc(50% - 12px)',
                  fontWeight: 'bold',
                  paddingLeft: 50,
                }}
              >
                地点和跟踪进度
              </div>
            </div>
          </>
        ) : (
          ''
        )}

        <div style={{ marginTop: 30 }}>
          <div style={{ textAlign: 'center' }}>
            <Spin spinning={spinShow} />
          </div>
          {logisticeData ? (
            logisticeData.map((item, index) => {
              return (
                <Timeline mode="left">
                  <Timeline.Item key={index} label={item.time} dot={<UpCircleOutlined />}>
                    {item.context}
                  </Timeline.Item>
                </Timeline>
              )
            })
          ) : (
            <div
              style={{
                width: ' calc(60% - 12px)',
                textAlign: 'right',
                fontWeight: 'bold',
                height: 110,
              }}
            >
              暂无数据
            </div>
          )}
        </div>
      </div>
    </>
  )
}
export default logistics
