<template>
  <div id="project-display-wrapper">
    <h1>Projects I’ve worked on</h1>
    <div id="project-display">
      <div class="project">
        <router-link to="/printing">
          <video loop autoplay muted src="printing.mp4"></video>
          <span>3d Printing/Design</span>
        </router-link>
      </div>
      <div class="project">
        <router-link to="/coding">
          <video loop autoplay muted src="typing.mp4"></video>
          <span>Writing Code</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProjectDisplay',
};
</script>

<style lang="less" scoped>
#project-display-wrapper {
  background-color: var(--background-color);
  box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.72);
  min-height: 100vh;

  h1 {
    grid-column: 1 / span 2;
    padding-top: 2em;
  }
}

#project-display {
  display: grid;
  grid-template-columns: 1fr 1fr;

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
      max-width: 90%;
      filter: brightness(0.4);
      transition: filter 0.3s ease-out;
    }
    span {
      font-size: 2em;
      font-weight: bolder;
      position: absolute;
      top: calc(50%);
      left: 0;
      width: 100%;
      z-index: 5;
      text-decoration: none;
      color: var(--text-color);
    }
  }
}

@media only screen and (max-width: 768px) {
  #project-display {
    grid-template-columns: 1fr;
    grid-auto-rows: 70vw;

    h1 {
      grid-column: 1;
    }
  }
}

@media only screen and (min-width: 768px) {
  #project-display video {
    height: 50vh;
  }
}
</style>
