import store from './store.js'
import EventBus from './event-bus.js'

export function requestRender(markdown, format, options={}, callback=()=>{}, err=()=>{}) {
  //TODO: promise
  let xhttp = new XMLHttpRequest();

  if (format == 'pdf') {
    xhttp.responseType = "arraybuffer"
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        callback(this.response)
      } else if (this.readyState == 4 && this.status == 500) {
        err(this.responseText)
      }
    }
  } else {
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        callback(this.responseText)
      } else if (this.readyState == 4 && this.status == 500) {
        err(this.responseText)
      }
    }
  }

  xhttp.open("POST", `/render/${format}`, true);
  xhttp.setRequestHeader("Content-type", "application/json");
  options.file = 'main.md'
  options.markdown = markdown
  xhttp.send(JSON.stringify(options))
}

export function updateCurrentRender(options={}, callback=()=>{}, err=()=>{}) {
  store.data.rendering = true
  let format = store.data.availableFormats[store.data.selectedFormatId]
  let md = store.data.markdown
  requestRender(md, format, options, (res) => {
    store.data.render[format] = res
    store.data.rendering = false
    store.data.renderedMarkdown = md
    callback(res)
  }, (res) => {
    store.data.rendering = false
    alert(res)
    EventBus.$emit('error', JSON.parse(res).err)
    err(res)
  })
}

export function getCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift();
}
