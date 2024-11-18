<template>
  <header :class="{'scrolled-nav': scrolledNav }">
    <nav style="height: 60px;">
      <div class="branding">
        <i class="far fa-user icon-user" v-bind:class="{'icon-user':!isOnMobile, 'icon-user-mobile':isOnMobile}"></i>
        <span v-bind:class="{'user-label':!isOnMobile, 'user-label-mobile':isOnMobile}">{{ user }}</span>
      </div>
      <ul v-show="!isOnMobile" class="navigation">
        <slot name="connected"></slot>
        <slot name="sports"></slot>
        <slot name="filters"></slot>
      </ul>
      <div v-if="isOnMobile" class="icon">
        <slot name="connected"></slot>
        <slot name="sports"></slot>
        <button class="option_button selected" @click="toggleMobileView">{{selected}}</button>
      </div>
      <transition name="mobile-nav" @click="toggleMobileView">        
        <ul v-show="isOnMobile && mobileNav" class="dropdown-nav" style="padding-top:260px;">          
          <slot name="filters"></slot>
        </ul>
      </transition>
    </nav>
  </header>
</template>

<script>

export default {
  name: "navigation",
  components: {},  
  data(){
    return {
      scrolledNav: null,
      scrollPosition: null,      
      mobileNav: false,
      windowWidth: null,      
    }
  },
  props: ['user','selected','isOnMobile','alive'],
  created() {
    this.checkScreen();
  },
  mounted(){    
  },
  methods:{

    toggleMobileView() {
      this.mobileNav = !this.mobileNav;
    },

    updateScroll(){
      const scrollPostion = window.scrollY;
      if( scrollPostion > 50){
        this.scrollPositionNav = true;
        return;
      }
      this.scrolledNav = false;
    },

    checkScreen(){
      this.mobileNav = false;
      return;
    }
  }
};
</script>

<style lang="scss" scoped>

  header {
    background-color: #152a41;
    z-index: 99;
    width:100%;
    position: fixed;
    transition: 0.5s ease all;
    color: #fff;

    nav {
      position: relative;
      display: flex;
      flex-direction: row;
      padding: 12px 0;
      transition: 0.5s ease all;
      width: 100%;
      margin: 0 auto;
      @media (min-width: 750px) {
        max-width: calc(100vw - 100px);
      }

      ul,
      .link {
        font-weight: 500;
        color: #fff;
        list-style: none;
        text-decoration: none;
      }

      .li {
        text-transform: uppercase;
        padding: 169px; 
        margin: 16px;
      }

      .link {
        font-size: 14px;
        transition: 0.5 easy all;
        padding-bottom: 4px;
        border-bottom: 1px solid transparent;

        &:hover{
          color: #00afea;
          border-color: #00afea;
        }
      }

      .branding {
        display: flex;
        align-items: center;

        img {
          width: 50px;
          transition: .5s easy all;
        }
      }
      
    }    

    .navigation {
      display: flex;
      align-self: center;
      flex: 1;
      justify-content: flex-end;
    }

    .icon {
      display: flex;
      align-items: center;
      position: absolute;
      top: 0;
      right: 24px;
      height: 100%;

      i {
        cursor: pointer;
        font-size: 24px;
        transition: .5s easy all;
      }
    }

    .icon-active {
      transform: rotate(180deg);
    }

    .dropdown-nav{
      display: flex;
      flex-direction: column;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      max-width: 100%;
      height: 100%;
      background-color: rgba(0,0,0,0.8);

      li {
        margin-left: 0;
        .link {
          color: #000;
        }
      }

      .mobile-nav-enter-active,
      .mobile-nav-leave-active {
        transition: 1s ease all;
      }

      .mobile-nav-enter-form {
        transform: translate(-250px);
      }

      .mobile-nav-enter-to {
        transform: translate(0px);
      }

    }
  }

  .scrolled-nav {
    background-color: #000;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    nav {
      padding: 8px 0;
      .branding{
        img{
          width: 40px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
      }
    }
  }

  .icon-user{
    position: absolute;
    font-size: 20px!important;
    left: -20px;
  }

  .icon-user-mobile{
    position: relative;
    font-size: 29px!important;
    padding-left: 40px;
  }

  .user-label{
    padding-left:15px;
    height:50px;
    vertical-align:middle;
    padding-top:12px;
  }

  .user-label-mobile{
    padding-left:0px;
    height:50px;
    vertical-align:middle;
    padding-top:12px;
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

  .selected{
    background-color: #ff4a70;
    color: white;
  }

</style>