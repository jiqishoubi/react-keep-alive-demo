import React, { Component, Fragment } from 'react'
import router from 'umi/router'
import moment from 'moment'
import { connect } from 'dva'
import { Form, Input, Radio, Select, Button, message, Modal, Row, Col, Card, Tooltip, Table, DatePicker, Spin, Upload, Divider } from 'antd'
import { UndoOutlined, SearchOutlined } from '@ant-design/icons'
import RangeMPicker from '@/components/RangeMPicker'
import FormDetail from './FormDetail.jsx'
import GoBackModal from './components/GoBackModal'
import { mConfirm, pathimgHeader, localDB, globalHost, haveCtrlElementRight, downloadFilePostStream } from '@/utils/utils'
import { loginStateKey } from '@/utils/consts'
import { preDealcustomFormList } from './tibao_detail_utils'
import { exportReportTableForVerifyAjax, importSubmitVerifyAjax, exportReportTableAjax } from '@/services/tibao'
import api_tibao from '@/services/api/tibao'
import requestw from '@/utils/requestw'
import styles from './index.less'
import './index.less'

const { TextArea } = Input

const formItemLayout = {
  labelCol: {
    xs: { span: 48 },
    sm: { span: 5 },
  },
  wrapperCol: {
    xs: { span: 48 },
    sm: { span: 30 },
  },
}

class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dateRange: [moment(new Date().getTime() - 30 * 86400 * 1000), moment(new Date())],
      page: 1,
      pageSize: 10,
      tableInfo: null,
      realQuery: {}, //当前查询的条件

      //modal
      //审核modal
      shenheModal: false,
      shenheStatus: '3',
      lookingRecord: null,

      DetailModal: false,
      toaddModal: false,
      DetailImg: [],
      ModifyAmountModal: false,
      ModifyAmountOkBtnLodaer: false,

      //导入文件
      fileList: [],

      //loading
      loading_table: false,
      loading_detail: false,
      loading_export2: false,
      loading_export1: false,
      loading_import1: false,
    }
    this.formRef = React.createRef()
    this.formRefShenheModal = React.createRef()
    this.goBackModalRef = React.createRef()
    this.formRefTibaoModal = React.createRef()
  }

  /**
   * 周期
   */
  componentDidMount() {
    this.getData()
  }

  /**
   * 方法
   */
  clickSearch = () => {
    this.setState({ page: 1 }, () => {
      this.getData()
    })
  }
  //获取数据方法
  getData = async () => {
    const { dateRange, page, pageSize } = this.state
    let dateTime = dateRange

    let formData = (this.formRef.current && this.formRef.current.getFieldsValue()) || {}

    let postData = {
      pageNo: page,
      pageSize,
      companyCode: this.props.login.loginInfo.COMPANY_CODE,
      startTime: dateTime[0] ? dateTime[0].format('YYYY-MM-DD') + ' 00:00:00' : null,
      endTime: dateTime[1] ? dateTime[1].format('YYYY-MM-DD') + ' 23:59:59' : null,
      ...formData,
    }
    this.setState({
      loading_table: true,
      realQuery: postData,
    })
    let res = await requestw({
      url: '/web/admin/reportAudit/getAllByPage',
      data: postData,
    })
    this.setState({ loading_table: false })

    if (res.code == '200') {
      this.setState({
        tableInfo: res.data,
      })
    }
  }

  //选择搜索的日期
  onDateRangeChange = (value) => {
    this.setState({ dateRange: value })
  }

  //重置搜索面板
  resetSearch = () => {
    this.setState({
      dateRange: [moment(new Date().getTime() - 30 * 86400 * 1000), moment(new Date())],
    })
    this.formRef.current.resetFields()
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

  //审核modal
  openShenheModal = (record) => {
    this.setState({
      shenheModal: true,
      lookingRecord: record,
    })
  }

  cloesShenheModal = () => {
    this.setState({
      shenheModal: false,
      lookingRecord: null,
      shenheStatus: '3',
    })
  }

  onShenheAuditStatusChange = (e) => {
    let value = e.target.value
    this.setState({
      shenheStatus: value,
    })
  }

  UserOk = async () => {
    let values = this.formRefShenheModal && this.formRefShenheModal.current && (await this.formRefShenheModal.current.validateFields())

    mConfirm('确定审批？', async () => {
      const { lookingRecord } = this.state

      let postdata = {
        id: lookingRecord.id,
        status: values.shenheStatus,
        userId: lookingRecord.userId,
        rejectReason: values.rejectReason || '',
      }
      if (values.shenheStatus == '3') {
        postdata.amount = lookingRecord.amount
      }
      let res = await requestw({
        url: '/reportAudit/update',
        data: postdata,
      })
      if (res.code == '200') {
        message.success(res.message ? res.message : '操作成功')
        this.getData()
        this.setState({
          shenheModal: false,
        })
      } else {
        message.warning(res.message ? res.message : '操作失败')
      }
    })
  }

  ReportDetail = async (e) => {
    this.setState({
      DetailModal: true,
    })
    this.setState({ loading_detail: true })
    let res = await requestw({
      url: '/reportAudit/getById',
      type: 'get',
      data: {
        id: e.id,
      },
    })
    this.setState({ loading_detail: false })
    if (res.code == '200') {
      try {
        const arr = JSON.parse(res.data[0].formJson)
        const valueArr = preDealcustomFormList(arr, res.data[0].formValueJson)
        this.setState({
          DetailImg: valueArr, //finishInfoList,
        })
      } catch (e) {}
    }
  }

  DetailCancel = () => {
    this.setState({
      DetailModal: false,
      DetailImg: [],
    })
  }

  DetailOk = () => {
    this.setState({
      DetailModal: false,
      DetailImg: [],
    })
  }

  ModifyAmount = async (v) => {
    this.setState({
      ModifyAmountModal: true,
      ModifyAmountCode: v,
    })
  }

  ModifyAmountOk = async () => {
    this.setState({
      ModifyAmountOkBtnLodaer: true,
    })
    let res = await requestw({
      url: '/reportAudit/updateAmount',
      data: {
        id: this.state.ModifyAmountCode.id,
        amount: this.formRef.current.getFieldsValue('amount').amount,
      },
    })
    this.setState({
      ModifyAmountOkBtnLodaer: false,
    })
    if (res.code == '200') {
      message.success(res.message ? res.message : '操作成功')
      this.getData()
      this.setState({
        ModifyAmountModal: false,
      })
    } else {
      message.warning(res.message ? res.message : '操作失败')
    }
  }

  ModifyAmountClose = () => {
    this.setState({
      ModifyAmountModal: false,
    })
  }

  //导出
  exportTable = async () => {
    const { realQuery, tableInfo } = this.state
    if (tableInfo && tableInfo.list && tableInfo.list.length > 0) {
      this.setState({ loading_export2: true })
      let res = await exportReportTableAjax(realQuery)
      this.setState({ loading_export2: false })
    } else {
      message.warning('暂无数据')
    }
  }

  //导出 （非报表）
  exportTableForVerify = async () => {
    const { realQuery, tableInfo } = this.state
    if (tableInfo && tableInfo.list && tableInfo.list.length > 0) {
      delete realQuery.status
      this.setState({ loading_export1: true })
      let res = await exportReportTableForVerifyAjax(realQuery)
      this.setState({ loading_export1: false })
    } else {
      message.warning('暂无数据')
    }
  }

  /**
   * 上传导入
   */
  customRequest = async (detail) => {
    //看beforeUpload 决定执行否
    let file = detail.file
    this.setState({ loading_import1: true })
    let res = await importSubmitVerifyAjax({ file })
    this.setState({ loading_import1: false })
    if (!res || res.code !== 200) {
      message.warning((res && res.message) || '网络异常')
      return
    }

    //成功
    this.getData()
    Modal.info({
      title: '提示',
      content: <div dangerouslySetInnerHTML={{ __html: res.data }} style={{ maxHeight: '700px', overflowY: 'auto' }}></div>,
    })
  }

  /**
   * 新增提报
   */
  goAdd1 = () => {
    router.push('/tibao/list/add')
  }
  goAdd2 = () => {
    router.push('/tibao/list/batchImport')
  }

  closetoAddModal = () => {
    this.setState({
      toaddModal: false,
    })
  }

  //回退审核
  clickGoBack = (record) => {
    this.setState({ lookingRecord: record })
    this.goBackModalRef.current?.open()
  }

  openUpdateRejectReport = (record) => {
    router.push({
      pathname: '/tibao/list/add',
      query: {
        id: record.id,
      },
    })
  }
  /**
   * 渲染
   */
  render() {
    const {
      dateRange,
      tableInfo,
      lookingRecord,
      //modal
      //审核modal
      shenheStatus,

      DetailModal,
      DetailImg,
      ModifyAmountModal,
      ModifyAmountOkBtnLodaer,
      toaddModal,
      //导入文件
      fileList,
      //loading
      loading_table,
      loading_detail,
      loading_export2,
      loading_export1,
      loading_import1,
    } = this.state

    const columns = [
      {
        title: '提报编号',
        dataIndex: 'id',
        key: 'id',
        align: 'center',
        width: 85,
      },
      {
        title: '任务名称',
        dataIndex: 'taskName',
        key: 'taskName',
        align: 'center',
        width: 150,
      },
      {
        title: '姓名',
        dataIndex: 'employeeName',
        key: 'employeeName',
        align: 'center',
        width: 80,
      },

      {
        title: '手机号',
        key: 'phone',
        dataIndex: 'phone',
        align: 'center',
        width: 120,
      },

      {
        title: '规格',
        key: 'specification',
        dataIndex: 'specification',
        align: 'center',
        width: 180,
        render: (v) => {
          try {
            let jsonObj = JSON.parse(v)
            let arr = []
            delete jsonObj.skuProperty
            delete jsonObj.price
            delete jsonObj.salePrice
            for (let k in jsonObj) {
              arr.push({
                label: k,
                value: jsonObj[k],
              })
            }
            if (arr.length) {
              return (
                <div>
                  {arr.map((obj, idx) => (
                    <div key={idx}>
                      {obj.label}：{obj.value}
                    </div>
                  ))}
                </div>
              )
            }
          } catch (e) {}
          return '-'
        },
      },
      {
        title: '数量',
        key: 'quantity',
        dataIndex: 'quantity',
        align: 'center',
        width: 80,
      },
      {
        title: '金额（元）',
        key: 'amount',
        dataIndex: 'amount',
        align: 'center',
        width: 100,
      },
      {
        title: '销售金额（元）',
        key: 'specification',
        dataIndex: 'specification',
        align: 'center',
        width: 140,
        render: (v) => {
          return <>{v && JSON.parse(v).salePrice}</>
        },
      },
      {
        title: '提报时间',
        key: 'createTimeStr',
        dataIndex: 'createTimeStr',
        align: 'center',
        width: 130,
      },
      {
        title: '审核状态',
        key: 'statusName',
        dataIndex: 'statusName',
        align: 'center',
        width: 100,
      },
      {
        title: '审核意见',
        key: 'rejectReason',
        dataIndex: 'rejectReason',
        align: 'center',
        width: 160,
      },
      // {
      //   title: '审核时间',
      //   key: 'modifyTimeStr',
      //   dataIndex: 'modifyTimeStr',
      //   align: 'center',
      //   width: 130,
      // },
      {
        title: '操作',
        width: 180,
        key: 'action',
        fixed: 'right',
        align: 'center',
        render: (record) => (
          // 0 草稿箱
          // 1 待审核
          // 2 驳回
          // 3 审核通过
          <>
            {haveCtrlElementRight('tbsh-sh-btn') && record.status == 1 && (
              <a style={{ marginLeft: 10 }} onClick={() => this.openShenheModal(record)}>
                审核
              </a>
            )}
            <a style={{ marginLeft: 10 }} onClick={() => this.ReportDetail(record)}>
              详情
            </a>
            {record.status == 2 && (
              <a style={{ marginLeft: 10 }} onClick={() => this.openUpdateRejectReport(record)}>
                修改驳回
              </a>
            )}
            {haveCtrlElementRight('tbsh-xgje-btn') && record.status == 1 && (
              <a style={{ marginLeft: 10 }} onClick={() => this.ModifyAmount(record)}>
                修改金额
              </a>
            )}
            {haveCtrlElementRight('report-goback-btn') && record.status == 3 && (
              <a style={{ marginLeft: 10 }} onClick={() => this.clickGoBack(record)}>
                回退
              </a>
            )}
          </>
        ),
      },
    ]

    return (
      <Card title="提报审核">
        <Form ref={this.formRef} {...formItemLayout} style={{ marginBottom: '20px' }}>
          {/* 基本信息 */}
          <Row gutter={10} type="flex" align="middle">
            <Col span={4}>
              <Form.Item name="taskName" style={{ marginBottom: 10 }}>
                <Input placeholder="任务名称" maxLength="25" />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="userName" style={{ marginBottom: 10 }}>
                <Input placeholder="姓名" maxLength="11" style={{ marginRight: '10px' }} />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="phone" style={{ marginBottom: 10 }}>
                <Input placeholder="手机号" maxLength="11" style={{ marginRight: '10px' }} />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="status" style={{ marginBottom: 10 }}>
                <Select placeholder="审核状态" allowClear style={{ marginRight: '10px' }}>
                  <Select.Option value="3">审核通过</Select.Option>
                  <Select.Option value="1">审核中</Select.Option>
                  <Select.Option value="2">驳回</Select.Option>
                  <Select.Option value="4">已撤回</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={10} type="flex" align="middle">
            <Col span={8}>
              <RangeMPicker value={dateRange} onChange={this.onDateRangeChange} isBlock style={{ marginTop: 0, verticalAlign: 'top' }} disabledDate={false} />
            </Col>

            <Col>
              <Form.Item style={{ marginBottom: 0 }}>
                <Tooltip placement="top" title="重置搜索条件">
                  <Button type="primary" shape="circle" style={{ marginRight: 10 }} icon={<UndoOutlined />} onClick={this.resetSearch} />
                </Tooltip>
                <Button type="primary" icon={<SearchOutlined />} onClick={this.clickSearch}>
                  搜索
                </Button>
              </Form.Item>
            </Col>
            {haveCtrlElementRight('reportrecord-pltb') && (
              <Col>
                <Button type="primary" onClick={this.goAdd1}>
                  批量提报
                </Button>
              </Col>
            )}
            {haveCtrlElementRight('reportrecord-wjdr') && (
              <Col>
                <Button type="primary" onClick={this.goAdd2}>
                  文件导入
                </Button>
              </Col>
            )}
            <Col>
              <Button type="primary" onClick={this.exportTable} loading={loading_export2}>
                导出
              </Button>
            </Col>
            <Col>
              <Divider type="vertical" style={{ height: '20px', borderColor: 'rgb(175 175 175)' }} />
              {haveCtrlElementRight('tbsh-dcsh-btn') ? (
                <Button type="primary" onClick={this.exportTableForVerify} loading={loading_export1} style={{ marginLeft: 10 }}>
                  导出审核
                </Button>
              ) : (
                ''
              )}
            </Col>
            {haveCtrlElementRight('tbsh-dr-btn') ? (
              <Col>
                <Upload fileList={[]} showUploadList accept=".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" customRequest={this.customRequest}>
                  <Button type="primary" loading={loading_import1}>
                    导入
                  </Button>
                </Upload>
              </Col>
            ) : (
              ''
            )}
          </Row>
        </Form>

        <Table
          columns={columns}
          rowKey="orderNumber"
          dataSource={this.state.tableInfo && this.state.tableInfo.list}
          loading={loading_table}
          locale={{ emptyText: '暂无数据' }}
          pagination={{
            showQuickJumper: true,
            showSizeChanger: true,
            current: this.state.page,
            pageSize: this.state.pageSize,
            total: tableInfo && tableInfo.total ? tableInfo.total : 0,
            size: 'small',
            showTotal: (total, range) => `第${range[0]}-${range[1]}条/共${total}条`,
          }}
          onChange={(current) => this.tableOnChange(current)}
        />

        <Modal title="新增提报" visible={this.state.toaddModal} onOk={this.toaddOk} onCancel={this.closetoAddModal} destroyOnClose cancelText="取消" okText="确定">
          <Form ref={this.formRefTibaoModal}>
            <Form.Item label="提报形式" name="tibaoStatus" required initialValue={'批量提报'}>
              <Radio.Group onChange={this.ontibaoxingshiChange}>
                <Radio value="批量提报">批量提报</Radio>
                <Radio value="表格导入">表格导入</Radio>
              </Radio.Group>
            </Form.Item>
          </Form>
        </Modal>

        {/* 模态 */}

        <Modal
          title="修改金额"
          visible={this.state.ModifyAmountModal}
          onOk={this.ModifyAmountOk}
          onCancel={this.ModifyAmountClose}
          destroyOnClose
          cancelText="取消"
          okText="确定"
          footer={[
            <Button key="back" onClick={this.ModifyAmountClose}>
              取消
            </Button>,
            <Button key="submit" type="primary" loading={ModifyAmountOkBtnLodaer} onClick={this.ModifyAmountOk}>
              确定
            </Button>,
          ]}
        >
          <Form ref={this.formRef} {...formItemLayout} style={{ marginBottom: '10px' }}>
            <Row gutter={20} type="flex" align="middle">
              <Col span={20}>
                <Form.Item label="金额(元)" style={{ marginBottom: '0' }} name="amount" initialValue={this.state.ModifyAmountCode ? this.state.ModifyAmountCode.amount : ''}>
                  <Input placeholder="金额" maxLength="25" />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>

        <Modal title="提报审核" visible={this.state.shenheModal} onOk={this.UserOk} onCancel={this.cloesShenheModal} destroyOnClose cancelText="取消" okText="确定">
          <Form ref={this.formRefShenheModal}>
            <Form.Item label="审核状态" name="shenheStatus" required initialValue={shenheStatus}>
              <Radio.Group onChange={this.onShenheAuditStatusChange}>
                <Radio value="3">通过</Radio>
                <Radio value="2">驳回</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item label="审核意见" name="rejectReason" required={shenheStatus == '2'} rules={[{ required: shenheStatus == '2', message: '请输入审核意见' }]}>
              <TextArea placeholder="请输入审核意见" />
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          title="详情"
          visible={this.state.DetailModal}
          onOk={this.DetailOk}
          onCancel={this.DetailCancel}
          destroyOnClose
          cancelText="取消"
          okText="关闭"
          width={550}
          footer={<Button onClick={this.DetailCancel}>关闭</Button>}
          centered
        >
          {loading_detail ? (
            <div style={{ paddingTop: 30, textAlign: 'center' }}>
              <Spin />
            </div>
          ) : (
            <div style={{ width: '100%' }}>
              {DetailImg &&
                DetailImg.map((item, ind) => {
                  return <FormDetail key={ind} item={item} formValueContent={DetailImg} />
                })}
            </div>
          )}
        </Modal>

        {/* 回退modal */}
        <GoBackModal
          onRef={(e) => {
            this.goBackModalRef.current = e
          }}
          lookingRecord={lookingRecord}
          onSuccess={() => {
            this.getData()
          }}
        />
      </Card>
    )
  }
}

export default connect(({ login }) => ({
  login,
}))(Index)
