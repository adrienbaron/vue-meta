import Vue from 'vue'
import _getMetaInfo from '../src/shared/getMetaInfo'
import {
  VUE_META_ATTRIBUTE,
  VUE_META_CONTENT_KEY,
  VUE_META_KEY_NAME,
  VUE_META_SERVER_RENDERED_ATTRIBUTE,
  VUE_META_TAG_LIST_ID_KEY_NAME,
  VUE_META_TEMPLATE_KEY_NAME
} from '../src/shared/constants'

// set some default options
const defaultOptions = {
  keyName: VUE_META_KEY_NAME,
  attribute: VUE_META_ATTRIBUTE,
  ssrAttribute: VUE_META_SERVER_RENDERED_ATTRIBUTE,
  metaTemplateKeyName: VUE_META_TEMPLATE_KEY_NAME,
  contentKeyName: VUE_META_CONTENT_KEY,
  tagIDKeyName: VUE_META_TAG_LIST_ID_KEY_NAME
}

const getMetaInfo = _getMetaInfo(defaultOptions)

// define optionMergeStrategies for the keyName
Vue.config.optionMergeStrategies[VUE_META_KEY_NAME] = Vue.config.optionMergeStrategies.created

describe('getMetaInfo', () => {
  // const container = document.createElement('div')
  let component

  afterEach(() => component.$destroy())

  it('returns appropriate defaults when no meta info is found', () => {
    component = new Vue()
    expect(getMetaInfo(component)).to.eql({
      title: '',
      titleChunk: '',
      titleTemplate: '%s',
      htmlAttrs: {},
      headAttrs: {},
      bodyAttrs: {},
      meta: [],
      base: [],
      link: [],
      style: [],
      script: [],
      noscript: [],
      __dangerouslyDisableSanitizers: [],
      __dangerouslyDisableSanitizersByTagID: {}
    })
  })

  it('returns metaInfo when used in component', () => {
    component = new Vue({
      metaInfo: {
        title: 'Hello',
        meta: [
          { charset: 'utf-8' }
        ]
      }
    })
    expect(getMetaInfo(component)).to.eql({
      title: 'Hello',
      titleChunk: 'Hello',
      titleTemplate: '%s',
      htmlAttrs: {},
      headAttrs: {},
      bodyAttrs: {},
      meta: [
        { charset: 'utf-8' }
      ],
      base: [],
      link: [],
      style: [],
      script: [],
      noscript: [],
      __dangerouslyDisableSanitizers: [],
      __dangerouslyDisableSanitizersByTagID: {}
    })
  })

  it('properly uses string titleTemplates', () => {
    component = new Vue({
      metaInfo: {
        title: 'Hello',
        titleTemplate: '%s World',
        meta: [
          { charset: 'utf-8' }
        ]
      }
    })
    expect(getMetaInfo(component)).to.eql({
      title: 'Hello World',
      titleChunk: 'Hello',
      titleTemplate: '%s World',
      htmlAttrs: {},
      headAttrs: {},
      bodyAttrs: {},
      meta: [
        { charset: 'utf-8' }
      ],
      base: [],
      link: [],
      style: [],
      script: [],
      noscript: [],
      __dangerouslyDisableSanitizers: [],
      __dangerouslyDisableSanitizersByTagID: {}
    })
  })

  it('properly uses function titleTemplates', () => {
    const titleTemplate = chunk => `${chunk} Function World`

    component = new Vue({
      metaInfo: {
        title: 'Hello',
        titleTemplate,
        meta: [
          { charset: 'utf-8' }
        ]
      }
    })
    expect(getMetaInfo(component)).to.eql({
      title: 'Hello Function World',
      titleChunk: 'Hello',
      titleTemplate,
      htmlAttrs: {},
      headAttrs: {},
      bodyAttrs: {},
      meta: [
        { charset: 'utf-8' }
      ],
      base: [],
      link: [],
      style: [],
      script: [],
      noscript: [],
      __dangerouslyDisableSanitizers: [],
      __dangerouslyDisableSanitizersByTagID: {}
    })
  })

  it('has the proper `this` binding when using function titleTemplates', () => {
    const titleTemplate = function (chunk) {
      return `${chunk} ${this.helloWorldText}`
    }

    component = new Vue({
      metaInfo: {
        title: 'Hello',
        titleTemplate,
        meta: [
          { charset: 'utf-8' }
        ]
      },
      data () {
        return {
          helloWorldText: 'Function World'
        }
      }
    })
    expect(getMetaInfo(component)).to.eql({
      title: 'Hello Function World',
      titleChunk: 'Hello',
      titleTemplate,
      htmlAttrs: {},
      headAttrs: {},
      bodyAttrs: {},
      meta: [
        { charset: 'utf-8' }
      ],
      base: [],
      link: [],
      style: [],
      script: [],
      noscript: [],
      __dangerouslyDisableSanitizers: [],
      __dangerouslyDisableSanitizersByTagID: {}
    })
  })

  it('properly uses string meta templates', () => {
    component = new Vue({
      metaInfo: {
        title: 'Hello',
        meta: [
          {
            vmid: 'og:title',
            property: 'og:title',
            content: 'Test title',
            template: '%s - My page'
          }
        ]
      }
    })
    expect(getMetaInfo(component)).to.eql({
      title: 'Hello',
      titleChunk: 'Hello',
      titleTemplate: '%s',
      htmlAttrs: {},
      headAttrs: {},
      bodyAttrs: {},
      meta: [
        {
          vmid: 'og:title',
          property: 'og:title',
          content: 'Test title - My page'
        }
      ],
      base: [],
      link: [],
      style: [],
      script: [],
      noscript: [],
      __dangerouslyDisableSanitizers: [],
      __dangerouslyDisableSanitizersByTagID: {}
    })
  })

  it('properly uses function meta templates', () => {
    component = new Vue({
      metaInfo: {
        title: 'Hello',
        meta: [
          {
            vmid: 'og:title',
            property: 'og:title',
            content: 'Test title',
            template: chunk => `${chunk} - My page`
          }
        ]
      }
    })
    expect(getMetaInfo(component)).to.eql({
      title: 'Hello',
      titleChunk: 'Hello',
      titleTemplate: '%s',
      htmlAttrs: {},
      headAttrs: {},
      bodyAttrs: {},
      meta: [
        {
          vmid: 'og:title',
          property: 'og:title',
          content: 'Test title - My page'
        }
      ],
      base: [],
      link: [],
      style: [],
      script: [],
      noscript: [],
      __dangerouslyDisableSanitizers: [],
      __dangerouslyDisableSanitizersByTagID: {}
    })
  })

  it('properly uses content only if template is not defined', () => {
    component = new Vue({
      metaInfo: {
        title: 'Hello',
        meta: [
          {
            vmid: 'og:title',
            property: 'og:title',
            content: 'Test title'
          }
        ]
      }
    })
    expect(getMetaInfo(component)).to.eql({
      title: 'Hello',
      titleChunk: 'Hello',
      titleTemplate: '%s',
      htmlAttrs: {},
      headAttrs: {},
      bodyAttrs: {},
      meta: [
        {
          vmid: 'og:title',
          property: 'og:title',
          content: 'Test title'
        }
      ],
      base: [],
      link: [],
      style: [],
      script: [],
      noscript: [],
      __dangerouslyDisableSanitizers: [],
      __dangerouslyDisableSanitizersByTagID: {}
    })
  })

  it('properly uses content only if template is null', () => {
    component = new Vue({
      metaInfo: {
        title: 'Hello',
        meta: [
          {
            vmid: 'og:title',
            property: 'og:title',
            content: 'Test title',
            template: null
          }
        ]
      }
    })
    expect(getMetaInfo(component)).to.eql({
      title: 'Hello',
      titleChunk: 'Hello',
      titleTemplate: '%s',
      htmlAttrs: {},
      headAttrs: {},
      bodyAttrs: {},
      meta: [
        {
          vmid: 'og:title',
          property: 'og:title',
          content: 'Test title'
        }
      ],
      base: [],
      link: [],
      style: [],
      script: [],
      noscript: [],
      __dangerouslyDisableSanitizers: [],
      __dangerouslyDisableSanitizersByTagID: {}
    })
  })

  it('properly uses content only if template is false', () => {
    component = new Vue({
      metaInfo: {
        title: 'Hello',
        meta: [
          {
            vmid: 'og:title',
            property: 'og:title',
            content: 'Test title',
            template: false
          }
        ]
      }
    })
    expect(getMetaInfo(component)).to.eql({
      title: 'Hello',
      titleChunk: 'Hello',
      titleTemplate: '%s',
      htmlAttrs: {},
      headAttrs: {},
      bodyAttrs: {},
      meta: [
        {
          vmid: 'og:title',
          property: 'og:title',
          content: 'Test title'
        }
      ],
      base: [],
      link: [],
      style: [],
      script: [],
      noscript: [],
      __dangerouslyDisableSanitizers: [],
      __dangerouslyDisableSanitizersByTagID: {}
    })
  })

  it('properly uses meta templates with one-level-deep nested children content', () => {
    Vue.component('merge-child', {
      template: '<div></div>',
      metaInfo: {
        title: 'Hello',
        meta: [
          {
            vmid: 'og:title',
            property: 'og:title',
            content: 'An important title!'
          }
        ]
      }
    })

    component = new Vue({
      metaInfo: {
        meta: [
          {
            vmid: 'og:title',
            property: 'og:title',
            content: 'Test title',
            template: chunk => `${chunk} - My page`
          }
        ]
      },
      render: (h) => h('div', null, [h('merge-child')]),
      el: document.createElement('div')
    })

    expect(getMetaInfo(component)).to.eql({
      title: 'Hello',
      titleChunk: 'Hello',
      titleTemplate: '%s',
      htmlAttrs: {},
      headAttrs: {},
      bodyAttrs: {},
      meta: [
        {
          vmid: 'og:title',
          property: 'og:title',
          content: 'An important title! - My page'
        }
      ],
      base: [],
      link: [],
      style: [],
      script: [],
      noscript: [],
      __dangerouslyDisableSanitizers: [],
      __dangerouslyDisableSanitizersByTagID: {}
    })
  })

  // TODO: Still failing :( Child template won't be applied if child has no content as well

  it('properly uses meta templates with one-level-deep nested children template', () => {
    Vue.component('merge-child', {
      template: '<div></div>',
      metaInfo: {
        title: 'Hello',
        meta: [
          {
            vmid: 'og:title',
            property: 'og:title',
            template: chunk => `${chunk} - My page`
          }
        ]
      }
    })

    component = new Vue({
      metaInfo: {
        meta: [
          {
            vmid: 'og:title',
            property: 'og:title',
            content: 'Test title',
            template: chunk => `${chunk} - SHOULD NEVER HAPPEN`
          }
        ]
      },
      render: (h) => h('div', null, [h('merge-child')]),
      el: document.createElement('div')
    })

    expect(getMetaInfo(component)).to.eql({
      title: 'Hello',
      titleChunk: 'Hello',
      titleTemplate: '%s',
      htmlAttrs: {},
      headAttrs: {},
      bodyAttrs: {},
      meta: [
        {
          vmid: 'og:title',
          property: 'og:title',
          content: 'Test title - My page'
        }
      ],
      base: [],
      link: [],
      style: [],
      script: [],
      noscript: [],
      __dangerouslyDisableSanitizers: [],
      __dangerouslyDisableSanitizersByTagID: {}
    })
  })

  it('properly uses meta templates with one-level-deep nested children template and content', () => {
    Vue.component('merge-child', {
      template: '<div></div>',
      metaInfo: {
        title: 'Hello',
        meta: [
          {
            vmid: 'og:title',
            property: 'og:title',
            content: 'An important title!',
            template: chunk => `${chunk} - My page`
          }
        ]
      }
    })

    component = new Vue({
      metaInfo: {
        meta: [
          {
            vmid: 'og:title',
            property: 'og:title',
            content: 'Test title',
            template: chunk => `${chunk} - SHOULD NEVER HAPPEN`
          }
        ]
      },
      render: (h) => h('div', null, [h('merge-child')]),
      el: document.createElement('div')
    })

    expect(getMetaInfo(component)).to.eql({
      title: 'Hello',
      titleChunk: 'Hello',
      titleTemplate: '%s',
      htmlAttrs: {},
      headAttrs: {},
      bodyAttrs: {},
      meta: [
        {
          vmid: 'og:title',
          property: 'og:title',
          content: 'An important title! - My page'
        }
      ],
      base: [],
      link: [],
      style: [],
      script: [],
      noscript: [],
      __dangerouslyDisableSanitizers: [],
      __dangerouslyDisableSanitizersByTagID: {}
    })
  })

  it('properly merges mixins options', () => {
    const mixin1 = {
      metaInfo: function () {
        return {
          title: 'This title will be overridden',
          meta: [
            {
              vmid: 'og:title',
              property: 'og:title',
              content: 'This title will be overridden'
            },
            {
              vmid: 'og:fromMixin1',
              property: 'og:fromMixin1',
              content: 'This is from mixin1'
            }
          ]
        }
      }
    }
    const mixin2 = {
      metaInfo: {
        meta: [
          {
            vmid: 'og:fromMixin2',
            property: 'og:fromMixin2',
            content: 'This is from mixin2'
          }
        ]
      }
    }
    const component = new Vue({
      mixins: [mixin1, mixin2],
      metaInfo: {
        title: 'New Title',
        meta: [
          {
            vmid: 'og:title',
            property: 'og:title',
            content: 'New Title! - My page'
          },
          {
            vmid: 'og:description',
            property: 'og:description',
            content: 'Some Description'
          }
        ]
      }
    })
    expect(getMetaInfo(component)).to.eql({
      title: 'New Title',
      titleChunk: 'New Title',
      titleTemplate: '%s',
      htmlAttrs: {},
      headAttrs: {},
      bodyAttrs: {},
      meta: [
        {
          vmid: 'og:fromMixin1',
          property: 'og:fromMixin1',
          content: 'This is from mixin1'
        },
        {
          vmid: 'og:fromMixin2',
          property: 'og:fromMixin2',
          content: 'This is from mixin2'
        },
        {
          vmid: 'og:title',
          property: 'og:title',
          content: 'New Title! - My page'
        },
        {
          vmid: 'og:description',
          property: 'og:description',
          content: 'Some Description'
        }
      ],
      base: [],
      link: [],
      style: [],
      script: [],
      noscript: [],
      __dangerouslyDisableSanitizers: [],
      __dangerouslyDisableSanitizersByTagID: {}
    })
  })
})
