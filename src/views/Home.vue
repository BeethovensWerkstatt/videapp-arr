<template>

  <div class="home">

    <Intro v-if="introVisible"/>
    <div v-else id="fullBox">
      <div id="navigationBox">
        <ComparisonSelection/>
        <ModeSelection/>
        <!-- WorkSelection -->
        <!-- WorkSelection -->
      </div>
      <div id="contentBox">
        <NavigationTop v-if="comparisonSelected && modeSelected"/>
        <SearchPane v-if="searchPaneVisible"/>
        <Analysis v-if="comparisonSelected && modeSelected"/>
        <div v-if="!comparisonSelected" class="toast">
          <h1>{{i18n('selectComparisonToastHeading')}}</h1>
          <p>{{i18n('selectComparisonToastBody')}}</p>
        </div>
        <div v-else-if="!modeSelected" class="toast toast-primary">
          <h1>{{i18n('selectPerspectiveToastHeading')}}</h1>
          <p>{{i18n('selectPerspectiveToastBody')}}</p>
        </div>
      </div>
      <StaffSelectionModal/>
      <TransposeModal/>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import ComparisonSelection from '@/components/ComparisonSelection.vue'
import ModeSelection from '@/components/ModeSelection.vue'
import Analysis from '@/components/Analysis.vue'
import NavigationTop from '@/components/NavigationTop.vue'
import SearchPane from '@/components/SearchPane.vue'
import StaffSelectionModal from '@/components/StaffSelectionModal.vue'
import TransposeModal from '@/components/TransposeModal.vue'
import Intro from '@/components/Intro.vue'

export default {
  name: 'home',
  components: {
    ComparisonSelection,
    ModeSelection,
    Analysis,
    NavigationTop,
    SearchPane,
    StaffSelectionModal,
    TransposeModal,
    Intro
  },
  computed: {
    introVisible: function() {
      return this.$store.getters.introVisible;
    },
    comparisonSelected: function() {
      return this.$store.getters.activeComparisonId !== null
    },
    modeSelected: function() {
      return this.$store.getters.activeModeId !== null
    },
    searchPaneVisible: function() {
      return this.$store.getters.searchPaneVisible
    }
  },
  methods: {
    i18n: function(code) {
      return this.$i18n(code)
    }
  }
}
</script>

<style scoped lang="scss">

#fullBox {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  position: absolute;
  top: 68.5px;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;

  #navigationBox {
    background-color: #f5f5f5;
    border-right: 0.5px solid #666666;
    padding: 0.5rem 1rem;
    flex: 0 0 360px;
    align-self: stretch;
    overflow: auto;
  }

  #contentBox {
    flex: 1 1 auto;
    align-self: stretch;

    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;

    .toast {
      width: unset;
      margin: 3rem;
    }
  }

}



  /*.home {
    height: calc(100% - 68.5px);
    max-height: calc(100% - 68.5px);
    position: absolute;
    top: 68.5px;
    left: 0;
    width: 100%;
  }

  #navigationBox {
    height: calc(100% - 68.5px);
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    & > * {
      flex: 1;
    }
  }

  #contentBox {
    height: calc(100% - 68.5px);
    display: flex;
    flex-direction: column;
    overflow: auto;
    & > * {
      flex: 1;
    }
  }*/

</style>
