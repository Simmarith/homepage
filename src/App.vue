<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">
        Home
      </router-link>
    </div>
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="less">
html {
  scroll-behavior: smooth;
}

body {
  background-color: var(--background-color);
  margin: 0px;
  --text-color: #eee;
  --background-color: #222;
  --background-color-light: #444;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  font-size: 15px;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: var(--text-color);
}
#nav {
  padding: 2vh;
  display: flex;
  flex-direction: row;
  justify-content: center;

  a {
    font-weight: bold;
    color: #aaa;
    &.router-link-exact-active {
      color: #eee;
    }
  }
}
</style>
