package web.ui{

    import web.components.Component;

    import ckeditor.core.Editor;

    import ckeditor.editor.Multiroot;
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

    class RichTextMultiroot extends RichEditor{

        layout:{
            [key:string]:RichTextMultirootLayoutValueType
        }={};

        toolbar:Node=null;

        value:{
            [key:string]:string
        } = {};

        @Override
        protected onInitialized():void{
            super.onInitialized();
            this.on('ready', (type, editor:Multiroot)=>{

                const toolbarContainer = this.getToolbarContainer();
                const focusTracker = editor.ui.focusTracker;
                if(focusTracker && toolbarContainer is HTMLElement){
                    focusTracker.on( 'change:isFocused', () => {
                        if ( focusTracker.isFocused ) {
                            toolbarContainer.classList.add( 'sticky' );
                        } else {
                            toolbarContainer.classList.remove( 'sticky' );
                        }
                    });
                }

                editor.on( 'addRoot', ( evt, root ) => {
                    const editableElement = editor.createEditable(root);
                    const node = this.added[root.rootName];
                    if(node.parentNode){
                        node.parentNode.replaceChild(editableElement, node);
                    }else{
                        node.appendChild(editableElement);
                    }
                });

                this.updateLayout();
            });
        }

        private added:{
            [key:string]:HTMLElement
        }={};

        @Override
        protected get editor(){
            return Multiroot;
        }

        @Override
        protected getEditorName(){
            return 'multiroot'
        }

        @Override
        protected getContent(options){
            return (this.instance as Multiroot).getFullData(options);
        }

        @Override
        getInitData(){
            const layout = this.getContainer();
            const dataset = {};
            const data = this.value || {};
            Object.keys(layout).forEach(key=>{
                if( !dataset[key] ){
                    const child = layout[key] as HTMLElement;
                    dataset[key] = data[key] || child.innerHTML;
                }
            });
            return dataset;
        }

        @Override
        protected getToolbarContainer(){
            const toolbar = this.toolbar;
            if(toolbar)return toolbar;
            return this.getRefs('rich-text-toolbar')
        }

        @Override
        protected getContainer(){
            const obj = {...this.layout};
            Object.keys(obj).forEach( key=>{
                if( !this.added[key] ){
                    let value = this.queryElementNode(obj[key]);
                    if( value ){
                        obj[key] = value;
                    }
                }
            });
            const children = this.getChildren();
            children.forEach( (child,index)=>{
                const key = 'root-child-'+index;
                obj[key] = child;
            });
            return obj;
        }

        protected getChildren(){
            const child = this.getRefs('children');
            if(child is HTMLElement){
                return Array.from(child.childNodes).filter(child=>child.nodeType===1);
            }
            return [];
        }

        protected queryElementNode(value:any):HTMLElement{
            const type = typeof value;
            if( type ==='string' ){
                value = document.querySelector(value as string)
            }else if( type ==='function' ){
                value = value.call(this);
            }
            return value instanceof HTMLElement ? value : null;
        }

        protected updateLayout(){
            const editor = this.instance as Multiroot;
            if( editor ){
                const layout = this.getContainer();
                const layoutNames = Object.keys(layout);
                Object.keys(this.added).forEach( key=>{
                    if(!layout[key]){
                        const root = editor.model.document.getRoot(key)
                        if(root && root.isAttached()){
                            editor.detachRoot(key);
                            const old = this.added[key];
                            if(old.parentNode){
                                old.parentNode.removeChild(old);
                            }
                        }
                    }
                });
                for (const name of layoutNames) {
                    const node = layout[name] as HTMLElement;
                    const old = this.added[name];
                    if( old !== node ){
                        const root = editor.model.document.getRoot(name);
                        if( old ){
                            if(root && root.isAttached()){
                                editor.detachRoot(name);
                                if(old.parentNode){
                                    old.parentNode.removeChild(old);
                                }
                            }else{
                                continue;
                            }
                        }
                        if( node ){
                            this.added[name] = node;
                            if( !root ){
                                editor.addRoot(name,{ data: this.value[name] || node.innerHTML});
                            }
                        }
                    }
                }
            }
        }

        @Override
        protected render(){
            return <div class="rich-text-multi-root rich-text-editor" style={`width:${this.width};`}
                data-type={this.getEditorName()}
                data-width={this.width} data-height={this.height}>
                <div d:if={!this.toolbar} class="rich-text-toolbar" ref="rich-text-toolbar"></div>
                <div class="ck-editor__main" ref="children">
                    <s:default>
                        <div></div>
                    </s:default>
                </div>
            </div>
        }

        @Main(false)
        static main(){
            Multiroot.builtinPlugins=[
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
                FullScreen
            ];
            Multiroot.defaultConfig = {
                toolbar: {
                    items: [
                        'undo', 'redo',
                        '|', 'heading','fontSize','fontFamily','fontColor','fontBackgroundColor',
                        '|', 'bold', 'italic','Underline','outdent', 'indent','alignment',
                        '|','bulletedList', 'numberedList','blockQuote',
                        '|', 'link', 'insertImage', 'insertTable','mediaEmbed','|','FullScreen'
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
                language: 'zh-cn'
            };
        }

    }


    type RichTextMultirootLayoutValueType = string | Node | (target:RichTextMultiroot)=>Node
}