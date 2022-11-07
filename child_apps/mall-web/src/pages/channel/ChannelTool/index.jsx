import { Card, Col, Row, Button } from 'antd'
import { connect } from 'dva'
import React from 'react'
import { router } from 'umi'

const Index = (props) => {
  const {
    dispatch,
    channelToolModel: {},
  } = props

  const minuteBack = () => {
    router.push('/web/company/distributemgr/channeltool/minute')
  }

  return (
    <>
      <div style={{ minHeight: 600 }}>
        <Row gutter={16}>
          <Col span={8}>
            <Card title="预售定金膨胀" bordered={true} style={{ borderRadius: 18, border: '1px solid #d2d2d2' }}>
              预售定金翻N倍，大促预热利器。
              <br />
              <Button
                style={{
                  marginRight: 20,
                  marginTop: 30,
                  marginLeft: '50%',
                  borderRadius: '4px',
                  visibility: 'hidden',
                }}
              >
                查看教程
              </Button>
              <Button type="primary" style={{ borderRadius: '4px' }} onClick={minuteBack}>
                开始设置
              </Button>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  )
}

export default connect(({ channelToolModel }) => {
  return {
    channelToolModel,
  }
})(Index)
