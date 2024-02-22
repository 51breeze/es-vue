package web.ui{

    import web.components.Component;

    import ckeditor.editor.Classic;
    import ckeditor.plugins.Paragraph
    import ckeditor.plugins.Essentials
    import ckeditor.plugins.Bold
    import ckeditor.plugins.Underline
    import ckeditor.plugins.Code
    import ckeditor.plugins.CodeBlock
    import ckeditor.plugins.Strikethrough
    import ckeditor.plugins.Subscript
    import ckeditor.plugins.BlockQuote
    import ckeditor.plugins.Heading
    import ckeditor.plugins.Alignment

    import ckeditor.plugins.UploadAdapter
    import ckeditor.plugins.Autoformat
    import ckeditor.plugins.Image
    import ckeditor.plugins.SimpleUploadAdapter
    import ckeditor.plugins.Base64UploadAdapter 
    import ckeditor.plugins.ImageInsert
    import ckeditor.plugins.ImageInsertViaUrl
    import ckeditor.plugins.ImageResize
    import ckeditor.plugins.ImageCaption
    import ckeditor.plugins.ImageStyle
    import ckeditor.plugins.ImageToolbar
    import ckeditor.plugins.ImageUpload
    import ckeditor.plugins.Indent
    import ckeditor.plugins.Link
    import ckeditor.plugins.LinkImage
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
                ImageInsert,
                ImageInsertViaUrl,
                SimpleUploadAdapter,
                Base64UploadAdapter,
                ImageResize,
                ImageCaption,
                ImageStyle,
                ImageToolbar,
                ImageUpload,
                Indent,
                Link,
                LinkImage,
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
                CodeBlock,
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
                        '|','link','insertImage','mediaEmbed','insertTable',
                        '|','SourceEditing','Code','CodeBlock',
                        '|','FullScreen'
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
                heading: {
                    options: [
                        { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
                        { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
                        { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
                        { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
                        { model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' },
                        { model: 'heading5', view: 'h5', title: 'Heading 5', class: 'ck-heading_heading5' },
                        { model: 'heading6', view: 'h6', title: 'Heading 6', class: 'ck-heading_heading6' }
                    ]
                },
                language: 'zh-cn'
            };
        }
    }
}