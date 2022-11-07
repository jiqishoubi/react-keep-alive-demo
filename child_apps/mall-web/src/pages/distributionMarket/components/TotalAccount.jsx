import React from 'react'
import { Row, Col } from 'antd'

/**
 * 总余额统计
 * @param {object} props
 * @param {Array<{
 *  title:string,
 *  value:string,
 * }> props.items
 */
function TotalAccount(props) {
  const { items = [], style = {} } = props

  const styleBox = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid #dddddd',
    padding: '7px 0',
  }

  const span = 24 / items.length

  return (
    <div style={style}>
      <div style={{ marginBottom: 10 }}>
        <Row type="flex" gutter={10}>
          {items &&
            items.length > 0 &&
            items.map((item, index) => (
              <Col key={index} span={span}>
                <div style={styleBox}>
                  <div>{item.title}：</div>
                  <div style={{ fontWeight: 'bold', marginTop: 2 }}>{item.value}</div>
                </div>
              </Col>
            ))}
        </Row>
      </div>
    </div>
  )
}

export default TotalAccount
