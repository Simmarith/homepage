<template>
  <h1>Some Projects I did:</h1>
  <div class="projects">
    <Project
      imageName="numgrid-logo.png"
      title="NumGrid"
      link="https://simmarith.itch.io/numgrid"
      desc="I've built a small puzzle game on a quiet weekend."
      rows="38"
    />
    <Project
      imageName="vim-clutch.jpg"
      title="Vim Clutch"
      link="https://github.com/munichmakerlab/vim-clutch"
      desc="Using a foot pedal to switch in/out of insert mode in vim"
      rows="55"
    />
    <Project
      imageName="cag-logo.svg"
      title="CAG Website"
      link="https://cag-gang.com"
      desc="A quick website for a totally-not-a-cult refined religion"
      rows="31"
    />
    <Project
      imageName="virtualbooking.png"
      title="VirtualBooking.com"
      link="https://github.com/mumahack/virtualBookingCom"
      desc="Booking a vacation in VR"
      rows="49"
    />
    <Project
      imageName="uberhacker.png"
      title="Uberhacker"
      link="https://github.com/Simmarith/uberhacker"
      desc="a multiplayer hacking game with IT-related minigames"
      rows="63"
    />
    <Project
      imageName="slic3r.png"
      title="Customized Slic3r"
      link="https://github.com/munichmakerlab/Slic3r"
      desc="A customized Slic3r build to enable the people in the MunichMakerLab to easily 3d Print"
      rows="47"
    />
    <Project
      imageName="text-dancing-letters.gif"
      title="Dancing Letter Conversion"
      link="https://dl.simmarith.com"
      desc="Easily converts normal text into some specific emojis"
      rows="42"
    />
  </div>
</template>

<script>
import Project from '../components/Project.vue'

export default {
  name: 'Coding',
  components: {
    Project
  }
}
</script>

<style lang="less" scoped>
@import "../styles/projects.less";
</style>
