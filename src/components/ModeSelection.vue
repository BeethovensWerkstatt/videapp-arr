<template>
  <div id="modeSelector">
    <SectionLabel v-bind:label="i18n('perspective')"/>
    <ul class="navigationList">

      <li class="modeBtn" v-for="mode in modes" v-bind:id="mode.id" v-bind:class="{active: (mode.id === activeModeId)}" v-on:click="activateMode(mode.id)">
        <a class="btn btn-action btn-primary btn-sm glossaryLink" v-bind:href="getLink(mode.glossary)" target="_blank"><i class="fas fa-book"></i></a>
        {{mode.label.de}}
      </li>
    </ul>
  </div>
</template>

<script>

import SectionLabel from '@/components/SectionLabel.vue'

export default {
  name: 'ModeSelection',
  components: {
    SectionLabel
  },
  computed: {
    modes: function() {
      return this.$store.getters.modes
    },
    activeModeId: function() {
      return this.$store.getters.activeModeId
    },
    activeModeObject: function() {
      return this.$store.getter.activeModeObject
    },

  },
  methods: {
    activateMode (id) {
      this.$store.dispatch('activateMode',id)
    },
    i18n: function(code) {
      return this.$i18n(code)
    },
    getLink: function(glossaryLink) {
      let lang = this.$store.getters.language
      return glossaryLink[lang]
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

ul.navigationList {
  list-style-type: none;
  margin: 0;
  padding: 0;

  li {
    margin: 0 .2rem .5rem;
    text-align: left;
    padding: .3em 1rem;
    font-weight: 500;
    position: relative;
    cursor: pointer;
    border: .5px solid #666666;
    border-radius: 3px;
    background-color: #e5e5e5;

    .glossaryLink {
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

    &.active {

      font-weight: 500;
      background-color: rgba(85, 149, 217, 0.2);
      /*&:before {
          position: absolute;
          left: .2em;
          content: '‣'
      }*/
    }
  }
}

</style>
