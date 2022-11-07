import React, { useEffect, useState } from 'react'
import { Tabs } from 'antd'
import SCTemplate from '@/pages/channel/sctemplatefolder/admin/SCTemplate' //管理端看的模板市场
import SCTemplateMy from '@/pages/channel/sctemplatefolder/admin/SCTemplateMy' //企业的模板
import { localDB } from '@/utils/utils'

const { TabPane } = Tabs

const SCTEMPLATEWRAP_ACTIVE = 'SCTEMPLATEWRAP_ACTIVE'

function Index(props) {
  const [activeKey, setActiveKey] = useState(() => {
    return localDB.getItem(SCTEMPLATEWRAP_ACTIVE) || '1'
  })

  function onTabsChange(key) {
    localDB.setItem(SCTEMPLATEWRAP_ACTIVE, key)
    setActiveKey(key)
  }

  return (
    <Tabs activeKey={activeKey} onChange={onTabsChange}>
      <TabPane tab="模板市场" key="1">
        <div style={{ minHeight: '65vh' }}>
          <SCTemplate {...props} />
        </div>
      </TabPane>
      <TabPane tab="企业模板" key="2">
        <div style={{ minHeight: '65vh' }}>
          <SCTemplateMy {...props} />
        </div>
      </TabPane>
    </Tabs>
  )
}

export default Index
