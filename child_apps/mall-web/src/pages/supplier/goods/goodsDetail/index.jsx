import { useEffect, useState } from 'react'
import { useLocation, useHistory } from 'react-router-dom'
import { router } from 'umi'
import { cloneDeep } from 'lodash'
import { Card, Form, Input, Row, Col, Radio, Button, Select, Space, message, Spin } from 'antd'
import MinusCircleOutlined from '@ant-design/icons/lib/icons/MinusCircleOutlined'
import PlusOutlined from '@ant-design/icons/lib/icons/PlusOutlined'
import FetchSelect from '@/components/FetchSelect'
import BUpload from '@/components/BUpload'
import TEditDetails from '@/components/goods/T-EditDetails'
import SkuInput, { formatSkuFromValues, FromItemForSku } from '@/components/goods/SkuInput'
import GoodsGroupLinkage from '@/components/goods/GoodsGroupLinkage'
import api_common from '@/services/api/common'
import requestw from '@/utils/requestw'
import { UPLOAD_FILE_TYPE } from '@/utils/consts'
import { getMainAppGlobalData } from '@/utils/aboutMicroApp'
import { getDisabledByPageType, getEditApi, getGetGoodsInfoApi, isPageType } from './func'
import styles from './index.less'
import getNumber from '@/utils/number'
import { setActivateOptions } from '@/components/react-keep-alive'
import { useRequest } from 'ahooks'
import { observer } from 'mobx-react'
import useOrgIsKuajing from '@/hooks/useOrgIsKuajing'

const { Option } = Select

// sku 全部的 需要输入的key
const allSkuKeys = [
  'salePrice',
  'stockCount',
  'scribingPriceType',
  'scribingPrice',
  // 'skuName',
  'totalServiceFee',
  'saleRewardFee',
  'channelRewardFee',
  'manageServiceFee',
  'skuImg',
  // 处方药
  'drugCode',
  'medicineCode', // 20220706 新增 互联网医院药品编码
  'packageUnit',
  'frequency',
  'onceDosage',
  'dosageUnit',
  'useway',
  'durationDays',
  'targetSkuCode', // 供应商为第三方的时候
]

const priceKeyArr = [
  // 创建时的字段
  'salePrice',
  'totalServiceFee',
  // 商城商品 字段
  'scribingPrice',
  'saleRewardFee',
  'channelRewardFee',
  'manageServiceFee',
]

/**
 * options:
 * goodsCode
 * disabled? 如果有disabled的话  直接就没有提交按钮了
 */

function Index() {
  const history = useHistory()
  const { query } = useLocation()
  const isEdit = query.goodsCode
  const disabled = query?.disabled == '1'

  const [formRef] = Form.useForm()
  const [submitLoading, setSubmitLoading] = useState(false)
  const [getLoading, setGetLoading] = useState(false)
  const [rawData, setRawData] = useState(null)

  const isThirdPlatform = getMainAppGlobalData()?.userInfo?.supplierInfoDTO?.attrMap?.supplierType == 'THIRD_PLATFORM' // 供应商是否是第三方

  function getGoodsInfo() {
    setGetLoading(true)
    requestw({
      url: getGetGoodsInfoApi(),
      data: { goodsCode: query.goodsCode },
      isNeedCheckResponse: true,
      errMsg: true,
    })
      .finally(() => {
        setGetLoading(false)
      })
      .then((data) => {
        // render Form
        setRawData(data)
        if (data) {
          // sku
          const propertyArr = (data.goodsPropertyList ?? []).map((item) => {
            return {
              name: item.propertyName,
              children: item.propertyValueList.split(','),
            }
          })
          const skuJsonArr = (data.skuList ?? []).map((item) => item.goodsPropertyStr)
          // skuValues
          let skuValues = {}
          data.skuList.forEach((item) => {
            allSkuKeys.forEach((key) => {
              const formKey = `${item.goodsPropertyStr}-${key}` // '白,大-salePrice'
              if (item[key] !== undefined && item[key] !== null) {
                skuValues[formKey] = item[key]
              }
            })
          })
          // 处理sku金钱
          for (let key in skuValues) {
            // '黑色,大-salePrice'
            if (
              priceKeyArr.find((str) => {
                const reg = new RegExp(str + '$') // 只匹配结尾字符
                return reg.test(key)
              })
            ) {
              skuValues[key] = skuValues[key] / 100 // 分转元 Fee => FeeStr
            }
          }
          // sku end

          let goodsDetailArr = []
          try {
            let arr = JSON.parse(data.goodsDetail)
            goodsDetailArr = Array.isArray(arr) ? arr : []
          } catch {}

          const formData = {
            ...data,
            goodsGroupRelationList: cloneDeep(data.goodsGroupRelationList), // 分类
            goodsDetail: goodsDetailArr, // 商品详情
            ifLike: data.ifLike ?? 0,
            ifIndexShow: data.ifIndexShow ?? 0,
            // sku
            sku: {
              propertyArr,
              skuJsonArr,
            },
            ...skuValues,
            // sku end
          }
          formRef.setFieldsValue(formData)
        }
      })
  }

  // 提交
  async function handleSubmit() {
    const values = await formRef.validateFields()

    // 处理postData
    // 处理sku金钱
    for (let key in values) {
      // key '黑色,大-salePrice'
      if (
        priceKeyArr.find((str) => {
          const reg = new RegExp(str + '$') // 只匹配结尾字符
          return reg.test(key)
        })
      ) {
        values[key] = getNumber(values[key] * 100) // 元转分 FeeStr => Fee
      }
    }
    console.log('处理完金钱的values', values)

    // 规格
    let skuRes = formatSkuFromValues(values) // { goodsPropertyList, skuList }
    // 处理规格
    // 加上skuName
    skuRes.skuList = skuRes.skuList.map((skuItem, index) => {
      return {
        ...skuItem,
        skuName: skuItem.goodsPropertyStr,
      }
    })
    console.log('skuRes', skuRes)
    console.log('rawData', rawData)
    // 如果是编辑 sku 要加上 skuCode
    if (isEdit) {
      skuRes.skuList = skuRes.skuList.map((item) => {
        const rawSku = rawData.skuList.find((sku) => sku.goodsPropertyStr == item.goodsPropertyStr)

        // 处理 管理服务费
        let manageServiceFee = 0
        if (isPageType('供应商端-商城商品-详情')) {
          if (rawSku?.channelServiceFee) {
            manageServiceFee = getNumber(() => rawSku.channelServiceFee - item.saleRewardFee - item.channelRewardFee)
          }
        }

        return {
          ...item,
          skuCode: rawSku?.skuCode,
          manageServiceFee,
        }
      })
    }

    const postData = {
      orgCode: getMainAppGlobalData().userInfo?.orgCode, // 供货商
      ...values,
      goodsGroupRelationListStr: JSON.stringify(values.goodsGroupRelationList ?? []),
      goodsDetail: JSON.stringify(values.goodsDetail),
      goodsPropertyBOListStr: JSON.stringify(skuRes.goodsPropertyList ?? []),
      skuBOListStr: JSON.stringify(skuRes.skuList ?? []),
    }
    console.log('postData', postData)

    // 请求
    setSubmitLoading(true)
    requestw({
      url: isEdit ? getEditApi() : '/web/supplier/goods/createSupplierGoods',
      data: {
        goodsCode: query.goodsCode ?? undefined,
        ...postData,
      },
      isNeedCheckResponse: true,
      errMsg: true,
    })
      .finally(() => {
        setSubmitLoading(false)
      })
      .then(() => {
        message.success('操作成功')
        setActivateOptions('supplier_goodsMng', isEdit ? { isEditSuccess: true } : { isAddSuccess: true })
        history.goBack()
      })
  }

  // 生成 互联网医院药品编码
  const { loading: loading_getMedicineCode, run: getMedicineCode } = useRequest(
    (values) => {
      return new Promise((resolve) => {
        const { key_drugCode, key_medicineCode } = values
        const drugCode = formRef.getFieldValue(key_drugCode)
        if (!drugCode) {
          message.warning('请输入药物标准编码')
          return resolve()
        }
        return requestw({
          url: '/web/supplier/goods/getMedicineCode',
          data: { approvalNumber: drugCode },
          isNeedCheckResponse: true,
          errMsg: true,
        })
          .finally(resolve)
          .then((data) => {
            if (data) {
              console.log('设置 medicineCode', data)
              formRef.setFieldsValue({ [key_medicineCode]: data })
            }
          })
      })
    },
    { manual: true }
  )

  // 编辑 获取商品信息
  useEffect(() => {
    if (query.goodsCode) {
      getGoodsInfo()
    }
  }, [query])

  const { isOrgKuajing } = useOrgIsKuajing(() => {
    formRef.setFieldsValue({ goodsType: 'INTERNATION' })
  })

  return (
    <Spin spinning={getLoading}>
      <Form form={formRef} labelCol={{ span: 4 }} wrapperCol={{ span: 15 }}>
        <Card title="基本信息" bordered={false}>
          <Row>
            <Col span={12}>
              <Form.Item label="商品类型" name="goodsType" rules={[{ required: true, message: '请选择商品类型' }]}>
                <FetchSelect
                  api="/web/sys/code/getSysCodeByParam"
                  formData={{
                    codeParam: 'GOODS_TYPE',
                    isOrgKuajing, // 这个变量 FetchSelect是不需要的，是为了触发重新请求
                  }}
                  dealResFunc={(data) => {
                    if (!isOrgKuajing) {
                      return (data ?? []).filter((item) => item.codeKey !== 'INTERNATION') // 普通供应商不能选择 跨境
                    }
                    return data ?? []
                  }}
                  disabled={isEdit || isOrgKuajing}
                />
              </Form.Item>
              {/* 商品一二级分类 */}
              <Form.Item label="商品类目" name="goodsGroupRelationList" required initialValue={[{ groupCode: '', subGroupCode: '' }]}>
                <GoodsGroupLinkage disabled={getDisabledByPageType()} />
              </Form.Item>
              <Form.Item label="商品名称" name="goodsName" rules={[{ required: true, message: '请输入商品名称' }]}>
                <Input placeholder="请输入" disabled={getDisabledByPageType()} />
              </Form.Item>
              <Form.Item label="商品描述" name="goodsDesc" rules={[{ required: true, message: '请输入商品描述' }]}>
                <Input.TextArea placeholder="请输入" disabled={getDisabledByPageType()} />
              </Form.Item>
              <Form.Item label="商品图片" name="goodsImg" rules={[{ required: true, message: '请上传商品图片' }]}>
                <BUpload
                  valueType="string<,>"
                  type="img"
                  api={api_common.uploadApi}
                  getPostData={(e) => {
                    const file = e.file
                    return {
                      fileType: UPLOAD_FILE_TYPE,
                      fileExt: file.type.split('/')[1],
                    }
                  }}
                  length={20}
                  isCanSort={true}
                  // imgCrop={{
                  //   quality: 0.6,
                  //   modalWidth: 800,
                  // }}
                  disabled={getDisabledByPageType()}
                  multiple={true}
                />
              </Form.Item>
              <Form.Item label="是否有库存" name="ifStock" rules={[{ required: true }]} initialValue={1}>
                <Radio.Group disabled={getDisabledByPageType()}>
                  <Radio value={1}>是</Radio>
                  <Radio value={0}>否</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item label="是否同步商城" name="ifSyncMall" rules={[{ required: true }]} initialValue={1}>
                <Radio.Group disabled={isEdit}>
                  <Radio value={1}>是</Radio>
                  <Radio value={0}>否</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item label="商品厂家" name="goodsFactory" rules={[{ required: true, message: '请输入商品厂家' }]}>
                <Input placeholder="请输入" disabled={getDisabledByPageType()} />
              </Form.Item>
              <Form.Item label="商品排序" name="goodsOrder" rules={[{ required: true, message: '请输入商品排序' }]}>
                <Input placeholder="请输入" />
              </Form.Item>
              {isPageType('供应商端-商城商品-详情') && (
                <>
                  <Form.Item label="猜你喜欢" name="ifLike" rules={[{ required: true }]} initialValue={0}>
                    <Radio.Group>
                      <Radio value={1}>是</Radio>
                      <Radio value={0}>否</Radio>
                    </Radio.Group>
                  </Form.Item>
                  <Form.Item label="展示首页" name="ifIndexShow" rules={[{ required: true }]} initialValue={0}>
                    <Radio.Group>
                      <Radio value={1}>是</Radio>
                      <Radio value={0}>否</Radio>
                    </Radio.Group>
                  </Form.Item>
                </>
              )}
            </Col>
          </Row>
        </Card>

        <Card title="商品详情" bordered={false}>
          <Row>
            <Col span={12}>
              <Form.Item label="详情设置" name="goodsDetail">
                <TEditDetails disabled={getDisabledByPageType()} />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <Card title="价格库存" bordered={false}>
          <Form.Item
            noStyle
            // shouldUpdate
            shouldUpdate={(prevValues, curValues) => {
              let flag = false
              // 是否有 库存
              if (prevValues.ifStock !== curValues.ifStock) {
                flag = true
              }
              // 商品类型 处方药
              if ((prevValues.goodsType || curValues.goodsType) && prevValues.goodsType !== curValues.goodsType) {
                flag = true
              }
              return flag
            }}
          >
            {(form) => {
              const ifStock = form.getFieldValue('ifStock')
              const isPrescription = form.getFieldValue('goodsType') == 'MEDICINE' // 是否处方药

              // sku columns
              const skuInputColumns = [
                {
                  title: '售价',
                  dataIndex: 'salePrice',
                  render: (_, record) => {
                    const isSkuApprBack = record.apprStatus == '93' // sku审核未通过
                    return (
                      <FromItemForSku
                        extra={isSkuApprBack && <span style={{ fontSize: 12, color: 'orange' }}>审核未通过</span>}
                        name={`${record.goodsPropertyStr}-salePrice`}
                        rules={[{ required: true, message: '请输入销售价格' }]}
                      >
                        <Input placeholder="请输入" suffix="元" allowClear disabled={getDisabledByPageType()} />
                      </FromItemForSku>
                    )
                  },
                },
                ...(ifStock == '1'
                  ? [
                      {
                        title: '库存',
                        dataIndex: 'stockCount',
                        render: (_, record) => {
                          return (
                            <FromItemForSku name={`${record.goodsPropertyStr}-stockCount`} rules={[{ required: true, message: '请输入库存' }]}>
                              <Input placeholder="请输入" allowClear disabled={getDisabledByPageType()} />
                            </FromItemForSku>
                          )
                        },
                      },
                    ]
                  : []),
                ...(isPageType('供应商端-商品管理-详情')
                  ? [
                      ...(isThirdPlatform
                        ? [
                            {
                              title: '第三⽅SKU编码',
                              dataIndex: 'targetSkuCode',
                              width: 200,
                              render: (_, record) => {
                                return (
                                  <FromItemForSku name={`${record.goodsPropertyStr}-targetSkuCode`} rules={[{ required: false, message: '请输入第三⽅SKU编码' }]}>
                                    <Input placeholder="请输入" allowClear />
                                  </FromItemForSku>
                                )
                              },
                            },
                          ]
                        : []),
                    ]
                  : []),
                ...(isPageType('供应商端-商城商品-详情')
                  ? [
                      {
                        title: '划线价类型',
                        dataIndex: 'scribingPriceType',
                        render: (_, record) => {
                          return (
                            <FromItemForSku name={`${record.goodsPropertyStr}-scribingPriceType`} rules={[{ required: false, message: '请选择划线价类型' }]} style={{ width: 140 }}>
                              <FetchSelect api="/web/sys/code/getSysCodeByParam" formData={{ codeParam: 'SCRIBING_PRICE_TYPE' }} />
                            </FromItemForSku>
                          )
                        },
                      },
                      {
                        title: '划线价',
                        dataIndex: 'scribingPrice',
                        render: (_, record) => {
                          return (
                            <FromItemForSku name={`${record.goodsPropertyStr}-scribingPrice`} rules={[{ required: true, message: '请输入划线价' }]}>
                              <Input placeholder="请输入" suffix="元" allowClear />
                            </FromItemForSku>
                          )
                        },
                      },
                    ]
                  : []),
                // {
                //   title: '规格名',
                //   dataIndex: 'skuName',
                //   render: (_, record) => {
                //     return (
                //       <FromItemForSku name={`${record.goodsPropertyStr}-skuName`} rules={[{ required: true, message: '请输入规格名' }]}>
                //         <Input placeholder="请输入" allowClear disabled={getDisabledByPageType()} />
                //       </FromItemForSku>
                //     )
                //   },
                // },
                {
                  title: '总服务费',
                  dataIndex: 'totalServiceFee',
                  render: (_, record) => {
                    const isSkuApprBack = record.apprStatus == '93' // sku审核未通过
                    return (
                      <FromItemForSku
                        extra={isSkuApprBack && <span style={{ fontSize: 12, color: 'orange' }}>审核未通过</span>}
                        name={`${record.goodsPropertyStr}-totalServiceFee`}
                        rules={[{ required: true, message: '请输入总服务费' }]}
                      >
                        <Input placeholder="请输入" allowClear suffix="元" disabled={getDisabledByPageType()} />
                      </FromItemForSku>
                    )
                  },
                },
                ...(isPageType('供应商端-商城商品-详情')
                  ? [
                      {
                        title: '渠道服务费',
                        dataIndex: 'channelServiceFeeStr',
                        width: 120,
                        render: (v, record) => {
                          return v && <Form.Item>{v}元</Form.Item>
                        },
                      },
                      {
                        title: '销售佣金',
                        dataIndex: 'saleRewardFee',
                        render: (_, record) => {
                          return (
                            <FromItemForSku name={`${record.goodsPropertyStr}-saleRewardFee`} rules={[{ required: true, message: '请输入销售佣金' }]}>
                              <Input placeholder="请输入" suffix="元" allowClear />
                            </FromItemForSku>
                          )
                        },
                      },
                      {
                        title: '渠道佣金',
                        dataIndex: 'channelRewardFee',
                        render: (_, record) => {
                          return (
                            <FromItemForSku name={`${record.goodsPropertyStr}-channelRewardFee`} rules={[{ required: true, message: '请输入渠道佣金' }]}>
                              <Input placeholder="请输入" suffix="元" allowClear />
                            </FromItemForSku>
                          )
                        },
                      },
                      {
                        title: '管理服务费',
                        dataIndex: 'manageServiceFee',
                        render: (_, record) => {
                          return (
                            <Form.Item
                              noStyle
                              shouldUpdate={(prevValues, curValues) => {
                                const key1 = `${record.goodsPropertyStr}-saleRewardFee` // 销售佣金
                                const key2 = `${record.goodsPropertyStr}-channelRewardFee` // 渠道佣金
                                return prevValues[key1] != curValues[key1] || prevValues[key2] != curValues[key2]
                              }}
                            >
                              {(form) => {
                                const manageServiceFeeKey = `${record.goodsPropertyStr}-manageServiceFee` // 管理服务费
                                const sum = getNumber(record.channelServiceFeeStr)
                                const price1 = form.getFieldValue(`${record.goodsPropertyStr}-saleRewardFee`) // 销售佣金
                                const price2 = form.getFieldValue(`${record.goodsPropertyStr}-channelRewardFee`) // 渠道佣金
                                const calcedManageServiceFee = getNumber(() => sum - price1 - price2) // 通过计算的 管理服务费
                                return <Form.Item>{calcedManageServiceFee}元</Form.Item>
                              }}
                            </Form.Item>
                          )
                        },
                      },
                    ]
                  : []),
                {
                  title: '图片',
                  dataIndex: 'skuImg',
                  render: (_, record) => {
                    return (
                      <FromItemForSku name={`${record.goodsPropertyStr}-skuImg`} rules={[{ required: false, message: '请上传图片' }]}>
                        <BUpload
                          valueType="string"
                          type="img"
                          api={api_common.uploadApi}
                          getPostData={(e) => {
                            const file = e.file
                            return {
                              fileType: UPLOAD_FILE_TYPE,
                              fileExt: file.type.split('/')[1],
                            }
                          }}
                          length={1}
                          imgCrop={{
                            quality: 0.6,
                            modalWidth: 800,
                          }}
                          disabled={getDisabledByPageType()}
                        />
                      </FromItemForSku>
                    )
                  },
                },
                // 如果是处方药
                ...(isPrescription
                  ? [
                      {
                        title: '药物标准编码',
                        dataIndex: 'drugCode',
                        render: (_, record) => {
                          return (
                            <FromItemForSku name={`${record.goodsPropertyStr}-drugCode`} rules={[{ required: true, message: '请输入药物标准编码' }]}>
                              <Input
                                placeholder="请输入"
                                allowClear
                                disabled={getDisabledByPageType()}
                                onChange={() => {
                                  // 药物标准编码 和 互联网医院药品编码 联动
                                  // 它改变的时候 清空 互联网医院药品编码
                                  const key_medicineCode = `${record.goodsPropertyStr}-medicineCode`
                                  formRef.setFieldsValue({ key_medicineCode: undefined })
                                }}
                              />
                            </FromItemForSku>
                          )
                        },
                      },
                      // 20220706 新增 互联网医院药品编码
                      {
                        title: '互联网医院药品编码',
                        dataIndex: 'medicineCode',
                        width: 250,
                        render: (_, record) => {
                          return (
                            <Row wrap={false}>
                              <FromItemForSku name={`${record.goodsPropertyStr}-medicineCode`} rules={[{ required: true, message: '请输入互联网医院药品编码' }]}>
                                <Input disabled />
                              </FromItemForSku>
                              <Button
                                type="primary"
                                size="small"
                                style={{ margin: '3px 0 0 -15px' }}
                                onClick={() => {
                                  const key_drugCode = `${record.goodsPropertyStr}-drugCode`
                                  const key_medicineCode = `${record.goodsPropertyStr}-medicineCode`
                                  getMedicineCode({ key_drugCode, key_medicineCode })
                                }}
                              >
                                生成
                              </Button>
                            </Row>
                          )
                        },
                      },
                      {
                        title: '药品包装单位',
                        dataIndex: 'packageUnit',
                        render: (_, record) => {
                          return (
                            <FromItemForSku name={`${record.goodsPropertyStr}-packageUnit`} rules={[{ required: true, message: '请输入药品包装单位' }]}>
                              <Input placeholder="请输入" allowClear disabled={getDisabledByPageType()} />
                            </FromItemForSku>
                          )
                        },
                      },
                      {
                        title: '药品频次',
                        dataIndex: 'frequency',
                        render: (_, record) => {
                          return (
                            <FromItemForSku name={`${record.goodsPropertyStr}-frequency`} rules={[{ required: true, message: '请选择药品频次' }]}>
                              <FetchSelect api="/web/sys/code/getSysCodeByParam" formData={{ codeParam: 'MEDICATE_FREQUENCY' }} disabled={getDisabledByPageType()} style={{ width: 110 }} />
                            </FromItemForSku>
                          )
                        },
                      },
                      {
                        title: '药品剂量',
                        dataIndex: 'onceDosage',
                        render: (_, record) => {
                          return (
                            <FromItemForSku name={`${record.goodsPropertyStr}-onceDosage`} rules={[{ required: true, message: '请输入药品剂量' }]}>
                              <Input placeholder="请输入" allowClear disabled={getDisabledByPageType()} />
                            </FromItemForSku>
                          )
                        },
                      },
                      {
                        title: '药品剂量单位',
                        dataIndex: 'dosageUnit',
                        render: (_, record) => {
                          return (
                            <FromItemForSku name={`${record.goodsPropertyStr}-dosageUnit`} rules={[{ required: true, message: '请输入药品剂量单位' }]}>
                              <Input placeholder="请输入" allowClear disabled={getDisabledByPageType()} />
                            </FromItemForSku>
                          )
                        },
                      },
                      {
                        title: '药品使用途径',
                        dataIndex: 'useway',
                        render: (_, record) => {
                          return (
                            <FromItemForSku name={`${record.goodsPropertyStr}-useway`} rules={[{ required: true, message: '请选择药品使用途径' }]}>
                              <FetchSelect api="/web/sys/code/getSysCodeByParam" formData={{ codeParam: 'MEDICATE_USEWAY' }} disabled={getDisabledByPageType()} style={{ width: 110 }} />
                            </FromItemForSku>
                          )
                        },
                      },
                      {
                        title: '药品用药天数',
                        dataIndex: 'durationDays',
                        render: (_, record) => {
                          return (
                            <FromItemForSku name={`${record.goodsPropertyStr}-durationDays`} rules={[{ required: true, message: '请输入药品用药天数' }]}>
                              <Input placeholder="请输入" allowClear disabled={getDisabledByPageType()} />
                            </FromItemForSku>
                          )
                        },
                      },
                    ]
                  : []),
              ]

              return (
                <Form.Item noStyle name="sku" wrapperCol={{ span: 24 }}>
                  <SkuInput columns={skuInputColumns} tableData={rawData?.skuList ?? []} disabled={isEdit} />
                </Form.Item>
              )
            }}
          </Form.Item>
          <div className={styles.sku_tips}>注：渠道服务费=销售佣金+渠道佣金+管理服务费</div>

          <Row>
            <Col span={12}>
              <Form.Item label=" " colon={false}>
                {disabled ? (
                  <Row type="flex" gutter={10}>
                    <Col>
                      <Button type="primary" style={{ width: 200 }} onClick={() => router.goBack()}>
                        返回
                      </Button>
                    </Col>
                  </Row>
                ) : (
                  <Row type="flex" gutter={10}>
                    <Col>
                      <Button type="primary" style={{ width: 200 }} onClick={handleSubmit} loading={submitLoading}>
                        提交
                      </Button>
                    </Col>
                    <Col>
                      <Button onClick={() => history.goBack()}>取消</Button>
                    </Col>
                  </Row>
                )}
              </Form.Item>
            </Col>
          </Row>
        </Card>
      </Form>
    </Spin>
  )
}
export default observer(Index)
