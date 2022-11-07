import React, { useEffect, useState, useRef } from 'react'
import { Form, DatePicker, Input, Space, Button, Table, message, Row, Col } from 'antd'
import GiveCouponModal from './components/GiveCouponModal'
import { getstatistics } from '@/services/marketing'
import CouponQueryMinute from '@/components/marketing/CouponQueryMinute'
import { useGetRow } from '@/hooks/useGetRow'
import { getOrgKind, haveCtrlElementRight } from '@/utils/utils'
import FetchSelect from '@/components/FetchSelect'
import api_channel from '@/services/api/channel'

function couponQuery() {
  const [form] = Form.useForm()
  const pageRef = useRef(1)
  const pageSizeRef = useRef(20)
  const giveCouponModalRef = useRef()
  //数据总量
  const [tableListTotalNum, settableListTotalNum] = useState(0)
  //table loding 展示
  const [loading, setloading] = useState(false)
  //详情页面啊是否展示
  const [onlyinit, setonlyinit] = useState(false)
  //主页面是否展示
  const [init, setinit] = useState(true)
  const [tradeList, settradeList] = useState([])
  //onlydata详情页面的数据
  const [onlyData, setonlyData] = useState()

  const columns = [
    {
      dataIndex: 'org_name',
      title: '推广公司',
      align: 'center',
    },
    {
      dataIndex: 'person_code',
      title: '客户ID',
      align: 'center',
    },
    {
      dataIndex: 'user_alias',
      title: '客户昵称',
      align: 'center',
    },
    {
      dataIndex: 'phone_number',
      title: '手机号',
      align: 'center',
    },
    {
      align: 'center',
      title: '可用优惠券数量(张)',
      dataIndex: 'unuesd',
    },
    {
      align: 'center',
      dataIndex: 'uesd',
      title: '已使用优惠券数量(张)',
    },
    {
      align: 'center',
      dataIndex: 'expire',
      title: '已过期优惠券数量(张)',
    },

    {
      align: 'center',
      title: '操作',
      render: (e) => {
        return (
          <div>
            <a
              style={{ cursor: 'pointer' }}
              onClick={() => {
                getTradeInfo_(e)
              }}
            >
              详情
            </a>
          </div>
        )
      },
    },
  ]

  //点击查看详情
  async function getTradeInfo_(e) {
    setonlyData(e)
    setinit(false)
    setonlyinit(true)
  }

  //重置一下
  function resetSearch() {
    form.resetFields()
  }

  //点击改变页数
  useEffect(() => {
    onFinish()
  }, [])

  const onFinish = () => {
    pageRef.current = 1
    getTableList()
  }

  const getTableList = async () => {
    setloading(true)
    let values = form.getFieldsValue()
    values['rows'] = pageSizeRef.current
    values['page'] = pageRef.current

    let res = await getstatistics(values)
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

  //组件回流
  function minute() {
    setonlyinit(false)
    setinit(true)
  }

  //补发优惠券
  const openGiveCouponModal = () => {
    giveCouponModalRef.current?.open()
  }

  return (
    <div>
      {init ? (
        <div className="headBac">
          <div className="head">
            <Form form={form} name="basic" onFinish={onFinish}>
              <div className="flexjss">
                {getOrgKind().isAdmin && (
                  <Form.Item name="orgCode" style={{ width: 220, marginRight: '10px' }}>
                    <FetchSelect
                      placeholder="推广公司"
                      api={api_channel.queryPromotionCompanyList}
                      valueKey="orgCode"
                      textKey="orgName"
                      //搜索
                      showSearch
                      filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    />
                  </Form.Item>
                )}
                <Form.Item name="personCode" style={{ width: 240, marginRight: '10px' }}>
                  <Input placeholder="客户ID" />
                </Form.Item>

                <Form.Item name="personAlias" style={{ width: 240, marginRight: '10px' }}>
                  <Input placeholder="客户昵称" />
                </Form.Item>
                <Form.Item name="phoneNumber" style={{ width: 240, marginRight: '10px' }}>
                  <Input placeholder="手机号" />
                </Form.Item>

                <Button style={{ borderRadius: '4px', marginRight: 10 }} className="buttonNoSize" size="middle" onClick={resetSearch}>
                  重置
                </Button>

                <Button style={{ borderRadius: '4px', marginRight: 10 }} id="coponQueryinit" type="primary" size="middle" htmlType="submit">
                  查询
                </Button>

                {haveCtrlElementRight('khyhq-bufa-btn') && getOrgKind().isCompany && (
                  <Button style={{ borderRadius: '4px', marginRight: 10 }} type="primary" size="middle" onClick={openGiveCouponModal}>
                    补发优惠券
                  </Button>
                )}
              </div>
            </Form>
          </div>

          <div>
            <Table
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
      ) : (
        ''
      )}

      {onlyinit ? <CouponQueryMinute minute={minute} onlyData={onlyData} /> : ''}

      <GiveCouponModal
        onRef={(e) => {
          giveCouponModalRef.current = e
        }}
        onSuccess={() => {
          onFinish()
        }}
      />
    </div>
  )
}

export default couponQuery
