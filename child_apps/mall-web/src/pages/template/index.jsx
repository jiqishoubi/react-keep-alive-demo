import React, { useRef, useState, useEffect } from 'react'
import moment from 'moment'
import { router } from 'umi'
import { Form, DatePicker, Input, Select, Row, Col, Button, Table, Modal, message, Spin } from 'antd'
import { useRequest } from 'ahooks'
import ShowItemList from '@/pages/miniapp/Editor/components/ShowItemList'
import { queryListAjax, deleteTemplateDataAjax, supplierSelfQueryListAjax, supplierQueryListAjax } from './services'
import api_common from '@/services/api/common'
import styles from './index.less'
import { getMainAppGlobalData } from '@/utils/aboutMicroApp'
import requestw from '@/utils/requestw'

const { RangePicker } = DatePicker
const { Option } = Select

const Index = (props) => {
  const defaultParams = {
    page: 1,
    rows: 200,
  }
  const [type, settype] = useState(props?.type || 'admin')

  var ajax = () => {
    if (type == 'market') {
      return supplierQueryListAjax
    } else if (props?.type == 'mine') {
      return supplierSelfQueryListAjax
    } else {
      return queryListAjax
    }
  }
  const {
    data: tableData,
    loading: loading_table,
    run: run_table,
  } = useRequest(ajax(), {
    initialData: [],
    defaultParams,
    formatResult: (res) => {
      return res?.data?.data || []
    },
  })

  /**
   * 方法
   */

  //点击新增
  function clickAdd() {
    router.push({
      pathname: '/diy/editorUsed',
      query: {
        type: props?.type ? 'company' : 'admin',
        isAdd: '1',
      },
    })
  }

  function copy(record) {
    router.push({
      pathname: '/diy/editorUsed',
      query: {
        // type: 'admin',
        type: props?.type ? 'company' : 'admin',
        isAdd: '1',
        isUse: '1',
        id: record.id,
      },
    })
  }

  //点击编辑
  function clickEdit(record) {
    router.push({
      pathname: '/diy/editorUsed',
      query: {
        // type: 'admin',
        type: props?.type ? 'company' : 'admin',
        isAdd: '0',
        id: record.id,
      },
    })
  }

  //点击删除
  function clickDelete(record) {
    Modal.confirm({
      title: '提示',
      content: '确认删除？',
      onOk() {
        return new Promise(async (resolve) => {
          const res = await deleteTemplateDataAjax({
            id: record.id,
          })
          // message.success('操作成功')
          run_table(defaultParams)
          resolve()
        }).catch(() => console.log('Oops errors!'))
      },
      onCancel() {},
    })
  }

  // 供应商点击删除
  function supplierClickDelete(record) {
    Modal.confirm({
      title: '提示',
      content: '确认删除？',
      onOk() {
        return requestw({
          url: '/web/supplier/uiTemplateData/deleteTemplateData',
          data: { id: record.id },
          isNeedCheckResponse: true,
          errMsg: true,
        }).then((data) => {
          message.success('操作成功')
          run_table(defaultParams)
        })
      },
      onCancel() {},
    })
  }

  /**
   * 渲染
   */
  return (
    <div className="headBac">
      <div className="positionre" style={{ marginLeft: '20px' }}>
        <Form name="basic" style={{ border: '1px solid #FEFFFE' }}>
          <div style={{ marginTop: '23px' }}>
            <Row gutter={[15, 22]} justify="start">
              <Col>
                {type != 'market' && (
                  <Button style={{ borderRadius: 8 }} type="primary" size="middle" onClick={clickAdd}>
                    新建
                  </Button>
                )}
              </Col>
            </Row>
          </div>
        </Form>
      </div>

      {/* 表格 */}

      {loading_table ? (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <Spin />
        </div>
      ) : (
        <div className={styles.template_wrap}>
          {tableData && tableData.length > 0 ? (
            tableData.map((template, index) => {
              let templateData = {
                pageConfig: {},
                itemList: [],
              }
              try {
                templateData = { ...JSON.parse(template.templateData || {}) }
              } catch (e) {}

              return (
                <div key={index} className={styles.template_item}>
                  <div className={styles.template_item_title}>{template.templateDataName || ''}</div>
                  <div className={styles.template_box}>
                    <ShowItemList templateData={templateData} />
                  </div>
                  {/* 操作 */}
                  <div className={styles.template_item_ctrl}>
                    {type == 'admin' && (
                      <Row gutter={7}>
                        <Col>
                          <Button
                            size="small"
                            onClick={() => {
                              clickEdit(template)
                            }}
                          >
                            编辑
                          </Button>
                        </Col>
                        <Col>
                          <Button
                            size="small"
                            onClick={() => {
                              clickDelete(template)
                            }}
                          >
                            删除
                          </Button>
                        </Col>
                      </Row>
                    )}
                    {type == 'market' && (
                      <Row gutter={7}>
                        <Col>
                          <Button
                            size="small"
                            onClick={() => {
                              copy(template)
                            }}
                          >
                            添加到我的模板
                          </Button>
                        </Col>
                      </Row>
                    )}
                    {type == 'mine' && (
                      <Row gutter={7}>
                        <Col>
                          <Button
                            size="small"
                            onClick={() => {
                              copy(template)
                            }}
                          >
                            复制
                          </Button>
                        </Col>
                        <Col>
                          <Button
                            size="small"
                            onClick={() => {
                              clickEdit(template)
                            }}
                          >
                            编辑
                          </Button>
                        </Col>
                        <Col>
                          <Button
                            size="small"
                            onClick={() => {
                              supplierClickDelete(template)
                            }}
                          >
                            删除
                          </Button>
                        </Col>
                      </Row>
                    )}
                  </div>
                </div>
              )
            })
          ) : (
            <div style={{ width: '100%', textAlign: 'center', padding: '20px 0' }}>暂无数据</div>
          )}
        </div>
      )}
    </div>
  )
}

export default Index
