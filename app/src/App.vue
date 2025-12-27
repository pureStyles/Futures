<template>
  <div id="app">
    <PositionDashboard />
  </div>
</template>

<script>

import PositionDashboard from './components/PositionDashboard.vue';

export default {
  name: 'App',
  components: {
    PositionDashboard
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
  margin-top: 60px;
}
</style>
