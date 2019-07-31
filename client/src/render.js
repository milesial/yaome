import store from './store.js'

export function requestRender(markdown, format, options={}, callback=()=>{}) {
  //TODO: promise
  let xhttp = new XMLHttpRequest();

  if (format == 'pdf') {
    xhttp.responseType = "arraybuffer"
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        callback(this.response)
      }
    }
  } else {
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        callback(this.responseText)
      }
    }
  }

  xhttp.open("POST", `http://localhost/render/${format}`, true);
  xhttp.setRequestHeader("Content-type", "application/json");
  options.file = 'main.md'
  options.markdown = markdown
  xhttp.send(JSON.stringify(options))
}

export function updateCurrentRender(options={}, callback=()=>{}) {
    store.rendering = true
    let format = store.availableFormats[store.selectedFormatId]
    requestRender(store.markdown, format, options, (res) => {
        store.render[format] = res
        store.rendering = false
        callback(res)
    })
}
