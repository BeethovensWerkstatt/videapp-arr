<template>
  <div id="loadingBack" v-if="isloading || loadingError !== null">
    <div id="loadingFront">
      <div v-if="isloading">
        <div class="loading loading-lg"></div>
        <div id="loadingText">{{i18n('loadingMessage')}}</div>
      </div>
      <div v-if="loadingError !== null">
        <div class="toast toast-error">
          <h1>{{i18n('networkErrorHeading')}}</h1>
          <p><code>{{loadingError}}</code></p>
          <p>{{i18n('networkErrorBody')}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Loading',
  components: {
  },
  computed: {
    isloading: function() {
      return (this.$store.getters.currentlyLoading !== null)
    },
    loadingError: function() {
      return this.$store.getters.loadingError
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

#loadingBack {
  position: fixed;
  z-index: 10;
  top: 0;
  left: 0;
  right: 0;
  left: 0;
  min-height: 1000px;
  background-color: #ffffffcc;

  #loadingFront {
      width: 300px;
      margin: 10rem calc(50% - 150px);
      text-align: center;

  }
}

</style>
