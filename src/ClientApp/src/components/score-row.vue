<template>    
    <div class="row card score-row">
      <div class="col-12">
        <div class="row">
          <div class="col-8 text-left league">
            <div style="display:inline-block">
              <div style="display: table-cell;" :class="SearchIcon(item.Header.SportType)"></div> <div style="display: table-cell; padding-left:10px;"> {{item.Header.SportSubType}} </div>
            </div>
          </div>
          <div class="col-4">
            <span v-bind:class="{'score-period': !(item.CurrentScore.IsFinal && item.CurrentScore.Period.Number === 0),
                                 'score-final': (item.CurrentScore.IsFinal && item.CurrentScore.Period.Number === 0)}" class=" float-right">
              {{ (item.CurrentScore.IsFinal && item.CurrentScore.Period.Number === 0)? 'Finished' : item.CurrentScore.Period.Description }} {{item.Detail}}</span>
          </div>
        </div>
        <div class="row">
            <div class="col-5 text-center score">
              {{item.CurrentScore.Away.Score}}
            </div>
            <div class="col-2 text-center score">
              {{' - '}}
            </div>
            <div class="col-5 text-center score">
              {{item.CurrentScore.Home.Score}}
            </div>
          </div>
      </div>
      <div class="col-12">
          <div class="row">
              <div class="col-6 text-center" v-bind:class="{'team-mobile':isOnMobile,'team':!isOnMobile}">
                  <span class="rotation">{{item.Participants.Away.Rotation}}</span>{{'  '}}{{item.Participants.Away.Name }}
              </div> 
              <div class="col-6 text-center" v-bind:class="{'team-mobile':isOnMobile,'team':!isOnMobile}">
                  <span class="rotation">{{item.Participants.Home.Rotation}}</span>{{'  '}}{{item.Participants.Home.Name}}
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
    export default {
      components: {ScoreDetail},
      data () {
        return {          
        }
      },
      props:['item'],
      methods: { 

        SearchIcon(sportName){          

          var iconName = "";
            
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
          
          return iconName;
        }
        
      }
    }
</script>

<style scoped>
  .score {
    font-size: 26px;
    font-weight: bold;
    color: #17a2b8;
  }
  .score-row {
    margin-top: 10px;
    padding-top: 10px;
    padding-bottom: 10px;
    min-height: 200px;
    margin-left: 10px;
    margin-right: 10px;
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
    max-width: 85px;
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
    font-size:12px;
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

  .sport{  
    width: 50px;
    height: 50px;     
    background: url('../assets/sports-sprite.png'); 
    background-color:transparent;
    background-repeat:no-repeat;
    display:block;
    zoom: 0.45;
      -moz-transform: scale(0.45);
      -moz-transform-origin: left center;
  }

  .icon-soccer{          
    background-position: -55px -55px;   
  }

  .icon-hockey{      
    background-position: -110px -55px;
  }

  .icon-football{      
    background-position: -165px -55px;
  }

  .icon-boxing{      
    background-position: -220px -55px;
  }

  .icon-basketball{      
    background-position: -275px -55px;  
  }

  .icon-golf{      
    background-position: -330px -55px; 
  }

  .icon-baseball{      
    background-position: -385px -55px;
  }

  .icon-motor{      
    background-position: -440px -55px;  
  }

  .icon-esport{      
    background-position: -495px -55px; 
  }

  .icon-rugby{      
    background-position: -550px -55px; 
  }

  .icon-horse{      
    background-position: -605px -55px;  
  }

  .icon-tennis {    
    background-position: -660px -55px;
  }

  .icon-mma {      
    background-position: -715px -55px;
  }

  .icon-simulation {
    background-position: -765px -55px;
  }

  .icon-tabletennis {
    background-position: -820px -55px;
  }

  .icon-trophy {
    background-position: 0px -55px;
  }

</style>
