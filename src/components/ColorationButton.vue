<template>
    <button class="btn btn-sm navigationTopItem" v-bind:class="{ 'btn-primary': highlightingVisible}" v-on:click="toggleHighlighting()"><i class="fas fa-palette"></i> {{i18n('colorationButtonLabel')}}</button>
</template>

<script>

export default {
  name: 'ColorationButton',
  methods: {
    toggleHighlighting: function() {
      this.$store.dispatch('toggleHighlighting')
    },
    i18n: function(code) {
      return this.$i18n(code)
    }
  },
  computed: {
    highlightingVisible: function() {
      return this.$store.getters.highlightingVisible
    }
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

</style>
