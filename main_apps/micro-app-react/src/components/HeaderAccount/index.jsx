import { observer } from 'mobx-react'
import login from '@/store/login'
import { useHistory } from 'react-router-dom'
import { LogoutOutlined } from '@ant-design/icons'
import styles from './index.less'
import { showConfirm } from '@/utils/confirm'
import { LOGIN_PATH } from '@/utils/consts'
import { Dropdown, Menu } from 'antd'

export default observer(function HeaderAccount(props) {
  const history = useHistory()
  const { userInfo } = login

  const { onMenuClick } = props

  function handleLogout() {
    showConfirm('确定注销账户？', () => {
      login.logout()
      setTimeout(() => {
        history.replace(LOGIN_PATH)
      }, 50)
    })
  }

  const menu = (
    <Menu>
      <Menu.Item key="updatePassword" onClick={() => onMenuClick('updatePassword')}>
        修改密码
      </Menu.Item>
    </Menu>
  )

  return (
    <div className={styles.account_wrap}>
      {/* <div onClick={props.onSign}>签名</div> */}
      <Dropdown overlay={menu} placement="bottomRight">
        <div className={styles.account_box}>
          <span>{userInfo?.staffName}</span>
          {userInfo?.loginName && <span>（{userInfo.loginName}）</span>}
        </div>
      </Dropdown>

      {/* 注销按钮 */}
      {userInfo && (
        <div className={styles.logout_btn} onClick={handleLogout}>
          <LogoutOutlined style={{ fontSize: 17, color: 'red' }} />
        </div>
      )}
    </div>
  )
})
