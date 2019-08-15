import { getCookie } from './utils.js'

var store = {
  availableFormats: ['html', 'pdf'],
  selectedFormatId: 0,
  render: { html: '', pdf: '' },
  rendering: false,
  markdown: '',
  renderedMarkdown: '',
  files: {
    selected: 'main.md'
  },
  logged: getCookie('logged') == 'true',
    name: decodeURIComponent(getCookie('name')).split(/\s+/)[0]
}

export default store;
