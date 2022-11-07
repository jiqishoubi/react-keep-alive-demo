import React, { useState } from 'react'
import { Form, Row, Col } from 'antd'
import styles from './index.less'

export const queryFilterStyle = {
  marginRight: -24,
}

/**
 *
 * @param {object} props
 * @param {MutableRefObject<undefined>} props.form
 * @param {number=4} props.span
 * @param {boolean} props.defaultCollapsed
 * @param {Element[]} props.submitterItems
 */
const Index = (props) => {
  const { form, defaultCollapsed = false, span = 4, submitterItems } = props

  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed)

  let beyond24Index = null //超过一行的item的index
  if (props.children && props.children.length) {
    let sumSpan = 0
    for (let i = 0; i < props.children.length; i++) {
      const item = props.children[i]
      const itemSpan = ((item.props && item.props.colSize) || 1) * span
      sumSpan = sumSpan + itemSpan
      if (sumSpan > 24) {
        beyond24Index = i
        break
      }
    }
  }
  const isBeyond24 = beyond24Index !== null && beyond24Index <= props.children.length - 1 //是否超过一行

  const onClickCollapseBtn = () => {
    setIsCollapsed((f) => !f)
  }

  let queryFilterWrapStyle = {
    // padding: '20px 0px 0px',
    padding: '0px 0px 0px',
    backgroundColor: '#fff',
  }

  const renderChildrenArr = Array.isArray(props.children) ? props.children : [props.children]

  return (
    <div style={queryFilterWrapStyle}>
      <Form form={form}>
        <Row gutter={10}>
          {renderChildrenArr &&
            renderChildrenArr.length > 0 &&
            renderChildrenArr.map((dom, idx) => {
              if (!dom) return null

              const itemSpan = ((dom.props && dom.props.colSize) || 1) * span
              let style = {}
              if (isBeyond24) {
                if (isCollapsed && idx >= beyond24Index) {
                  style = { display: 'none' }
                }
              }
              const renderDom = (
                <Col key={idx} span={itemSpan} style={style}>
                  {dom}
                </Col>
              )
              return renderDom
            })}

          <div
            style={{
              marginBottom: 24,
              marginLeft: 'auto',
              marginRight: 5,
            }}
          >
            <Row gutter={10} align="middle" justify="end">
              {submitterItems.map((item, index) => (item && <Col key={index}>{item}</Col>) || null)}
              {/* {isBeyond24 && (
                <span className={styles.collapseBtn} onClick={onClickCollapseBtn}>
                  {isCollapsed ? (
                    <>
                      展开
                    </>
                  ) : (
                    <>
                      关闭
                    </>
                  )}
                </span>
              )} */}
            </Row>
          </div>
        </Row>
      </Form>
    </div>
  )
}

export default Index
