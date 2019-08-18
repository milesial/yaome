<template>
  <v-layout
    column
    fill-height
    class="ma-0"
  >
    <v-flex id="editbox" class="ma-0 pa-0" ref="editbox">
      <v-list-item-avatar id="pencil" large class="mt-1 mr-2 secondary">
        <v-icon dark>mdi-pencil</v-icon>
      </v-list-item-avatar>
      <textarea v-resize="onResize">
      </textarea>
      <!--v-textarea
        v-model="store.markdown"
        autofocus
        ref="textarea"
        flat
        no-resize
      /-->
    </v-flex>
  </v-layout>
</template>

<script>
import store from '../store.js'
import EasyMDE from 'easymde'
import 'easymde/dist/easymde.min.css'
import 'codemirror/addon/edit/matchbrackets.js'
import 'codemirror/addon/edit/closebrackets.js'
import 'codemirror/addon/edit/matchtags.js'
import 'codemirror/addon/edit/closetag.js'

export default {
  data: () => ({
    store: store,
    textStyle: undefined,
    easyMDE: null
  }),
  mounted() {
    this.easyMDE = new EasyMDE({
      autoDownloadFontAwesome: false,
      forceSync: true,
      autofocus: true,
      autosave: {
        enabled: false,
      },
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
    this.easyMDE.codemirror.on('change', () => {
      this.store.markdown = this.easyMDE.value()
    })
  },
  methods: {
    onResize() {
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
  height: auto;
  font-family: 'Open Sans';
  font-size: 18px;
}

.CodeMirror-linenumber {
  font-size: 16px;
}

#editbox .CodeMirror-matchingbracket {
  color: var(--v-primary-darken1);
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

#pencil {
  position: absolute;
  right: 0;
}
</style>
