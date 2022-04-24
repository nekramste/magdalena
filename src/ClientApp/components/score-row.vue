<template>    
    <div class="row card score-row">
      <div class="col-12">
        <div class="row">
            <div class="col-12 text-right score-period">
              {{item.Message.Score.Period.Description}} -{{item.Message.Detail}}
            </div>
          </div>

        <div class="row">
            <div class="col-5 text-center score">
              {{item.Message.Score.Home.Score }}
            </div>
            <div class="col-2 text-center score">
              {{' - '}}
            </div>
            <div class="col-5 text-center score">
              {{item.Message.Score.Away.Score}}
            </div>
          </div>
      </div>
      <div class="col-12">
          <div class="row">
              <div class="col-5 text-center">
                  {{item.Message.Score.Home.Participant.Name }}
              </div> 
              <div class="col-2 text-center">                 
              </div>   
              <div class="col-5 text-center">
                  {{item.Message.Score.Away.Participant.Name}}
              </div>  
              <div class="col-3 text-center click">
                  <icon v-if="item.Message.Score.IsFinal" @click="send()" :icon="'check'" class="mr-2 menu-icon" />
              </div>   
          </div>              
      </div>
    </div>
</template>

<script>
    export default {
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
    .score{
        font-size: 24px;
        font-weight: bold;
    }
    .score-row{
        margin-top:10px;
        padding-top: 10px;
        padding-bottom: 10px;
        min-height:120px;
        margin-left:10px;
        margin-right:10px
    }
    .click{
        cursor:pointer;
    }
    .score-period {
      color: #188038;
      font-size: 12px;
      font-weight: bold
    }
</style>
