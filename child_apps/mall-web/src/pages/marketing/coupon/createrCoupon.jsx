import { Button, DatePicker, Form, Input, InputNumber, message, Modal, Radio, Select, Space } from 'antd'
import moment from 'moment'
import { getOrgKind, getToday } from '@/utils/utils'
import React, { useEffect, useState } from 'react'
import GoodsModal from '@/components/marketing/GoodsModal'
import Categoory from '@/components/marketing/Category'
import { getcreateTicket, getSysCodeByParam } from '@/services/marketing'
import { router } from 'umi'
const createrCoupon = () => {
  const [form] = Form.useForm()
  const { TextArea } = Input
  const { Option } = Select
  const { RangePicker } = DatePicker
  //有效时间显示
  const [disabled, setdisabled] = useState(true)

  //商品弹窗
  const [goodsPop, setgoodsPop] = useState(false)
  //展示的code
  const [copeCodeData, setcopeCodeData] = useState(['全品类'])
  //是否展示类目
  const [categoryPop, setcategoryPop] = useState(false)
  //卡券类型
  const [category, setcategory] = useState([])
  const [timeValue, setTimeValue] = useState(0)
  //多选项目
  const [scopeCode, setscopeCode] = useState()
  //多选项目
  const [scopeCodeData, setscopeCodeData] = useState([])
  //多选项目
  const [scopeCodeName, setscopeCodeName] = useState([])
  //使用品类
  const [scopeType, setscopeType] = useState('ALL')

  useEffect(() => {
    getcategory()
  }, [])

  //卡券类型    TICKET_TYPE
  async function getcategory() {
    let res = await getSysCodeByParam({ codeParam: 'TICKET_TYPE' })
    if (res.code === '0') {
      setcategory(res.data)
    } else {
      message.error(res.message)
    }
  }

  //品类商品的切换
  function onChange(e) {
    setscopeCode('')
    setcopeCodeData([])
    setscopeCodeData([])
    if (e.target.value === 1) {
      setscopeType('ALL')
      setcopeCodeData(['全品类'])
    }
    if (e.target.value === 2) {
      setcategoryPop(true)
      setscopeType('GOODS_GROUP')
    }

    if (e.target.value === 3) {
      setgoodsPop(true)
      setscopeType('GOODS')
    }
  }

  //商品弹窗的取消
  function goodsonCancel() {
    setscopeCode('')
    setcopeCodeData([])
    setscopeCodeData([])
    setgoodsPop(false)
  }

  //类目弹窗去取消
  function categoryCategoryPop() {
    setscopeCode('')
    setcopeCodeData([])
    setscopeCodeData([])
    setcategoryPop(false)
  }

  //新建卡券
  async function newOnFinish(values) {
    values['scopeType'] = scopeType
    values['scopeCodes'] = scopeCode

    if (Number(values.ticketJsonStrTwo) > Number(values.ticketJsonStrOne)) {
      message.warn('满减金额不能大于总金额')
      return
    }
    if (Number(values.ticketJsonStrTwo) == Number(values.ticketJsonStrOne)) {
      message.warn('满减金额不能等于总金额')
      return
    }
    values['ticketJsonStr'] = [values.ticketJsonStrOne, values.ticketJsonStrTwo]

    delete values.ticketJsonStrOne
    delete values.ticketJsonStrTwo

    if (!values['times']) {
      values['expireType'] = 'VALID_DAYS'
      if (timeValue) {
        values['expireType'] = 'NEXT_VALID_DAYS'
      }
    } else {
      values['effectDate'] = values['times'][0].format('YYYY-MM-DD')
      values['expireDate'] = values['times'][1].format('YYYY-MM-DD')
      values['expireType'] = 'EXPIRE_DATE'
      delete values.times
    }

    for (let key in values) {
      if (values[key] instanceof Array) {
        values[key] = values[key].join(',')
      }
    }
    for (let key in values) {
      if (values[key] == undefined) {
        delete values[key]
      }
    }

    let res = await getcreateTicket(values)

    if (res.code === '0') {
      setcopeCodeData([])
      router.push('/web/company/business/ticketmgr')
    } else {
      message.error(res.message)
    }
  }

  //goodsData商品组件数据
  function goodsDatas(value, data) {
    setscopeCode(value)
    setscopeCodeData(data)
  }
  function goodsName(value, data) {
    setcopeCodeData(value)
    setscopeCodeName(data)
  }
  //category类目组件数据
  function categoryDatas(value, data) {
    setscopeCode(value)
    setscopeCodeData(data)
  }
  const categoryNames = (value, data) => {
    setcopeCodeData(value)
    setscopeCodeName(data)
  }
  //
  const timeChange = (e) => {
    if (e.target.value !== 2) {
      setdisabled(true)
    } else {
      setdisabled(false)
    }
    setTimeValue(e.target.value)
  }

  const getPopId = () => {
    let id = form.getFieldValue('popId')
    if (id === 1) {
      setscopeType('ALL')
      message.warn('已选择全品类无需继续添加')
    }
    if (id === 2) {
      setcategoryPop(true)
      setscopeType('GOODS_GROUP')
    }
    if (id === 3) {
      setgoodsPop(true)
      setscopeType('GOODS')
    }
  }

  return (
    <>
      <div>
        <Form form={form} onFinish={newOnFinish}>
          <div className="fontMb">
            <Form.Item>
              <div className="marginlr20">基本信息</div>
            </Form.Item>
            <div className="newflex">
              <Form.Item label="卡券类型" name="ticketType" required rules={[{ required: true, message: '请选择卡券类型' }]} style={{ width: 560 }}>
                <Select showArrow={true} placeholder="请选择" allowClear={true}>
                  {category.map((r) => (
                    <Option key={r.codeKey} value={r.codeKey}>
                      {r.codeValue}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item label="卡券名称" name="ticketName" style={{ width: 560 }} required rules={[{ required: true, message: '请输入' }]}>
                <Input />
              </Form.Item>

              <div style={{ position: 'relative' }}>
                <Space>
                  <div style={{ position: 'absolute', left: '94px', top: '6px' }}>满</div>
                  <Form.Item
                    required
                    rules={[{ required: true, message: '请输入满减面额' }]}
                    label="面&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;额"
                    name="ticketJsonStrOne"
                    style={{
                      marginBottom: '15px',
                    }}
                  >
                    <InputNumber min={0.01} style={{ marginLeft: '36px', width: '195px' }} />
                  </Form.Item>
                  <div style={{ marginBottom: '12px' }}>元减</div>
                  <Form.Item
                    name="ticketJsonStrTwo"
                    required
                    rules={[{ required: true, message: '请输入满减面额' }]}
                    style={{
                      marginBottom: '15px',
                    }}
                  >
                    <InputNumber min={0.01} style={{ width: '195px' }} />
                  </Form.Item>
                  <div style={{ marginBottom: '12px' }}>元</div>
                </Space>
              </div>
              <Form.Item label="适用品类" required rules={[{ required: true, message: '请选择适用品类' }]} style={{ width: 560 }}>
                <Form.Item noStyle name="popId" initialValue={1}>
                  <Radio.Group onChange={onChange}>
                    <Radio value={1}>全品类</Radio>
                    <Radio value={2}>选择品类</Radio>
                    <Radio value={3}>选择商品</Radio>
                  </Radio.Group>
                </Form.Item>
                <Button
                  type="primary"
                  onClick={() => {
                    getPopId()
                  }}
                  style={{ borderRadius: 8 }}
                >
                  继续添加
                </Button>
              </Form.Item>

              <Form.Item
                label="已&nbsp;&nbsp;选&nbsp;&nbsp;择"
                style={{
                  marginBottom: '15px',
                  width: '550px',
                  marginRight: '-8px',
                }}
              >
                <TextArea value={copeCodeData} rows={4} />
              </Form.Item>

              <Form.Item
                required
                rules={[{ required: true, message: '请输入有效期' }]}
                label="有效期(天)"
                style={{
                  marginBottom: '15px',
                  marginRight: '0px',
                  width: '574px',
                }}
              >
                <Radio.Group style={{ marginTop: '8px' }} defaultValue={0} onChange={timeChange}>
                  <Radio value={0}>当日生效</Radio>
                  <Radio value={1}>次日生效</Radio>
                  <Radio value={2}>选择日期</Radio>

                  {disabled ? (
                    <Form.Item required rules={[{ required: true, message: '请输入时间' }]} style={{ marginTop: '20px' }} label="" name="vaildDays">
                      <InputNumber precision={0} min={1} style={{ width: 484 }} />
                    </Form.Item>
                  ) : (
                    <Form.Item
                      style={{ marginTop: '20px' }}
                      required
                      rules={[{ required: true, message: '请选择活动时间' }]}
                      name="times"
                      initialValue={[moment(getToday(), 'YYYY/MM/DD'), moment(getToday(), 'YYYY/MM/DD')]}
                    >
                      <RangePicker
                        style={{ width: 484 }}
                        allowClear={false}
                        // disabledDate={disabledDate}
                        defaultPickerValue={[moment(getToday(), 'YYYY/MM/DD'), moment(getToday(), 'YYYY/MM/DD')]}
                        defaultValue={[moment(getToday(), 'YYYY/MM/DD'), moment(getToday(), 'YYYY/MM/DD')]}
                      />
                    </Form.Item>
                  )}
                </Radio.Group>
              </Form.Item>

              <Form.Item
                label="使用范围说明"
                required
                rules={[{ required: true, message: '请输入说明' }]}
                name="remark"
                style={{
                  marginBottom: '15px',
                  marginRight: 20,
                  width: '582px',
                }}
              >
                <TextArea rows={4} />
              </Form.Item>
            </div>

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
                  onClick={() => {
                    router.push('/web/company/business/ticketmgr')
                  }}
                  type="primary"
                >
                  返回
                </Button>
              </div>
            </div>
          </div>
        </Form>
      </div>

      <Modal
        destroyOnClose={true}
        centered={true}
        title="商品选择"
        visible={goodsPop}
        onCancel={() => {
          goodsonCancel()
        }}
        onOk={() => {
          setgoodsPop(false)
        }}
        cancelText="取消"
        okText="提交"
        width={1000}
      >
        <GoodsModal scopeCodeData={scopeCodeData} scopeCodeName={scopeCodeName} goodsDatas={goodsDatas} goodsNames={goodsName} />
      </Modal>

      <Modal
        destroyOnClose={true}
        centered={true}
        title="类目选择"
        visible={categoryPop}
        onCancel={categoryCategoryPop}
        onOk={() => {
          setcategoryPop(false)
        }}
        cancelText="取消"
        okText="提交"
        width={1000}
      >
        <Categoory scopeCodeData={scopeCodeData} scopeCodeName={scopeCodeName} categoryDatas={categoryDatas} categoryNames={categoryNames} />
      </Modal>
    </>
  )
}

export default createrCoupon
