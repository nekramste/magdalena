<template>    
    <div class="row scores-detail" v-if="item.Scores.length">
      <div class="col-12">
        <div class="row" v-bind:style="{minHeight: viewModeFull?'30px':'0px'}">
          <div v-if="debug" class="col-12 detail pr-0 text-left">
            <span ref="msg"> {{`${JSON.stringify(item)}`}} </span>
            <button style="margin-left: 10px; padding: 10px; border-radius: 15px; font-weight: bold;" @click="copy(`${JSON.stringify(item)}`)">
              Copy Message
            </button>
          </div>
          <div class="col-5 col-md-5  text-left detail pr-0">
            <!-- {{`${JSON.stringify(item.Header)}`}} -->
          </div>
          <div class="col-7 col-md-7 text-right">
            <div class="period-cell text-center" v-for="(score, index) in sortedScores" :index="index" :key="index" data-toggle="tooltip" data-placement="top" :title="getTooltipContent(score.status,score.IsFinal)">
              <template v-if="item && (score.IsFinal && (score.Status === 'Pending'))">
                <div style="margin-right: -7px;">
                  <IconGrade :item="item" :score="score"/>
                </div>
              </template>
              <template v-if="score.Status === 'MismatchFound'">
                <div style="margin-right: -7px;">
                  <IconExclamation/>
                </div>
              </template>
            </div>
          </div>
        </div>
        <div class="row" style="margin-bottom: -5px; text-align: center; justify-content: center;" v-bind:style="{minHeight: viewModeFull?'10px':'0px'}">
          <div class="col-5 col-md-5  text-left detail pr-0">
          </div>
          <div class="col-7 col-md-7 text-right justify-content-center">
            <div class="period-cell text-center justify-content-center" v-for="(score, index) in sortedScores" :index="index" :key="index" data-toggle="tooltip" data-placement="top" :title="getTooltipContent(score.status,score.IsFinal)">
              <template v-if="(item.CurrentScore.Period.Number === score.Period.Number) || ((score.Period.Number === 0) && (score.Period.IsOvertime))">
                <div v-if="(!score.Period.IsOvertime)" style="margin-bottom:-10px; margin-right: -7px;">
                  <svg style="transform: rotate(270deg); margin-bottom: 3px;" class="" aria-label="Winner" height="8" role="img" width="6"><polygon fill="#FFF" points="6,0 6,8 0,4"></polygon></svg>
                </div>
                <div v-if="(score.Period.Number === 0) && (score.Period.IsOvertime)" style="margin-bottom:-10px; margin-right: -7px;">
                  <svg style="transform: rotate(270deg); margin-bottom: 3px;" class="" aria-label="Winner" height="8" role="img" width="6"><polygon fill="#FFF" points="6,0 6,8 0,4"></polygon></svg>
                </div>
              </template>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-5 col-md-5 text-left detail-header pr-0" style="vertical-align: middle; line-height: 25px; color:#cccecf; vertical-align: middle;">
            <!-- {{`${(JSON.stringify(this.item.Header))}`}} -->
            <div style="padding-top: 4px;">
              <span style="margin-left: 2px;">{{`${getDateTimeFormattedWithTodayHandling(this.item.Header.GameDateTime)} ET`}}</span>
            </div>
          </div>
          <div v-if="item" class="col-7 col-md-7 text-right detail-header" style="vertical-align: middle; line-height: 25px;">
            <div class="period-cell" v-for="(score, index) in sortedScores" :index="index" :key="index" style="padding-left: 0px;">
              <span style="margin-right: -5px;" v-if="score">
                {{score.Period.Abbr}}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="col-12">
        <div class="row">
          <div class="col-5 col-md-5 text-left detail pr-0" style="display: inline-block; text-overflow: ellipsis; white-space: nowrap; overflow: hidden;" v-bind:class="{'bold':isAwayGreater}">
            <svg v-if="isAwayGreater" style="transform: rotate(180deg); margin-bottom: 3px; margin-left: -6px;" class="" aria-label="Winner" height="8" role="img" width="6"><polygon fill="#FFF" points="6,0 6,8 0,4"></polygon></svg>
            <span v-if="(!viewModeFull)" style="padding: 2px; line-height: 22px; color:#909090;">
              {{item?`${item.Participants.Away.Rotation}`:''}}
            </span>
            <span style="padding: 2px; line-height: 22px;">
              {{item?`${viewModeFull?'':' '}${item.Participants.Away.Name}`:''}}
            </span>
          </div>
          <div v-if="item" class="col-7 col-md-7 text-right">
            <div style="display: inline-block; line-height: 20px;">
              <template v-for="(score, index) in sortedScores" :index="index" :key="index">                
                <SubRowScore 
                  :score="score"
                  :viewModeFull="viewModeFull"
                  :animate_score="animate_score_a"
                  :getTooltipContent="getTooltipContent"
                  type="Away"
                  :item="item"
                />
              </template>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-5 col-md-5 text-left detail pr-0" style="display: inline-block; text-overflow: ellipsis; white-space: nowrap; overflow: hidden;" v-bind:class="{'bold':isHomeGreater}">
            <svg v-if="isHomeGreater" style="transform: rotate(180deg); margin-bottom: 3px; margin-left: -6px;" class="" aria-label="Winner" height="8" role="img" width="6"><polygon fill="#FFF" points="6,0 6,8 0,4"></polygon></svg>                            
            <span v-if="(!viewModeFull)" style="padding: 2px; line-height: 22px; color:#909090;">
              {{item?`${item.Participants.Home.Rotation}`:''}}
            </span>
            <span style="padding: 2px; line-height: 22px;">
              {{item?`${viewModeFull?'':' '}${item.Participants.Home.Name}`:''}}
            </span>
          </div>
          <div v-if="item" class="col-7 col-md-7 text-right">
            <div style="display: inline-block; line-height: 20px;">
              <template v-for="(score, index) in sortedScores" :index="index" :key="index">                
                <SubRowScore 
                  :score="score"
                  :viewModeFull="viewModeFull"
                  :animate_score="animate_score_b"
                  :getTooltipContent="getTooltipContent"
                  type="Home"
                  :item="item"
                />
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
    
    import { ref, toRaw } from "vue";
    import { useClipboard } from '@vueuse/core';

    import IconGrade from './icon-grade.vue';
    import IconExclamation from './icon-exclamation.vue';
    import SubRowScore from './score-sub-detail-row.vue';
    import moment from 'moment';
    import "moment-timezone";
    import helpers from '../../../common/helpers.js'

    const source = ref('msg')
    const { copy } = useClipboard({ source });

    export default {
      components: {SubRowScore,IconGrade,IconExclamation},
      data () {
        return {
          loading: false,
        }
      },      
      props:['item','viewModeFull','animate_score_a','animate_score_b','debug'],
      computed:{
        sortedScores(){
          const item = toRaw(this.item);
          const clone = { ...item }
          if(helpers.propertyExists(clone,'Scores')){
            let scores = [];
            if(clone.Scores.length>1){
              for(let i = 1; i<(clone.Scores.length); i++){ scores.push(clone.Scores[i]) }
              scores.push(clone.Scores[0]);
            }else{
              return clone.Scores;
            }
            return scores;
          }else{
            return [];
          }
        },
        isAwayGreater(){
           let awayScore = (this.item.Header.EventNumber !== 0)?(this.item.Scores&&this.item.Scores.length>0)?this.item.Scores[0].Away.Score:0: this.item.CurrentScore.Away.Score;
           let homeScore = (this.item.Header.EventNumber !== 0)?(this.item.Scores&&this.item.Scores.length>0)?this.item.Scores[0].Home.Score:0: this.item.CurrentScore.Home.Score;
           return (awayScore>homeScore);
        },
        isHomeGreater(){
           let awayScore = (this.item.Header.EventNumber !== 0)?(this.item.Scores&&this.item.Scores.length>0)?this.item.Scores[0].Away.Score:0: this.item.CurrentScore.Away.Score;
           let homeScore = (this.item.Header.EventNumber !== 0)?(this.item.Scores&&this.item.Scores.length>0)?this.item.Scores[0].Home.Score:0: this.item.CurrentScore.Home.Score;
           return (homeScore>awayScore);
        }
      },
      methods: {
        copy(data){
          copy(data);
        },
        getDateTimeFormattedWithTodayHandling(date){
          const format = 'ddd, MMM DD. hh:mm A';
          const separator = '.'
          let newDate = moment(date).format(format).toString().split(separator);
          let todayDate = moment(new Date()).tz("America/New_York").format(format).toString().split(separator);
          if(newDate[0] === todayDate[0]){
            return newDate[1];
          }else{
            return `${newDate[0]} ${newDate[1]}`
          }
        },        
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
    padding-top: 0px;
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
    padding-top: 0px;
    width:25px;
  }
  .period-cell-header {
    color: #CCC;
    text-align: right;
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

  .bold{
    font-weight: bold;
  }

  .animation {
    font-size: 15px !important;
    animation: color-change 1s infinite;
  }

  @keyframes color-change {
    0% { color: #17A2B8; font-size: 26px; }
    50% { color: #E83E8C; font-size: 30px; }
    100% { color: #17A2B8; font-size: 26px; }
  }

</style>
