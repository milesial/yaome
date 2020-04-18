import store from './store.js'

class Renderer {
  constructor(format) {
    this.availableFormats = ['html', 'pdf']
    this._format = this.availableFormats[0]
    if (format !== undefined) {
      this.format = format
    }
  }

  set format(format) {
    if (this.availableFormats.includes(format)) {
      this._format = format
    } else {
      throw new Error('Renderer format is unknown: ' + format)
    }
  }

  get format() {
    return this._format
  }
}


class RemoteRenderer extends Renderer {
  render(options={}) {
    let content = store.data.markdown
    let self = this
    return new Promise(
      function (resolve, reject) {
        store.data.rendering = true
        let xhttp = new XMLHttpRequest()
        xhttp.responseType = self.format == 'pdf' ? 'arraybuffer' : 'text'
        xhttp.onreadystatechange = function() {
          store.data.rendering = false
          if (this.readyState == 4 && this.status == 200) {
            store.data.render[self.format] = this.response
            store.data.renderedMarkdown = content
            resolve(this.response)
          } else if (this.readyState == 4 && this.status == 500) {
            reject(JSON.parse(this.responseText))
          }
        }

        xhttp.open('POST', `/render/${self.format}`, true)
        xhttp.setRequestHeader('Content-type', 'application/json')
        options.file = store.data.files.selected
        options.markdown = content
        xhttp.send(JSON.stringify(options))
      }
    )
  }
}

export { RemoteRenderer }
