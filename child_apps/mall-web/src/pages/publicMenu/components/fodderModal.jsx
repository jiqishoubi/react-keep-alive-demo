import { Modal, Radio, Pagination, Space, Spin, Button, Col } from 'antd'
import React, { forwardRef, useEffect, useState, useImperativeHandle, useRef } from 'react'
import { globalHost } from '@/utils/utils'
const FodderModal = (props, ref) => {
  const { url, type } = props
  const pageRef = useRef(1)
  const pageSizeRef = useRef(10)
  const [fodderList, setFodderList] = useState([])
  const [show, setShow] = useState(false)
  const [recordTotalNum, setRecordTotalNum] = useState('')
  const [spinning, setSpinning] = useState(false)
  const [radioData, setRadioData] = useState('')
  const [radioViceData, setRadioViceData] = useState('')
  useImperativeHandle(ref, () => ({
    open,
  }))
  const open = () => {
    setShow(true)
    getFodder()
  }
  const getFodder = async () => {
    setSpinning(true)
    const postData = {
      offset: pageRef.current,
      count: pageSizeRef.current,
    }
    type === 'news' ? '' : (postData['type'] = type)

    const res = await url(postData)
    if (res && res.code === '0' && res.data && res.data.items.length) {
      setFodderList(res.data.items)
      setRecordTotalNum(res.data.totalCount)
    } else {
      setFodderList([])
      setRecordTotalNum(0)
    }
    setSpinning(false)
  }

  //改变页数
  const onPageChange = (e, f) => {
    pageRef.current = e
    pageSizeRef.current = f
    getFodder()
  }

  const fodderModalChange = () => {
    props.onChange(radioViceData)
    setShow(false)
  }

  const radioChange = (e) => {
    setRadioData(e.mediaId)
    setRadioViceData(e)
  }

  return (
    <Modal
      destroyOnClose={true}
      centered={true}
      title="选择素材"
      visible={show}
      onCancel={() => {
        setShow(false), setFodderList([])
      }}
      footer={null}
      width={880}
    >
      <Radio.Group style={{ width: 850 }}>
        <Spin size="large" spinning={spinning} style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {fodderList.map((item, index) => {
              return type === 'news' ? (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    marginLeft: 15,
                    cursor: 'pointer',
                    width: 400,
                    overflow: 'hidden',
                  }}
                >
                  <Radio
                    style={{ float: 'left', overflow: 'hidden' }}
                    onChange={() =>
                      radioChange({
                        mediaId: item.mediaId,
                        title: item.content.articles[0].title,
                        url: item.content.articles[0].thumbUrl,
                      })
                    }
                    value={item.mediaId}
                  >
                    {item.content.articles[0].title}
                  </Radio>
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <img alt="" src={item.content.articles[0].thumbUrl} style={{ height: 100 }} />
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    marginLeft: 15,
                    cursor: 'pointer',
                    width: 400,
                  }}
                >
                  <Radio
                    style={{ float: 'left', overflow: 'hidden' }}
                    value={item.mediaId}
                    onChange={() =>
                      radioChange({
                        mediaId: item.mediaId,
                        title: item.name,
                        url: item.url,
                      })
                    }
                  >
                    {item.name}
                  </Radio>
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    {type === 'video' || type === 'voice' ? (
                      <>
                        {type === 'video' && (
                          <video controls style={{ height: 100, width: 'auto' }}>
                            <source src={item.url} type="video/mp4" />
                          </video>
                        )}

                        {type === 'voice' && (
                          <div style={{ height: 100, width: 'auto' }}>
                            <audio controls>
                              <source src={item.url} type="audio/ogg; codecs=opus" />
                            </audio>
                          </div>
                        )}
                      </>
                    ) : (
                      <img alt="" src={item.url} style={{ height: 100 }} />
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </Spin>
        <Pagination
          style={{ marginRight: 15, float: 'right', marginTop: 15 }}
          showQuickJumper={true}
          showSizeChanger={true}
          current={pageRef.current}
          pageSize={pageSizeRef.current}
          total={recordTotalNum}
          showTotal={(total, range) => `当前显示${range[0]}-${range[1]}条 共${total}条`}
          onChange={onPageChange}
        />

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 66 }}>
          <Button style={{ borderRadius: '4px', marginRight: 100 }} type="primary" size="middle" onClick={fodderModalChange}>
            确定
          </Button>
          <Button
            style={{ borderRadius: '4px' }}
            size="middle"
            onClick={() => {
              setShow(false), setFodderList([])
            }}
          >
            取消
          </Button>
        </div>
      </Radio.Group>
    </Modal>
  )
}
export default forwardRef(FodderModal)
