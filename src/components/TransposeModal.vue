<template>
  <div id="transposeModal" class="modal modal-sm" v-bind:class="{ 'active': transposeVisible }">
    <a href="#close" class="modal-overlay" aria-label="Close" v-on:click="toggleTransposePane($event)"></a>
    <div class="modal-container">
      <div class="modal-header">
        <a href="#close" class="btn btn-clear float-right" aria-label="Close" v-on:click="toggleTransposePane($event)"></a>
        <div class="modal-title h5">{{i18n('transposition')}}</div>
      </div>
      <div class="modal-body">
        <div class="content">
          <div class="form-group">
            <label class="form-radio">
              <input type="radio" name="transpose" v-on:change="proposeTranspose($event)" value="none" v-bind:checked="currentTranspose === 'none'">
              <i class="form-icon"></i> {{i18n('transposeModal_noTrans')}}
            </label>
            <label class="form-radio">
              <input type="radio" name="transpose" v-on:change="proposeTranspose($event)" value="matchFile1" v-bind:checked="currentTranspose === 'matchFile1'">
              <i class="form-icon"></i> {{i18n('transposeModal_match1')}}<br/><small>{{i18n('transposeModal_match1_desc')}}</small>
            </label>
            <label class="form-radio">
              <input type="radio" name="transpose" v-on:change="proposeTranspose($event)" value="matchFile2" v-bind:checked="currentTranspose === 'matchFile2'">
              <i class="form-icon"></i> {{i18n('transposeModal_match2')}}<br/><small>{{i18n('transposeModal_match2_desc')}}</small>
            </label>
            <label class="form-radio">
              <input type="radio" name="transpose" v-on:change="proposeTranspose($event)" value="C" v-bind:checked="currentTranspose === 'C'">
              <i class="form-icon"></i> {{i18n('transposeModal_avoidAccid')}}
            </label>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button v-on:click="toggleTransposePane($event)" class="btn btn-sm cancelBtn">{{i18n('cancelButtonLabel')}}</button>
        <button v-on:click="acceptTranspose($event)" class="btn btn-sm btn-primary">{{i18n('okButtonLabel')}}</button>
      </div>
    </div>

  </div>
</template>

<script>

export default {
  name: 'TransposeModal',
  methods: {
    i18n: function(code) {
      return this.$i18n(code)
    },
    toggleTransposePane: function(e) {
      this.$store.dispatch('rejectProposedTranspose')
      this.$store.dispatch('deactivateTransposeSelection')
      e.preventDefault()
    },
    proposeTranspose: function(e) {
      this.$store.dispatch('setProposedTranspose',e.target.value)
      e.preventDefault()
    },
    acceptTranspose: function(e) {
      console.log()
      this.$store.dispatch('acceptProposedTranspose')
      this.$store.dispatch('deactivateTransposeSelection')
      e.preventDefault()
    }
  },
  computed: {
    transposeVisible: function() {
      return this.$store.getters.transposeSelectionVisible
    },
    currentTranspose: function() {
      return this.$store.getters.proposedTranspose
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

  .cancelBtn {
    margin-right: .2rem;
  }

  .form-radio {
    text-align: left;
  }

</style>
