package web.ui{

    import web.components.Component;

    import ckeditor.editor.Balloon;
    import ckeditor.plugins.Paragraph
    import ckeditor.plugins.Essentials
    import ckeditor.plugins.Bold
    import ckeditor.plugins.Underline
    import ckeditor.plugins.Code
    import ckeditor.plugins.BlockQuote
    import ckeditor.plugins.Heading
    import ckeditor.plugins.Alignment

    import ckeditor.plugins.UploadAdapter
    import ckeditor.plugins.Autoformat
    import ckeditor.plugins.Image
     import ckeditor.plugins.SimpleUploadAdapter
    import ckeditor.plugins.ImageInsert
    import ckeditor.plugins.ImageInsertViaUrl
    import ckeditor.plugins.ImageCaption
    import ckeditor.plugins.ImageStyle
    import ckeditor.plugins.ImageToolbar
    import ckeditor.plugins.ImageUpload
    import ckeditor.plugins.Indent
    import ckeditor.plugins.Link
    import ckeditor.plugins.List
    import ckeditor.plugins.MediaEmbed
    import ckeditor.plugins.PasteFromOffice
    import ckeditor.plugins.PictureEditing
    import ckeditor.plugins.Table
    import ckeditor.plugins.TableToolbar
    import ckeditor.plugins.TextTransformation
    import ckeditor.plugins.Italic

    import ckeditor.plugins.FontBackgroundColor
    import ckeditor.plugins.FontColor
    import ckeditor.plugins.FontFamily
    import ckeditor.plugins.FontSize
    import ckeditor.plugins.FullScreen
    
    import { BlockToolbar } from '@ckeditor/ckeditor5-ui';
    
    class RichTextBalloonBlock extends RichEditor{

        @Override
        protected get editor(){
            return Balloon;
        }

        @Override
        protected getEditorName(){
            return 'balloon-block'
        }

        @Main(false)
        static main(){
            Balloon.builtinPlugins=[
                Essentials,
                UploadAdapter,
                Autoformat,
                BlockToolbar,
                Bold,
                Underline,
                Code,
                Italic,
                BlockQuote,
                Heading,
                Alignment,
                Image,
                ImageInsert,
                ImageInsertViaUrl,
                SimpleUploadAdapter,
                ImageCaption,
                ImageStyle,
                ImageToolbar,
                ImageUpload,
                Indent,
                Link,
                List,
                MediaEmbed,
                Paragraph,
                PasteFromOffice,
                PictureEditing,
                Table,
                TableToolbar,
                TextTransformation,
                FontBackgroundColor,
                FontColor,
                FontFamily,
                FontSize,
                FullScreen
            ];
            Balloon.defaultConfig = {
               
                blockToolbar: [
                    'undo', 'redo',
                    '|', 'heading','bold', 'italic','Underline','alignment','indent','outdent','fontSize','fontFamily','fontColor','fontBackgroundColor',
                    '|', 'insertImage', 'insertTable', 'blockQuote', 'mediaEmbed',
                    '|', 'bulletedList', 'numberedList','|','FullScreen'
                ],
                toolbar: {
                    items: [
                        'bold', 'italic', 'link', 'Underline', 'alignment','indent','outdent'
                    ]
                },
                image: {
                    styles: [
                        'alignCenter',
                        'alignLeft',
                        'alignRight'
                    ],
                    resizeOptions: [
                        {
                            name: 'resizeImage:original',
                            label: 'Original',
                            value: null
                        },
                        {
                            name: 'resizeImage:50',
                            label: '50%',
                            value: '50'
                        },
                        {
                            name: 'resizeImage:75',
                            label: '75%',
                            value: '75'
                        }
                    ],
                    toolbar: [
                        'imageTextAlternative', 'toggleImageCaption', '|',
                        'imageStyle:inline', 'imageStyle:wrapText', 'imageStyle:breakText', 'imageStyle:side', '|',
                        'resizeImage'
                    ],
                    insert: {
                        integrations: [
                            'upload', 'assetManager', 'url'
                        ]
                    }
                },
                table: {
                    contentToolbar: [
                        'tableColumn',
                        'tableRow',
                        'mergeTableCells'
                    ]
                },

                language:'zh-cn',

            };
        }
    }
}