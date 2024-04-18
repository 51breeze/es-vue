const path = require('path');
const compileStyle = require('@vue/compiler-sfc').compileStyleAsync;
const { getPostCssConfig } = require( '@ckeditor/ckeditor5-dev-utils/lib/styles' );

async function transformStyle({
  filename,
  source,
  scopeId,
  isProd,
  sourcemap,
  preprocessLang='scss',
  preprocessOptions={},
  postcssOptions = {},
  postcssPlugins = []
}){
  return await compileStyle({
    source:String(source),
    filename,
    id:scopeId || '',
    scoped:!!scopeId,
    isProd,
    inMap:sourcemap,
    preprocessLang,
    preprocessOptions,
    postcssOptions,
    postcssPlugins
  });
}

module.exports = {
    workspace:'test/src',
    annotations:['Redirect','Metadata','Readfile'],
    lang:'zh-CN',
    esc:{
        minify:false,
        resolve:{
            alias:{
              '^element-plus[\\\\\/]':path.join(process.cwd(), 'node_modules')
            },
            paths:[]
        },
        styles:{
          preprocess:{
            async css(args){
                if( /[\\\/]@ckeditor[\\\/]ckeditor5/.test(args.filename) ){
                  args.preprocessLang = null;
                  const postoptions = getPostCssConfig({
                      themeImporter: {
                        themePath:require.resolve('@ckeditor/ckeditor5-theme-lark')
                      }
                  });
                  args.postcssPlugins = postoptions.plugins || [];
                  return await transformStyle(args);
                }
                return {
                  code:args.source,
                  sourcemap:args.sourcemap
                }
            },
            async scss(args){
              args.preprocessOptions = {
                includePaths:[path.join(process.cwd(), 'node_modules')]
              }
              const result = await transformStyle(args);
              if( result.errors.length>0 ){
                console.log( result.errors, args.filename, result.dependencies )
              }
              return result;
            }
          },
          
        }
    },
    plugins:[
        {
          plugin:require('../es-vue'),
          options:{
            webpack:true,
            //styleLoader:['style-loader','css-loader'],
            useAbsolutePathImport:true,
            output:'./build',
            sourceMaps:true,
           //format:"vue-template",
            version:3,
            srcCSS:false,
            optimize:true,
            projectConfigFile:'.env',
            pageDir:'pages',
            hmrHandler:'import.meta.webpackHot',
            metadata:{
              env:process.env,
              //platform:'server'
            }
          }
        }
    ]
}