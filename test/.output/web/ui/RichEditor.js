import "./../../../../test/.output/asstes/rich-text-style-ef498c43.css";
import Class from "./../../Class.js";
import {createVNode,normalizeClass,normalizeStyle,h,markRaw} from "vue";
import {debounce} from "lodash-es";
import Component from "./../components/Component.js";
import Reflect from "./../../Reflect.js";
import System from "./../../System.js";
import dev_tools_HMR from "./../../dev/tools/HMR.js";
const _private = Class.getKeySymbols("50427dd7");
function RichEditor(){
    Component.call(this,arguments[0]);
    Object.defineProperty(this,_private,{
        value:{
            _editor:null,
            instance:null,
            lastEditorData:null,
            unmonitor:null
        }
    });
}
Class.creator(RichEditor,{
    m:513,
    ns:"web.ui",
    name:"RichEditor",
    private:_private,
    inherit:Component,
    methods:{
        SAMPLE_READ_ONLY_LOCK_ID:{
            m:776,
            writable:true,
            value:'Integration Sample'
        },
        INPUT_EVENT_DEBOUNCE_WAIT:{
            m:776,
            writable:true,
            value:300
        }
    },
    members:{
        tagName:{
            m:576,
            enumerable:true,
            get:function tagName(){
                return this.reactive("tagName");
            },
            set:function tagName(value){
                this.reactive("tagName",value);
            }
        },
        value:{
            m:576,
            enumerable:true,
            get:function value(){
                return this.reactive("value");
            },
            set:function value(value){
                this.reactive("value",value);
            }
        },
        modelValue:{
            m:576,
            enumerable:true,
            get:function modelValue(){
                return this.reactive("modelValue");
            },
            set:function modelValue(value){
                this.reactive("modelValue",value);
            }
        },
        disableTwoWayDataBinding:{
            m:576,
            enumerable:true,
            get:function disableTwoWayDataBinding(){
                return this.reactive("disableTwoWayDataBinding");
            },
            set:function disableTwoWayDataBinding(value){
                this.reactive("disableTwoWayDataBinding",value);
            }
        },
        readonly:{
            m:576,
            enumerable:true,
            get:function readonly(){
                return this.reactive("readonly");
            },
            set:function readonly(value){
                this.reactive("readonly",value);
            }
        },
        config:{
            m:576,
            enumerable:true,
            get:function config(){
                return this.reactive("config");
            },
            set:function config(value){
                this.reactive("config",value);
            }
        },
        width:{
            m:576,
            enumerable:true,
            get:function width(){
                return this.reactive("width");
            },
            set:function width(value){
                this.reactive("width",value);
            }
        },
        height:{
            m:576,
            enumerable:true,
            get:function height(){
                return this.reactive("height");
            },
            set:function height(value){
                this.reactive("height",value);
            }
        },
        className:{
            m:576,
            enumerable:true,
            get:function className(){
                return this.reactive("className");
            },
            set:function className(value){
                this.reactive("className",value);
            }
        },
        toolbarStickyPanelEnable:{
            m:576,
            enumerable:true,
            get:function toolbarStickyPanelEnable(){
                return this.reactive("toolbarStickyPanelEnable");
            },
            set:function toolbarStickyPanelEnable(value){
                this.reactive("toolbarStickyPanelEnable",value);
            }
        },
        _editor:{
            m:2056,
            writable:true
        },
        editor:{
            m:576,
            enumerable:true,
            get:function editor(){
                return this[_private]._editor;
            },
            set:function editor(value){
                this[_private]._editor=value;
            },
            configurable:true
        },
        instance:{
            m:1088,
            get:function instance(){
                return this[_private].instance;
            },
            set:function instance(value){
                this[_private].instance=value;
            }
        },
        lastEditorData:{
            m:2056,
            writable:true
        },
        onInitialized:{
            m:1056,
            value:function onInitialized(){
                const {CKEDITOR_VERSION} = window;
                if(CKEDITOR_VERSION){
                    const [major] = String(CKEDITOR_VERSION).split('.').map((val)=>Number(val));
                    if(major < 37){
                        console.warn('The <CKEditor> component requires using CKEditor 5 in version 37 or higher.');
                    }
                }else{
                    console.warn('Cannot find the "CKEDITOR_VERSION" in the "window" scope.');
                }
                this.watch('value',(value)=>{
                    if(this.instance && JSON.stringify(value) !== JSON.stringify(this[_private].lastEditorData)){
                        this.instance.data.set(this.formatValue(value));
                    }
                });
                this.watch('readonly',(value)=>{
                    if(value){
                        this.instance.enableReadOnlyMode(RichEditor.SAMPLE_READ_ONLY_LOCK_ID);
                    }else{
                        this.instance.disableReadOnlyMode(RichEditor.SAMPLE_READ_ONLY_LOCK_ID);
                    }
                });
            },
            configurable:true
        },
        formatValue:{
            m:1056,
            value:function formatValue(value){
                return value;
            },
            configurable:true
        },
        getContent:{
            m:1056,
            value:function getContent(options){
                const editor = this.instance;
                if(editor){
                    return editor.data.get(options);
                }
                return false;
            },
            configurable:true
        },
        setUpEditorEvents:{
            m:1056,
            value:function setUpEditorEvents(){
                const editor = this.instance;
                const emitDebouncedInputEvent = debounce((evt)=>{
                    if(this.disableTwoWayDataBinding){
                        return 
                    }
                    const data = this.getContent();
                    this[_private].lastEditorData=data;
                    this.onChanged(data,evt,editor);
                },RichEditor.INPUT_EVENT_DEBOUNCE_WAIT,{
                    leading:true
                });
                Reflect.call(RichEditor,Reflect.get(RichEditor,editor.model,"document"),"on",['change:data',emitDebouncedInputEvent]);
                Reflect.call(RichEditor,Reflect.get(RichEditor,editor.editing.view,"document"),"on",['focus',(evt)=>{
                    this.emit('focus',evt,editor);
                }]);
                Reflect.call(RichEditor,Reflect.get(RichEditor,editor.editing.view,"document"),"on",['blur',(evt)=>{
                    this.emit('blur',evt,editor);
                }]);
            },
            configurable:true
        },
        onChanged:{
            m:1056,
            value:function onChanged(data,evt,editor){
                this.emit('update:modelValue',data,evt,editor);
                this.emit('input',data,evt,editor);
            },
            configurable:true
        },
        onUnmounted:{
            m:1056,
            value:function onUnmounted(){
                if(this.instance){
                    this.instance.destroy();
                    this.instance=null;
                }
                let unmonitor = this[_private].unmonitor;
                if(unmonitor)
                unmonitor();
                this.emit('destroy',this.instance);
            },
            configurable:true
        },
        getInitData:{
            m:1056,
            value:function getInitData(){
                return this.value;
            },
            configurable:true
        },
        onMounted:{
            m:1056,
            value:function onMounted(){
                const editorConfig = Object.assign({},this.config);
                const initValue = this.formatValue(this.getInitData());
                if(initValue){
                    Reflect.set(RichEditor,editorConfig,"initialData",initValue);
                }
                this.editor.create(this.getContainer(),editorConfig).then((editor)=>{
                    this.instance=markRaw(editor);
                    this.setUpEditorEvents();
                    if(JSON.stringify(initValue) !== JSON.stringify(Reflect.get(RichEditor,editorConfig,"initialData"))){
                        this.instance.data.set(initValue);
                    }
                    if(this.readonly){
                        editor.enableReadOnlyMode(RichEditor.SAMPLE_READ_ONLY_LOCK_ID);
                    }
                    const toolbarContainer = this.getToolbarContainer();
                    if(System.is(toolbarContainer,HTMLElement)){
                        const toolbar = Reflect.get(RichEditor,editor.ui.view,"toolbar");
                        if(toolbar){
                            toolbarContainer.appendChild(toolbar.element);
                        }
                    }
                    editor.on('fullscreen',(event,status)=>{
                        this.emit('fullscreen',event,editor,status);
                    });
                    this.emit('ready',editor);
                    const stickyPanel = Reflect.get(RichEditor,editor.ui.view,"stickyPanel");
                    if(stickyPanel){
                        let monitor = (event,name,value)=>{
                            if(!this.toolbarStickyPanelEnable){
                                Reflect.call(RichEditor,event,"stop",[]);
                                event.return=false;
                            }
                        }
                        Reflect.call(RichEditor,stickyPanel,"on",['set:isActive',monitor]);
                        this[_private].unmonitor=()=>{
                            Reflect.call(RichEditor,stickyPanel,"off",['set:isActive',monitor]);
                        }
                    }
                }).catch((error)=>{
                    console.error(error);
                });
            },
            configurable:true
        },
        unmonitor:{
            m:2056,
            writable:true
        },
        getToolbarContainer:{
            m:1056,
            value:function getToolbarContainer(){
                return this.getRefs('toolbar-container');
            },
            configurable:true
        },
        getContainer:{
            m:1056,
            value:function getContainer(){
                return this.getRefs('container');
            },
            configurable:true
        },
        getEditorName:{
            m:1056,
            value:function getEditorName(){
                return 'classic';
            },
            configurable:true
        },
        render:{
            m:1056,
            value:function render(){
                let style = {
                    width:this.width,
                    height:this.height
                }
                return createVNode("div",{
                    "data-type":this.getEditorName(),
                    "data-width":this.width,
                    "data-height":this.height,
                    class:normalizeClass("rich-text-editor " + this.className),
                    style:normalizeStyle(style)
                },[
                    createVNode("div",{
                        ref:"container"
                    })
                ]);
            },
            configurable:true
        }
    }
});
if(module.hot){
    module.hot.accept();
    if(!dev_tools_HMR.createRecord("50427dd7",RichEditor)){
        dev_tools_HMR.reload("50427dd7",RichEditor)
    }
}
export default Component.createComponent(RichEditor,{
    name:"es-RichEditor",
    __hmrId:"50427dd7",
    props:{
        tagName:{
            type:String,
            default:'div'
        },
        tagName:{
            type:String,
            default:'div'
        },
        value:{
            type:String,
            default:''
        },
        value:{
            type:String,
            default:''
        },
        modelValue:{
            type:null,
            default:null
        },
        modelValue:{
            type:null,
            default:null
        },
        disableTwoWayDataBinding:{
            type:Boolean,
            default:false
        },
        disableTwoWayDataBinding:{
            type:Boolean,
            default:false
        },
        readonly:{
            type:Boolean,
            default:false
        },
        readonly:{
            type:Boolean,
            default:false
        },
        config:{
            type:null,
            default:()=>({})
        },
        config:{
            type:null,
            default:()=>({})
        },
        width:{
            type:String,
            default:'auto'
        },
        width:{
            type:String,
            default:'auto'
        },
        height:{
            type:String,
            default:'auto'
        },
        height:{
            type:String,
            default:'auto'
        },
        className:{
            type:String,
            default:''
        },
        className:{
            type:String,
            default:''
        },
        toolbarStickyPanelEnable:{
            type:Boolean,
            default:true
        },
        toolbarStickyPanelEnable:{
            type:Boolean,
            default:true
        },
        editor:{
            type:null
        }
    }
});