import React, { useRef, useState } from 'react'
import { connect } from 'dva'
import moment from 'moment'
import SublimeVideo from 'react-sublime-video'
import { pathimgHeader, pathVideoHeader, localDB, haveCtrlElementRight } from '@/utils/utils'
import { Button, Radio, Modal, message, Input, Switch, Form, Select } from 'antd'
import requestw from '@/utils/requestw'
import api_cms from '@/services/api/cms'
import Tablew from '@/components/Tablew'
import UploadImg from '@/components/T-UploadImg'
import { CaretDownOutlined } from '@ant-design/icons'
import { getSelectItemFromTableProps, goTypeOptionsList } from '@/pages/miniapp/Editor/utils_editor'
import SelectItemFromTable from '@/components/SelectItemFromTable'

const label = 4
const total = 23

const formLayout = {
  labelCol: { span: label },
  wrapperCol: { span: total - label },
}

const formLayoutTail = {
  wrapperCol: { offset: label, span: total - label },
}

class goodsManage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      productStatusValue: '',
      upType: '',
      upOrDown: false,
      productId: '',
      delGoods: false,
      teamId: localDB.getItem('teamId'),
      isSwitch: false,
      FenModals: false,
      account: '',
      account1: '',
      AddGuanggaoModal: false,
      isAdd: false,
      bannerCode: '',
      deleteBtnloader: false,
      bianjiCode: {},
      goTypeState: undefined,
      SelectItemFromTableProps: [],
    }
    this.formRef = React.createRef()
    this.selectItemFromTableRef = React.createRef()
  }

  componentDidMount() {
    this.Tablew.getData()
  }

  getInfo = async (record) => {
    let newDataObjs = record
    newDataObjs.bannerImg = [
      {
        uid: 0,
        name: newDataObjs.bannerImg,
        status: 'done',
        url: newDataObjs.bannerImg,
      },
    ]
    setTimeout(() => {
      this.formRef.current.setFieldsValue(newDataObjs)
    }, 100)
  }

  recordEdit(record) {
    this.setState(
      {
        AddGuanggaoModal: true,
        isAdd: false,
        bannerCode: record.bannerCode,
        bianjiCode: record.bannerCode,
      },
      () => {
        this.getInfo(record)
      }
    )
  }

  addGoods = () => {
    this.setState({
      AddGuanggaoModal: true,
      isAdd: true,
    })
  }

  // 删除 商品
  deleteGoods(e) {
    this.setState({
      delGoods: true,
      delProductId: e.bannerCode,
    })
  }

  // 关闭删除商品弹框
  closedeleteGoodsModals = () => {
    this.setState({
      delGoods: false,
    })
  }

  // 删除商品接口
  deleteGoodsModalsOk = async () => {
    const postdata = {
      bannerCode: this.state.delProductId,
    }
    this.setState({
      deleteBtnloader: true,
    })
    const res = await requestw({
      url: api_cms.deleteBanner(),
      data: postdata,
    })
    this.setState({
      deleteBtnloader: false,
    })
    this.setState({ delGoods: false }) // haode
    if (res && res.code == 0) {
      message.success('删除广告成功')
      this.Tablew.getData()
    } else {
      message.warning('删除广告失败')
    }
  }

  addGuanggaoModalsOk = async () => {
    const { isAdd } = this.state
    const values = await this.formRef.current.validateFields()
    values.bannerImg = values.bannerImg.map((item) => {
      return item.url
    })
    values.bannerImg = values.bannerImg.toString()

    let res
    if (isAdd) {
      res = await requestw({
        url: api_cms.createBanner(),
        data: values,
      })
    } else {
      values.bannerCode = this.state.bianjiCode
      res = await requestw({
        url: api_cms.updateBanner(),
        data: values,
      })
    }
    if (res && res.code == '0') {
      message.success('操作成功')
      this.setState(
        {
          AddGuanggaoModal: false,
        },
        () => {
          this.Tablew.getData()
        }
      )
    } else {
      message.warning('操作失败')
    }
  }

  closeAddGuanggaoModals = () => {
    this.setState(
      {
        AddGuanggaoModal: false,
      },
      () => {
        this.Tablew.getData()
      }
    )
  }

  onGoTypeChange = (val) => {
    this.setState({
      goTypeState: val,
    })
    this.selectItemFromTableRef.current?.resetVal()
  }

  render() {
    const { goodsStatus, productStatusValue, upOrDown, delGoods, isSwitch, FenModals, AddGuanggaoModal, isAdd, bannerCode, deleteBtnloader, goTypeState } = this.state

    const pageTiaojian = (
      <>
        {haveCtrlElementRight('ggwgl-add-btn') ? (
          <Button type="primary" style={{ marginRight: '10px', borderRadius: '4px', marginTop: -20 }} onClick={this.addGoods}>
            添加广告
          </Button>
        ) : (
          ''
        )}
      </>
    )

    const SelectItemFromTableProps = getSelectItemFromTableProps(goTypeState)

    return (
      <div style={{ marginTop: -10 }}>
        <Tablew
          onRef={(c) => {
            this.Tablew = c
          }}
          // 外部添加查询条件
          externalplacement={pageTiaojian}
          // 查询条件
          querystyle={false}
          isAddGoods={false}
          queryItems={[
            {
              title: '类型',
              key: 'bannerKind',
              type: 'select',
              limitDateRange: 28,
              customOptions: [
                {
                  codeKey: 'ADVERT',
                  codeValue: '首页腰封',
                },
                {
                  codeKey: 'BANNER',
                  codeValue: 'Banner',
                },
              ],
            },
            {
              title: '状态',
              key: 'disabled',
              type: 'select',
              limitDateRange: 29,
              customOptions: [
                {
                  codeKey: 0,
                  codeValue: '已启用',
                },
                {
                  codeKey: 1,
                  codeValue: '已禁用',
                },
              ],
            },
          ]}
          // 表格
          rowKey="id"
          requestType="get"
          queryApi={api_cms.getBannerListPaging()}
          columns={[
            {
              title: '编号',
              key: 'id',
              alent: 'left',
              width: 100,
            },
            {
              title: '分类',
              key: 'bannerKind',
              render: (type) => {
                return <>{type == 'ADVERT' ? <span>首页腰封</span> : <span>首页banner</span>}</>
              },
            },

            {
              title: '图片',
              key: 'bannerImg',
              width: 350,
              render: (e) => {
                return <img style={{ width: '200px' }} src={e} />
              },
            }, //
            {
              title: '显示排序',
              key: 'bannerOrder',
            },
            {
              title: '创建时间',
              key: 'createDateStr',
            },
            {
              title: '状态',
              key: 'disabled',
              render: (disabled) => {
                if (disabled == 0) {
                  return <span>已启用</span>
                } else {
                  return <span>已禁用</span>
                }
              },
            },
            {
              title: '操作',
              key: '',
              render: (record) => (
                <>
                  {record.status == 2 || record.status == 9 ? null : haveCtrlElementRight('ggwgl-edit-btn') ? (
                    <a
                      style={{ marginRight: '5px' }}
                      onClick={() => {
                        this.recordEdit(record)
                      }}
                    >
                      编辑
                    </a>
                  ) : (
                    ''
                  )}
                  {record.status == 9 || record.status == 2 ? null : haveCtrlElementRight('ggwgl-del-btn') ? (
                    <a
                      style={{ marginRight: '5px' }}
                      onClick={() => {
                        this.deleteGoods(record)
                      }}
                    >
                      删除
                    </a>
                  ) : (
                    ''
                  )}
                </>
              ),
            },
          ]}
        />
        <Modal
          title={isAdd ? '添加广告' : '修改广告'}
          visible={AddGuanggaoModal}
          closable={false}
          destroyOnClose
          onCancel={this.closeAddGuanggaoModals}
          onOk={this.addGuanggaoModalsOk}
          width={800}
          footer={[
            <Button key="back" style={{ borderRadius: '4px' }} onClick={this.closeAddGuanggaoModals}>
              取消
            </Button>,
            <Button key="submit" style={{ borderRadius: '4px' }} type="primary" onClick={this.addGuanggaoModalsOk}>
              确定
            </Button>,
          ]}
        >
          <Form ref={this.formRef} {...formLayout}>
            {isAdd ? null : (
              <Form.Item label="广告编号">
                <span>{this.state.bannerCode}</span>
              </Form.Item>
            )}
            <Form.Item label="所属分类" name="bannerKind" rules={[{ required: true, message: '请选择所属分类' }]}>
              <Select showArrow={true} placeholder="请选择所属分类" onChange={this.typeIdChange}>
                <Select.Option value="BANNER">首页banner</Select.Option>
                <Select.Option value="ADVERT">首页腰封</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="显示排序" name="bannerOrder" rules={[{ required: true, message: '请输入显示排序' }]}>
              <Input placeholder="数值越大越靠前" maxLength="10" />
            </Form.Item>

            <Form.Item label="跳转类型" name="bannerType">
              <Select placeholder="请选择跳转类型" onChange={this.onGoTypeChange} allowClear>
                {goTypeOptionsList().map((obj, index) => (
                  <Select.Option key={index} value={obj.value} disabled={obj.disabled}>
                    {obj.text}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="跳转地址" name="bannerContent">
              <SelectItemFromTable
                onRef={(e) => {
                  this.selectItemFromTableRef.current = e
                }}
                {...SelectItemFromTableProps}
              />
            </Form.Item>

            <Form.Item label="状态" name="disabled" rules={[{ required: true, message: '请选择状态' }]} initialValue={0}>
              <Radio.Group>
                <Radio value={0}>启用</Radio>
                <Radio value={1}>禁用</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item label="商品图片" name="bannerImg" rules={[{ required: true, message: '请上传图片' }]}>
              <UploadImg length={1} imgupload />
            </Form.Item>
            <div style={{ marginLeft: '100px' }}>图片大小1162px*490px，图片大小小于5MB，支持jpg，gif，png，jpeg格式的图片</div>
          </Form>
        </Modal>
        <Modal
          title="删除"
          visible={delGoods}
          closable={false}
          onCancel={this.closedeleteGoodsModals}
          onOk={this.deleteGoodsModalsOk}
          footer={[
            <Button style={{ borderRadius: '4px' }} key="back" onClick={this.closedeleteGoodsModals}>
              取消
            </Button>,
            <Button style={{ borderRadius: '4px' }} key="submit" type="primary" loading={deleteBtnloader} onClick={this.deleteGoodsModalsOk}>
              确定
            </Button>,
          ]}
        >
          <div>确定要删除该广告么？</div>
        </Modal>
      </div>
    )
  }
}

export default goodsManage
