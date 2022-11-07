import md5 from 'md5'

const { origin } = window.location

export const childAppKeyStrArr = ['doctor', 'mall']

// 子应用配置
interface IChildApp {
  name: string // 子应用名称
  devPort: string // 开发时 子应用端口
  origin: string // 子应用域名
  childWebRoute: string // 子应用本身的二级路由
  baseroute: string // 主应用 用这个访问到子应用
}

interface IENV_CONFIG {
  urlHost: string // 前端页面域名
  apiPath: string // 请求域名
  doctor?: IChildApp
  mall?: IChildApp
}

type IENV = 'dev' | 'test' | 'prod'

export const ENV: IENV = process.env.ENV as IENV

// prettier-ignore
const host_dev = (
  // 'https://lyapit.bld365.com' // 测试
  'https://lyapi.bld365.com' // 这个资质的版本 只有这一个环境
  // 'http://1.2.4.222:8088' // 雪婷
)

/**
 * 开发、测试、生产 环境
 */
const envConfig = {
  // 开发环境
  dev: {
    urlHost: 'http://localhost:9103',
    // prettier-ignore
    apiPath: host_dev,
    doctor: {
      name: 'doctorAppName', // 子应用名称
      devPort: '9032', // 开发时 子应用端口
      origin: 'http://localhost:9032', // 子应用的域名
      childWebRoute: '/childdoctor', // 子应用本身的二级路由
      baseroute: '/doctorApp', // 主应用 用这个访问到子应用  // 这里要和routes里 分配到子应用的路由一样
    },
    mall: {
      name: 'mallAppName',
      devPort: '9033',
      origin: 'http://localhost:9033',
      childWebRoute: '/', // 不知道为什么。。mall-app是umi2搭建的，开发时childWebRoute必须为 /
      baseroute: '/mallApp',
    },
  },
  // 测试环境
  test: {
    urlHost: 'https://lyt.bld365.com',
    apiPath: 'https://lyapit.bld365.com',
    doctor: {
      name: 'doctorAppName',
      devPort: '9032',
      origin: 'https://lyt.bld365.com',
      childWebRoute: '/childdoctor',
      baseroute: '/doctorApp',
    },
    mall: {
      name: 'mallAppName',
      devPort: '9033',
      origin: 'https://lyt.bld365.com',
      childWebRoute: '/childmall',
      baseroute: '/mallApp',
    },
  },
  // 生产环境
  prod: {
    urlHost: 'https://ly.bld365.com',
    apiPath: 'https://lyapi.bld365.com',
    doctor: {
      name: 'doctorAppName',
      devPort: '9032',
      origin: 'https://ly.bld365.com',
      childWebRoute: '/childdoctor',
      baseroute: 'doctorApp',
    },
    mall: {
      name: 'mallAppName',
      devPort: '9033',
      origin: 'https://ly.bld365.com',
      childWebRoute: '/childmall',
      baseroute: 'mallApp',
    },
  },
}

export const ENV_CONFIG: IENV_CONFIG = envConfig[ENV]
export const LOGIN_TOKEN_KEY = md5(`_${origin}_login_storage_token_key`)
export const LOGIN_PATH = '/user/login'

export function setToken(str: string) {
  localStorage.setItem(LOGIN_TOKEN_KEY, str ?? '') //保存token
}
export function getToken() {
  return localStorage.getItem(LOGIN_TOKEN_KEY) ?? ''
}
