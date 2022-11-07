import React, { useRef } from 'react'
import moment from 'moment'
import { router } from 'umi'
import { Form, DatePicker, Input, Select, Row, Col, Button, Table, Modal, message, Spin } from 'antd'
import { useRequest } from 'ahooks'
import ShowItemList from '@/pages/miniapp/Editor/components/ShowItemList'
import { queryListAjax, deleteTemplateDataAjax } from './services'
import api_common from '@/services/api/common'
import styles from './index.less'

const { RangePicker } = DatePicker
const { Option } = Select

const Index = () => {
  /**
   * 请求
   */

  //获取表格
  const defaultParams = {
    page: 1,
    rows: 200,
  }
  const {
    data: tableData,
    loading: loading_table,
    run: run_table,
  } = useRequest(queryListAjax, {
    initialData: [],
    defaultParams,
    formatResult: (res) => {
      let arr = []
      if (res && res.code == '0' && res.data && res.data.data) {
        arr = res.data.data
      }
      return arr
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
        type: 'admin',
        isAdd: '1',
      },
    })
  }

  //点击编辑
  function clickEdit(record) {
    router.push({
      pathname: '/diy/editorUsed',
      query: {
        type: 'admin',
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
          if (!res || res.code !== '0') {
            message.warning((res && res.message) || '网络异常')
            return resolve()
          }
          message.success('操作成功')
          run_table(defaultParams)
          resolve()
        }).catch(() => console.log('Oops errors!'))
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
                <Button style={{ borderRadius: 8 }} type="primary" size="middle" onClick={clickAdd}>
                  新建
                </Button>
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
                    <Button
                      size="small"
                      onClick={() => {
                        clickEdit(template)
                      }}
                    >
                      编辑
                    </Button>
                    <Button
                      size="small"
                      style={{ marginLeft: 8 }}
                      onClick={() => {
                        clickDelete(template)
                      }}
                    >
                      删除
                    </Button>
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
