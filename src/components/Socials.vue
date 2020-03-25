<template>
  <div class="socials">
    <Social link="https://www.thingiverse.com/simmarith/designs">
      <img
        alt="Thingiverse"
        src="../assets/thingiverse.png"
      >
    </Social>
    <Social link="https://www.github.com/simmarith">
      <img
        alt="GitHub"
        src="../assets/github.svg"
      >
    </Social>
  </div>
</template>

<script>
import Social from './Social.vue'

export default {
  name: 'Socials',
  components: {
    Social
  }
}
</script>

<style lang="less" scoped>
.socials {
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 10vh;
  right: 1vw;
  padding-right: 10px;
}
</style>
