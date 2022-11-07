import React, { Component } from 'react'
import { Drawer, Descriptions } from 'antd'

/**
 * props
 *
 * open record
 */

class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      lookingRecord: null,
    }
  }
  componentDidMount() {
    if (this.props.onRef) this.props.onRef(this)
  }
  open = (params) => {
    this.setState({
      visible: true,
      lookingRecord: (params && params.record) || null,
    })
  }
  close = () => {
    this.setState({
      visible: false,
      lookingRecord: null,
    })
  }
  render() {
    const { visible, lookingRecord } = this.state
    return (
      <Drawer visible={visible} width={600} onClose={this.close}>
        <Descriptions title="User Info">
          <Descriptions.Item label="UserName">Zhou Maomao</Descriptions.Item>
          <Descriptions.Item label="Telephone">1810000000</Descriptions.Item>
          <Descriptions.Item label="Live">Hangzhou, Zhejiang</Descriptions.Item>
          <Descriptions.Item label="Remark">empty</Descriptions.Item>
        </Descriptions>
      </Drawer>
    )
  }
}

export default Index
