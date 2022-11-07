import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Button, Form, Input, message, InputNumber, Radio, Select, Space, Image } from 'antd'

import { connect } from 'dva'

import { updatePromotionCompany } from './service'
import { router } from 'umi'
import { getUrlParam } from '@/utils/utils'

const orgCode = getUrlParam('orgCode')
const Detail = (props) => {
  const {
    dispatch,
    spreadCompanyGoodsPriceModel: { pageSize, itemData, searchParams },
  } = props

  const [newForm] = Form.useForm()
  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 8 },
  }

  useEffect(() => {
    let data = JSON.parse(JSON.stringify(itemData))

    data.salePrices = Number(data.salePrice) / 100
    data.salePrice = Number(data.salePrice) / 100
    data.distributeRewardFee = Number(data.distributeRewardFee) / 100
    data.saleRewardFee = Number(data.saleRewardFee) / 100

    data.diySalePrice = Number(data.diySalePrice) / 100
    data.diyDistributeRewardFee = Number(data.diyDistributeRewardFee) / 100
    data.diySaleRewardFee = Number(data.diySaleRewardFee) / 100

    newForm.setFieldsValue({
      ...data,
    })
  }, [props])

  const backAdd = useCallback(() => {
    router.push({
      pathname: '/web/company/cmsmgr/goodsPrice',
    })
  }, [])

  //创建推广公司
  async function revampOnFinish(values) {
    let postData = {}
    postData['salePrice'] = Math.round(Number(values.diySalePrice) * 100)
    postData['distributeRewardFee'] = Math.round(Number(values.diyDistributeRewardFee) * 100)
    postData['saleRewardFee'] = Math.round(Number(values.diySaleRewardFee) * 100)
    postData['goodsCode'] = itemData.goodsCode
    postData['skuCode'] = itemData.skuCode
    postData['personCode'] = searchParams.distributeOrgCode

    if (Number(postData.salePrice) === 0) {
      message.warn('渠道价格不能小于等于0')
      return
    }
    if (postData.salePrice < postData.distributeRewardFee || postData.salePrice < postData.saleRewardFee) {
      message.error('渠道费和销售佣金不能大于渠道售价')
      return
    }

    let res = await updatePromotionCompany(postData)
    if (res && res.code === '0' && res.data === true) {
      message.success('修改成功')
      backAdd()
      dispatch({ type: 'spreadCompanyGoodsPriceModel/fetch' })
    } else {
      message.warn('修改失败')
    }
  }

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

  return (
    <>
      <div>
        <Form form={newForm} {...layout} onFinish={revampOnFinish}>
          <div className="fontMb">
            <Form.Item wrapperCol={{ span: 24 }}>
              <div className="marginlr20">基本信息</div>
            </Form.Item>
            <div className="newflex"></div>
            <Form.Item name="goodsName" label="商 &nbsp; &nbsp;&nbsp;品 &nbsp; &nbsp;&nbsp;名&nbsp; &nbsp; &nbsp;称">
              <Input bordered={false} disabled={true} />
            </Form.Item>

            <Form.Item name="skuName" label="规 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;格">
              <Input bordered={false} disabled={true} />
            </Form.Item>

            <Form.Item name="goodsTypeName" label="商 &nbsp; &nbsp;&nbsp;品 &nbsp;&nbsp; &nbsp;类&nbsp; &nbsp; &nbsp;型">
              <Input bordered={false} disabled={true} />
            </Form.Item>

            <Form.Item name="supplierName" label="供&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 应 &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;商">
              <Input bordered={false} disabled={true} />
            </Form.Item>

            <Form.Item name="salePrice" label="原 &nbsp; &nbsp; &nbsp;&nbsp; 价 &nbsp;&nbsp; &nbsp; &nbsp;  (元)">
              <Input bordered={false} disabled={true} />
            </Form.Item>

            <Form.Item name="distributeRewardFee" label="推 &nbsp; &nbsp;广 &nbsp; &nbsp; 费 &nbsp; (元)">
              <Input bordered={false} disabled={true} />
            </Form.Item>
            <Form.Item name="saleRewardFee" label="分  &nbsp;销  &nbsp;佣 &nbsp; 金  &nbsp;(元)">
              <Input bordered={false} disabled={true} />
            </Form.Item>

            <Form.Item name="diySalePrice" label="渠 &nbsp;&nbsp;&nbsp;道&nbsp; &nbsp;&nbsp;&nbsp;价&nbsp; &nbsp;(元)" rules={[{ required: true, message: '请输入渠道价' }]}>
              <InputNumber style={{ width: '100%' }} min={0.0} step={0.01} formatter={limitDecimals} parser={limitDecimals} />
            </Form.Item>

            <Form.Item name="diyDistributeRewardFee" label="渠&nbsp;道&nbsp;推&nbsp;广&nbsp;费(元)" rules={[{ required: true, message: '请输入渠道推广费' }]}>
              <InputNumber style={{ width: '100%' }} min={0.0} step={0.01} formatter={limitDecimals} parser={limitDecimals} />
            </Form.Item>
            <Form.Item name="diySaleRewardFee" label="渠道分销佣金(元)" rules={[{ required: true, message: '请输入渠道分销佣金' }]}>
              <InputNumber style={{ width: '100%' }} min={0.0} step={0.01} formatter={limitDecimals} parser={limitDecimals} />
            </Form.Item>

            <div style={{ marginTop: '60px' }}>
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
                  提交
                </Button>

                <Button
                  style={{
                    width: '120px',
                    marginBottom: 100,
                    borderRadius: '4px',
                  }}
                  onClick={() => backAdd()}
                  type="primary"
                >
                  返回
                </Button>
              </div>
            </div>
          </div>
        </Form>
      </div>
    </>
  )
}

export default connect(({ spreadCompanyGoodsPriceModel, loading }) => {
  return {
    spreadCompanyGoodsPriceModel,
    loadingTable: loading.effects['spreadCompanyGoodsPriceModel/fetch'],
  }
})(Detail)
