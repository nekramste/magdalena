<template>
    <span style="color:white !important; padding-right: 5px; min-height: 0px;">      
      <!-- <template v-if="displayTime">{{`${secondCount>0?secondCount:0}`}}</template> -->
      <!-- <template v-if="initialTime && !finish">{{`${timeToDisplay}`}}</template> -->
    </span>
  </template>
  <script>

  import config from '../../common/config';
  import moment from 'moment';
  import "moment-timezone";

  export default {
    props: {
      date: null,
      intervalTime: null,
      initialTime: null,
      increase: null
    },
    data () {
      return {
        now: Math.trunc((new Date()).getTime() / 1000),
        event: this.date,
        finish: false,
        displayTime: config.SHOW_TIMER,        
      }
    },
    mounted () {
      const _self = this
      window.setInterval(() => {
        this.now = Math.trunc((new Date()).getTime() / 1000)
        this.$emit('onUpdateTimerDisplay',_self.timeToDisplay());
        if (!this.finish && this.calculatedDate - this.now <= 0) {
          _self.finish = true
          _self.$emit('onFinish')
        }        
      }, 1000)
    },
    computed: {
      secondCount () {
        return this.calculatedDate - this.now
      },
      calculatedDate () {
        return Math.trunc(Date.parse(this.event) / 1000)
      },
      seconds () {
        if (this.secondCount < 0) return 0
        return this.secondCount % 60
      },
      minutes () {
        if (this.secondCount < 0) return 0
        return Math.trunc(this.secondCount / 60) % 60
      },
      hours () {
        if (this.secondCount < 0) return 0
        return Math.trunc(this.secondCount / 60 / 60) % 24
      },
      days () {
        if (this.secondCount < 0) return 0
        return Math.trunc(this.secondCount / 60 / 60 / 24)
      },
    },    
    methods:{
        timeToDisplay(){
            let result = '';
            if(this.initialTime){
                var newDate = new Date();
                let secondsDiff = this.intervalTime - this.secondCount;
                let seconds = ((parseInt(this.initialTime.minutes)*60) + (parseInt(this.initialTime.seconds)));            
                seconds =  seconds + (this.increase?(secondsDiff):(0-secondsDiff));
                let finalDate = moment(moment(newDate).startOf('day').format()).add(seconds, 'seconds').format('HH:mm:ss');
                result = this.finalFormat(finalDate);
            }
            return result?result:'';
        },
        finalFormat(date){
            let dateParts = date.split(':');
            if(dateParts){
                return this.increase?
                        (
                            (dateParts[0]==='00')?
                            `${dateParts[1]}:${dateParts[2]}`:
                            `${parseInt(dateParts[0])*60 + parseInt(dateParts[1])}:${dateParts[2]}`
                        )
                    :
                        (dateParts[0]==='00')?
                        `${dateParts[1]}:${dateParts[2]}`
                        :
                        (dateParts[0]==='23')?
                        `00:00`:
                        `${parseInt(dateParts[0])*60 + parseInt(dateParts[1])}:${dateParts[2]}`
            }
            return '';
        }
    }
    
  }
  </script>
  <style lang="scss">
  .countdown{
    display: flex;
    justify-content: center;
    &__block {
      text-align: center;
      padding: 0px 15px;
      position: relative;
      &:first-child{
        padding-left: 0;
        .countdown__digit{
          &:before{
            display: none;
          }
        }
      }
      &:last-child{
        padding-right: 0;
      }
    }
    &__text {
      display: inline-block;
      text-transform: uppercase;
      margin-bottom: 5px;
    }
    &__digit {
      font-size: 12px;
      font-weight: bold;
      line-height: 1;
      margin-bottom: 5px;
      &:before{
        content: ":";
        position: absolute;
        left: -5px;
      }
    }
  }
  </style>
  