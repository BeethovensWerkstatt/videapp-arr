<template>
  <div id="analysis">
    <SunburstPane v-if="sunburstVisible"/>
    <AnalysisPlain v-if="activeModeId === 'plain'"/>
    <AnalysisComparison v-if="activeModeId === 'eventComparison'"/>
    <AnalysisGenetic v-if="activeModeId === 'geneticComparison'"/>
    <AnalysisMelodic v-if="activeModeId === 'melodicComparison'"/>
    <AnalysisHarmonic v-if="activeModeId === 'harmonicComparison'"/>
    <AnalysisDensity v-if="activeModeId === 'eventDensity'"/>
  </div>
</template>

<script>

import AnalysisPlain from '@/components/AnalysisPlain.vue'
import AnalysisComparison from '@/components/AnalysisComparison.vue'
import AnalysisGenetic from '@/components/AnalysisGenetic.vue'
import AnalysisMelodic from '@/components/AnalysisMelodic.vue'
import AnalysisDensity from '@/components/AnalysisDensity.vue'
import AnalysisHarmonic from '@/components/AnalysisHarmonic.vue'
import SunburstPane from '@/components/SunburstPane.vue'

export default {
  name: 'Analysis',
  components: {
    AnalysisPlain,
    AnalysisComparison,
    AnalysisGenetic,
    AnalysisMelodic,
    AnalysisDensity,
    AnalysisHarmonic,
    SunburstPane
  },
  computed: {
    activeModeId: function() {
      return this.$store.getters.activeModeId
    },
    sunburstVisible: function() {
      return this.$store.getters.sunburstVisible
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
#analysis {
  flex: 1 1 auto;
  overflow: auto;
  position: relative;
}
</style>
