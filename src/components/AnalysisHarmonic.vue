<template>
  <div id="analysisHarmonic">
    <div id="svgContainer" class="harmonicComparison"></div>
  </div>
</template>

<script>

import VerovioBaseComponent from './VerovioBaseComponent.vue'

export default {
  name: 'AnalysisHarmonic',
  extends: VerovioBaseComponent,
  components: {

  },
  methods: {

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
  svg .anl.diff, svg .anl.diff * {
    font-weight: bold;
    fill: #f62727;
    stroke: #f62727;
  }

</style>
