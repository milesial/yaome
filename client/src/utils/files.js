import axios from 'axios'  

class FilesManager {
  constructor() {
    this.tree = {children: []}
    this.selected = ''
    this.content = ''
    this.updateTree().then(() => { 
      this.selected = this.tree.children[0].path
      console.log(this.selected)
      this.updateContent()
    })
  }

  updateTree() {
    return axios.get(`${process.env.VUE_APP_BACK_URL}/files`)
      .then(res => {
        this.tree = res.data
      })
  }

  remove(path) {
    return axios.delete(`${process.env.VUE_APP_BACK_URL}/files`, {
      params: { path: path }
    }).then(() => { this.updateTree() })
  }

  get(path) {
    return axios.get(`${process.env.VUE_APP_BACK_URL}/files/${path}`)
  }

  updateContent() {
    return this.get(this.selected).then((data) => { this.content = data.data })
  }
}

export { FilesManager }
