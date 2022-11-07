import React, { Component } from 'react'
import { connect } from 'dva'
import { router } from 'umi'
import { Breadcrumb, Tabs } from 'antd'
import defaultTheme from '../../config/theme/defaultTheme'
import defaultSettings from '../../config/defaultSettings'
import styles from './TabsLayout.less'

const { TabPane } = Tabs

//tabBar 样式
const tabBarListStyle = {
  boxSizing: 'border-box',
  height: defaultTheme['t-istabs-tabbar-height'],
  backgroundColor: '#fff',
  userSelect: 'none',
  boxShadow: '0 1px 4px rgba(0, 21, 41, 0.08)',
  padding: '0 10px',
}

class index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      activeKey: '',
      panes: [],
    }
  }

  componentDidMount() {
    //多tab 增减tab
    if (defaultSettings.isTabs) {
      if (!window.UNLISTEN_TAB) {
        window.UNLISTEN_TAB = this.props.history.listen((location) => {
          this.addCutTab(location.pathname)
        })
      }
    }
  }

  componentWillUnmount() {
    if (window.UNLISTEN_TAB) {
      window.UNLISTEN_TAB()
      window.UNLISTEN_TAB = null
    }
  }
  addCutTab = (url) => {
    const { panes } = this.state
    const { route } = this.props
    const { routes } = route

    let oldUrl = [
      '/web/company/goodsmgr/goodsDetail',
      '/web/company/distributemgr/spreadcompany/detail',
      '/web/company/distributemgr/spreadcompany/revamp',
      '/web/company/distributemgr/channeltool/minute',
      '/web/company/cmsmgr/goodsPrice/revamp',
      '/web/company/pricemgr/priceAuth/detail',
      //管理
      '/web/system/goodsmgr/goodsDetail',
      '/web/system/distributemgr/spreadcompany/detail',
      '/web/system/distributemgr/spreadcompany/revamp',
      '/web/system/distributemgr/channeltool/minute',
      '/web/system/cmsmgr/goodsPrice/revamp',
      '/web/system/pricemgr/priceAuth/detail',
      '/web/supplier/company/goodsmgr/goodsDetail',
      '/web/company/distribution/detail',
      '/web/admin/supplier/company/goodsmgr/goodsDetail',
      '/web/company/saleMarket/list',
      '/web/company/business/ticketmgr/creater',
      '/web/company/business/ticketmgr/creater',
      '/web/company/business/activemgr/create',
      '/web/company/business/activityStatistics',
      '/web/company/report/airadarmgr/minute',
      '/web/company/goodsmgr/batchImport',
      '/web/company/distributemgr/groupmgrdetail',
      '/web/company/indexmgr/template/revamp',
      '/web/company/distributemgr/groupheadmgr/detail',
      '/web/company/menuConfig/addMenu',
      '/web/supplier/trademgr/disputeOrder/details',
      '/web/company/trademgr/disputeOrder/details',
      '/web/system/trademgr/disputeOrder/details',
      '/web/system/trademgr/trademgr/details',
      '/web/company/trademgr/trademgr/details',
      '/web/supplier/trademgr/trademgr/details',
      '/web/company/indexmgr/index',
    ]
    for (let i = 0; i < panes.length; i++) {
      if (oldUrl.indexOf(panes[i].path) > -1) {
        panes.splice(i, 1)
      }
    }

    let flag = false
    for (let i = 0; i < panes.length; i++) {
      if (panes[i].path == url) {
        flag = true
        break
      }
    }
    if (flag) {
      //已经有这个tab
      this.setState({ activeKey: url })
    } else {
      //还没有
      let r
      function findRoute(arr, url) {
        arr.forEach((route) => {
          if (route.path == url) {
            r = route
          } else {
            if (route.routes) {
              findRoute(route.routes, url)
            }
          }
        })
      }
      findRoute(routes, url)

      if (r) {
        const paneItem = r
        panes.push(paneItem)
        this.setState({
          activeKey: url,
          panes,
        })
      }
    }
  }
  //tabs方法
  onChangeTab = (url) => {
    router.push(url)
  }

  onEdit = (targetKey, action) => {
    this[action](targetKey)
  }

  remove = (targetKey) => {
    let { panes, activeKey } = this.state

    let lastIndex
    panes.forEach((pane, i) => {
      if (pane['path'] === targetKey) {
        lastIndex = i - 1
      }
    })
    const panesTemp = panes.filter((pane) => pane['path'] !== targetKey)
    if (panesTemp.length && activeKey === targetKey) {
      if (lastIndex >= 0) {
        activeKey = panesTemp[lastIndex]['path']
      } else {
        activeKey = panesTemp[0]['path']
      }
    }

    this.setState({
      panes: panesTemp,
      activeKey: activeKey,
    })
    router.replace(activeKey)
  }

  closeOtherTabs = () => {
    let { panes, activeKey } = this.state
    const panesTemp = panes.filter((pane) => pane['path'] == activeKey)

    this.setState({
      panes: panesTemp,
    })
    router.replace(activeKey)
  }

  getRoutes = (allRoutes, curPath) => {
    let routes = []
    function find(arr, parentRoute) {
      let route = arr.find((r) => r.path == curPath)
      if (route) {
        routes = [...routes, parentRoute, route]
      } else {
        arr.forEach((r) => {
          if (r.routes) {
            find(r.routes, r)
          }
        })
      }
    }
    find(allRoutes, null)

    routes.forEach((r) => {
      if (r && r.children) {
        delete r.children
      }
    })

    return routes.filter((r) => r)
  }

  /**
   * 渲染
   */
  render() {
    const { panes, activeKey } = this.state
    const { collapsed, login } = this.props

    const allRoutes = this.props.route.routes
    const curPath = this.props.location.pathname
    const routes = this.getRoutes(allRoutes, curPath)
    const itemRender = (route, params, routes, paths) => {
      const last = routes.indexOf(route) === routes.length - 1
      return last ? (
        <span>{route.name}</span>
      ) : (
        // <Link>{route.name}</Link>
        <span>{route.name}</span>
      )
    }

    //关闭按钮
    const operations =
      panes && panes.length > 1 ? (
        <span className={styles.operations_btn} onClick={this.closeOtherTabs}>
          关闭其它页面
        </span>
      ) : null

    //tabBar 样式
    let left
    if (defaultSettings.layout == 'topmenu') {
      left = 0
    } else if (defaultSettings.layout == 'sidemenu') {
      left = collapsed ? defaultTheme['menu-collapsed-width'] : defaultTheme['t-siderMenu-width']
    } else if (defaultSettings.layout == 'mixmenu') {
      const { menuTree, mixMenuActiveIndex } = login
      if (!menuTree[mixMenuActiveIndex] || !menuTree[mixMenuActiveIndex].children) {
        left = 0
      } else {
        left = collapsed ? defaultTheme['menu-collapsed-width'] : defaultTheme['t-siderMenu-width']
      }
    }
    let tabBarListStyle2 = {
      ...tabBarListStyle,
      left,
      display: panes.length == 0 ? 'none' : null,
      transition: defaultSettings.layout == 'mixmenu' ? 'none' : 'all 0.2s',
    }

    return (
      <div>
        {routes[1]?.title ? <div className="ant-breadcrumb">{routes[1].title}</div> : <Breadcrumb itemRender={itemRender} routes={routes} />}
        <Tabs
          className={styles.tabs_wrap}
          id="istabs_tabs_wrap"
          hideAdd
          type="editable-card"
          size="small"
          tabBarStyle={tabBarListStyle2}
          tabBarExtraContent={operations}
          activeKey={activeKey}
          onChange={this.onChangeTab}
          onEdit={this.onEdit}
        >
          {panes.map((obj) => {
            return (
              <TabPane key={obj.path} tab={obj.name} closable={panes.length > 1}>
                <div className={styles.paneCard}>
                  <obj.component {...this.props} />
                </div>
              </TabPane>
            )
          })}
        </Tabs>
      </div>
    )
  }
}

export default connect(({ login }) => ({
  login,
}))(index)
