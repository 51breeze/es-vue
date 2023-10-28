package web.ui{

    import web.components.Component;
    import web.components.Ckeitor;

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
    import ckeditor.plugins.CKBox
    import ckeditor.plugins.CKFinder
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

    import CkeditorVue from '@ckeditor/ckeditor5-vue';
    
    class RichText extends Ckeitor{
        
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
                CKBox,
                CKFinder,
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
                Alignment
            ];
            Classic.defaultConfig = {
                toolbar: {
                    items: [
                        'undo', 'redo',
                        '|', 'heading',
                        '|', 'bold', 'italic','Underline',
                        '|', 'link', 'uploadImage', 'insertTable', 'blockQuote', 'mediaEmbed',
                        '|', 'bulletedList', 'numberedList', 'outdent', 'indent','alignment'
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
                language: 'zh'
            };
        }

        // private onChange(newValue){
        //     if(!this.disableTwoWayDataBinding){
        //         this.emit('update:modelValue', newValue);
        //         this.emit('input', newValue);
        //     }
        // }

        // getInstance(){
        //     return this.getRefs('editor');
        // }

        // getEditor(){
        //     return this.editorInstance;
        // }

        // private editorInstance:Classic = null;

        // private makeEventHandle(type, ...args){
        //     if( type==='ready'){
        //         this.editorInstance = args[0];
        //     }
        //     this.emit(type, ...args);
        // }

        // @Override
        // protected render(){
        //     return this.createVNode(CkeditorVue.component, {
        //         tagName:this.tagName,
        //         editor:Classic,
        //         config:this.config,
        //         disabled:this.readonly,
        //         disableTwoWayDataBinding:this.disableTwoWayDataBinding,
        //         modelValue:this.value,
        //         onReady:this.makeEventHandle.bind(this, 'ready'),
        //         onDestroy:this.makeEventHandle.bind(this, 'destroy'),
        //         onBlur:this.makeEventHandle.bind(this, 'blur'),
        //         onFocus:this.makeEventHandle.bind(this, 'focus'),
        //         "onUpdate:modelValue":this.onChange.bind(this),
        //         ref:'editor'
        //     })
        // }
    }
}