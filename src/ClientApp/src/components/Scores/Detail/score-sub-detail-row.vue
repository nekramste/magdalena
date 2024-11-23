<template>
    <div class="period-cell">
        <!-- {{`${JSON.stringify(score)}`}} -->
        <!-- {{`${score.IsFinal?'Fin':'No'}-${score.Status[0]+score.Status[1]+score.Status[2]}`}} -->
       <div v-if="score"
            style="min-width: 30px; height: 15px; line-height: 10px; vertical-align: middle;"
            data-toggle="tooltip" data-placement="top" :title="getTooltipContent(score.Status,score.IsFinal)"
            v-bind:style="{fontSize:((score.Period.Abbr === 'FG' && score.IsFinal) || (score.Period.Abbr === 'FG'))? '15px':'',
                           fontWeight: ((score.Period.Abbr === 'FG' && score.IsFinal) || (score.Period.Abbr === 'FG'))? 'bold':'', 
                           color: (score.Period.Abbr === 'FG' && score.IsFinal)? '#ffc107': score.Period.Abbr === 'FG'?'#17a2b8':''}"
            v-bind:class="{ 'animation': ((!viewModeFull) && (score.Period.Abbr === 'FG') && animate_score),
                            'blink_me': (score.IsFinal && score.Status === 'WasSendToGrade'),
                            'graded': (score.IsFinal && score.Status === 'Graded'),
                            'noline': (score.Status.toLowerCase() === 'noline'),
                            'missmatch': (score.IsFinal && score.Status === 'MismatchFound'),
                        }">
                {{score[type].Score}}
        </div>
    </div>
</template>

<script>    

    export default {
      components: {},
      data () {
        return {
        }
      },      
      props:['score','viewModeFull','animate_score','getTooltipContent','type'],
      methods: {
      }
    }
</script>

<style scoped>

  .period-cell{
    text-align: center;
    display: inline-block;
    padding-top: 5px;
    width:25px;
  }
  .period-cell-header {
    color: #CCC;
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
    font-weight: bold;
    font-size: 15px !important;
    animation: color-change 1s infinite;
  }

  @keyframes color-change {
    0% { color: #17A2B8; font-size: 26px; font-weight: bold; }
    50% { color: #E83E8C; font-size: 30px; font-weight: bold; }
    100% { color: #17A2B8; font-size: 26px; font-weight: bold; }
  }

</style>
