package web.ui{

    import web.components.Component;

    import ckeditor.editor.Classic;
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
    import ckeditor.plugins.Image
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
    import ckeditor.plugins.SourceEditing

    import "../styles/rich-text-style.css"
    
    class RichText extends RichEditor{

        @Override
        protected onInitialized():void{
            super.onInitialized();
            this.on('ready', (type, editor:Classic)=>{

                editor.editing.view.change( writer => {
                    const root = editor.editing.view.document.getRoot();
                    if(!editor.ui.view.element){
                        writer.setStyle('width',this.width, root);
                    }else{
                        writer.setStyle('width','100%', root);
                    }

                    if( editor.ui.view.editable ){
                        const parentNode = editor.ui.view.editable.element.parentNode as HTMLElement;
                        if( parentNode ){
                            parentNode.style.height = this.height;
                        }
                    }
                    writer.setStyle('height',this.height, root);
                    writer.addClass('rich-text-classic-editable', root);
                });
                
                const element = editor.ui.view.element as HTMLElement;
                if(element){
                    const list = [this.className, 'rich-text-editor'].filter( val=>!!val );
                    element.classList.add( ...list );
                    element.style.width=this.width;
                }

                editor.on('fullscreen', (event, status)=>{
                    editor.editing.view.change( writer => {
                        const root = editor.editing.view.document.getRoot();
                        const stickyPanel = editor.ui.view.stickyPanel;
                        const editable = editor.ui.view.editable;
                        if(root && stickyPanel && editable){
                            const editableElement = editable.element as HTMLElement;
                            const topElement = stickyPanel.element as HTMLElement;
                            if(editableElement && topElement){
                                const parentNode = editableElement.parentNode as HTMLElement
                                if( status === 1 ){
                                    let offsetHeight = topElement.offsetHeight || 39;
                                    let height = `calc( 100vh - ${offsetHeight}px )`;
                                    if(parentNode){
                                        parentNode.style.height=height;
                                    }
                                    writer.setStyle('height', height, root);
                                }else{
                                    if(parentNode){
                                        parentNode.style.height=this.height;
                                    }
                                    writer.setStyle('height', this.height, root);
                                }
                            }
                        }
                    })
                });
                
            });
        }
        
        @Override
        protected get editor(){
            return Classic;
        }

        @Main
        static main(){
            Classic.builtinPlugins=[
                Essentials,
                UploadAdapter,
                Autoformat,
                Bold,
                Italic,
                BlockQuote,
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
                FullScreen,
                SourceEditing,
            ];
            Classic.defaultConfig = {
                toolbar: {
                    items: [
                        'undo', 'redo',
                        '|', 'heading','fontSize','fontFamily','fontColor','fontBackgroundColor',
                        '|', 'bold', 'italic','underline', 'strikethrough','Subscript', 'outdent', 'indent','alignment',
                        '|','bulletedList', 'numberedList','blockQuote',
                        '|','link','imageUpload','insertTable',
                        '|','SourceEditing','Code',
                        '|','FullScreen'
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
                language: 'zh-cn'
            };
        }
    }
}