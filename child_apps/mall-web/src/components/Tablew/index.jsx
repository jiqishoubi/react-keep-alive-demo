/**
 * 封装table
 */
/**
 * props:
 * 查询条件
 * 1/ queryItems [{type,title,key,options}]
 *    type :默认input，select，date, dom
 *     注：如果是date key请包含start和end字段  range:时间范围
 *        如果是select，codeParam 字符串，customOptions [{codeKey,codeValue}]
 *    dom就是自定义  具有dom属性
 *    options 就是formItem的配置
 *
 * 表格
 * 4/ rowKey
 * 1/ queryApi
 * 2/ columns [{title,key}]
 *    可以写width  fixed属性
 *    type如果是 caozuo的话，可以写render属性
 * 3/ postData {} 额外参数
 */
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Table, Form, Row, Col, Input, Select, Button, Tooltip, DatePicker, message, Modal } from 'antd'
import requestw from '@/utils/requestw'
import { CaretDownOutlined, RedoOutlined } from '@ant-design/icons'
import router from 'umi/router'
import { useGetRow } from '@/hooks/useGetRow'
import { goodsExportTradeReport, goodsGetExportInfo, goodsGetPagingList } from '@/pages/statistics/spread/service'

import { supplierExportTradeReport, supplierGetExportInfo, supplierGetPagingList } from '@/pages/supplier/services/goods'
import { batchUpdateGoodsStatus } from '@/services/goods'
import FetchSelect from '@/components/FetchSelect'
import { getOrgKind } from '@/utils/utils'
import _ from 'lodash'
import TypeLinkage from '@/pages/goods/components/Typelinkage'
import api_goods from '@/services/api/goods'
const { Option } = Select

class index extends React.Component {
  constructor(props) {
    super(props)
    // 日期的key
    let startDateKey = null
    let endDateKey = null

    this.state = {
      // 查询
      startDateKey,
      endDateKey,
      // 表格
      page: 1,
      pageSize: 10,
      tableInfo: null,
      loading_table: false,
      //导出数据
      oldData: '',
      educe: false,
      interTime: '',
      pagingList: [],
      pagingShow: false,
      pagingLoading: false,
      selectedData: [],
      rowKey: 'goodsCode',
      selectedRowKeys: [],
      goodsTypeList: [],
      goodsTypeList2: [],
    }
    this.formRef = React.createRef()
    if (props.onRef) {
      //如果父组件传来该方法 则调用方法将子组件this指针传过去
      props.onRef(this)
    }
  }

  componentDidMount() {
    this.goodsGetPagingList_()
    this.getSelect1()
  }
  /**
   * 方法
   */
  // 查询条件相关

  /** 日期方法开始 */
  // 开始日期不能大于 结束日期

  disabledStartDate = (startValue) => {
    const { endDateKey } = this.state
    const { form } = this.props
    let endValue = form.getFieldValue(endDateKey)
    return startValue.valueOf() > endValue.valueOf()
  }

  disabledEndDate = (endValue) => {
    const { startDateKey } = this.state
    const { form } = this.props
    let startValue = form.getFieldValue(startDateKey)
    return startValue.valueOf() > endValue.valueOf() || endValue.valueOf() > new Date().getTime()
  }
  // 限制查询订单时间最大为range天

  onStartChange = (startValue, range = 30) => {
    const { endDateKey } = this.state
    const { form } = this.props
    let endValue = form.getFieldValue(endDateKey)
    let startStamp = startValue.valueOf()
    let endStamp = endValue.valueOf()
    if (endStamp - startStamp > 86400000 * range) {
      form.setFieldsValue({
        [endDateKey]: moment(startStamp + 86400000 * range).fromNow(),
      })
    }
  }

  onEndChange = (endValue, range = 30) => {
    const { startDateKey } = this.state
    const { form } = this.props
    let startValue = form.getFieldValue(startDateKey)
    let startStamp = startValue.valueOf()
    let endStamp = endValue.valueOf()
    if (endStamp - startStamp > 86400000 * range) {
      form.setFieldsValue({
        [startDateKey]: moment(endStamp - 86400000 * range).fromNow(),
      })
    }
  }
  /** 日期方法结束 end */

  resetSearch = () => {
    this.formRef.current.resetFields()
  }

  clickSearch = () => {
    this.setState({ page: 1 }, () => {
      this.getData()
    })
  }
  // 查询条件相关 end
  // 表格相关

  getData = (options) => {
    const { startDateKey, endDateKey, page, pageSize } = this.state
    const { queryApi, modifydata, postData: postData2, requestType } = this.props
    this.formRef.current.validateFields().then(async (values) => {
      let formData = values
      values && values.goodsType ? (values['goodsType'] = values.goodsType.join(',')) : ''
      values && values.goodsTags ? (values['goodsTags'] = values.goodsTags.join(',')) : ''
      let postData_date = {}
      if (startDateKey && endDateKey) {
        postData_date = {
          [startDateKey]: formData[startDateKey].format('YYYY-MM-DD'),
          [endDateKey]: formData[endDateKey].format('YYYY-MM-DD'),
        }
      }
      let postData = {
        rows: pageSize,
        page,
        ...formData,
        ...postData_date,
        ...postData2,
        ...options,
      }

      this.setState({
        loading_table: true,
        oldData: postData,
      })
      let res = await requestw({
        type: requestType || 'post',
        url: queryApi,
        data: postData,
      })

      if (!res || res.code !== '0') {
        this.setState({ loading_table: false })
        message.warning((res && res.message) || '暂无数据')
        return
      }

      this.setState({
        tableInfo: res.data,
        page: postData.page,
        loading_table: false,
      })
    })
  }

  onFinish = () => {}

  changePage = (current) => {
    this.setState(
      {
        page: current,
        pageSize: this.state.pageSize,
      },
      () => {
        this.getData()
      }
    )
  }

  tableOnChange = (current) => {
    this.setState(
      {
        page: current.current,
        pageSize: current.pageSize,
      },
      () => {
        this.getData()
      }
    )
  }

  getTableCurInfo = () => {
    return JSON.parse(JSON.stringify(this.state))
  }

  addGoods = () => {
    // this.goodsDrawer.current.open();
    if (this.props.isSupplier) {
      router.push({
        pathname: '/web/supplier/company/goodsmgr/goodsDetail',
      })
    } else {
      router.push({
        pathname: '/web/company/goodsmgr/goodsDetail',
      })
    }

    //跳转新页面
    // window.open(window.location.origin + '/#/nside/addgoods');
  }

  //导出
  educeFinish = async () => {
    this.setState({
      pagingLoading: true,
    })
    let code
    let value = this.state.oldData
    let res

    if (this.props.isSupplier) {
      res = await supplierExportTradeReport(value)
    } else {
      res = await goodsExportTradeReport(value)
    }

    if (res && res.code === '0') {
      code = res.data
      message.success(res.message)
      let interTimes = setInterval(async () => {
        let data
        if (this.props.isSupplier) {
          data = await supplierGetExportInfo({ exportCode: code })
        } else {
          data = await goodsGetExportInfo({ exportCode: code })
        }
        if (data.code === '0' && data.data.status === '90') {
          clearInterval(interTimes)
          this.goodsGetPagingList_()
          this.setState({
            pagingLoading: false,
          })
        }
      }, 1000)

      setTimeout(() => {
        this.setState({
          interTime: interTimes,
        })
        clearInterval(this.state.interTime)
      }, 1000)
    } else {
      clearInterval(this.state.interTime)
      message.error(res.message)

      this.setState({
        pagingLoading: false,
      })
    }
  }

  //导出表头
  pagingColumns = [
    {
      title: '导出任务编码',
      align: 'center',
      dataIndex: 'exportCode',
    },
    {
      title: '导出时间',
      align: 'center',
      dataIndex: 'exportDateStr',
    },
    {
      title: '完成时间',
      align: 'center',
      dataIndex: 'finishDateStr',
    },
    {
      title: '状态',
      align: 'center',
      dataIndex: 'statusName',
    },
    {
      title: '操作',
      align: 'center',
      render: (e) => {
        return e.status === '90' ? (
          <a
            onClick={() => {
              window.location.href = e.exportFileUrl
            }}
          >
            下载Excel
          </a>
        ) : (
          ''
        )
      },
    },
  ]

  //导出历史订单获取
  goodsGetPagingList_ = async (value) => {
    this.setState({
      pagingShow: true,
      pagingLoading: false,
    })
    let res

    if (this.props.isSupplier) {
      res = await supplierGetPagingList(value)
    } else {
      res = await goodsGetPagingList(value)
    }

    if (res && res.code === '0') {
      let data
      if (res.data.data.length > 4) {
        data = res.data.data.slice(0, 5)
      } else data = res.data.data
      this.setState({
        pagingList: data,
        pagingShow: false,
      })
    }
  }

  // 表格相关 end

  //table批量设置
  //批量
  updateSelectedRows = (isSelected, list) => {
    let arr = []
    if (isSelected) {
      arr = _.uniqBy([...this.state.selectedData, ...list], this.props.rowKey)
    } else {
      arr = _.differenceBy(this.state.selectedData, list, this.props.rowKey) // 从第一个数组删除第二个数组中的元素
    }
    let viceArray = JSON.parse(JSON.stringify(arr))
    const rowData = viceArray.map((row) => row[this.props.rowKey])
    this.setState({
      selectedData: arr,
      selectedRowKeys: rowData,
    })
  }

  // 批量上下架

  rowSelectionChange = async (status) => {
    const { selectedRowKeys } = this.state
    if (!selectedRowKeys.length) {
      return
    }
    const postData = {
      goodsCodes: selectedRowKeys.join(','),
      status,
    }
    const res = await batchUpdateGoodsStatus(postData)
    if (res && res.code === '0') {
      this.setState({
        selectedData: [],
        selectedRowKeys: [],
      })
      this.clickSearch()
      message.success('成功')
    } else {
      message.warn('失败')
    }
  }

  getSelect1 = async () => {
    let res = await requestw({
      url: api_goods.queryFirstGroupListForSelect(),
    })
    if (res && res.code == '0' && res.data && res.data.data && res.data.data.length) {
      this.setState({
        goodsTypeList: res.data.data,
      })
      this.typeChange(true)
    } else {
      this.setState({
        goodsTypeList: [],
      })
    }
  }

  typeChange = async (show) => {
    let typeId = this.formRef.current.getFieldValue('groupCode')
    let childGroupCode = this.formRef.current.getFieldValue('childGroupCode')

    show &&
      childGroupCode &&
      this.formRef.current.setFieldsValue({
        childGroupCode: '',
      })
    let res = await requestw({
      url: api_goods.querySecondGroupListForSelect(),
      data: {
        groupCode: typeId,
      },
    })
    if (res && res.code == '0' && res.data && res.data.length) {
      this.setState({
        goodsTypeList2: res.data,
      })
    } else {
      this.setState({
        goodsTypeList2: [],
      })
    }
  }

  /**
   * 渲染
   */
  render() {
    const {
      // 查询
      // startDateKey,
      // endDateKey,
      // 表格
      tableInfo,
      // loading
      loading_table,
      oldData,
      educe,
      interTime,
      pagingList,
      pagingShow,
      pagingLoading,
      selectedRowKeys,
      goodsTypeList,
      goodsTypeList2,
    } = this.state

    const rowSelection = {
      fixed: true,
      selectedRowKeys,
      getCheckboxProps: (record) => {
        return { disabled: false }
      },
      onSelect: (row, isSelected, _) => {
        this.updateSelectedRows(isSelected, [row])
      },
      onSelectAll: (isSelected, _, changeRows) => {
        this.updateSelectedRows(isSelected, changeRows)
      },
    }

    const {
      form,
      externalplacement,
      queryItems,
      //表格
      columns,
    } = this.props

    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 15 },
    }

    // 查询条件
    const panel = queryItems ? (
      <div
        style={{
          margin: '0 20px',
          background: '#FEFFFE',
          border: '1ppx solid red',
        }}
      >
        <br />
        <Form {...formItemLayout} onFinish={this.onFinish} form={form} ref={this.formRef}>
          <Row gutter={0} type="flex" align="middle">
            {queryItems.map((obj, index) => {
              if (!obj) return null
              let inputDom
              if (obj.type == 'fetchselect') {
                inputDom = (
                  <FetchSelect
                    {...obj.props}
                    style={{
                      width: '220px',
                      marginRight: '6px',
                    }}
                  />
                )
              } else if (obj.type == 'select') {
                let optionsArr = null
                optionsArr = obj.customOptions

                inputDom = (
                  <Select
                    style={{
                      width: '220px',
                      marginRight: '6px',
                    }}
                    showArrow={true}
                    placeholder={obj.title}
                    allowClear
                    {...obj.props}
                  >
                    {optionsArr && optionsArr.length
                      ? optionsArr.map((opObj, opIndex) => (
                          <Option key={opIndex} value={opObj.codeKey}>
                            {opObj.codeValue}
                          </Option>
                        ))
                      : null}
                  </Select>
                )
              } else if (obj.type == 'date') {
                inputDom = (
                  <DatePicker
                    format="YYYY-MM-DD"
                    placeholder={obj.key.indexOf('start') > -1 ? '请选择开始日期' : '请选择结束日期'}
                    allowClear={false}
                    style={{ width: 25 }}
                    //方法
                    disabledDate={obj.key.indexOf('start') > -1 ? this.disabledStartDate : this.disabledEndDate}
                    onChange={
                      obj.range == false
                        ? () => {}
                        : obj.key.indexOf('start') > -1
                        ? (val) => {
                            this.onStartChange(val, obj.range)
                          }
                        : (val) => {
                            this.onEndChange(val, obj.range)
                          }
                    }
                  />
                )
              } else if (obj.type == 'dom') {
                inputDom = obj.dom
              } else {
                //input
                inputDom = <Input placeholder={obj.title} allowClear style={{ width: 220, marginRight: '6px' }} />
              }

              return (
                <Col key={index}>
                  <Form.Item style={{ marginRight: '6px' }} name={obj.key}>
                    {inputDom}
                  </Form.Item>
                </Col>
              )
            })}
            {this.props.grouping && (
              <>
                <Form.Item style={{ marginRight: 15, width: 220 }} name="groupCode">
                  <Select allowClear style={{ width: 220 }} showArrow={true} placeholder="一级类目" onChange={() => this.typeChange(true)}>
                    {goodsTypeList &&
                      goodsTypeList.map((obj, index) => (
                        <Select.Option key={obj.groupCode} value={obj.groupCode}>
                          {obj.groupName}
                        </Select.Option>
                      ))}
                  </Select>
                </Form.Item>
                <Form.Item style={{ marginRight: 6, width: 220 }} name="childGroupCode">
                  <Select allowClear style={{ width: 220 }} showArrow={true} placeholder="二级类目">
                    {goodsTypeList2 &&
                      goodsTypeList2.map((obj) => (
                        <Select.Option key={obj.id} value={obj.groupCode}>
                          {obj.groupName}
                        </Select.Option>
                      ))}
                  </Select>
                </Form.Item>
              </>
            )}

            {queryItems.length ? (
              <>
                {externalplacement || null}
                <Col>
                  <Button
                    style={{
                      marginRight: '10px',
                      borderRadius: '4px',
                      marginBottom: 24,
                    }}
                    className="buttonNoSize"
                    onClick={this.resetSearch}
                  >
                    重置
                  </Button>
                  <Button
                    style={{
                      borderRadius: '4px',
                      marginRight: 10,
                      marginBottom: 24,
                    }}
                    type="primary"
                    onClick={this.clickSearch}
                  >
                    查询
                  </Button>

                  {this.props.isAddGoods ? (
                    <>
                      {!getOrgKind().isAdmin && (
                        <Button
                          type="primary"
                          style={{
                            borderRadius: '4px',
                            marginBottom: 24,
                            marginRight: 10,
                          }}
                          onClick={this.addGoods}
                        >
                          添加商品
                        </Button>
                      )}

                      <Button
                        type="primary"
                        style={{
                          borderRadius: '4px',
                          marginBottom: 24,
                          marginRight: 10,
                        }}
                        onClick={() => this.rowSelectionChange(2)}
                      >
                        批量上架
                      </Button>

                      <Button
                        type="primary"
                        style={{
                          borderRadius: '4px',
                          marginBottom: 24,
                          marginRight: 10,
                        }}
                        onClick={() => this.rowSelectionChange(3)}
                      >
                        批量下架
                      </Button>

                      <Button
                        type="primary"
                        style={{
                          borderRadius: '4px',
                          marginBottom: 24,
                          background: '#1D7BFF',
                        }}
                        onClick={() => {
                          this.setState({
                            educe: true,
                          })
                        }}
                      >
                        导出
                      </Button>
                    </>
                  ) : (
                    ''
                  )}
                </Col>
              </>
            ) : null}
          </Row>
        </Form>
      </div>
    ) : null

    // 表格 列
    let columnsTemp = columns.map((obj, index) => {
      let columnObj
      if (obj.type && obj.type.indexOf('caozuo') > -1) {
        //操作
        columnObj = {
          key: 'caozuo',
          align: obj.align ? obj.align : 'center',
          title: obj.title,
          render: (record) => {
            return obj.render(record)
          },
        }
      } else {
        if (obj.render) {
          columnObj = {
            align: obj.align ? obj.align : 'center',
            title: obj.title,
            key: obj.key || index,
            dataIndex: obj.key || undefined,
            render: (record) => {
              return obj.render(record)
            },
          }
        } else {
          columnObj = {
            align: obj.align ? obj.align : 'center',
            title: obj.title,
            key: obj.key || index,
            dataIndex: obj.key || undefined,
          }
        }
      }
      // width fixed属性
      if (obj.width) columnObj.width = obj.width
      if (obj.fixed) columnObj.fixed = obj.fixed
      if (obj.isCompany && getOrgKind().isCompany) {
        columnObj = { title: ' ', width: 0 }
      }
      return columnObj
    })

    /**
     * dom
     */
    return (
      <div style={{ background: '#fff', margin: '0 20px' }}>
        {panel}
        {/* {queryItems} */}

        <Table
          rowKey={this.props.rowKey}
          style={{ margin: '20px  20px' }}
          rowClassName={useGetRow}
          scroll={{ x: 1500 }}
          columns={columnsTemp}
          dataSource={tableInfo && tableInfo.data ? tableInfo.data : []}
          loading={loading_table}
          rowSelection={this.props.rowSelection ? rowSelection : ''}
          pagination={{
            showQuickJumper: true,
            showSizeChanger: true,
            showTotal: (total, range) => `当前显示${range[0]}-${range[1]}条 共${total}条`,
            current: this.state.page,
            pageSize: this.state.pageSize,
            total: tableInfo && tableInfo.rowTop ? tableInfo.rowTop : 0,
          }}
          onChange={(current) => this.tableOnChange(current)}
          onRow={(record) => {
            return {
              onClick: (event) => {
                if (event.target.dataset && event.target.dataset.value) {
                  return
                }
                if (this.props.routerUrl) {
                  router.push({
                    pathname: this.props.routerUrl,
                    query: {
                      productId: record.productId,
                      productType: record.productType,
                    },
                  })
                }
              }, // 点击行
            }
          }}
        />

        <Modal
          destroyOnClose={true}
          title="导出"
          onCancel={() => {
            this.setState({
              educe: false,
              pagingLoading: false,
            })
            clearInterval(interTime)
          }}
          visible={educe}
          width="800px"
          height="600px"
          footer={null}
          className="positionre"
        >
          <>
            <Form name="basic" onFinish={this.educeFinish}>
              <Form.Item wrapperCol={{ span: 3, offset: 21 }}>
                <Button
                  onClick={() => {
                    this.goodsGetPagingList_()
                  }}
                  style={{ borderRadius: '4px', marginRight: 10 }}
                  type="primary"
                >
                  刷新
                </Button>
              </Form.Item>

              <div>
                <Table loading={pagingShow} rowClassName={useGetRow} pagination={false} columns={this.pagingColumns} dataSource={pagingList} />
              </div>

              <Form.Item style={{ marginTop: 40 }} wrapperCol={{ span: 17, offset: 7 }}>
                <Button loading={pagingLoading} disabled={pagingLoading} style={{ borderRadius: '4px' }} type="primary" htmlType="submit">
                  确定导出
                </Button>
                <Button
                  style={{ borderRadius: '4px', marginLeft: 130 }}
                  onClick={() => {
                    clearInterval(interTime)

                    this.setState({
                      pagingLoading: false,
                      educe: false,
                    })
                  }}
                  type="primary"
                >
                  关闭
                </Button>
              </Form.Item>
            </Form>
          </>
        </Modal>
      </div>
    )
  }
}

index.propTypes = {
  //查询
  queryItems: PropTypes.array,
  //表格
  queryApi: PropTypes.string.isRequired,
  columns: PropTypes.array.isRequired,
}

export default index
