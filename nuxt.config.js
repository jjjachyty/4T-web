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
  plugins: ['~/plugins/vuetify.js', '~/plugins/common.js', '~/plugins/mixins.js', '~/plugins/filter.js', {
    src: '~/plugins/localStorage.js',
    ssr: false
  }, {
    src: '~/plugins/http.js',
    ssr: false
  }, {
    src: '~/plugins/metainfo.js',
    ssr: true
  }],
  css: [
    '~/assets/style/app.styl',
    'vuetify/dist/vuetify.min.css'
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
