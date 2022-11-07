import React, { Component } from 'react'
import { Modal, Table, Input, Row, Col, Button, Form, Select } from 'antd'
import SelectLinkage from '@/components/SelectLinkage'
import FetchSelect from '@/components/FetchSelect'
import lodash from 'lodash'
import requestw from '@/utils/requestw'

const { Option } = Select

/**
 * @param { object } props
 * @param { function } props.onRef
 * @param { string } props.api
 * @param { object } props.params
 * @param { string } props.pageKey
 * @param { string } props.pageSizeKey
 * @param { Array } props.columns
 * @param { rowKey } props.rowKey
 * @param { number } props.width
 * @param { function } props.onOk
 */

class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,

      page: 1,
      pageSize: 10,
      tableData: [],
      total: 0,
      //批量
      selectedRows: [],

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
      const { page, pageSize } = this.state
      const { getStaticData, api, params = {}, pageKey = 'pageNo', pageSizeKey = 'pageSize', dealResFunc } = this.props

      const searchValues = this.searchFormRef.current?.getFieldsValue() || {}

      let result // {tableData,total}
      if (getStaticData || !api) {
        result = (getStaticData && getStaticData()) || undefined
      } else {
        const postData = {
          [pageKey]: page,
          [pageSizeKey]: pageSize,
          ...searchValues,
          ...params,
        }
        this.setState({ loading_table: true })
        const data = await requestw({
          url: api,
          data: postData,
          isNeedCheckResponse: true,
        })
        if (dealResFunc) {
          result = await dealResFunc(data)
        } else {
          result = {
            tableData: data.data || [],
            total: data.rowTop || 0,
          }
        }
      }

      this.setState({
        tableData: (result && result.tableData) || [],
        total: (result && result.total) || 0,
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
    const { visible, tableData, total, selectedRows, loading_table } = this.state
    const { width = 1000, title = '', columns = [], rowKey } = this.props

    const columns2 = [...columns]

    const selectedRowKeys = selectedRows.map((row) => row[rowKey])

    return (
      <>
        <Modal
          visible={visible}
          title={'选择' + title}
          destroyOnClose={true}
          maskClosable={false}
          onCancel={this.close}
          width={width}
          onOk={this.onOk}
          //
        >
          <Form ref={this.searchFormRef}>
            <Row gutter={10} type="flex">
              <Col span={6}>
                <Form.Item name="goodsName">
                  <Input placeholder="商品名称" allowClear />
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
