import Class from "./../../Class.js";
import {createVNode,renderSlot,createCommentVNode,normalizeStyle} from "vue";
import web_ui_RichEditor from "./RichEditor.js";
import System from "./../../System.js";
import Reflect from "./../../Reflect.js";
import {MultiRootEditor as Multiroot} from "@ckeditor/ckeditor5-editor-multi-root";
import {Essentials} from "@ckeditor/ckeditor5-essentials";
import {CKFinderUploadAdapter as UploadAdapter} from "@ckeditor/ckeditor5-adapter-ckfinder";
import {Autoformat} from "@ckeditor/ckeditor5-autoformat";
import {Bold,Italic,Subscript,Strikethrough,Code,Underline} from "@ckeditor/ckeditor5-basic-styles";
import {BlockQuote} from "@ckeditor/ckeditor5-block-quote";
import {Heading} from "@ckeditor/ckeditor5-heading";
import {Image,ImageInsert,ImageInsertViaUrl,ImageCaption,ImageStyle,ImageToolbar,ImageUpload,PictureEditing} from "@ckeditor/ckeditor5-image";
import {SimpleUploadAdapter} from "@ckeditor/ckeditor5-upload";
import {Indent} from "@ckeditor/ckeditor5-indent";
import {Link} from "@ckeditor/ckeditor5-link";
import {List} from "@ckeditor/ckeditor5-list";
import {MediaEmbed} from "@ckeditor/ckeditor5-media-embed";
import {Paragraph} from "@ckeditor/ckeditor5-paragraph";
import {PasteFromOffice} from "@ckeditor/ckeditor5-paste-from-office";
import {Table,TableToolbar} from "@ckeditor/ckeditor5-table";
import {TextTransformation} from "@ckeditor/ckeditor5-typing";
import {Alignment} from "@ckeditor/ckeditor5-alignment";
import {FontBackgroundColor,FontColor,FontFamily,FontSize} from "@ckeditor/ckeditor5-font";
import FullScreen from "./../../ckeditor/plugins/FullScreen.js";
import Component from "./../components/Component.js";
import dev_tools_HMR from "./../../dev/tools/HMR.js";
const _private = Class.getKeySymbols("5608661b");
function RichTextMultiroot(){
    web_ui_RichEditor.call(this,arguments[0]);
    Object.defineProperty(this,_private,{
        value:{
            added:{}
        }
    });
}
Class.creator(RichTextMultiroot,{
    m:513,
    ns:"web.ui",
    name:"RichTextMultiroot",
    private:_private,
    inherit:web_ui_RichEditor,
    methods:{
        main:{
            m:800,
            value:function main(){
                Multiroot.builtinPlugins=[Essentials,UploadAdapter,Autoformat,Bold,Italic,BlockQuote,Heading,Image,ImageInsert,ImageInsertViaUrl,SimpleUploadAdapter,ImageCaption,ImageStyle,ImageToolbar,ImageUpload,Indent,Link,List,MediaEmbed,Paragraph,PasteFromOffice,PictureEditing,Table,TableToolbar,TextTransformation,Subscript,Strikethrough,Code,Underline,Alignment,FontBackgroundColor,FontColor,FontFamily,FontSize,FullScreen];
                Multiroot.defaultConfig={
                    toolbar:{
                        items:['undo','redo','|','heading','fontSize','fontFamily','fontColor','fontBackgroundColor','|','bold','italic','Underline','outdent','indent','alignment','|','bulletedList','numberedList','blockQuote','|','link','insertImage','insertTable','mediaEmbed','|','FullScreen']
                    },
                    image:{
                        styles:['alignCenter','alignLeft','alignRight'],
                        resizeOptions:[{
                            name:'resizeImage:original',
                            label:'Original',
                            value:null
                        },{
                            name:'resizeImage:50',
                            label:'50%',
                            value:'50'
                        },{
                            name:'resizeImage:75',
                            label:'75%',
                            value:'75'
                        }],
                        toolbar:['imageTextAlternative','toggleImageCaption','|','imageStyle:inline','imageStyle:wrapText','imageStyle:breakText','imageStyle:side','|','resizeImage'],
                        insert:{
                            integrations:['upload','assetManager','url']
                        }
                    },
                    table:{
                        contentToolbar:['tableColumn','tableRow','mergeTableCells']
                    },
                    language:'zh-cn'
                }
            }
        }
    },
    members:{
        layout:{
            m:576,
            enumerable:true,
            get:function layout(){
                return this.reactive("layout");
            },
            set:function layout(value){
                this.reactive("layout",value);
            }
        },
        toolbar:{
            m:576,
            enumerable:true,
            get:function toolbar(){
                return this.reactive("toolbar");
            },
            set:function toolbar(value){
                this.reactive("toolbar",value);
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
        onInitialized:{
            m:1056,
            value:function onInitialized(){
                web_ui_RichEditor.prototype.onInitialized.call(this);
                this.on('ready',(type,editor)=>{
                    const toolbarContainer = this.getToolbarContainer();
                    const focusTracker = editor.ui.focusTracker;
                    if(focusTracker && System.is(toolbarContainer,HTMLElement)){
                        Reflect.call(RichTextMultiroot,focusTracker,"on",['change:isFocused',()=>{
                            if(Reflect.get(RichTextMultiroot,focusTracker,"isFocused")){
                                toolbarContainer.classList.add('sticky');
                            }else{
                                toolbarContainer.classList.remove('sticky');
                            }
                        }]);
                    }
                    editor.on('addRoot',(evt,root)=>{
                        const editableElement = editor.createEditable(root);
                        const node = this[_private].added[Reflect.get(RichTextMultiroot,root,"rootName")];
                        if(node.parentNode){
                            node.parentNode.replaceChild(editableElement,node);
                        }else{
                            node.appendChild(editableElement);
                        }
                    });
                    this.updateLayout();
                });
            },
            configurable:true
        },
        added:{
            m:2056,
            writable:true
        },
        editor:{
            m:1088,
            get:function editor(){
                return Multiroot;
            },
            configurable:true
        },
        getEditorName:{
            m:1056,
            value:function getEditorName(){
                return 'multiroot';
            },
            configurable:true
        },
        getContent:{
            m:1056,
            value:function getContent(options){
                return (this.instance).getFullData(options);
            },
            configurable:true
        },
        getInitData:{
            m:544,
            value:function getInitData(){
                const layout = this.getContainer();
                const dataset = {}
                const data = this.value || {}
                Object.keys(layout).forEach((key)=>{
                    if(!dataset[key]){
                        const child = layout[key];
                        dataset[key]=data[key] || child.innerHTML;
                    }
                });
                return dataset;
            },
            configurable:true
        },
        getToolbarContainer:{
            m:1056,
            value:function getToolbarContainer(){
                const toolbar = this.toolbar;
                if(toolbar)
                return toolbar;
                return this.getRefs('rich-text-toolbar');
            },
            configurable:true
        },
        getContainer:{
            m:1056,
            value:function getContainer(){
                const obj = {
                    ...this.layout
                }
                Object.keys(obj).forEach((key)=>{
                    if(!this[_private].added[key]){
                        let value = this.queryElementNode(obj[key]);
                        if(value){
                            obj[key]=value;
                        }
                    }
                });
                const children = this.getChildren();
                children.forEach((child,index)=>{
                    const key = 'root-child-' + index;
                    obj[key]=child;
                });
                return obj;
            },
            configurable:true
        },
        getChildren:{
            m:1056,
            value:function getChildren(){
                const child = this.getRefs('children');
                if(System.is(child,HTMLElement)){
                    return Array.from(child.childNodes).filter((child)=>child.nodeType === 1);
                }
                return [];
            },
            configurable:true
        },
        queryElementNode:{
            m:1056,
            value:function queryElementNode(value){
                const type = typeof value;
                if(type === 'string'){
                    value=document.querySelector(value);
                }else 
                if(type === 'function'){
                    value=Reflect.call(RichTextMultiroot,value,"call",[this]);
                }
                return value instanceof HTMLElement ? value : null;
            },
            configurable:true
        },
        updateLayout:{
            m:1056,
            value:function updateLayout(){
                const editor = this.instance;
                if(editor){
                    const layout = this.getContainer();
                    const layoutNames = Object.keys(layout);
                    Object.keys(this[_private].added).forEach((key)=>{
                        if(!layout[key]){
                            const root = Reflect.call(RichTextMultiroot,Reflect.get(RichTextMultiroot,editor.model,"document"),"getRoot",[key]);
                            if(root && Reflect.call(RichTextMultiroot,root,"isAttached",[])){
                                editor.detachRoot(key);
                                const old = this[_private].added[key];
                                if(old.parentNode){
                                    old.parentNode.removeChild(old);
                                }
                            }
                        }
                    });
                    for(const name of layoutNames){
                        const node = layout[name];
                        const old = this[_private].added[name];
                        if(old !== node){
                            const root = Reflect.call(RichTextMultiroot,Reflect.get(RichTextMultiroot,editor.model,"document"),"getRoot",[name]);
                            if(old){
                                if(root && Reflect.call(RichTextMultiroot,root,"isAttached",[])){
                                    editor.detachRoot(name);
                                    if(old.parentNode){
                                        old.parentNode.removeChild(old);
                                    }
                                }else{
                                    continue;
                                }
                            }
                            if(node){
                                this[_private].added[name]=node;
                                if(!root){
                                    editor.addRoot(name,{
                                        data:this.value[name] || node.innerHTML
                                    });
                                }
                            }
                        }
                    }
                }
            },
            configurable:true
        },
        render:{
            m:1056,
            value:function render(){
                return createVNode("div",{
                    "data-type":this.getEditorName(),
                    "data-width":this.width,
                    "data-height":this.height,
                    class:"rich-text-multi-root rich-text-editor",
                    style:normalizeStyle(`width:${this.width};`)
                },[
                    !this.toolbar ? createVNode("div",{
                        class:"rich-text-toolbar",
                        ref:"rich-text-toolbar"
                    }) : createCommentVNode("end if"),
                    createVNode("div",{
                        class:"ck-editor__main",
                        ref:"children"
                    },renderSlot(this.getAttribute("slots"),"default",{},()=>[
                        createVNode("div")
                    ]))
                ]);
            },
            configurable:true
        }
    }
});
RichTextMultiroot.main();
if(module.hot){
    module.hot.accept();
    if(!dev_tools_HMR.createRecord("5608661b",RichTextMultiroot)){
        dev_tools_HMR.reload("5608661b",RichTextMultiroot)
    }
}
export default Component.createComponent(RichTextMultiroot,{
    name:"es-RichTextMultiroot",
    __hmrId:"5608661b",
    props:{
        layout:{
            type:Object,
            default:()=>({})
        },
        layout:{
            type:Object,
            default:()=>({})
        },
        toolbar:{
            type:null,
            default:null
        },
        toolbar:{
            type:null,
            default:null
        },
        value:{
            type:Object,
            default:()=>({})
        },
        value:{
            type:Object,
            default:()=>({})
        }
    }
});