<template>
  <div class="home">
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <div class="options_bar" v-for="(item, index) in buttons" :index="index" :key="index">
            <button class="option_button" v-bind:class="{'selected':selected === item}" @click="select_option(item)">{{item}}</button>
          </div>  
        </div>
      </div>
      <div class="row">
        <div class="col-xl-4 col-md-6 col-12" v-for="(subitem, index_) in filteredScores" :index="index_" :key="index_">            
          <ScoreRow :item="subitem"/> 
        </div>        
      </div>
    </div>
  </div>
</template>
<script>

  import { mapActions, mapState } from 'vuex';
  import ScoreRow from './score-row';

  export default {
    components: {ScoreRow},
    data() {
      return {
        buttons: ['ALL','LIVE','UNMATCH'],
        selected: 'ALL'
      }
    },

    computed: {
      ...mapState({
        currentScores: state => state.scores_all,        
      }),
      filteredScores:function () {      
        return this.selected === 'LIVE'?
          this.currentScores.filter(item => item.Header.EventNumber != 0) :
          this.selected === 'UNMATCH'?
            this.currentScores.filter(item => item.Header.EventNumber === 0) :
            this.currentScores 
      }
    },

    methods: {
      ...mapActions(['setReceivedScore']),
      select_option(option){
        this.selected = option;
      }
    },

    mounted: function(){

      var protocol = location.protocol === "https:" ? "wss:" : "ws:";
      var wsUri = protocol + "//" + window.location.host+'/scores';
      var socket = new WebSocket(wsUri);
      const v = this;
      
      socket.onmessage = function (event) {        
        var incomingScore = event.data;
        v.setReceivedScore({score: incomingScore});
      };
    }
  }
</script>
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
    padding: 3px 8px 3px 8px;
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
