import LoginForm from './components/LoginForm'
import styles from './index.less'

function Index() {
  return (
    <div className={styles.login_wrap}>
      <div className={styles.login_title}>你好，欢迎来到良医健康</div>
      <LoginForm />
    </div>
  )
}
export default Index
