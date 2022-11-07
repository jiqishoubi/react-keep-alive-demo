1、启动 yarn start

2、打包 yarn build

介绍

1、系统分为三端 管理端、企业端、供应商端

2、管理端和企业端公用一个页面，通过权限判断调用的接口

##

列表页可以参考 /pages/crmMng/agentMng/index.jsx

##

/pages/channel/userAccount.js 里有 usePageParams + useParamsTable ，实现地址栏保存筛选条件
