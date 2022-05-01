
const path = require("path");
//const webpackbar = require("webpackbar");
const ExtractTextPlugin = require("mini-css-extract-plugin");
const {VueLoaderPlugin} = require("vue-loader");
const htmlWebpackPlugin = require('html-webpack-plugin');
const workspace = path.resolve( "./test/src" )

const build = path.resolve( "./test/build" )
//const loader = require.resolve("es-loader")
const loader = require.resolve("../es-loader")

const host = "localhost";
const port = 8085;
const plugins=[
  {
    builder:require('../es-php'),
    options:{
      output:build,
      workspace
    }
  },
  {
    builder:require('./index'),
    options:{
      module:'es',
      webComponent:'vue',
      webpack:true,
      styleLoader:['style-loader','css-loader'],
      useAbsolutePathImport:true,
      output:build,
      babel:{
        //babelrc:true
        presets: [
          [
              '@babel/preset-env',
              {
                "targets": {
                    "edge": "11",
                    "firefox": "60",
                    "chrome": "67",
                    "safari": "11.1"
                },
                //"useBuiltIns": "usage"
              }
          ]
        ],
        plugins: [
          [
            '@babel/plugin-transform-runtime',{
              "corejs":{ 
                version: 3, 
                proposals: true 
              }
            }
          ]
        ]
      },
      workspace
    }
  }
];

const config = {
  mode:"development",
 // devtool:"(none)",
  devtool:false,
  target:"web",
  entry:{
    index: path.join(workspace,"Index.es"),
  },
  output: {
    path:path.resolve( build ),
    filename:`[name].js`,
    //chunkFilename:`./[name].js`,
    publicPath:"/",
  },
  resolve:{
    extensions:[".js",'.es','.vue', ".json",".css",".less"],
    // modules:[
    //   workspace,
    //   path.resolve('./node_modules')
    // ]
    // alias: {
    //   'vue$': 'vue/dist/vue.esm.js',
    //   '@': resolve('src'),
    // }
  },
  devServer: {
    hot:true,
    host:host,
    port:port,
    open:false,
    client: {
      overlay:{
        errors: true,
        warnings: false,
      }
    },
  },
  //watch:true,
  watchOptions:{
      ignored: /node_modules/
  },
  module: {
    rules: [
      {
        test: /\.es$/,
        use: [
          {
            loader:loader,
            options:{
                mode:"development",
                // babel:{
                //   // targets:{
                //   //   "edge": "17",
                //   //   "firefox": "60",
                //   //   "chrome": "67",
                //   //   "ie": "8",
                //   //   "safari": "11.1"
                //   // },
                 
                //   presets:[
                //     ['env',{
                //       "useBuiltIns": "usage",
                //     }]
                //   ]
                // },
                hot:true,
                client:plugins[1],
                //server:plugins[0],
            },
          }
        ]
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          presets: ['@vue/babel-preset-jsx']
        },
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        options: {
            presets: [
              '@babel/preset-env',
              '@vue/babel-preset-jsx'
            ]
        },
        exclude: /(bower_components)/
      },
      {
        test: /\.css$/,
        use: [
            {
              loader: ExtractTextPlugin.loader,
              options: {
                // 这里可以指定一个 publicPath
                // 默认使用 webpackOptions.output中的publicPath
                publicPath: '/'
              },
            },

            'css-loader'
          ]
      },
      {
        test: /\.(png|jpg|jpeg|gif|eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,
        type:'asset'
        // use: [{
        //   loader: 'url-loader',
        //   options: {
        //     limit: 10000
        //   }
        // }]
      }
    ]
  },
  plugins: [
      new htmlWebpackPlugin({
        "template": path.join("./test/index.html"),
      }),
      //new webpackbar(),
      new VueLoaderPlugin(),
      new ExtractTextPlugin({
        filename:'[name].min.css',
      })
  ],
  // optimization:{
  //   removeEmptyChunks:true,
  //   usedExports:true,
  //   moduleIds: 'natural',
  //   splitChunks:{
  //     chunks: "all",
  //     minSize: 30000,
  //     minChunks: 1,
  //     maxAsyncRequests: 5,
  //     maxInitialRequests: 3,
  //     automaticNameDelimiter: '~',
  //     cacheGroups: {
  //         'vue': {
  //             test: /[\\/]node_modules[\\/]vue[\\/]/i,
  //             name: 'vue',
  //             priority: -10
  //         },
  //         'element-ui': {
  //           test: /[\\/]node_modules[\\/]element-ui[\\/]/i,
  //           name: 'element-ui',
  //           priority: -10
  //         },
  //         'es':{
  //           test: /\.es$/,
  //           name: 'es',
  //           priority: -5
  //         },
  //         default: {
  //             minChunks: 2,
  //             priority: -20,
  //             name: 'default',
  //             reuseExistingChunk: true
  //         }
  //     }
  //   }
  // }
};


module.exports = config