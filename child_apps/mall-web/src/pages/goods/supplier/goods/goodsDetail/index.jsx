import React, { Component, Fragment } from 'react'
import { Link, router } from 'umi'
import { connect } from 'dva'
import BigNumber from 'bignumber.js'
import { Drawer, Form, Input, Radio, Select, Button, message, Breadcrumb, Space } from 'antd'
import BUpload from '@/components/BUpload'
import SkuForm from '@/components/goods/skuForm'
import TEditDetails from '@/components/goods/T-EditDetails'
import { mConfirm, pathimgHeader } from '@/utils/utils'
import requestw from '@/utils/requestw'

import api_goods from '../../services/api/goods'
import api_common from '../../services/api/common'
import { querySupplierList } from '../../services/channel'
import debounce from 'lodash/debounce'

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
      warehouseShow: true,
      seleteShow: false,
      isRedact: true,
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
      this.setState(
        {
          record: this.props.history.location.query,
          isRedact: this.props.history.location.query.show,
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

    // dispatch({
    //   type: 'goods/getGoodsType',
    // });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.history.location.query && this.props.history.location.query.goodsName) {
      this.setState(
        {
          record: this.props.history.location.query,
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

    dispatch({
      type: 'goods/getGoodsType',
    })
  }

  /**
   * 方法
   */
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
      this.getInfo(record)
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

  getWarehouse = async () => {
    // let res = await requestw({
    //   url: api_goods.getWareHouseList,
    // });
    // if (res&&res.code == '0') {
    //   this.setState({
    //     warehouse: res.data,
    //   });
    // } else {
    //   message.warning('获取保税仓失败');
    // }
  }

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

    if (typeId === 'PUBLIC') {
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
    this.formRef.current.setFieldsValue({
      secondGroupCode: [],
    })
    let res = await requestw({
      url: api_goods.getSecondGroupList,
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

  //商品类型改变
  warehouse = async () => {}

  specsTypeChange = (e) => {
    const value = e.target.value
    this.setState({ specsType: value })
  }

  getSelect1 = async () => {
    let res = await requestw({
      url: api_goods.getFirstGroupList,
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
        ifHotSale: data.ifHotSale,
        ifDailySpecials: data.ifDailySpecials,
        ifFindGoodGoods: data.ifFindGoodGoods,
        ifBrandSale: data.ifBrandSale,
        ifActiveOnly: data.ifActiveOnly,
      }
      data.groupCode = data.secondGroupCode
      data.sku.skuJson.forEach((obj) => {
        obj.salePrice = new BigNumber(obj.salePrice || 0).times(100).toNumber()
        obj.costPrice = new BigNumber(obj.costPrice || 0).times(100).toNumber()
        obj.distributeRewardFee = new BigNumber(obj.distributeRewardFee || 0).times(100).toNumber()
        obj.saleRewardFee = new BigNumber(obj.saleRewardFee || 0).times(100).toNumber()
        obj['status'] = '0'
      })
      data.goodsDetail = JSON.stringify(data.goodsDetail)
      data.goodsPropertyBOListStr = JSON.stringify(data.sku.skuList).toString()
      data.skuBOListStr = JSON.stringify(data.sku.skuJson).toString()

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
      url: api_goods.getGoodsInfo,
      data: postData,
    })
    if (res && res.code == 0 && res.data) {
      const productObj = res.data
      this.typeChange(productObj.firstGroupCode)
      this.setState({
        productObj,
        typeId: productObj.firstGroupCode,
        specsType: productObj.secondGroupCode,
      })
      // 回显
      const formData = this.dealInfoData(1, productObj)

      formData.ifHotSale = formData.attrMap?.ifHotSale
      formData.ifNewGoods = formData.attrMap?.ifNewGoods
      formData.ifRecommend = formData.attrMap?.ifRecommend
      formData.ifDailySpecials = formData.attrMap?.ifDailySpecials
      formData.ifFindGoodGoods = formData.attrMap?.ifFindGoodGoods
      formData.ifBrandSale = formData.attrMap?.ifBrandSale

      this.setState({
        ifStockS: formData.ifStock,
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
      formData.sku.skuList = formData.goodsPropertyList
      formData.sku.skuJson.forEach((obj) => {
        obj.salePrice = new BigNumber(obj.salePrice || 0).div(100).toNumber()

        obj.costPrice = new BigNumber(obj.costPrice || 0).div(100).toNumber()
        obj.distributeRewardFee = new BigNumber(obj.distributeRewardFee || 0).div(100).toNumber()
        obj.saleRewardFee = new BigNumber(obj.saleRewardFee || 0).div(100).toNumber()
      })
      this.formRef.current.setFieldsValue(formData)
      if (formData.goodsType === 'PUBLIC') {
        this.setState({
          warehouseShow: false,
        })
      } else {
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
    const { lookingRecord, isRedact } = this.state
    if (this.tSku && this.tSku.current) {
      await this.tSku.current.validate()
      await this.tSku.current.onValuesChange()
    }
    const values = await this.formRef.current.validateFields()
    if (values.sku.skuJson && this.state.isRedact) {
      values.sku.skuJson.map((r) => {
        r.skuCode = ''
      })
    }

    let isRequired = false
    if (values.goodsType == 'INTERNATION') {
      values.sku.skuJson.map((item, ind) => {
        // if (item.salePrice == '0' ? item.salePrice == undefined : !item.salePrice) {
        //   isRequired = true;
        // }

        if (item.saleMinPrice == '0' ? item.saleMinPrice == undefined : !item.saleMinPrice) {
          isRequired = true
        }

        if (item.saleMaxPrice == '0' ? item.saleMaxPrice == undefined : !item.saleMaxPrice) {
          isRequired = true
        }

        if (item.costPrice == '0' ? item.costPrice == undefined : !item.costPrice) {
          isRequired = true
        }
        if (item.distributeRewardFee == '0' ? item.distributeRewardFee == undefined : !item.distributeRewardFee) {
          isRequired = true
        }
        if (item.saleRewardFee == '0' ? item.saleRewardFee == undefined : !item.saleRewardFee) {
          isRequired = true
        }
        if (!item.skuName || !item.remark || !item.skuImg) {
          isRequired = true
        }
      })
    }

    if (isRequired) {
      message.warning('规格信息请填写完整')
      return
    }
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
      url: api_goods.updateGoods,
      data: postData,
    })
    if (res && res.code == 0) {
      message.success('修改成功')
      router.push('/web/supplier/goodsmgr/goodsskumgr')
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
      url: api_goods.createGoods,
      data: postData,
    })
    if (res && res.code == 0) {
      message.success('新增成功')
      router.push('/web/supplier/goodsmgr/goodsskumgr')
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

  HotSaleChange = async (e) => {
    const isNewGoods = await this.formRef.current.getFieldValue('ifNewGoods')
    if (e.target.value == 0) {
      this.setState({
        ifNewGoodsDisable: true,
      })
    } else {
      this.setState({
        ifNewGoodsDisable: false,
      })
    }
  }

  NewGoodsChange = async (e) => {
    if (e.target.value == 0) {
      this.setState({
        ifHotSaleDisable: true,
      })
    } else {
      this.setState({
        ifHotSaleDisable: false,
      })
    }
  }

  ifStockChange = (e) => {
    this.setState({
      ifStockS: e.target.value,
    })
  }
  //供应商查询
  createSupplier_ = async (value) => {
    // let data = { orgName: value };
    // let res = await querySupplierList(data);
    // if (res&&res.code === '0') {
    //   {
    //     res.data.data !== null
    //       ? this.setState({
    //           supplierData: res.data,
    //         })
    //       : this.setState({
    //           supplierData: [],
    //         });
    //   }
    // }
  }

  //供应商防抖
  sudelayedChange = debounce(this.createSupplier_, 800)
  //供应商输入框改变
  suhandleChange = (event) => {
    this.sudelayedChange(event)
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

  templatedChange = debounce(this.getTemplate, 800)

  templateChange = (event) => {
    this.templatedChange(event)
  }
  goodTempletChange = (e) => {}

  /**
   * 渲染
   */
  render() {
    const {
      visible,
      // form
      typeId,
      specsType,
      radioValue,
      GoodTypeList,
      warehouse,
      goodsTypeList,
      goodsTypeList2,
      GoodFenzuList,
      ifNewGoodsDisable,
      ifHotSaleDisable,
      isBtnSubmit,
      supplierData,
      disabled,
      warehouseShow,
      seleteShow,
      isRedact,
    } = this.state

    return (
      <div>
        <Form ref={this.formRef} {...formLayout}>
          <div className="fontMb">
            <Form.Item wrapperCol={{ span: 24 }}>
              <div className="marginlr20">基本信息</div>
            </Form.Item>

            <Form.Item wrapperCol={{ span: 4 }} label="商品类型" name="goodsType" rules={[{ required: true, message: '请选择商品类型' }]}>
              <Select disabled={this.props.history.location.query.goodsName !== undefined && !isRedact} showArrow={true} placeholder="请选择商品类型" onChange={this.typeIdChange}>
                {GoodTypeList.map((obj) => (
                  <Select.Option key={obj.id} value={obj.codeKey}>
                    {obj.codeDesc}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item label="一级分类" wrapperCol={{ span: 4 }} name="firstGroupCode" rules={[{ required: true, message: '请选择商品分类' }]}>
              <Select showArrow={true} placeholder="一级分类" onChange={this.typeChange}>
                {goodsTypeList &&
                  goodsTypeList.map((obj) => (
                    <Select.Option key={obj.groupCode} value={obj.groupCode}>
                      {obj.groupName}
                    </Select.Option>
                  ))}
              </Select>
            </Form.Item>
            <Form.Item label="二级分类" wrapperCol={{ span: 4 }} name="secondGroupCode" rules={[{ required: true, message: '请选择商品分类' }]}>
              <Select showArrow={true} placeholder="二级分类">
                {goodsTypeList2 &&
                  goodsTypeList2.map((obj) => (
                    <Select.Option key={obj.id} value={obj.groupCode}>
                      {obj.groupName}
                    </Select.Option>
                  ))}
              </Select>
            </Form.Item>
            <Form.Item wrapperCol={{ span: 4 }} label="商品排序" name="goodsOrder" rules={[{ required: true, message: '请输入商品排序，数字越大越靠前' }]}>
              <Input maxLength="25" />
            </Form.Item>

            {/* <Form.Item
              name="supplierCode"
              wrapperCol={{ span: 4 }}
              label="商品供应商"
              rules={[{ required: true, message: '请选择商品供应商' }]}
            >
              <Select
                listItemHeight={10}
                listHeight={250}
                showArrow={true}
                placeholder="输入供应商关键字查询"
                allowClear={true}
                showSearch
                filterOption={false}
                bordered
                onSearch={this.suhandleChange}
              >
                {supplierData.map(r => (
                  <Select.Option key={r.orgCode} value={r.orgCode}>
                    {r.orgName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item> */}
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

            <Form.Item label="商品图片" name="goodsImg" rules={[{ required: true, message: '请上传图片' }]}>
              <BUpload
                valueType="string<,>"
                type="img"
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
              <Radio.Group>
                <Radio value={1}>是</Radio>
                <Radio value={0}>否</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item label="热销商品" name="ifHotSale" rules={[{ required: true, message: '请选择热销商品' }]} initialValue="1">
              <Radio.Group onChange={this.HotSaleChange} disabled={ifHotSaleDisable}>
                <Radio value="0">是</Radio>
                <Radio value="1">否</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item label="新品首发" name="ifNewGoods" rules={[{ required: true, message: '请选择新品首发' }]} initialValue="1">
              <Radio.Group onChange={this.NewGoodsChange} disabled={ifNewGoodsDisable}>
                <Radio value="0">是</Radio>
                <Radio value="1">否</Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item label="推荐商品" name="ifRecommend" rules={[{ required: true, message: '请选择推荐商品' }]} initialValue="1">
              <Radio.Group>
                <Radio value="0">是</Radio>
                <Radio value="1">否</Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item label="每日特价" name="ifDailySpecials" rules={[{ required: true, message: '请选择每日特价商品' }]} initialValue="1">
              <Radio.Group>
                <Radio value="0">是</Radio>
                <Radio value="1">否</Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item label="发现好货" name="ifFindGoodGoods" rules={[{ required: true, message: '请选择发现好货商品' }]} initialValue="1">
              <Radio.Group>
                <Radio value="0">是</Radio>
                <Radio value="1">否</Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item label="品牌特卖" name="ifBrandSale" rules={[{ required: true, message: '请选择品牌特卖商品' }]} initialValue="1">
              <Radio.Group>
                <Radio value="0">是</Radio>
                <Radio value="1">否</Radio>
              </Radio.Group>
            </Form.Item>
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
                <SkuForm ifStockS={this.state.ifStockS} ref={this.tSku} {...formLayout} isRedact={this.state.isRedact} stock={true} />
              </Form.Item>
              <Form.Item>
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
