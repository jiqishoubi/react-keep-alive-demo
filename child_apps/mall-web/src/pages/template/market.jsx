import React, { useRef, useEffect, useState } from 'react'
import { Tabs } from 'antd'
import TemplateSelect from './index'
import { localDB } from '@/utils/utils'

const SCTEMPLATEWRAPCOM_ACTIVE = 'SCTEMPLATEWRAPCOM_ACTIVE'
const { TabPane } = Tabs
function Index(props) {
  const [activeKey, setActiveKey] = useState(() => {
    return localDB.getItem(SCTEMPLATEWRAPCOM_ACTIVE) || 'market'
  })

  function onTabsChange(key) {
    localDB.setItem(SCTEMPLATEWRAPCOM_ACTIVE, key)
    setActiveKey(key)
  }

  return (
    <Tabs activeKey={activeKey} onChange={onTabsChange} style={{ paddingLeft: 24 }}>
      <TabPane tab="模板市场" key="market">
        <div style={{ minHeight: '65vh' }}>
          <TemplateSelect {...props} type="market" />
        </div>
      </TabPane>
      <TabPane tab="我的模板" key="mine">
        <div style={{ minHeight: '65vh' }}>
          <TemplateSelect {...props} type="mine" />
        </div>
      </TabPane>
    </Tabs>
  )
}

export default Index
