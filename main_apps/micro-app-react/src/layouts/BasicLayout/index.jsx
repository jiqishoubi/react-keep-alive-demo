import { useEffect, useRef } from 'react'
import { useLocation, useHistory } from 'react-router-dom'
import { renderRoutes } from 'react-router-config'
import { observer } from 'mobx-react'
import login from '@/store/login'
import ContentLayout from '@/components/layout/ContentLayout'
import HeaderAccount from '@/components/HeaderAccount'
import { ENV, getToken } from '@/utils/consts'
import logoImg from '@/assets/img/logo.png'
import styles from './index.less'
import UpdatePsdModal from '@/components/modal/UpdatePsdModal'

function Index(props) {
  const history = useHistory()
  const location = useLocation()
  const UpdatePsdModalRef = useRef(null)

  useEffect(() => {
    window.dispatchEvent(new PopStateEvent('popstate', { state: null }))
  }, [location.pathname])

  if (!window.HISTORY) window.HISTORY = history // 保存history 为了实现 组件外的跳转

  // menu click
  function handleMenuClick(key) {
    if (key == 'updatePassword') {
      handleUpdatePassword()
    }
  }
  // 修改密码
  function handleUpdatePassword() {
    UpdatePsdModalRef.current?.open()
  }

  function handleSign() {
    console.log('sign')
  }

  return (
    <>
      <ContentLayout
        // header
        renderHeaderLeft={() => {
          return <>{/* {ENV == 'dev' && <div>dev token： {getToken()}</div>} */}</>
        }}
        renderHeaderRight={<HeaderAccount onSign={handleSign} onMenuClick={handleMenuClick} />}
        // sideMenu
        renderLogo={(e) => {
          return (
            <div className={styles.side_logo_box}>
              <img className={styles.logo_img} src={logoImg} />
              {!e?.isCollapsed && <span className={styles.logo_text}>良医健康</span>}
            </div>
          )
        }}
        allMenu={login.allMenu}
        menuTree={login.menuTree}
        menuValueKey="menuCode" // 作为唯一key
        sideMenuShowSearch={true}
      >
        <div className={styles.main_wrap}>{renderRoutes(props?.route?.routes ?? [])}</div>
      </ContentLayout>

      {/* 模态 */}
      <UpdatePsdModal ref={UpdatePsdModalRef} />
    </>
  )
}

export default observer(Index)
