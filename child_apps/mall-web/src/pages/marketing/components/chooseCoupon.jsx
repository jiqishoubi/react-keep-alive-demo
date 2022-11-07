import { Form, DatePicker, Input, Select, Space, Button, Radio, Table, Modal, message, InputNumber, Row, Col } from 'antd'
import React, { useEffect, useState } from 'react'
import Ticket from '@/components/marketing/Ticket'

const chooseCoupon = (props) => {
  const [form] = Form.useForm()
  const [tickData, setTickData] = useState([])
  const [ticketName, setticketName] = useState([])
  const [ticketCode, setticketCode] = useState([])

  const [isName, setIsName] = useState([])
  const [isCode, setIsCode] = useState([])

  const [isTrueshow, setisTrueShow] = useState(true)
  //是否优惠券
  const [ticketPop, setticketPop] = useState(false)
  useEffect(() => {
    let data = tickData
    if (data.length) {
      if (ticketCode.length) {
        ticketCode.map((item, index) => {
          let isTrue = true
          if (isTrueshow) {
            data.map((r) => {
              if (r.ticketCode === item) {
                ++r.ticketCount
                isTrue = false
              }
            })
            if (isTrue) {
              let tickObj = {
                ticketCode: item,
                ticketName: ticketName[index],
                ticketCount: 1,
              }
              data.push(tickObj)
            }
          } else {
            data.map((r) => {
              if (r.ticketCode === item) {
                data.splice(data.indexOf(r), 1)
              }
            })
            setisTrueShow(true)
          }
        })
      }
    } else {
      if (ticketCode.length) {
        ticketCode.map((item, index) => {
          let tickObj = {
            ticketCode: item,
            ticketName: ticketName[index],
            ticketCount: 1,
          }
          data.push(tickObj)
        })
      }
    }
    setTickData([])

    props.onChange(JSON.stringify(data))
  }, [ticketCode])

  useEffect(() => {
    if (props.value) {
      setTickData(JSON.parse(props.value))
      if (props.value.length > 2) {
        form.setFieldsValue({ activeMode: 1 })
      }
    }
  }, [props])

  //点击删除
  const click = (ticketCode) => {
    setisTrueShow(false)
    setticketCode([ticketCode])
  }
  //点击数量
  const change = (e, ticketCode) => {
    let data = tickData
    data.map((r) => {
      if (r.ticketCode === ticketCode) {
        r.ticketCount = e
      }
    })
    setTickData(data)
    props.onChange(JSON.stringify(data))
  }

  //ticket组件数据
  function ticketDatas(name, value) {
    setIsName(name)
    setIsCode(value)
  }
  const isTicketData = () => {
    setticketCode(isCode)
    setticketName(isName)
  }

  //tickChange
  const tickChange = () => {
    if (form.getFieldValue('activeMode')) {
      setticketPop(true)
    }
  }
  return (
    <>
      <Form form={form}>
        <Form.Item>
          <Space>
            <Form.Item label="选择优惠卡券" name="activeMode" required rules={[{ required: true, message: '请选择优惠卡券' }]} style={{ marginLeft: '-28px', width: 380 }}>
              <Select showArrow={true} onChange={tickChange} placeholder="请选择" allowClear={true}>
                <Option value={1}>优惠卡券</Option>
              </Select>
            </Form.Item>
            <Form.Item>
              <Button onClick={tickChange}>继续</Button>
            </Form.Item>
          </Space>
        </Form.Item>

        <Form.Item style={{ marginBottom: 0 }} shouldUpdate label="已&nbsp;&nbsp;&nbsp;选&nbsp;&nbsp;&nbsp;择" name="tickData">
          {tickData.map((r) => {
            return (
              <Space>
                <Form.Item style={{ width: 160, overflow: 'hidden' }}>{r.ticketName}</Form.Item>
                <Form.Item style={{ width: 100, overflow: 'hidden' }} shouldUpdate label="数量" key={r.ticketCode}>
                  <InputNumber
                    style={{ width: 60, overflow: 'hidden' }}
                    onChange={(e) => {
                      change(e, r.ticketCode)
                    }}
                    defaultValue={r.ticketCount}
                    min={1}
                    step="0"
                  />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" style={{ borderRadius: 12, marginBottom: 8 }} onClick={() => click(r.ticketCode)}>
                    删除
                  </Button>
                </Form.Item>
              </Space>
            )
          })}
        </Form.Item>
      </Form>
      <Modal
        destroyOnClose={true}
        centered={true}
        title="优惠券选择"
        visible={ticketPop}
        onCancel={() => {
          setticketPop(false)
        }}
        onOk={() => {
          isTicketData()
          setticketPop(false)
        }}
        cancelText="取消"
        okText="提交"
        width={1000}
      >
        <Ticket ticketDatas={ticketDatas} />
      </Modal>
    </>
  )
}

export default chooseCoupon
