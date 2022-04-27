<template>    
    <div class="row scores-detail" v-if="item.Scores.length">
      <div class="col-12">
        <div class="row">
          <div v-bind:class="{'col-5':isOnMobile,'col-6':!isOnMobile}" class="text-left detail-header">
            {{'Team'}}
          </div>
          <div v-if="item" v-bind:class="{'col-7':isOnMobile,'col-6':!isOnMobile}" class="text-right detail-header">
            <div class="period-cell" v-for="(score, index) in item.Scores" :index="index" :key="index">
              {{score.Period.Abbr}}
            </div>
          </div>
        </div>
      </div>     
      <div class="col-12">
        <div class="row">
          <div v-bind:class="{'col-5':isOnMobile,'col-6':!isOnMobile}" class="text-left detail">
            {{item?item.Participants.Away.Name:''}}
          </div>
          <div v-if="item" v-bind:class="{'col-7':isOnMobile,'col-6':!isOnMobile}" class="text-right">
            <div style="display: inline-block">
              <div class="period-cell" v-for="(score, index) in item.Scores" :index="index" :key="index">                    
                {{score.Away.Score}}
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div v-bind:class="{'col-5':isOnMobile,'col-6':!isOnMobile}" class="text-left detail">
              {{item?item.Participants.Home.Name:''}}
          </div>
          <div v-bind:class="{'col-7':isOnMobile,'col-6':!isOnMobile}" v-if="item" class="text-right">
            <div class="period-cell" v-for="(score, index) in item.Scores" :index="index" :key="index">
              {{score.Home.Score}}
            </div>
          </div>
        </div>
        <div class="row">
          <div v-bind:class="{'col-5':isOnMobile,'col-6':!isOnMobile}" class="text-left detail">
          </div>
          <div v-bind:class="{'col-7':isOnMobile,'col-6':!isOnMobile}" v-if="item" class="text-right">
            <div class="period-cell text-center" v-for="(score, index) in item.Scores" :index="index" :key="index">       
              <icon v-if="!loading && score.IsFinal && score.Status === 'Pending'" @click="send(score)" :icon="'paper-plane'" class="icon-pending click" data-toggle="tooltip" data-placement="top" title="Tooltip on top"/>       
              <icon v-if="!loading && score.IsFinal && score.Status === 'WasSendToGrade'" :icon="'bars-progress'" class="icon-was-send" />
              <icon v-if="!loading && score.IsFinal && score.Status === 'Graded'" :icon="'check'" class="icon-graded" />
              <icon v-if="loading" :icon="'spinner'" class="fa-pulse fa-3x"/>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>

    import config from '../common/config';

    export default {
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
    color: white;
  }

  .icon-was-send{
    color: #FD7E14;
  }

  .icon-graded{
    color: #20C997;
  }
</style>
