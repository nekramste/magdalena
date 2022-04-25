<template>    
    <div class="row card score-row">
      <div class="col-12">
        <div class="row">
          <div class="col-8 text-left league">
            {{item.Message.Header.SportSubType}}
          </div>
          <div class="col-4 text-right">
            <span class="score-period">{{item.Message.CurrentScore.Period.Description}}</span>
          </div>
        </div>
        <div class="row">
            <div class="col-5 text-center score">
              {{item.Message.CurrentScore.Away.Score }}
            </div>
            <div class="col-2 text-center score">
              {{' - '}}
            </div>
            <div class="col-5 text-center score">
              {{item.Message.CurrentScore.Home.Score}}
            </div>
          </div>
      </div>
      <div class="col-12">
          <div class="row">
              <div class="col-5 text-center" v-bind:class="{'team-mobile':isOnMobile,'team':!isOnMobile}">
                  {{item.Message.Participants.Away.Name }}
              </div> 
              <div class="col-2 text-center">                 
              </div>   
              <div class="col-5 text-center" v-bind:class="{'team-mobile':isOnMobile,'team':!isOnMobile}">
                {{item.Message.Participants.Home.Name}}
              </div>  
              <div class="col-3 text-center click">
                  <icon v-if="item.Message.CurrentScore.IsFinal" @click="send()" :icon="'check'" class="mr-2 menu-icon" />
              </div>   
          </div>              
      </div>
      <div class="col-12">
        <ScoreDetail :item="JSON.parse(JSON.stringify(item))" />
      </div>
    </div>
</template>

<script>
    import ScoreDetail from './score-detail';
    export default {
      components: {ScoreDetail},
      data () {
        return {          
        }
      },
      props:['item'],
      methods: {
        send: function () {
            var url = location.protocol + window.location.host;            
            try {
                const requestOptions = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(this.item)
            };
            fetch(url+'/posts', requestOptions)
                .then(response => response.json())
                .then(data => (this.postId = data.id));
            } catch (err) {
                window.alert(err)
                console.log(err)
            }
        }
      }
    }
</script>

<style scoped>
  .score {
    font-size: 24px;
    font-weight: bold;
    color: #ff4a70;
  }
  .score-row {
    margin-top: 10px;
    padding-top: 10px;
    padding-bottom: 10px;
    min-height: 120px;
    margin-left: 10px;
    margin-right: 10px;
    background: #182f49;
  }
    .click{
        cursor:pointer;
    }
  .score-period {
    
    color: #0fa810;
    font-size: 12px;
    font-weight: bold;
      padding-bottom: 3px;
  }
  .score-period:after {
    content: '';
    display: block;
    margin: auto;
    height: 2px;
    animation: underline 2s infinite;
  }

  @keyframes underline {
    0% {
      width: 0%;
      background-color: #188038;
    }

    100% {
      width: 100%;
      background-color: transparent;
    }
  }

  .league {
    font-size: 13px;
    font-weight: bold;
    color: #fc0
  }

  .team{
    font-weight: bold;
    color: white;
  }

  .team-mobile{
    font-size:12px;
    font-weight: bold;
    color: white;
  }

</style>
