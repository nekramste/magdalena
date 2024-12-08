<template>    
    <div class="row card score-row" v-bind:style="{'min-height': viewModeFull? '220px':'0px','background-color':item.Header.EventNumber === 0?'#2f435b':'#182f49'}">
      <div class="col-12">
        <div class="row">
          <div class="col-6 text-left league">
            <div class="row">
              <div class="col-4 col-sm-2 col-md-3 col-lg-3 pr-0 text-left">
                <div style="display: table-cell; cursor:pointer;" @click="copy(`${JSON.stringify(item.Header)}`)" :class="searchIcon(item.Header.SportType)"></div> 
              </div>
              <div class="col-8 col-sm-8 col-md-9 col-lg-9 px-0 text-left sportSybType ellipsis">
                <span> {{item.Header.SportSubType}} </span>
              </div>
            </div>
          </div>
          <div class="col-6" v-bind:style="{minHeight: viewModeFull?'40px':'0px'}">
            <div class="float-right" style="display: inline-flex;">
              <span style="font-size: 12px; min-height: 0px;" v-if="!(item.CurrentScore.IsFinal && item.CurrentScore.Period.Number === 0)">
                <Timer v-if="finalDateTime" :initialTime="initialTime" :intervalTime="countDownTime" :increase="isSoccer()" :date="finalDateTime" @onFinish="hideDetail" @onUpdateTimerDisplay="refreshTimeToDisplay"/>
              </span>
              <span v-if="(!(item.CurrentScore.IsFinal && item.CurrentScore.Period.Number === 0)) &&
                           !(item.CurrentScore.IsFinal && item.CurrentScore.Period.Number === 1 && isNotBaseballHockey())"
                    class="score-period">
                {{ (item.Header.SportType && item.Header.SportType.toLowerCase() !== 'tennis')? item.CurrentScore.Period.Description : '' }} {{ showDetail? (item.Detail + ' - '):'' }} {{`${hide_detail?'':dateTimeToDisplay?dateTimeToDisplay: showIfNotTime(item.Detail)}`}}
              </span>              
              <span v-if="(item.CurrentScore.IsFinal && item.CurrentScore.Period.Number === 0)" class="score-final">
                <span>{{ 'Final' }}</span>
              </span>
              <span v-if="(item.CurrentScore.IsFinal && item.CurrentScore.Period.Number === 1 && isNotBaseballHockey())" class="score-final">
                <span>{{ 'HALFTIME' }}</span>
              </span>
              <button v-if="showCloseButton" @click="deleteScore(item.Header)">X</button>
            </div>
          </div>
        </div>
        <div v-if="viewModeFull" class="row" style="height:60px;">
          <div class="col-6 text-center" v-bind:class="{'score':!isFinal(item),'score-final-current':isFinal(item),'animation':animate_score_a}">
            {{ item.Header.EventNumber !== 0?(item.Scores&&item.Scores.length>0)?item.Scores[0].Away.Score:'-': item.CurrentScore.Away.Score }}
          </div>
          <div class="col-6 text-center" v-bind:class="{'score':!isFinal(item),'score-final-current':isFinal(item),'animation':animate_score_b}">
            {{ item.Header.EventNumber !== 0?(item.Scores&&item.Scores.length>0)?item.Scores[0].Home.Score:'-': item.CurrentScore.Home.Score }}
          </div>
          <div class="col-12 text-center" v-bind:class="{'score':!isFinal(item),'score-final-current':isFinal(item)}" style="margin-top:-60px;">
            {{' - '}}
          </div>
        </div>
      </div>
      <div v-if="viewModeFull" class="col-12">
        <div class="row">
          <div class="col-6 text-center" v-bind:class="{'team':!isOnMobile,'team-mobile':isOnMobile }">
              <span class="rotation">{{!isOnMobile?item.Participants.Away.Rotation:''}}</span>{{'  '}}<span>{{item.Participants.Away.Name }}</span>
          </div>
          <div class="col-6 text-center" v-bind:class="{'team':!isOnMobile,'team-mobile':isOnMobile }">
              <span class="rotation">{{!isOnMobile?item.Participants.Home.Rotation:''}}</span>{{'  '}}<span>{{item.Participants.Home.Name}}</span>
          </div>
        </div>
      </div>
      <div class="col-12">
        <ScoreDetail :item="item" :viewModeFull="viewModeFull" :animate_score_a="animate_score_a" :animate_score_b="animate_score_b" :debug="debug"/>
      </div>
    </div>
</template>

<script>

    import { ref } from "vue";
    import { useClipboard } from '@vueuse/core';
    import ScoreDetail from './Detail/score-detail';
    import Timer from './Timer.vue';
    import config from '../../common/config';
    import { mapActions } from 'vuex';

    const WAIT_SECONDS_ANIMATION = 15;
    const WAIT_SECONDS_TO_HIDE_DETAIL = 30;
    const WAIT_SECONDS_TO_HIDE_DETAIL_SOCCER = 45;

    const source = ref('msg')
    const { copy } = useClipboard({ source });

    export default {
      components: {ScoreDetail,Timer},
      data () {
        return {
          animate_score_a: false,
          animate_score_b: false,
          hide_detail: false,
          countDownTime: WAIT_SECONDS_TO_HIDE_DETAIL,
          finalDateTime: null,
          displayMinutes: null,
          displaySeconds: null,
          initialTime: null,
          dateTimeToDisplay: null,
          useDifferentWaitingTimeForSoccer: config.USE_DIFFERENT_WAITING_TIME_SOCCER,
          showDetail: config.SHOW_DETAIL_DEBUG,
          showCloseButton: config.SHOW_DELETE_ICON
        }
      },
      props:['item','isOnMobile','viewModeFull','debug'],
      watch: {

        item(newValue, oldValue) {
          if(newValue !== oldValue){                                                          

            if(newValue.Header.EventNumber === oldValue.Header.EventNumber &&
              newValue.Header.ExternalGameNumber === oldValue.Header.ExternalGameNumber &&
              newValue.Header.Source === oldValue.Header.Source &&
              newValue.Header.SportSubType === oldValue.Header.SportSubType &&
              newValue.Header.SportType === oldValue.Header.SportType){
              
              this.restartCountDown(this.item);
              
              if(this.item.Header.EventNumber === 0){
                if(newValue.CurrentScore.Away.Score !== oldValue.CurrentScore.Away.Score){                
                  this.startAnimationA('AWAY');
                }
                if(newValue.CurrentScore.Home.Score !== oldValue.CurrentScore.Home.Score){                
                  this.startAnimationB('HOME');
                }
              }else{
                let periodNumber = 0;
                if(newValue.Scores[periodNumber].Away.Score !== oldValue.Scores[periodNumber].Away.Score){                
                  this.startAnimationA('AWAY');
                }
                if(newValue.Scores[periodNumber].Home.Score !== oldValue.Scores[periodNumber].Home.Score){                
                  this.startAnimationB('HOME');
                }
              }
            }
          } 
        }
      },
      methods: {
        ...mapActions(['deleteScore']),
        copy(data){
          copy(data);
        },
        showIfNotTime(data){
          if(data){
            let detailParts = data.split(':');
            if(detailParts.length === 2){
              return ''
            }else{
              return data;
            }
          }
          return '';
        },
        refreshTimeToDisplay(dateTime){
          if(this.isSoccer()){
            this.dateTimeToDisplay = dateTime;
          }else{
            this.dateTimeToDisplay = this.item.Detail?this.item.Detail:'';
          }
        },
        isSoccer(){
          if(this.item && Object.hasOwn(this.item, 'Header') && Object.hasOwn(this.item.Header, 'SportType')){
            return (this.item.Header.SportType.toLowerCase().indexOf("soccer")>-1);
          }else{
            return false;
          }
        },
        isNotBaseballHockey(){
          return !((this.item.Header.SportType.toLowerCase().indexOf("baseballl")>-1) || (this.item.Header.SportType.toLowerCase().indexOf("hockey")>-1));
        },
        setCountDownTime(){
          if(this.isSoccer() && this.useDifferentWaitingTimeForSoccer){
            this.countDownTime = WAIT_SECONDS_TO_HIDE_DETAIL_SOCCER;
          }else{
            this.countDownTime = WAIT_SECONDS_TO_HIDE_DETAIL;
          }
        },
        async restartCountDown(item){
          this.hide_detail = false;
          this.finalDateTime = null;          
          this.initialTime = { minutes: 0, seconds: 0 };
          this.setCountDownTime();
          await new Promise(resolve => setTimeout(resolve, 500));
          if(item.Detail){
            let detailParts = item.Detail.split(':');
            if(detailParts.length === 2){
              var newDate = new Date();
              newDate.setSeconds(newDate.getSeconds() + this.countDownTime);
              this.initialTime = { minutes: detailParts[0], seconds: detailParts[1] };
              this.finalDateTime=newDate;
            }
          }
        },
        hideDetail(){
          this.finalDateTime = null;
          this.hide_detail = true;          
        },
        isFinal(item){
          return ((item.Scores && (item.Scores.length>0) && item.Scores[0].IsFinal));
        },
        async startAnimationA(type){
          this.evaluateAnimation(type,true);
          await new Promise(resolve => setTimeout(resolve, WAIT_SECONDS_ANIMATION*1000)); 
          this.resetAnimation(type);          
        },
        async startAnimationB(type){
          this.evaluateAnimation(type,true);
          await new Promise(resolve => setTimeout(resolve, WAIT_SECONDS_ANIMATION*1000)); 
          this.resetAnimation(type);          
        },
        resetAnimation(type){
          this.evaluateAnimation(type,false);
        },
        evaluateAnimation(type,value){
          if(type === 'AWAY'){ this.animate_score_a = value; }
          if(type === 'HOME'){ this.animate_score_b = value; }
        },
        searchIcon(sportName){          

          var iconName = "";

          if(sportName){

            let sportName_ = sportName.toLowerCase();
            
            if(sportName_.indexOf("soccer")>-1){
              iconName = "sport icon-soccer";
            }else if(sportName_.indexOf("hockey")>-1){
              iconName = "sport icon-hockey";
            }else if(sportName_.indexOf("football")>-1){
              iconName = "sport icon-football";
            }else if(sportName_.indexOf("boxing")>-1){
              iconName = "sport icon-boxing";
            }else if(sportName_.indexOf("basketball")>-1){
              iconName = "sport icon-basketball";
            }else if(sportName_.indexOf("golf")>-1){
              iconName = "sport icon-golf";
            }else if(sportName_.indexOf("baseball")>-1){
              iconName = "sport icon-baseball";
            }else if(sportName_.indexOf("motor")>-1){
              iconName = "sport icon-motor";
            }else if(sportName_.indexOf("esports")>-1){
              iconName = "sport icon-esport";    
            }else if(sportName_.indexOf("rugby")>-1){
              iconName = "sport icon-rugby";
            }else if(sportName_.indexOf("horse")>-1){
              iconName = "sport icon-horse";
            }else if(sportName_.indexOf("table tennis")>-1){
              iconName = "sport icon-tabletennis";  
            }else if(sportName_.indexOf("tennis")>-1){
              iconName = "sport icon-tennis";
            }else if(sportName_.indexOf("mma")>-1){
              iconName = "sport icon-mma"; 
            }else if(sportName_.indexOf("trophy")>-1){
              iconName = "sport icon-trophy"; 
            }else if(sportName_.indexOf("simulation")>-1){
              iconName = "sport icon-simulation";
            }else{
              iconName = "fa-folder";
            }
          }
          return iconName;
        }        
      },
      created () {
      },
      mounted() {
        this.setCountDownTime();
        this.restartCountDown(this.item);
      }
    }
</script>

<style scoped>
  .score {
    font-size: 26px;
    font-weight: bold;
    color: #17a2b8;
    vertical-align: middle;    
    line-height: 60px;
  }
  .score-final-current{
    font-size: 26px;
    font-weight: bold;
    color: #ffc107;
    vertical-align: middle;    
    line-height: 60px;
  }
  .score-row {
    margin-top: 10px;
    padding-top: 10px;
    padding-bottom: 10px;
    margin-left: -5px;
    margin-right: -5px;
    background: #182f49;
  }
  .click{
    cursor:pointer;
  }
  .score-period {
    color: #28a745;
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
  .rotation {
    color: #909090;
    font-size: 13px;
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
    color: #ffc107;
    text-transform: uppercase;
  }

  .team{
    font-weight: bold;
    color: white;
  }

  .team-mobile{
    font-size:14px;
    font-weight: bold;
    color: white;
  }

  .menu-icon{
    color: white;
  }

  .menu-icon:hover{
    color: #ff4a70;
  }

  .score-final{
    color: #BDBDBD;
    font-size: 12px;
    font-weight: bold;
    padding-bottom: 3px;
  }

  .sportSybType{
    display: table-cell;
    padding-left:0px;
    padding-top:2px;    
  }

  .ellipsis{
    white-space: nowrap;
    overflow: hidden;
    text-overflow:ellipsis;    
  }

  .sport{  
    width: 50px;
    height: 50px;     
    background: url('../../assets/sports-sprite.png'); 
    background-color:transparent;
    background-repeat:no-repeat;
    display:block;
    filter: invert(80%) sepia(20%) saturate(2462%) hue-rotate(349deg) brightness(120%) contrast(108%);
    zoom: 0.45;
      -moz-transform: scale(0.45);
      -moz-transform-origin: left center;
  }

  .icon-soccer{          
    background-position: -55px 0px;   
  }

  .icon-hockey{      
    background-position: -110px 0px;
  }

  .icon-football{      
    background-position: -165px 0px;
  }

  .icon-boxing{      
    background-position: -220px 0px;
  }

  .icon-basketball{      
    background-position: -275px 0px;  
  }

  .icon-golf{      
    background-position: -330px 0px; 
  }

  .icon-baseball{      
    background-position: -385px 0px;
  }

  .icon-motor{      
    background-position: -440px 0px;  
  }

  .icon-esport{      
    background-position: -495px 0px; 
  }

  .icon-rugby{      
    background-position: -550px 0px; 
  }

  .icon-horse{      
    background-position: -605px 0px;  
  }

  .icon-tennis {    
    background-position: -660px 0px;
  }

  .icon-mma {      
    background-position: -715px 0px;
  }

  .icon-simulation {
    background-position: -765px 0px;
  }

  .icon-tabletennis {
    background-position: -820px 0px;
  }

  .icon-trophy {
    background-position: 0px 0px;
  }

  .animation {    
    animation: color-change 1s infinite;
  }

  @keyframes color-change {
    0% { color: #17A2B8; font-size: 26px; }
    50% { color: #E83E8C; font-size: 30px; }
    100% { color: #17A2B8; font-size: 26px; }
  }

</style>
