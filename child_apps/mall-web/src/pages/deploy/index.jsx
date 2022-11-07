import React, { useEffect, useRef, useState } from 'react'
import { Button, Col, Form, Input, message, Modal, Row, Select, Table, Tree } from 'antd'
import { router } from 'umi'
import requestw from '@/utils/requestw'
import request from '@/utils/request'
const Index = () => {
  const { Option } = Select
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [appIdData, setAppIdData] = useState([])
  const typeArray = [
    {
      type: 'A',
      name: '稳定版',
      path: '/root/nginx/html/saas-auto/file/mp-weixin',
    },
  ]
  const postData = {
    key: '',
    version: '',
    desc: '',
  }

  const getAppid = async () => {
    const res = await requestw({
      url: '/web/admin/company/search',
      data: {
        page: 1,
        rows: 9999,
      },
    })
    if (res && res.code === '0' && res.data.data && res.data.data.length) {
      let viceData = []
      res.data.data.map((e) => {
        if (e.weCharAppId && e.shareName) {
          viceData.push(e)
        }
      })
      setAppIdData(viceData)
    }
  }

  useEffect(() => {
    getAppid()
  }, [])
  const deployClick = async () => {
    setLoading(true)
    let values = form.getFieldsValue()
    let index = typeArray.findIndex((r) => r.type == values.project)
    values.project = typeArray[index].path
    values['desc'] = typeArray[index].name + ' 备注:' + values.desc
    values['key'] = `/root/nginx/html/saas-auto/key/${values.appId}.key`
    values['type'] = 'miniProgram'
    values['version'] = values.version
    let res = await request('https://saas-auto.bld365.com/deploy', {
      method: 'post',
      data: values,
    })

    if (res && res.code == 200) {
      message.success('发布成功')
    } else {
      message.warn('发布失败')
    }

    setLoading(false)
  }

  return (
    <>
      <div className="headBac">
        <Form form={form} style={{ margin: '40px 0' }} labelCol={{ span: 8 }} wrapperCol={{ span: 8 }}>
          <Form.Item label="小程序版本" rules={[{ required: true, message: '请选择小程序版本' }]} name="project">
            <Select>
              <Option value="A">稳定版本</Option>
            </Select>
          </Form.Item>
          <Form.Item label="小程序appId" rules={[{ required: true, message: '请输入小程序appId' }]} name="appId">
            <Select>
              {appIdData.map((r) => {
                return (
                  <Select.Option key={r.orgCode} value={r.weCharAppId}>
                    {r.shareName}
                  </Select.Option>
                )
              })}
            </Select>
          </Form.Item>
          <Form.Item label="版本号" rules={[{ required: true, message: '版本号' }]} name="version">
            <Input />
          </Form.Item>
          <Form.Item label="版本备注" rules={[{ required: true, message: '版本备注' }]} name="desc">
            <Input />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 14 }}>
            <Button style={{ borderRadius: 8, marginRight: 10 }} type="primary" loading={loading} onClick={deployClick}>
              发布
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  )
}
export default Index
