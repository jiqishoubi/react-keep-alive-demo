import React, { useState, useEffect, useCallback, useRef } from 'react'
import { connect } from 'dva'
import { Tabs, Button, message, Row, Col } from 'antd'
import NewCorp from '@/pages/channel/components/NewCorp'
import Merchant from '@/pages/channel/components/Merchant'
import Applets from '@/pages/channel/components/Applets'
import { supplierGetList, getOrgInfo, insertBase, updateBase, updateMchBase, updateWxBase } from '@/pages/channel/SpreadCompany/service'
import { router } from 'umi'
import { getUrlParam, getOrgKind } from '@/utils/utils'

const listUrl = getOrgKind().isAdmin ? '/web/system/distributemgr/promotioncompanymgr' : '/web/staff/distributemgr/promotioncompanymgr'

const Detail = (props) => {
  const { TabPane } = Tabs
  const { dispatch } = props

  const newCorpRef = useRef()
  const merchantRef = useRef()
  const appletsRef = useRef()

  const [isEdit, setIsEdit] = useState(false)
  const [supplierList, setSupplierList] = useState([])
  const [butLoading, setButLoading] = useState(false)
  const [recordData, setRecordData] = useState({})
  const [activeKey, setActiveKey] = useState('1')
  const [orgCode, setOrgCode] = useState(getUrlParam('orgCode') || '')

  const backAdd = useCallback(() => {
    router.push(listUrl)
    setTimeout(() => {
      dispatch({ type: 'spreadCompanyMngModel/fetch' })
    }, 0)
  }, [])

  //创建推广公司
  async function createonFinish() {
    const url = ['', insertBase, updateMchBase, updateWxBase]
    const upUrl = ['', updateBase, updateMchBase, updateWxBase]
    let values
    activeKey === '1' ? (values = await newCorpRef.current?.validateFields()) : ''
    activeKey === '2' ? (values = await merchantRef.current?.validateFields()) : ''
    activeKey === '3' ? (values = await appletsRef.current?.validateFields()) : ''

    if (activeKey === '1') {
      values['freightOverFee'] = values.freightOverFeeStr && values.freightOverFeeStr * 100
      values['freightFee'] = values.freightFeeStr && values.freightFeeStr * 100
    }
    for (let key in values) {
      if (values[key] instanceof Array) {
        values[key] = values[key].join(',')
      }
    }
    values.specialWeCharCode ? (values['weCharCode'] = values.specialWeCharCode) : null

    setButLoading(true)
    let res
    if (isEdit) {
      let link = upUrl[Number(activeKey)]
      //编辑
      res = await link({
        orgCode,
        ...values,
      })
    } else {
      let link = url[Number(activeKey)]
      //新建
      res = await link({
        orgCode,
        ...values,
      })
    }
    setButLoading(false)
    if (res && res.code === '0') {
      res.data.orgCode ? setOrgCode(res.data.orgCode) : ''
      //成功
      message.success(res.message || '成功')
      if (activeKey !== '3') {
        setActiveKey((Number(activeKey) + 1).toString())
      } else {
        backAdd()
      }
    } else {
      //失败
      message.error(res.message)
    }
  }

  //点击保存
  const clickSubmit = async () => {
    createonFinish()
  }
  //点击取消
  const closeClick = () => {
    if (isEdit) {
      if (activeKey !== '1') {
        setActiveKey((Number(activeKey) - 1).toString())
      } else {
        router.push(listUrl)
      }
    } else {
      router.push(listUrl)
    }
  }
  //编辑回显
  async function renderBack() {
    let res = await getOrgInfo({ orgCode: orgCode })
    let record
    if (res && res.code === '0') {
      record = res.data
    }
    //处理一下源数据
    record['catchOutMethod'] = record.catchOutMethod == 'ALIPAY' ? '1' : '0'
    record['specialWeCharCode'] = record.ifTyWxMch == 1 ? record.weCharCode : null
    record['scode'] = record.scode ? (window.isProd ? '' : `http://saash5.bld365.com/#/pages/h5/index?scode=${record.scode}`) : ''
    record.hotWordStr = record.hotWordStr?.split(',')
    setRecordData(record)
    //处理一下源数据 end
    newCorpRef.current?.setFieldsValue(record)
    merchantRef.current?.setFieldsValue(record)
    appletsRef.current?.setFieldsValue(record)
  }

  useEffect(() => {
    //编辑回显
    if (getUrlParam('isEdit')) {
      setIsEdit(true)
      renderBack()
    }
    supplierGetList_()
  }, [activeKey])
  //供应商数据
  const supplierGetList_ = async () => {
    let res = await supplierGetList()
    if (res && res.code === '0') {
      let data = res.data
      data.map((r) => {
        r['label'] = r.orgName
        r['value'] = r.orgCode
      })
      setSupplierList(data)
    }
  }
  const tabChange = (e) => {
    setActiveKey(e)
  }

  /**
   * 渲染
   */

  return (
    <>
      <div style={{ width: '94%', margin: '0 auto' }}>
        <Tabs disabled={isEdit} activeKey={activeKey} onChange={tabChange}>
          <TabPane tab="基本信息" key="1" disabled={!isEdit}>
            <NewCorp ref={newCorpRef} props={props} isEdit={isEdit} supplierList={supplierList} recordData={recordData} orgCode={orgCode} />
          </TabPane>
          <TabPane tab="商户信息" key="2" disabled={!isEdit}>
            <Merchant ref={merchantRef} props={props} isEdit={isEdit} supplierList={supplierList} recordData={recordData} orgCode={orgCode} />
          </TabPane>
          <TabPane tab="小程序信息" key="3" disabled={!isEdit}>
            <Applets ref={appletsRef} props={props} isEdit={isEdit} supplierList={supplierList} recordData={recordData} orgCode={orgCode} />
          </TabPane>
        </Tabs>

        <div style={{ marginTop: '60px' }}>
          <Row>
            <Col offset={8}>
              <Button
                style={{
                  marginRight: '100px',
                  width: '120px',
                  marginBottom: 100,
                  borderRadius: '4px',
                }}
                onClick={closeClick}
              >
                {(isEdit && activeKey !== '1' && '返回上一步') || '取消'}
              </Button>
            </Col>
            <Col>
              <Button onClick={clickSubmit} type="primary" style={{ width: '120px', borderRadius: '4px' }} size="middle" loading={butLoading}>
                {(activeKey === '1' && '去配置商户') || (activeKey === '2' && '去配置小程序') || (activeKey === '3' && '完成')}
              </Button>
            </Col>
          </Row>
        </div>
      </div>
    </>
  )
}

export default connect(({ spreadCompanyMngModel, loading }) => {
  return {
    spreadCompanyMngModel,
    loadingTable: loading.effects['spreadCompanyMngModel/fetch'],
  }
})(Detail)
