import { createApp } from 'vue'
import './public-path' // 微前端
// element plus
import './common/elementPlusCustom.scss'
import ElementPlus, { ElIcon } from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
// element plus end
import App from './App.vue'
import router from './router' // 这里，注意，elementplus要在router之前引入，要不样式会有问题
import store from './store'

createApp(App).use(ElementPlus, { locale: zhCn }).use(ElIcon).use(router).use(store).mount('#app')
