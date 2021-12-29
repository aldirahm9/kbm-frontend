import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import VTooltip from 'v-tooltip'

Vue.component("v-select", vSelect);
Vue.use(VTooltip);
Vue.config.productionTip = false;


new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

