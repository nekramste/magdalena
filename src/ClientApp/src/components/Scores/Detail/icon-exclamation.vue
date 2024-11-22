<template>    
    <div>
        <div><i class="fas fa-exclamation missmatch"></i></div>
    </div>
</template>

<script>   

    export default {
      data () {
        return {
        }
      },
      props:[],
      methods: {
      }
    }
</script>

<style scoped>

  .click{
    cursor:pointer;
  }  

  .missmatch {
    color:#DC3545;
    animation: blinker 1s linear infinite;
  }

  @keyframes blinker {
    50% {
      opacity: 0;
    }
  }

</style>
