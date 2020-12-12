<template>
  <div id="app">
    <NavigationBar />
    
    <b-container>
      <router-view />
    </b-container>
  </div>
</template>

<script>
  import NavigationBar from './components/layouts/NavigationBar.vue';

  export default {
    components: {
      NavigationBar
    }
  }
</script>

<style>
  body {
    background-color: #ecebe9!important;
  }
  #preview {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  #preview img {
    max-width: 100%;
    max-height: 300px;
  }
</style>