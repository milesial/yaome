import { getCookie } from './utils.js'
import axios from 'axios'

var store = {
  data: {
    availableFormats: ['html', 'pdf'],
    selectedFormatId: 0,
    render: { html: '', pdf: '' },
    rendering: false,
    markdown: '',
    renderedMarkdown: '',
    files: {
      selected: 'main.md',
      tree: {}
    },
    logged: getCookie('logged') == 'true',
    name: decodeURIComponent(getCookie('name')).split(/\s+/)[0]
  },
  updateFilesTree() {
    axios.get('/files')
      .then(res => {
        this.data.files.tree = res.data
      })
  }
}

store.updateFilesTree()

export default store;
