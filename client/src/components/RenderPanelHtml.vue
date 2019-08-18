
<script>
import store from '../store.js'
import renderMathInElement from 'katex/dist/contrib/auto-render.mjs'
import 'katex/dist/katex.min.css'
import MathJax from 'mathjax'


export default {
  props: ['useKatex'],
  data: () => ({
    store,
    curr: '<div>a</div>',
    k: 0
  }),
  methods: {
    processMath() {
      /*renderMathInElement(document.getElementById('renderHtml'), {
          throwOnError: true,
          errorCallback: err => {
            EventBus.$emit('error', escape(err))
          },
          ignoredClasses: ['cachedmath'],
        })*/
          MathJax.Hub.Queue(["resetEquationNumbers", MathJax.InputJax.TeX], ["Typeset",MathJax.Hub])
    },
    createVirtualDOM(h, node, ignoremath) {
      if (node.nodeType == 3) // text node
        return this._v(node.textContent)

      if (!ignoremath && (node.className == "math inline" || node.className == "math display")) {
        return h('span', {
          class: 'cachedmath',
          key: 'cachedmath' + node.innerHTML // so that vue reuses the node
        }, [this.createVirtualDOM(h, node, true)])
      } else {
        const children = node.childNodes
          ? Array.from(node.childNodes).map(x => this.createVirtualDOM(h, x))
          : []

        let attrs = {}
        for (let att, i = 0, atts = node.attributes, n = atts.length; i < n; i++){
          att = atts[i]
          attrs[att.nodeName] = att.nodeValue
        }
        return h(node.tagName, {
          class: node.className,
          attrs,
        }, children)
      }
    },
    parseHTML(html) {
      let t = document.createElement('div')
      t.innerHTML = html
      return t.cloneNode(true)
    }
  },
  render(h) {
    let dom = h('div', { attrs: { id: 'renderHtml' }}, 
    [this.createVirtualDOM(h, this.parseHTML(this.store.render.html))])
    return dom
  },
}

</script>

<style scoped>

#render-html {
  overflow-wrap: break-word;
}

</style>

<style>
 .aa {
  width: 100px;
  background-color: red;
  -webkit-animation-name: example; /* Safari 4.0 - 8.0 */
  -webkit-animation-duration: 1s; /* Safari 4.0 - 8.0 */
  animation-name: example;
  animation-duration: 1s;
}

/* Safari 4.0 - 8.0 */
@-webkit-keyframes example {
  from {background-color: red;}
  to {background-color: yellow;}
}

/* Standard syntax */
@keyframes example {
  from {background-color: red;}
  to {background-color: yellow;}
}

</style>
