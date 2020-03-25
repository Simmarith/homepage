<template>
  <a
    class="container"
    :href="link"
  >
    <h3>{{ title }}</h3>
    <span class="desc">{{ desc }}</span>
  </a>
</template>

<script>
export default {
  name: 'Project',
  props: {
    title: {
      type: String,
      default: ''
    },
    link: {
      type: String,
      default: '#'
    },
    desc: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="less" scoped>
  a,
  a:hover,
  a:active {
    display: inline-block;
    border-radius: 2px;
    color: #2c3e50;
    text-decoration: none;
    margin: 10px;
    width: 60vw;
    box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
    background-color: #fff;
    transition: all 0.3s cubic-bezier(.25,.8,.25,1);
  }

  a:hover {
    box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
  }

  .desc{
    display: inline-block;
    padding-bottom: 20px;
    padding-right: 2vw;
    padding-left: 2vw;
  }
</style>
