import React, { forwardRef, useImperativeHandle, useState } from 'react'
import { Button, Form, message, Modal, Table } from 'antd'
import requestw from '@/utils/requestw'

/**
 * @param {object} props.exportKeyData
 * @param {string} props.exportUrl  //点击导出的url
 * @param {string} props.historyUrl  //历史记录url
 * @param {string} props.infoUrl  //轮训 info url
 * */
function Index(props, ref) {
  const { exportKeyData, exportUrl, historyUrl, infoUrl } = props
  const [pagingLoading, setPagingLoading] = useState(false)
  const [interTime, setInterTime] = useState('')
  const [pagingShow, setPagingShow] = useState(false)
  const [pagingList, setPagingList] = useState([])
  const [educe, setEduce] = useState(false)

  const open = () => {
    getPagingList()
    setEduce(true)
  }

  useImperativeHandle(ref, () => ({
    open,
    openFinish,
  }))
  const openFinish = async () => {
    await open()
    setTimeout(() => {
      educeFinish()
    }, 1000)
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

  // 获取历史
  //导出历史订单获取
  const getPagingList = async (value) => {
    setPagingShow(true)
    let res = await requestw({
      url: historyUrl,
      data: { rows: 5 },
    })

    if (res && res.code === '0' && res.data && res.data.data && res.data.data.length) {
      setPagingList(res.data.data)
    } else {
      setPagingList([])
    }
    setPagingShow(false)
  }

  //导出
  const educeFinish = async () => {
    try {
      setPagingLoading(true)
      let code
      let res = await requestw({
        url: exportUrl,
        data: { ...exportKeyData },
      })

      if (res && res.code === '0' && res.data) {
        code = res.data
        message.success('提交成功')

        let interTimes = setInterval(async () => {
          let data = await requestw({
            url: infoUrl,
            data: { exportCode: code },
            isNeedCheckResponse: true,
          })

          if (data && data.data?.status === '90') {
            clearInterval(interTimes)

            await getPagingList()

            setPagingLoading(false)
          }
        }, 1000)
        setInterTime(interTimes)
        clearInterval(interTime)
      } else {
        clearInterval(interTime)
        message.error(res.message)
        setPagingLoading(false)
      }
    } catch (e) {
      message.warn('导出出错，请稍后！')
    }
  }

  return (
    <>
      {/*导出*/}
      <Modal
        destroyOnClose={true}
        title="导出"
        onCancel={() => {
          setEduce(false)
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
          <Form onFinish={educeFinish}>
            <Form.Item wrapperCol={{ span: 3, offset: 21 }}>
              <Button onClick={getPagingList} style={{ borderRadius: '4px', marginRight: 10 }} type="primary">
                刷新
              </Button>
            </Form.Item>

            <div>
              <Table
                loading={pagingShow}
                // rowClassName={useGetRow}
                pagination={false}
                columns={pagingColumns}
                dataSource={pagingList}
              />
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
                  setEduce(false)
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
export default forwardRef(Index)
