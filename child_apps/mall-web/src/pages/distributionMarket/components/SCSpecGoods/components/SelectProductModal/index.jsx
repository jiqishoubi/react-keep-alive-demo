import React, { Component } from 'react'
import { Modal, Table, Input, Row, Col, Button, Form, Select, message } from 'antd'
import SelectLinkage from '@/components/SelectLinkage'
import FetchSelect from '@/components/FetchSelect'
import lodash from 'lodash'
import requestw from '@/utils/requestw'
import api_goods from '@/services/api/goods'

const { Option } = Select

/**
 * props
 * value
 * onChange
 *
 * width = 600
 * getStaticData //如果这个属性存在的话 就不走ajax了 fucntion => {tableData,total}
 * api
 * params
 * columns
 * rowKey
 *
 * pageKey='pageNo'
 * pageSizeKey='pageSize'
 */

// onChange 是字符串 code&&name

class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,

      page: 1,
      rows: 10,
      tableData: [],
      total: 0,
      //批量
      selectedRows: [],
      typeId: '',
      //loading
      loading_table: false,
    }
    this.searchFormRef = React.createRef()
  }
  componentDidMount() {
    if (this.props.onRef) this.props.onRef(this)
  }
  open = async () => {
    this.setState({
      visible: true,
    })
    this.getData()
    this.getSelect1()
  }

  //获取一级类目
  getSelect1 = async () => {
    let res = await requestw({
      url: api_goods.getFirstGroupList(),
    })
    if (res && res.code == '0') {
      this.setState({
        goodsTypeList: res.data.data,
      })
    }
  }

  //获取二级类目
  //类目联动
  typeChange = async (typeId) => {
    this.setState({ typeId })
    this.searchFormRef.current.setFieldsValue({
      secondGroupCode: [],
    })
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

  close = () => {
    //重置
    this.setState({
      visible: false,
      page: 1,
      pageSize: 10,
      tableData: [],
      total: 0,
      selectedRows: [],
      goodsTypeList: [],
      goodsTypeList2: [],
    })
  }
  onTableChange = (e) => {
    this.setState(
      {
        page: e.current,
        pageSize: e.pageSize,
      },
      () => {
        this.getData()
      }
    )
  }
  getData = async () => {
    return new Promise(async (resolve) => {
      const { page, rows } = this.state
      const { selectProps } = this.props
      let distributeOrgCode = selectProps.spreadCompanySpecGoodsMngModel.searchParams.distributeOrgCode
      const searchValues = this.searchFormRef.current?.getFieldsValue() || {}

      let result // {tableData,total}

      if (distributeOrgCode) {
        const postData = {
          page: page,
          rows: rows,
          queryType: 'createQuery',
          distributeOrgCode: distributeOrgCode,
          ...searchValues,
        }
        this.setState({ loading_table: true })

        const res = await requestw({
          url: '/web/goods/getGoodsList',
          data: postData,
        })
        if (res && res.code === '0' && res.data) {
          result = res.data
        }
      } else {
        message.error('请选择推广公司')
        this.setState({
          visible: false,
        })
      }

      this.setState({
        tableData: (result && result.data) || [],
        total: (result && result.rowTop) || 0,
        loading_table: false,
      })
      resolve()
    })
  }
  //点击搜索
  clickSearch = () => {
    this.setState(
      {
        page: 1,
        selectedRows: [],
      },
      () => {
        this.getData()
      }
    )
  }
  //批量
  updateSelectedRows = (isSelected, list) => {
    const { selectedRows } = this.state
    const { rowKey } = this.props
    let arr = []
    if (isSelected) {
      arr = _.uniqBy([...selectedRows, ...list], rowKey)
    } else {
      arr = _.differenceBy(selectedRows, list, rowKey) // 从第一个数组删除第二个数组中的元素
    }
    this.setState({ selectedRows: arr })
  }
  onOk = () => {
    const { selectedRows } = this.state
    if (this.props.onOk && selectedRows && selectedRows.length) this.props.onOk(selectedRows)
    this.close()
  }
  /**
   * 渲染
   */
  render() {
    const { visible, tableData, total, selectedRows, loading_table, goodsTypeList, goodsTypeList2 } = this.state
    const { width = 1000, title = '', columns, rowKey } = this.props

    const columns2 = [...columns]

    const selectedRowKeys = selectedRows.map((row) => row[rowKey])

    return (
      <>
        <Modal visible={visible} title={'选择' + title} destroyOnClose={true} maskClosable={false} onCancel={this.close} width={width} onOk={this.onOk}>
          <Form ref={this.searchFormRef}>
            <Row gutter={10} type="flex">
              <Col span={4}>
                <Form.Item name="goodsName">
                  <Input placeholder="商品名称" allowClear />
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item name="goodsType">
                  <Select placeholder="商品类型" allowClear={true}>
                    <Option value="PUBLIC">普通商品</Option>
                    <Option value="THIRD_PARTY">第三方商品</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item name="firstGroupCode">
                  <Select showArrow={true} placeholder="商品一级类目" allowClear onChange={this.typeChange}>
                    {goodsTypeList &&
                      goodsTypeList.map((obj) => (
                        <Select.Option key={obj.groupCode} value={obj.groupCode}>
                          {obj.groupName}
                        </Select.Option>
                      ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item name="secondGroupCode">
                  <Select showArrow={true} allowClear placeholder="商品二级类目">
                    {goodsTypeList2 &&
                      goodsTypeList2.map((obj) => (
                        <Select.Option key={obj.id} value={obj.groupCode}>
                          {obj.groupName}
                        </Select.Option>
                      ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item name="supplierCode">
                  <FetchSelect api={getOrgKind().isAdmin ? '/web/admin/supplier/getList' : '/web/staff/supplier/getList'} valueKey="orgCode" textKey="orgName" placeholder="商品供应商" />
                </Form.Item>
              </Col>
              <Col flex="1 0 0">
                <Row type="flex" justify="end">
                  <Button type="primary" onClick={this.clickSearch}>
                    查询
                  </Button>
                </Row>
              </Col>
            </Row>
          </Form>

          <Table
            size="small"
            rowKey={rowKey}
            columns={columns2}
            dataSource={tableData}
            loading={loading_table}
            pagination={{
              showSizeChanger: true,
              total: total,
            }}
            onChange={this.onTableChange}
            rowSelection={{
              selectedRowKeys,
              onSelect: (row, isSelected, _) => {
                this.updateSelectedRows(isSelected, [row])
              },
              onSelectAll: (isSelected, _, changeRows) => {
                this.updateSelectedRows(isSelected, changeRows)
              },
            }}
          />
        </Modal>
      </>
    )
  }
}

export default Index
