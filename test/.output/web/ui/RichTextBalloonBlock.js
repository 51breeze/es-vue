import Class from "./../../Class.js";
import {BlockToolbar} from "@ckeditor/ckeditor5-ui";
import web_ui_RichEditor from "./RichEditor.js";
import {BalloonEditor as Balloon} from "@ckeditor/ckeditor5-editor-balloon";
import {Essentials} from "@ckeditor/ckeditor5-essentials";
import {CKFinderUploadAdapter as UploadAdapter} from "@ckeditor/ckeditor5-adapter-ckfinder";
import {Autoformat} from "@ckeditor/ckeditor5-autoformat";
import {Bold,Underline,Code,Italic} from "@ckeditor/ckeditor5-basic-styles";
import {BlockQuote} from "@ckeditor/ckeditor5-block-quote";
import {Heading} from "@ckeditor/ckeditor5-heading";
import {Alignment} from "@ckeditor/ckeditor5-alignment";
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
import {FontBackgroundColor,FontColor,FontFamily,FontSize} from "@ckeditor/ckeditor5-font";
import FullScreen from "./../../ckeditor/plugins/FullScreen.js";
import Component from "./../components/Component.js";
import dev_tools_HMR from "./../../dev/tools/HMR.js";
function RichTextBalloonBlock(){
    web_ui_RichEditor.call(this,arguments[0]);
}
Class.creator(RichTextBalloonBlock,{
    m:513,
    ns:"web.ui",
    name:"RichTextBalloonBlock",
    inherit:web_ui_RichEditor,
    methods:{
        main:{
            m:800,
            value:function main(){
                Balloon.builtinPlugins=[Essentials,UploadAdapter,Autoformat,BlockToolbar,Bold,Underline,Code,Italic,BlockQuote,Heading,Alignment,Image,ImageInsert,ImageInsertViaUrl,SimpleUploadAdapter,ImageCaption,ImageStyle,ImageToolbar,ImageUpload,Indent,Link,List,MediaEmbed,Paragraph,PasteFromOffice,PictureEditing,Table,TableToolbar,TextTransformation,FontBackgroundColor,FontColor,FontFamily,FontSize,FullScreen];
                Balloon.defaultConfig={
                    blockToolbar:['undo','redo','|','heading','bold','italic','Underline','alignment','indent','outdent','fontSize','fontFamily','fontColor','fontBackgroundColor','|','insertImage','insertTable','blockQuote','mediaEmbed','|','bulletedList','numberedList','|','FullScreen'],
                    toolbar:{
                        items:['bold','italic','link','Underline','alignment','indent','outdent']
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
                return Balloon;
            },
            configurable:true
        },
        getEditorName:{
            m:1056,
            value:function getEditorName(){
                return 'balloon-block';
            },
            configurable:true
        }
    }
});
RichTextBalloonBlock.main();
if(module.hot){
    module.hot.accept();
    if(!dev_tools_HMR.createRecord("898a6eed",RichTextBalloonBlock)){
        dev_tools_HMR.reload("898a6eed",RichTextBalloonBlock)
    }
}
export default Component.createComponent(RichTextBalloonBlock,{
    name:"es-RichTextBalloonBlock",
    __hmrId:"898a6eed"
});