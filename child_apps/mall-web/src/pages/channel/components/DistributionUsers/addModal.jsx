import React, { Component } from 'react'
import { Modal, Table, Input, Row, Button, Form, Select } from 'antd'
import requestw from '@/utils/requestw'

/**
 * props
 * value   jsonStr: {inputCode,inputVal}
 * onChange
 *
 * width = 600
 * getStaticData //如果这个属性存在的话 就不走ajax了 fucntion => {tableData,total}
 * api
 * params
 * dealResFunc   =>  {tableData,total}
 * searchFormItems  []
 * columns
 * rowKey
 * inputValKey
 * inputCodeKey
 *
 * pageKey='pageNo'
 * pageSizeKey='pageSize'
 */

// onChange 是字符串 code&&name

class Index extends Component {
  constructor(props) {
    super(props)
    //赋值
    let inputVal = ''
    if (props.value) {
      try {
        inputVal = props.value || ''
      } catch (e) {}
    }
    this.state = {
      inputVal,
      visible: false,
      page: 1,
      pageSize: 10,
      tableData: [],
      total: 0,
      loading_table: false,
      selectData: [],
    }
    this.searchFormRef = React.createRef()
  }
  componentDidMount() {
    if (this.props.onRef) this.props.onRef(this)
  }
  componentWillReceiveProps(nextProps) {
    //赋值
    let inputVal = ''
    if (nextProps.value) {
      try {
        inputVal = nextProps.value || ''
      } catch (e) {}
    }
    this.setState({ inputVal })
  }
  open = async () => {
    this.setState({
      visible: true,
    })
    this.getData()
  }
  close = () => {
    this.setState({
      visible: false,
    })
  }
  resetVal = () => {
    setTimeout(() => {
      this.setState({ inputVal: '' }, () => {
        //调用外面onChange
        if (this.props.onChange) {
          this.props.onChange('')
        }
      })
    }, 100)
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
      const { api, distributeCode } = this.props
      let result // {tableData,total}
      const searchValues = this.searchFormRef.current?.getFieldsValue() || {}
      const postData = {
        page,
        rows: pageSize,
        ...searchValues,
        distributeOrgCode: distributeCode,
      }
      this.setState({ loading_table: true })
      const res = await requestw({
        url: api,
        data: postData,
      })
      if (res && res.code == '0' && res.data) {
        let data = res.data.data || []
        result = {
          tableData: data,
          total: res.data.rowTop,
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
    this.setState({ page: 1 }, () => {
      this.getData()
    })
  }
  clickBtn = (record) => {
    this.setState(
      {
        inputVal: record.goodsName,
      },
      () => {
        if (this.props.onChange) {
          const valueObj = {
            goodsName: record.goodsName, //值
            goodsCode: record.goodsCode, //名称
            record: record,
          }
          this.props.onChange(valueObj.goodsCode)
        }
      }
    )
    this.close()
  }
  render() {
    const { inputVal, visible, tableData, total, loading_table, selectData, page, pageSize } = this.state
    const { width = 800, title = '', columns = [], searchFormItems, rowKey } = this.props

    const columns2 = [
      ...columns,

      {
        title: '操作',
        width: 70,
        render: (record) => (
          <a
            onClick={() => {
              this.clickBtn(record)
            }}
          >
            选择
          </a>
        ),
      },
    ]

    return (
      <>
        <Row type="flex" align="middle">
          <Select placeholder={'请选择' + title} readOnly value={inputVal} style={{ width: 'auto', maxWidth: 170, minWidth: 170 }} disabled={true}>
            {this.props.selectData.map((r) => (
              <Select.Option key={r.goodsCode} value={r.goodsCode}>
                {r.goodsName}
              </Select.Option>
            ))}
          </Select>

          <Button type="primary" onClick={this.open}>
            选择
          </Button>
        </Row>

        <Modal
          visible={visible}
          title={'选择' + title}
          destroyOnClose={true}
          maskClosable={false}
          onCancel={this.close}
          footer={null}
          width={width}
          // centered
        >
          <Form ref={this.searchFormRef}>
            <Row type="flex">
              <Form.Item name="goodName" style={{ marginRight: 10 }}>
                <Input placeholder="商品名称" />
              </Form.Item>

              <Form.Item name="ifGoodsRight" style={{ marginRight: 10, width: 100 }}>
                <Select showArrow={true} placeholder="是否专营" allowClear={true}>
                  <Select.Option key={0} value={0}>
                    是
                  </Select.Option>
                  <Select.Option key={1} value={1}>
                    否
                  </Select.Option>
                </Select>
              </Form.Item>

              <Form.Item style={{ marginRight: 10 }}>
                <Button type="primary" size="middle" onClick={this.clickSearch} style={{ marginLeft: 10 }}>
                  查询
                </Button>
              </Form.Item>
              <Button
                type="primary"
                size="middle"
                style={{ marginRight: 10 }}
                onClick={() => {
                  this.clickBtn({ goodsName: '所有商品', goodsCode: 'ZZZZZZ' })
                }}
              >
                所有商品
              </Button>
            </Row>
          </Form>

          <Table
            rowKey={rowKey}
            columns={columns2}
            dataSource={tableData}
            loading={loading_table}
            pagination={{
              showSizeChanger: true,
              total: total,
              current: page,
              pageSize: pageSize,
            }}
            onChange={this.onTableChange}
          />
        </Modal>
      </>
    )
  }
}

export default Index
