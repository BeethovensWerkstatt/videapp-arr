<template>
  <div id="analysisGenetic">
    <div id="viewSettings">
      <!--<div class="viewSettingItem">{{i18n('legend')}}<div>-->
      <div class="viewSettingItem">
        <i class="fas fa-tint id"></i> {{i18n('invariance')}}
      </div>
      <div class="viewSettingItem">
        <i class="fas fa-tint deleted"></i> {{i18n('deletedNotes')}}
      </div>
      <div class="viewSettingItem">
        <i class="fas fa-tint added"></i> {{i18n('addedNotes')}}
      </div>
    </div>
    <div id="svgContainer" class="geneticComparison"></div>
  </div>
</template>

<script>

import VerovioBaseComponent from './VerovioBaseComponent.vue'

export default {
  name: 'AnalysisGenetic',
  extends: VerovioBaseComponent,
  components: {

  },
  methods: {
    i18n: function(code) {
      return this.$i18n(code)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">

$colorVariant1: #f51d1d;
$colorVariant2: #3ce644;
$neutralColor: #000000;
$fadedColor: #999999;

#analysisGenetic #viewSettings {
  flex: 0 0 auto;
  background-color: #f5f5f5;
  border-bottom: .5px solid #999999;
  padding: 10px 20px;
  text-align: left;
  font-size: .7rem;
  height: 2.2rem;

  .fa-tint {
    &.id {
      color: $neutralColor;
    }
    &.deleted {
      color: $colorVariant1;
    }
    &.added {
      color: $colorVariant2;
    }
  }
}

#analysisGenetic {
  flex: 1 1 auto;
  align-self: stretch;

  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;

  height: 100%;
  overflow: hidden;

  #svgContainer {
    overflow: auto;
  }
}

#analysisGenetic svg {

  svg .layer, svg .clef, svg .keySig, svg .meterSig, svg .dynam, svg .dir, svg .barLineAttr, svg .staff > path, svg .slur > path {
    fill: $fadedColor;
    stroke: $fadedColor;
  }

  .file1 {
    .ts, .od, .sd, .os, .noMatch {
      fill: $colorVariant1;
      stroke: $colorVariant1;

      .accid {
        fill: $colorVariant1;
        stroke: $colorVariant1;
      }

      &.id {
        fill: $neutralColor;
        stroke: $neutralColor;

        .accid {
          fill: $neutralColor;
          stroke: $neutralColor;
        }
      }
    }
  }

  .file2 {
    .ts, .od, .sd, .os, .noMatch {
      fill: $colorVariant2;
      stroke: $colorVariant2;

      .accid {
        fill: $colorVariant2;
        stroke: $colorVariant2;
      }

      &.id {
          fill: $neutralColor;
          stroke: $neutralColor;

          .accid {
            fill: $neutralColor;
            stroke: $neutralColor;
          }
      }
    }
  }
}
</style>
