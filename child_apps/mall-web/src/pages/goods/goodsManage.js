import React, { Fragment } from 'react'
import router from 'umi/router'
import { Modal, message, Input, Switch } from 'antd'
import Tablew from '@/components/Tablew'
import { pathimgHeader, localDB, keepAlivePage, getOrgKind } from '@/utils/utils'
import requestw from '@/utils/requestw'
import api_goods from '@/services/api/goods'
import api_channel from '@/services/api/channel'
import styles from './index.less'
import { getSysCodeByParam } from '@/services/common'

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
      goodsTypeData: [],
    }
    this.goodsDrawer = React.createRef()
  }

  componentDidMount() {
    setTimeout(() => {
      if (this.Tablew) {
        //保存的 page
        let options = {}
        let alivePage = keepAlivePage.get()
        keepAlivePage.delete()
        if (alivePage && alivePage.page) options.page = alivePage.page
        //保存的 page end

        this.Tablew.getData(options)
      }
    }, 50)
    //订单类型
    this.getSysCodeByParam_('GOODS_TAG').then((res) => {
      if (res && res.code === '0') {
        this.setState({
          goodsTypeData: res.data,
        })
      }
    })
  }

  componentWillReceiveProps(nextProps) {
    setTimeout(() => {
      if (this.Tablew) {
        //保存的 page
        let options = {}
        let alivePage = keepAlivePage.get()
        keepAlivePage.delete()
        if (alivePage && alivePage.page) options.page = alivePage.page
        //保存的 page end

        this.Tablew.getData(options)
      }
    }, 50)
    //订单类型
    this.getSysCodeByParam_('GOODS_TAG').then((res) => {
      if (res && res.code === '0') {
        this.setState({
          goodsTypeData: res.data,
        })
      }
    })
  }

  //编辑和查看商品
  recordEdit(record, show) {
    //保存 page
    let tableInfo = this.Tablew.getTableCurInfo()
    keepAlivePage.set({
      page: tableInfo.page,
    })

    router.push({
      pathname: '/web/company/goodsmgr/goodsDetail',
      query: {
        ...record,
        show,
      },
    })
  }

  // 调用编码方法
  getSysCodeByParam_ = async (codeParam, inCode, notCode) => {
    let cs = {
      codeParam,
      inCode,
      notCode,
    }
    return await getSysCodeByParam(cs)
  }

  //添加商品
  addGoods = () => {
    router.push({
      pathname: '/web/company/goodsmgr/goodsDetail',
    })
  }

  onRadioChange = (e) => {
    const getCode = e.target.value
    this.setState(
      {
        status: getCode,
      },
      () => {
        this.Tablew.getData()
      }
    )
  }

  // 上架下架
  upOrDownMethod = (e) => {
    if (e.status === 2) {
      this.setState({
        productStatusValue: '下架',
        upType: '3',
      })
    } else {
      this.setState({
        productStatusValue: '上架',
        upType: '2',
      })
    }

    this.setState({ upOrDown: true, productId: e.goodsCode })
  }

  closeAddressModals = () => {
    this.setState({
      upOrDown: false,
    })
  }

  addressModalsOk = async () => {
    const { productId, upType } = this.state
    const postdata = {
      goodsCode: productId,
      status: upType,
    }
    const res = await requestw({
      type: 'get',
      url: api_goods.updateGoodsStatus(),
      data: postdata,
    })
    this.setState({
      upOrDown: false,
    })
    if (res && res.code == 0) {
      if (upType == '2') {
        message.success('上架成功')
        this.Tablew.getData()
      } else {
        message.success('下架成功')
        this.Tablew.getData()
      }
    } else {
      message.warning(res.message || '操作商品失败')
    }
  }

  // 删除 商品
  deleteGoods(e) {
    this.setState({
      delGoods: true,
      delProductId: e.goodsCode,
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
      goodsCode: this.state.delProductId,
    }
    const res = await requestw({
      url: api_goods.deleteGoods(),
      data: postdata,
    })
    this.setState({ delGoods: false }) // haode
    if (res && res.code == 0) {
      message.success('删除商品成功')
      this.Tablew.getData()
    } else {
      message.warning('删除商品失败')
    }
  }

  onSwitchChange = () => {
    let { isSwitch } = this.state
    this.setState({
      isSwitch: !isSwitch,
    })
  }

  setFenModals = async (e) => {
    let res = await requestw({
      url: '/web/goodsLevel/queryDatas',
      data: {
        goodsId: e.productId,
        teamId: this.state.teamId,
      },
    })
    if (res && res.code == 200) {
      if (res.data.length != 0) {
        if (res.data[0].useType == 0) {
          this.setState({
            isSwitch: true,
          })
        } else {
          this.setState({
            isSwitch: false,
          })
        }
      }
      if (res.data.length > 1) {
        this.setState({
          account: res.data[0].account,
          account1: res.data[1].account,
          fenList: res.data,
        })
      }
    }

    this.setState({
      FenModals: true,
      fenGoodsId: e.productId,
    })
  }

  closeFenModals = () => {
    this.setState({
      FenModals: false,
      account: '',
      account1: '',
    })
  }

  openFenModalsOk = async () => {
    let { fenGoodsId, teamId, isSwitch, fenList } = this.state
    let account1 = this.state.account
    let account2 = this.state.account1
    let postdata = [
      {
        account: account1,
        goodsId: fenGoodsId,
        level: 1,
        teamId: teamId,
        useType: isSwitch ? 0 : 1,
      },
      {
        account: account2,
        goodsId: fenGoodsId,
        level: 2,
        teamId: teamId,
        useType: isSwitch ? 0 : 1,
      },
    ]
    if (fenList) {
      postdata[0].id = fenList[0].id
      postdata[1].id = fenList[1].id
    }

    // account1 = ''
    // account1 = ''
    let res = await requestw({
      url: api_goods.goodsLevelCreateOrUpdate,
      type: 'formdata',
      data: postdata,
    })
    if (res && res.code == 200) {
      message.success('修改商品分润成功')
      this.setState({
        FenModals: false,
      })
    } else {
      message.warning(res.message)
    }
  }

  keyupEvent = (e, ipt) => {
    e.target.value = e.target.value.replace(/[^\d.]/g, '')
    e.target.value = e.target.value.replace(/\.{2,}/g, '.')
    e.target.value = e.target.value.replace(/^\./g, '0.')
    e.target.value = e.target.value.replace(/^\d*\.\d*\./g, e.target.value.substring(0, e.target.value.length - 1))
    e.target.value = e.target.value.replace(/^0[^\.]+/g, '0')
    e.target.value = e.target.value.replace(/^(\d+)\.(\d\d).*$/, '$1.$2')
    if (ipt == '1') {
      this.setState({
        account: e.target.value,
      })
    } else {
      this.setState({
        account1: e.target.value,
      })
    }
  }

  render() {
    const { goodsStatus, productStatusValue, upOrDown, delGoods, isSwitch, FenModals, goodsTypeData } = this.state
    return (
      <div>
        <Tablew
          rowSelection={true}
          rowKey="goodsCode"
          onRef={(c) => {
            this.Tablew = c
          }}
          querystyle={true}
          grouping={true}
          queryItems={[
            getOrgKind().isAdmin
              ? {
                  type: 'fetchselect',
                  key: 'orgCode',
                  props: {
                    placeholder: '推广公司',
                    api: api_channel.queryPromotionCompanyList,
                    valueKey: 'orgCode',
                    textKey: 'orgName',
                    //搜索
                    showSearch: true,
                    filterOption: (input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0,
                  },
                }
              : null,
            {
              type: 'fetchselect',
              key: 'supplierOrgCode',
              props: {
                placeholder: '供应商',
                api: getOrgKind().isAdmin ? '/web/admin/supplier/getList' : '/web/staff/supplier/getList',
                valueKey: 'orgCode',
                textKey: 'orgName',
                //搜索
                showSearch: true,
                filterOption: (input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0,
              },
            },
            {
              type: 'select',
              key: 'goodsTags',
              props: {
                placeholder: '商品标签',
                allowClear: true,
                mode: 'multiple',
                filterOption: (input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0,
              },
              customOptions: goodsTypeData,
            },

            {
              title: '商品名称',
              key: 'goodsName',
              type: '',
              limitDateRange: 28,
            },
            {
              title: '商品编码',
              key: 'goodsCode',
              type: '',
              limitDateRange: 28,
            },
            {
              title: '状态',
              key: 'status',
              type: 'select',
              customOptions: [
                {
                  codeKey: '0',
                  codeValue: '待上架',
                },
                {
                  codeKey: '2',
                  codeValue: '已上架',
                },
                {
                  codeKey: '3',
                  codeValue: '已下架',
                },
              ],
            },
          ]}
          postdates={{
            teamId: this.state.teamId,
            productType: 'SELF_SUPPORT_GOODS',
          }}
          restype={goodsStatus}
          retType="get"
          // 表格
          isAddGoods={true}
          queryApi={api_goods.getGoodsList()}
          columns={[
            {
              title: '商品信息',
              alent: 'left',
              width: 300,
              render: (v) => {
                return (
                  <>
                    <div className="flexai">
                      <img
                        style={{
                          width: '80px',
                          height: '80px',
                          marginRight: '10px',
                        }}
                        src={v.goodsImg.split(',')[0].indexOf('http') > -1 ? v.goodsImg.split(',')[0] : pathimgHeader + v.goodsImg.split(',')[0]}
                      />
                      <div>{v.goodsName}</div>
                    </div>
                  </>
                )
              },
            },
            {
              title: '商品价格',
              width: 100,
              render: (v) => {
                return (
                  <>
                    <div>
                      {v.maxSalePrice == v.minSalePrice ? (
                        <>{(v.maxSalePrice / 100).toFixed(2) + '元'}</>
                      ) : (
                        <>
                          {(v.minSalePrice / 100).toFixed(2) + '元'}-{(v.maxSalePrice / 100).toFixed(2) + '元'}
                        </>
                      )}
                    </div>
                  </>
                )
              },
            },
            {
              title: '商品编码',
              key: 'goodsCode',
              width: 150,
            },
            {
              title: '创建时间',
              key: 'createDateStr',
              width: 150,
            },
            {
              title: '推广公司',
              key: 'orgName',
              width: 100,
              isCompany: true,
            },
            {
              title: '供应商',
              key: 'supplierOrgName',
              width: 100,
            },
            {
              title: '供应商商品状态',
              key: 'supplierStatusName',
              width: 160,
            },
            {
              title: '一级类目',
              key: 'firstGroupName',
              width: 160,
            },
            {
              title: '二级类目',
              key: 'secondGroupName',
              width: 160,
            },
            {
              title: '状态',
              width: 80,
              key: 'status',
              render: (status) => {
                if (status == 0) {
                  return <span>待上架</span>
                }
                if (status == 2) {
                  return <span>已上架</span>
                }
                if (status == 3) {
                  return <span>已下架</span>
                }
                if (status == 9) {
                  return <span>已删除</span>
                }
              },
            },
            {
              title: '操作',
              key: '',
              width: 200,
              fixed: 'right',
              render: (record) => (
                <>
                  <a
                    style={{ marginRight: '5px' }}
                    onClick={() => {
                      this.recordEdit(record, false)
                    }}
                  >
                    编辑
                  </a>

                  <a
                    style={{ marginRight: '5px' }}
                    onClick={() => {
                      this.recordEdit(record, true)
                    }}
                  >
                    复制
                  </a>

                  {record.status == 2 ? (
                    <a
                      style={{ marginRight: '5px' }}
                      onClick={() => {
                        this.upOrDownMethod(record, 2)
                      }}
                    >
                      下架
                    </a>
                  ) : null}

                  {record.status == 3 || record.status == 0 ? (
                    <a
                      style={{ marginRight: '5px' }}
                      onClick={() => {
                        this.upOrDownMethod(record, 3)
                      }}
                    >
                      上架
                    </a>
                  ) : null}

                  {record.status == 9 || record.status == 2 ? null : (
                    <a
                      style={{ marginRight: '5px' }}
                      onClick={() => {
                        this.deleteGoods(record)
                      }}
                    >
                      删除
                    </a>
                  )}
                </>
              ),
            },
          ]}
        />

        <Modal title="商品操作" visible={upOrDown} closable={false} onCancel={this.closeAddressModals} cancelText="取消" okText="确定" onOk={this.addressModalsOk}>
          <div>是否{productStatusValue}该商品？</div>
        </Modal>

        <Modal title="退单" visible={delGoods} closable={false} onCancel={this.closedeleteGoodsModals} cancelText="取消" okText="确定" onOk={this.deleteGoodsModalsOk}>
          <div>确定要删除该商品么？</div>
        </Modal>

        <Modal destroyOnClose={true} title="分润比例" visible={FenModals} closable={false} onCancel={this.closeFenModals} cancelText="取消" okText="确定" onOk={this.openFenModalsOk}>
          <div style={{ width: '100%', height: '150px' }}>
            <div className={styles.Fenleft}>
              <div style={{ width: '100%' }}>
                一级销售：{' '}
                <Input
                  onChange={(e) => {
                    this.keyupEvent(e, '1')
                  }}
                  value={this.state.account}
                  style={{ width: '150px' }}
                />{' '}
                {isSwitch ? <span>元</span> : <span>%</span>}
              </div>
              <div style={{ width: '100%', marginTop: '20px' }}>
                二级销售：{' '}
                <Input
                  onChange={(e) => {
                    this.keyupEvent(e, '2')
                  }}
                  value={this.state.account1}
                  style={{ width: '150px' }}
                />{' '}
                {isSwitch ? <span style={{ marginRight: '3px' }}>元</span> : <span>%</span>}
              </div>
            </div>
            <div className={styles.Fenright}>
              <p style={{ marginBottom: '20px' }}>请选择分润方法</p>
              <span style={{ marginRight: '5px' }}>百分比</span>
              <Switch defaultChecked={isSwitch} onChange={this.onSwitchChange} />
              <span style={{ margingLeft: '5px' }}>金额</span>
            </div>
          </div>
        </Modal>
      </div>
    )
  }
}

export default goodsManage
