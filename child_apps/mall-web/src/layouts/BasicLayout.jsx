import React, { Fragment, useEffect, useState } from 'react'
import ProLayout from '@ant-design/pro-layout'
import { Link, router } from 'umi'
import { connect } from 'dva'
import {
  ContainerOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  ShopOutlined,
  TransactionOutlined,
  ScheduleOutlined,
  GiftOutlined,
  FundProjectionScreenOutlined,
  BankOutlined,
  SettingOutlined,
  StrikethroughOutlined,
  MoneyCollectOutlined,
  ClusterOutlined,
  FireOutlined,
  HomeOutlined,
} from '@ant-design/icons'
import { Result, Button, Menu } from 'antd'
import Authorized from '@/utils/Authorized'
import RightContent from '@/components/GlobalHeader/RightContent'
import TabsLayout from './TabsLayout'
import logo from '../assets/logo_zhongxinxiang.png'
import defaultSettings from '../../config/defaultSettings'
import defaultTheme from '../../config/theme/defaultTheme'
import { defaultFooterDom } from './UserLayout'
import BreadcrumbCustom from '@/components/BreadcrumbCustom'
import { findFirstMenuUrl } from '@/utils/login'
import './BasicLayout_localName.less'

export const siderWidth = defaultTheme['t-siderMenu-width'] ? Number(defaultTheme['t-siderMenu-width'].split('px')[0]) : 0

export const noMatch = (
  <Result
    status={403}
    title="403"
    subTitle="Sorry, you are not authorized to access this page."
    extra={
      <Button type="primary">
        <Link to="/user/login">返回首页</Link>
      </Button>
    }
  />
)

const collapsedButtonStyle = {
  // color: '#fff',
  color: 'rgb(255,255,255)',
  fontSize: 23,
  cursor: 'pointer',
}

export const mixMenuRenderFunc = (dispatch, login) => {
  let menuTree = login.menuTree || []
  let mixMenuActiveIndex = login.mixMenuActiveIndex

  //点击方法
  const handleClick = (e) => {
    let mixMenuActiveIndex2 = e.key
    //跳转自己
    if (menuTree[mixMenuActiveIndex2] && !menuTree[mixMenuActiveIndex2].children && menuTree[mixMenuActiveIndex2].menuUrl) {
      router.push(menuTree[mixMenuActiveIndex2].menuUrl)
    } else if (defaultSettings.mixNeedJump && mixMenuActiveIndex !== mixMenuActiveIndex2) {
      //如果mix模式 需要跳转就跳转 跳转第一个子菜单
      let firstUrl = findFirstMenuUrl({
        arr: menuTree[mixMenuActiveIndex2].children,
        urlKey: 'menuUrl',
      })
      router.push(firstUrl)
    }

    dispatch({
      type: 'login/saveDB',
      payload: {
        mixMenuActiveIndex,
      },
    })
  }

  return (
    <Menu onClick={handleClick} selectedKeys={[mixMenuActiveIndex + '']} mode="horizontal" theme={defaultSettings.navTheme_header}>
      {menuTree.map((obj, index) => {
        return <Menu.Item key={index + ''}>{obj.menuName}</Menu.Item>
      })}
    </Menu>
  )
}

const BasicLayout = (props) => {
  const { dispatch, children, login, collapsed } = props

  const [show, setshow] = useState(false)
  //logo和titel设置
  const titelShow = {
    menuHeaderRender: (logoDom, titleDom) => {
      return (
        <div style={{ height: '100%' }}>
          {collapsed && defaultSettings.layout !== 'mixmenu' ? null : (
            <div
              style={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                position: 'relative',
                background: '#FEFFFE',
                borderRight: '0',
              }}
            >
              <img
                style={{
                  position: 'absolute',
                  Top: '6px',
                  left: '10px',
                  width: '31px',
                  height: '31px',
                }}
                src={logo}
              />
              <span
                style={{
                  position: 'absolute',
                  Top: '30px',
                  left: '50px',
                  fontSize: '16px',
                  color: '#2A2A2A',
                }}
              >
                众心享管理系统
              </span>
            </div>
          )}
        </div>
      )
    },
  }
  const [logos, setlogos] = useState(titelShow)
  //控制logo的显示
  useEffect(() => {
    if (show) {
      setlogos()
    } else {
      setlogos(titelShow)
    }
  }, [show])

  const handleMenuCollapse = (payload) => {
    setshow(payload)
    if (dispatch) {
      dispatch({
        type: 'global/changeLayoutCollapsed',
        payload,
      })
    }
  }

  // const authorized = getAuthorityFromRouter(props.route.routes, location.pathname || '/') || {
  //   authority: undefined,
  // };

  //mix模式 上面的菜单
  const mixMenuRender = () => {
    return mixMenuRenderFunc(dispatch, login)
  }

  // 2020.07.23新增动态icon的方法
  const menuDataRender = () => {
    let menuTree = JSON.parse(JSON.stringify(login.menuTree || []))
    let arrTemp

    if (defaultSettings.layout == 'mixmenu') {
      let mixMenuActiveIndex = login.mixMenuActiveIndex
      arrTemp = (menuTree[mixMenuActiveIndex] && menuTree[mixMenuActiveIndex].children) || []
    } else {
      arrTemp = menuTree
    }

    const loopDealMenuItemIcon = (arr) => {
      if (arr && arr.length > 0) {
        arr.forEach((obj) => {
          /**
           * 加icon的判断条件 写在这里
           */
          if (obj.menuLevel == (defaultSettings.layout == 'mixmenu' ? 1 : 0)) {
            if (obj.menuIcon === 'GiftOutlined') {
              obj.icon = <GiftOutlined />
            }
            if (obj.menuIcon === 'UserOutlined') {
              obj.icon = <UserOutlined />
            }
            if (obj.menuIcon === 'TransactionOutlined') {
              obj.icon = <TransactionOutlined />
            }
            if (obj.menuIcon === 'ShopOutlined') {
              obj.icon = <ShopOutlined />
            }
            if (obj.menuIcon === 'ScheduleOutlined') {
              obj.icon = <ScheduleOutlined />
            }
            if (obj.menuIcon === 'Aftersale') {
              obj.icon = <ContainerOutlined />
            }
            if (obj.menuIcon === 'Marketing') {
              obj.icon = <FundProjectionScreenOutlined />
            }
            if (obj.menuIcon === 'settle') {
              obj.icon = <StrikethroughOutlined />
            }
            if (obj.menuIcon === 'SchoolOutlined') {
              obj.icon = <BankOutlined />
            }
            if (obj.menuIcon === 'SettingOutlined') {
              obj.icon = <SettingOutlined />
            }
            if (obj.menuIcon === 'PriceOutlined') {
              obj.icon = <MoneyCollectOutlined />
            }
            if (obj.menuIcon === 'StatisticsOutlined') {
              obj.icon = <MoneyCollectOutlined />
            }
            if (obj.menuIcon === 'ClusterOutlined') {
              obj.icon = <ClusterOutlined />
            }
            if (obj.menuIcon === 'productShare') {
              obj.icon = <FireOutlined />
            }

            if (obj.menuIcon === 'qiyebaobiaoIcon') {
              obj.icon = <HomeOutlined />
            }
          }
          loopDealMenuItemIcon(obj.children)
        })
      }
    }

    //处理icon
    loopDealMenuItemIcon(arrTemp)
    return arrTemp
  }

  return (
    <ProLayout
      logo={() => (
        <img
          style={{
            position: 'absolute',
            left: '4px',
            width: '31px',
            height: '31px',
          }}
          src={logo}
        />
      )}
      rowKey="id"
      {...logos}
      onCollapse={handleMenuCollapse}
      menuItemRender={(menuItemProps, defaultDom) => {
        if (menuItemProps.isUrl || menuItemProps.children || !menuItemProps.path) {
          return defaultDom
        }

        return <Link to={menuItemProps.path}>{defaultDom}</Link>
      }}
      breadcrumbRender={(routers = []) => [
        {
          path: '/',
          breadcrumbName: '首页',
        },
        ...routers,
      ]}
      itemRender={(route, params, routes, paths) => {
        const first = routes.indexOf(route) === 0
        return first ? <Link to={paths.join('')}>{route.name}</Link> : <span>{route.name}</span>
      }}
      footerRender={() => defaultFooterDom}
      menuDataRender={menuDataRender}
      rightContentRender={() => <RightContent />}
      {...props}
      {...defaultSettings}
      /**
       * 自定义
       */
      siderWidth={siderWidth}
      collapsedButtonRender={
        defaultSettings.layout == 'mixmenu'
          ? (collapsed) => {
              return collapsed ? (
                <MenuUnfoldOutlined
                  style={{
                    ...collapsedButtonStyle,
                    fontSize: 15,
                    color: '#fff',
                  }}
                />
              ) : (
                <MenuFoldOutlined style={{ collapsedButtonStyle }} />
              )
            }
          : undefined
      }
      mixMenuRender={mixMenuRender}
    >
      <Authorized
        // authority={authorized!.authority}
        noMatch={noMatch}
      >
        {defaultSettings.isTabs ? (
          <TabsLayout {...props} />
        ) : (
          <Fragment>
            <BreadcrumbCustom {...props} />
            {children}
          </Fragment>
        )}
      </Authorized>
    </ProLayout>
  )
}

export default connect(({ global, login }) => ({
  collapsed: global.collapsed,
  login,
}))(BasicLayout)
