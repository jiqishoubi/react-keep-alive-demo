import { message, Table } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import { getAllSecondGoodsGroupForActive, getGoodsList } from '@/services/marketing'
import { useGetRow } from '@/hooks/useGetRow'
import _ from 'lodash'

function categoty(props) {
  const pageRef = useRef(1)
  const pageSizeRef = useRef(5)
  //类目弹窗的数据

  //类目Table数据
  const [categoryData, setcategoryData] = useState([])
  //类目loaading
  const [categoryLoading, setcategoryLoading] = useState(false)
  //类目总量
  const [categorytableListTotalNum, setcategorytableListTotalNum] = useState(0)

  const rowKey = 'groupCode'
  const [selectedData, setSelectedData] = useState(props.scopeCodeData)
  const [selectedDataName, setSelectedDataName] = useState(props.scopeCodeData)
  const selectedRowKeys = selectedData.map((row) => row[rowKey])
  const selectedRowName = selectedData.map((row) => row['groupName'])

  const categoryColumns = [
    {
      dataIndex: 'groupCode',
      title: '类目编号',
      align: 'center',
    },
    {
      dataIndex: 'groupName',
      title: '类目名称',
      align: 'center',
    },
  ]

  useEffect(() => {
    categoryOnFinish()
  }, [])
  ///类目处理
  async function categoryOnFinish() {
    pageRef.current = 1
    getTableList()
  }

  const getTableList = async () => {
    setcategoryLoading(true)
    let values = {}
    values['page'] = pageRef.current
    values['rows'] = pageSizeRef.current
    let res = await getAllSecondGoodsGroupForActive(values)
    if (res && res.code === '0') {
      if (res.data.data) {
        let len = res.data.data
        for (let i = 0; i < len.length; i++) {
          len[i]['key'] = len[i].groupCode
        }

        setcategoryData(len)
      }
      setcategorytableListTotalNum(res.data.rowTop)
    } else {
      message.error(res.message)
    }
    setcategoryLoading(false)
  }
  //商品分页
  function categoryPageChange(e, f) {
    pageRef.current = e
    pageSizeRef.current = f
    getTableList()
  }

  //多选
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
    let arrName = []
    if (isSelected) {
      arr = _.uniqBy([...selectedData, ...list], rowKey)
      arrName = _.uniqBy([...selectedDataName, ...list], 'groupName')
    } else {
      arr = _.differenceBy(selectedData, list, rowKey) // 从第一个数组删除第二个数组中的元素
      arrName = _.differenceBy(selectedDataName, list, 'groupName') // 从第一个数组删除第二个数组中的元素
    }

    setSelectedData(arr)
    setSelectedDataName(arrName)
  }

  useEffect(() => {
    let code = selectedRowKeys.join(',')
    props.categoryDatas(code, selectedData)
    let name = selectedRowName.join(',')
    props.categoryNames(name, selectedDataName)
  }, [selectedRowKeys])

  return (
    <>
      <div className="positionre">
        <Table
          rowClassName={useGetRow}
          rowSelection={{
            type: 'checkbox',
            ...rowSelection,
          }}
          pagination={{
            showQuickJumper: true,
            showSizeChanger: true,
            current: pageRef.current,
            pageSize: pageSizeRef.current,
            total: categorytableListTotalNum,
            showTotal: (total, range) => `当前显示${range[0]}-${range[1]}条 共${total}条`,
            onChange: categoryPageChange,
          }}
          loading={categoryLoading}
          columns={categoryColumns}
          dataSource={categoryData}
        />
      </div>
    </>
  )
}
export default categoty
