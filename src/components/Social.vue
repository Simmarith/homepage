<template>
  <a class="social" :href="link">
    <slot />
  </a>
</template>

<script>
export default {
  name: 'Social',
  props: {
    link: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="less">
.social {
  img {
    width: 60px;
    height: 60px;
    border-radius: 30px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
    transition: all 0.3s cubic-bezier(.25,.8,.25,1);
  }

  img:hover {
    box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
  }

  &:not(first-child) {
    padding-top: 10px;
  }
}
</style>
