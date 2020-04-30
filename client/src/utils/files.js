import axios from 'axios'  

class FilesManager {
  constructor() {
    this.tree = {children: []}
    this.selected = 'main.md'
    this.content = ''
    this.updateTree()
    this.updateContent()
  }

  updateTree() {
    return axios.get('/files')
      .then(res => {
        this.tree = res.data
      })
  }

  remove(path) {
    return axios.delete('/files', {
      params: { path: path }
    }).then(() => { this.updateTree() })
  }

  get(path) {
    return axios.get('/files/' + path)
  }

  updateContent() {
    return this.get(this.selected).then((data) => { this.content = data.data })
  }
}

export { FilesManager }
