<template>
  <div id="analysisComparison">
    <div id="viewSettings">
      <div class="form-group float-right">
        <label id="detailedColoration" class="form-checkbox form-inline" style="margin: 0;">
          <input type="checkbox" v-on:change.prevent="toggleColoration($event)" v-bind:checked="detailedColoration"><i class="form-icon"></i> {{i18n('detailedColorationButton')}}
        </label>
      </div>
      <!--<div class="viewSettingItem">
        {{i18n('legend')}}
      </div>-->
      <div class="viewSettingItem">
        <i class="fas fa-tint id"></i> {{i18n('invariance')}}
      </div>
      <div v-if="detailedColoration" class="viewSettingItem">
        <div class="viewSettingDetail">
          <i class="fas fa-tint os"></i> {{i18n('octaveVariance')}}
        </div>
        <div class="viewSettingDetail">
          <i class="fas fa-tint sd"></i> {{i18n('rhythmicVariance')}}
        </div>
        <div class="viewSettingDetail">
          <i class="fas fa-tint od"></i> {{i18n('rhythmicOctaveVariance')}}
        </div>
        <div class="viewSettingDetail">
          <i class="fas fa-tint ts"></i> {{i18n('pitchClassVariance')}}
        </div>
      </div>
      <div v-else class="viewSettingItem">
        <i class="fas fa-tint var"></i> {{i18n('variance')}}
      </div>
      <div class="viewSettingItem">
        <i class="fas fa-tint noMatch"></i> {{i18n('difference')}}
      </div>
    </div>
    <div id="svgContainer" class="comparison" v-bind:class="{'detailedColors': detailedColoration}"></div>
  </div>
</template>

<script>

import VerovioBaseComponent from './VerovioBaseComponent.vue'

export default {
  name: 'AnalysisComparison',
  extends: VerovioBaseComponent,
  components: {

  },
  methods: {
    toggleColoration: function() {
      this.$store.dispatch('toggleComparisonDetailedColoration')
    },
    i18n: function(code) {
      return this.$i18n(code)
    }
  },
  computed: {
    detailedColoration: function() {
      return this.$store.getters.comparisonDetailedColoration
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">

  $highlightColor_identical: #000000;
  $highlightColor_different: #d825da;
  $highlightColor_octDiff_durSame: #f4531b;
  $highlightColor_octSame_durDiff: #26d6fc;
  $highlightColor_octDiff_durDiff: #1b44f4;
  $highlightColor_transp_durSame: #859900;
  $fadedColor: #999999;

  #svgContainer.comparison {

    svg .layer, svg .clef, svg .keySig, svg .meterSig, svg .dynam, svg .dir, svg .barLineAttr, svg .staff > path, svg .slur > path {
      fill: $fadedColor;
      stroke: $fadedColor;
    }

    .noMatch, .noMatch .accid {
      fill: $highlightColor_different;
      stroke: $highlightColor_different;
    }

    .ts, .ts .accid, .od, .od .accid, .sd, .sd .accid, .os, .os .accid {
      fill: $highlightColor_octDiff_durDiff;
      stroke: $highlightColor_octDiff_durDiff;
    }

    &.detailedColors {
      .ts, .ts .accid {
        fill: $highlightColor_transp_durSame;
        stroke: $highlightColor_transp_durSame;
      }

      .od, .od .accid {
        fill: $highlightColor_octDiff_durDiff;
        stroke: $highlightColor_octDiff_durDiff;
      }

      .sd, .sd .accid {
        fill: $highlightColor_octSame_durDiff;
        stroke: $highlightColor_octSame_durDiff;
      }

      .os, .os .accid {
          fill: $highlightColor_octDiff_durSame;
          stroke: $highlightColor_octDiff_durSame;
      }
    }

    .id, .id .accid {
      fill: $highlightColor_identical !important;
      stroke: $highlightColor_identical !important;
    }
  }

  #analysisComparison #viewSettings {
    flex: 0 0 auto;
    background-color: #f5f5f5;
    border-bottom: .5px solid #999999;
    padding: 10px 20px;
    text-align: left;
    font-size: .7rem;
    height: 2.2rem;

    #detailedColoration {
        position: relative;
        top: -.1rem;
    }

    .viewSettingItem {
      display: inline-block;
      padding: 0 .5rem;
      margin-right: .5rem;
      & + .viewSettingItem {
        border-left: .5px solid #666666;
        padding-left: 1rem;
      }
    }

    .viewSettingDetail + .viewSettingDetail {
      display: inline-block;
      padding-left: .5rem;
    }

    .fa-tint {
      &.id {
        color: $highlightColor_identical;
      }
      &.os {
        color: $highlightColor_octDiff_durSame;
      }
      &.sd {
        color: $highlightColor_octSame_durDiff;
      }
      &.od {
        color: $highlightColor_octDiff_durDiff;
      }
      &.ts {
        color: $highlightColor_transp_durSame;
      }
      &.var {
        color: $highlightColor_octDiff_durDiff;
      }
      &.noMatch {
        color: $highlightColor_different;
      }
    }

  }

  #analysisComparison {
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
</style>
