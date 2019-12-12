<template>
  <div id="sunburst">

  </div>
</template>

<script>

import * as d3 from 'd3'
//set MEI namespace
d3.namespaces.mei = 'http://www.music-encoding.org/ns/mei'

let sunburstObject = {}
let unwatch

//sunburstLoadData(data, mode) wenn Daten geladen werden

export default {
  name: 'SunburstPane',
  computed: {

  },
  mounted () {
    this.setupSunburst()

    if (this.$store.getters.currentMEI !== null) {
      this.sunburstLoadData()
    }

    unwatch = this.$store.watch((state, getters) => ({
      request: getters.currentRequest, dataAvailable: (getters.currentMEI !== null)
    }),(newState, oldState) => {
      if (newState.request !== oldState.request) {
        // render data when already available
        if (this.$store.getters.currentMEI !== null) {
          this.sunburstLoadData()
        }
      }

      if (newState.dataAvailable && !oldState.dataAvailable) {
        this.sunburstLoadData()
      }
    })
  },
  beforeDestroy () {
    try {
      unwatch()
    } catch (err) {
      console.log('[ERROR] Unable to remove watcher: ' + err)
    }
  },
  methods: {
    openPageByElementID: function(id) {
      console.log('I should open the page that holds ID ' + id)
      try {
        let page = this.$verovio.getPageWithElement(id);
        this.$store.dispatch('setPage', page)
      } catch(err) {
        console.log('Unable to get page for ' + id + ': ' + err)
      }
    },
    setupSunburst: function() {
      let width = 280;
      let height = 280;
      let radius = (Math.min(width, height) / 2) - 10;
      let centerRadius = 0.3 * radius;
      let backCircleRadius = 0.15 * radius;

      sunburstObject.width = width;
      sunburstObject.height = height;
      sunburstObject.radius = radius;
      sunburstObject.centerRadius = centerRadius;
      sunburstObject.backCircleRadius = backCircleRadius;

      let svg = d3.select('#sunburst').append('svg')
          .attr('width', width)
          .attr('height', height);

      let g = svg.append('g')
          .attr('id','sunburstG')
          .attr('transform', 'translate(' + width / 2 + ',' + (height / 2) + ')');

      sunburstObject.svg = svg;
      sunburstObject.g = g;

      let colorScale = d3.scaleOrdinal().range([
          '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'
      ]);
      let xScale = d3.scaleLinear().range([0, 2 * Math.PI]);
      let rScale = d3.scaleLinear().range([0.4 * radius, radius]);

      sunburstObject.colorScale = colorScale;
      sunburstObject.xScale = xScale;
      sunburstObject.rScale = rScale;

      let arc = d3.arc()
          .startAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, xScale(d.x0))); })
          .endAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, xScale(d.x1))); })
          .innerRadius(function(d) { return Math.max(0, rScale(d.y0)); })
          .outerRadius(function(d) { return Math.max(0, rScale(d.y1)); });

      sunburstObject.arc = arc;
      console.log('sunburst successfully set up…')
    },
    sunburstRemoveData: function() {
      try {
          if(typeof sunburstObject.g !== 'undefined') {
              sunburstObject.g.selectAll('.sunburstPath').remove();
          }
      } catch(err) {
          console.error('ERROR: Unable to empty sunburst diagram: ' + err);
      }
    },
    sunburstLoadData: function() {
      let mode = this.$store.getters.activeModeId
      let mei = this.$store.getters.currentMEI
      let data = this.buildSunburstDataFromMEI(mei)
      sunburstObject.data = data

      let root = d3.hierarchy(data);
      root.sum(function(d) { return d.value; })
          .sort(function(a, b) { return 1.5 });

      let partition = d3.partition();
      partition(root);

      try {
          sunburstObject.g.selectAll('path')
          .data(root.descendants())
          .enter()
          .append('path').classed('sunburstPath',true)
          .attr('d', sunburstObject.arc)
          .attr('stroke', function(d) {

              if(mode === 'geneticComparison') {
                  let h = Math.round(0 + (120 * Number(d.data.addedLevel) / (Number(d.data.removedLevel) + Number(d.data.simLevel) + Number(0.0001))));
                  let s = '80%';
                  let l = Math.round((.5 + Number(d.data.idLevel) / 2) * 100) + '%';
                  let hsl = 'hsl(' + h + ',' + s + ',' + l + ')';

                  return hsl;
              }
              else if(d.data.idLevel !== 'undefined' && d.data.level === 'measure' && d.data.idLevel < 1) {
                  //return 'rgb(' + (240 - d.data.diffLevel * 240) +',0,' + (240 - d.data.simLevel * 240) + ')';

                  let h = Math.round(240 + (120 * Number(d.data.diffLevel) / (Number(d.data.diffLevel) + Number(d.data.simLevel) + Number(0.0001))));
                  let s = '80%';
                  let l = Math.round((.5 + Number(d.data.idLevel) / 2) * 100) + '%';
                  let hsl = 'hsl(' + h + ',' + s + ',' + l + ')';

                  return hsl;
              } else {
                  return '#bbbbbb';
              }

              while(d.depth > 1) d = d.parent;
              if(d.depth == 0) return 'lightgray';
              return d3.color(sunburstObject.colorScale(d.value)).darker(.5);
          })
          .attr('fill', function(d) {

              if(mode === 'geneticComparison') {
                  let h = Math.round(0 + (120 * Number(d.data.addedLevel) / (Number(d.data.removedLevel) + Number(d.data.simLevel) + Number(0.0001))));
                  let s = '80%';
                  let l = Math.round((.5 + Number(d.data.idLevel) / 2) * 100) + '%';
                  let hsl = 'hsl(' + h + ',' + s + ',' + l + ')';

                  return hsl;
              }
              else if(d.data.idLevel !== 'undefined' && d.data.level === 'measure' && d.data.idLevel < 1) {
                  //return 'rgb(' + (240 - d.data.diffLevel * 240) +',0,' + (240 - d.data.simLevel * 240) + ')';
                  let h = Math.round(240 + (120 * Number(d.data.diffLevel) / (Number(d.data.diffLevel) + Number(d.data.simLevel) + Number(0.0001))));
                  let s = '80%';
                  let l = Math.round((.5 + Number(d.data.idLevel) / 2) * 100) + '%';
                  let hsl = 'hsl(' + h + ',' + s + ',' + l + ')';

                  return  hsl;

              } else if(d.data.level === 'measure' && d.parent.data.n % 2 === 0) {
                  return '#cccccc';
              } else if(d.data.level === 'measure' && d.parent.data.n % 2 === 1) {
                  return '#e5e5e5';
              } else if(d.data.level === 'section' && d.data.n % 2 === 0) {
                  return '#cccccc';
              } else if(d.data.level === 'section' && d.data.n % 2 === 1) {
                  return '#e5e5e5';
              }

              while(d.depth > 1) d = d.parent;
              if(d.depth == 0) {
                  return 'lightgray';
              }
              return sunburstObject.colorScale(d.value);
          })
          .attr('opacity', 0.8)
          .on('click', this.sunburstClick)
          .append('title')
          .text(function(d) {
              if(d.data.level === 'measure' && typeof d.data.idLevel !== 'undefined') {
                  return 'Measure ' + d.data.n + '\nid:' + d.data.idLevel + '\nsim:' + d.data.simLevel + '\ndiff:' + d.data.diffLevel;
              } else if(d.data.level === 'measure') {
                  return 'Measure ' + d.data.n;
              } else if(d.data.level === 'section') {
                  return 'Section ' + d.data.n;
              }
              return d.data.name;
          });

      } catch(err) {
          console.error('error1: ' + err)
      }

      /*try {
          sunburstObject.g.selectAll('text')
          .data(root.descendants())
          .enter()
          .append('text')
          .attr('fill', 'black')
          .attr('transform', function(d) { return 'translate(' + sunburstObject.arc.centroid(d) + ')'; })
          .attr('dy', '5px')
          .attr('font', '10px')
          .attr('text-anchor', 'middle')
          .on('click', sunburstClick)
          .text(function(d) { return d.data.name; });
      } catch(err) {
          console.error('error2: ' + err)
      }*/
    },

    buildSunburstDataFromMEI: function(mei) {
      let oParser = new DOMParser();
      let oDOM = oParser.parseFromString(mei, "application/xml");
      // print the name of the root element or error message
      //console.log(oDOM.documentElement.nodeName == "parsererror" ? "error while parsing" : oDOM.documentElement.nodeName);

      try {

          let meiDoc = oDOM.documentElement;

          let score = meiDoc.querySelector('score');
          let obj = {
              name: score.parentNode.getAttribute('label'),
              level: 'mdiv',
              children: []
          }

          let sections = score.querySelectorAll('section');
          for (let i=0;i<sections.length;i++) {

              let n = i + 1;
              let section = sections[i];
              let sectionObj = {
                  n: n,
                  level: 'section',
                  children: []
              }

              let measures = section.querySelectorAll('measure');
              for(let j=0;j<measures.length;j++) {

                  let measure = measures[j];
                  let measureObj = {
                      n: measure.getAttribute('n'),
                      level: 'measure',
                      id: measure.getAttribute('xml:id'),
                      value: 1
                  }

                  if(measure.hasAttribute('differenceLevel')) {
                      measureObj.diffLevel = measure.getAttribute('differenceLevel');
                      measureObj.simLevel = measure.getAttribute('similarityLevel');
                      measureObj.idLevel = measure.getAttribute('identityLevel');
                  }

                  if(measure.hasAttribute('removedLevel')) {
                      measureObj.removedLevel = measure.getAttribute('removedLevel');
                      measureObj.addedLevel = measure.getAttribute('addedLevel');
                  }

                  sectionObj.children.push(measureObj);
              }

              obj.children.push(sectionObj);

          }

          return obj;
      } catch(err) {
          console.log('error:buildSunburstDataFromMEI ' + err)
      }
    },

    sunburstClick: function (d) {
      if(d.data.level === 'measure') {
          try {
              this.openPageByElementID(d.data.id);
          } catch(err) {
              console.log('error when opening measure: ' + err)
          }

          this.sunburstClick(d.parent);
          return true;
      }

      let tween = sunburstObject.g.transition()
        .duration(500)
        .tween('scale', function() {
          let xdomain = d3.interpolate(sunburstObject.xScale.domain(), [d.x0, d.x1]);
          let ydomain = d3.interpolate(sunburstObject.rScale.domain(), [d.y0, 1]);
          let yrange = d3.interpolate(sunburstObject.rScale.range(), [d.y0 ? sunburstObject.backCircleRadius : sunburstObject.centerRadius, sunburstObject.radius]);
          return function(t) {
            sunburstObject.xScale.domain(xdomain(t));
            sunburstObject.rScale.domain(ydomain(t)).range(yrange(t));
          };
        });

      tween.selectAll('path')
        .attrTween('d', function(d) {
          return function() {
            return sunburstObject.arc(d);
          };
        });

      tween.selectAll('text')
        .attrTween('transform', function(d) {
          return function() {
            return 'translate(' + sunburstObject.arc.centroid(d) + ')';
          };
        })
        .attrTween('opacity', function(d) {
          return function() {
            return(sunburstObject.xScale(d.x0) < 2 * Math.PI) && (sunburstObject.xScale(d.x1) > 0.0) && (sunburstObject.rScale(d.y1) > 0.0) ? 1.0 : 0;
          };
        })
        .attrTween('font', function(d) {
          return function() {
            return(sunburstObject.xScale(d.x0) < 2 * Math.PI) && (sunburstObject.xScale(d.x1) > 0.0) && (sunburstObject.rScale(d.y1) > 0.0) ? '10px' : 1e-6;
          };
        });
    }


  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  #sunburst {
    position: absolute;
    top: .3rem;
    left: .3rem;
    width: 281px;
    height: 281px;
    z-index: 10;
    border: .5px solid #999999;
    border-radius: 300px;
    padding: 0;
    background-color: #ffffffcc;
    opacity: .4;
    transition: opacity .5s ease-out;
    -moz-transition: opacity .5s ease-out;
    -webkit-transition: opacity .5s ease-out;
    -o-transition: opacity .5s ease-out;

    &:hover {
      opacity: 1;
    }
  }
</style>
