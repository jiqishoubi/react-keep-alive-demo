// 登录页
import { Row } from 'antd'
import Footer from '@/components/layout/Footer'
import styles from './index.less'
// import { Outlet } from 'react-router-dom' // Outlet用于渲染children
import { renderRoutes } from 'react-router-config'
import rightImg from './assets/userLayout_right_bg.png'

function Index(props) {
  return (
    <div className={styles.container}>
      <Row type="flex">
        <div className={styles.left_content}>
          <div className={styles.logo_box}>
            <img className={styles.logo_img} src={require('../../assets/img/logo.png').default}></img>
            <span className={styles.logo_text}>良医健康</span>
          </div>
          <div className={styles.content}>
            {renderRoutes(props?.route?.routes ?? [])}
            <div className={styles.account_tip}>如需注册账号，请联系客服</div>
          </div>

          <div className={styles.beian}>
            <a href="https://beian.miit.gov.cn/">辽ICP备2022002974号-1</a>
          </div>
        </div>
        <img className={styles.right_bg} src={rightImg} />
      </Row>
      {/* <Footer /> */}
    </div>
  )
}

export default Index
