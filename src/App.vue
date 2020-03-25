<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">
        Home
      </router-link> |
      <router-link to="/projects">
        Projects
      </router-link>
    </div>
    <router-view />
    <Socials />
  </div>
</template>

<script>
import Socials from './components/Socials.vue'

export default {
  name: 'App',
  components: {
    Socials
  }
}
</script>

<style lang="less">
body {
  background-color: #eaeaea;
  margin: 0px;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  font-size: 15px;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 2vh;
  display: flex;
  flex-direction: row;
  justify-content: center;

  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
