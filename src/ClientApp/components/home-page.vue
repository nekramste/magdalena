<template>
  <div>
    <div class="container">
      <div class="row">
        <div class="col-12" v-for="(item, index) in currentSports" :index="index" :key="index">          
          <div class="row">
            <div class="col-12">{{item}}</div>            
            <div class="col-lg-6 col-12" v-for="(subitem, index_) in getScoresBySportType(item)" :index="index_" :key="index_">            
              <ScoreRow :item="subitem"/> 
            </div>
          </div>
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
      getScoresBySportType(SportType){
        return this.currentScores.filter(item => item.Message.Header.SportType === SportType)
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

</style>
