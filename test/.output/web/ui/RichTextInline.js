import Class from "./../../Class.js";
import web_ui_RichEditor from "./RichEditor.js";
import {InlineEditor as Inline} from "@ckeditor/ckeditor5-editor-inline";
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
function RichTextInline(){
    web_ui_RichEditor.call(this,arguments[0]);
}
Class.creator(RichTextInline,{
    m:513,
    ns:"web.ui",
    name:"RichTextInline",
    inherit:web_ui_RichEditor,
    methods:{
        main:{
            m:800,
            value:function main(){
                Inline.builtinPlugins=[Essentials,UploadAdapter,Autoformat,Bold,Italic,BlockQuote,Heading,Image,ImageInsert,ImageInsertViaUrl,SimpleUploadAdapter,ImageCaption,ImageStyle,ImageToolbar,ImageUpload,Indent,Link,List,MediaEmbed,Paragraph,PasteFromOffice,PictureEditing,Table,TableToolbar,TextTransformation,Subscript,Strikethrough,Code,Underline,Alignment,FontBackgroundColor,FontColor,FontFamily,FontSize,FullScreen];
                Inline.defaultConfig={
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
        editor:{
            m:1088,
            get:function editor(){
                return Inline;
            },
            configurable:true
        },
        getEditorName:{
            m:1056,
            value:function getEditorName(){
                return 'inline';
            },
            configurable:true
        }
    }
});
RichTextInline.main();
if(module.hot){
    module.hot.accept();
    if(!dev_tools_HMR.createRecord("da6e66de",RichTextInline)){
        dev_tools_HMR.reload("da6e66de",RichTextInline)
    }
}
export default Component.createComponent(RichTextInline,{
    name:"es-RichTextInline",
    __hmrId:"da6e66de"
});