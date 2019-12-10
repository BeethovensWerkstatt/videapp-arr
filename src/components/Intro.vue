<template>
  <div class="intro">
    <i class="closeIcon icon icon-cross icon-3x" v-on:click="hideIntro()"></i>
    <div id="introText"/>
  </div>
</template>

<script>
// @ is an alias to /src

let unwatch

export default {
  name: 'Intro',
  components: {

  },
  created () {
    this.$store.dispatch('fetchIntro')
  },
  mounted () {
    unwatch = this.$store.watch(
      (state, getters) => ({ intro: getters.currentIntroText }),
      (newState, oldState) => {
        // console.log(`Updating from ${oldState.request} to ${newState.request}`);
        /*if (newState.intro !== oldState.intro && newState.intro !== null) {
          // make sure the required data is available
          this.$store.dispatch('fetchIntro')

          // render data when already available
          /*if (this.$store.getters.currentMEI !== null) {
            this.loadMEI()
            this.renderPage(this.$store.getters.currentPage)
          }*
        }*/
        if (newState.intro !== oldState.intro) {
          let elem = document.querySelector('#introText').innerHTML = newState.intro
        }


      }
    )
  },
  beforeDestroy () {
    try {
      unwatch()
    } catch (err) {
      console.log('[ERROR] Unable to remove watcher: ' + err)
    }
  },
  computed: {
    currentIntroText: function () {
      return this.$store.getters.currentIntroText
    },
    currentIntroId: function () {
      return this.$store.getters.currentIntroId
    }
  },
  methods: {
    hideIntro: function() {
      this.$store.dispatch('hideIntro')
    }
  }
}
</script>

<style scoped lang="scss">
  .intro {
    padding: 2rem;

    .closeIcon {
      cursor:pointer;
      float: right;
    }

    #introText {
      text-align: left;
      font-size: .9rem;
    }
  }
</style>
