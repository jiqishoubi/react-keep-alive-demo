import React, { useRef } from 'react'
import moment from 'moment'
import { router } from 'umi'
import { Form, DatePicker, Input, Select, Row, Col, Button, Table, Modal, message, Spin } from 'antd'
import { useRequest } from 'ahooks'
import ShowItemList from '@/pages/miniapp/Editor/components/ShowItemList'
import { queryListAjax } from './services'
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

  //点击去装修
  function clickGoDecorate() {
    router.push({
      pathname: '/diy/editorUsed',
      query: {
        type: 'company',
        isAdd: '1',
      },
    })
  }

  //点击使用
  function clickUse(record) {
    router.push({
      pathname: '/diy/editorUsed',
      query: {
        type: 'company',
        isAdd: '1',
        isUse: '1',
        id: record.id,
      },
    })
  }

  /**
   * 渲染
   */

  return (
    <div className="headBac">
      {/* <div className="positionre" style={{ marginLeft: '20px' }}>
        <Form name="basic" style={{ border: '1px solid #FEFFFE' }}>
          <div style={{ marginTop: '23px' }}>
            <Row gutter={[15, 22]} justify="start">
              <Col>
                <Button
                  style={{ borderRadius: 8 }}
                  type="primary"
                  size="middle"
                  onClick={clickGoDecorate}
                >
                  去装修
                </Button>
              </Col>
            </Row>
          </div>
        </Form>
      </div> */}

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
                        clickUse(template)
                      }}
                    >
                      使用模板
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
