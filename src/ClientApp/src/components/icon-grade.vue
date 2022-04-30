<template>    
    <div>    
        <i v-if="!loading && score.IsFinal && score.Status === 'Pending'" @click="send(score)" class="fas fa-check icon-pending click" data-toggle="tooltip" data-placement="top" title="Pending"/>
        <i v-if="!loading && score.IsFinal && score.Status === 'WasSendToGrade'" class="fas fa-task icon-was-send" data-toggle="tooltip" data-placement="top" title="Was send to grade"/>
        <div v-if="loading"><i class="fas fa-cog fa-spin icon-loading"></i></div>
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
      props:['item','score'],
      methods: {

        getBody(score){
          let body = {
            Context : {
              MustSendToGrade: true
            },
            GameScore : {
              Header : {
                EventNumber: this.item.Header.EventNumber,
                ExternalGameNumber: this.item.Header.ExternalGameNumber,
                Source: this.item.Header.Source
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
              //this.loading = true;
              const requestOptions = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(this.getBody(score))
              };
              fetch(`${url}/api/grade`, requestOptions)
                  .then(response => {
//                    this.loading = false;
                    console.log(response);
                  })
          } catch (err) {
            this.loading = false;  
          }
        }
      }   
    }
</script>

<style scoped>

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
