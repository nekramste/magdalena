<template>  
    <button v-on:click="handleClick()" class="buttonSave" type="button" :disabled="disabled || loading" :id="id" >
      {{label}}
      <div class="d-flex justify-content-center txt-center"><slot></slot></div>
    </button>
</template>

<script>

export default {
    name: 'Button',
    props: {
    id: {
        type: String
    },    
    label: {
        type: String
    },
    onClick: {
        type: Function
    },
    disabled: {
        type: Boolean
    }
  }, 
  data() {
    return {
    }
  },
  methods: {
    handleClick() {
        this.onClick();
    }
  }
}
</script>

<style lang="scss">
   
  button.buttonSave{
    outline: none;
    text-align: center;
    opacity: 1;
    box-shadow: 1px 3px 6px #0000003D;
    border-radius: 15px;
    height: 37px;
    padding: 6px 24px;
    border: 0;
    line-height: 24px;
    text-transform: uppercase;    
  }  

  .buttonSave[disabled] {
    background: linear-gradient(rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.25));
    cursor: no-drop;
  }

</style>