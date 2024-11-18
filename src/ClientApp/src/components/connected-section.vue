<template>    
    <div class="live-indicator-block">
        <span v-if="alive" class="live-indicator" v-bind:style="{marginTop:isOnMobile?'-5px':'22px',marginRight: isOnMobile?'0px':'10px'}">
          <i class="fa fa-circle blink" aria-hidden="true"></i>{{!isOnMobile?'CONNECTED':''}}
        </span>
        <span v-else class="live-indicator-delayed" v-bind:style="{marginTop:isOnMobile?'-5px':'22px',marginRight: isOnMobile?'0px':'10px'}">
          <i class="fa fa-circle" aria-hidden="true" ></i>{{!isOnMobile?'DELAYED':''}}
        </span>
    </div>
</template>

<script>   
    export default {
      data () {
        return {
        }
      },
      props:['alive','isOnMobile'],
      methods: {
      }
    }
</script>

<style lang="scss" scoped>

  $red-live: #28a745;
  $white: #fff;

  .live-indicator-block{
    position: flex;            
    
    .live-indicator {
        font-family: 'Roboto', sans-serif;
        background: $red-live;
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
        background: red;
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
  }

  @keyframes blinker {
    from { opacity: 1; }
    to { opacity: 0; }
  }

</style>
