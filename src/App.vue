<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {

};
</script>
<style lang="scss">
* {
  box-sizing: border-box;
  //
}
html {
  height: 100%;
  body,
  #app {
    margin: 0;
    padding: 0;
    height: 100%;
    overflow: hidden;
    font-family: "宋体";
  }
}
</style>
