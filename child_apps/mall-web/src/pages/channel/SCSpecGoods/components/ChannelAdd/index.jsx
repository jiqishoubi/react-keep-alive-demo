import { Form, Input, InputNumber, Modal, Radio, Table } from 'antd'
import React, { useEffect, useState } from 'react'
import { useGetRow } from '@/hooks/useGetRow'

const limitDecimals = (value) => {
  const reg = /^(\-)*(\d+)\.(\d\d).*$/
  if (typeof value === 'string') {
    return !isNaN(Number(value)) ? value.replace(reg, '$1$2.$3') : ''
  } else if (typeof value === 'number') {
    return !isNaN(value) ? String(value).replace(reg, '$1$2.$3') : ''
  } else {
    return ''
  }
}

const Channel = (props) => {
  const [channelForm] = Form.useForm()
  const [data, setdata] = useState([])
  const [tableShow, setTableShow] = useState(props.ifHave)

  useEffect(() => {
    if (!props.channelData) return

    if (props.ifHave) {
      channelForm.setFieldsValue({ isHave: '0' })
      setTableShow(true)
    } else {
      channelForm.setFieldsValue({ isHave: '1' })
      setTableShow(false)
    }

    let data = JSON.parse(JSON.stringify(props.channelData))

    if (data.length > 0) {
      data.map((r) => {
        r.salePrice = Number(r.salePrice / 100)
        r.distributeRewardFee = Number(r.distributeRewardFee / 100)
        r.saleRewardFee = Number(r.saleRewardFee / 100)
        r.diySalePrice = Number(r.diySalePrice / 100)
        r.diyDistributeRewardFee = Number(r.diyDistributeRewardFee / 100)
        r.diySaleRewardFee = Number(r.diySaleRewardFee / 100)
        r['show'] = false
      })
    }
    setdata(data)
    channelForm.setFieldsValue({
      name: data[0].goodsName,
    })
  }, [props.channelData])

  const onOk = () => {
    if (tableShow) {
      revampPrice()
    } else {
      deletePrice()
    }
  }

  //设置渠道价
  const revampPrice = () => {
    channelForm.validateFields().catch((error) => {
      return
    })
    let values = channelForm.getFieldsValue()

    let o = {}
    for (let i in values) {
      let keyObj = {}
      let keys = i.split('_')[1]
      if (keys === 'diySalePrice') {
        keys = 'salePrice'
      } else if (keys === 'diyDistributeRewardFee') {
        keys = 'distributeRewardFee'
      } else if (keys === 'diySaleRewardFee') {
        keys = 'saleRewardFee'
      }
      let value = Math.round(Number(values[i]) * 100)

      keyObj[keys] = value
      o[i.split('_')[0]] = { ...o[i.split('_')[0]], ...keyObj }
    }

    let valueData = []
    for (let i = 0; i < data.length; i++) {
      if (o[data[i].skuCode]) {
        let valueItem = { ...o[data[i].skuCode] }
        valueItem['goodsCode'] = data[i].goodsCode
        valueItem['skuCode'] = data[i].skuCode
        valueItem['personCode'] = props.personCode
        valueItem['personType'] = 'ORG'
        valueData.push(valueItem)
      }
    }

    valueData = JSON.stringify(valueData)
    props.onOk(valueData)
  }

  //取消渠道价
  const deletePrice = () => {
    let values = {}
    values['goodsCode'] = data[0].goodsCode
    values['personCode'] = props.personCode
    props.onCancel(values)
  }

  //控制操作按钮
  const add = (e, boo) => {
    let addData = JSON.parse(JSON.stringify(data))
    addData.map((r) => {
      if (r.skuCode === e) {
        r['show'] = boo
      }
    })

    setdata(addData)
  }

  const columns = [
    {
      title: '规格名',
      dataIndex: 'skuName',
      align: 'center',
    },
    {
      title: '原价(元)',
      dataIndex: 'salePrice',
      align: 'center',
    },
    {
      title: '渠道费(元)',
      dataIndex: 'distributeRewardFee',
      align: 'center',
    },
    {
      title: '分销佣金(元)',
      dataIndex: 'saleRewardFee',
      align: 'center',
    },
    {
      title: '渠道价(元)',
      // dataIndex:'diySalePrice',
      align: 'center',
      width: 140,
      render: (e) => {
        return (
          <>
            {e.show ? (
              <Form.Item initialValue={e.diySalePrice} name={`${e.skuCode}_diySalePrice`} style={{ marginBottom: 0 }}>
                <InputNumber min={0.0} step={0.01} formatter={limitDecimals} parser={limitDecimals} />
              </Form.Item>
            ) : (
              e.diySalePrice
            )}
          </>
        )
      },
    },
    {
      title: '渠道推广费(元)',
      align: 'center',
      width: 140,
      render: (e) => {
        return (
          <>
            {e.show ? (
              <Form.Item initialValue={e.diyDistributeRewardFee} name={`${e.skuCode}_diyDistributeRewardFee`} style={{ marginBottom: 0 }}>
                <InputNumber min={0.0} step={0.01} formatter={limitDecimals} parser={limitDecimals} />
              </Form.Item>
            ) : (
              e.diyDistributeRewardFee
            )}
          </>
        )
      },
    },
    {
      title: '渠道分销佣金(元)',
      align: 'center',
      width: 180,
      render: (e) => {
        return (
          <>
            {e.show ? (
              <Form.Item initialValue={e.diySaleRewardFee} name={`${e.skuCode}_diySaleRewardFee`} style={{ marginBottom: 0 }}>
                <InputNumber min={0.0} step={0.01} formatter={limitDecimals} parser={limitDecimals} />
              </Form.Item>
            ) : (
              e.diySaleRewardFee
            )}
          </>
        )
      },
    },
    {
      title: '操作',
      align: 'center',
      render: (e) => {
        return (
          <>
            {e.show ? (
              <a
                onClick={() => {
                  add(e.skuCode, false)
                }}
              >
                取消
              </a>
            ) : (
              <a
                onClick={() => {
                  add(e.skuCode, true)
                }}
              >
                修改
              </a>
            )}
          </>
        )
      },
    },
  ]

  //配置被点击
  const radioChange = (e) => {
    if (e.target.value == '1') {
      setTableShow(false)
    } else {
      setTableShow(true)
    }
  }

  return (
    <>
      <Modal
        destroyOnClose={true}
        title="配置渠道价"
        onCancel={() => {
          props.closeModal()
        }}
        onOk={onOk}
        visible={props.visible}
        width="1200px"
        className="positionre"
      >
        <>
          <Form preserve={false} form={channelForm}>
            <Form.Item label="是否配置渠道价" name="isHave">
              <Radio.Group onChange={radioChange}>
                <Radio value="0">是</Radio>
                <Radio value="1">否</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item label="商品名称" name="name">
              <Input disabled={true} bordered={false} />
            </Form.Item>
            {tableShow ? <Table rowKey="id" rowClassName={useGetRow} style={{ margin: '23px  20px' }} columns={columns} dataSource={data} pagination={false} /> : null}
          </Form>
        </>
      </Modal>
    </>
  )
}
export default Channel
