<template>    
    <div class="row detail">
      <div class="col-12">
        <div class="row">
            <div v-bind:class="{'col-5':isOnMobile,'col-6':!isOnMobile}" class="text-left detail-header">
                {{'Team'}}
            </div>
            <div v-if="item" v-bind:class="{'col-7':isOnMobile,'col-6':!isOnMobile}" class="text-right">
                <div class="period-cell" v-for="(score, index) in item.Message.Scores" :index="index" :key="index">
                    {{score.Period.Number}}
                </div>
            </div>
        </div>
      </div>     
      <div class="col-12">
        <div class="row">
            <div v-bind:class="{'col-5':isOnMobile,'col-6':!isOnMobile}" class="text-left detail">
                {{item?item.Message.Participants.Away.Name:''}}
            </div>
            <div v-if="item" v-bind:class="{'col-7':isOnMobile,'col-6':!isOnMobile}" class="text-right">
                <div style="display: inline-block">
                    <div class="period-cell" v-for="(score, index) in item.Message.Scores" :index="index" :key="index">                    
                        {{score.Away.Score}}
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div v-bind:class="{'col-5':isOnMobile,'col-6':!isOnMobile}" class="text-left detail">
                {{item?item.Message.Participants.Home.Name:''}}
            </div>
            <div v-bind:class="{'col-7':isOnMobile,'col-6':!isOnMobile}" v-if="item" class="text-right">
                <div class="period-cell" v-for="(score, index) in item.Message.Scores" :index="index" :key="index">                    
                    <span class="">{{score.Home.Score}}</span>
                </div>
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
      }      
    }
</script>

<style scoped>    
    .detail {
        padding-top: 5px;
        font-size: 12px;
        color: white
    }
    .detail-header{
        color: #CCC;
    }

  .team {
    font-weight: bold;
    color: transparent;
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
</style>
