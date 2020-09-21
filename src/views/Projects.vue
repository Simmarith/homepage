<template>
  <div class="projects">
    <h1>Some Projects I did:</h1>
    <Project
      title="NumGrid"
      link="https://simmarith.itch.io/numgrid"
      desc="I've built a small puzzle game on a quiet weekend."
    />
    <Project
      title="Handsoldered Dactyl-Manuform"
      link="https://wiki.munichmakerlab.de/wiki/Dactyl-Manuform"
      desc="I've built my own keyboard off of templates from the internet."
    />
    <Project
      title="VirtualBooking.com"
      link="https://github.com/mumahack/virtualBookingCom"
      desc="Booking a vacation in VR"
    />
    <Project
      title="Uberhacker"
      link="https://github.com/Simmarith/uberhacker"
      desc="a multiplayer hacking game with IT-related minigames"
    />
    <Project
      title="Customized Slic3r"
      link="https://github.com/munichmakerlab/Slic3r"
      desc="A customized Slic3r build to enable the people in the MunichMakerLab to easily 3d Print"
    />
    <Project
      title="Vim Clutch"
      link="https://github.com/munichmakerlab/vim-clutch"
      desc="Using a foot pedal to switch in/out of insert mode in vim"
    />
    <Project
      title="Dancing Letter Conversion"
      link="https://dl.simmarith.com"
      desc="Easily converts normal text into some specific emojis"
    />
  </div>
</template>

<script>
import Project from '../components/Project.vue'

export default {
  name: 'Projects',
  components: {
    Project
  }
}
</script>
