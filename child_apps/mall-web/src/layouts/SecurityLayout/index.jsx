import React, { useEffect, useMemo } from 'react'
import { connect } from 'dva'
import { Redirect, router } from 'umi'
import { PageLoading } from '@ant-design/pro-layout'
import { getToken, loginStateKey } from '@/utils/consts'
import { localDB } from '@/utils/utils'
import styles from './index.less'
import { getIsInMicroApp } from '@/utils/aboutMicroApp'
import { initRoutes, AliveScope, KeepAliveWrapper, useKeepAlive } from '@/components/react-keep-alive'
import routes from '../../../config/router.config'

initRoutes(routes)

/**
 *
 * @param {*} props
 * @returns
 */
function Index(props) {
  useEffect(() => {
    if (!getIsInMicroApp()) {
      window.mall_global = {
        token: getToken(),
        userInfo: props?.login?.loginInfo || null,
      }
    }
  }, [props?.login?.loginInfo])

  useEffect(() => {
    if (!getIsInMicroApp() && !window.isProd) props.dispatch({ type: 'login/getLoginInfoByToken' })
  }, [])

  useKeepAlive()

  return (
    <AliveScope>
      <div className={styles.page_container}>
        <KeepAliveWrapper>{props.children}</KeepAliveWrapper>
      </div>
    </AliveScope>
  )
}

export default connect(({ login }) => ({ login }))(Index)
