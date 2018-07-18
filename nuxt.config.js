const nodeExternals = require('webpack-node-externals')
const resolve = (dir) => require('path').join(__dirname, dir)

module.exports = {
  /*
     ** Headers of the page
     */
  head: {
    title: '4T 旅游 曝光 代购 转卖 旅拍',
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
    src: '~/plugins/localStorage.js',
    ssr: false
  }, {
    src: '~/plugins/metainfo.js',
    ssr: true
  }, {
    src: '~/plugins/http.js',
    ssr: true
  }],
  css: [
    '~/assets/style/app.styl',
    'vuetify/dist/vuetify.min.css',
    'viewerjs/dist/viewer.css',
    'vue-croppa/dist/vue-croppa.css'
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
