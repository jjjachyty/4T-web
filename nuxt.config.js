const nodeExternals = require('webpack-node-externals')
// const resolve = (dir) => require('path').join(__dirname, dir)

module.exports = {
  /*
     ** Router config
     */
  router: {
    middleware: 'auth'
  },
  /*
     ** Headers of the page
     */
  head: {
    title: '旅游 曝光 海淘 代购 转卖 旅拍-4T ForTravel 为美好旅行',
    meta: [{
      charset: 'utf-8'
    },
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1'
    },
    {
      hid: 'description',
      name: 'description',
      content: 'www.fortravel.cn'
    }
    ],
    link: [{
      rel: 'icon',
      type: 'image/x-icon',
      href: '/favicon.ico'
    },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons'
    },
    {
      rel: 'stylesheet',
      href: 'https://use.fontawesome.com/releases/v5.1.1/css/all.css'
    }
    ]
  },
  plugins: ['~/plugins/vuetify.js', {
    src: '~/plugins/nossr.js',
    ssr: false
  }, {
    src: '~/plugins/ssr.js',
    ssr: true
  }, '~/plugins/filter.js', {
    src: '~/plugins/mixins.js',
    ssr: true
  }, {
    src: '~/plugins/metainfo.js',
    ssr: true
  }, {
    src: '~/plugins/http.js',
    ssr: true
  }],
  css: [
    'vuetify/dist/vuetify.min.css',
    'viewerjs/dist/viewer.css',
    'vue-croppa/dist/vue-croppa.css',
    'mavon-editor/dist/css/index.css'
  ],
  /*
     ** Customize the progress bar color
     */
  loading: {
    color: '#3B8070'
  },
  /*
     ** Build configuration
     */
  build: {
    babel: {
      plugins: [
        ['transform-imports', {
          'vuetify': {
            'transform': 'vuetify/es5/components/${member}',
            'preventFullImport': true
          }
        }]
      ]
    },
    vendor: [
      '~/plugins/vuetify.js'
    ],
    extractCSS: true,
    /*
         ** Run ESLint on save
         */
    extend (config, ctx) {
      if (ctx.isDev && ctx.isClient) {
        // config.module.rules.push({
        //   enforce: 'pre',
        //   test: /\.(js|vue)$/,
        //   loader: 'eslint-loader',
        //   exclude: /(node_modules)/
        // })
        config.node = {
          console: true,
          fs: 'empty',
          net: 'empty',
          tls: 'empty'
        }
      }

      if (ctx.isServer) {
        config.externals = [
          nodeExternals({
            whitelist: [/^vuetify/]
          })
        ]
      }
    }
  }
}
