import { Form, Radio, Input, Select, Space, Button, message, Checkbox, Table, Modal } from 'antd'
import React from 'react'
import { CaretDownOutlined } from '@ant-design/icons'

function clientManageRevamp(props) {
  async function onFinish(value) {
    props.onChangeRevamp()
  }

  return (
    <>
      <div className="positionre" style={{ height: '1000px' }}>
        <Form onFinish={onFinish}>
          <Form.Item style={{ margin: '0  20px ' }}>
            <div
              style={{
                fontSize: '14px',
                background: '#F8F8F8',
                marginBottom: '40px',
              }}
            >
              基本信息
            </div>
          </Form.Item>
          <div className="newflex">
            <Form.Item label="客户ID" style={{ width: 560 }}>
              <span style={{ marginLeft: '54px' }}>666</span>
            </Form.Item>

            <Form.Item label="标记身份" name="ID" style={{ width: 560 }}>
              <Checkbox.Group style={{ marginLeft: 40 }} options={props.options} />
            </Form.Item>

            <Form.Item label="身份有效期" name="time" initialValue={1} style={{ width: 560 }}>
              <Radio.Group style={{ marginTop: '6px' }} name="time">
                <Radio style={{ marginLeft: 28 }} value={1}>
                  长期
                </Radio>

                <br />

                <div
                  style={{
                    width: '400px',
                    marginTop: '20px',
                    marginLeft: 28,
                    display: 'flex',
                  }}
                >
                  <Radio value={2}>定期</Radio>

                  <Form.Item name="cc">
                    <Select
                      showArrow={true}
                      style={{
                        width: 200,
                        marginLeft: '20px',
                        marginTop: '-10px',
                      }}
                      placeholder="请选择"
                      allowClear={true}
                    >
                      <Option value="666">自然流量</Option>
                    </Select>
                  </Form.Item>
                </div>
              </Radio.Group>
            </Form.Item>
          </div>
          <div style={{ marginTop: '88px' }}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                type="primary"
                style={{
                  marginRight: '100px',
                  width: '120px',
                  borderRadius: '4px',
                }}
                size="middle"
                htmlType="submit"
              >
                确定
              </Button>
              <Button
                style={{
                  width: '120px',
                  marginRight: '100px',
                  borderRadius: '4px',
                }}
                onClick={props.onChangeRevamp}
                type="primary"
                htmlType="submit"
              >
                返回
              </Button>
            </div>
          </div>
        </Form>
      </div>
    </>
  )
}
export default clientManageRevamp
