import { Form, Button, Modal, Input, Space, Select, message, InputNumber } from 'antd'
import React, { useEffect, useState } from 'react'

import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'

import AddModal from '@/pages/channel/components/DistributionUsers/addModal'
import requestw from '@/utils/requestw'

import { submitProfitConfig } from '@/services/channel'

const { Option } = Select

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

const Revamp = (props) => {
  const [form] = Form.useForm()
  const [selectData, setSelectData] = useState([])

  const onFinish = (values) => {}

  useEffect(() => {
    getItem()
    form.setFieldsValue({
      distributeProfitConfigListJsonStr: props.soleData,
    })
  }, [props.soleData])

  const getItem = async () => {
    return new Promise(async (resolve) => {
      const res = await requestw({
        url: '/web/goods/getAllGoodsList',
      })
      if (res && res.code == '0' && res.data) {
        let data = res.data || []
        data.unshift({
          goodsName: '所有商品',
          goodsCode: 'ZZZZZZ',
        })
        setSelectData(data)
      }
      resolve()
    })
  }

  const onOk = () => {
    revampPrice()
  }

  //设置渠道价
  const revampPrice = async () => {
    form.validateFields().catch((error) => {
      return
    })

    let values = form.getFieldsValue()
    // if (!values.distributeProfitConfigListJsonStr.length) {
    //   message.warn('请选择配置商品');
    //   return;
    // }

    let keysData = []
    values.distributeProfitConfigListJsonStr.map((r) => {
      if (keysData.indexOf(r.goodsCode) === -1) {
        keysData.push(r.goodsCode)
      } else {
        message.warn('存在重复的商品，请核查')
        return
      }
    })

    let ratioData = JSON.parse(JSON.stringify(props.soleData))
    let ratioDataKeys = []
    props.soleData.map((r) => {
      ratioDataKeys.push(r.goodsCode)
    })

    let newData = JSON.parse(JSON.stringify(values.distributeProfitConfigListJsonStr))

    newData.map((r) => {
      let number = ratioDataKeys.indexOf(r.goodsCode)
      if (ratioDataKeys.indexOf(r.goodsCode) === -1) {
        r['profitConfigCode'] = ''
      } else {
        let ratioItem = ratioData[number]
        if (
          Number(ratioItem.distributeHeadRewardPct) === Number(r.distributeHeadRewardPct) &&
          Number(ratioItem.distributeChildRewardPct) === Number(r.distributeChildRewardPct) &&
          Number(ratioItem.sale1stRewardPct) === Number(r.sale1stRewardPct) &&
          Number(ratioItem.sale2ndRewardPct) === Number(r.sale2ndRewardPct)
        ) {
          r['profitConfigCode'] = ratioItem.profitConfigCode
        } else {
          r['profitConfigCode'] = ''
        }
      }
    })

    newData = JSON.stringify(newData)
    const postData = {
      distributeCode: props.soleCode,
      distributeProfitConfigListJsonStr: newData,
    }

    let res = await submitProfitConfig(postData)
    if (res && res.code === '0') {
      message.success(res.message)
      props.closeModal(true)
    } else {
      message.error(res.message)
    }
  }

  const itemOnChange = (valueObj) => {}

  const SelectItemFromTableProps = {
    selectData: selectData,
    distributeCode: props.soleDistributeOrgCode,
    text: '全部商品列表',
    disabled: false,
    api: '/web/goods/getGoodsInfoList',
    selectItemFromTableProps: undefined,
    inputValKey: 'goodsName',
    inputCodeKey: 'goodsCode',
    onChange: itemOnChange,
    title: '商品',
    columns: [
      {
        title: '商品名称',
        align: 'center',
        dataIndex: 'goodsName',
        width: 300,
      },
      {
        title: '商品类型',
        align: 'center',
        dataIndex: 'goodsTypeName',
      },
      {
        dataIndex: 'goodsExist',
        title: '是否专营',
        align: 'center',
      },
    ],
  }

  return (
    <>
      <Modal
        destroyOnClose={true}
        title="分销分润"
        onCancel={() => {
          props.closeModal()
        }}
        onOk={onOk}
        visible={props.visible}
        width="1300px"
        className="positionre"
      >
        <>
          <Form form={form} onFinish={onFinish} autoComplete="off">
            <Form.List name="distributeProfitConfigListJsonStr">
              {(fields, { add, remove }) => (
                <>
                  <Form.Item>
                    <Button type="primary" size="middle" style={{ marginRight: 10 }} onClick={() => add()} icon={<PlusOutlined />}>
                      创建分润
                    </Button>
                    <Button type="primary" size="middle" onClick={() => props.getProfitConfigList_(props.soleCode)}>
                      重置
                    </Button>
                  </Form.Item>
                  {fields.map((field) => (
                    <Space key={field.key} align="baseline">
                      <Form.Item label="商品名称" name={[field.name, 'goodsCode']} fieldKey={[field.fieldKey, 'goodsCode']} style={{ width: 310 }} rules={[{ required: true, message: '请选择' }]}>
                        <AddModal {...SelectItemFromTableProps} />
                      </Form.Item>

                      <Form.Item
                        {...field}
                        label="推广公司费用比例(%)"
                        name={[field.name, 'distributeHeadRewardPct']}
                        fieldKey={[field.fieldKey, 'distributeHeadRewardPct']}
                        rules={[{ required: true, message: '请输入' }]}
                      >
                        <InputNumber style={{ width: 68 }} min={0} max={100} />
                      </Form.Item>
                      <Form.Item
                        {...field}
                        label="推广人费用比例(%)"
                        name={[field.name, 'distributeChildRewardPct']}
                        fieldKey={[field.fieldKey, 'distributeChildRewardPct']}
                        rules={[{ required: true, message: '请输入' }]}
                      >
                        <InputNumber style={{ width: 68 }} min={0} max={100} />
                      </Form.Item>
                      <Form.Item
                        {...field}
                        label="一级合伙人佣金比例(%)"
                        name={[field.name, 'sale1stRewardPct']}
                        fieldKey={[field.fieldKey, 'sale1stRewardPct']}
                        rules={[{ required: true, message: '请输入' }]}
                      >
                        <InputNumber style={{ width: 68 }} min={0} max={100} />
                      </Form.Item>
                      <Form.Item
                        {...field}
                        label="二级合伙人佣金比例(%)"
                        name={[field.name, 'sale2ndRewardPct']}
                        fieldKey={[field.fieldKey, 'sale2ndRewardPct']}
                        rules={[{ required: true, message: '请输入' }]}
                      >
                        <InputNumber style={{ width: 68 }} min={0} max={100} />
                      </Form.Item>
                      <MinusCircleOutlined onClick={() => remove(field.name)} />
                    </Space>
                  ))}
                </>
              )}
            </Form.List>
          </Form>
        </>
      </Modal>
    </>
  )
}
export default Revamp
