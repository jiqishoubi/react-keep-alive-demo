import { Form, Input, Button, Table, Transfer, message, Modal, Select, Row, Col } from 'antd'
import React, { useEffect, useRef, useState, Fragment } from 'react'
import difference from 'lodash/difference'

import { useGetRow } from '@/hooks/useGetRow'

import { getLearnGroupListPaging, deleteLearnGroup, createLearnGroup, updateLearnGroup } from './service'
import lodash from 'lodash'
import requestw from '@/utils/requestw'
import { router } from 'umi'
import FetchSelect from '@/components/FetchSelect'
import api_channel from '@/services/api/channel'

function Index() {
  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 8 },
  }
  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  }
  const [form] = Form.useForm()
  const [personFormRef] = Form.useForm()

  const [queryForm] = Form.useForm()
  const pageRef = useRef(1)
  const pageSizeRef = useRef(20)
  const { Option } = Select

  //数据总量
  const [tableListTotalNum, settableListTotalNum] = useState(0)
  //table loding 展示
  const [loading, setloading] = useState(false)
  const [tradeList, settradeList] = useState([])

  //创建分类
  const [newSupplier, setnewSupplier] = useState(false)
  //删除分类
  const [deleteDatum, setdeleteDatum] = useState(false)
  //编辑分类
  const [alterDatum, setalterDatum] = useState(false)
  //唯一数据
  const [soleDatum, setsoleDatum] = useState(false)
  // 添加用户
  const [personModal, setPersonModal] = useState(false)
  const [personInfo, setPersonInfo] = useState({})
  const [tableData, settableData] = useState()
  const [targetKeys, settargetKeys] = useState([])
  const [targetRows, settargetRows] = useState([])
  const [AllLeftData, setAllLeftData] = useState([])
  const [personLoading, setpersonLoading] = useState(false)
  const [targetRowsLeft, settargetRowsLeft] = useState([])

  const columns = [
    {
      dataIndex: 'groupName',
      title: '分组名称',
      align: 'center',
    },
    {
      dataIndex: 'templateName',
      title: '分组组长',
      align: 'center',
    },
    {
      dataIndex: 'createDateStr',
      title: '创建时间',
      align: 'center',
    },
    {
      align: 'center',
      title: '操作',
      render: (e) => {
        return (
          <div>
            <a
              onClick={() => {
                alterAddPerson(e)
              }}
            >
              添加用户
            </a>
            &nbsp;&nbsp;
            <a
              onClick={() => {
                toDetail(e)
              }}
            >
              详情
            </a>
            &nbsp;&nbsp;
            <a
              onClick={() => {
                alterDatums(e)
              }}
            >
              编辑
            </a>
          </div>
        )
      },
    },
  ]

  useEffect(() => {
    queryOnFinish()
  }, [])

  //编辑
  function alterDatums(e) {
    form.setFieldsValue(e)
    form.setFieldsValue({
      templateDataId: e.templateDataId.split(','),
    })
    setnewSupplier(true)
    setsoleDatum(e)
    setalterDatum(true)
  }

  //确认删除
  async function deleteDatumTrue() {
    let res = await deleteLearnGroup({
      learnGroupCode: soleDatum.learnGroupCode,
    })
    if (res && res.code === '0') {
      setdeleteDatum(false)
      message.success(res.message)
      queryOnFinish()
    } else {
      message.error(res.message)
    }
  }

  //创建类目
  async function creaetonFinish(value) {
    value.templateDataId = value.templateDataId.join(',')
    value['groupType'] = 'DISTRIBUTE_HEAD'
    let res
    if (alterDatum) {
      value['groupCode'] = soleDatum.groupCode
      res = await updateLearnGroup(value)
    } else {
      res = await createLearnGroup(value)
    }

    if (res && res.code === '0') {
      message.success(res.message ? res.message : '操作成功')
      setnewSupplier(false)
      form.resetFields()
      queryOnFinish()
    } else {
      message.success(res.message ? res.message : '操作失败')
    }
  }

  //重置一下
  function resetSearch() {
    queryForm.resetFields()
  }

  const queryOnFinish = () => {
    pageRef.current = 1
    getTableList()
  }
  const getTableList = async () => {
    setloading(true)
    let values = queryForm.getFieldsValue()
    let postData = {
      page: pageRef.current,
      rows: pageSizeRef.current,
      ...values,
    }

    let res = await getLearnGroupListPaging(postData)
    if (res && res.code === '0') {
      settradeList(res.data.data)
      settableListTotalNum(res.data.rowTop)
    } else {
      message.error(res.message)
    }
    setloading(false)
  }

  //改变页数
  const onPageChange = (e, f) => {
    pageRef.current = e
    pageSizeRef.current = f
    getTableList()
  }

  // 添加用户
  const alterAddPerson = (e) => {
    getAllLeftData(e)
    setPersonModal(true)
    setPersonInfo(e)
  }

  const clickSearch = () => {
    getLeftData2()
  }
  const getAllLeftData = async (e) => {
    const res = await requestw({
      url: '/web/staff/group/getDistributeWaitingListPaging',
      // data: postData,
      data: {
        groupCode: e.groupCode,
        page: '1',
        rows: '9999',
      },
    })
    if (!res || res.code != '0') {
      message.warning('暂无数据')
      return
    }

    let list = res.data.data

    setAllLeftData(list)
    getLeftData(e, '0', list)

    //成功
  }

  const getLeftData = async (e, selectedStatus, AllArr) => {
    setpersonLoading(true)
    const res = await requestw({
      url: '/web/staff/group/getDistributeWaitingListPaging',
      // data: postData,
      data: {
        groupCode: e.groupCode,
        selectedStatus: selectedStatus,
        page: '1',
        rows: '9999',
      },
    })
    setpersonLoading(false)
    if (!res || res.code != '0') {
      message.warning('暂无数据')
      return
    }
    let ress
    ress = await requestw({
      url: '/web/staff/group/getSelectedListPaging',
      data: {
        groupCode: e.groupCode,
        rows: '9999',
      },
    })

    let list = res.data.data
    let arr = AllArr
    if (!ress || ress.code != '0') {
    } else {
      let targetKeys = ''
      if (!ress.data.data) {
      } else {
        ress.data.data.map((item) => {
          targetKeys += item.personCode + ','
        })
        targetKeys = targetKeys.substr(0, targetKeys.length - 1)

        settargetKeys(targetKeys.split(','))
        targetKeys = targetKeys.split(',')
        const targetRows = targetKeys.map((str) => {
          let filterArr = arr.filter((obj) => obj['personCode'] == str)
          return filterArr[0] || {}
        })
        settargetRows(targetRows)
      }
    }
    settableData(Array.isArray(list) ? list : [])
    settargetRowsLeft(Array.isArray(list) ? list : [])
    //成功
  }

  const getLeftData2 = async (e, selectedStatus) => {
    const searchValues = personFormRef.getFieldsValue()
    const res = await requestw({
      url: '/web/staff/group/getDistributeWaitingListPaging',
      data: {
        groupCode: personInfo.groupCode,
        ...searchValues,
      },
    })
    if (!res || res.code != '0') {
      message.warning('暂无数据')
      return
    }

    let list = res.data.data

    settargetRowsLeft(list)
    //成功
  }

  const personModalOk = async () => {
    let formValue = personFormRef.getFieldsValue()
    let targetRowsStr = ''
    targetRows.map((item) => {
      targetRowsStr += item.personCode + ','
    })
    // return
    let res = await requestw({
      url: '/web/staff/group/createRelationBatch',
      data: {
        groupCode: personInfo.groupCode,
        personCodeStr: targetRowsStr,
      },
    })
    if (res.code == '0') {
      setPersonModal(false)
      personFormRef.resetFields()
      setPersonInfo({})
      message.success(res.message ? res.message : '操作成功')
    } else {
      message.warning(res.message ? res.message : '操作失败')
    }
  }

  const onChange = (nextTargetKeys, direction, moveKeys) => {
    if (direction == 'left') {
      let targetRow = moveKeys.map((str) => {
        let filterArr = AllLeftData.filter((obj) => obj['personCode'] == str)
        return filterArr[0] || {}
      })
      let targetRows1 = targetRows
      targetRow.map((e, i) => {
        targetRows1.map((item, ind) => {
          if (e.personCode == item.personCode) {
            targetRows1.splice(ind, 1)
          }
        })
      })
      settargetRows(targetRows1)
      settargetKeys(nextTargetKeys)
      targetRowsLeft &&
        targetRowsLeft.map((item) => {
          targetRow.push(item)
        })
      let obj = {}
      let peon = targetRow.reduce((cur, next) => {
        obj[next.personCode] ? '' : (obj[next.personCode] = true && cur.push(next))
        return cur
      }, [])
      settargetRowsLeft(peon)
    } else {
      let targetRows = nextTargetKeys.map((str) => {
        let filterArr = AllLeftData.filter((obj) => obj['personCode'] == str)
        return filterArr[0] || {}
      })
      settargetRows(targetRows)
      settargetKeys(nextTargetKeys)
      let targetRow = moveKeys.map((str) => {
        let filterArr = AllLeftData.filter((obj) => obj['personCode'] == str)
        return filterArr[0] || {}
      })

      let obj = {}
      let leftarr = targetRowsLeft
      targetRow.map((e, i) => {
        leftarr.map((item, ind) => {
          if (cmp(item, e)) {
            leftarr.splice(ind, 1)
          }
        })
      })
      settargetRowsLeft(leftarr)
    }
  }

  const cmp = (x, y) => {
    if (x === y) {
      return true
    }
    if (!(x instanceof Object) || !(y instanceof Object)) {
      return false
    }
    if (x.constructor !== y.constructor) {
      return false
    }
    for (var p in x) {
      if (x.hasOwnProperty(p)) {
        if (!y.hasOwnProperty(p)) {
          return false
        }

        if (x[p] === y[p]) {
          continue
        }

        if (typeof x[p] !== 'object') {
          return false
        }
        if (!Object.equals(x[p], y[p])) {
          return false
        }
      }
    }
    for (p in y) {
      if (y.hasOwnProperty(p) && !x.hasOwnProperty(p)) {
        return false
      }
    }
    return true
  }

  const commonColumns = [
    {
      dataIndex: 'personName',
      title: '姓名',
      width: 70,
    },
    {
      dataIndex: 'phoneNumber',
      title: '手机号',
    },
  ]
  const leftColumns = [...commonColumns]
  const rightColumnsTransferModal = commonColumns //右侧只负责显示的columns

  const toDetail = (e) => {
    router.push({
      pathname: '/web/company/distributemgr/groupheadmgr/detail',
      query: {
        groupCode: e.groupCode,
      },
    })
  }

  const isDisabledFunc = (e) => {
    if (e.selectedStatus == '1') {
      return true
    } else {
      return false
    }
  }

  const resetSearch2 = () => {
    personFormRef.resetFields()
  }

  const TableTransfer = ({ leftColumns, rightColumns, ...restProps }) => (
    <Transfer {...restProps} showSelectAll={false} rowKey={(record) => record.personCode}>
      {({
        direction,

        onItemSelectAll,
        onItemSelect,
        selectedKeys: listSelectedKeys,
      }) => {
        const columns = direction === 'left' ? leftColumns : rightColumns
        const dataSource = direction === 'left' ? targetRowsLeft : targetRows

        const rowSelection = {
          getCheckboxProps: (item) => {},
          onSelectAll(selected, selectedRows) {
            const treeSelectedKeys = selectedRows.filter((item) => !item.disabled).map((record) => record['personCode'])
            const diffKeys = selected ? difference(treeSelectedKeys, listSelectedKeys) : difference(listSelectedKeys, treeSelectedKeys)
            onItemSelectAll(diffKeys, selected)
          },
          onSelect(record, selected) {
            onItemSelect(record['personCode'], selected)
          },
          selectedRowKeys: listSelectedKeys,
        }
        return (
          <Table
            rowKey={'personCode'}
            rowSelection={rowSelection}
            columns={columns}
            dataSource={dataSource}
            loading={personLoading}
            size="small"
            keyStr="personCode"
            onRow={(record) => {
              return {
                onClick: () => {
                  let myDisabled = false
                  if (isDisabledFunc) {
                    myDisabled = isDisabledFunc(record)
                  }
                  if (record.disabled || myDisabled) return
                  onItemSelect(record['personCode'], !listSelectedKeys.includes(record['personCode']))
                },
              }
            }}
          />
        )
      }}
    </Transfer>
  )
  return (
    <div>
      <div className="headBac">
        <Form form={queryForm} onFinish={queryOnFinish}>
          <div className="head">
            <div className="flexjss">
              <Form.Item name="groupName" style={{ marginRight: 10 }}>
                <Input placeholder="分组名称" />
              </Form.Item>
              <Form.Item name="distributeName" style={{ marginRight: 10 }}>
                <Input placeholder="推广人名称" />
              </Form.Item>
              <Form.Item name="distributePhoneNumber" style={{ marginRight: 10 }}>
                <Input placeholder="推广人手机号" />
              </Form.Item>
              <>
                <Button style={{ marginRight: 10, borderRadius: '4px' }} className="buttonNoSize" size="middle" onClick={resetSearch}>
                  重置
                </Button>
                <Button style={{ borderRadius: 8, marginRight: 10 }} type="primary" size="middle" htmlType="submit">
                  查询
                </Button>
              </>

              <Button
                style={{ borderRadius: '4px' }}
                onClick={() => {
                  setnewSupplier(true)
                  setalterDatum(false)
                  resetSearch()
                }}
                type="primary"
                size="middle"
              >
                新增
              </Button>
              {/* )} */}
            </div>
          </div>
        </Form>
        <div>
          <Table
            rowKey="id"
            rowClassName={useGetRow}
            style={{ margin: '23px  20px' }}
            pagination={{
              showQuickJumper: true,
              showSizeChanger: true,
              current: pageRef.current,
              pageSize: pageSizeRef.current,
              total: tableListTotalNum,
              showTotal: (total, range) => `当前显示${range[0]}-${range[1]}条 共${total}条`,
              onChange: onPageChange,
            }}
            loading={loading}
            columns={columns}
            dataSource={tradeList}
          />
        </div>
      </div>

      <Modal
        title={alterDatum ? '编辑分组' : '新增分组'}
        footer={null}
        visible={newSupplier}
        onCancel={() => {
          setnewSupplier(false)
          form.resetFields()
        }}
      >
        <>
          <Form form={form} {...layout} onFinish={creaetonFinish} labelCol={{ span: 6 }} wrapperCol={{ span: 16 }}>
            <Form.Item name="groupName" label="分组名称" rules={[{ required: true, message: '分组名称不能为空' }]}>
              <Input placeholder="请输入分组名称" />
            </Form.Item>
            <Form.Item label="分组组长" name="templateDataId" style={{ marginBottom: 10 }} rules={[{ required: true, message: '分组名称不能为空' }]}>
              <FetchSelect
                placeholder="请选择"
                api="/web/staff/member/getDistributeHeadList"
                valueKey="personCode"
                textKey="personName"
                mode="multiple"
                //搜索
                showSearch
                filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              />
            </Form.Item>

            <Form.Item {...tailLayout} style={{ marginTop: 40 }}>
              <Button style={{ borderRadius: '4px' }} type="primary" htmlType="submit">
                确定
              </Button>
              <Button
                style={{ borderRadius: '4px', marginLeft: 88 }}
                onClick={() => {
                  setnewSupplier(false)
                }}
              >
                取消
              </Button>
            </Form.Item>
          </Form>
        </>
      </Modal>

      <Modal
        title={'添加用户'}
        // footer={null}
        visible={personModal}
        onCancel={() => {
          setPersonModal(false)
          setPersonInfo({})
          settableData([])
          settargetKeys([])
          settargetRows([])
          setAllLeftData([])
          settargetRowsLeft([])
          form.resetFields()
        }}
        width={750}
        onOk={personModalOk}
      >
        <Form form={personFormRef} layout="inline" style={{ marginBottom: 20 }}>
          <Fragment>
            <Row>
              <Form.Item label="推广人手机号" name="distributePhoneNumber" style={{ marginBottom: 16 }}>
                <Input placeholder="请输入手机号" allowClear maxLength={500} />
              </Form.Item>
              <Form.Item label="推广人姓名" name="distributeName" style={{ marginBottom: 16 }}>
                <Input placeholder="请输入姓名" allowClear maxLength={200} />
              </Form.Item>
            </Row>
            <Row type="flex">
              <Button onClick={resetSearch2} style={{ marginRight: 10 }}>
                重置
              </Button>
              <Button type="primary" onClick={clickSearch}>
                搜索
              </Button>
            </Row>
          </Fragment>
        </Form>
        <TableTransfer dataSource={tableData} targetKeys={targetKeys} onChange={onChange} leftColumns={leftColumns} rightColumns={rightColumnsTransferModal} />
      </Modal>
      <Modal
        centered={true}
        visible={deleteDatum}
        title="提示信息"
        cancelText="取消"
        okText="确定"
        onOk={deleteDatumTrue}
        onCancel={() => {
          setdeleteDatum(false)
        }}
      >
        <p>是否确认删除分组</p>
      </Modal>
    </div>
  )
}

export default Index
