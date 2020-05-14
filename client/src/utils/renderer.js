import store from '../store'
import marked from 'marked'

class Renderer {
  constructor(format) {
    if (format !== undefined) {
      this._format = format
    } else {
      this._format = this.availableFormats[0]
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
  constructor() {
    let availableFormats = ['html', 'pdf']
    super(availableFormats[0])
    this.availableFormats = availableFormats
  }

  render(options={}) {
    let content = store.data.files.content
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

        xhttp.open('POST', `${process.env.VUE_APP_BACK_URL}/render/${self.format}`, true)
        xhttp.setRequestHeader('Content-type', 'application/json')
        options.file = store.data.files.selected
        options.markdown = content
        xhttp.send(JSON.stringify(options))
      }
    )
  }
}

class MarkedRenderer extends Renderer {
  constructor() {
    let availableFormats = ['html']
    super(availableFormats[0])
    this.availableFormats = availableFormats
  }

  render() {
    let content = store.data.mrkdown
    let self = this
    return new Promise(
      function (resolve) {
        store.data.rendering = true
        let res = marked(content)
        store.data.render[self.format] = res
        store.data.rendering = false
        resolve(res)
      }
    )
  }
}

export { RemoteRenderer, MarkedRenderer }
