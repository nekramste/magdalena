import Vue from 'vue'
import axios from 'axios'
import router from './router/index'
import store from './store'
import { sync } from 'vuex-router-sync'
import App from 'components/app-root'
import { FontAwesomeIcon } from './icons'

const constants = {MOBILE_SIZE:991.98, MOBILE_SIZE_XSM:415,MOBILE_SIZE_SM:505}

const SIZE_LG = 992;
const SIZE_XL = 1200;

Vue.component('icon', FontAwesomeIcon)

Vue.prototype.$http = axios

sync(store, router)

Vue.mixin({  
  data() { return {isOnMobile_: false,isOnMobileSM_: false, isOnMobileXSM_: false, isOnXL_: false} },
  computed: {              
              isOnMobile: function() {return this.isOnMobile_;},
              isOnMobileSM: function() {return this.isOnMobileSM_;},
              isOnMobileXSM: function() {return this.isOnMobileXSM_;},
              isOnXL: function() {return this.isOnXL_;}
            },
  methods: { 
              onResize () { this.isOnMobile_ = (window.innerWidth <= constants.MOBILE_SIZE);
                            this.isOnMobileSM_ = (window.innerWidth <= constants.MOBILE_SIZE_SM);
                            this.isOnMobileXSM_ = (window.innerWidth <= constants.MOBILE_SIZE_XSM);
                            this.isOnXL_ = ((SIZE_LG < window.innerWidth) & (window.innerWidth <= SIZE_XL))?true:false;
                          }              
  },
  created() {window.addEventListener('resize', this.onResize);},
  destroyed() {window.removeEventListener('resize', this.onResize );},
  mounted(){ this.onResize();}
});

const app = new Vue({
  store,
  router,
  ...App
})

export {
  app,
  router,
  store
}
