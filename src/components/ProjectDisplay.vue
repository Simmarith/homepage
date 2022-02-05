<template>
  <div id="project-display">
    <h1>Projects I’ve worked on</h1>
    <router-link to="/printing">
      <div class="project">
        <video loop autoplay muted src="printing.mp4"></video>
        <span>3d Printing/Design</span>
      </div>
    </router-link>
    <router-link to="/coding">
      <div class="project">
        <video loop autoplay muted src="typing.mp4"></video>
        <span>Writing Code</span>
      </div>
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'ProjectDisplay',
};
</script>

<style lang="less" scoped>
#project-display {
  display: grid;
  grid-template-columns: 1fr 1fr;
  height: 100vh;
  background-color: var(--background-color);
  box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.72);

  h1 {
    grid-column: 1 / span 2;
    padding-top: 2em;
  }

  .project {
    position: relative;
    padding: 4em 0;
    color: var(--text-color);

    &:hover {
      video {
        filter: brightness(0.1);
      }
    }

    video {
      height: 50vh;
      filter: brightness(0.4);
      transition: filter 0.3s ease-out;
      border-radius: 10px;
    }
    span {
      font-size: 2em;
      font-weight: bolder;
      position: absolute;
      top: calc(50%);
      left: 0;
      width: 100%;
      z-index: 5;
    }
  }
}
</style>
