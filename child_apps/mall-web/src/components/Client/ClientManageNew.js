import React, { useState } from 'react'

import { Form, Radio, Input, Select, Button, message } from 'antd'
import { getcreateMember } from '@/services/client'
import { CaretDownOutlined } from '@ant-design/icons'
import { useForm } from 'antd/es/form/Form'

function clientManageNew(props) {
  const [disabled, setdisabled] = useState(false)

  const [disableds, setdisableds] = useState(true)
  const [form] = Form.useForm()
  //续费时间
  const newtime = [
    { VALUE: '1', KEY: '一年' },
    { VALUE: '2', KEY: '二年' },
    { VALUE: '3', KEY: '三年' },
  ]

  async function onFinish(values) {
    delete values.time

    if (values.memberType === 'STAFF') {
      delete values.timeSlot
    }

    for (let key in values) {
      if (values[key] == undefined) {
        delete values[key]
      }
    }
    let res = await getcreateMember(values)
    if (res && res.code === '0') {
      message.success(res.message)
      props.onChangeNew('0')
    } else {
      message.error(res.message)
    }
  }
  return (
    <>
      <div>
        <Form form={form} onFinish={onFinish}>
          <div className="fontMb">
            <Form.Item>
              <div className="marginlr20">基本信息</div>
            </Form.Item>
            <div className="newflex">
              <Form.Item label="标&nbsp;记&nbsp;身&nbsp;份" name="memberType" required rules={[{ required: true, message: '请选择' }]} style={{ width: 400 }} initialValue="STAFF">
                <Radio.Group name="time">
                  <Radio
                    onChange={() => {
                      setdisableds(true), setdisabled(false)
                      form.setFieldsValue({ time: 1 })
                    }}
                    style={{ marginLeft: 30 }}
                    value={'STAFF'}
                  >
                    员工
                  </Radio>
                  <Radio
                    onChange={() => {
                      setdisabled(true), setdisableds(false)
                      form.setFieldsValue({ time: 2 })
                    }}
                    value={'PRIVATE_MEMBER'}
                  >
                    plus会员
                  </Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item label="客&nbsp;户&nbsp;名&nbsp;单" name="personCode" required rules={[{ required: true, message: '请选择' }]} style={{ width: 400 }}>
                <Input style={{ width: 200, marginLeft: 30 }} placeholder="请输入客户ID" />
              </Form.Item>
              <Form.Item label="身份有效期" name="time" required rules={[{ required: true, message: '请选择' }]} style={{ width: 400 }} initialValue={1}>
                <Radio.Group>
                  <Radio disabled={disabled} style={{ marginLeft: 28 }} value={1}>
                    长期
                  </Radio>
                  <Radio disabled={disableds} value={2}>
                    定期
                  </Radio>
                  {disabled ? (
                    <Form.Item name="timeSlot">
                      <Select
                        showArrow={true}
                        style={{
                          width: 200,
                          marginLeft: '30px',
                          marginTop: '10px',
                        }}
                        placeholder="请选择"
                        required
                        rules={[{ required: true, message: '请选择' }]}
                        allowClear={true}
                      >
                        {newtime.map((r) => (
                          <Option key={r.KEY} value={r.VALUE}>
                            {r.KEY}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  ) : (
                    ''
                  )}
                </Radio.Group>
              </Form.Item>
            </div>
            <div style={{ marginTop: '60px' }}>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Button
                  style={{
                    width: '120px',
                    marginRight: '88px',
                    borderRadius: '4px',
                    marginBottom: 80,
                  }}
                  onClick={() => {
                    props.onChangeNew('1')
                  }}
                >
                  返回
                </Button>
                <Button
                  type="primary"
                  style={{
                    width: '120px',
                    marginRight: '100px',
                    borderRadius: '4px',
                  }}
                  size="middle"
                  htmlType="submit"
                >
                  确定
                </Button>
              </div>
            </div>
          </div>
        </Form>
      </div>
    </>
  )
}
export default clientManageNew
