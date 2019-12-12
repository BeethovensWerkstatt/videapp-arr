<template>
    <button class="btn btn-sm navigationTopItem" v-bind:class="{ 'btn-primary': transposeVisible}" v-on:click="toggleTransposePane()"><i class="fas fa-arrows-alt-v"></i> {{i18n('transposeButtonLabel')}}</button>
</template>

<script>

export default {
  name: 'TransposeButton',
  methods: {
    i18n: function(code) {
      return this.$i18n(code)
    },
    toggleTransposePane: function() {
      if (this.$store.getters.transposeSelectionVisible) {
        this.$store.dispatch('deactivateTransposeSelection')
      } else {
        this.$store.dispatch('activateTransposeSelection')
      }
    }
  },
  computed: {
    transposeVisible: function() {
      return this.$store.getters.transposeSelectionVisible;
    }
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

</style>
