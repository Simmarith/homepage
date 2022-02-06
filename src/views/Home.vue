<template>
  <div class="home">
    <div class="landing">
      <video class="hero" loop autoplay muted src="hero.mp4"></video>
      <img alt="Logo" src="../assets/logo.png" />
      <div class="text">
        <h1>Simmarith’s past semi-completed projects</h1>
      </div>
      <a href="#project-display-wrapper" class="scroll">▼</a>
    </div>
    <ProjectDisplay />
  </div>
</template>

<script>
// @ is an alias to /src
import ProjectDisplay from '@/components/ProjectDisplay.vue';

export default {
  name: 'Home',
  components: {
    ProjectDisplay,
  },
};
</script>

<style lang="less" scoped>
.landing {
  height: 100vh;
  text-align: center;
}

.hero {
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  right: 0;
  object-fit: fill;
  filter: brightness(0.3);
  z-index: -1;
}

.text {
  padding: 0px 3vw;
}

.scroll {
  display: inline-block;
  text-decoration: none;
  color: var(--text-color);
  border: 4px solid var(--text-color) ;
  border-radius: 200px;
  font-size: 50px;
  width: 1.2em;
}

img {
  height: calc(98vh - 12.5em);
  max-height: 90vw;
  width: auto;
  filter: invert(0.8);
}
</style>
