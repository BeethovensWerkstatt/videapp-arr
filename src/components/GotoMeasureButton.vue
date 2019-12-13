<template>
    <button class="btn btn-sm btn-action navigationTopItem" v-bind:class="{ 'btn-primary': gotoMeasureVisible}" v-on:click="toggleGotoMeasurePane()"><i class="fas fa-arrow-right"></i></button>
</template>

<script>

export default {
  name: 'GotoMeasureButton',
  methods: {
    toggleGotoMeasurePane: function() {
      this.$store.dispatch('toggleGotoMeasure')
    }
  },
  computed: {
    gotoMeasureVisible: function() {
      return this.$store.getters.gotoMeasureVisible;
    }
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

</style>
