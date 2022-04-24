<template>
  <div>
    <div class="container">
      <div class="row">
        <div class="col-lg-6 col-12" v-for="(item, index) in currentScores" :index="index" :key="index">
          <!-- {{item.Message.Header.ExternalGameNumber}} -->
          <ScoreRow :item="item"/> 
        </div>        
      </div>
    </div>
  </div>
</template>
<script>

//+ ' period ' + item.Message.Score.Period.Description

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
        currentScores: state => state.scores
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

</style>
