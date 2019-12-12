<template>
  <div id="comparisonSelector">
    <SectionLabel v-bind:label="i18n('comparisonsSectionLabel')"/>

    <div class="comparisonContainer" v-for="comparison in comparisons" v-bind="comparison">

      <div class="comparisonDetails" v-bind:class="{active: (comparison.id === activeComparisonId)}" v-on:click="activateComparison(comparison.id)">
        <button class="btn btn-action btn-primary btn-sm additionalInfo" v-on:click.stop="displayIntro(comparison.id)"><i class="fas fa-info"></i></button>
        <div class="title">{{comparison.title}}</div>
        <div class="subtitle">{{comparison.target}}</div>
      </div>
      <div v-if="comparison.id === activeComparisonId && comparison.movements.length != 1" class="mdivSelection">
        <div class="mdiv" v-for="mdiv in comparison.movements" v-bind:class="{active: (mdiv.n == activeMovement)}" v-on:click="activateMovement(mdiv.n)">{{mdiv.n}}: {{mdiv.label}}</div>
      </div>
    </div>

  </div>
</template>

<script>

import SectionLabel from '@/components/SectionLabel'

export default {
  name: 'ComparisonSelection',
  components: {
    SectionLabel
  },
  computed: {
    comparisons: function() {
      return this.$store.getters.comparisons;
    },
    activeComparisonId: function() {
      return this.$store.getters.activeComparisonId;
    },
    activeMovement: function() {
      return this.$store.getters.activeMovement;
    }
  },
  methods: {
    activateComparison (id) {
      this.$store.dispatch('activateComparison',id)
    },
    activateMovement (n) {
      this.$store.dispatch('activateMovement',n)
    },
    displayIntro (id) {
      this.$store.dispatch('displayIntro',id)
    },
    i18n: function(code) {
      return this.$i18n(code)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

  $borderColor: #999999;

  .comparisonContainer {
    margin: 0 .2rem .5rem;
    text-align: left;

    .comparisonDetails {
      border: .5px solid $borderColor;
      border-radius: 3px;
      background-color: #e5e5e5;
      padding: .3rem;
      cursor: pointer;


      .additionalInfo {
        float: right;
        transform: scale(.7);
        position: relative;
        top: -.2rem;
        right: -.2rem;

        .fas {
          font-size: .8rem;
          top: .1rem;
          position: relative;
        }
      }

      .title {
        font-weight: 500;
      }

      .subtitle {
        font-weight: 300;
        margin-left: .3rem;
      }

      &.active {
        background-color: rgba(85, 149, 217, 0.2);
        font-weight: 700;
      }
    }

    .mdivSelection {
      margin: 0 .3rem 0 1rem;
      border-right: .5px solid $borderColor;
      border-bottom: .5px solid $borderColor;
      border-left: .5px solid $borderColor;

      .mdiv {
          padding: 0 .5rem;
          font-size: .7rem;
          cursor: pointer;
          background-color: #f5f5f5;

          &:hover {
            background-color: rgba(85, 149, 217, 0.2);
          }

          &.active {
            background-color: rgba(85, 149, 217, 0.2);
            font-weight: 700;
          }

          & + .mdiv {
            border-top: .5px solid $borderColor;
          }
      }

    }

  }


</style>
