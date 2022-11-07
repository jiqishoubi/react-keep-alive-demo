import { useEffect } from 'react'
import { observer } from 'mobx-react'
import login from '@/store/login'
import { useLocation, Redirect } from 'react-router-dom'
import { renderRoutes } from 'react-router-config'
import { getToken, LOGIN_PATH } from '@/utils/consts'

function Index(props) {
  const location = useLocation()
  const token = getToken()
  useEffect(() => {
    if (token && location.pathname !== LOGIN_PATH && !login.userInfo) {
      login.initInfo()
    }
  }, [])
  /**
   * 渲染
   */
  if (!token && location.pathname !== LOGIN_PATH) {
    return <Redirect to={LOGIN_PATH} />
  }
  return renderRoutes(props?.route?.routes ?? [])
}

export default observer(Index)
