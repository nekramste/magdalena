<template>    
    <div class="live-indicator-block">
        <span v-if="alive" 
          @click="startConnectionInmmediately()"
          v-bind:class="{'live-indicator':!isOnMobile,'live-indicator-mobile':isOnMobile}"
          v-bind:style="{marginTop:isOnMobile?'-5px':'22px',marginRight: isOnMobile?'0px':'10px'}">
          <i class="fa fa-circle blink" aria-hidden="true"></i>{{!isOnMobile?'CONNECTED':''}}
        </span>
        <div v-else 
          style="cursor:pointer; color: #152a41; font-size: 12px;"
          @click="startConnectionInmmediately()"
          v-bind:class="{'live-indicator-delayed':!isOnMobile,'live-indicator-delayed-mobile':isOnMobile}" 
          v-bind:style="{marginTop:isOnMobile?'-5px':'22px',marginRight: isOnMobile?'0px':'10px'}">
          <div class="spinner-border spinner-border-sm" style="width: 0.7rem !important; height: 0.7rem !important;" role="status" aria-hidden="true"></div>
          {{!isOnMobile?'RECONNECTING':''}}
      </div>
    </div>
</template>

<script>   
  import { mapActions } from 'vuex';

  export default {
    data () {
      return {
      }
    },      
    props:['alive','isOnMobile'],
    methods: {
      ...mapActions(['startConnectionInmmediately']),
    }
  }
</script>

<style lang="scss" scoped>

  $green-live: #28a745;
  $white: #fff;

  .live-indicator-block{
    position: flex;            
    
    .live-indicator {
        font-family: 'Roboto', sans-serif;
        background: $green-live;
        color: $white;
        padding: 6px 7px;
        line-height: 1;
        border-radius: 6px;
        text-transform: uppercase;
        display: inline-block;
        vertical-align: middle;
        font-size: 12px;
        font-weight: bold;
        width: auto;
        .blink {
            animation: blinker 1s cubic-bezier(0.5, 0, 1, 1) infinite alternate;
            font-size: 10px;
            margin-right: 5px;
            vertical-align: baseline;
        }
    }
    .live-indicator-delayed {
        font-family: 'Roboto', sans-serif;
        background: #FFD43B;
        color: $white;
        padding: 6px 7px;
        line-height: 1;
        border-radius: 6px;
        text-transform: uppercase;
        display: inline-block;
        vertical-align: middle;
        font-size: 12px;
        font-weight: bold;
        width: auto;
    }

    .live-indicator-mobile {
        font-family: 'Roboto', sans-serif;
        color: $green-live;
        padding: 6px 7px;
        line-height: 1;
        border-radius: 6px;
        text-transform: uppercase;
        display: inline-block;
        vertical-align: middle;
        font-size: 12px;
        font-weight: bold;
        width: auto;
        .blink {
            animation: blinker 1s cubic-bezier(0.5, 0, 1, 1) infinite alternate;
            font-size: 10px;
            vertical-align: baseline;
        }
    }
    .live-indicator-delayed-mobile {
        font-family: 'Roboto', sans-serif;
        background-color: #FFD43B;
        color: #FFD43B;
        padding: 6px 7px;
        line-height: 1;
        border-radius: 6px;
        text-transform: uppercase;
        display: inline-block;
        vertical-align: middle;
        font-size: 12px;
        font-weight: bold;
        width: auto;
    }
    
  }

  @keyframes blinker {
    from { opacity: 1; }
    to { opacity: 0; }
  }

</style>
