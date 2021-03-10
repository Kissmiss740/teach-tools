const path = require('path');

const resolve = (dir) => {
  return path.join(__dirname, dir)
}
const CompressionPlugin = require('compression-webpack-plugin')
const ParalleeUglifyPlugin = require('webpack-parallel-uglify-plugin')
const isProduction = process.env.NODE_ENV === 'production'
const CDN = {
  js: [
    'https://cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.min.js',
    'https://cdn.bootcss.com/element-ui/2.13.0/index.js',
    'https://cdn.jsdelivr.net/npm/vue-router@3.1.6/dist/vue-router.min.js',
    'https://cdn.jsdelivr.net/npm/vuex@3.1.2'
  ],
  css: [
    'https://cdn.bootcss.com/element-ui/2.13.0/theme-chalk/index.css'
  ]
}
module.exports = {
  publicPath: isProduction ? '/' : '/',
  lintOnSave: false,
  configureWebpack: config => {
    if (isProduction) {
      config.externals = {
        'vue': 'Vue',
        'vue-router': 'VueRouter',
        'vuex': 'Vuex',
        'element-ui': 'ELEMENT'
      }
    }
  },

  chainWebpack: (config) => {
    config.resolve.alias
      .set('@', resolve('src'))
      .set('components', resolve('src/components'))
      .set('views', resolve('src/views'))
    if (isProduction) {
      config
        .plugin('html')
        .tap(args => {
          args[0].cdn = CDN;
          return args;
        })
      config
        .plugin('compressionPlugin')
        .use(CompressionPlugin, [{
          test: /\.js$|\.html$|\.css$/,
          algorithm: 'gzip',
          threshold: 10000, //对超过100000字节的文件进行压缩
          minRatio: 0.8,
          deleteOriginalAssets: false //是否删除原文件，不删除则原文件和.gz文件并存
        }])
    }
    config
      .plugin('ParalleeUglifyPlugin')
      .use(ParalleeUglifyPlugin, [{
        test: /\.js$/,
        cacheDir: '.cache/',
        //传递给UglifyJS的参数
        uglifyJS: {
          output: {
            //最紧凑的输出
            beautify: false,
            //
            comments: false
          },
          compress: {
            //
            drop_console: true,
            //内嵌已定义但是只用到一次的变量
            collapse_vars: true
          },
          //
          warnings: false,
        }
      }])
    if (process.env.use_analyzer) {
      config
        .plugin('webpack-bundle-analyzer')
        .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
        .end()
    }
  },

  devServer: {
    hot: true,
    compress: true,
    proxy: {
      '/': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  },
  productionSourceMap: false,
}