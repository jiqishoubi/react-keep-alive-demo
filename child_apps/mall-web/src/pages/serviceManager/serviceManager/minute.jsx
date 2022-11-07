import React, { useEffect, useRef, useState } from 'react'
import { Button, Form, Row, Table, Col, Modal, message } from 'antd'
import { useGetRow } from '@/hooks/useGetRow'
import { getSeenMePersonList, seenMePersonReport, getExportInfo, seenMePersonList, getTradeCountReportInfo } from '@/pages/report/airadarmgr/service'
import { router } from 'umi'

const Index = (props) => {
  const { targetUserCode, startDate, endDate } = props.location.query
  const pageRef = useRef(1)
  const pageSizeRef = useRef(20)
  const [recordTotalNum, setRecordTotalNum] = useState()
  //订单状态
  const [tableLoading, setTableLoading] = useState(false)

  //导出数据
  const [oldData, setOldData] = useState()
  const [educe, seteduce] = useState(false)

  const [interTime, setinterTime] = useState()
  const [pagingList, setPagingList] = useState([])
  const [pagingShow, setpagingShow] = useState(false)

  const [pagingLoading, setPagingLoading] = useState(false)

  const [tableList, setTabbleList] = useState([])
  const [titleData, setTitleData] = useState({})

  useEffect(() => {
    getPagingList_()
    //获取订单状态
    onFinish()
    minuteInfo()
  }, [])
  const columns = [
    {
      dataIndex: 'userName',
      title: '用户',
      align: 'center',
    },
    {
      dataIndex: 'logDateStr',
      title: '时间',
      align: 'center',
      width: 200,
    },
    {
      dataIndex: 'logInfo',
      title: '详情',
      align: 'center',
    },
  ]

  const onFinish = () => {
    pageRef.current = 1
    getTableList()
  }
  const getTableList = async () => {
    setTableLoading(true)
    let data = {
      page: pageRef.current,
      rows: pageSizeRef.current,
      targetUserCode,
      startDate,
      endDate,
    }
    setOldData(data)
    let res = await getSeenMePersonList(data)
    if (res && res.code === '0' && res.data) {
      setTabbleList(res.data.data)
      setRecordTotalNum(res.data.rowTop)
    } else {
      message.warn(res.message)
    }
    setTableLoading(false)
  }

  const minuteInfo = async () => {
    let postData = {
      targetUserCode,
      startDate,
      endDate,
    }
    let res = await getTradeCountReportInfo(postData)
    if (res && res.code == '0') {
      setTitleData(res.data)
    } else {
      message.warn(res.message || '请重新查询')
    }
  }

  //改变页数
  const onPageChange = (e, f) => {
    pageRef.current = e
    pageSizeRef.current = f
    getTableList()
  }

  //导出
  const educeFinish = async () => {
    setPagingLoading(true)
    let code
    let value = oldData

    let res = await seenMePersonReport(value)
    if (res && res.code === '0') {
      code = res.data
      message.success(res.message)

      let interTimes = setInterval(async () => {
        let res2 = await getExportInfo({ exportCode: code })
        if (res2.code === '0' && res2.data.status === '90') {
          clearInterval(interTimes)

          getPagingList_()
          setPagingLoading(false)
        }
      }, 1000)
      setinterTime(interTimes)
      clearInterval(interTime)
    } else {
      clearInterval(interTime)
      message.error(res.message)
      setPagingLoading(false)
    }
  }

  //导出表头
  const pagingColumns = [
    {
      title: '导出任务编码',
      align: 'center',
      dataIndex: 'exportCode',
    },
    {
      title: '导出时间',
      align: 'center',
      dataIndex: 'exportDateStr',
    },
    {
      title: '完成时间',
      align: 'center',
      dataIndex: 'finishDateStr',
    },
    {
      title: '状态',
      align: 'center',
      dataIndex: 'statusName',
    },
    {
      title: '操作',
      align: 'center',
      render: (e) => {
        return e.status === '90' ? (
          <a
            onClick={() => {
              window.location.href = e.exportFileUrl
            }}
          >
            下载Excel
          </a>
        ) : (
          ''
        )
      },
    },
  ]

  //导出历史订单获取
  const getPagingList_ = async (value) => {
    setpagingShow(true)
    let res = await seenMePersonList(value)
    if (res && res.code === '0') {
      let data
      if (res.data.data.length > 4) {
        data = res.data.data.slice(0, 5)
      } else data = res.data.data

      setPagingList(data)
    }
    setpagingShow(false)
  }

  return (
    <>
      <div className="headBac">
        <div className="head">
          <Row gutter={[15, 5]}>
            <Col span={6} offset={22}>
              <Button
                style={{ borderRadius: '4px' }}
                size="middle"
                type="primary"
                onClick={() => {
                  seteduce(true)
                  getPagingList_()
                }}
              >
                导出
              </Button>
            </Col>
          </Row>
        </div>
        <Row gutter={[15, 5]} style={{ marginLeft: 40 }} wrap="true">
          <Col span={3} flex="true">
            <div className="spreaddiv">
              <div className="spreaddiv1">浏览总次数</div>
              <div className="spreaddiv2">
                <div style={{ fontSize: 28 }}>{titleData.totalBrowse || '0'}</div>
              </div>
              <div style={{ height: '12%' }}></div>
            </div>
          </Col>
          <Col span={3} flex="true" offset={1}>
            <div className="spreaddiv">
              <div className="spreaddiv1">浏览商品次数</div>
              <div className="spreaddiv2">
                <div style={{ fontSize: 28 }}>{titleData.goodsBrowse || '0'}</div>
              </div>
              <div style={{ height: '12%' }}></div>
            </div>
          </Col>
          <Col span={3} flex="true" offset={1}>
            <div className="spreaddiv">
              <div className="spreaddiv1">浏览文章次数</div>
              <div className="spreaddiv2">
                <div style={{ fontSize: 28 }}>{titleData.articleBrowse || '0'}</div>
              </div>
              <div style={{ height: '12%' }}></div>
            </div>
          </Col>
          <Col span={3} flex="true" offset={1}>
            <div className="spreaddiv">
              <div className="spreaddiv1">其他</div>
              <div className="spreaddiv2">
                <div style={{ fontSize: 28 }}>{titleData.otherBrowse || '0'} </div>
              </div>
              <div style={{ height: '12%' }}></div>
            </div>
          </Col>
        </Row>

        <Table
          rowClassName={useGetRow}
          style={{ margin: '23px  20px' }}
          columns={columns}
          dataSource={tableList}
          loading={tableLoading}
          pagination={{
            showQuickJumper: true,
            showSizeChanger: true,
            current: pageRef.current,
            pageSize: pageSizeRef.current,
            total: recordTotalNum,
            showTotal: (total, range) => `当前显示${range[0]}-${range[1]}条 共${total}条`,
            onChange: onPageChange,
            // onShowSizeChange:onShowSizeChange
          }}
        />

        <div>
          <Button
            style={{
              width: '100px',
              marginTop: '20px',
              marginLeft: 20,
              borderRadius: '4px',
            }}
            type="primary"
            onClick={() => {
              router.push('/web/company/report/airadarmgr')
            }}
          >
            返回
          </Button>
        </div>
      </div>
      <Modal
        destroyOnClose={true}
        title="导出"
        onCancel={() => {
          seteduce(false)
          setPagingLoading(false)
          clearInterval(interTime)
        }}
        visible={educe}
        width="800px"
        height="600px"
        footer={null}
        className="positionre"
      >
        <>
          <Form name="basic" onFinish={educeFinish}>
            <Form.Item wrapperCol={{ span: 3, offset: 21 }}>
              <Button
                onClick={() => {
                  getPagingList_()
                }}
                style={{ borderRadius: '4px', marginRight: 10 }}
                type="primary"
              >
                刷新
              </Button>
            </Form.Item>

            <div>
              <Table loading={pagingShow} rowClassName={useGetRow} pagination={false} columns={pagingColumns} dataSource={pagingList} />
            </div>

            <Form.Item style={{ marginTop: 40 }} wrapperCol={{ span: 17, offset: 7 }}>
              <Button loading={pagingLoading} disabled={pagingLoading} style={{ borderRadius: '4px' }} type="primary" htmlType="submit">
                确定导出
              </Button>
              <Button
                style={{ borderRadius: '4px', marginLeft: 130 }}
                onClick={() => {
                  clearInterval(interTime)
                  setPagingLoading(false)
                  seteduce(false)
                }}
                type="primary"
              >
                关闭
              </Button>
            </Form.Item>
          </Form>
        </>
      </Modal>
    </>
  )
}
export default Index
