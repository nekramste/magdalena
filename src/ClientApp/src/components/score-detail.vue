<template>    
    <div class="row scores-detail" v-if="item.Scores.length">
      <div class="col-12">
        <div class="row">
          <div class="col-5 col-md-6 text-left detail-header">
            {{'Team'}}
          </div>
          <div v-if="item" class="col-7 col-md-6 text-right detail-header">
            <div class="period-cell" v-for="(score, index) in item.Scores" :index="index" :key="index">
              {{score.Period.Abbr}}
            </div>
          </div>
        </div>
      </div>     
      <div class="col-12">
        <div class="row">
          <div class="col-5 col-md-6 text-left detail">
            {{item?item.Participants.Away.Name:''}}
          </div>
          <div v-if="item" class="col-7 col-md-6 text-right">
            <div style="display: inline-block">
              <div class="period-cell" v-for="(score, index) in item.Scores" :index="index" :key="index">
                <div v-bind:class="{'blink_me':(score.IsFinal && score.Status === 'WasSendToGrade'),'graded':(score.IsFinal && score.Status === 'Graded')}"> {{score.Away.Score}} </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-5 col-md-6 text-left detail">
              {{item?item.Participants.Home.Name:''}}
          </div>
          <div v-if="item" class="col-7 col-md-6 text-right">
            <div class="period-cell" v-for="(score, index) in item.Scores" :index="index" :key="index">
              <div v-bind:class="{'blink_me':(score.IsFinal && score.Status === 'WasSendToGrade'),'graded':(score.IsFinal && score.Status === 'Graded')}"> {{score.Home.Score}} </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-5 col-md-6  text-left detail">
          </div>
          <div v-if="item" class="col-7 col-md-6 text-right">
            <div class="period-cell text-center" v-for="(score, index) in item.Scores" :index="index" :key="index">       
              <IconGrade :item="item" :score="score"/>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>

    import config from '../common/config';
    import IconGrade from './icon-grade.vue';

    export default {
      components: {IconGrade},
      data () {
        return {
          loading: false
        }
      },
      props:['item'],
      methods: {

        getBody(score){
          let body = {
            Context : {
              MustSendToGrade: true
            },
            GameScore : {
              Header : {
                    EventNumber: this.item.Header.EventNumber,
                    ExternalGameNumber: this.item.Header.ExternalGameNumber

              },
              CurrentScore : {
                Away : {
                  score: score.Away.Score
                },
                Home : {
                  score: score.Home.Score
                },
                Period : {
                  Number: score.Period.Number
                }
              }
            }
          };
          return body;
        },

        send: function (score) {
          
          var url = config.API_URL;
          
          try {
              this.loading = true;
              const requestOptions = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(this.getBody(score))
              };
              fetch(`${url}/api/grade`, requestOptions)
                  .then(response => {
                    this.loading = false;
                    console.log(response);
                  })
                  .then(data => (this.postId = data.id));
          } catch (err) {
            this.loading = false;  
          }
        }
      }   
    }
</script>

<style scoped>
  .scores-detail {
      padding-top: 5px;
      font-size: 13px;
      color: white;
      line-height: 13px;
  }
  .detail-header {
    color: #6c757d;
    font-size: 12px;
  }

  .team {
      font-weight: bold;
      font-size:14px;
    }

  .period-cell{
      text-align: center;
      display: inline-block;
      padding-top: 5px;
      width:35px;
  }
  .period-cell-header {
    color: #CCC;
  }

  .click{
    cursor:pointer;
  }

  .icon-pending{
    color: #28A745;
    font-size: 17px
  }

  .icon-was-send{
    color: #FD7E14;    
  }

  .icon-graded{
    color: #20C997;
  }

  .icon-loading{
    font-weight: 12px;
  }

  .blink_me {
    color:#DC3545;
    animation: blinker 1s linear infinite;
  }

  @keyframes blinker {
    50% {
      opacity: 0;
    }
  }

  .graded{
    color: #20C997;
  }

</style>
