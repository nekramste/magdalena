<template>
  <home></home>
</template>

<script>
    import Home from './components/Home.vue'

export default {
  name: 'App',
  components: {
    Home
  },
  mounted(){
    console.log(process.env.BUILD_TIMESTAMP);
  }
}
</script>

<style>

  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 0px;  
  }

  html {
      background-color: #05162a;
  }

</style>
