<template>    
    <div class="row detail">
      <div class="col-12">
        <div class="row">
            <div class="col-6 text-left detail">
                {{'Team'}}
            </div>
            <div v-if="item" class="col-6 text-right">
                <div class="period-cell" v-for="(score, index) in item.Message.Scores" :index="index" :key="index">
                    <span class="">{{score.Period.Number}}</span>
                </div>
            </div>
        </div>
      </div>     
      <div class="col-12">
        <div class="row">
            <div class="col-6 text-left detail">
                {{item?item.Message.Participants.Away.Name:''}}
            </div>
            <div v-if="item" class="col-6 text-right">
                <div class="period-cell" v-for="(score, index) in item.Message.Scores" :index="index" :key="index">                    
                    <span class="">{{score.Away.Score}}</span>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-6 text-left detail">
                {{item?item.Message.Participants.Home.Name:''}}
            </div>
            <div v-if="item" class="col-6 text-right">
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
        font-size: 13px;
        color: white
    }

    .team{
        font-weight: bold;
        color: transparent;
    }

    .period-cell{
        padding-top: 5px;
        width:10px;
    }
</style>
