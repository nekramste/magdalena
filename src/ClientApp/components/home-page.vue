<template>
  <div class="home">
    <div class="container">
      <div class="row">
        <div class="col-lg-6 col-12" v-for="(subitem, index_) in currentScores" :index="index_" :key="index_">            
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
      }
    },

    computed: {
      ...mapState({
        currentScores: state => state.scores,
        currentSports: state => state.sports
      })      
    },

    methods: {
      ...mapActions(['setReceivedScore']),
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

</style>
