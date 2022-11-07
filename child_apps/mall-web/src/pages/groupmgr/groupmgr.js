import { Form, DatePicker, Input, Space, Button, Table, Transfer, Switch, message, Modal, Select, Row } from 'antd'

import React, { useEffect, useRef, useState, Fragment } from 'react'
import { getOrgKind, haveCtrlElementRight } from '@/utils/utils'
import difference from 'lodash/difference'

import { useGetRow } from '@/hooks/useGetRow'
import _ from 'lodash'
import { getLearnGroupListPaging, deleteLearnGroup, createLearnGroup, updateLearnGroup, getSysCodeByParam } from '@/services/groupmgr'
import FetchSelect from '@/components/FetchSelect'
import api_channel from '@/services/api/channel'
import { PlusOutlined } from '@ant-design/icons'
import lodash from 'lodash'
import debounce from 'lodash/debounce'
import requestw from '@/utils/requestw'
import GoodsModal from './components/GoodsModal'
import { router } from 'umi'
const { TextArea } = Input
function datum() {
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

  const transferModalRef = useRef()
  //数据总量
  const [tableListTotalNum, settableListTotalNum] = useState(0)
  //table loding 展示
  const [loading, setloading] = useState(false)

  const [tradeList, settradeList] = useState([])
  const [selectList, setselectList] = useState([])
  //创建分类
  const [newSupplier, setnewSupplier] = useState(false)
  //删除分类
  const [deleteDatum, setdeleteDatum] = useState(false)
  //编辑分类
  const [alterDatum, setalterDatum] = useState(false)
  //唯一数据
  const [soleDatum, setsoleDatum] = useState(false)

  const [templateDataId, setTemplateDataId] = useState('')
  const [groupType, setgroupType] = useState('')
  const [templateData, setTemplateData] = useState({
    pageConfig: {},
    itemList: [],
  })
  const [optionArr, setOptionArr] = useState([])
  const [loadings, setLoading] = useState(false)

  // 添加用户
  const [personModal, setPersonModal] = useState(false)
  const [personInfo, setPersonInfo] = useState({})
  const [tableData, settableData] = useState()
  const [targetKeys, settargetKeys] = useState([])
  const [targetRows, settargetRows] = useState([])
  const [selectedKeys, setselectedKeys] = useState([])
  const [AllLeftData, setAllLeftData] = useState([])
  const [personLoading, setpersonLoading] = useState(false)
  const [targetRowsLeft, settargetRowsLeft] = useState([])
  const [groupCode, setGroupCode] = useState('')
  const [goodsModalShow, setGoodsModalShow] = useState(false)
  const columns = [
    // {
    //   dataIndex: 'learnGroupTypeName',
    //   title: '所属客户端',
    //   align: 'center',
    // },
    // { dataIndex: 'learnGroupCode', title: '编号', align: 'center' },
    {
      dataIndex: 'groupName',
      title: '分组名称',
      align: 'center',
    },
    {
      dataIndex: 'groupTypeName',
      title: '类型',
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
            {e.groupTypeName === '在售商品' ? (
              <a
                onClick={() => {
                  monopolyClick(e)
                }}
              >
                在售商品
              </a>
            ) : null}
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

  //  // 封装获取订单状态

  useEffect(() => {
    queryOnFinish()
    getOptions()
    getSysCodeByParam_('GROUP_TYPE').then((res) => {
      if (res && res.code === '0') {
        setselectList(res.data)
      } else {
      }
    })
  }, [])
  const getOptions = async () => {
    setLoading(true)
    const res = await requestw({
      url: '/web/staff/uiTemplateData/getList',
      data: {
        page: 1,
        rows: 200,
      },
    })
    setLoading(false)
    let arr = []
    if (res && res.code == '0' && res.data) {
      arr = res.data
    }
    // }
    setOptionArr(arr)
  }

  async function getSysCodeByParam_(codeParam, inCode, notCode) {
    let cs = {
      // groupType :codeParam,
      codeParam,
      inCode,
      notCode,
    }
    let res = await getSysCodeByParam(cs)
    return res
  }

  //编辑
  function alterDatums(e) {
    form.setFieldsValue(e)
    form.setFieldsValue({
      templateDataId: Number(e.templateDataId),
    })
    setnewSupplier(true)
    setsoleDatum(e)
    setalterDatum(true)
    suhandleChange(e.groupType)
  }
  //专营商品
  const monopolyClick = (e) => {
    setGroupCode(e.groupCode)
    setGoodsModalShow(true)
  }
  const changeGoodsModal = () => {
    setGoodsModalShow(false)
    setGroupCode('')
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
  const onTemplateChange = (key, row) => {
    if (!row) {
      setTemplateData({
        pageConfig: {},
        itemList: [],
      })
      return
    }
    let jsonStr = row.key
    setTemplateDataId(row?.value)
    let json
    try {
      json = JSON.parse(jsonStr)
    } catch (e) {}
    let templateData = {}
    if (Array.isArray(json)) {
      //数组
      templateData = {
        pageConfig: {},
        itemList: json,
      }
    } else if (Object.prototype.toString.call(json) === '[object Object]') {
      //对象
      templateData = json
    }
    setTemplateData(lodash.cloneDeep(templateData))
  }

  const suhandleChange = (e) => {
    // TEMPLATE
    setgroupType(e)
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
      url: '/web/staff/group/getWaitingListPaging',
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
      url: '/web/staff/group/getWaitingListPaging',
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
    // if (!selectedStatus) {
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
      url: '/web/staff/group/getWaitingListPaging',
      data: {
        groupCode: personInfo.groupCode,
        selectedStatus: '0',
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

      // settargetKeys(nextTargetKeys);
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

        //  }
      })
      settargetRowsLeft(leftarr)
      // settargetKeys(nextTargetKeys);
    }
  }

  const cmp = (x, y) => {
    // If both x and y are null or undefined and exactly the same
    if (x === y) {
      return true
    }
    // If they are not strictly equal, they both need to be Objects
    if (!(x instanceof Object) || !(y instanceof Object)) {
      return false
    }
    //They must have the exact same prototype chain,the closest we can do is
    //test the constructor.
    if (x.constructor !== y.constructor) {
      return false
    }
    for (var p in x) {
      //Inherited properties were tested using x.constructor === y.constructor
      if (x.hasOwnProperty(p)) {
        // Allows comparing x[ p ] and y[ p ] when set to undefined
        if (!y.hasOwnProperty(p)) {
          return false
        }
        // If they have the same strict value or identity then they are equal
        if (x[p] === y[p]) {
          continue
        }
        // Numbers, Strings, Functions, Booleans must be strictly equal
        if (typeof x[p] !== 'object') {
          return false
        }
        // Objects and Arrays must be tested recursively
        if (!Object.equals(x[p], y[p])) {
          return false
        }
      }
    }
    for (p in y) {
      // allows x[ p ] to be set to undefined
      if (y.hasOwnProperty(p) && !x.hasOwnProperty(p)) {
        return false
      }
    }
    return true
  }

  // 2021年5月27日16:46:33

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

  const onTransferModalSuccess = async (keys, rows) => {
    const ress = await requestw({
      url: '/web/staff/group/getSelectedListPaging',
      // data: postData,
      data: {
        groupCode: personInfo.groupCode,
      },
    })
    let targetKeys = ''
    if (!ress.data.data) {
    } else {
      ress.data.data.map((item) => {
        targetKeys += item.personCode + ','
      })

      targetKeys = targetKeys.split(',')
    }
    let isok = false
    if (!keys.length) {
      message.warning('请至少添加一名')
      return
    }
    let res = await requestw({
      url: '/web/staff/group/createRelationBatch',
      data: {
        groupCode: personInfo.groupCode,
        personCodeStr: targetKeys + keys.toString(),
      },
    })
    if (res.code == '0') {
      // resolve(true);
      message.success('操作成功')
      isok = true
    } else {
      isok = false
    }
    return isok
    // });
  }

  const toDetail = (e) => {
    router.push({
      pathname: '/web/company/distributemgr/groupmgrdetail',
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
      {({ direction, filteredItems, onItemSelectAll, onItemSelect, selectedKeys: listSelectedKeys, disabled }) => {
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
      {goodsModalShow && <GoodsModal changeGoodsModal={changeGoodsModal} groupCode={groupCode} />}
      <div className="headBac">
        <Form form={queryForm} onFinish={queryOnFinish}>
          <div className="head">
            <div className="flexjss">
              <Form.Item name="groupName" style={{ marginRight: 10 }}>
                <Input placeholder="请输入分组名称" />
              </Form.Item>

              <Form.Item name="groupType" style={{ marginRight: 10 }}>
                <Select
                  style={{ width: '160px' }}
                  // showArrow={true}
                  placeholder="请选择分组类型"
                  allowClear={true}
                >
                  {selectList.map((r) => (
                    <Option key={r.codeKey} value={r.codeKey}>
                      {r.codeValue}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <>
                <Button style={{ marginRight: 10, borderRadius: '4px' }} className="buttonNoSize" size="middle" onClick={resetSearch}>
                  重置
                </Button>
                <Button style={{ borderRadius: 8, marginRight: 10 }} id="orderProfitinit" type="primary" size="middle" htmlType="submit">
                  查询
                </Button>
              </>

              {/* {!getOrgKind().isAdmin && ( */}
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
            <Form.Item name="groupType" label="分组类型" rules={[{ required: true, message: '请选择分组类型' }]}>
              <Select
                // style={{ width: '140px' }}
                showArrow={true}
                disabled={alterDatum}
                placeholder="请选择"
                allowClear={true}
                // showSearch
                filterOption={false}
                onChange={suhandleChange}
              >
                {selectList.map((r) => (
                  <Option key={r.codeKey} value={r.codeKey}>
                    {r.codeValue}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            {groupType == 'TEMPLATE' ? (
              <Form.Item label="样板" name="templateDataId" rules={[{ required: true, message: '请选择样板' }]}>
                <Select placeholder="请选择" loading={loadings}>
                  {optionArr &&
                    optionArr.map((obj, ind) => (
                      <Option key={ind} value={obj.id}>
                        {obj.templateDataName}
                      </Option>
                    ))}
                </Select>
              </Form.Item>
            ) : null}

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
          setselectedKeys([])
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
              <Form.Item label={<div style={{ width: 69 }}>合伙人手机号</div>} name="phoneNumber" style={{ marginBottom: 16 }}>
                <Input
                  placeholder="请输入手机号"
                  allowClear
                  maxLength={500}
                  // style={{ width: 230, minHeight: 57 }}
                />
              </Form.Item>
              <Form.Item label={<div style={{ width: 69 }}>合伙人姓名</div>} name="personName" style={{ marginBottom: 16 }}>
                <Input
                  placeholder="请输入姓名"
                  allowClear
                  maxLength={200}
                  // style={{ width: 230, minHeight: 57 }}
                />
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
        <TableTransfer dataSource={tableData} targetKeys={targetKeys} id="personCode" onChange={onChange} leftColumns={leftColumns} rightColumns={rightColumnsTransferModal} />
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

export default datum
