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
    import ckeditor.plugins.CloudServices
    import ckeditor.plugins.Image
    import ckeditor.plugins.EasyImage
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
    
    import { BlockToolbar } from '@ckeditor/ckeditor5-ui';
    
    class RichTextBalloonBlock extends RichEditor{

        @Override
        protected get editor(){
            return Balloon;
        }

        @Main
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
                CloudServices,
                EasyImage,
                Heading,
                Alignment,
                Image,
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
            ];
            Balloon.defaultConfig = {
               
                blockToolbar: [
                    'undo', 'redo',
                    '|', 'heading','bold', 'italic','Underline','alignment','indent','outdent','fontSize','fontFamily','fontColor','fontBackgroundColor',
                    '|', 'uploadImage', 'insertTable', 'blockQuote', 'mediaEmbed',
                    '|', 'bulletedList', 'numberedList' 
                ],
                toolbar: {
                    items: [
                        'bold', 'italic', 'link', 'Underline', 'alignment','indent','outdent'
                    ]
                },
                image: {
                    toolbar: [
                        'imageStyle:inline',
                        'imageStyle:block',
                        'imageStyle:side',
                        '|',
                        'toggleImageCaption',
                        'imageTextAlternative'
                    ]
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