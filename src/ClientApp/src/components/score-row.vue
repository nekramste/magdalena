<template>    
    <div class="row card score-row">
      <div class="col-12">
        <div class="row">
          <div class="col-8 text-left league">
            {{item.Header.SportSubType}}
          </div>
          <div class="col-4">
            <span class="score-period  float-right">{{item.CurrentScore.Period.Description}} {{item.Detail}}</span>
          </div>
        </div>
        <div class="row">
            <div class="col-5 text-center score">
              {{item.CurrentScore.Away.Score }}
            </div>
            <div class="col-2 text-center">
              {{' - '}}
            </div>
            <div class="col-5 text-center score">
              {{item.CurrentScore.Home.Score}}
            </div>
          </div>
      </div>
      <div class="col-12">
          <div class="row">
              <div class="col-5 text-center" v-bind:class="{'team-mobile':isOnMobile,'team':!isOnMobile}">
                  {{item.Participants.Away.Name }}
              </div> 
              <div class="col-2 text-center">                 
              </div>   
              <div class="col-5 text-center" v-bind:class="{'team-mobile':isOnMobile,'team':!isOnMobile}">
                {{item.Participants.Home.Name}}
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
      methods: { }
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

</style>
