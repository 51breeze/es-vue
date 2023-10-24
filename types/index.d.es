declare interface RichTextEventHandleInterface{
    addEventListener(type: 'ready',listener:(...args)=>void):this
    addEventListener(type: 'focus',listener:(...args)=>void):this
    addEventListener(type: 'blur',listener:(...args)=>void):this
    addEventListener(type: 'input',listener:(...args)=>void):this
    addEventListener(type: 'destroy',listener:(...args)=>void):this
}

@Reference('es-javascript/types');
@Reference('./hmr.d.es');
@Reference('./vue.d.es');
@Reference('./ckeditor');
@Reference('./web');