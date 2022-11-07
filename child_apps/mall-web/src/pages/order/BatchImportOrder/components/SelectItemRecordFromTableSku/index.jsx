import React, { Component } from 'react'
import { Modal, Table, Input, Row, Button, Form } from 'antd'
import requestw from '@/utils/requestw'

/**
 * @param {object} props
 *
 * @param {object} props.value
 * @param {function} props.onChange
 *
 * @param {number} [props.width=600]
 *
 * @param {()=>({
 *  tableData:Array<any>,
 *  total:number
 * })} props.getStaticData //如果这个属性存在的话 就不走ajax了 fucntion => {tableData,total}
 * @param {string} props.api
 * @param {object} props.params
 * @param {()=>Promise<{
 *  tableData:Array<any>,
 *  total:number
 * }>} props.dealResFunc
 * @param {Array<any>} props.searchFormItems
 *
 * @param {Array<any>} props.columns
 * @param {string} props.rowKey
 * @param {string} props.inputValKey
 * @param {string} props.inputCodeKey
 *
 * @param {string} [props.pageKey='pageNo']
 * @param {string} [props.pageSizeKey='pageSize']
 * @param {boolean} [props.isPage=true]
 */
class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedRecord: props.value || null, //object
      visible: false,

      page: 1,
      pageSize: 10,
      tableData: [],
      total: 0,

      //loading
      loading_table: false,
    }
    this.searchFormRef = React.createRef()
  }
  componentDidMount() {
    if (this.props.onRef) this.props.onRef(this)
  }
  componentWillReceiveProps(nextProps) {
    this.setState({ selectedRecord: nextProps.value || null })
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
      this.setState({ selectedRecord: null }, () => {
        //调用外面onChange
        if (this.props.onChange) {
          this.props.onChange(this.state.selectedRecord)
        }
      })
    }, 100)
  }
  onTableChange = (e) => {
    const { isPage = true } = this.props
    this.setState(
      {
        page: e.current,
        pageSize: e.pageSize,
      },
      () => {
        if (isPage) this.getData()
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
        const res = await requestw({
          url: api,
          data: postData,
        })

        if (dealResFunc) {
          result = await dealResFunc(res)
        } else {
          if (res && res.code == '0' && res.data) {
            result = {
              tableData: res.data.data,
              total: res.data.rowTop,
            }
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
    this.setState({ page: 1 }, () => {
      this.getData()
    })
  }
  clickBtn = (record) => {
    const { inputValKey, inputCodeKey } = this.props
    this.setState(
      {
        selectedRecord: record,
      },
      () => {
        //调用外面onChange
        if (this.props.onChange) {
          this.props.onChange(this.state.selectedRecord)
        }
      }
    )
    this.close()
  }
  render() {
    const { selectedRecord, visible, tableData, total, loading_table } = this.state
    const { width = 600, title = '', columns = [], searchFormItems, rowKey, inputValKey } = this.props

    const columns2 = [
      ...columns,
      {
        title: '操作',
        width: 70,
        render: (record) => {
          if (!record.skuCode) {
            return null
          }
          return (
            <a
              onClick={() => {
                this.clickBtn(record)
              }}
            >
              选择
            </a>
          )
        },
      },
    ]

    let inputVal = ''
    if (selectedRecord) {
      inputVal = selectedRecord['goodsName'] + ' ' + selectedRecord[inputValKey]
    }

    return (
      <>
        <Row type="flex" align="middle">
          <Input placeholder={'请选择' + title} readOnly value={inputVal} style={{ flex: '1 0 0', width: 'auto' }} />
          <Button type="primary" onClick={this.open} style={{ marginLeft: 10 }}>
            选择
          </Button>
          <Button onClick={this.resetVal} style={{ marginLeft: 10 }}>
            清空
          </Button>
        </Row>

        <Modal visible={visible} title={'选择' + title} destroyOnClose={true} maskClosable={false} onCancel={this.close} footer={null} width={width} centered>
          <Form ref={this.searchFormRef}>
            {searchFormItems && searchFormItems.length && (
              <Row type="flex">
                {searchFormItems.map((item, index) => {
                  return (
                    <Form.Item key={index} name={item.name}>
                      <Input placeholder={item.placeholder || '请输入'} />
                    </Form.Item>
                  )
                })}
                <Form.Item>
                  <Button onClick={this.clickSearch} style={{ marginLeft: 10 }}>
                    搜索
                  </Button>
                </Form.Item>
              </Row>
            )}
          </Form>
          <Table
            rowKey={rowKey}
            columns={columns2}
            dataSource={tableData}
            loading={loading_table}
            pagination={{
              showSizeChanger: true,
              total: total,
            }}
            onChange={this.onTableChange}
          />
        </Modal>
      </>
    )
  }
}

export default Index
