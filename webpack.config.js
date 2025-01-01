
const path = require("path");
const {DefinePlugin} = require("webpack");
const ExtractTextPlugin = require("mini-css-extract-plugin");
const {VueLoaderPlugin} = require("vue-loader");
const htmlWebpackPlugin = require('html-webpack-plugin');
const workspace = path.resolve( "./test/src" )

const build = path.resolve( "./test/.output" )
//const loader = require.resolve("es-loader")
const loader = require.resolve("es-loader")

const { getPostCssConfig } = require( '@ckeditor/ckeditor5-dev-utils/lib/styles' );

const host = "localhost";
const port = 8085;
const format = 'default';

process.env.format = format

let plugin = require('./dist/index.js');
plugin = plugin.default || plugin;
const plugins=[
  {
    plugin:plugin,
    options:{
      webpack:{
        enable:true,
        inlineStyleLoader:['style-loader','css-loader']
      },
      outDir:build,
      sourceMaps:true,
      version:3,
      uiFully:true,
      mode:'development',
      srcCSS:false,
      optimize:true,
      projectConfigFile:'.env',
      //pageDir:'pages',
      pageDir:false,
      hmrHandler:'import.meta.webpackHot',
      metadata:{
        env:process.env,
        //platform:'server'
      },
      vue:{
        optimize:true,
      },
      hot:true,
      //format:format, //vue-template
      
      babel:false,
      // babel:{
      //   //babelrc:true
      //   presets: [
      //     [
      //         '@babel/preset-env',
      //         {
      //           "targets": {
      //               "edge": "11",
      //               "firefox": "60",
      //               "chrome": "67",
      //               "safari": "11.1"
      //           },
      //           //"useBuiltIns": "usage"
      //         }
      //     ]
      //   ],
      //   plugins: [
      //     [
      //       '@babel/plugin-transform-runtime',{
      //         "corejs":{ 
      //           version: 3, 
      //           proposals: true 
      //         }
      //       }
      //     ]
      //   ]
      // },
    }
  }
];






const config = {
  mode:"development",
  //devtool:"none",
  devtool:"source-map",
  target:"web",
  entry:{
    //index: path.join(workspace,"Index.es"),

    index: path.join(workspace,"karma/Test.es"),  
    //index: path.resolve( "./test/build/Person.vue" ),  
  },
  output: {
    path:path.resolve( build ),
    filename:`[name].js`,
    //chunkFilename:`./[name].js`,
    publicPath:"/",
  },
  resolve:{
    extensions:[".js",".mjs",'.es','.vue', ".json",".css",".less",".scss"],
    // modules:[
    //   workspace,
    //   path.resolve('./node_modules')
    // ]
     alias: {
         'element-plus':path.join(__dirname, 'node_modules/element-plus'),
         '@babel':path.join(__dirname, 'node_modules/@babel'),
        
        //  '@ckeditor/ckeditor5-utils$':path.join(__dirname, 'node_modules/es-ckeditor/lib/utils.js'),
        //  '@ckeditor/ckeditor5-engine$':path.join(__dirname, 'node_modules/es-ckeditor/lib/engine.js'),
        //  '@ckeditor/ckeditor5-ui$':path.join(__dirname, 'node_modules/es-ckeditor/lib/ui.js'),
        //  '@ckeditor/ckeditor5-core$':path.join(__dirname, 'node_modules/es-ckeditor/lib/core.js'),
        //  'ckeditor5/src/core$':path.join(__dirname, 'node_modules/es-ckeditor/lib/core.js'),
        //  'ckeditor5/src/ui$':path.join(__dirname, 'node_modules/es-ckeditor/lib/ui.js'),
        //  'ckeditor5/src/utils$':path.join(__dirname, 'node_modules/es-ckeditor/lib/utils.js'),
        //  'ckeditor5/src/engine$':path.join(__dirname, 'node_modules/es-ckeditor/lib/engine.js'),


         //'@ckeditor/ckeditor5-ui/theme/components/responsive-form':path.join(__dirname, 'node_modules/@ckeditor/ckeditor5-ui/theme/components/responsive-form/responsiveform.css'),
    //   'vue$': 'vue/dist/vue.esm.js',
    //   '@': resolve('src'),
     }
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
     
      // {
      //   test: /\.es$/,
      //   resourceQuery:/\bvue\b/,
      //   use: [
      //     {
      //       loader: 'vue-loader'
      //     },
      //     {
      //       loader:loader,
      //       options:{
      //           mode:"development",
      //           // babel:{
      //           //   // targets:{
      //           //   //   "edge": "17",
      //           //   //   "firefox": "60",
      //           //   //   "chrome": "67",
      //           //   //   "ie": "8",
      //           //   //   "safari": "11.1"
      //           //   // },
                 
      //           //   presets:[
      //           //     ['env',{
      //           //       "useBuiltIns": "usage",
      //           //     }]
      //           //   ]
      //           // },
      //           hot:true,
      //           //client:plugins[1],
      //           //server:plugins[0],
      //           builder: plugins[0],
      //       },
      //     }
      //   ]
      // },


      {
        test: /\.es$/,
        // resourceQuery:(q)=>{
        //   return !/\bvue\b/.test(q)
        // },
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
                //client:plugins[1],
                //server:plugins[0],
                builder: plugins[0],
            },
          }
        ]
      },


      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
 
        },
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        // options: {
        //     presets: [
        //       [
        //         '@babel/preset-env',
        //         {
        //           "targets": {
        //             "esmodules": true
        //           }
        //         }
        //       ],
        //       '@vue/babel-preset-jsx'
        //     ],

        //     sourceType:'module'
           
        // },
        exclude: /(bower_components|node_modules)/
      },
      {
        test:/ckeditor5-[^/\\]+[/\\]theme[/\\].+\.css$/,
        use: [
          {
            loader: ExtractTextPlugin.loader,
            options: {
              // 这里可以指定一个 publicPath
              // 默认使用 webpackOptions.output中的publicPath
              publicPath: '/'
            },
          },

          'css-loader',
          ,
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: getPostCssConfig( {
                themeImporter: { themePath:require.resolve('@ckeditor/ckeditor5-theme-lark') },
              })
            }
          }
        ],
      },
      {
        test: /\.css$/,
        exclude:/ckeditor5-[^/\\]+[/\\]theme[/\\].+\.css$/,
        use: [
            {
              loader: ExtractTextPlugin.loader,
              options: {
                // 这里可以指定一个 publicPath
                // 默认使用 webpackOptions.output中的publicPath
                publicPath: '/'
              },
            },

            'css-loader',
            
          ]
      },
      {
        test:/ckeditor5-[^/\\]+[/\\]theme[/\\]icons[/\\][^/\\]+\.svg$/,
        use: ['raw-loader'],
      },
      {
        test: /\.scss$/,
        use: [
            // {
            //   loader: ExtractTextPlugin.loader,
            //   options: {
            //     // 这里可以指定一个 publicPath
            //     // 默认使用 webpackOptions.output中的publicPath
            //     publicPath: '/'
            //   },
            // },

            'style-loader',

            'css-loader',

            'sass-loader'
          ]
      },
      {
        test: /\.(png|jpg|jpeg|gif|eot|ttf|woff|woff2|svgz|svg)(\?.+)?$/,
        exclude:/ckeditor5-[^/\\]+[/\\]theme[/\\]icons[/\\][^/\\]+\.svg$/,
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
      }),
      new DefinePlugin({
        __VUE_OPTIONS_API__: true,
        __VUE_PROD_DEVTOOLS__: false 
      }),
  ],
  optimization:{
    removeEmptyChunks:true,
    usedExports:true,
    moduleIds: 'natural',
    // splitChunks:{
    //   chunks: "all",
    //   minSize: 30000,
    //   minChunks: 1,
    //   maxAsyncRequests: 5,
    //   maxInitialRequests: 3,
    //   automaticNameDelimiter: '~',
    //   cacheGroups: {
    //       'vue': {
    //           test: /[\\/]node_modules[\\/]vue[\\/]/i,
    //           name: 'vue',
    //           priority: -10
    //       },
    //       'element-ui': {
    //         test: /[\\/]node_modules[\\/]element-ui[\\/]/i,
    //         name: 'element-ui',
    //         priority: -10
    //       },
    //       'es':{
    //         test: /\.es$/,
    //         name: 'es',
    //         priority: -5
    //       },
    //       default: {
    //           minChunks: 2,
    //           priority: -20,
    //           name: 'default',
    //           reuseExistingChunk: true
    //       }
    //   }
    // }
  }
};

module.exports = config