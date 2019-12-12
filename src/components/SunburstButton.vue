<template>
    <button class="btn btn-sm btn-action navigationTopItem" v-bind:class="{ 'btn-primary': sunburstVisible}" v-on:click="toggleSunburstPane()"><i class="fas fa-dot-circle"></i></button>
</template>

<script>

export default {
  name: 'SunburstButton',
  methods: {
    toggleSunburstPane: function() {
      this.$store.dispatch('toggleSunburst')
    }
  },
  computed: {
    sunburstVisible: function() {
      return this.$store.getters.sunburstVisible;
    }
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

</style>
