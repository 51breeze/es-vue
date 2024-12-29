import Class from "./../../Class.js";
import ButtonView from "@ckeditor/ckeditor5-ui/src/button/buttonview";
import {add as addLocale} from "@ckeditor/ckeditor5-utils/src/translation-service";
import Plugin from "@ckeditor/ckeditor5-core/src/plugin";
import System from "./../../System.js";
import Reflect from "./../../Reflect.js";
function FullScreen(){
    return Reflect.apply(function(){
        return this;
    },Reflect.construct(Plugin,arguments,FullScreen));
}
Class.creator(FullScreen,{
    m:513,
    ns:"ckeditor.plugins",
    name:"FullScreen",
    inherit:Plugin,
    methods:{
        pluginName:{
            m:576,
            enumerable:true,
            get:function pluginName(){
                return 'FullScreen';
            }
        },
        main:{
            m:800,
            value:function main(){
                addLocale('en',{
                    'Full Screen':'Full Screen',
                    'Full Screen default':'Default'
                });
                addLocale('zh-cn',{
                    'Full Screen':'全屏',
                    'Full Screen default':'默认'
                });
                addLocale('zh',{
                    'Full Screen':'全屏',
                    'Full Screen default':'默认'
                });
            }
        }
    },
    members:{
        init:{
            m:544,
            value:function init(){
                const editor = this.editor;
                const getContainer = (target)=>{
                    while(target){
                        if(target.classList.contains('rich-text-editor')){
                            return target;
                        }else{
                            target=target.parentNode;
                        }
                    }
                    return null;
                }
                Reflect.call(FullScreen,editor.ui.componentFactory,"add",['fullScreen',(locale)=>{
                    const view = new ButtonView(locale);
                    const icon = `<svg viewBox="1 1 20 20" xmlns="http://www.w3.org/2000/svg"><path d="m15.3 10-1.2-1.3 2.9-3h-2.3a.9.9 0 1 1 0-1.7H19c.5 0 .9.4.9.9v4.4a.9.9 0 1 1-1.8 0V7l-2.9 3Zm0 4 3 3v-2.3a.9.9 0 1 1 1.7 0V19c0 .5-.4.9-.9.9h-4.4a.9.9 0 1 1 0-1.8H17l-3-2.9 1.3-1.2ZM10 15.4l-2.9 3h2.3a.9.9 0 1 1 0 1.7H5a.9.9 0 0 1-.9-.9v-4.4a.9.9 0 1 1 1.8 0V17l2.9-3 1.2 1.3ZM8.7 10 5.7 7v2.3a.9.9 0 0 1-1.7 0V5c0-.5.4-.9.9-.9h4.4a.9.9 0 0 1 0 1.8H7l3 2.9-1.3 1.2Z"/></svg>`;
                    let status = 0;
                    Reflect.call(FullScreen,view,"set",[{
                        label:editor.t('Full Screen'),
                        icon:icon,
                        tooltip:true
                    }]);
                    Reflect.call(FullScreen,view,"on",['execute',()=>{
                        const sourceElement = getContainer(editor.ui.element || Reflect.get(FullScreen,Reflect.get(FullScreen,editor.ui.view,"editable"),"element"));
                        if(!sourceElement)
                        return 
                        if(status == 1){
                            sourceElement.classList.remove('fullscreen');
                            if(System.is(sourceElement.parentNode,HTMLElement)){
                                sourceElement.parentNode.removeAttribute('data-ck-editor-fullscreen');
                            }
                            document.body.removeAttribute('ckeditor-fullscreen');
                            Reflect.call(FullScreen,view,"set",[{
                                label:editor.t('Full Screen'),
                                icon:icon,
                                tooltip:true
                            }]);
                            status=0;
                        }else{
                            sourceElement.classList.add('fullscreen');
                            if(System.is(sourceElement.parentNode,HTMLElement)){
                                sourceElement.parentNode.setAttribute('data-ck-editor-fullscreen','fullscreen');
                            }
                            document.body.setAttribute('ckeditor-fullscreen','overlay');
                            Reflect.call(FullScreen,view,"set",[{
                                label:editor.t('Full Screen default'),
                                icon:icon,
                                tooltip:true
                            }]);
                            status=1;
                        }
                        editor.fire('fullscreen',status);
                        System.setImmediate(()=>{
                            Reflect.call(FullScreen,editor.editing.view,"forceRender",[]);
                        });
                    }]);
                    return view;
                }]);
            }
        }
    }
});
System.setImmediate(()=>FullScreen.main());
export default FullScreen;