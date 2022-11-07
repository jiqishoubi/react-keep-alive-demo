/**
 * props:
 * callback //成功的回调
 *
 * 方法：
 * open 参数 productObj
 * close
 */
import React, { Component, Fragment } from 'react'
import { connect } from 'dva'
import { Drawer, Form, Input, Radio, Select, Button, message } from 'antd'
import TUpload2 from '@/components/T-Upload2'
import TSku from '@/components/goods/SkuInput'
import TEditDetails from '@/components/goods/T-EditDetails'
import { mConfirm, pathimgHeader } from '@/utils/utils'
import { getProductsAjax, updateProductAjax, addProductAjax } from '@/services/goods'
import requestw from '@/utils/requestw'
import { getFirstGroupList, getGroupCount, getSecondGroupList, createGroup, updateGroupStatus, deleteGroup } from '@/services/goods'
import api_goods from '@/services/api/goods'
import styles from './index.less'
import { CaretDownOutlined } from '@ant-design/icons'
const label = 4
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
    let res = await requestw({
      url: api_goods.getSecondGroupList(),
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

  specsTypeChange = (e) => {
    const value = e.target.value
    this.setState({ specsType: value })
  }

  getSelect1 = async () => {
    let res = await requestw({
      url: api_goods.getFirstGroupList(),
    })
    if (res && res.code == '0') {
      this.setState({
        goodsTypeList: res.data,
      })
    }
  }

  // select
  getSelect2List = (typeId) => {
    // const { goods } = this.props;
    // const { goodsTypeList } = this.state;
    // let goodsTypeList2 = [];
    // if (typeId !== undefined) {
    //   const filterArr = goodsTypeList.filter(obj => obj.typeId == typeId);
    //   if (filterArr[0]) {
    //     goodsTypeList2 = filterArr[0].subTypeList;
    //   }
    // }
    // return goodsTypeList2;
  }

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
      // 图片
      newDataObjs.fileList = newDataObjs.goodsImg.split(',').map((str, index) => {
        const url = str.indexOf('http') > -1 ? str : pathimgHeader + str
        if (newDataObjs.goodsImg.split(',').length < 1) {
          url = str[0]
        }

        return {
          uid: -(index + 1),
          name: url,
          status: 'done',
          url,
        }
      })
      newDataObjs.goodsDetail = JSON.parse(newDataObjs.goodsDetail)
      // 价格
      // data.productPrice = data.productPrice / 100;
      // data.price = data.price / 100;
      // data.transportAmount = data.transportAmount / 100;
      // 图片
      // data.goodsImg = da;
      // 多规格
      // if (data.specsType == 1) {
      // data.skuPropertyList.forEach(obj => {
      //   obj.price = obj.price / 100;
      // });
      newDataObjs.sku = {
        skuJson: newDataObjs.skuList,
        skuList: newDataObjs.goodsPropertyList,
      }
      // data.skuJson.forEach(obj => {
      //   obj.salePrice = obj.salePrice * 100;
      // });
      // data.goodsDetail = JSON.stringify(goodsDetail);
      // data.goodsPropertyBOListStr = data.sku.skuList.toString();
      // data.skuBOListStr = data.sku.skuJson.toString();
      // }
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
      const productPic = values.fileList.map((item) => {
        return item.url
      })
      data = {
        ...data,
        ...values,
        goodsImg: productPic,
      }
      buzhi = {
        ifNewGoods: data.ifNewGoods,
        ifRecommend: data.ifRecommend,
        ifHotSale: data.ifHotSale,
      }
      data.groupCode = data.secondGroupCode
      data.sku.skuJson.forEach((obj) => {
        obj.salePrice = obj.salePrice * 100
        obj.costPrice = obj.costPrice * 100
      })
      data.goodsDetail = JSON.stringify(data.goodsDetail)
      data.goodsPropertyBOListStr = JSON.stringify(data.sku.skuList).toString()
      data.skuBOListStr = JSON.stringify(data.sku.skuJson).toString()
      data.goodsImg = productPic.toString()
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
      this.typeIdChange(productObj.firstGroupCode)
      this.setState({
        productObj,
        // form
        typeId: productObj.firstGroupCode,
        specsType: productObj.secondGroupCode,
      })
      // 回显
      const formData = this.dealInfoData(1, productObj)
      formData.ifHotSale = formData.attrMap.ifHotSale
      formData.ifNewGoods = formData.attrMap.ifNewGoods
      formData.ifRecommend = formData.attrMap.ifRecommend
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
      this.formRef.current.setFieldsValue(formData)
    }
  }

  /**
   * 提交
   */
  submit = async () => {
    const { lookingRecord } = this.state
    if (this.tSku && this.tSku.current) {
      await this.tSku.current.validate()
      await this.tSku.current.onValuesChange()
    }
    const values = await this.formRef.current.validateFields()
    const confirmStr = lookingRecord ? '确认修改？' : '确认新增？'
    mConfirm(confirmStr, async () => {
      if (lookingRecord) {
        await this.edit(values)
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
      this.close()
      if (this.props.callback) {
        this.props.callback()
      }
    } else {
      message.warning(res.message || '操作失败')
    }
    // resolve();
    // });
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
      this.close()
      if (this.props.callback) {
        this.props.callback()
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
    // let isHot
    // let isNew
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
      goodsTypeList,
      goodsTypeList2,
      GoodFenzuList,
      ifNewGoodsDisable,
      ifHotSaleDisable,
      isBtnSubmit,
    } = this.state
    // const { goods } = this.props;
    // const { goodsTypeList } = goods;

    // const goodsTypeList2 = this.getSelect2List(typeId);

    return (
      // <Drawer
      //   destroyOnClose
      //   visible={visible}
      //   maskClosable={false}
      //   placement="left"
      //   width={1320}
      //   onClose={this.close}
      // >
      <div>
        <Form ref={this.formRef} {...formLayout}>
          {/* 基本信息 */}
          <Form.Item className={styles.item_title}>商品类型</Form.Item>
          <Form.Item label="商品类型" name="goodsType" rules={[{ required: true, message: '请选择商品类型' }]}>
            <Select showArrow={true} placeholder="请选择商品类型" onChange={this.typeIdChange}>
              {GoodTypeList.map((obj) => (
                <Select.Option key={obj.id} value={obj.codeKey}>
                  {obj.codeDesc}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item className={styles.item_title}>基本信息</Form.Item>
          <Form.Item label="商品图片" name="fileList" rules={[{ required: true, message: '请上传图片' }]}>
            <TUpload2 length="8" />
          </Form.Item>
          <Form.Item label="商品名称" name="goodsName" rules={[{ required: true, message: '请输入商品名称' }]}>
            <Input placeholder="请输入商品名称" maxLength="25" />
          </Form.Item>
          <Form.Item label="商品排序" name="goodsOrder" rules={[{ required: true, message: '请输入商品排序' }]}>
            <Input placeholder="请输入商品排序" maxLength="25" />
          </Form.Item>
          <Form.Item label="商品描述" name="goodsDesc">
            <Input placeholder="请输入商品描述" />
          </Form.Item>
          <Form.Item label="是否库存" name="ifStock" rules={[{ required: true, message: '请选择是否库存' }]} initialValue={0}>
            <Radio.Group onChange={this.ifStockChange}>
              <Radio value={1}>是</Radio>
              <Radio value={0}>否</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="商品一级分类" name="firstGroupCode" rules={[{ required: true, message: '请选择商品分类' }]}>
            <Select showArrow={true} placeholder="请选择商品分类" onChange={this.typeIdChange}>
              {goodsTypeList.map((obj) => (
                <Select.Option key={obj.id} value={obj.groupCode}>
                  {obj.groupName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="商品二级分类" name="secondGroupCode" rules={[{ required: true, message: '请选择商品分类' }]}>
            <Select placeholder="请选择商品分类">
              {goodsTypeList2 &&
                goodsTypeList2.map((obj) => (
                  <Select.Option key={obj.id} value={obj.groupCode}>
                    {obj.groupName}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>
          <Form.Item label="热销商品" name="ifHotSale" rules={[{ required: true, message: '请选择热销商品' }]} initialValue="1">
            {/* <Select placeholder="请选择商品分组" onChange={this.typeIdChange}>
              {GoodFenzuList.map(obj => (
                <Select.Option key={obj.id} value={obj.codeKey}>
                  {obj.codeDesc}
                </Select.Option>
              ))}
            </Select> */}
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
            {/* <Select placeholder="请选择商品分组" onChange={this.typeIdChange}>
              {GoodFenzuList.map(obj => (
                <Select.Option key={obj.id} value={obj.codeKey}>
                  {obj.codeDesc}
                </Select.Option>
              ))}
            </Select> */}
            <Radio.Group>
              <Radio value="0">是</Radio>
              <Radio value="1">否</Radio>
            </Radio.Group>
          </Form.Item>
          {/* <Form.Item
                label="销售单位"
                name="productCompany"
                rules={[{ required: true, message: '请输入销售单位' }]}
              >
                <Input placeholder="请输入销售单位" maxLength="1" />
              </Form.Item>
          
          <Form.Item
            label="在线支付"
            name="canBuy"
            rules={[{ required: true, message: '是否在线支付' }]}
            initialValue={1}
          >
            <Radio.Group onChange={this.radiochange}>
              <Radio value={1}>支持线上支付</Radio>
              <Radio value={0}>仅线上展示</Radio>
            </Radio.Group>
          </Form.Item> */}
          {/* <Form.Item
            label="商品排序"
            name="productSort"
            rules={[{ required: true, message: '请输入商品排序' }]}
          >
            <Input placeholder="请输入商品排序" />
          </Form.Item> */}

          <>
            {/* 商品详情 */}
            <Form.Item className={styles.item_title}>商品详情</Form.Item>
            <Form.Item label="详情设置" name="goodsDetail">
              <TEditDetails />
            </Form.Item>

            {/* 价格库存 */}
            <Form.Item className={styles.item_title}>价格库存</Form.Item>
            {/* <Form.Item label="规格设置" name="specsType" required initialValue={0}>
                <Radio.Group onChange={this.specsTypeChange}>
                  <Radio value={0}>单规格</Radio>
                  <Radio value={1}>多规格</Radio>
                </Radio.Group>
              </Form.Item> */}
            {/* <Form.Item
                label="销售单位"
                name="productCompany"
                rules={[{ required: true, message: '请输入销售单位' }]}
              >
                <Input placeholder="请输入销售单位" maxLength="1" />
              </Form.Item>
              <Form.Item
                label="商品原价"
                name="productPrice"
                rules={[{ required: true, message: '请输入商品原价' }]}
              >
                <Input placeholder="请输入商品原价" prefix="￥" />
              </Form.Item> */}
            {/* {specsType == 0 ? (
                <Fragment>
                  <Form.Item
                    label="商品售价"
                    name="price"
                    rules={[{ required: true, message: '请输入商品原价' }]}
                  >
                    <Input placeholder="请输入商品原价" prefix="￥" />
                  </Form.Item>
                  <Form.Item
                    label="库存"
                    name="productStock"
                    rules={[{ required: true, message: '请输入库存' }]}
                  >
                    <Input placeholder="请输入库存" />
                  </Form.Item>
                  <Form.Item
                    label="物料编号"
                    name="productStockNumber"
                    // rules={[{ required: true, message: '请输入物料编号' }]}
                  >
                    <Input placeholder="请输入物料编号" />
                  </Form.Item>
                </Fragment>
              ) : ( */}
            <Form.Item name="sku" wrapperCol={{ span: 24 }}>
              <TSku ifStockS={this.state.ifStockS} ref={this.tSku} {...formLayout} />
            </Form.Item>
            {/* )} */}

            {/* 配送设置 */}
            {/* <Form.Item className={styles.item_title}>配送设置</Form.Item>
              <Form.Item
                label="运费"
                name="transportAmount"
                rules={[{ required: true, message: '请输入商品原价' }]}
              >
                <Input placeholder="请输入商品原价" prefix="￥" />
              </Form.Item> */}
          </>

          {/* 操作 */}
          <Form.Item {...formLayoutTail}>
            <Button style={{ borderRadius: '4px' }} type="primary" onClick={this.submit} disabled={isBtnSubmit}>
              提交
            </Button>
          </Form.Item>
        </Form>
        {/* </Drawer> */}
      </div>
    )
  }
}

export default connect(({ goods }) => ({
  goods,
}))(Index)
