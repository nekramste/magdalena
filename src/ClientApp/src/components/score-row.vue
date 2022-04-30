<template>    
    <div class="row card score-row" v-bind:style="{'background-color':item.Header.EventNumber === 0?'#2f435b':'#182f49'}">
      <div class="col-12">
        <div class="row">
          <div class="col-6 text-left league">
            <div class="row">
              <div class="col-4 col-sm-2 col-md-3 col-lg-3 pr-0 text-left">
                <div style="display: table-cell;" :class="searchIcon(item.Header.SportType)"></div> 
              </div>
              <div class="col-8 col-sm-8 col-md-9 col-lg-9 px-0 text-left sportSybType ellipsis">
                <span> {{item.Header.SportSubType}} </span>
              </div>
            </div>
          </div>
          <div class="col-6" style="min-height:40px;">
            <span v-bind:class="{'score-period': !(item.CurrentScore.IsFinal && item.CurrentScore.Period.Number === 0),
                                 'score-final': (item.CurrentScore.IsFinal && item.CurrentScore.Period.Number === 0)}" class=" float-right">
              {{ (item.Header.SportType && item.Header.SportType.toLowerCase() !== 'tennis')? item.CurrentScore.Period.Description : '' }} {{hide_detail?'':item.Detail}}</span>
          </div>
        </div>
        <div class="row" style="height:60px;">
          <div class="col-6 text-center score" v-bind:class="{'animation':animate_score_a}">
              {{item.CurrentScore.Away.Score}}
            </div>
            <div class="col-6 text-center score" v-bind:class="{'animation':animate_score_b}">
              {{item.CurrentScore.Home.Score}}
            </div>
            <div class="col-12 text-center score" style="margin-top:-60px;">
              {{' - '}}
            </div>
          </div>
      </div>
      <div class="col-12">
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
        <ScoreDetail :item="item" />
      </div>
    </div>
</template>

<script>
    import ScoreDetail from './score-detail';

    const WAIT_SECONDS_ANIMATION = 5;
    const WAIT_SECONDS_TO_HIDE_DETAIL = 10;

    export default {
      components: {ScoreDetail},
      data () {
        return {       
          animate_score_a: false,
          animate_score_b: false,
          hide_detail: false
        }
      },
      props:['item','isOnMobile'],
      watch: {
        item(newValue, oldValue) {
          if(newValue !== oldValue){
            
            if(newValue.CurrentScore.Detail === oldValue.CurrentScore.Detail){
              this.hide_detail = true;
            }else{
              this.hide_detail = false;              
              this.setTimerToHide();
            }

            if(newValue.Header.EventNumber === oldValue.Header.EventNumber &&
              newValue.Header.ExternalGameNumber === oldValue.Header.ExternalGameNumber &&
              newValue.Header.Source === oldValue.Header.Source &&
              newValue.Header.SportSubType === oldValue.Header.SportSubType &&
              newValue.Header.SportType === oldValue.Header.SportType){
              
              if(newValue.CurrentScore.Away.Score !== oldValue.CurrentScore.Away.Score){                
                this.startAnimation('AWAY');
              }
              if(newValue.CurrentScore.Home.Score !== oldValue.CurrentScore.Home.Score){                
                this.startAnimation('HOME');
              }
            }
          } 
        }
      },
      
      methods: { 
        async startAnimation(type){          
          this.evaluateAnimation(type,true);
          await new Promise(resolve => setTimeout(resolve, WAIT_SECONDS_ANIMATION*1000)); 
          this.resetAnimation(type);          
        },
        async setTimerToHide(){
          await new Promise(resolve => setTimeout(resolve, WAIT_SECONDS_TO_HIDE_DETAIL*1000)); 
          this.hide_detail = true;
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
            
            if(sportName.toLowerCase().indexOf("soccer")>-1){
              iconName = "sport icon-soccer";
            }else if(sportName.toLowerCase().indexOf("hockey")>-1){
              iconName = "sport icon-hockey";
            }else if(sportName.toLowerCase().indexOf("football")>-1){
              iconName = "sport icon-football";
            }else if(sportName.toLowerCase().indexOf("boxing")>-1){
              iconName = "sport icon-boxing";
            }else if(sportName.toLowerCase().indexOf("basketball")>-1){
              iconName = "sport icon-basketball";
            }else if(sportName.toLowerCase().indexOf("golf")>-1){
              iconName = "sport icon-golf";
            }else if(sportName.toLowerCase().indexOf("baseball")>-1){
              iconName = "sport icon-baseball";
            }else if(sportName.toLowerCase().indexOf("motor")>-1){
              iconName = "sport icon-motor";
            }else if(sportName.toLowerCase().indexOf("esports")>-1){
              iconName = "sport icon-esport";    
            }else if(sportName.toLowerCase().indexOf("rugby")>-1){
              iconName = "sport icon-rugby";
            }else if(sportName.toLowerCase().indexOf("horse")>-1){
              iconName = "sport icon-horse";
            }else if(sportName.toLowerCase().indexOf("table tennis")>-1){
              iconName = "sport icon-tabletennis";  
            }else if(sportName.toLowerCase().indexOf("tennis")>-1){
              iconName = "sport icon-tennis";
            }else if(sportName.toLowerCase().indexOf("mma")>-1){
              iconName = "sport icon-mma"; 
            }else if(sportName.toLowerCase().indexOf("trophy")>-1){
              iconName = "sport icon-trophy"; 
            }else if(sportName.toLowerCase().indexOf("simulation")>-1){
              iconName = "sport icon-simulation";
            }else{
              iconName = "fa-folder";
            }  

          }
          
          return iconName;
        }        
      },      
      mounted() {
        this.setTimerToHide();
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
  .score-row {
    margin-top: 10px;
    padding-top: 10px;
    padding-bottom: 10px;
    min-height: 220px;
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
    color: #BDBDBD;
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
    background: url('../assets/sports-sprite.png'); 
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
