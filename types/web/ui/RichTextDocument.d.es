package web.ui{

    import web.components.Component;

    import ckeditor.editor.Decoupled;
    
    import ckeditor.plugins.Paragraph
    import ckeditor.plugins.Essentials
    import ckeditor.plugins.Bold
    import ckeditor.plugins.Underline
    import ckeditor.plugins.Code
    import ckeditor.plugins.Strikethrough
    import ckeditor.plugins.Subscript
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
    import ckeditor.plugins.ImageResize
    import ckeditor.plugins.IndentBlock
    import ckeditor.plugins.ListProperties
    import ckeditor.plugins.TableCellProperties
    import ckeditor.plugins.TableProperties
    import ckeditor.plugins.TodoList

    import "../styles/rich-text-style.css"

    class RichTextDocument extends RichEditor{

        @Override
        protected get editor(){
            return Decoupled;
        }

        @Override
        protected getToolbarContainer(){
            return this.getRefs('rich-text-toolbar')
        }

        @Override
        protected getContainer(){
            return this.getRefs('rich-text-container')
        }

        @Override
        protected render(){
            return <div class="rich-text-document" style={`width:${this.width};`}>
                <div class="rich-text-toolbar" ref="rich-text-toolbar"></div>
                <div class="rich-text-container" style={`height:${this.height};`}>
                    <div ref="rich-text-container" style={`height:${this.height};`}></div>
                </div>
            </div>
        }

        @Main
        static main(){
            Decoupled.builtinPlugins=[
                Essentials,
                UploadAdapter,
                Autoformat,
                Bold,
                Italic,
                BlockQuote,
                CloudServices,
                EasyImage,
                Heading,
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
                Subscript,
                Strikethrough,
                Code,
                Underline,
                Alignment,
                FontBackgroundColor,
                FontColor,
                FontFamily,
                FontSize,
                IndentBlock,
                ListProperties,
                MediaEmbed,
                Paragraph,
                TableCellProperties,
                TableProperties,
                TodoList
            ];
            Decoupled.defaultConfig = {
                toolbar: {
                    items: [
                        'undo', 'redo',
                        '|', 'heading','fontSize','fontFamily','fontColor','fontBackgroundColor',
                        '|', 'bold', 'italic','Underline','strikethrough','alignment','bulletedList', 'numberedList', 'outdent', 'indent',
                        '|', 'link', 'uploadImage', 'imageUpload','insertTable', 'blockQuote', 'mediaEmbed',
                        '|', 'todoList','blockQuote',
                    ]
                },
                language: 'zh-cn',
                image: {
                    toolbar: [
                        'imageTextAlternative',
                        'toggleImageCaption',
                        'imageStyle:inline',
                        'imageStyle:block',
                        'imageStyle:side'
                    ]
                },
                table: {
                    contentToolbar: [
                        'tableColumn',
                        'tableRow',
                        'mergeTableCells',
                        'tableCellProperties',
                        'tableProperties'
                    ]
                }
            };
        }
    }
}