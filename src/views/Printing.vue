<template>
  <h1>Some things I printed and/or designed:</h1>
  <div class="projects">
    <div class="projects-col">
      <Project
        imageName="keyboard.jpeg"
        title="Handsoldered Dactyl-Manuform"
        link="https://wiki.munichmakerlab.de/wiki/Dactyl-Manuform"
        desc="I've built my own keyboard off of templates from the internet."
        rows="59"
      />
      <Project
        imageName="cardholder.jpg"
        title="Business Card Holder"
        link="https://www.thingiverse.com/thing:3475746"
        desc="A case to hold my business cards."
        rows="70"
      />
    </div>
    <div class="projects-col">
      <Project
        imageName="i3mk3grip.jpg"
        title="I3 MK3 Grip"
        link="https://www.thingiverse.com/thing:3561201"
        desc="A handle to carry the I3 MK3 without the Steel digging into your hands."
        rows="71"
      />
    </div>
  </div>
</template>

<script>
import Project from '../components/Project.vue';

export default {
  name: 'Printing',
  components: {
    Project,
  },
};
</script>

<style lang="less" scoped>
@import "../styles/projects.less";
</style>
