import React, { Component } from 'react'
import { router } from 'umi'
import { connect } from 'dva'
import BigNumber from 'bignumber.js'
import { Button, Col, Form, Input, InputNumber, message, Radio, Row, Select } from 'antd'
import BUpload from '@/components/BUpload'
import TEditDetails from '@/components/goods/T-EditDetails'
import { getOrgKind, mConfirm } from '@/utils/utils'
import requestw from '@/utils/requestw'
import api_goods from '@/services/api/goods'
import api_common from '@/services/api/common'
import { querySupplierList } from '@/services/channel'
import MinusCircleOutlined from '@ant-design/icons/lib/icons/MinusCircleOutlined'
import TypeLinkage from '../components/Typelinkage'
import SkuForm from '@/components/goods/SkuInput'
import FetchSelect from '@/components/FetchSelect'

const label = 2
const total = 23
const formLayout = {
  labelCol: { span: label },
  wrapperCol: { span: total - label },
}
const formLayoutTail = {
  wrapperCol: { offset: label, span: total - label },
}

class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      productObj: {},
      lookingRecord: null,

      // form
      typeId: '',
      specsType: 0,
      GoodTypeList: [],
      goodsTypeList: [],
      goodsTypeList2: [],
      GoodFenzuList: [],
      ifHotSaleDisable: false,
      ifNewGoodsDisable: false,
      isBtnSubmit: false,
      ifStockS: 0,
      record: {},
      supplierData: [],
      disabled: false,
      warehouse: [],
      warehouseShow: false,
      seleteShow: false,
      isRedact: true,
      activeList: [],
      articleList: [],
      goodsTypeShow: false,
      prescriptionIndex: '0',
      icdNameStr: '',
      ifMembership: 0,
    }
    this.formRef = React.createRef()
    this.tSku = React.createRef()
  }

  /**
   * 周期
   */
  componentDidMount() {
    if (this.props.onRef) {
      this.props.onRef(this)
    }
    if (this.props.history.location.query && this.props.history.location.query.goodsName) {
      this.getInfo(this.props.history.location.query)
      this.setState(
        {
          record: this.props.history.location.query,
          isRedact: this.props.history.location.query?.show == 'false' || this.props.history.location.query?.show === false ? false : true,
        },
        () => {
          this.open(this.state.record)
        }
      )
    }
    this.getGoodTypeSelete()
    const { dispatch } = this.props
    this.getSelect1()
    this.getGoodFenzuSelete()

    this.getGoodTypeShow()
    this.getWarehouse()
    this.getArticleList()
    this.getActiveList()
    this.getCompanyInfo()

    dispatch({
      type: 'goods/getGoodsType',
    })
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.history.location.query && this.props.history.location.query.goodsName) {
      this.setState(
        {
          record: this.props.history.location.query,
          isRedact: this.props.history.location.query?.show == 'false' || this.props.history.location.query?.show === false ? false : true,
        },
        () => {
          this.open(this.state.record)
        }
      )
    }
    this.getGoodTypeShow()
    this.getGoodTypeSelete()
    const { dispatch } = this.props
    this.getSelect1()
    this.getGoodFenzuSelete()

    this.getWarehouse()
    this.getArticleList()
    this.getActiveList()
    this.getCompanyInfo()
    dispatch({
      type: 'goods/getGoodsType',
    })
  }
  //getOrgKind().isAdmin
  /**
   * 方法
   */
  getCompanyInfo = async () => {
    if (getOrgKind().isAdmin) return
    const res = await requestw({
      url: '/web/staff/company/info',
    })
    if (res && res.code === '0') {
      this.setState({
        ifMembership: res.data.ifMembership || 0,
      })
    }
  }

  goBack = () => {
    router.goBack()
  }

  open = (record) => {
    this.setState({
      visible: true,
      lookingRecord: record || null,
    })
    // 获取详情
    if (record) {
      // this.getInfo(record);
    }
  }
  getGoodTypeSelete = async () => {
    let res = await requestw({
      url: api_goods.getSysCodeByParam,
      data: { codeParam: 'GOODS_TYPE' },
    })
    if (res && res.code == '0') {
      this.setState({
        GoodTypeList: res.data,
      })
    } else {
      message.warning('获取商品类型列表失败')
    }
  }

  getGoodTypeShow = async () => {
    const res = await requestw({
      url: api_goods.queryIfCrossRight,
    })

    if (res && res.code === '0') {
      this.setState({
        goodsTypeShow: res.data,
      })
    }
  }

  getWarehouse = async () => {}

  getGoodFenzuSelete = async () => {
    let res = await requestw({
      url: api_goods.getSysCodeByParam,
      data: { codeParam: 'GOODS_ATTR_VALUE' },
    })
    if (res && res.code == '0') {
      this.setState({
        GoodFenzuList: res.data,
      })
    } else {
      message.warning('获取商品分组列表失败')
    }
  }

  getArticleList = async () => {
    const res = await requestw({
      url: '/web/staff/softText/queryList',
    })

    if (res && res.code == '0') {
      this.setState({
        articleList: res.data,
      })
    } else {
      this.setState({
        articleList: [],
      })
    }
  }

  getActiveList = async () => {
    const res = await requestw({
      url: '/web/uiTemplate/queryList',
    })
    if (res && res.code == '0') {
      this.setState({
        activeList: res.data,
      })
    } else {
      this.setState({
        activeList: [],
      })
    }
  }

  close = () => {
    this.setState({
      visible: false,
      productObj: {},
      lookingRecord: null,
      ifHotSaleDisable: false,
      ifNewGoodsDisable: false,
      isBtnSubmit: false,
    })
  }

  /**
   * form change
   */
  typeIdChange = async (typeId) => {
    this.setState({ typeId })

    if (typeId === 'GENERAL' || typeId === 'THIRD_PARTY') {
      this.setState({
        warehouseShow: false,
      })
    } else if (typeId === 'INTERNATION') {
      this.setState({
        warehouseShow: true,
      })
    }
  }

  typeChange = async (typeId) => {
    this.setState({ typeId })
    this.formRef?.current.setFieldsValue({
      secondGroupCode: [],
    })
    let res = await requestw({
      url: api_goods.querySecondGroupListForSelect(),
      data: {
        groupCode: typeId,
      },
    })
    if (res && res.code == '0') {
      this.setState({
        goodsTypeList2: res.data,
      })
    }
  }

  getSelect1 = async () => {
    let res = await requestw({
      url: api_goods.queryFirstGroupListForSelect(),
    })
    if (res && res.code == '0') {
      this.setState({
        goodsTypeList: res.data.data,
      })
    }
  }

  // select
  getSelect2List = (typeId) => {}

  // type 1 old=>form
  // type 2 form=>old
  dealInfoData = (type, values) => {
    const { productObj, lookingRecord, radioValue } = this.state

    let data = ''
    let newDataObjs = {}
    let buzhi = {}

    if (type == 1) {
      /**
       * 改成放进form的
       */
      newDataObjs = JSON.parse(JSON.stringify(values))
      newDataObjs.goodsDetail = JSON.parse(newDataObjs.goodsDetail)
      newDataObjs.sku = {
        skuJson: newDataObjs.skuList,
        skuList: newDataObjs.goodsPropertyList,
      }
    } else {
      /**
       * 转成提交
       */
      if (lookingRecord) {
        // 编辑
        data = JSON.parse(JSON.stringify(productObj))

        const deleteKeyArr = ['createTime', 'modifyTime', 'upperTime', 'distributionType', 'distributionValu', 'typeName']
        deleteKeyArr.forEach((key) => {
          delete data[key]
        })
      } else {
        // 新增
        data = JSON.parse(JSON.stringify(values))
      }

      data = {
        ...data,
        ...values,
        supplierCode: 'ZZZZZZ',
      }
      buzhi = {
        ifNewGoods: data.ifNewGoods,
        ifRecommend: data.ifRecommend,
        ifMonopoly: data.ifMonopoly,
        ifDelivery: data.ifDelivery,
        ifHotSale: data.ifHotSale,
        ifDailySpecials: data.ifDailySpecials,
        ifFindGoodGoods: data.ifFindGoodGoods,
        ifBrandSale: data.ifBrandSale,
        ifActiveOnly: data.ifActiveOnly,
        ifStock: data.ifStock,
        activePage: data.activePage && data.activePage.length && data.activePage.join(','),
        articlePage: data.articlePage && data.articlePage.length && data.articlePage.join(','),
        icdCode: (data && data.icdCode && Array.isArray(data.icdCode) && data.icdCode.length && data.icdCode.join(',')) || '',
        icdName: this.state.icdNameStr || '',
        ifMembership: data.ifMembership,
        ifPrescription: data.ifPrescription,
        usageMethod: data.usageMethod, // 处方药服用方法
        usageFrequencyUnit: data.usageFrequencyUnit, // 处方药服用频率周期
        usageFrequencyCount: data.usageFrequencyCount, // 处方药使用频率
        usagePerUseCount: data.usagePerUseCount, // 处方药使用频率
        usagePerUseUnit: data.usagePerUseUnit, // 每次用药单位
        usageDays: data.usageDays, // 服用天数
        drugApprovalNumber: data.drugApprovalNumber,
      }
      data.groupCode = data.secondGroupCode
      data.sku.skuJson.forEach((obj) => {
        obj.salePrice = new BigNumber(obj.salePrice || 0).times(100).toNumber()
        obj.costPrice = new BigNumber(obj.costPrice || 0).times(100).toNumber()
        obj.totalRewardFee = new BigNumber(obj.totalRewardFee || 0).times(100).toNumber()
        obj.distributeRewardFee = new BigNumber(obj.distributeRewardFee || 0).times(100).toNumber()
        obj.saleRewardFee = new BigNumber(obj.saleRewardFee || 0).times(100).toNumber()
        obj.costPriceType = obj.costPriceType ? obj.costPriceType : '0'
      })

      data.goodsDetail = JSON.stringify(data.goodsDetail)
      data.goodsPropertyBOListStr = JSON.stringify(data.sku.skuList).toString()
      // data.skuList = data.sku.skuList
      data.skuBOListStr = JSON.stringify(data.sku.skuJson).toString()
      let typeCode = []
      if (data.goodsGroupRelationListStr && data.goodsGroupRelationListStr.length) {
        data.goodsGroupRelationListStr.map((r) => {
          typeCode.push(r.code)
        })
      } else {
        message.warn('请选择商品分类')
        return
      }
      data['goodsGroupRelationListStr'] = JSON.stringify(typeCode).toString()
      // let goodsBO= JSON.stringify(data)

      newDataObjs = {
        goodsBO: JSON.stringify(data),
        goodsPropertyBOListStr: data.goodsPropertyBOListStr,
        skuBOListStr: data.skuBOListStr,
        ...buzhi,
      }
    }
    return newDataObjs
  }

  // 获取详情
  getInfo = async (record) => {
    if (record.status == 2) {
      this.setState({
        isBtnSubmit: true,
      })
    }

    const postData = {
      goodsCode: record.goodsCode,
    }
    let res = await requestw({
      url: api_goods.getGoodsInfo(),
      data: postData,
    })
    if (res && res.code == 0 && res.data) {
      const productObj = res.data
      this.setState(
        {
          productObj,
          typeId: productObj.firstGroupCode,
          specsType: productObj.secondGroupCode,
          prescriptionIndex: productObj.attrMap?.ifPrescription && productObj.attrMap?.ifPrescription !== undefined ? productObj.attrMap?.ifPrescription : '0',
        },
        () => {
          this.typeChange(productObj.firstGroupCode)
        }
      )
      // 回显
      const formData = this.dealInfoData(1, productObj)

      let goodsType = []
      if (formData.goodsGroupRelationList && formData.goodsGroupRelationList.length) {
        let goodsData = formData.goodsGroupRelationList
        goodsData.map((r) => {
          let item = { code: r }
          goodsType.push(item)
        })
      } else {
        goodsType = [{}]
      }
      formData['goodsGroupRelationListStr'] = goodsType
      formData.ifHotSale = formData.attrMap?.ifHotSale
      formData.ifNewGoods = formData.attrMap?.ifNewGoods
      formData.ifRecommend = formData.attrMap?.ifRecommend
      formData.ifMonopoly = formData.attrMap?.ifMonopoly
      formData.ifDelivery = formData.attrMap?.ifDelivery
      formData.ifDailySpecials = formData.attrMap?.ifDailySpecials
      formData.ifFindGoodGoods = formData.attrMap?.ifFindGoodGoods
      formData.ifBrandSale = formData.attrMap?.ifBrandSale
      formData.ifBrandSale = formData.attrMap?.ifBrandSale
      formData.ifMembership = formData.attrMap?.ifMembership

      formData.ifPrescription = formData.attrMap?.ifPrescription && formData.attrMap?.ifPrescription !== undefined ? formData.attrMap?.ifPrescription : '0'
      formData.icdCode = formData.attrMap?.icdCode?.split(',')
      formData.usageMethod = formData.attrMap?.usageMethod
      formData.usageFrequencyUnit = formData.attrMap?.usageFrequencyUnit
      formData.usageFrequencyCount = formData.attrMap?.usageFrequencyCount
      formData.usagePerUseCount = formData.attrMap?.usagePerUseCount
      formData.usagePerUseUnit = formData.attrMap?.usagePerUseUnit
      formData.usageDays = formData.attrMap?.usageDays
      formData.drugApprovalNumber = formData.attrMap?.drugApprovalNumber

      formData.activePage = formData.attrMap.activePage?.split(',')
      formData.articlePage = formData.attrMap.articlePage?.split(',')
      const ifMembershipObj = {}
      if (getOrgKind().isAdmin) {
        ifMembershipObj['ifMembership'] = formData.attrMap?.ifMembership
      }
      this.setState({
        ifStockS: formData.ifStock,
        typeId: formData.goodsType,
        icdNameStr: formData.attrMap?.icdName,
        ...ifMembershipObj,
      })
      if (formData.ifHotSale == '0') {
        this.setState({
          ifNewGoodsDisable: true,
        })
      }
      if (formData.ifNewGoods == '0') {
        this.setState({
          ifHotSaleDisable: true,
        })
      }

      formData.sku.skuJson = formData.skuList
      // formData.sku.skuList = formData.goodsPropertyList;
      formData.sku.skuList = formData.goodsPropertyList
      formData.sku.skuJson.forEach((obj) => {
        obj.salePrice = new BigNumber(obj.salePrice || 0).div(100).toNumber()

        // obj.saleMaxPrice = new BigNumber(obj.saleMaxPrice || 0).div(100).toNumber();
        // obj.saleMinPrice = new BigNumber(obj.saleMinPrice || 0).div(100).toNumber();
        obj.costPrice = new BigNumber(obj.costPrice || 0).div(100).toNumber()
        obj.totalRewardFee = new BigNumber(obj.totalRewardFee || 0).div(100).toNumber()
        obj.distributeRewardFee = new BigNumber(obj.distributeRewardFee || 0).div(100).toNumber()
        obj.saleRewardFee = new BigNumber(obj.saleRewardFee || 0).div(100).toNumber()
        // obj.distributeRewardFee = new BigNumber(obj.distributeRewardFee || 0).div(100).toNumber();
        obj.serviceFee = new BigNumber(obj.serviceFee || 0).div(100).toNumber()
        obj.costPriceType = obj.costPriceType !== '0' ? obj.costPriceType : ''
      })
      // delete formData.skuList
      this.formRef.current.setFieldsValue(formData)
      if (formData.goodsType === 'GENERAL' || formData.goodsType === 'THIRD_PARTY') {
        this.setState({
          warehouseShow: false,
        })
      } else if (formData.goodsType === 'INTERNATION') {
        this.setState({
          warehouseShow: true,
        })
      }
    }
  }

  /**
   * 提交
   */
  submit = async () => {
    const { lookingRecord, isRedact, productObj } = this.state
    if (this.tSku && this.tSku.current) {
      // await this.tSku.current.validate();
      await this.tSku.current.onValuesChange()
    }
    const values = await this.formRef.current.validateFields()

    let daxiaoshifoufuhe = true
    if (!this.state.isRedact) {
      if (!daxiaoshifoufuhe) {
        message.warning('商品售价不能低于或高于商品区间价')
        return false
      }
    }

    if (values.sku.skuJson && this.state.isRedact) {
      values.sku.skuJson.map((r) => {
        r.skuCode = ''
      })
    }
    let istian = false
    if (values.sku.skuList.length == 1) {
      if (values.sku.skuList[0].propertyName == '发货仓') {
        message.warning('商品规格不能仅为发货仓')
        return
      }
    }
    let isBeiJingRequired2 = false
    let isBeiJingRequired = false
    let isRequired = false
    if (values.goodsType == 'GENERAL') {
      values.sku.skuJson.map((item, ind) => {
        if (Number(item.salePrice) === 0 ? item.salePrice == undefined : !item.salePrice) {
          message.warn('商品价格不能为0')
          isRequired = true
          return
        }
        if (!item.skuName || !item.skuImg) {
          isRequired = true
        }
      })
    }
    if (isBeiJingRequired) {
      message.warning('北京保税仓的商品备案信息必填')
      return
    }
    if (isBeiJingRequired2) {
      message.warning('北京二号仓的商品备案信息必填')
      return
    }
    if (isRequired) {
      message.warning('规格信息请填写完整')
      return
    }
    // return
    const confirmStr = lookingRecord ? (isRedact ? '确认新增？' : '确认修改？') : '确认新增？'
    mConfirm(confirmStr, async () => {
      if (lookingRecord) {
        if (this.state.isRedact) {
          await this.add(values)
        } else {
          await this.edit(values)
        }
      } else {
        await this.add(values)
      }
    })
  }

  /**
   * 编辑
   */
  edit = async (values) => {
    const postData = this.dealInfoData(0, values)
    let res = await requestw({
      url: api_goods.updateGoods(),
      data: postData,
    })
    if (res && res.code == 0) {
      message.success('修改成功')
      router.push('/web/company/goodsmgr/goodsskumgr')
      if (this.props.callback) {
        this.props.callback()
      }
    } else {
      message.warning(res.message || '操作失败')
    }
  }

  /**
   * 新增
   */
  add = async (values) => {
    const postData = this.dealInfoData(0, values)
    let res = await requestw({
      url: api_goods.createGoods(),
      data: postData,
    })
    if (res && res.code == 0) {
      message.success('新增成功')
      router.push('/web/company/goodsmgr/goodsskumgr')
      if (this.props.callback) {
      }
    } else {
      message.warning(res.message || '网络异常')
    }
  }

  //  在线支付点击change事件
  radiochange = (e) => {
    let value = e.target.value
    this.setState({
      radioValue: value,
    })
  }

  ifStockChange = (e) => {
    this.setState({
      ifStockS: e.target.value,
    })
  }

  //商品模板查询
  getTemplate = async (value) => {
    let data = { orgName: value }
    let res = await querySupplierList(data)
    if (res && res.code === '0') {
      {
        res.data.data !== null
          ? this.setState({
              supplierData: res.data,
            })
          : this.setState({
              supplierData: [],
            })
      }
    }
  }
  prescription = (e) => {
    const value = e.target.value
    this.setState({
      prescriptionIndex: value,
    })
  }
  /**
   * 渲染
   */
  render() {
    const {
      // form
      typeId,
      GoodTypeList,
      isRedact,
      productObj,
      activeList,
      articleList,
      goodsTypeShow,
      prescriptionIndex,
    } = this.state

    return (
      <div>
        <Form ref={this.formRef} {...formLayout}>
          <div className="fontMb">
            <Form.Item wrapperCol={{ span: 24 }}>
              <div className="marginlr20">基本信息</div>
            </Form.Item>

            <Form.Item wrapperCol={{ span: 4 }} label="商品类型" name="goodsType" rules={[{ required: true, message: '请选择商品类型' }]} initialValue={'GENERAL'}>
              <Select disabled={this.props.history.location.query.goodsName !== undefined && !isRedact} showArrow={true} placeholder="请选择商品类型" onChange={this.typeIdChange}>
                {GoodTypeList.map((obj) => (
                  <Select.Option key={obj.id} value={obj.codeKey} disabled={obj.codeKey === 'THIRD_PARTY' || (obj.codeKey === 'INTERNATION' && !goodsTypeShow)}>
                    {obj.codeDesc}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.List name="goodsGroupRelationListStr" initialValue={[{}]}>
              {(fields, { add, remove }) => (
                <>
                  {fields.map((field) => (
                    <Form.Item
                      key={field.key}
                      style={{ bottom: 0 }}
                      shouldUpdate={(prevValues, curValues) => {}}
                      label="商品类目"
                      rules={[{ required: true, message: '请选择商品分类' }]}
                      {...formLayout}
                    >
                      {() => (
                        <Row wrap={false}>
                          <Col span={8}>
                            <Form.Item {...field} name={[field.name, 'code']} fieldKey={[field.fieldKey, 'code']} style={{ marginBottom: 0 }}>
                              <TypeLinkage onChange={() => {}} />
                            </Form.Item>
                          </Col>
                          {fields.length > 1 && <MinusCircleOutlined style={{ marginTop: 8, marginLeft: 14 }} onClick={() => remove(field.name)} />}
                        </Row>
                      )}
                    </Form.Item>
                  ))}
                  <Form.Item {...formLayoutTail}>
                    <Button style={{ borderRadius: 8 }} type="primary" onClick={() => add()}>
                      添加分类
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
            <Form.Item wrapperCol={{ span: 4 }} label="商品排序" name="goodsOrder" rules={[{ required: true, message: '请输入商品排序，数字越大越靠前' }]} initialValue={0}>
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item wrapperCol={{ span: 8 }} label="商品名称" name="goodsName" rules={[{ required: true, message: '请输入商品名称' }]}>
              <Input placeholder="请输入商品名称" maxLength="50" />
            </Form.Item>

            {this.props.history.location.query.goodsName !== undefined && !isRedact ? (
              <Form.Item wrapperCol={{ span: 8 }} label="商品编码" name="goodsCode">
                <Input placeholder="请输入商品名称" maxLength="50" disabled={true} bordered={false} />
              </Form.Item>
            ) : null}

            <Form.Item wrapperCol={{ span: 8 }} label="商品描述" name="goodsDesc">
              <Input.TextArea placeholder="请输入商品描述" autoSize={{ minRows: 3, maxRows: 5 }} />
            </Form.Item>
            <Form.Item wrapperCol={{ span: 4 }} label="活动页面" name="activePage">
              <Select placeholder="请选择活动页面" mode={'multiple'}>
                {activeList.map((r) => (
                  <Select.Option key={r.templateCode} value={r.templateCode}>
                    {r.templateName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item wrapperCol={{ span: 4 }} label="文章页面" name="articlePage">
              <Select placeholder="请选择文章页面" mode={'multiple'}>
                {articleList.map((r) => (
                  <Select.Option key={r.textCode} value={r.textCode}>
                    {r.textName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item label="商品图片" name="goodsImg" rules={[{ required: true, message: '请上传图片' }]}>
              <BUpload
                valueType="string<,>"
                type="*"
                api={api_common.uploadApi}
                getPostData={(e) => {
                  const file = e.file
                  return {
                    fileExt: file.type.split('/')[1],
                    fileType: 'GoodsImage',
                  }
                }}
                length={8}
                isCanSort={true}
                imgCrop={{
                  quality: 0.6,
                  modalWidth: 800,
                }}
              />
            </Form.Item>

            <Form.Item label="备案资料" name="licenseInfo">
              <BUpload
                valueType="string<,>"
                type="file"
                api={api_common.uploadApi}
                getPostData={(e) => {
                  const file = e.file
                  return {
                    fileExt: file.type.split('/')[1],
                    fileType: 'GoodsImage',
                  }
                }}
                length={5}
              />
            </Form.Item>

            <Form.Item label="是否库存" name="ifStock" rules={[{ required: true, message: '请选择是否库存' }]} initialValue={0}>
              <Radio.Group onChange={this.ifStockChange}>
                <Radio value={1}>是</Radio>
                <Radio value={0}>否</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item label="猜你喜欢" name="ifRecommend" rules={[{ required: true, message: '请选择猜你喜欢' }]} initialValue="1">
              <Radio.Group>
                <Radio value="0">是</Radio>
                <Radio value="1">否</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item label="销售类型" name="ifMonopoly" rules={[{ required: true, message: '请选择销售类型' }]} initialValue="0">
              <Radio.Group>
                <Radio value="1">指定可售</Radio>
                <Radio value="0">全部可售</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item label="是否需要配送" name="ifDelivery" rules={[{ required: true, message: '请选择是否填是否需要配送' }]} initialValue="1">
              <Radio.Group>
                <Radio value="1">是</Radio>
                <Radio value="0">否</Radio>
                <Radio value="2">核销不配送</Radio>
              </Radio.Group>
            </Form.Item>
            {this.state.ifMembership == '1' && (
              <Form.Item label="是否会员商品" name="ifMembership" rules={[{ required: true, message: '请选择是否会员商品' }]} initialValue="0">
                <Radio.Group>
                  <Radio value="1">是</Radio>
                  <Radio value="0">否</Radio>
                </Radio.Group>
              </Form.Item>
            )}
            <Form.Item label="商品类型" name="ifPrescription" rules={[{ required: true, message: '请选择商品分类' }]} initialValue="0">
              <Radio.Group onChange={this.prescription}>
                <Radio value="0">普通</Radio>
                <Radio value="1">处方</Radio>
                <Radio value="2">非处方</Radio>
              </Radio.Group>
            </Form.Item>
            {Number(prescriptionIndex) === 1 ? (
              <>
                <Form.Item label="药品批准文号" name="drugApprovalNumber" rules={[{ required: true, message: '请填写药品批准文号' }]} wrapperCol={{ span: 4 }}>
                  <Input placeholder="药品批准文号" />
                </Form.Item>

                <Form.Item name="icdCode" label="疾病类型" wrapperCol={{ span: 4 }}>
                  <FetchSelect
                    placeholder="疾病类型"
                    api="/web/staff/sicknessIcd/queryList"
                    valueKey="icdCode"
                    textKey="sicknessName"
                    itemAll={true}
                    mode="multiple"
                    //搜索
                    showSearch
                    filterOption={(input, option) => {
                      return option && option.props && option.props.children && option.props.children.indexOf(input) >= 0
                    }}
                    onChange={(code, itemList) => {
                      if (itemList.length) {
                        let str = []
                        itemList.map((r) => str.push(r.sicknessName))
                        this.setState({
                          icdNameStr: str.join(','),
                        })
                      }
                    }}
                  />
                </Form.Item>
                <Form.Item label="服用天数" name="usageDays" wrapperCol={{ span: 4 }}>
                  <Input placeholder="服用天数" />
                </Form.Item>
                <Form.Item label="每次用药数量" name="usagePerUseCount" wrapperCol={{ span: 4 }}>
                  <Input placeholder="每次用药数量" />
                </Form.Item>

                <Form.Item label="每次用药单位" name="usagePerUseUnit" wrapperCol={{ span: 4 }}>
                  <Input placeholder="每次用药单位" />
                </Form.Item>

                <Form.Item label="处方药服用方法" name="usageMethod" wrapperCol={{ span: 4 }}>
                  <Input placeholder="处方药服用方法" />
                </Form.Item>

                <Form.Item label="服用频率周期" name="usageFrequencyUnit" wrapperCol={{ span: 4 }}>
                  <Input placeholder="处方药服用频率周期" />
                </Form.Item>

                <Form.Item label="处方药使用频率" name="usageFrequencyCount" wrapperCol={{ span: 4 }}>
                  <Input placeholder="处方药使用频率" />
                </Form.Item>
              </>
            ) : null}
          </div>

          <>
            {/* 商品详情 */}
            <div className="fontMb" style={{ border: '1px solid #fefffe' }}>
              <Form.Item wrapperCol={{ span: 24 }}>
                <div className="marginlr20">商品详情</div>
              </Form.Item>
              <Form.Item label="详情设置" name="goodsDetail" style={{ marginBottom: 20 }}>
                <TEditDetails />
              </Form.Item>
            </div>
            {/* 价格库存 */}
            <div className="fontMb">
              <Form.Item wrapperCol={{ span: 24 }}>
                <div className="marginlr20">价格库存</div>
              </Form.Item>
              <Form.Item name="sku" wrapperCol={{ span: 24 }}>
                <SkuForm
                  ifStockS={this.state.ifStockS}
                  ref={this.tSku}
                  {...formLayout}
                  isRedact={this.state.isRedact}
                  stock={false}
                  productObj={productObj}
                  typeId={typeId}
                  warehouseShow={this.state.warehouseShow}
                  prescriptionIndex={Number(prescriptionIndex)}
                />
              </Form.Item>
              <Form.Item {...formLayoutTail}>
                <Button style={{ borderRadius: '4px', marginBottom: 40 }} type="primary" onClick={this.submit}>
                  提交
                </Button>
                <Button onClick={this.goBack} style={{ marginLeft: 15, borderRadius: '4px' }}>
                  返回
                </Button>
              </Form.Item>
            </div>
          </>
        </Form>
      </div>
    )
  }
}

export default connect(({ goods }) => ({
  goods,
}))(Index)
