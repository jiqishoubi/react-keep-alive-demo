import React, { useState, useEffect, useCallback } from 'react'
import { Button, Form, Input, Table, Modal, Radio, InputNumber, message } from 'antd'
import { connect } from 'dva'
import { router } from 'umi'
import { useGetRow } from '@/hooks/useGetRow'
import { haveCtrlElementRight } from '@/utils/utils'
import { getProfitConfig } from './service'
import requestw from '@/utils/requestw'

const layout = {
  labelCol: { span: 12 },
  wrapperCol: { span: 16 },
}

const Index = (props) => {
  const [form] = Form.useForm()
  const [deleteForm] = Form.useForm()

  const {
    dispatch,
    spreadCompanyMngModel: { page, pageSize, recordTotalNum, list, deleteShow },
    //loading
    loadingTable,
  } = props

  const [radioShow, setRadioShow] = useState(true)

  useEffect(() => {
    dispatch({ type: 'spreadCompanyMngModel/fetch' })
  }, [])

  /**
   * 查询
   */
  const resetSearch = () => {
    form.resetFields()
  }

  //查询
  const onFinish = (value) => {
    dispatch({
      type: 'spreadCompanyMngModel/qureyData',
      payload: {
        page: 1,
        pageSize: 20,
        searchParams: { ...value },
      },
    })
  }

  //新建按钮点击
  const goAddto = () => {
    dispatch({
      type: 'spreadCompanyMngModel/create',
      payload: {
        revampShow: false,
        show: true,
        bordered: true,
        revampRecord: null,
        newDatas: [],
      },
    })
    goAdd()
  }

  //跳转到修改
  const goRevamp = useCallback((record) => {
    router.push({
      pathname: '/web/system/distributemgr/spreadcompany/detail',
      query: { isEdit: '1', orgCode: record.orgCode },
    })
  }, [])

  //跳转到新建
  const goAdd = useCallback(() => {
    router.push('/web/system/distributemgr/spreadcompany/detail')
  }, [])

  /**
   * 表格
   */

  const onPageChange = (newPage, newPageSize) => {
    dispatch({
      type: 'spreadCompanyMngModel/changePage',
      payload: {
        page: newPage,
        pageSize: newPageSize,
      },
    })
  }

  const columns = [
    {
      title: '编号',
      dataIndex: 'orgCode',
      align: 'center',
    },
    {
      align: 'center',
      dataIndex: 'createDateStr',
      title: '创建时间',
    },
    {
      title: '推广公司名称',
      dataIndex: 'orgName',
      align: 'center',
    },
    {
      title: '商户号',
      dataIndex: 'mchCode',
      align: 'center',
    },
    {
      title: '商户名称',
      dataIndex: 'mchName',
      align: 'center',
    },

    {
      title: '操作',
      align: 'center',
      width: 200,
      render: (e) => {
        return (
          <>
            <a onClick={() => revampClick(e)}>修改</a>
            &nbsp;&nbsp;&nbsp;
            <a onClick={() => deleteClick(e)}>分润</a>
            &nbsp;&nbsp;&nbsp;
            {e.ifMembership === '1' ? <a onClick={() => qrCodeClick(e)}>企业会员码</a> : null}
          </>
        )
      },
    },
  ]

  //详情
  const detailsClick = (e) => {
    dispatch({
      type: 'spreadCompanyMngModel/save',
      payload: {
        orgCode: e.orgCode,
      },
    })
  }
  //修改
  const revampClick = (record) => {
    dispatch({
      type: 'spreadCompanyMngModel/revampData',
      payload: record,
    })

    goRevamp(record)
  }
  //分润点击
  const deleteClick = async (record) => {
    dispatch({
      type: 'spreadCompanyMngModel/save',
      payload: {
        deleteShow: true,
        orgCode: record.orgCode,
      },
    })
    //分润回显
    //处理源数据=>放进form
    setRadioShow(record.saleRewardProfitParamJsonStr ? true : false)
    const formData = { ...record }
    const ifSubmitProfitConfig = record.saleRewardProfitParamJsonStr ? '1' : '0'
    formData.ifSubmitProfitConfig = ifSubmitProfitConfig
    try {
      const jsonObj = JSON.parse(record.saleRewardProfitParamJsonStr)
      formData.distributeChildRewardPct = jsonObj.distributeChildRewardPct
    } catch (e) {}
    //处理源数据=>放进form end
    deleteForm.setFieldsValue(formData)
  }

  //分润确定
  const deleteClickEnsure = async () => {
    const values = await deleteForm.validateFields()
    dispatch({
      type: 'spreadCompanyMngModel/submitProfitConfig',
      payload: {
        ...values,
      },
    })
  }

  //分润取消
  const deleteClicks = () => {
    dispatch({
      type: 'spreadCompanyMngModel/save',
      payload: {
        deleteShow: false,
      },
    })
  }

  //控制分润字段
  const radioChange = (e) => {
    if (e.target.value == '1') {
      setRadioShow(true)
    } else {
      setRadioShow(false)
    }
  }
  //专营点击monopoly
  const qrCodeClick = async (e) => {
    let res = await requestw({
      url: '/web/company/getOrgMembershipQrCode',
      data: { orgCode: e.orgCode },
    })
    if (res && res.code === '0') {
      Modal.confirm({
        title: '企业会员码',
        icon: null,
        content: <img style={{ margin: '20px 20%', width: 200, height: 200 }} src={res.data} alt="" />,
        cancelText: '关闭',
        okText: '下载',
        width: 400,
        height: 400,
        onOk: () => {
          ;((imgsrc, name) => {
            //下载图片地址和图片名
            let image = new Image()
            // 解决跨域 Canvas 污染问题
            image.setAttribute('crossOrigin', 'anonymous')
            image.onload = function () {
              let canvas = document.createElement('canvas')
              canvas.width = image.width
              canvas.height = image.height
              let context = canvas.getContext('2d')
              context.drawImage(image, 0, 0, image.width, image.height)
              let url = canvas.toDataURL('image/png') //得到图片的base64编码数据
              let a = document.createElement('a') // 生成一个a元素
              let event = new MouseEvent('click') // 创建一个单击事件
              a.download = name || 'photo' // 设置图片名称
              a.href = url // 将生成的URL设置为a.href属性
              a.dispatchEvent(event) // 触发a的单击事件
            }
            image.src = imgsrc
          })(res.data, e.personName)
        },
        onCancel() {},
      })
    } else {
      message.warn(res.message || '太阳码生成失败!')
    }
  }

  return (
    <>
      <div className="headBac">
        <Form form={form} name="basic" onFinish={onFinish}>
          <div className="head">
            <div className="flexjss">
              <Form.Item name="orgName" style={{ width: 240, marginRight: '10px' }}>
                <Input placeholder="企业名称" />
              </Form.Item>
              <Form.Item name="merchantCode" style={{ width: 240, marginRight: '10px' }}>
                <Input placeholder="商户号" />
              </Form.Item>
              <Form.Item name="merchantName" style={{ width: 240, marginRight: '10px' }}>
                <Input placeholder="商户名称" />
              </Form.Item>

              <Button style={{ borderRadius: '4px', marginRight: 10 }} className="buttonNoSize" size="middle" onClick={resetSearch}>
                重置
              </Button>

              <Button style={{ borderRadius: '4px', marginRight: 10 }} id="supplierInit" type="primary" size="middle" htmlType="submit">
                查询
              </Button>

              <Button style={{ borderRadius: '4px' }} onClick={goAddto} type="primary" size="middle">
                新建推广公司
              </Button>
            </div>
          </div>
        </Form>

        <Table
          rowClassName={useGetRow}
          style={{ margin: '23px  20px' }}
          rowKey="id"
          columns={columns}
          dataSource={list}
          loading={loadingTable}
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
      </div>

      {deleteShow && (
        <Modal destroyOnClose={true} centered={true} title="分润设置" visible={deleteShow} onCancel={deleteClicks} onOk={deleteClickEnsure} cancelText="取消" okText="确定" bodyStyle={{ height: 400 }}>
          <Form {...layout} form={deleteForm} preserve={false}>
            <Form.Item name="ifSubmitProfitConfig" label="是否配置分润比例" initialValue="1">
              <Radio.Group onChange={radioChange}>
                <Radio value="1">是</Radio>
                <Radio value="0">否</Radio>
              </Radio.Group>
            </Form.Item>

            <div style={{ display: radioShow ? 'block' : 'none' }}>
              <Form.Item label="推广人分润比例(%)" name="distributeChildRewardPct" rules={[{ required: radioShow, message: '请输入推广人分润比例' }]}>
                <InputNumber min={0} width={{ width: '100%' }} />
              </Form.Item>
              <Form.Item label="一级合伙人佣金比例(%)" name="sale1stRewardPct" rules={[{ required: radioShow, message: '请输入一级合伙人佣金比例' }]}>
                <InputNumber min={0} width={{ width: '100%' }} />
              </Form.Item>
              <Form.Item label="二级合伙人佣金比例(%)" name="sale2ndRewardPct" rules={[{ required: radioShow, message: '请输入二级合伙人佣金比例' }]}>
                <InputNumber min={0} width={{ width: '100%' }} />
              </Form.Item>
            </div>
          </Form>
        </Modal>
      )}
    </>
  )
}
export default connect(({ spreadCompanyMngModel, loading }) => {
  return {
    spreadCompanyMngModel,
    loadingTable: loading.effects['spreadCompanyMngModel/fetch'],
  }
})(Index)
