var store = {
  availableFormats: ['html', 'pdf'],
  selectedFormatId: 0,
  render: { html: '', pdf: '' },
  rendering: false,
  markdown: '',
  renderedMarkdown: '',
  files: {
    selected: 'main.md'
  }
}

export default store;
