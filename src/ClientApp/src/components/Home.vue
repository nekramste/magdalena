<template>
  <div class="home">
    <div class="container-fluid">
      <div class="row">
        <div class="col-12" style="text-align: left;">
          <div class="options_bar" v-for="(item, index) in buttons" :index="index" :key="index">
            <button class="option_button" v-bind:class="{'selected':selected === item}" @click="select_option(item)">{{item}}</button>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-xl-4 col-lg-6 col-md-6 col-12" v-for="(subitem, index_) in filteredScores" :index="index_" :key="index_">            
          <ScoreRow v-if="subitem" :item="subitem" :isOnMobile="isOnMobile_"/>
        </div>        
      </div>
    </div>
  </div>
</template>

<script>

import { mapActions, mapState } from 'vuex';
import ScoreRow from './score-row';
import config from '../common/config';

const constants = {MOBILE_SIZE:991.98, MOBILE_SIZE_XSM:415,MOBILE_SIZE_SM:505}
const SIZE_LG = 992;
const SIZE_XL = 1200;

export default {
  name: 'Home',
  props: {
    msg: String
  },
  components: {ScoreRow},
    data() {
      return {
        buttons: ['ALL','LIVE','UNMATCH','GRADED'],
        selected: 'ALL',
        isOnMobile_: false,
        isOnMobileSM_: false,
        isOnMobileXSM_: false,
        isOnXL_: false
      }
    },

    computed: {
      ...mapState({
        currentScores: state => state.scores_all,
        gradedScores: state => state.scores_graded
      }),
      filteredScores:function () {      
        return this.selected === 'LIVE'?
          this.currentScores.filter(item => item.Header.EventNumber != 0) :
          this.selected === 'UNMATCH'?
            this.currentScores.filter(item => item.Header.EventNumber === 0) :
            this.selected === 'GRADED'? this.gradedScores :
              this.currentScores 
      },
      isOnMobile: function() {return this.isOnMobile_;},
      isOnMobileSM: function() {return this.isOnMobileSM_;},
      isOnMobileXSM: function() {return this.isOnMobileXSM_;},
      isOnXL: function() {return this.isOnXL_;}
    },

    methods: {
      ...mapActions(['setReceivedScore','startCleaner']),
      select_option(option){
        this.selected = option;
      },
      onResize () { this.isOnMobile_ = (window.innerWidth <= constants.MOBILE_SIZE);
                    this.isOnMobileSM_ = (window.innerWidth <= constants.MOBILE_SIZE_SM);
                    this.isOnMobileXSM_ = (window.innerWidth <= constants.MOBILE_SIZE_XSM);
                    this.isOnXL_ = ((SIZE_LG < window.innerWidth) & (window.innerWidth <= SIZE_XL))?true:false;
                  }    
    },

    created() {window.addEventListener('resize', this.onResize);},

    mounted: function(){

      this.onResize();

      var protocol = location.protocol === "https:" ? "wss:" : "ws:";
      var wsUri = config.IS_PRODUCTION?`${config.WS_URL}/scores` : protocol + "//" + window.location.host + '/scores';

      var socket = new WebSocket(wsUri);
      const v = this;

      this.startCleaner();
      
      socket.onmessage = function (event) {        
        var incomingScore = event.data;
        v.setReceivedScore({score: incomingScore});
      };
    },

    unmounted() {window.removeEventListener('resize', this.onResize );},

}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

  html {
    background-color: #05162a;
  }

  .home {
    background-color: #05162a;
    padding-bottom: 40px;
  }

  .sport {
    padding-top: 10px;
    font-size: 16px;
    font-weight: bold;
    color: #fc0
  }

  .options_bar{
    padding-top: 20px;
    padding-left: 10px;
    display: inline-block;    
  }

  .option_button{
    border: none;
    border-radius: 10px;
    padding: 3px 8px 1px 8px;
    font-weight: 500;
  }

  .option_button:hover{
    background-color: #ff4a70;
    color: white;
  }

  .selected{
    background-color: #ff4a70;
    color: white;
  }

</style>
