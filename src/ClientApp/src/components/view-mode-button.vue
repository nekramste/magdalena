<template>    
    <div style="padding-top: 20px; padding-left: 10px;">
      <button v-bind:class="{'option_button view':!isOnMobile,'option_button_mobile view':isOnMobile}" @click="select_view()">
        {{viewModeFull?isOnMobile?'CMP':'COMPACT':isOnMobile?'EXP':'EXPANDED'}}
        <svg v-if="!viewModeFull" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrows-fullscreen" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M5.828 10.172a.5.5 0 0 0-.707 0l-4.096 4.096V11.5a.5.5 0 0 0-1 0v3.975a.5.5 0 0 0 .5.5H4.5a.5.5 0 0 0 0-1H1.732l4.096-4.096a.5.5 0 0 0 0-.707m4.344 0a.5.5 0 0 1 .707 0l4.096 4.096V11.5a.5.5 0 1 1 1 0v3.975a.5.5 0 0 1-.5.5H11.5a.5.5 0 0 1 0-1h2.768l-4.096-4.096a.5.5 0 0 1 0-.707m0-4.344a.5.5 0 0 0 .707 0l4.096-4.096V4.5a.5.5 0 1 0 1 0V.525a.5.5 0 0 0-.5-.5H11.5a.5.5 0 0 0 0 1h2.768l-4.096 4.096a.5.5 0 0 0 0 .707m-4.344 0a.5.5 0 0 1-.707 0L1.025 1.732V4.5a.5.5 0 0 1-1 0V.525a.5.5 0 0 1 .5-.5H4.5a.5.5 0 0 1 0 1H1.732l4.096 4.096a.5.5 0 0 1 0 .707"/>
        </svg>
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
.option_button.view:hover{
  background-color: #fff;
  color: #28A745; 
}
</style>
