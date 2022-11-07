import React, { Component, Fragment } from 'react'
import router from 'umi/router'
import moment from 'moment'
import { connect } from 'dva'
import { Form, Input, Radio, Select, Button, message, Modal, Row, Col, Card, Tooltip, Table, DatePicker, Spin, Upload, Divider } from 'antd'
import { UndoOutlined, SearchOutlined } from '@ant-design/icons'
import RangeMPicker from '@/components/RangeMPicker'
import { mConfirm, pathimgHeader, localDB, globalHost, haveCtrlElementRight, downloadFilePostStream } from '@/utils/utils'
import { loginStateKey } from '@/utils/consts'
import { preDealcustomFormList } from '../tibao_detail_utils'
import { exportReportTableForVerifyAjax, exportImportTableAjax, importSubmitVerifyAjax, exportReportTableAjax } from './tibao'
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
      DetailImg: [],
      ModifyAmountModal: false,
      ModifyAmountOkBtnLodaer: false,
      selectList: [],
      missionCodeState: '',
      importByTemplateFile: null,
      importObj: {},
      //导入文件
      fileList: [],
      daoruColumns: [],
      dataList: [],
      successList: [],
      importModal: false,
      successdataList: [],
      successdaoruColumns: [
        {
          title: '提报编号',
          dataIndex: 'id',
          key: 'id',
          align: 'center',
          width: 95,
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
          dataIndex: 'userName',
          key: 'userName',
          align: 'center',
          width: 100,
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
      ],
      //loading
      loading_table: false,
      loading_detail: false,
      loading_export2: false,
      loading_export1: false,
      loading_import1: false,
      loading_export3: false,
      loading_submit: false,
    }
    this.formRef = React.createRef()
    this.formRefShenheModal = React.createRef()
  }

  /**
   * 周期
   */
  componentDidMount() {
    this.getData()
    this.getSelectList()
  }

  /**
   * 方法
   */
  clickSearch = () => {
    this.setState({ page: 1 }, () => {
      this.getData()
    })
  }

  getSelectList = async () => {
    let res = await requestw({
      url: '/staff/mission/getMissionList',
    })
    if (res.code == '200') {
      this.setState({
        selectList: res.data,
      })
    }
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
      type: 'get',
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
        let arr = JSON.parse(res.data[0].formJson)
        this.setState({
          DetailImg: preDealcustomFormList(arr, res.data[0].formValueJson), //finishInfoList,
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
   * 新增提报
   */
  goAdd = () => {
    router.push('/tibao/list/add')
  }

  renwuChange = (e) => {
    this.setState({
      missionCodeState: e,
    })
  }

  xiazai = async () => {
    //
    if (!this.state.missionCodeState) {
      message.warning('请选择任务后进行下载')
      return
    }
    let res = await requestw({
      url: '/staff/mission/getMissionTemplate',
      data: {
        missionCode: this.state.missionCodeState,
      },
    })
    if (res.code == '200') {
      window.open(res.data.missionTemplate)
    }
  }
  //回退审核
  /**
   * 上传导入
   */
  customRequest = async (detail) => {
    if (!this.state.missionCodeState) {
      message.warning('请选择任务后进行导入')
      return
    }
    //看beforeUpload 决定执行否
    let file = detail.file
    this.setState({ loading_import1: true, importByTemplateFile: file })
    // let res = await importSubmitVerifyAjax({ file });

    let ress = await requestw({
      url: '/reportAudit/showImportDatas',
      type: 'formdata',
      data: {
        missionCode: this.state.missionCodeState,
        file,
      },
    })
    let successdaoruColumns = []
    for (var key in ress[0]) {
      let obj = {
        title: key == 'mark' ? '原因' : key,
        dataIndex: key == 'mark' ? '原因' : key,
        key: key == 'mark' ? '原因' : key,
        align: 'center',
        width: 95,
      }
      successdaoruColumns.push(obj)
    }
    let successdataList = []
    ress.map((item, ind) => {
      let obj2 = {}
      for (var key in ress[0]) {
        let variable = `${key}`
        if (variable == 'mark') {
          variable = '原因'
        }
        obj2[variable] = item[key]
      }
      successdataList.push(obj2)
    })
    this.setState({
      successdaoruColumns,
      successdataList,
    })

    this.setState({ loading_import1: false })
    // if (!res || res.code !== 200) {
    //   message.warning((res && res.message) || '网络异常');
    //   return;
    // }

    //成功
    // this.getData();
    // Modal.info({
    //   title: '提示',
    //   content: (
    //     <div
    //       dangerouslySetInnerHTML={{ __html: res.data }}
    //       style={{ maxHeight: '700px', overflowY: 'auto' }}
    //     ></div>
    //   ),
    // });
  }

  submit = async () => {
    let daoruColumns = []
    let dataList = []
    if (!this.state.successdataList || !this.state.missionCodeState || !this.state.importByTemplateFile) {
      message.warning('暂无可提交的数据')
      return
    }
    this.setState({
      loading_submit: true,
    })
    let res = await requestw({
      url: '/reportAudit/importByTemplate',
      type: 'formdata',
      data: {
        missionCode: this.state.missionCodeState,
        file: this.state.importByTemplateFile,
      },
    })
    this.setState({
      importObj: res,
      loading_submit: false,
    })
    if (res.code && res.code == '500') {
    } else {
      if (res.faildListCount) {
        this.setState({ importModal: true })
        res.faildList.map((item, ind) => {
          let obj2 = {}
          for (var key in item) {
            // let obj = {
            //   title: key == 'mark' ? '原因' : key,
            //   dataIndex: key == 'mark' ? '原因' : key,
            //   key: key == 'mark' ? '原因' : key,
            //   align: 'center',
            //   width: 95,
            // };
            let variable = `${key}`
            if (variable == 'mark') {
              variable = '原因'
            }
            obj2[variable] = item[key]
            // daoruColumns.push(obj);
          }
          dataList.push(obj2)
        })
        for (var key in res.faildList[0]) {
          let obj = {
            title: key == 'mark' ? '原因' : key,
            dataIndex: key == 'mark' ? '原因' : key,
            key: key == 'mark' ? '原因' : key,
            align: 'center',
            width: 95,
          }
          daoruColumns.push(obj)
        }
        this.setState({
          daoruColumns,
          dataList,
        })
      } else {
        message.success('提交成功')
        setTimeout(() => {
          router.go(-1)
        }, 100)
      }
    }
  }

  exportFaild = async () => {
    //   this.setState({ loading_export3: true });
    //   let res = await exportImportTableAjax({
    //     faildListJson:JSON.stringify(this.state.importObj.faildList)
    // });
    //   this.setState({ loading_export3: false });
    let res = await requestw({
      url: '/reportAudit/downloadFaildList',
      data: {
        faildListJson: JSON.stringify(this.state.importObj.faildList),
      },
    })
    if (res) {
      window.open(res)
    }
  }

  closeimportModal = () => {
    this.setState(
      {
        importModal: false,
      },
      () => {
        router.go(-1)
      }
    )
  }

  clickCancel = () => {
    router.go(-1)
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
      dataList,
      daoruColumns,
      DetailModal,
      DetailImg,
      ModifyAmountModal,
      ModifyAmountOkBtnLodaer,
      selectList,
      missionCodeState,
      importByTemplateFile,
      importObj,
      importModal,
      successList,
      successdataList,
      successdaoruColumns,
      //导入文件
      fileList,
      //loading
      loading_table,
      loading_detail,
      loading_export2,
      loading_export1,
      loading_import1,
      loading_export3,
      loading_submit,
    } = this.state

    const columns = [
      {
        title: '提报编号',
        dataIndex: 'id',
        key: 'id',
        align: 'center',
        width: 95,
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
        dataIndex: 'userName',
        key: 'userName',
        align: 'center',
        width: 100,
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
      //   {
      //     title: '操作',
      //     width: 180,
      //     key: 'action',
      //     fixed: 'right',
      //     align: 'center',
      //     render: record => (
      //       // 0 草稿箱
      //       // 1 待审核
      //       // 2 驳回
      //       // 3 审核通过
      //       <>
      //         {haveCtrlElementRight('tbsh-sh-btn') && record.status == 1 && (
      //           <a style={{ marginLeft: 10 }} onClick={() => this.openShenheModal(record)}>
      //             审核
      //           </a>
      //         )}
      //         <a style={{ marginLeft: 10 }} onClick={() => this.ReportDetail(record)}>
      //           详情
      //         </a>
      //         {haveCtrlElementRight('tbsh-xgje-btn') && record.status == 1 && (
      //           <a style={{ marginLeft: 10 }} onClick={() => this.ModifyAmount(record)}>
      //             修改金额
      //           </a>
      //         )}
      //       </>
      //     ),
      //   },
    ]

    return (
      <Card title="">
        <Form ref={this.formRef} {...formItemLayout} style={{ marginBottom: '20px' }}>
          {/* 基本信息 */}
          <Row gutter={10} type="flex" align="middle">
            <Col span={8}>
              <Form.Item label="提报任务" required name="xuanzerenwu" rules={[{ required: true, message: '请先选择任务' }]}>
                <Select
                  placeholder="请选择任务"
                  //   loading={loadingMissionSelect}
                  onChange={(v) => {
                    this.renwuChange(v)
                    //一、清空下面的form
                    // const values = this.formRef.current.getFieldsValue();
                    // let arr = [];
                    // for (let key in values) {
                    //   if (key !== 'xuanzerenwu') {
                    //     arr.push(key);
                    //   }
                    // }
                    // this.formRef.current.resetFields(arr);
                    //清空下面的form end
                    //二、清空右面的table
                    // setTableData([]);
                    // setMissionSelectedValue(v);
                  }}
                >
                  {selectList &&
                    selectList.map((obj, index) => (
                      <Option key={index} value={obj.missionCode}>
                        {obj.missionTitle}
                      </Option>
                    ))}
                </Select>
              </Form.Item>
            </Col>
            <Col>
              <Button type="primary" onClick={this.xiazai} style={{ marginBottom: 23 }}>
                下载模板
              </Button>
            </Col>
            <Col>
              <Upload fileList={[]} showUploadList accept=".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" customRequest={this.customRequest}>
                <Button type="primary" style={{ marginBottom: 23 }} loading={loading_import1}>
                  文件导入
                </Button>
              </Upload>
            </Col>
          </Row>
          <div className={styles.footer_tool_bar}>
            <Button onClick={this.clickCancel} style={{ marginRight: 36 }}>
              取消
            </Button>
            <Button type="primary" htmlType="submit" onClick={this.submit} loading={loading_submit}>
              {/* {isEdit ? '保存' : '新增'} */}
              提交
            </Button>
          </div>
        </Form>

        <Table
          columns={successdaoruColumns}
          rowKey="orderNumber"
          dataSource={this.state.successdataList && this.state.successdataList}
          loading={loading_table}
          locale={{ emptyText: '暂无数据' }}
          pagination={false}
          onChange={(current) => this.tableOnChange(current)}
        />

        {/* 模态 */}

        <Modal
          title="提示"
          visible={this.state.importModal}
          //   onOk={this.ModifyAmountOk}
          onCancel={this.closeimportModal}
          destroyOnClose
          cancelText="取消"
          okText="确定"
          footer={false}
          width={1400}
          //   footer={[
          //     <Button key="back" onClick={this.ModifyAmountClose}>
          //       取消
          //     </Button>,
          //     <Button
          //       key="submit"
          //       type="primary"
          //       loading={ModifyAmountOkBtnLodaer}
          //       onClick={this.ModifyAmountOk}
          //     >
          //       确定
          //     </Button>,
          //   ]}
        >
          <div>
            <p>
              共导入提报记录
              {importObj && importObj.faildListCount + importObj.successListCount}条
            </p>
            <p>成功{importObj && importObj.successListCount}条</p>
            <p>失败{importObj && importObj.faildListCount}条</p>
            <p>
              失败列表{' '}
              <Button onClick={this.exportFaild} loading={loading_export3} type="primary">
                下载
              </Button>
            </p>
            <Table
              columns={daoruColumns}
              dataSource={this.state.dataList && this.state.dataList}
              loading={loading_table}
              locale={{ emptyText: '暂无数据' }}
              pagination={false}
              onChange={(current) => this.tableOnChange(current)}
            />
          </div>
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
      </Card>
    )
  }
}

export default connect(({ login }) => ({
  login,
}))(Index)
