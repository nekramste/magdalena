<template>    
    <div style="padding-top: 20px; padding-left: 10px;">
      <button v-bind:class="{'option_button view':!isOnMobile,'option_button_mobile view':isOnMobile}" @click="select_view()">
        {{viewModeFull?isOnMobile?'CMP':'COMPACT':isOnMobile?'EXP':'EXPANDED'}}
      </button>
    </div>
</template>

<script>   

    import { mapActions, mapState } from 'vuex';

    export default {
      data () {
        return {
        }
      },
      computed:{
        ...mapState({
          viewModeFull: state => state.viewModeFull
        }),
      },
      props:['isOnMobile'],
      methods: {
        ...mapActions(['setViewModeFull']),
        select_view(){
          this.setViewModeFull(!this.viewModeFull);
        }
      }
    }
</script>

<style lang="scss">
.option_button.view{
  background-color: #05162A;
  color: #28A745; 
}
</style>
