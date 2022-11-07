import React from 'react'
import { DefaultFooter, getMenuData, getPageTitle } from '@ant-design/pro-layout'
import { Helmet } from 'react-helmet'
import logo from '../assets/login_logo.png'
import defaultSettings from '../../config/defaultSettings'
import defaultTheme from '../../config/theme/defaultTheme'
import styles from './UserLayout.less'

export const defaultFooterDom = <DefaultFooter copyright="2020 便利电科技出品" links={[]} />

const UserLayout = (props) => {
  const {
    route = {
      routes: [],
    },
  } = props
  const { routes = [] } = route
  const {
    children,
    location = {
      pathname: '',
    },
  } = props
  const { breadcrumb } = getMenuData(routes)
  const title = getPageTitle({
    breadcrumb,
    ...props,
    title: defaultSettings.title,
  })

  return (
    <>
      <div className={styles.container}>
        <img
          src={logo}
          style={{
            width: 104,
            height: 'auto',
            position: 'absolute',
            top: 30,
            left: 30,
          }}
        />
        <div className={styles.login_form}>{children}</div>
        <div
          style={{
            position: 'fixed',
            left: '50%',
            transform: 'translateX(-50%)',
            bottom: 45,
            // color: defaultTheme['primary-color']
            color: '#0080CB',
          }}
        >
          ————全行业全场景的电商解决方案————
        </div>
      </div>
    </>
  )
}

export default UserLayout
