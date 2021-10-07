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

        <div class="opening" v-if="!comparisonSelected && lang === 'de'">
          <div class="toast">
            <h1>Herzlich willkommen bei der VideApp<sub>Arrangements</sub></h1>
            <p>Dieses Werkzeug ermöglicht Ihnen Vergleiche von Fassungen desselben Werks unter verschiedenen Perspektiven. So gewinnen Sie detaillierte Einblicke in Beethovens Bearbeitungstechniken. Die dabei behandelten Werke in ihren unterschiedlichen Versionen finden Sie anwählbar im Menü links aufgelistet.</p>
            <p>Eine Kurzbeschreibung zu dem jeweiligen Fassungsvergleich finden Sie unter dem Informations-Icon. Dort finden Sie auch einen Link zu einer ausführlicheren Beschreibung. Die VideApp<sub>Arr</sub> ist Bestandteil des 2. Moduls des Projekts, vgl. die <a href="https://beethovens-werkstatt.de/modul-2/" target=_blank>Übersicht zu Modul 2</a>. Rückmeldungen nehmen wir gerne unter info@beethovens-werkstatt.de entgegen.</p>
            <p>Wählen Sie jetzt bitte einen Fassungsvergleich auf der linken Seite aus.</p>
          </div>
        </div>
        <!--<h1>{{i18n('selectComparisonToastHeading')}}</h1>
        <p>{{i18n('selectComparisonToastBody')}}</p>-->

        <div class="opening" v-else-if="!modeSelected && lang === 'de'">
          <div class="toast toast-primary">
            <h1>{{i18n('selectPerspectiveToastHeading')}}</h1>
            <p>Die Art der Perspektive wählen Sie im Menü darunter: Ob schlichte Synopse der jeweiligen Fassungen (mit der Möglichkeit dort eigene farbliche Markierungen vorzunehmen, <strong>Fassungssynopse</strong>), farbliche Hervorhebung der beim Umsetzen zu beobachtenden kompositorischen Maßnahmen (<strong>Bearbeitungsmaßnahmen</strong>), Vergleich auf der Ebene einzelner Noten (mit unterschiedlichen Farbwerten für die Art der Beziehung zum Ausgangston, <strong>Einzelnotenvergleich</strong>), grafische Wiedergabe des Verhältnisses der bloßen Kontur der einzelnen Stimmen (<strong>Stimmenkontur</strong>), Dichte der Noten-"Onsets" (<strong>Ereignisdichte</strong>) oder Modifikationen der Harmonik (<strong>Harmonievergleich</strong>) – all dies verdeutlicht Beethovens Herangehensweise jenseits purer mechanischer Übertragung.</p>
          </div>
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
    },
    lang: function() {
      return this.$store.getters.language
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
  top: 62.5px;
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

    width: calc(100% - 360px);

    .toast {
      width: unset;
      margin: 3rem;
    }
  }

  .opening {
    height: 100%;
    overflow: scroll;
    p {
      padding: 0 2rem 1rem;
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
