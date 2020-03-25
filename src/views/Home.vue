<template>
  <div class="home">
    <img
      alt="Logo"
      src="../assets/logo.png"
    >
    <div class="text">
      <h1>Simmarith’s might-eventually-actually-happen website</h1>
      <h3>See nav on top of the page for more content</h3>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'Home',
  components: {
  },
}
</script>

<style lang="less" scoped>
.home {
  width: 100%;
  height: 100%;
  position: absolute;
}

.text {
  padding: 0px 3vw;
}

img {
  height: 70vh;
  max-height: 90vw;
  width: auto;
}
</style>
