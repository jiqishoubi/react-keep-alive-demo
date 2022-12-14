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

  // ?????? ??????
  deleteGoods(e) {
    this.setState({
      delGoods: true,
      delProductId: e.bannerCode,
    })
  }

  // ????????????????????????
  closedeleteGoodsModals = () => {
    this.setState({
      delGoods: false,
    })
  }

  // ??????????????????
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
      message.success('??????????????????')
      this.Tablew.getData()
    } else {
      message.warning('??????????????????')
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
      message.success('????????????')
      this.setState(
        {
          AddGuanggaoModal: false,
        },
        () => {
          this.Tablew.getData()
        }
      )
    } else {
      message.warning('????????????')
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
            ????????????
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
          // ????????????????????????
          externalplacement={pageTiaojian}
          // ????????????
          querystyle={false}
          isAddGoods={false}
          queryItems={[
            {
              title: '??????',
              key: 'bannerKind',
              type: 'select',
              limitDateRange: 28,
              customOptions: [
                {
                  codeKey: 'ADVERT',
                  codeValue: '????????????',
                },
                {
                  codeKey: 'BANNER',
                  codeValue: 'Banner',
                },
              ],
            },
            {
              title: '??????',
              key: 'disabled',
              type: 'select',
              limitDateRange: 29,
              customOptions: [
                {
                  codeKey: 0,
                  codeValue: '?????????',
                },
                {
                  codeKey: 1,
                  codeValue: '?????????',
                },
              ],
            },
          ]}
          // ??????
          rowKey="id"
          requestType="get"
          queryApi={api_cms.getBannerListPaging()}
          columns={[
            {
              title: '??????',
              key: 'id',
              alent: 'left',
              width: 100,
            },
            {
              title: '??????',
              key: 'bannerKind',
              render: (type) => {
                return <>{type == 'ADVERT' ? <span>????????????</span> : <span>??????banner</span>}</>
              },
            },

            {
              title: '??????',
              key: 'bannerImg',
              width: 350,
              render: (e) => {
                return <img style={{ width: '200px' }} src={e} />
              },
            }, //
            {
              title: '????????????',
              key: 'bannerOrder',
            },
            {
              title: '????????????',
              key: 'createDateStr',
            },
            {
              title: '??????',
              key: 'disabled',
              render: (disabled) => {
                if (disabled == 0) {
                  return <span>?????????</span>
                } else {
                  return <span>?????????</span>
                }
              },
            },
            {
              title: '??????',
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
                      ??????
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
                      ??????
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
          title={isAdd ? '????????????' : '????????????'}
          visible={AddGuanggaoModal}
          closable={false}
          destroyOnClose
          onCancel={this.closeAddGuanggaoModals}
          onOk={this.addGuanggaoModalsOk}
          width={800}
          footer={[
            <Button key="back" style={{ borderRadius: '4px' }} onClick={this.closeAddGuanggaoModals}>
              ??????
            </Button>,
            <Button key="submit" style={{ borderRadius: '4px' }} type="primary" onClick={this.addGuanggaoModalsOk}>
              ??????
            </Button>,
          ]}
        >
          <Form ref={this.formRef} {...formLayout}>
            {isAdd ? null : (
              <Form.Item label="????????????">
                <span>{this.state.bannerCode}</span>
              </Form.Item>
            )}
            <Form.Item label="????????????" name="bannerKind" rules={[{ required: true, message: '?????????????????????' }]}>
              <Select showArrow={true} placeholder="?????????????????????" onChange={this.typeIdChange}>
                <Select.Option value="BANNER">??????banner</Select.Option>
                <Select.Option value="ADVERT">????????????</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="????????????" name="bannerOrder" rules={[{ required: true, message: '?????????????????????' }]}>
              <Input placeholder="?????????????????????" maxLength="10" />
            </Form.Item>

            <Form.Item label="????????????" name="bannerType">
              <Select placeholder="?????????????????????" onChange={this.onGoTypeChange} allowClear>
                {goTypeOptionsList().map((obj, index) => (
                  <Select.Option key={index} value={obj.value} disabled={obj.disabled}>
                    {obj.text}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="????????????" name="bannerContent">
              <SelectItemFromTable
                onRef={(e) => {
                  this.selectItemFromTableRef.current = e
                }}
                {...SelectItemFromTableProps}
              />
            </Form.Item>

            <Form.Item label="??????" name="disabled" rules={[{ required: true, message: '???????????????' }]} initialValue={0}>
              <Radio.Group>
                <Radio value={0}>??????</Radio>
                <Radio value={1}>??????</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item label="????????????" name="bannerImg" rules={[{ required: true, message: '???????????????' }]}>
              <UploadImg length={1} imgupload />
            </Form.Item>
            <div style={{ marginLeft: '100px' }}>????????????1162px*490px?????????????????????5MB?????????jpg???gif???png???jpeg???????????????</div>
          </Form>
        </Modal>
        <Modal
          title="??????"
          visible={delGoods}
          closable={false}
          onCancel={this.closedeleteGoodsModals}
          onOk={this.deleteGoodsModalsOk}
          footer={[
            <Button style={{ borderRadius: '4px' }} key="back" onClick={this.closedeleteGoodsModals}>
              ??????
            </Button>,
            <Button style={{ borderRadius: '4px' }} key="submit" type="primary" loading={deleteBtnloader} onClick={this.deleteGoodsModalsOk}>
              ??????
            </Button>,
          ]}
        >
          <div>??????????????????????????????</div>
        </Modal>
      </div>
    )
  }
}

export default goodsManage
