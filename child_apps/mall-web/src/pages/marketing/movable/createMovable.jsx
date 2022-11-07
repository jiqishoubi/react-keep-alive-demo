import { Form, DatePicker, Input, Select, Space, Button, Radio, Table, Modal, message, InputNumber, Row, Col } from 'antd'

import React, { useEffect, useRef, useState } from 'react'

import moment from 'moment'
import { getToday, haveCtrlElementRight } from '@/utils/utils'
import { getActiveList, updateActive, getSysCodeByParam, getcreateActive, getActiveInfo } from '@/services/marketing'
import GoodsModal from '@/components/marketing/GoodsModal'
import Categoory from '@/components/marketing/Category'
import SkuModal from '@/components/marketing/SkuModal'
import DistributeModal from '@/components/marketing/DistributeModal'
import ChooseCoupon from '../components/chooseCoupon'
import Ticket from '@/components/marketing/Ticket'
import { router } from 'umi'
import BUpload from '@/components/BUpload'
import api_common from '@/services/api/common'

function createMovable(props) {
  const [form] = Form.useForm()
  const { TextArea } = Input
  const { Option } = Select

  //立减
  const [activeFeeshow, setactiveFeeshow] = useState(true)
  //百分比
  const [activePctshow, setactivePctshow] = useState(true)
  //活动类型
  const [movableType, setmovableType] = useState([])
  //适用品类
  const [category, setcategory] = useState([])

  //活动优惠
  const [favourable, setfavourable] = useState([])
  //商品弹窗
  const [goodsPop, setgoodsPop] = useState(false)

  //多选项目
  const [scopeCode, setscopeCode] = useState()

  //满减券
  const [ticketCode, setticketCode] = useState()
  //展示的code
  const [copeCodeData, setcopeCodeData] = useState([])
  //类目弹窗的数据
  //是否展示类目
  const [categoryPop, setcategoryPop] = useState(false)
  //sku选择数据
  //是否sku类目
  const [skuPop, setskuPop] = useState(false)
  //优惠展示
  const [discount, setdiscount] = useState(true)
  //满减展示
  const [reduction, setreduction] = useState(false)
  //派发人的展示
  //是否distribute
  const [distributePop, setdistributePop] = useState(false)
  ///派送人deliverer input展示
  const [deliverer, setdeliverer] = useState()

  //优惠券 input展示
  const [ticket, setticket] = useState()
  //是否优惠券
  const [ticketPop, setticketPop] = useState(false)
  //会员 member
  const [member, setmember] = useState(false)
  const [reductionShow, setreductionShow] = useState(false)

  // 新建弹窗
  const [activeType, setactiveType] = useState('')
  const { RangePicker } = DatePicker
  //活动详情
  const [activeInfo, setActiveInfo] = useState({})

  //获取活动类型
  async function getSysCode() {
    let code = { codeParam: 'ACTIVE_TYPE' }
    let res = await getSysCodeByParam(code)
    if (res && res.code === '0') {
      setmovableType(res.data)
    } else {
      message.error(res.message)
    }
  }

  //活动优惠
  async function getfavourable() {
    let res = await getSysCodeByParam({ codeParam: 'ACTIVE_MODE' })
    if (res && res.code === '0') {
      let data = res.data.splice(1, 2)
      setfavourable(data)
    } else {
      message.error(res.message)
    }
  }

  //适用品类  ACTIVE_SCOPE_TYPE
  async function getcategory() {
    let res = await getSysCodeByParam({ codeParam: 'ACTIVE_SCOPE_TYPE' })
    if (res && res.code === '0') {
      let data = res.data.splice(0, 4)
      setcategory(data)
    } else {
      message.error(res.message)
    }
  }

  //初始化（获取活动类型）
  useEffect(() => {
    getSysCode()
    getfavourable()
    getcategory()
  }, [])
  //初始化（获取活动类型）
  useEffect(() => {
    if (props.location.query.activeCode) {
      getActiveInfo_(props.location.query.activeCode)
    }
  }, [props])

  const getActiveInfo_ = async (code) => {
    let res = await getActiveInfo({ activeCode: code })
    if (res && res.code === '0') {
      changeCode(res.data.activeType)

      let infoData = res.data
      infoData.times = [moment(res.data.effectDate), moment(res.data.expireDate)]
      setActiveInfo(infoData)
      form.setFieldsValue({
        ...infoData,
      })
    }
  }

  //活动类型和使用品类联动
  function changeCode(e) {
    setactiveType(e)
    if (e === 'INSIDE_SALE' || e === 'PRIVATE_MEMBER') {
      setdiscount(true)
      setreduction(false)
      setmember(false)
      setreductionShow(false)
    } else if (e === 'TICKET_SHARE') {
      setdiscount(false)
      setreduction(true)
      setreductionShow(true)
      setmember(false)
    } else if (e === 'LOGIN_GIFT' || e === 'SHARE_GIFT' || e === 'LUCK_DRAW_GIFT') {
      setdiscount(false)
      setreduction(true)
      setreductionShow(true)
      setmember(true)
    } else {
      setdiscount(false)
      setreduction(true)
      setreductionShow(false)
      setmember(true)
    }
  }

  //新建活动
  async function newOnFinish(values) {
    values['scopeCode'] = scopeCode
    values['ticketCode'] = ticketCode
    if (!values['activeMode']) {
      values['activeMode'] = 0
    }

    if (values.times) {
      values.effectDate = moment(values.times[0]).format('YYYY-MM-DD')
      values.expireDate = moment(values.times[1]).format('YYYY-MM-DD')
    }
    delete values.times

    let res
    if (props.location.query.activeCode) {
      values['activeCode'] = props.location.query.activeCode
      res = await updateActive(values)
    } else {
      res = await getcreateActive(values)
    }

    if (res && res.code === '0') {
      setcopeCodeData([])
      setticket([])
      setdeliverer([])
      message.success('成功')
      callBack()
    } else {
      message.error(res.message)
    }
  }

  //适用类型的操作
  async function onChange(e) {
    if (e === 'ALL') {
      setscopeCode('ALL')
      setcopeCodeData('全品类')
    }
    if (e === 'GOODS') {
      setgoodsPop(true)
    }

    if (e === 'GOODS_GROUP') {
      setcategoryPop(true)
    }
    // TICKET_SHARE_DISTRIBUTE_USER
    if (e === 'GOODS_SKU') {
      setskuPop(true)
    }
  }

  //活动优惠改变时候的处理
  function OnActiveMode(e) {
    if (e === 'ACTIVE_FEE') {
      setactiveFeeshow(true)
      setactivePctshow(false)
    } else if (e === 'NONE') {
      setactiveFeeshow(false)
      setactivePctshow(false)
    } else {
      setactiveFeeshow(false)
      setactivePctshow(true)
    }
  }

  function goodsonCancel() {
    setscopeCode('')
    setcopeCodeData([])
    setgoodsPop(false)
  }

  function categoryCategoryPop() {
    setscopeCode('')
    setcopeCodeData([])
    setcategoryPop(false)
  }

  function skuOnCancel() {
    setscopeCode('')
    setcopeCodeData([])
    setskuPop(false)
  }

  //goodsData商品组件数据
  function goodsDatas(value, name) {
    setcopeCodeData(name)
    setscopeCode(value)
  }

  //category类目组件数据
  function categoryDatas(value, name) {
    setcopeCodeData(name)
    setscopeCode(value)
  }

  //sku组件数据
  function skuDatas(value, name) {
    setcopeCodeData(name)
    setscopeCode(value)
  }

  //sku组件数据
  function distributeDatas(value, name) {
    setdeliverer(name)
    setscopeCode(value)
  }

  //ticket组件数据
  function ticketDatas(value, name) {
    setticket(name)
    setticketCode(value)
  }

  //时间限制
  function disabledDate(current) {
    return current < moment().startOf('day')
  }

  //返回
  const callBack = () => {
    router.push('/web/company/business/activemgr')
  }
  return (
    <div>
      <Form form={form} onFinish={newOnFinish}>
        <div className="fontMb">
          <Form.Item>
            <div className="marginlr20">基本信息</div>
          </Form.Item>

          <Row>
            <Col span={8} offset={6}>
              <Form.Item label="活动类型" name="activeType" required rules={[{ required: true, message: '请选择活动类型' }]}>
                <Select showArrow={true} onChange={changeCode} placeholder="活动类型" allowClear={true}>
                  {movableType.map((r) => (
                    <Option key={r.codeKey} value={r.codeKey}>
                      {r.codeValue}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8} offset={6}>
              <Form.Item required rules={[{ required: true, message: '请输入活动名称' }]} label="活动名称" name="activeName">
                <Input />
              </Form.Item>
            </Col>
            <Col span={8} offset={6}>
              <Form.Item label="活动时间" required rules={[{ required: true, message: '请选择活动时间' }]} name="times">
                <RangePicker format={'YYYY-MM-DD'}></RangePicker>
              </Form.Item>
            </Col>

            {discount && (
              <Col span={8} offset={6}>
                <Form.Item label="活动优惠" name="activeMode" required rules={[{ required: true, message: '请选择活动优惠' }]}>
                  <Select showArrow={true} onChange={OnActiveMode} placeholder="请选择" allowClear={true}>
                    {favourable.map((r) => (
                      <Option key={r.codeKey} value={r.codeKey}>
                        {r.codeValue}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            )}
            {discount && activeFeeshow && (
              <Col span={8} offset={6}>
                <Form.Item
                  required
                  rules={[{ required: true, message: '请输入立减金额' }]}
                  label="立减金额(元)"
                  name="activeFee"
                  initialValue={0}
                  style={{
                    marginLeft: '-20px',
                  }}
                >
                  <InputNumber style={{ width: '100%' }} min={0} precision={0.0} />
                </Form.Item>
              </Col>
            )}
            {discount && activePctshow && (
              <Col span={8} offset={6}>
                <Form.Item
                  required
                  rules={[{ required: true, message: '请输入' }]}
                  label="折扣百分比(%)"
                  name="activePct"
                  initialValue={0}
                  style={{
                    marginLeft: '-28px',
                  }}
                >
                  <InputNumber style={{ width: '100%' }} min={0} max={100} precision={0.0} />
                </Form.Item>
              </Col>
            )}

            {discount && (
              <>
                <Col span={8} offset={6}>
                  <Form.Item label="适用品类" name="scopeType" required rules={[{ required: true, message: '请选择适用品类' }]}>
                    <Select showArrow={true} onChange={onChange} placeholder="请选择" allowClear={true}>
                      {category.map((r) => (
                        <Option key={r.codeKey} value={r.codeKey}>
                          {r.codeValue}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>

                <Col span={8} offset={6}>
                  <Form.Item label="已&nbsp;&nbsp;&nbsp;选&nbsp;&nbsp;&nbsp;择">
                    <TextArea value={copeCodeData} rows={4} />
                  </Form.Item>
                </Col>

                <Col span={8} offset={6}>
                  <Form.Item label="可以叠加优惠券" name="ifOverly" required rules={[{ required: true, message: '请选择' }]} initialValue={1}>
                    <Radio.Group>
                      <Radio value={0}>是</Radio>
                      <Radio value={1}>否</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
              </>
            )}

            {reductionShow && (
              <Col span={8} offset={6}>
                <Form.Item shouldUpdate name="ticketStr">
                  <ChooseCoupon onChange={() => {}} />
                </Form.Item>
              </Col>
            )}

            {member && !(activeType === 'LOGIN_GIFT' || activeType === 'SHARE_GIFT' || activeType === 'LUCK_DRAW_GIFT') && (
              <Col span={8} offset={6}>
                <Form.Item label="会员时长(年)" required rules={[{ required: true, message: '请选择会员时长' }]} name="memberTime" initialValue={0} style={{ marginLeft: '-20px' }}>
                  <InputNumber style={{ width: '100%' }} min={1} max={10} precision={0} />
                </Form.Item>
              </Col>
            )}
            {reduction && !(activeType === 'LOGIN_GIFT' || activeType === 'SHARE_GIFT' || activeType === 'LUCK_DRAW_GIFT') && (
              <Col span={8} offset={6}>
                <Form.Item label="派发方式" name="grantMode " required rules={[{ required: true, message: '请选择派发方式' }]}>
                  <Select showArrow={true} placeholder="请选择" allowClear={true}>
                    <Option value={'person'}>人工派发</Option>
                  </Select>
                </Form.Item>
              </Col>
            )}
            {reduction && !(activeType === 'LOGIN_GIFT' || activeType === 'SHARE_GIFT' || activeType === 'LUCK_DRAW_GIFT') && (
              <Col span={8} offset={6}>
                <Form.Item label="派&nbsp;&nbsp;发&nbsp;&nbsp;人" required rules={[{ required: true, message: '请选择派发人' }]}>
                  <Select
                    showArrow={true}
                    onChange={() => {
                      setdistributePop(true)
                    }}
                    placeholder="请选择"
                    allowClear={true}
                  >
                    <Option>派发人</Option>
                  </Select>
                </Form.Item>
              </Col>
            )}
            {reduction && !(activeType === 'LOGIN_GIFT' || activeType === 'SHARE_GIFT' || activeType === 'LUCK_DRAW_GIFT') && (
              <Col span={8} offset={6}>
                <Form.Item label="已&nbsp;&nbsp;&nbsp;选&nbsp;&nbsp;&nbsp;择">
                  <TextArea style={{ width: '100%' }} value={deliverer} rows={2} />
                </Form.Item>
              </Col>
            )}

            <Col span={9} offset={6}>
              <Form.Item label="活动海报" name="activePoster" rules={[{ required: true, message: '请上传' }]}>
                <BUpload
                  valueType="string"
                  type="img"
                  api={api_common.uploadApi}
                  getPostData={(e) => {
                    const file = e.file
                    return {
                      fileExt: file.type.split('/')[1],
                      fileType: 'saasFile',
                    }
                  }}
                  length={1}
                />
              </Form.Item>
            </Col>
            <Col span={8} offset={6}>
              <Form.Item
                label="活动描述"
                name="activeDesc"
                required
                rules={[{ required: true, message: '请输入活动描述' }]}
                style={{
                  marginBottom: '15px',
                }}
              >
                <TextArea autoSize={{ minRows: 3, maxRows: 5 }} />
              </Form.Item>
            </Col>
            <Col span={8} offset={6}>
              <Form.Item
                required
                rules={[{ required: true, message: '请输入活动负责人' }]}
                label="活动负责人"
                name="activePerson"
                style={{
                  marginBottom: '15px',
                  marginLeft: '-14px',
                }}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

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
                  borderRadius: '4px',
                  marginBottom: 100,
                }}
                onClick={() => {
                  callBack()
                }}
                type="primary"
              >
                返回
              </Button>
            </div>
          </div>
        </div>
      </Form>

      <Modal
        destroyOnClose={true}
        centered={true}
        title="商品选择"
        visible={goodsPop}
        onCancel={goodsonCancel}
        onOk={() => {
          setgoodsPop(false)
        }}
        cancelText="取消"
        okText="提交"
        width={1000}
      >
        <GoodsModal goodsDatas={goodsDatas} />
      </Modal>
      {/*//类目选择*/}

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
        <Categoory categoryDatas={categoryDatas} />
      </Modal>

      {/*//sku选择*/}

      <Modal
        destroyOnClose={true}
        centered={true}
        title="单品SKU选择"
        visible={skuPop}
        onCancel={skuOnCancel}
        onOk={() => {
          setskuPop(false)
        }}
        cancelText="取消"
        okText="提交"
        width={1000}
      >
        <SkuModal skuDatas={skuDatas} />
      </Modal>
      {/*//派发人选择*/}
      <Modal
        destroyOnClose={true}
        centered={true}
        title="派发人选择"
        visible={distributePop}
        onCancel={() => {
          setscopeCode(''), setdeliverer([]), setdistributePop(false)
        }}
        onOk={() => {
          setdistributePop(false)
        }}
        cancelText="取消"
        okText="提交"
        width={1000}
      >
        <DistributeModal distributeDatas={distributeDatas} />
      </Modal>

      <Modal
        destroyOnClose={true}
        centered={true}
        title="优惠券选择"
        visible={ticketPop}
        onCancel={() => {
          setticket([]), setticketPop(false)
        }}
        onOk={() => {
          setticketPop(false)
        }}
        cancelText="取消"
        okText="提交"
        width={1000}
      >
        <Ticket ticketDatas={ticketDatas} />
      </Modal>
    </div>
  )
}

export default createMovable
