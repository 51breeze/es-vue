import Class from "./../../Class.js";
import {createVNode,normalizeStyle} from "vue";
import web_ui_RichEditor from "./RichEditor.js";
import {DecoupledEditor as Decoupled} from "@ckeditor/ckeditor5-editor-decoupled";
import {Essentials} from "@ckeditor/ckeditor5-essentials";
import {CKFinderUploadAdapter as UploadAdapter} from "@ckeditor/ckeditor5-adapter-ckfinder";
import {Autoformat} from "@ckeditor/ckeditor5-autoformat";
import {Bold,Italic,Subscript,Strikethrough,Code,Underline} from "@ckeditor/ckeditor5-basic-styles";
import {BlockQuote} from "@ckeditor/ckeditor5-block-quote";
import {CloudServices} from "@ckeditor/ckeditor5-cloud-services";
import {EasyImage} from "@ckeditor/ckeditor5-easy-image";
import {Heading} from "@ckeditor/ckeditor5-heading";
import {Image,ImageInsert,ImageInsertViaUrl,ImageCaption,ImageStyle,ImageToolbar,ImageUpload,PictureEditing} from "@ckeditor/ckeditor5-image";
import {SimpleUploadAdapter} from "@ckeditor/ckeditor5-upload";
import {Indent,IndentBlock} from "@ckeditor/ckeditor5-indent";
import {Link} from "@ckeditor/ckeditor5-link";
import {List,ListProperties,TodoList} from "@ckeditor/ckeditor5-list";
import {MediaEmbed} from "@ckeditor/ckeditor5-media-embed";
import {Paragraph} from "@ckeditor/ckeditor5-paragraph";
import {PasteFromOffice} from "@ckeditor/ckeditor5-paste-from-office";
import {Table,TableToolbar,TableCellProperties,TableProperties} from "@ckeditor/ckeditor5-table";
import {TextTransformation} from "@ckeditor/ckeditor5-typing";
import {Alignment} from "@ckeditor/ckeditor5-alignment";
import {FontBackgroundColor,FontColor,FontFamily,FontSize} from "@ckeditor/ckeditor5-font";
import FullScreen from "./../../ckeditor/plugins/FullScreen.js";
import Component from "./../components/Component.js";
import dev_tools_HMR from "./../../dev/tools/HMR.js";
function RichTextDocument(){
    web_ui_RichEditor.call(this,arguments[0]);
}
Class.creator(RichTextDocument,{
    m:513,
    ns:"web.ui",
    name:"RichTextDocument",
    inherit:web_ui_RichEditor,
    methods:{
        main:{
            m:800,
            value:function main(){
                Decoupled.builtinPlugins=[Essentials,UploadAdapter,Autoformat,Bold,Italic,BlockQuote,CloudServices,EasyImage,Heading,Image,ImageInsert,ImageInsertViaUrl,SimpleUploadAdapter,ImageCaption,ImageStyle,ImageToolbar,ImageUpload,Indent,Link,List,MediaEmbed,Paragraph,PasteFromOffice,PictureEditing,Table,TableToolbar,TextTransformation,Subscript,Strikethrough,Code,Underline,Alignment,FontBackgroundColor,FontColor,FontFamily,FontSize,IndentBlock,ListProperties,MediaEmbed,Paragraph,TableCellProperties,TableProperties,TodoList,FullScreen];
                Decoupled.defaultConfig={
                    toolbar:{
                        items:['undo','redo','|','heading','fontSize','fontFamily','fontColor','fontBackgroundColor','|','bold','italic','underline','outdent','indent','strikethrough','alignment','bulletedList','numberedList','todoList','blockQuote','|','link','insertImage','mediaEmbed','insertTable','|','FullScreen']
                    },
                    language:'zh-cn',
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
                        contentToolbar:['tableColumn','tableRow','mergeTableCells','tableCellProperties','tableProperties']
                    }
                }
            }
        }
    },
    members:{
        editor:{
            m:1088,
            get:function editor(){
                return Decoupled;
            },
            configurable:true
        },
        getEditorName:{
            m:1056,
            value:function getEditorName(){
                return 'decoupled';
            },
            configurable:true
        },
        getToolbarContainer:{
            m:1056,
            value:function getToolbarContainer(){
                return this.getRefs('rich-text-toolbar');
            },
            configurable:true
        },
        getContainer:{
            m:1056,
            value:function getContainer(){
                return this.getRefs('rich-text-container');
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
                    class:"rich-text-document rich-text-editor",
                    style:normalizeStyle(`width:${this.width};`)
                },[
                    createVNode("div",{
                        class:"rich-text-toolbar",
                        ref:"rich-text-toolbar"
                    }),
                    createVNode("div",{
                        class:"rich-text-container",
                        style:normalizeStyle(`height:${this.height};`)
                    },[
                        createVNode("div",{
                            ref:"rich-text-container",
                            style:normalizeStyle(`height:${this.height};`)
                        })
                    ])
                ]);
            },
            configurable:true
        }
    }
});
RichTextDocument.main();
if(module.hot){
    module.hot.accept();
    if(!dev_tools_HMR.createRecord("c624bafe",RichTextDocument)){
        dev_tools_HMR.reload("c624bafe",RichTextDocument)
    }
}
export default Component.createComponent(RichTextDocument,{
    name:"es-RichTextDocument",
    __hmrId:"c624bafe"
});