<template>
  <div class="home">
    <div class="container-fluid" style="padding-left:0px;">
      <div class="row" v-bind:style="{height: debug?'140px':'60px'}">
        <div class="col-12" style="text-align: left;">
          <Navigation :user="user" :selected="selected" :isOnMobile="isOnMobile" :alive="alive">
            <template v-slot:connected>
              <ConnectedSection :alive="alive" :isOnMobile="isOnMobile"/>
            </template>
            <template v-slot:sports>
              <div v-if="showSportsFilter" v-bind:class="{'filters-section':!isOnMobile,'filter-section-mobile':isOnMobile}">
                <FilterDropDown :filterName="'Sports'" :isOnMobile="isOnMobile_" :defaultValues="defaultSelectedValues" :dataFilter="sportsID_Filter"></FilterDropDown>
              </div>
            </template>
            <template v-slot:filters>
              <div v-bind:class="{'options_bar':!isOnMobile,'options_bar_mobile':isOnMobile}" v-for="(item, index) in buttons" :index="index" :key="index">
                <button v-bind:class="{'option_button':!isOnMobile,'option_button_mobile':isOnMobile,'selected':selected === item}" @click="select_option(item)">{{item}}</button>
              </div>
            </template>
            <template v-slot:viewmode>
              <ViewModeButton :isOnMobile="isOnMobile"/>
            </template>
          </Navigation>
        </div>
      </div>
      <div class="row" style="padding: 0px 20px 0px 20px;">
        <div v-bind:class="{'col-12': debug,
                            'col-xl-4 col-lg-6 col-md-6': !debug && viewModeFull,
                            'col-xl-3 col-lg-4 col-md-6': !debug && !viewModeFull,
                            }" class="col-12" v-for="(subitem, index_) in filteredScores" :index="index_" :key="index_">
          <Score v-if="subitem && debugFilter(subitem.Header,subitem)" :item="subitem" :isOnMobile="isOnMobile_" :viewModeFull="viewModeFull" :debug="debug"/>
        </div>        
      </div>
    </div>    
  </div>
</template>

<script>

//import { toRaw } from 'vue';
import { mapActions, mapState } from 'vuex';
import Score from './Scores/score';
import Navigation from './Menu/Navigation.vue';
import ConnectedSection from './connected-section';
import ViewModeButton from './view-mode-button';
import FilterDropDown from './FilterDropDownInput/FilterComponent.vue';
import config from '../common/config'

const constants = {MOBILE_SIZE:991.98, MOBILE_SIZE_XSM:415, MOBILE_SIZE_SM:505, SIZE_LG:992, SIZE_XL:1200 }

export default {
  name: 'Home',
  props: {
    msg: String    
  },
  components: {Score,Navigation,ConnectedSection,FilterDropDown,ViewModeButton},
    data() {
      return {
        //buttons: ['ALL','LIVE','UNMATCH','GRADED'],
        buttons: ['LIVE','GRADED'],
        selected: 'LIVE',
        isOnMobile_: false,
        isOnMobileSM_: false,
        isOnMobileXSM_: false,
        isOnXL_: false,

        dataFilter: [{name:'LIVE'}],
        sportFilters: [],

        debug: config.IS_DEBUG_MODE,
        messages: '',

        showSportsFilter: true,
        defaultSelectedValues: []
      }
    },
    watch:{
      updateDefaultSports(newValue,oldValue){
        if(newValue !== oldValue){
          const clone = { ...this.defaultSelectedSports }
          this.defaultSelectedValues = clone;
        }
      }
    },
    computed: {
      ...mapState({
        currentScores: state => state.scores_all,
        gradedScores: state => state.scores_graded,
        sports: state => state.sports,
        selectedSports: state => state.selectedSports,
        user: state => state.user,
        alive: state => state.alive,
        viewModeFull: state => state.viewModeFull,
        debugFilters: state => state.debugFilters,
        updateDefaultSports: state => state.updateDefaultSports,
        defaultSelectedSports: state => state.defaultSelectedSports
      }),
      sportsID_Filter() {
        return [{name: 'Sport', list: this.getSports() }]
      },
      filteredScores:function () {      
        return this.selected === 'LIVE'?
          this.currentScores.filter(item => item.Header.EventNumber != 0 && this.getSelectedSportsFilter(item)) :
          this.selected === 'UNMATCH'?
            this.currentScores.filter(item => item.Header.EventNumber === 0 && this.getSelectedSportsFilter(item)) :
            this.selected === 'GRADED'? this.reverseArr(this.gradedScores.filter(item => this.getSelectedSportsFilter(item))) :
              this.reverseArr(this.currentScores.filter(item => this.getSelectedSportsFilter(item)))
      },
      isOnMobile: function() {return this.isOnMobile_;},
      isOnMobileSM: function() {return this.isOnMobileSM_;},
      isOnMobileXSM: function() {return this.isOnMobileXSM_;},
      isOnXL: function() {return this.isOnXL_;}
    },
   
    methods: {
      ...mapActions(['initScoresQueue','debugFilters']),
      compareLike(content,toSearh){
        return (content.toLowerCase().indexOf(toSearh.toLowerCase()) > -1);
      },
      debugFilter(header,item){
        let show = this.debug?
            ((((!this.debugFilters.EventNumber) || (this.debugFilters.EventNumber === 0)) || (header.EventNumber == this.debugFilters.EventNumber)) &&
             (((!this.debugFilters.ExternalGameNumber) || (this.debugFilters.ExternalGameNumber === 0)) || (header.ExternalGameNumber === this.debugFilters.ExternalGameNumber)) &&
             (((!this.debugFilters.RotationAway) || (this.debugFilters.RotationAway === 0)) || (item.Participants.Away.Rotation === this.debugFilters.RotationAway)) &&
             (((!this.debugFilters.RotationHome) || (this.debugFilters.RotationHome === 0)) || (item.Participants.Home.Rotation === this.debugFilters.RotationHome)) &&
             (((!this.debugFilters.Source) || (this.debugFilters.Source.trim() === '')) || (header.Source.toLowerCase() === this.debugFilters.Source.toLowerCase())) &&
             (((!this.debugFilters.TeamAway) || (this.debugFilters.TeamAway.trim() === '')) || (this.compareLike(item.Participants.Away.Name, this.debugFilters.TeamAway.trim()))) && 
             (((!this.debugFilters.TeamHome) || (this.debugFilters.TeamHome.trim() === '')) || (this.compareLike(item.Participants.Home.Name, this.debugFilters.TeamHome.trim())))
            ) : true;
        if(show && this.debug){
          this.messages = JSON.stringify(item);
        }else{
          this.messages = "";
        }
        return show;
      },       
      getSelectedSportsFilter(item){
        if((this.selectedSports.length === 0) || (this.selectedSports.length === this.sports.length)){
          return true;
        }else{
          return this.selectedSports.findIndex(sport => item.Header.SportType === sport.name)>-1;
        }
      },
      getSports(){
        if(this.sports){
          var sports = this.sports.map( function(obj){
            var rObj = {};
            rObj['name'] = obj;
            return rObj;
          });
          return sports;
        }else{
          return []
        }
      },
      refreshFilters(values){
        var valueTemp = JSON.parse(JSON.stringify(values));
        this.sportFilters = valueTemp;            
      },
      select_option(option){
        this.selected = option;
      },
      reverseArr(input) {
          var ret = new Array;
          for(var i = input.length-1; i >= 0; i--) {
              ret.push(input[i]);
          }
          return ret;
      },
      onResize () { this.isOnMobile_ = (window.innerWidth <= constants.MOBILE_SIZE);
                    this.isOnMobileSM_ = (window.innerWidth <= constants.MOBILE_SIZE_SM);
                    this.isOnMobileXSM_ = (window.innerWidth <= constants.MOBILE_SIZE_XSM);
                    this.isOnXL_ = ((constants.SIZE_LG < window.innerWidth) & (window.innerWidth <= constants.SIZE_XL))?true:false;
                  },      
    },

    created() {window.addEventListener('resize', this.onResize);},

    mounted: function(){
      this.onResize();
      this.initScoresQueue();
    },

    unmounted() {window.removeEventListener('resize', this.onResize );},
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

  html {
    background-color: #05162a;
  }

  .home {
    background-color: #05162a;
    padding-bottom: 40px;
  }

  .sport {
    padding-top: 10px;
    font-size: 16px;
    font-weight: bold;
    color: #fc0
  }

  .options_bar{
    padding-top: 20px;
    padding-left: 10px;
    display: inline-block;    
  }

  .options_bar_mobile{
    text-align: center;
    padding-top: 20px;
    padding-left: 10px;
    display: inline-block;    
  }  

  .option_button{
    border: none;
    border-radius: 10px;
    padding: 3px 8px 1px 8px;
    font-weight: 500;    
  }  

  .option_button:hover{
    background-color: #ff4a70;
    color: white;
  }

  .option_button_mobile{
    border: none;
    border-radius: 10px;
    padding: 3px 8px 1px 8px;
    font-weight: 500;
    width: 50%;
    margin-left: -50px;
  }

  .option_button_mobile:hover{
    background-color: #ff4a70;
    color: white;
  }

  .selected{
    background-color: #ff4a70;
    color: white;
  }

  .filters-section{
    padding-top: 18px;
  }

  .filters-section-mobile{
    padding-top: 18px;
  }

</style>
