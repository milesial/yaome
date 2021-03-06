import { getCookie } from './utils/cookies'
import { FilesManager } from './utils/files'

var store = {
  data: {
    serverStatus: true,
    availableFormats: ['html', 'pdf'],
    selectedFormatId: 0,
    render: { html: '', pdf: '' },
    rendering: false,
    markdown: '',
    renderedMarkdown: '',
    files: new FilesManager(),
    logged: getCookie('logged') == 'true',
    name: decodeURIComponent(getCookie('name')).split(/\s+/)[0]
  },
}

export default store;
