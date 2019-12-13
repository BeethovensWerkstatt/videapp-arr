<template>
  <div id="gotoMeasurePane">
    <label>Gehe zu Takt:</label>
    <span class="input-group">
      <input class="pagenum form-input input-sm" type="text" pattern="\d+">
      <button class="btn btn-primary btn-sm btn-action input-group-btn" v-on:click="increasePage()"><i class="fas fa-caret-right"></i></button>
    </span>
  </div>
</template>

<script>

export default {
  name: 'GotoMeasurePane',
  computed: {

  },
  methods: {

  },
  data: {
    measure: ''
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  #gotoMeasurePane {
    position: absolute;
    top: .3rem;
    left: .3rem;
    width: 20rem;
    height: 3.2rem;
    z-index: 15;
    border: .5px solid #999999;
    border-radius: 2px;
    padding: .8rem;
    background-color: #e5e5e5;

    label {
      text-align: left;
    }
  }
</style>
