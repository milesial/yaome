<template>
  <v-layout
    column
    fill-height
    class="ma-0"
    v-resize="onResize"
  >
    <v-flex id="editbox" class="ma-0 pa-0" ref="editbox">
      <div id="editbar-right">
        <v-menu
          v-if="topOptions"
          v-model="optionsMenu"
          :close-on-content-click="false"
          offset-x
        >
          <template v-slot:activator="{ on }">
            <v-btn
              text
              large
              rounded
              v-on="on"
            >
              <v-icon class="mr-2">settings</v-icon>
              Settings
            </v-btn>
          </template>
          <EditPanelOptions :options="options" :easyMDE="easyMDE"/>
        </v-menu>
      </div>
      <v-menu
        v-if="!topOptions"
        v-model="optionsMenu"
        :close-on-content-click="false"
        offset-x
      >
        <template v-slot:activator="{ on }">
          <v-btn
            absolute
            dark
            fab
            bottom
            right
            v-on="on"
            color="primary"
            style="bottom: 20px"
          >
            <v-icon>settings</v-icon>
          </v-btn>
        </template>
        <EditPanelOptions :options="options" :easyMDE="easyMDE"/>
      </v-menu>
      <textarea>
      </textarea>
    </v-flex>
  </v-layout>
</template>

<script>
import 'codemirror/lib/codemirror.css'
import resize from 'vue-resize-directive'
import store from '../store.js'
import EditPanelOptions from './EditPanelOptions'
import EasyMDE from 'easymde'
import 'easymde/src/css/easymde.css'
import 'codemirror/addon/edit/matchbrackets.js'
import 'codemirror/addon/edit/closebrackets.js'
import 'codemirror/addon/edit/matchtags.js'
import 'codemirror/addon/edit/closetag.js'
import 'codemirror/addon/selection/active-line.js'
import 'codemirror/addon/dialog/dialog.js'
import 'codemirror/addon/search/searchcursor.js'
import 'codemirror/addon/search/search.js'
import 'codemirror/addon/search/jump-to-line.js'

export default {
  directives: { resize },
  components: { EditPanelOptions },
  data: () => ({
    store: store.data,
    textStyle: undefined,
    easyMDE: null,
    optionsMenu: false,
    options: {
      theme: 'easymde',
      keymap: 'default',
      showLines: true,
      styleLine: true
    },
    topOptions: true

  }),
  mounted() {
    this.easyMDE = new EasyMDE({
      autoDownloadFontAwesome: false,
      forceSync: true,
      autofocus: true,
      autosave: {
        enabled: false,
      },
      theme: 'easymde',
      hideIcons: ['preview', 'side-by-side'],
      minHeight: '600px',
      parsingConfig: {
        allowAtxHeaderWithoutSpace: true,
      },
      spellChecker: false,
      status: false,
      uploadImage: true,
      toolbar: [{
        name: "bold",
        action: EasyMDE.toggleBold,
        className: "v-icon mdi mdi-format-bold",
        title: "Bold",
      },
        {
          name: "italic",
          action: EasyMDE.toggleItalic,
          className: "v-icon mdi mdi-format-italic",
          title: "Italic",
        },
        {
          name: "strikethrough",
          action: EasyMDE.toggleStrikethrough,
          className: "v-icon mdi mdi-format-strikethrough",
          title: "Strikethrough",
        },
        "|",
        {
          name: "code",
          action: EasyMDE.toggleCodeBlock,
          className: "v-icon mdi mdi-code-tags",
          title: "Code",
        },
        {
          name: "quote",
          action: EasyMDE.toggleBlockquote,
          className: "v-icon mdi mdi-format-quote-close",
          title: "Quote",
        },
        {
          name: "unordered-list",
          action: EasyMDE.toggleUnorderedList,
          className: "v-icon mdi mdi-format-list-bulleted-square",
          title: "Generic list",
        },
        {
          name: "ordered-list",
          action: EasyMDE.toggleOrderedList,
          className: "v-icon mdi mdi-format-list-numbered",
          title: "Numbered list",
        },
        "|",
        {
          name: "link",
          action: EasyMDE.drawLink,
          className: "v-icon mdi mdi-link-variant",
          title: "Create link",
        },
        {
          name: "image",
          action: EasyMDE.drawImage,
          className: "v-icon mdi mdi-image",
          title: "Insert image",
        },
      ]
    })
    this.easyMDE.codemirror.setOption('lineNumbers', true);
    this.easyMDE.codemirror.setSize('100%', '100%')
    this.easyMDE.codemirror.setOption('matchBrackets', true)
    this.easyMDE.codemirror.setOption('autoCloseBrackets', true)
    this.easyMDE.codemirror.setOption('matchTags', true)
    this.easyMDE.codemirror.setOption("autoCloseTags", true)
    this.easyMDE.codemirror.setOption("styleActiveLine", true)
    this.easyMDE.codemirror.on('change', () => {
      this.store.markdown = this.easyMDE.value()
    })

    this.onResize()
  },
  methods: {
    onResize(e) {
      if (e) {
        if (e.getBoundingClientRect().width < document.querySelector('.editor-toolbar > button:last-child').getBoundingClientRect().right + 150)
          this.topOptions = false
        else
          this.topOptions = true
      }

      const panelH = this.$refs.editbox.getBoundingClientRect().height
      if (!document.querySelector('#editbox .editor-toolbar'))
        return
      const offsetTop = document.querySelector('#editbox .editor-toolbar').getBoundingClientRect().height
      this.easyMDE.codemirror.setSize('100%', panelH - offsetTop + 'px')

    }
  }
}
</script>

<style lang="scss">
.CodeMirror {
  font-family: 'Open Sans';
  font-size: 18px;
}
.CodeMirror-dialog {
  position: absolute;
  bottom: 0;
  width: 100%;
  left: 40px;
  background-color: inherit;
  display: flex;
  z-index: 2;
}

.CodeMirror-sizer {
  border-right: none;
}
.CodeMirror-linenumber {
  font-size: 16px;
}

#editbox .editor-toolbar {
  border: none;
}

#editbox .CodeMirror-wrap {
  padding-left: 0;
  padding-top: 0;
}
#editbox textarea, #editbox {
  margin-top: 0;
  display: inline-block;
  box-sizing: border-box;
  text-align: left;
  height:100%;
}

#editbox .v-input,
#editbox .v-input__control,
#editbox .v-input__slot,
#editbox .v-text-field__slot {
  height:100%;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#editbar-right {
  position: absolute;
  right: 0;
  z-index: 1;
}
</style>
