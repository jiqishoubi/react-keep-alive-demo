import { Button, DatePicker, Form, Input, Modal, Radio, Row, Table, InputNumber, message } from 'antd'
import { useGetRow } from '@/hooks/useGetRow'
import React, { forwardRef, useEffect, useState } from 'react'
import lodash from 'lodash'
import { getAllGoodsList, addPreActiveGoods, getPreActiveGoodsList, deletePreActiveGoods, updatePreActiveScope } from '@/pages/channel/ChannelTool/service'

import SettingModal from '@/pages/channel/ChannelTool/components/settingModal'

const QueryGoods = forwardRef((props, ref) => {
  const { goodsProps } = props

  const [newForm] = Form.useForm()
  const [modalForm] = Form.useForm()

  const [tablaLoding, setTablaLoding] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [recordTotalNum, setRecordTotalNum] = useState()
  const [list, setList] = useState([])

  const rowKey = 'goodsCode'
  const [selectedData, setSelectedData] = useState([])
  const selectedRowKeys = selectedData.map((row) => row[rowKey])

  const [isRefund, setIsRefund] = useState(false)
  const [addLoading, setAddLoading] = useState(false)
  const [soleData, setSoleData] = useState()
  const columns = [
    {
      dataIndex: 'goodsName',
      title: '商品名称',
      align: 'center',
    },
    {
      dataIndex: 'salePrice',
      title: '原价(元)',
      align: 'center',
      render: (e) => {
        return e ? e : '--'
      },
    },
    {
      dataIndex: 'prePrice',
      title: '预售价(元)',
      align: 'center',
      render: (e) => {
        return e ? e : '--'
      },
    },
    {
      dataIndex: 'depositPirce',
      title: '预售定金(元)',
      align: 'center',
      render: (e) => {
        return e ? e : '--'
      },
    },
    {
      dataIndex: 'expandRatioStr',
      title: '定金膨胀(倍)',
      align: 'center',
      render: (e) => {
        return e ? e : '--'
      },
    },
    goodsProps.settingShow
      ? {}
      : goodsProps.selectShow
      ? {
          title: '操作',
          align: 'center',
          render: (e) => {
            return (
              <>
                <Button onClick={() => deleteGood(e)} type="link">
                  删除
                </Button>
                {goodsProps.setting ? (
                  <Button onClick={() => settingClick(e)} type="link">
                    设置
                  </Button>
                ) : null}
              </>
            )
          },
        }
      : {},
  ]

  //删除已选中商品
  const deleteGood = async (e) => {
    let postData = {
      activeCode: goodsProps.activeCode,
      scopeCode: e.goodsCode,
    }
    let res = await deletePreActiveGoods(postData)
    if (res && res.code === '0') {
      message.success('删除成功')
      getSelectData()
    } else {
      message.error('删除失败')
    }
  }

  //设置选中商品数据
  const settingClick = (e) => {
    setSoleData(e)
    setIsRefund(true)
  }

  //table批量设置
  const rowSelection = {
    selectedRowKeys,
    onSelect: (row, isSelected, _) => {
      updateSelectedRows(isSelected, [row])
    },
    onSelectAll: (isSelected, _, changeRows) => {
      updateSelectedRows(isSelected, changeRows)
    },
  }
  //批量
  const updateSelectedRows = (isSelected, list) => {
    let arr = []
    if (isSelected) {
      arr = _.uniqBy([...selectedData, ...list], rowKey)
    } else {
      arr = _.differenceBy(selectedData, list, rowKey) // 从第一个数组删除第二个数组中的元素
    }
    setSelectedData(arr)
  }

  //改变页数
  const onPageChange = (newPage, newPageSize) => {
    setPage(newPage)
    setPageSize(newPageSize)
    getSelectData()
  }

  useEffect(() => {
    newOnFinish()
  }, [])

  //点击查询
  const newOnFinish = (values) => {
    setPage(1)
    getSelectData()
  }
  //查询数据
  const getSelectData = async () => {
    setSelectedData([])
    setTablaLoding(true)
    if (goodsProps.selectShow) {
      let values = newForm.getFieldsValue()
      values['activeCode'] = goodsProps.activeCode
      let res = await getPreActiveGoodsList(values)
      if (res && res.code === '0') {
        let jsonList = res.data.data?.map((r) => {
          let item = JSON.parse(r.scopeParamJsonStr)
          item.skuList = JSON.parse(item.skuList)
          setTablaLoding(false)
          return item
        })

        setList(jsonList)
        setRecordTotalNum(res.data.rowTop)
      }
    } else {
      let values = newForm.getFieldsValue()
      values['activeCode'] = goodsProps.activeCode
      let res = await getAllGoodsList(values)
      if (res && res.code === '0' && res.data?.length) {
        setList(res.data)
        setRecordTotalNum(res.data.rowTop)
      }
    }
    setTablaLoding(false)
  }
  //商品设置确定
  const modalOk = async () => {
    let values = modalForm.getFieldsValue()
    let skuData = []
    soleData.skuList.map((r) => {
      let item = values[r.skuCode]
      if (item) {
        item['skuCode'] = r.skuCode
        item.preSalePrice = Math.round(Number(item.preSalePrice) * 100)
        if (item.depositType === 'number') {
          item.deposit = Math.round(Number(item.deposit) * 100)
        }
      }
      skuData.push(item)
    })

    let postData = {
      activeCode: goodsProps.activeCode,
      scopeCode: soleData.goodsCode,
      scopeParamJsonStr: JSON.stringify({
        activeCode: goodsProps.activeCode,
        goodsCode: soleData.goodsCode,
        skuList: JSON.stringify(skuData),
      }),
    }
    let res = await updatePreActiveScope(postData)
    if (res && res.code === '0') {
      message.success('设置成功')
      setIsRefund(false)
      goodsProps.setRefund()
    } else {
      message.error(res.message)
    }
  }

  //添加商品
  const addPreActiveGoods_ = async () => {
    setAddLoading(true)
    let postData = {
      activeCode: goodsProps.activeCode,
      scopeCode: selectedRowKeys.toString(),
    }
    let res = await addPreActiveGoods(postData)
    if (res && res.code === '0') {
      message.success('添加成功')
      goodsProps.setRefund()
    } else {
      message.error('添加失败')
    }
    setAddLoading(false)
  }

  const itemOnChange = (valueObj) => {}

  const SelectItemFromTableProps = {
    onChange: itemOnChange,
  }

  return (
    <>
      <Form ref={ref} form={newForm} onFinish={newOnFinish} style={{ marginLeft: 20 }}>
        <Row>
          <Form.Item name="goodsName" style={{ marginRight: 20 }}>
            <Input placeholder="请输入" />
          </Form.Item>
          <Button type="primary" htmlType="submit" style={{ marginRight: 20, borderRadius: 8 }}>
            查询
          </Button>
          {goodsProps.settingShow ? (
            ''
          ) : goodsProps.selectShow ? (
            <Button
              style={{ marginRight: 20, borderRadius: 8 }}
              type="primary"
              onClick={() => {
                goodsProps.isPopModal()
              }}
            >
              在线选品
            </Button>
          ) : null}
        </Row>
      </Form>

      <Table
        rowClassName={useGetRow}
        style={{ margin: '8px  20px' }}
        rowKey="goodsCode"
        columns={columns}
        dataSource={list}
        loading={tablaLoding}
        rowSelection={goodsProps.selectShow ? '' : rowSelection}
        pagination={{
          showQuickJumper: true,
          showSizeChanger: true,
          current: page,
          pageSize: pageSize,
          total: recordTotalNum,
          showTotal: (total, range) => `当前显示${range[0]}-${range[1]}条 共${total}条`,
          onChange: onPageChange,
        }}
      />
      {goodsProps.modal ? (
        <Row>
          <Button
            style={{ marginLeft: '80%', marginRight: 20 }}
            onClick={() => {
              goodsProps.setRefund()
            }}
          >
            取消
          </Button>
          <Button type="primary" loading={addLoading} onClick={addPreActiveGoods_}>
            确定
          </Button>
        </Row>
      ) : null}

      <Modal
        destroyOnClose={true}
        title="商品设置"
        onCancel={() => {
          setIsRefund(false)
        }}
        visible={isRefund}
        width="600px"
        className="positionre"
        onOk={modalOk}
      >
        <Form preserve={false} form={modalForm} labelCol={{ offset: 4 }} wrapperCol={{ span: 16 }} labelAlign="left">
          <Form.Item label="商品名称" name="goodsName" initialValue={soleData?.goodsName} style={{ marginBottom: 6 }}>
            <Input disabled={true} bordered={false} />
          </Form.Item>

          {soleData?.skuList.map((r) => {
            let value = r
            if (value) {
              if (value.preSalePrice) {
                value.preSalePrice = Number(value.preSalePrice) / 100
              }
              if (value.depositType === 'number' && value.deposit) {
                value.deposit = Number(value.deposit) / 100
              }
            }

            return (
              <>
                <Form.Item name={r.skuCode} key={r.skuCode} wrapperCol={{ span: 16, offset: 4 }}>
                  <SettingModal {...SelectItemFromTableProps} key={r.skuCode} keyValues={value} />
                </Form.Item>
              </>
            )
          })}
        </Form>
      </Modal>
    </>
  )
})

export default QueryGoods
