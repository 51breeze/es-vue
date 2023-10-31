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
                if(focusTracker){
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
            return Array.from(child.childNodes).filter(child=>child.nodeType===1);
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
            return <div class="rich-text-multi-root" style={`width:${this.width};`}>
                <div d:if={!this.toolbar} class="rich-text-toolbar" ref="rich-text-toolbar"></div>
                <div ref="children">
                    <s:default>
                        <div></div>
                    </s:default>
                </div>
            </div>
        }

        @Main
        static main(){
            Multiroot.builtinPlugins=[
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
            ];
            Multiroot.defaultConfig = {
                toolbar: {
                    items: [
                        'undo', 'redo',
                        '|', 'heading','fontSize','fontFamily','fontColor','fontBackgroundColor',
                        '|', 'bold', 'italic','Underline','outdent', 'indent','alignment',
                        '|','bulletedList', 'numberedList',
                        '|', 'link', 'uploadImage', 'insertTable', 'blockQuote', 'mediaEmbed',
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


    type RichTextMultirootLayoutValueType = string | Node | (target:RichTextMultiroot)=>Node
}