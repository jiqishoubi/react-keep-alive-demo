import React, { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Button, Col, Form, Input, message, Row, Select, Spin } from 'antd'
import FetchSelect from '@/components/FetchSelect'
import GoodItem from './components/GoodItem'
import GoodsGroupsForSearch from '@/components/goods/GoodsGroupsForSearch'
import { getUserRoles, putGoodsIntoMarket } from '@/services/distribution'
import styles from './index.less'
import Pagination from 'antd/es/pagination'
import requestw from '@/utils/requestw'
import api_goods from '@/services/api/goods'
import router from 'umi/router'
import { getMainAppGlobalData } from '@/utils/aboutMicroApp'
import { cloneDeep } from 'lodash'

const { Option } = Select

function Index(props) {
  const [form] = Form.useForm()
  //页数
  const pageRef = useRef(1)
  const pageSizeRef = useRef(10)
  const [tableData, setTableData] = useState([])
  const [tableListTotalNum, settableListTotalNum] = useState(0)
  const [goodTagsList, setGoodTagsList] = useState([])
  const [goodsTags, setGoodsTags] = useState([])
  const [spinShow, setSpinShow] = useState(false)

  /**
   * 请求
   */
  // useEffect(() => {
  //   onFinish()
  // }, [goodsTags])
  useEffect(() => {
    onFinish()
  }, [])

  //重置一下
  function resetSearch() {
    form.resetFields()
    setGoodsTags([])
  }
  //获取商品标签

  const getGoodTagSelect = async () => {
    let res = await requestw({
      url: api_goods.getSysCodeByParam,
      data: { codeParam: 'GOODS_TAG' },
    })
    if (res && res.code == '0') {
      setGoodTagsList(res.data)
    }
  }
  const onFinish = () => {
    pageRef.current = 1
    getTableList()
  }
  // 查询列表
  const getTableList = async () => {
    let values = form.getFieldsValue()
    values['goodsTags'] = goodsTags.join(',')
    let data = {
      ...values,
      page: pageRef.current,
      rows: pageSizeRef.current,
      // 处理
      // 商品一二级分类
      goodsGroupCodeListStr: JSON.stringify(values.goodsGroupCode ? [values.goodsGroupCode] : []),
      subGoodsGroupCodeListStr: JSON.stringify(values.subGoodsGroupCode ? [values.subGoodsGroupCode] : []),
    }
    setSpinShow(true)
    requestw({
      url: '/web/supplier/goods/getGoodsMarketList',
      data: data,
      isNeedCheckResponse: true,
    })
      .finally(() => {
        setSpinShow(false)
      })
      .then((data) => {
        setTableData(data?.data ?? [])
        settableListTotalNum(data?.rowTop ?? 0)
      })
  }

  //改变页数
  const onPageChange = (e, f) => {
    pageRef.current = e
    pageSizeRef.current = f
    getTableList()
  }

  async function addtoku(item, index) {
    const postData = {
      goodsCodes: JSON.stringify([item.goodsCode]),
    }
    setSpinShow(true)
    return requestw({
      url: '/web/supplier/goods/createGoodsBySupplier',
      data: postData,
      isNeedCheckResponse: true,
      errMsg: true,
    })
      .finally(() => {
        setSpinShow(false)
      })
      .then((data) => {
        message.success('添加成功')
        setTableData((list) => {
          let listTemp = cloneDeep(list)
          listTemp[index].goodsExistFromSupplier = true
          return listTemp
        })
      })
  }

  const colClick = (code) => {
    const tags = JSON.parse(JSON.stringify(goodsTags))
    const index = tags.findIndex((r) => r === code)
    if (index !== -1) {
      tags.splice(index, 1)
    } else {
      tags.push(code)
    }
    setGoodsTags(tags)
  }

  return (
    <>
      <Form className="global_searchForm_box" form={form} name="basic" onFinish={onFinish}>
        <Row gutter={[15, 5]}>
          <Col span={4}>
            <Form.Item name="goodsName">
              <Input placeholder="商品名称" />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item name="supplierOrgCode">
              <FetchSelect
                placeholder="供应商"
                api="/web/system/supplier/getSupplierPaggingList"
                formData={{ page: 1, rows: 9999 }}
                valueKey="orgCode"
                textKey="orgName"
                dealResFunc={(data) => data?.data ?? []}
                //搜索
                showSearch
                filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              />
            </Form.Item>
          </Col>
          <GoodsGroupsForSearch />
          <Col span={4}>
            <Form.Item name="ifAddGoodsIntoOrg">
              <Select showArrow placeholder="状态" allowClear>
                <Select.Option value={1}>已添加</Select.Option>
                <Select.Option value={0}>未添加</Select.Option>
              </Select>
            </Form.Item>
          </Col>

          <Col>
            <Button style={{ borderRadius: '4px', marginRight: 10 }} className="buttonNoSize" size="middle" onClick={resetSearch}>
              重置
            </Button>
            <Button style={{ borderRadius: '4px', marginRight: 10 }} id="userAccointinit" type="primary" size="middle" htmlType="submit">
              查询
            </Button>
          </Col>
        </Row>
      </Form>

      <Spin spinning={spinShow}>
        <div className="global_table_box">
          {/* 分类 */}
          <Row gutter={[46, 5]} style={{ marginLeft: 20, marginBottom: 10 }}>
            {goodTagsList.map((obj, index) => (
              <Col key={index} value={obj.codeKey} onClick={() => colClick(obj.codeKey)} className={goodsTags.some((r) => r === obj.codeKey) ? styles.active : styles.tags}>
                {obj.codeValue}
              </Col>
            ))}
          </Row>

          {tableData && tableData.length ? (
            <>
              <GoodItem items={tableData} goodClick={addtoku} style={{ margin: '0 20px', width: '100%' }} />
              <div
                style={{
                  width: '100%',
                  margin: '20px 0',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  marginRight: 160,
                }}
              >
                <Pagination
                  showQuickJumper={true}
                  showSizeChanger={true}
                  current={pageRef.current}
                  pageSize={pageSizeRef.current}
                  total={tableListTotalNum}
                  showTotal={(total, range) => `当前显示${range[0]}-${range[1]}条 共${total}条`}
                  onChange={onPageChange}
                />
              </div>
            </>
          ) : (
            <div className={styles.nolist}>暂无数据</div>
          )}
        </div>
      </Spin>
    </>
  )
}
export default Index
