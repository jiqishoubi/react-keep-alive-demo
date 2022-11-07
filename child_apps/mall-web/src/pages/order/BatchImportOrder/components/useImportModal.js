import React, { useState, useCallback, useEffect } from 'react'
import { Modal, Form, Input, message, Table, Row, Col, Button } from 'antd'
import FetchSelect from '@/components/FetchSelect'
import SelectItemRecordFromTable from '@/components/SelectItemRecordFromTable'
import SelectItemRecordFromTableSku from './SelectItemRecordFromTableSku'
import BUpload from '@/components/BUpload'
import { useGetRow } from '@/hooks/useGetRow'
import useTable from '@/hooks/useTable'
import { submitBatchAjax } from '../services'

const tableId = 'order_batchimportorder_importmodal_table'
const rowKey = 'id'

let uploadIndex = 1 //第几次上传文件

const getDistributeUserProps = {
  width: 700,
  title: '合伙人',
  searchFormItems: [{ name: 'userName', placeholder: '姓名' }],
  api: '/web/trade/importTradeDataByExcel/getDistributePersonList',
  dealResFunc: (res) => {
    let arr = []
    if (res && res.code == '0' && res.data) {
      arr = res.data
    }
    return {
      tableData: arr,
      total: arr.length,
    }
  },
  columns: [
    {
      title: '合伙人',
      dataIndex: 'personName',
    },
    {
      title: '推广公司',
      dataIndex: 'distributeOrgName',
    },
    {
      title: '创建时间',
      dataIndex: 'createDateStr',
    },
  ],
  rowKey: 'distributeCode',
  inputValKey: 'personName',
  inputCodeKey: 'distributeCode',
  isPage: false,
}

// sku
const getGoodsListProps = {
  width: 1000,
  title: '商品',
  searchFormItems: [{ name: 'goodsName', placeholder: '名称' }],
  api: '/web/trade/importTradeDataByExcel/getGoodsList',
  dealResFunc: (res) => {
    let arr = []
    if (res && res.code == '0' && res.data) {
      arr = res.data
      arr.forEach((item) => {
        if (item.skuList) {
          item.skuList.forEach((itm) => {
            itm.goodsName = item.goodsName
            itm.goodsCode = item.goodsCode + '&' + itm.skuCode
          })
        }
        item.children = item.skuList || []
      })
    }
    return {
      tableData: arr,
      total: arr.length,
    }
  },
  columns: [
    {
      title: '商品',
      dataIndex: 'goodsName',
      render: (v, record) => {
        if (record.skuCode) {
          return ''
        }
        return v
      },
    },
    {
      title: '类型',
      dataIndex: 'goodsTypeName',
    },
    {
      title: '规格名称',
      dataIndex: 'skuName',
    },
    {
      title: '规格',
      dataIndex: 'goodsPropertyStr',
    },
  ],
  rowKey: 'goodsCode',
  inputValKey: 'skuName',
  inputCodeKey: 'skuCode',
  isPage: false,
}

/**
 * @param {object} options
 * @param {function} options.onSuccess
 */
function useImportModal(options) {
  const { onSuccess } = options || {}
  const [visible, setVisible] = useState(false)
  const [isLoadingBtn, setIsLoadingBtn] = useState(false)

  //合伙人 商品
  const [distributeUser, setDistributeUser] = useState(null)
  const [skuObj, setSkuObj] = useState(null)
  //表格
  const [tableDataTemp, setTabeDataTemp] = useState([])

  //方法
  const openModal = useCallback(() => {
    setVisible(true)
  }, [])
  const closeModal = useCallback(() => {
    uploadIndex = 1
    setDistributeUser(null)
    setSkuObj(null)
    setTabeDataTemp([])
    setVisible(false)
  }, [])
  //提交
  const onSubmit = async () => {
    if (!tableDataTemp.length) {
      message.warning('请先上传数据')
      return
    }

    const postData = {
      tradeDataStr: JSON.stringify(tableDataTemp),
    }
    setIsLoadingBtn(true)
    let ajax
    ajax = submitBatchAjax
    ajax(postData)
      .finally(() => {
        setIsLoadingBtn(false)
      })
      .then((res) => {
        if (res && res.code == '0') {
          message.success('操作成功')
          closeModal()
          if (onSuccess) onSuccess()
        } else {
          message.warning((res && res.message) || '网络异常')
        }
      })
  }

  /**
   * 渲染的dom 组件
   */
  const onUploadCallback = (_, res) => {
    let arr = []
    if (res && res.code == '0' && res.data) {
      arr = res.data
      //处理arr
      arr.forEach((item, index) => {
        item.id = uploadIndex + '' + (index + 1 + '') //第几次的第几个
      })
      uploadIndex++
    }
    setTabeDataTemp([...tableDataTemp, ...arr])
  }

  const uploadCanUse = distributeUser && skuObj

  const clickDelete = (record) => {
    const arrNew = tableDataTemp.filter((item) => item.id !== record.id)
    setTabeDataTemp(arrNew)
  }
  const columns = [
    { title: '合伙人', key: 'distributeName', dataIndex: 'distributeName' },
    { title: '商品', key: 'goodsName', dataIndex: 'goodsName', width: 230 },
    { title: '商品规格', key: 'skuName', dataIndex: 'skuName' },
    //
    { title: '数量', key: 'skuCount', dataIndex: 'skuCount' },
    { title: '收货人', key: 'consignee', dataIndex: 'consignee' },
    { title: '联系电话', key: 'phoneNumber', dataIndex: 'phoneNumber' },
    {
      title: '地址',
      key: 'address',
      ellipsis: true,
      render: (record) => {
        return `${record.province || ''}${record.city || ''}${record.county || ''}${record.address || ''}`
      },
    },
    { title: '跨境姓名', key: 'realName', dataIndex: 'realName' },
    { title: '身份证', key: 'idNo', dataIndex: 'idNo' },
    {
      title: '操作',
      key: 'option',
      fixed: 'right',
      width: 70,
      render: (record) => {
        return (
          <a
            onClick={() => {
              clickDelete(record)
            }}
          >
            删除
          </a>
        )
      },
    },
  ]

  const ModalDom = (
    <Modal title="批量导入" visible={visible} destroyOnClose maskClosable={false} onCancel={closeModal} onOk={onSubmit} confirmLoading={isLoadingBtn} width={1000} centered>
      <div>
        <div>
          <Row style={{ marginBottom: 20 }}>
            <Col span={15}>
              <SelectItemRecordFromTable
                {...getDistributeUserProps}
                value={distributeUser}
                onChange={(record) => {
                  setDistributeUser(record)
                }}
              />
            </Col>
          </Row>
          <Row style={{ marginBottom: 20 }}>
            <Col span={15}>
              <SelectItemRecordFromTableSku
                {...getGoodsListProps}
                value={skuObj}
                onChange={(record) => {
                  setSkuObj(record)
                }}
              />
            </Col>
          </Row>
          <Row justify="space-between" style={{ marginBottom: 20 }}>
            <Col>
              <Row gutter={10}>
                <Col>
                  <BUpload
                    api="/web/trade/importTradeDataByExcel"
                    type="file"
                    getPostData={(e) => {
                      return {
                        operKind: 'CREATE_TRADE',
                        distributeCode: distributeUser.distributeCode,
                        skuCode: skuObj.skuCode,
                      }
                    }}
                    onSuccessCallback={onUploadCallback}
                    disabled={!uploadCanUse}
                  >
                    {(loading) => {
                      return (
                        <Button type="primary" loading={loading} disabled={!uploadCanUse}>
                          上传文件
                        </Button>
                      )
                    }}
                  </BUpload>
                </Col>
                <Col>
                  <Button
                    onClick={() => {
                      setSkuObj(null)
                      setDistributeUser(null)
                    }}
                  >
                    重置
                  </Button>
                </Col>
              </Row>
            </Col>
            <Col>
              <Button
                onClick={() => {
                  // setSkuObj(null)
                  // setDistributeUser(null)
                  setTabeDataTemp([])
                }}
              >
                全部删除
              </Button>
            </Col>
          </Row>
        </div>

        <Table style={{ margin: '23px  0' }} id={tableId} rowKey={rowKey} rowClassName={useGetRow} columns={columns} dataSource={tableDataTemp} scroll={{ x: 1400 }} />
      </div>
    </Modal>
  )

  return {
    openImportodal: openModal,
    closImportModal: closeModal,
    ImportModal: ModalDom,
  }
}

export default useImportModal
