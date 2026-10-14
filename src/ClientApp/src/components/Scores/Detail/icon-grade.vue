<template>    
    <div>    
        <i v-if="!loading && score.IsFinal && score.Status === 'Pending'" @click="send(score)" class="fas fa-check icon-pending click" :class="{'icon-failed': failed}" data-toggle="tooltip" data-placement="top" :title="failed ? failedMessage : 'Pending'"/>
        <i v-if="!loading && score.IsFinal && score.Status === 'WasSendToGrade'" class="fas fa-task icon-was-send" data-toggle="tooltip" data-placement="top" title="Was send to grade"/>
        <div v-if="loading"><i class="fas fa-cog fa-spin icon-loading"></i></div>
    </div>
</template>

<script>

    import config from '../../../common/config';
    
    const GRADE_REQUEST_TIMEOUT_SECONDS = 30;    
    const GRADE_CONFIRMATION_TIMEOUT_SECONDS = 30;

    export default {
      data () {
        return {
          loading: false,
          failed: false,
          failedMessage: ''
        }
      },
      created () {
        // Kept outside data() on purpose: timer handles do not need to be reactive.
        this.confirmationTimer = null;
      },
      beforeUnmount () {
        if (this.confirmationTimer !== null) {
          clearTimeout(this.confirmationTimer);
          this.confirmationTimer = null;
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

        // Builds a readable message from the error JSON returned by ErrorHandlingMiddleware.
        async readErrorMessage(response) {
          try {
            const data = await response.json();
            if (data && data.message) {
              return `${data.message} (HTTP ${response.status})`;
            }
          } catch (e) {
            // Body was empty or not JSON; fall back to the status code.
          }
          return `HTTP ${response.status}`;
        },

        send: async function (score) {
          // Ignore clicks while a request is in flight or awaiting confirmation;
          // previously every click sent another grade request.
          if (this.loading) {
            return;
          }

          var url = config.API_URL;

          this.loading = true;
          this.failed = false;
          this.failedMessage = '';

          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), GRADE_REQUEST_TIMEOUT_SECONDS * 1000);

          try {
            const requestOptions = {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(this.getBody(score)),
              signal: controller.signal
            };
            const response = await fetch(`${url}/api/grade`, requestOptions);
            if (!response.ok) {
              throw new Error(await this.readErrorMessage(response));
            }
            this.confirmationTimer = setTimeout(() => {
              this.confirmationTimer = null;
              this.loading = false;
            }, GRADE_CONFIRMATION_TIMEOUT_SECONDS * 1000);
          } catch (err) {
            console.error('Grade request failed', err);
            const reason = (err && err.name === 'AbortError')
              ? `no response after ${GRADE_REQUEST_TIMEOUT_SECONDS}s`
              : (err && err.message) || 'unknown error';
            this.failed = true;
            this.failedMessage = `Grade request failed: ${reason}. Click to retry.`;
            this.loading = false;
          } finally {
            clearTimeout(timeoutId);
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
  
  .icon-pending.icon-failed{
    color: #DC3545;
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
