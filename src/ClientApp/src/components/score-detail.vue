<template>    
    <div class="row scores-detail" v-if="item.Scores.length">
      <div class="col-12">
        <div class="row" style="min-height: 30px;">
          <div class="col-5 col-md-5  text-left detail">
          </div>
          <div class="col-7 col-md-7 text-right">
            <div class="period-cell text-center" v-for="(score, index) in item.Scores" :index="index" :key="index" data-toggle="tooltip" data-placement="top" :title="getTooltipContent(score.status,score.IsFinal)">
              <template v-if="item && (score.IsFinal && (score.Status === 'Pending'))">
                <IconGrade :item="item" :score="score"/>
              </template>
              <template v-if="score.Status === 'MismatchFound'">
                <IconExclamation/>
              </template>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-5 col-md-5 text-left detail-header" style="vertical-align: middle; line-height: 25px;">
            {{'Team'}}
          </div>
          <div v-if="item" class="col-7 col-md-7 text-right detail-header" style="vertical-align: middle; line-height: 25px;">
            <div class="period-cell" v-for="(score, index) in item.Scores" :index="index" :key="index" style="padding-left: 5px;">
              {{score.Period.Abbr}}
            </div>
          </div>
        </div>
      </div>     
      <div class="col-12">
        <div class="row">
          <div class="col-5 col-md-5 text-left detail">
            {{item?item.Participants.Away.Name:''}}
          </div>
          <div v-if="item" class="col-7 col-md-7 text-right">
            <div style="display: inline-block; line-height: 20px;">
              <div class="period-cell" v-for="(score, index) in item.Scores" :index="index" :key="index">
                <!-- {{`${score.Status}`}} -->
                <div 
                  style="min-width: 30px; height: 15px; line-height: 10px; vertical-align: middle;"
                  data-toggle="tooltip" data-placement="top" :title="getTooltipContent(score.Status,score.IsFinal)"
                  v-bind:style="{fontSize:score.Period.Abbr === 'FG'?'15px':'',color: score.Period.Abbr === 'FG'?'#ffc107':''}"
                  v-bind:class="{'blink_me': (score.IsFinal && score.Status === 'WasSendToGrade'),
                                  'graded': (score.IsFinal && score.Status === 'Graded'),
                                  'noline': (score.Status.toLowerCase() === 'noline'),
                                  'missmatch': (score.IsFinal && score.Status === 'MismatchFound'),
                                  }">
                   {{score.Away.Score}} 
                  </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-5 col-md-5 text-left detail">
              {{item?item.Participants.Home.Name:''}}
          </div>
          <div v-if="item" class="col-7 col-md-7 text-right">
            <div class="period-cell" v-for="(score, index) in item.Scores" :index="index" :key="index">              
              <div 
                style="min-width: 30px; height: 15px; line-height: 10px; vertical-align: middle;"
                data-toggle="tooltip" data-placement="top" :title="getTooltipContent(score.Status,score.IsFinal)"
                v-bind:style="{fontSize:score.Period.Abbr === 'FG'?'15px':'',color: score.Period.Abbr === 'FG'?'#ffc107':''}"
                v-bind:class="{'blink_me': (score.IsFinal && score.Status === 'WasSendToGrade'),
                               'graded': (score.IsFinal &&score.Status === 'Graded'),
                               'noline': (score.Status.toLowerCase() === 'noline'),
                               'missmatch': (score.IsFinal && score.Status === 'MismatchFound'),
                              }">
                  {{score.Home.Score}} 
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
    
    import IconGrade from './icon-grade.vue';
    import IconExclamation from './icon-exclamation.vue';

    export default {
      components: {IconGrade,IconExclamation},
      data () {
        return {
          loading: false
        }
      },      
      props:['item'],
      methods: {
        getTooltipContent(status,isFinal) {
          if(isFinal && (status === 'Graded')){
            return 'Graded'
          }else if(isFinal && (status === 'Pending')){
            return 'Pending to Grade'
          }else if(isFinal && (status === 'WasSentToGrade')){
            return 'Being Graded'
          }else if(isFinal && (status === 'MismatchFound')){
            return 'Mismatch Found'
          }else{
            return '';
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
    color: #9ca5ad;
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
      width:25px;
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

  .noline{
    color: #6c767d;
  }

  .missmatch{
    color: red !important;
  }

</style>
