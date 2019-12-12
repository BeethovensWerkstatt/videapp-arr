<template>
  <div id="searchPane">
    <button class="btn" v-bind:class="{ 'btn-primary': searchSelectionActive, 'btn-link': !searchSelectionActive }" v-on:click="toggleSelectionMode()"><i class="icon icon-edit"></i> {{i18n('searchSelectionLabel')}}</button>
  </div>
</template>

<script>

export default {
  name: 'SearchPane',
  methods: {
    toggleSelectionMode: function() {
      if (this.$store.getters.searchSelectionActive) {
        this.$store.dispatch('deactivateSearchSelection')
      } else {
        this.$store.dispatch('activateSearchSelection')
      }
    },
    i18n: function(code) {
      return this.$i18n(code)
    }
  },
  computed: {
    searchSelectionActive: function() {
      return this.$store.getters.searchSelectionActive;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  #searchPane {
    flex: 0 0 auto;
    background-color: #f5f5f5;
    border-bottom: .5px solid #999999;
    padding: 10px 20px;
    text-align: left;
  }
</style>
