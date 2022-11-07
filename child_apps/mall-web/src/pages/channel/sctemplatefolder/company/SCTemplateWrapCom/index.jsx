import React, { useEffect, useState } from 'react'
import { Tabs } from 'antd'
import SCTemplateCom from '@/pages/channel/sctemplatefolder/company/SCTemplateCom' //企业端看的模板市场
import SCTemplateMyCom from '@/pages/channel/sctemplatefolder/company/SCTemplateMyCom' //企业自己的模板
import { localDB } from '@/utils/utils'

const { TabPane } = Tabs

const SCTEMPLATEWRAPCOM_ACTIVE = 'SCTEMPLATEWRAPCOM_ACTIVE'

function Index(props) {
  const [activeKey, setActiveKey] = useState(() => {
    return localDB.getItem(SCTEMPLATEWRAPCOM_ACTIVE) || '1'
  })

  function onTabsChange(key) {
    localDB.setItem(SCTEMPLATEWRAPCOM_ACTIVE, key)
    setActiveKey(key)
  }

  return (
    <Tabs activeKey={activeKey} onChange={onTabsChange} style={{ paddingLeft: 24 }}>
      <TabPane tab="模板市场" key="1">
        <div style={{ minHeight: '65vh' }}>
          <SCTemplateCom {...props} />
        </div>
      </TabPane>
      <TabPane tab="我的模板" key="2">
        <div style={{ minHeight: '65vh' }}>
          <SCTemplateMyCom {...props} />
        </div>
      </TabPane>
    </Tabs>
  )
}

export default Index
