<template>
  <div id='svgContainer'></div>
</template>

<script>

import indizes from './../searchIndizes.json'

let unwatch
let width
let height
let zoom = 35
let selectionStarted = false

export default {
  name: 'VerovioBaseComponent',
  components: {

  },
  created () {
    // this.setOptions() -> can't do this yet, because it depends on screen size, which isn't determined yet
    this.$store.dispatch('fetchMEI')
  },
  mounted () {
    window.addEventListener('resize', this.handleResize)
    this.setOptions()

    // initial Verovio rendering (when data available)
    if (this.$store.getters.currentMEI !== null) {
      this.loadMEI()
      this.renderPage(this.$store.getters.currentPage)
    }

    unwatch = this.$store.watch(
      (state, getters) => ({ request: getters.currentRequest, page: getters.currentPage, zoom: getters.currentZoom, dataAvailable: (getters.currentMEI !== null)}),
      (newState, oldState) => {
        // console.log(`Updating from ${oldState.request} to ${newState.request}`);
        if (newState.request !== oldState.request) {
          // make sure the required data is available
          this.$store.dispatch('fetchMEI')

          // render data when already available
          if (this.$store.getters.currentMEI !== null) {
            this.loadMEI()
            this.renderPage(this.$store.getters.currentPage)
          }
        }

        // render MEI as soon as it arrives from the API. This responds only for the first time a request has been made
        if (newState.dataAvailable && !oldState.dataAvailable) {
          this.loadMEI()
          this.renderPage(newState.page)
        }

        if (newState.page !== oldState.page) {
          // make verovio render the requested page
          this.renderPage(newState.page)
        }

        if (newState.zoom !== oldState.zoom && newState.dataAvailable) {
          // make verovio change the zoom level
          try {
            this.handleResize()
          } catch(err) {
            console.log('error: Unable to zoom: ' + err)
          }
          console.log('done')

        }

      }
    )
  },
  updated () {
    // this.$store.dispatch('fetchMEI')
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.handleResize)
    try {
      unwatch()
    } catch (err) {
      console.log('[ERROR] Unable to remove watcher: ' + err)
    }
  },
  methods: {
    setOptions: function () {

      let zooooom = this.$store.getters.currentZoom

      width = document.getElementById('analysis').clientWidth
      height = document.getElementById('analysis').clientHeight
      let internalWidth = (width - 20) * 100 / zooooom
      let internalHeight = (height - 20) * 100 / zooooom

      // console.log('\nsetting width to: ' + width + ', internal: ' + internalWidth)
      // console.log('setting height to: ' + height + ', internal: ' + internalHeight)

      let options = {
        scale: zooooom,
        footer: 'none', // takes out the 'rendered by Verovio' footer
        header: 'none', // takes out the work label at the top
        // breaks: 'none', -> continuous staff
        pageWidth: internalWidth,
        pageHeight: internalHeight,
        adjustPageHeight: true,
        spacingNonLinear: 1,
        spacingLinear: 0.05
        // svgViewBox: 1
      }
      try {
        this.$verovio.setOptions(options)
      } catch (err) {
        console.log('ERR: ' + err)
      }
    },
    loadMEI: function () {
      this.$verovio.loadData(this.currentMEI + '\n')
      let maxPage = this.$verovio.getPageCount()
      if(maxPage > 0) {
        this.$store.dispatch('setMaxPage',maxPage)
      }
    },
    renderPage: function (n) {
      // set listeners

      let svg = this.$verovio.renderToSVG(this.$store.getters.currentPage, {})
      let svgContainer = document.querySelector('#svgContainer')
      svgContainer.innerHTML = svg

      let outerSVG = document.querySelector('#svgContainer > svg')
      outerSVG.addEventListener('mousedown',this.startSelectionRect)
      // outerSVG.addEventListener('mousemove',this.updateSelectionRect)
      // outerSVG.addEventListener('mouseup',this.finishSelectionRect)
      // outerSVG.addEventListener('click',this.handleSelectionRect)
    },
    startSelectionRect: function (e) {

      if (!this.$store.getters.searchSelectionActive) {
        return false
      }

      let outerSVG = document.querySelector('#svgContainer > svg')
      // outerSVG.addEventListener('mousedown',this.startSelectionRect)
      outerSVG.addEventListener('mousemove',this.updateSelectionRect)
      outerSVG.addEventListener('mouseup',this.finishSelectionRect)

      // let outerSVG = document.querySelector('#svgContainer > svg')
      let innerSVG = document.querySelector('#svgContainer svg svg')
      let clientRect = outerSVG.getClientRects()[0]
      let htmlWidth = clientRect.width
      let svgWidth = innerSVG.getAttribute('viewBox').split(' ')[2]
      let factor = svgWidth / htmlWidth
      let widthOffset = outerSVG.getBoundingClientRect().left
      let heightOffset = outerSVG.getBoundingClientRect().top

      let cx = (e.clientX - widthOffset) * factor
      let cy = (e.clientY - heightOffset) * factor

      let existingCircle = document.getElementById('selectionStart')
      let existingRect = document.getElementById('selectionRect')

      if (existingCircle === null) {
        let circle = document.createElementNS('http://www.w3.org/2000/svg','circle')

        circle.setAttributeNS(null,'id','selectionStart')
        circle.setAttributeNS(null,'cx',cx)
        circle.setAttributeNS(null,'cy',cy)
        circle.setAttributeNS(null,'r',100)
        circle.setAttributeNS(null,'fill','transparent')
        circle.setAttributeNS(null,'stroke','gray')
        circle.setAttributeNS(null,'stroke-width',60)

        innerSVG.appendChild(circle)
      } else {
        existingCircle.setAttributeNS(null,'cx',cx)
        existingCircle.setAttributeNS(null,'cy',cy)
      }

      if (existingRect === null) {
        let rect = document.createElementNS('http://www.w3.org/2000/svg','rect')

        rect.setAttributeNS(null,'id','selectionRect')
        rect.setAttributeNS(null,'x',cx)
        rect.setAttributeNS(null,'y',cy)
        rect.setAttributeNS(null,'width',0)
        rect.setAttributeNS(null,'height',0)
        rect.setAttributeNS(null,'fill','#99999933')
        rect.setAttributeNS(null,'stroke','gray')
        rect.setAttributeNS(null,'stroke-width',20)

        innerSVG.appendChild(rect)
      } else {
        existingRect.setAttributeNS(null,'x',cx)
        existingRect.setAttributeNS(null,'y',cy)
        existingRect.setAttributeNS(null,'width',0)
        existingRect.setAttributeNS(null,'height',0)
      }
      // console.log('startSelectionRect: selectionStarted=' + selectionStarted + '->' + !selectionStarted)
      selectionStarted = !selectionStarted

    },
    updateSelectionRect: function (e) {
      // console.log('updateSelectionRect')
      if (!this.$store.getters.searchSelectionActive) {
        return false
      }

      if (!selectionStarted) {
        return false
      }

      //console.log(e)

      let outerSVG = document.querySelector('#svgContainer > svg')
      let innerSVG = document.querySelector('#svgContainer svg svg')
      let clientRect = outerSVG.getClientRects()[0]
      let htmlWidth = clientRect.width
      let svgWidth = innerSVG.getAttribute('viewBox').split(' ')[2]
      let factor = svgWidth / htmlWidth
      let widthOffset = outerSVG.getBoundingClientRect().left
      let heightOffset = outerSVG.getBoundingClientRect().top

      let x = (e.clientX - widthOffset) * factor
      let y = (e.clientY - heightOffset) * factor

      let existingCircle = document.getElementById('selectionStart')
      let existingRect = document.getElementById('selectionRect')

      let startx = existingCircle.getAttribute('cx')
      let starty = existingCircle.getAttribute('cy')

      let width = x - startx
      let height = y - starty

      if (width < 0) {
        existingRect.setAttributeNS(null,'x',x)
        width = startx - x
      } else {
        existingRect.setAttributeNS(null,'x',startx)
      }

      if (height < 0) {
        existingRect.setAttributeNS(null,'y',y)
        height = starty - y
      } else {
        existingRect.setAttributeNS(null,'y',starty)
      }

      existingRect.setAttributeNS(null,'width',width)
      existingRect.setAttributeNS(null,'height',height)

      this.getElementsByRect(outerSVG, existingRect)
    },
    finishSelectionRect: function (e) {
      if (!this.$store.getters.searchSelectionActive) {
        return false
      }

      // console.log('finishSelectionRect, started: ' + selectionStarted)

      let outerSVG = document.querySelector('#svgContainer > svg')
      // outerSVG.addEventListener('mousedown',this.startSelectionRect)
      outerSVG.removeEventListener('mousemove',this.updateSelectionRect)
      outerSVG.removeEventListener('mouseup',this.finishSelectionRect)

      if (!selectionStarted) {
        // on first occurence, nothing should happen
        return false
      }

      // console.log('finishSelectionRect: selectionStarted=' + selectionStarted)
      selectionStarted = false

      // let outerSVG = document.querySelector('#svgContainer > svg')
      let innerSVG = document.querySelector('#svgContainer svg svg')
      let clientRect = outerSVG.getClientRects()[0]
      let htmlWidth = clientRect.width
      let svgWidth = innerSVG.getAttribute('viewBox').split(' ')[2]
      let factor = svgWidth / htmlWidth
      let widthOffset = outerSVG.getBoundingClientRect().left
      let heightOffset = outerSVG.getBoundingClientRect().top

      let x = (e.clientX - widthOffset) * factor
      let y = (e.clientY - heightOffset) * factor

      let existingCircle = document.getElementById('selectionStart')
      let existingRect = document.getElementById('selectionRect')

      let startx = existingCircle.getAttribute('cx')
      let starty = existingCircle.getAttribute('cy')

      let width = x - startx
      let height = y - starty

      if (width < 0) {
        existingRect.setAttributeNS(null,'x',x)
        width = startx - x
      } else {
        existingRect.setAttributeNS(null,'x',startx)
      }

      if (height < 0) {
        existingRect.setAttributeNS(null,'y',y)
        height = starty - y
      } else {
        existingRect.setAttributeNS(null,'y',starty)
      }

      // existingRect.setAttributeNS(null,'width',width)
      // existingRect.setAttributeNS(null,'height',height)
      let selectedIDs = this.getElementsByRect(outerSVG, existingRect)
      console.log('The following ' + selectedIDs.length + ' notes have been selected:')
      console.log(selectedIDs)
      this.search(selectedIDs)


      existingCircle.remove()
      existingRect.remove()

    },
    handleSelectionRect: function (e) {
      console.log('handleSelectionRect ' + selectionStarted)
      if (!this.$store.getters.searchSelectionActive) {
        return false
      }

      // as the mousedown event comes before the click, this is already changed!
      if (selectionStarted) {
        this.startSelectionRect(e)
      } else {
        this.finishSelectionRect(e)
      }

      /*let outerSVG = document.querySelector('#svgContainer > svg')
      let innerSVG = document.querySelector('#svgContainer svg svg')
      let clientRect = outerSVG.getClientRects()[0]
      let htmlWidth = clientRect.width
      let svgWidth = innerSVG.getAttribute('viewBox').split(' ')[2]
      let factor = svgWidth / htmlWidth
      let widthOffset = outerSVG.getBoundingClientRect().left
      let heightOffset = outerSVG.getBoundingClientRect().top

      let cx = (e.clientX - widthOffset) * factor
      let cy = (e.clientY - heightOffset) * factor

      let existingCircle = document.getElementById('selectionStart')
      let existingRect = document.getElementById('selectionRect')

      // starting selection
      if (!selectionStarted) {
        if (existingCircle === null) {
          let circle = document.createElementNS('http://www.w3.org/2000/svg','circle')

          circle.setAttributeNS(null,'id','selectionStart')
          circle.setAttributeNS(null,'cx',cx)
          circle.setAttributeNS(null,'cy',cy)
          circle.setAttributeNS(null,'r',100)
          circle.setAttributeNS(null,'fill','transparent')
          circle.setAttributeNS(null,'stroke','red')
          circle.setAttributeNS(null,'stroke-width',60)

          innerSVG.appendChild(circle)
        } else {
          existingCircle.setAttributeNS(null,'cx',cx)
          existingCircle.setAttributeNS(null,'cy',cy)
        }

        if (existingRect === null) {
          let rect = document.createElementNS('http://www.w3.org/2000/svg','rect')

          rect.setAttributeNS(null,'id','selectionRect')
          rect.setAttributeNS(null,'x',cx)
          rect.setAttributeNS(null,'y',cy)
          rect.setAttributeNS(null,'width',0)
          rect.setAttributeNS(null,'height',0)
          rect.setAttributeNS(null,'fill','#ff000033')
          rect.setAttributeNS(null,'stroke','red')
          rect.setAttributeNS(null,'stroke-width',20)

          innerSVG.appendChild(rect)
        } else {
          existingRect.setAttributeNS(null,'x',cx)
          existingRect.setAttributeNS(null,'y',cy)
          existingRect.setAttributeNS(null,'width',0)
          existingRect.setAttributeNS(null,'height',0)
        }
      // ending selection
      } else {

        let startx = existingCircle.getAttribute('cx')
        let starty = existingCircle.getAttribute('cy')

        let width = cx - startx
        let height = cy - starty

        if (width < 0) {
          existingRect.setAttributeNS(null,'x',cx)
          width = startx - cx
        } else {
          existingRect.setAttributeNS(null,'x',startx)
        }

        if (height < 0) {
          existingRect.setAttributeNS(null,'y',cy)
          height = starty - cy
        } else {
          existingRect.setAttributeNS(null,'y',starty)
        }

        existingRect.setAttributeNS(null,'width',width)
        existingRect.setAttributeNS(null,'height',height)

        existingCircle.remove()

        this.getElementsByRect(outerSVG, existingRect)
      }

      selectionStarted = !selectionStarted*/
    },
    getElementsByRect: function (svg, rect) {

      let x1 = parseInt(rect.getAttribute('x'))
      let x2 = x1 + parseInt(rect.getAttribute('width'))
      let y1 = parseInt(rect.getAttribute('y'))
      let y2 = y1 + parseInt(rect.getAttribute('height'))

      // console.log(rect)
      // console.log('looking for events ' + x1 + '<=x<=' + x2 + ' and ' + y1 + '<=y<=' + y2)

      let events = Array.from(svg.querySelectorAll('g.note, g.chord, g.rest, g.mRest'))
      let affected = events.filter(event => {
        // if(event.classList.contains('note') || event.classList.contains('chord'))
        if(event.classList.contains('mRest')) {
          let rect = event.querySelector('rect')
          let rx1 = parseInt(rect.getAttribute('x'))
          let ry1 = parseInt(rect.getAttribute('y'))
          let rx2 = rx1 + parseInt(rect.getAttribute('width'))
          let ry2 = ry1 + parseInt(rect.getAttribute('height'))
          let fitsx = rx1 >= x1 && rx1 <= x2
          let fitsy = ry1 >= y1 && ry2 <= y2
          if (fitsx && fitsy) {console.log('spotted mRest ' + event.id)}
          return fitsx && fitsy
        } else {
          let use = event.querySelector('use')
          let usex = use.getAttribute('x')
          let usey = use.getAttribute('y')
          let fitsx = usex >= x1 && usex <= x2
          let fitsy = usey >= y1 && usey <= y2
          return fitsx && fitsy
        }

      })

      let previousSelection = Array.from(svg.querySelectorAll('g.selected'))
      let unselected = previousSelection.filter(event => {
        if(event.classList.contains('mRest')) {
          let rect = event.querySelector('rect')
          let rx1 = parseInt(rect.getAttribute('x'))
          let ry1 = parseInt(rect.getAttribute('y'))
          let rx2 = rx1 + parseInt(rect.getAttribute('width'))
          let ry2 = ry1 + parseInt(rect.getAttribute('height'))
          let fitsx = rx1 >= x1 && rx2 <= x2
          let fitsy = ry1 >= y1 && ry2 <= y2
          return !(fitsx && fitsy)
        } else {
          let use = event.querySelector('use')
          let usex = use.getAttribute('x')
          let usey = use.getAttribute('y')
          let fitsx = usex >= x1 && usex <= x2
          let fitsy = usey >= y1 && usey <= y2
          return !(fitsx && fitsy)
        }
      })

      let affectedIDs = []

      unselected.forEach((event,index) => {
        try {
          event.closest('g.staff').classList.remove('hasSelections')
        } catch(err) {

        }
        event.classList.remove('selected')
      })
      affected.forEach((event,index) => {
        affectedIDs.push(event.id)
        event.classList.add('selected')
        try {
          event.closest('g.staff').classList.add('hasSelections')
        } catch(err) {

        }
      })

      return affectedIDs
    },
    handleResize: function() {
      try {
        // make sure we have loaded a file
        if(this.$verovio.getPageCount() === 0) {
            return false
        }

        let oldPage = this.$store.getters.currentPage

        // get ID of first measure on current page
        let firstMeasureId = document.querySelector('#svgContainer .measure').id
        // update Verovio options
        this.setOptions()
        this.$verovio.redoLayout()

        //get new page with that measure
        let page = this.$verovio.getPageWithElement(firstMeasureId)

        //set new max page
        let newMaxPage = this.$verovio.getPageCount()
        if(newMaxPage > 0) {
          this.$store.dispatch('setMaxPage',newMaxPage)
        }
        if(oldPage === page) {
          console.log('page stays the same')
          this.renderPage(page)
        } else {
          this.$store.dispatch('setPage',page)
        }
      } catch(err) {
          console.log('ERROR: Unable to redo Verovio layout: ' + err);
      }
    },
    search: function(ids) {
      console.log('starting search')
      let part = indizes.filter(part => part.full.ids.indexOf(ids[0]) !== -1)[0]
      console.log(part)

      let fullIndex = part.full.ids.indexOf(ids[0])
      let rdomIndex = part.rdom.ids.indexOf(ids[0])
      let norestIndex = part.norest.ids.indexOf(ids[0])
      let rdomNoRestIndex = part.rdomNoRest.ids.indexOf(ids[0])
      let tiesMergedIndex = part.tiesMerged.ids.indexOf(ids[0])
      let tiesMergedNoRestIndex = part.tiesMergedNoRest.ids.indexOf(ids[0])

      // retrieves all indizes for a given value
      const getStartIndizes = (arr, iterator) => arr.reduce((iter, el, i) => {
        //(el === val ? [...acc, i] : acc)

        }, iterator);

      console.log('fullIndex: ' + fullIndex)

      let pitchContourArr = part.full.pitchContour.split('')
      let pitchContour_query = pitchContourArr.slice(fullIndex,5)
      let iterator = {}
      iterator.query = pitchContour_query
      iterator.currentValues = []
      iterator.hits = []
      iterator.i = 0

      console.log(pitchContourArr)
      console.log(pitchContour_query)

      let full_pitchContour_hits = getStartIndizes(part.full.pitchContour,iterator)

      console.log('found some hits: ')
      console.log(full_pitchContour_hits)

    }

  },
  computed: {
    activeModeId: function () {
      return this.$store.getters.activeModeId
    },
    activeModeObject: function () {
      return this.$store.getters.activeModeObject
    },
    currentPage: function () {
      return this.$store.getters.currentPage
    },
    currentMEI: function () {
      return this.$store.getters.currentMEI
    },
    searchSelectionActive: function() {
      return this.$store.getters.searchSelectionActive
    },
    currentZoom: function() {
      return this.$store.getters.currentZoom
    }
  }
}
</script>

<style lang="scss">

  $selection1: #ff0000; /* red */
  $selection2: #0000ff; /* blue */
  $selection3: #228b22; /* forestgreen */
  $selection4: #c71585; /* mediumvioletred */
  $selection5: #ff8c00; /* darkorange */
  $selection6: #006400; /* darkgreen */
  $selection7: #b22222; /* firebrick */
  $selection8: #4682b4; /* steelblue */

  svg g.staff.hasSelections {
    .selected, .selected * {
      fill: $selection1;
      stroke: $selection1;
    }

    & ~ g.staff.hasSelections {
      .selected, .selected * {
        fill: $selection2;
        stroke: $selection2;
      }

      & ~ g.staff.hasSelections {
        .selected, .selected * {
          fill: $selection3;
          stroke: $selection3;
        }

        & ~ g.staff.hasSelections {
          .selected, .selected * {
            fill: $selection4;
            stroke: $selection4;
          }

          & ~ g.staff.hasSelections {
            .selected, .selected * {
              fill: $selection5;
              stroke: $selection5;
            }

            & ~ g.staff.hasSelections {
              .selected, .selected * {
                fill: $selection6;
                stroke: $selection6;
              }

              & ~ g.staff.hasSelections {
                .selected, .selected * {
                  fill: $selection7;
                  stroke: $selection7;
                }

                & ~ g.staff.hasSelections {
                  .selected, .selected * {
                    fill: $selection8;
                    stroke: $selection8;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
</style>
