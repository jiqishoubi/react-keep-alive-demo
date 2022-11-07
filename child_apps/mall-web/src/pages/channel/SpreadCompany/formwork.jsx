import { connect } from 'dva'
import { Form, Table, Button, Modal, Space, Input, message } from 'antd'
import React, { useEffect, useState } from 'react'
import { useGetRow } from '@/hooks/useGetRow'
import { router } from 'umi'
import { getChooseGoodsListPaging, createUiTemplateData, updateUiTemplateData } from './service'

const formWork = (props) => {
  const {
    dispatch,
    spreadCompanyMngModel: { allGoodsData, revampShow, revampList },
  } = props
  const [goodShow, setgoodShow] = useState(false)

  const [loading, setLoading] = useState(false)
  const [goodsLoading, setgoodsLoading] = useState(false)
  //总条数
  const [totalNum, settotalNum] = useState()
  //分页
  const [pageNum, setpageNum] = useState(1)
  const [goodsData, setgoodsData] = useState([])
  //监控页面变动
  const [clickPag, setclickPag] = useState()
  const [oldData, setoldData] = useState()
  const [Rows, setRows] = useState()
  const [rowsKey, setRowskey] = useState([])

  const paginationProps = {
    showQuickJumper: true,
    defaultCurrent: 1,
    total: totalNum,
    pageSizeOptions: ['5'],
    defaultPageSize: 5,
    current: pageNum,
    showTotal: (total, range) => `当前显示${range[0]}-${range[1]}条 共${total}条`,
  }

  const columns = [
    {
      title: '商品名称',
      dataIndex: 'goodsName',
      align: 'center',
    },
    {
      title: '商品排序',
      dataIndex: 'index',
      align: 'center',
    },
  ]
  const goodsColumns = [
    {
      title: '商品编号',
      dataIndex: 'goodsCode',
      align: 'center',
    },
    {
      title: '商品名称',
      dataIndex: 'goodsName',
      align: 'center',
    },
  ]
  const btnClicck = () => {
    setgoodShow(true)
  }
  //获取商品列表
  const onFinish = async (values) => {
    delete values.page
    let news = JSON.stringify(values)
    if (news !== oldData) {
      setpageNum(1)
      setoldData(news)
      values['page'] = 1
    } else {
      values['page'] = pageNum
    }

    setgoodsLoading(true)
    values['rows'] = 5

    let res = await getChooseGoodsListPaging(values)
    if (res && res.code === '0') {
      if (res.data.data) {
        let len = res.data.data
        for (let i = 0; i < len.length; i++) {
          len[i]['key'] = len[i].goodsCode
        }
        setgoodsData(len)
      }

      settotalNum(res.data.rowTop)
    } else {
      message.error(res.message)
    }
    setgoodsLoading(false)
  }
  //商品选择
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setRows(selectedRows)
      setRowskey(selectedRowKeys)
    },
  }

  //点击改变页数
  useEffect(() => {
    onFinish({ pageNum: 1 })
  }, [clickPag])

  // 分页点击
  function pageChange(e) {
    setpageNum(e.current)
    setclickPag(e.current)
  }

  //模板的新建和修改
  const onOkClicK = async () => {
    let selectedRows = JSON.parse(JSON.stringify(Rows))
    let index = selectedRows.length
    for (let i = 0; i < index; i++) {
      selectedRows[i]['index'] = i + 1
    }

    let data = [
      {
        type: 'img',
        imgItem: [],
      },
    ]
    selectedRows.map((r) => {
      let x = {
        index: r.index,
        goodsName: r.goodsName,
        goodsCode: r.goodsCode,
        url: r.goodsImg.split(',')[0],
        code: r.goodsCode,
      }
      data[0].imgItem.push(x)
    })

    dispatch({
      type: 'spreadCompanyMngModel/alarts',
      payload: {
        allGoodsData: selectedRows,
        templateData: JSON.stringify(data),
      },
    })
    setgoodShow(false)
  }

  return (
    <>
      <div>
        <div className="fontMb">
          <div className="marginlr20">模板配置</div>
          <div className="newflex"></div>

          <Table
            rowClassName={useGetRow}
            style={{ margin: '0 20px' }}
            loading={loading}
            columns={columns}
            dataSource={allGoodsData}
            title={() => {
              return (
                <>
                  <div>自定义商品区域(最多展示10个商品)</div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button style={{ borderRadius: '4px' }} type="primary" size="middle" onClick={btnClicck}>
                      选择默认商品
                    </Button>
                  </div>
                </>
              )
            }}
            pagination={false}
          />

          <div style={{ margin: '20px  20px' }}>
            <Button style={{ width: '100px', borderRadius: '4px' }} type="primary">
              预览
            </Button>
            <Button
              style={{ width: '100px', borderRadius: '4px', marginLeft: 10 }}
              onClick={() => {
                router.push('/web/company/distributemgr/spreadcompany/detail')
                dispatch({
                  type: 'spreadCompanyMngModel/alarts',
                  payload: {
                    allGoodsData: [],
                  },
                })
              }}
            >
              返回
            </Button>
          </div>
        </div>
      </div>

      <Modal
        destroyOnClose={true}
        centered={true}
        title="选择商品"
        visible={goodShow}
        onCancel={() => {
          setgoodShow(false)
        }}
        onOk={() => {
          onOkClicK()
        }}
        cancelText="取消"
        okText="确定"
        width={800}
      >
        <>
          <Form onFinish={onFinish}>
            <div>
              <Space>
                <Form.Item name="goodsCode" style={{ width: 170 }}>
                  <Input placeholder="商品编号" />
                </Form.Item>
                <Form.Item name="goodsName" style={{ width: 170 }}>
                  <Input placeholder="商品名称" />
                </Form.Item>
              </Space>
              <Button id="formworkinit" style={{ marginLeft: '10px', borderRadius: '4px' }} type="primary" size="middle" htmlType="submit">
                查询
              </Button>
            </div>
          </Form>
          <div className="positionre">
            <Table
              rowSelection={{
                type: 'checkbox',
                ...rowSelection,
                hideSelectAll: true,
                selectedRowKeys: rowsKey,
              }}
              rowClassName={useGetRow}
              columns={goodsColumns}
              pagination={paginationProps}
              loading={goodsLoading}
              dataSource={goodsData}
              onChange={pageChange}
            />
          </div>
        </>
      </Modal>
    </>
  )
}
export default connect(({ spreadCompanyMngModel, loading }) => {
  return {
    spreadCompanyMngModel,
    loadingTable: loading.effects['spreadCompanyMngModel/fetch'],
  }
})(formWork)
