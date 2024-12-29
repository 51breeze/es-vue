import Class from "./../../Class.js";
import web_ui_RichEditor from "./RichEditor.js";
import Reflect from "./../../Reflect.js";
import System from "./../../System.js";
import {ClassicEditor as Classic} from "@ckeditor/ckeditor5-editor-classic";
import {Essentials} from "@ckeditor/ckeditor5-essentials";
import {CKFinderUploadAdapter as UploadAdapter} from "@ckeditor/ckeditor5-adapter-ckfinder";
import {Autoformat} from "@ckeditor/ckeditor5-autoformat";
import {Bold,Italic,Subscript,Strikethrough,Code,Underline} from "@ckeditor/ckeditor5-basic-styles";
import {BlockQuote} from "@ckeditor/ckeditor5-block-quote";
import {Heading} from "@ckeditor/ckeditor5-heading";
import {Image,ImageInsert,ImageInsertViaUrl,ImageResize,ImageCaption,ImageStyle,ImageToolbar,ImageUpload,PictureEditing} from "@ckeditor/ckeditor5-image";
import {SimpleUploadAdapter,Base64UploadAdapter} from "@ckeditor/ckeditor5-upload";
import {Indent} from "@ckeditor/ckeditor5-indent";
import {Link,LinkImage} from "@ckeditor/ckeditor5-link";
import {List} from "@ckeditor/ckeditor5-list";
import {MediaEmbed} from "@ckeditor/ckeditor5-media-embed";
import {Paragraph} from "@ckeditor/ckeditor5-paragraph";
import {PasteFromOffice} from "@ckeditor/ckeditor5-paste-from-office";
import {Table,TableToolbar} from "@ckeditor/ckeditor5-table";
import {TextTransformation} from "@ckeditor/ckeditor5-typing";
import {CodeBlock} from "@ckeditor/ckeditor5-code-block";
import {Alignment} from "@ckeditor/ckeditor5-alignment";
import {FontBackgroundColor,FontColor,FontFamily,FontSize} from "@ckeditor/ckeditor5-font";
import FullScreen from "./../../ckeditor/plugins/FullScreen.js";
import {SourceEditing} from "@ckeditor/ckeditor5-source-editing";
import Component from "./../components/Component.js";
import dev_tools_HMR from "./../../dev/tools/HMR.js";
function RichText(){
    web_ui_RichEditor.call(this,arguments[0]);
}
Class.creator(RichText,{
    m:513,
    ns:"web.ui",
    name:"RichText",
    inherit:web_ui_RichEditor,
    methods:{
        main:{
            m:800,
            value:function main(){
                Classic.builtinPlugins=[Essentials,UploadAdapter,Autoformat,Bold,Italic,BlockQuote,Heading,Image,ImageInsert,ImageInsertViaUrl,SimpleUploadAdapter,Base64UploadAdapter,ImageResize,ImageCaption,ImageStyle,ImageToolbar,ImageUpload,Indent,Link,LinkImage,List,MediaEmbed,Paragraph,PasteFromOffice,PictureEditing,Table,TableToolbar,TextTransformation,Subscript,Strikethrough,Code,CodeBlock,Underline,Alignment,FontBackgroundColor,FontColor,FontFamily,FontSize,FullScreen,SourceEditing];
                Classic.defaultConfig={
                    toolbar:{
                        items:['undo','redo','|','heading','fontSize','fontFamily','fontColor','fontBackgroundColor','|','bold','italic','underline','strikethrough','Subscript','outdent','indent','alignment','|','bulletedList','numberedList','blockQuote','|','link','insertImage','mediaEmbed','insertTable','|','SourceEditing','Code','CodeBlock','|','FullScreen']
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
                    heading:{
                        options:[{
                            model:'paragraph',
                            title:'Paragraph',
                            class:'ck-heading_paragraph'
                        },{
                            model:'heading1',
                            view:'h1',
                            title:'Heading 1',
                            class:'ck-heading_heading1'
                        },{
                            model:'heading2',
                            view:'h2',
                            title:'Heading 2',
                            class:'ck-heading_heading2'
                        },{
                            model:'heading3',
                            view:'h3',
                            title:'Heading 3',
                            class:'ck-heading_heading3'
                        },{
                            model:'heading4',
                            view:'h4',
                            title:'Heading 4',
                            class:'ck-heading_heading4'
                        },{
                            model:'heading5',
                            view:'h5',
                            title:'Heading 5',
                            class:'ck-heading_heading5'
                        },{
                            model:'heading6',
                            view:'h6',
                            title:'Heading 6',
                            class:'ck-heading_heading6'
                        }]
                    },
                    language:'zh-cn'
                }
            }
        }
    },
    members:{
        onInitialized:{
            m:1056,
            value:function onInitialized(){
                web_ui_RichEditor.prototype.onInitialized.call(this);
                this.on('ready',(type,editor)=>{
                    let height = String(this.height).toLowerCase() === 'auto' ? 'auto' : `calc(${this.height} - 39px)`;
                    Reflect.call(RichText,editor.editing.view,"change",[(writer)=>{
                        const root = Reflect.call(RichText,Reflect.get(RichText,editor.editing.view,"document"),"getRoot",[]);
                        if(!Reflect.get(RichText,editor.ui.view,"element")){
                            Reflect.call(RichText,writer,"setStyle",['width',this.width,root]);
                        }else{
                            Reflect.call(RichText,writer,"setStyle",['width','100%',root]);
                        }
                        if(Reflect.get(RichText,editor.ui.view,"editable")){
                            const parentNode = Reflect.get(RichText,Reflect.get(RichText,Reflect.get(RichText,editor.ui.view,"editable"),"element"),"parentNode");
                            if(parentNode){
                                parentNode.style.height=height;
                            }
                        }
                        Reflect.call(RichText,writer,"setStyle",['height',height,root]);
                        Reflect.call(RichText,writer,"addClass",['rich-text-classic-editable',root]);
                    }]);
                    const element = Reflect.get(RichText,editor.ui.view,"element");
                    if(element){
                        element.style.width=this.width;
                    }
                    if(this.height !== 'auto' && editor.plugins.has('SourceEditing')){
                        const sourceEditingPlugin = editor.plugins.get('SourceEditing');
                        if(sourceEditingPlugin){
                            sourceEditingPlugin.on('change:isSourceEditingMode',(evt,name,isSourceEditingMode)=>{
                                if(isSourceEditingMode){
                                    const nameds = Array.from(editor.ui.getEditableElementsNames());
                                    const name = nameds.find((name)=>name.includes('sourceEditing'));
                                    if(name){
                                        const el = editor.ui.getEditableElement(name);
                                        if(System.is(el,HTMLElement)){
                                            el.style.height=height;
                                            el.style.overflow='auto';
                                            if(System.is(el.parentNode,HTMLElement)){
                                                el.parentNode.style.height=height;
                                            }
                                        }
                                    }
                                }
                            });
                        }
                    }
                });
            },
            configurable:true
        },
        editor:{
            m:1088,
            get:function editor(){
                return Classic;
            },
            configurable:true
        },
        getEditorName:{
            m:1056,
            value:function getEditorName(){
                return 'classic';
            },
            configurable:true
        }
    }
});
RichText.main();
if(module.hot){
    module.hot.accept();
    if(!dev_tools_HMR.createRecord("850940cb",RichText)){
        dev_tools_HMR.reload("850940cb",RichText)
    }
}
export default Component.createComponent(RichText,{
    name:"es-RichText",
    __hmrId:"850940cb"
});