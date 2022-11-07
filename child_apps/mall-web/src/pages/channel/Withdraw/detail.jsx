import React, { useImperativeHandle, forwardRef, useState, useRef } from 'react'
import { Modal, Table, Button, Row, Col } from 'antd'
import TotalAccount from '../components/TotalAccount'
import { useRequest } from 'ahooks'
import useTable from '@/hooks/useTable'
import { getUserPaymentInfoAjax } from '@/services/channel'

function Index(props, ref) {
  useImperativeHandle(ref, () => ({
    open,
  }))

  const [visible, setVisible] = useState(false)
  const record = useRef(null)
  const [resData, setResData] = useState(null)

  const columns = [
    { title: '提现订单号', key: 'paymentNo', dataIndex: 'paymentNo' },
    { title: '姓名', key: 'userName', dataIndex: 'userName' },
    { title: '账号', key: 'phoneNumber', dataIndex: 'phoneNumber' },
    { title: '提现金额', key: 'payFeeStr', dataIndex: 'payFeeStr' },
    { title: '提现时间', key: 'payDateStr', dataIndex: 'payDateStr' },
    { title: '提现状态', key: 'statusName', dataIndex: 'statusName' },
  ]

  const {
    //表格
    currentPage,
    currentPageSize,
    tableData,
    tableTotalNum,
    isTableLoading,
    //方法
    setCurrentPage,
    setCurrentPageSize,
    search, //刷新表格 页码变成1
  } = useTable({ manul: true, ajax: getDataAjax })

  /**
   * 请求
   */

  function getDataAjax({ page, pageSize }) {
    const personCode = record.current?.personCode
    if (!personCode) {
      return new Promise((resolve) =>
        resolve({
          list: [],
          total: 0,
        })
      )
    }

    const postData = {
      nowPage: page,
      rowsPage: pageSize,
      personCode,
    }
    return getUserPaymentInfoAjax(postData).then((res) => {
      setResData(res)
      let resObj = {
        list: [],
        total: 0,
      }
      if (res && res.code == '0' && res.data && res.data.data) {
        resObj = {
          list: res.data.data,
          total: res.data.rowTop,
        }
      }
      return resObj
    })
  }

  /**
   * 方法
   */

  function open(r) {
    setVisible(true)
    record.current = r
    search()
  }

  function close() {
    setVisible(false)
    record.current = null
  }

  const paginationProps = {
    showQuickJumper: true,
    current: currentPage,
    pageSize: currentPageSize,
    total: tableTotalNum,
    showTotal: (total, range) => `当前显示${range[0]}-${range[1]}条 共${total}条`,
  }

  //总计
  let messageObj = null
  if (resData && resData.code == '0' && resData.message) {
    try {
      const obj = JSON.parse(resData.message)
      if (Object.prototype.toString.call(obj) === '[object Object]') messageObj = obj
    } catch (e) {}
  }

  return (
    <Modal
      title="详情"
      visible={visible}
      onCancel={close}
      width={1050}
      footer={[
        <Button key="ok" type="primary" onClick={close}>
          确定
        </Button>,
      ]}
    >
      {messageObj && (
        <TotalAccount
          items={[
            { title: '待审核（元）', value: messageObj.TO_BE_REVIEWED },
            { title: '已提现（元）', value: messageObj.PAY_SUCCESS },
            { title: '佣金收入（元）', value: messageObj.TOTAL_COUNT },
            { title: '可提现（元）', value: messageObj.BALANCE },
          ]}
        />
      )}

      <Table
        rowKey="id"
        columns={columns}
        dataSource={tableData}
        loading={isTableLoading}
        pagination={paginationProps}
        onChange={(e) => {
          setCurrentPage(e.current)
          setCurrentPageSize(e.pageSize)
        }}
      />
    </Modal>
  )
}

export default forwardRef(Index)
