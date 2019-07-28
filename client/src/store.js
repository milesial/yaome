var store = {
  state: {
    availableFormats: ['html', 'pdf'],
    selectedFormatId: 0,
    render : { html: '', pdf: '' },
    markdown: '',
    files: {
      selected: 'main.md'
    }
  }
}

export default store;
