package web.ui;

import web.components.Component;
import ckeditor.core.Editor;
import {debounce} from 'lodash-es';
import {h, markRaw} from 'vue';

@Runtime(client)
class RichEditor extends Component{

    static SAMPLE_READ_ONLY_LOCK_ID = 'Integration Sample';
    static INPUT_EVENT_DEBOUNCE_WAIT = 300;

    tagName:string = 'div';
    value:string = '';
    disableTwoWayDataBinding:boolean=false;
    readonly:boolean = false;
    config:ckeditor.core.EditorConfig = {};
    width:string = 'auto';
    height:string = 'auto';
    className:string = '';

    private _editor:class<Editor>=null;

    get editor():class<Editor>{
        return this._editor;
    }

    set editor(value:class<Editor>){
        this._editor = value;
    }

    protected instance:Editor=null;
    
    private lastEditorData = null;

    @Override
    protected onInitialized():void{
        const { CKEDITOR_VERSION } = window;
		if ( CKEDITOR_VERSION ) {
			const [ major ] = String(CKEDITOR_VERSION).split( '.' ).map( val=>Number(val) );
			if ( major < 37 ) {
				console.warn( 'The <CKEditor> component requires using CKEditor 5 in version 37 or higher.' );
			}
		} else {
			console.warn( 'Cannot find the "CKEDITOR_VERSION" in the "window" scope.' );
		}

        this.watch('value',(value)=>{
			if(this.instance && JSON.stringify(value) !== JSON.stringify(this.lastEditorData)  ) {
                this.instance.data.set(this.formatValue(value))
			}
	    });

        this.watch('readonly',(value)=>{
			if( value ){
				this.instance.enableReadOnlyMode(RichEditor.SAMPLE_READ_ONLY_LOCK_ID);
			}else{
				this.instance.disableReadOnlyMode(RichEditor.SAMPLE_READ_ONLY_LOCK_ID);
			}
		});
    }

    protected formatValue(value){
        return value;
    }

    protected getContent(options?:{[key:string]:string}){
        const editor = this.instance;
        if( editor ){
            return editor.data.get(options)
        }
        return false;
    }

    protected setUpEditorEvents() {
        const editor = this.instance;
        const emitDebouncedInputEvent = debounce( evt => {
            if ( this.disableTwoWayDataBinding ) {
                return;
            }
            const data = this.getContent();
            this.lastEditorData = data
            this.onChanged(data, evt, editor)
            
        }, RichEditor.INPUT_EVENT_DEBOUNCE_WAIT, { leading: true } );

        
        editor.model.document.on( 'change:data', emitDebouncedInputEvent );
        editor.editing.view.document.on( 'focus', evt => {
            this.emit( 'focus', evt, editor );
        });

        editor.editing.view.document.on( 'blur', evt => {
            this.emit( 'blur', evt, editor );
        });
	}

    protected onChanged(data, evt, editor){
        this.emit( 'update:modelValue', data, evt, editor );
        this.emit( 'input', data, evt, editor );
    }

    @Override
    protected onUnmounted():void{
        if ( this.instance ) {
			this.instance.destroy();
			this.instance = null;
		}
		this.emit( 'destroy', this.instance);
    }

    protected getInitData(){
        return this.value;
    }

    @Override
    protected onMounted():void{
        const editorConfig = Object.assign({}, this.config);
        const initValue = this.formatValue(this.getInitData());
		if ( initValue ) {
			editorConfig.initialData = initValue;
		}

		this.editor
        .create(this.getContainer(), editorConfig)
        .then( editor => {

            this.instance = markRaw( editor );
            this.setUpEditorEvents();
            
            if ( JSON.stringify(initValue) !== JSON.stringify(editorConfig.initialData) ) {
                this.instance.data.set( initValue )
            }
            if ( this.readonly ) {
                editor.enableReadOnlyMode( RichEditor.SAMPLE_READ_ONLY_LOCK_ID);
            }
            
            const toolbarContainer = this.getToolbarContainer();
            if(toolbarContainer){
                const toolbar = editor.ui.view.toolbar as {element:HTMLElement};
                if(toolbar){
                    toolbarContainer.appendChild( toolbar.element );
                }
            }

            editor.on('fullscreen', (event, status)=>{
                this.emit('fullscreen', event, editor, status);
            });

            this.emit('ready', editor );
        })
        .catch( error => {
            console.error( error );
        });
        
    }

    protected getToolbarContainer(){
        return this.getRefs('toolbar-container')
    }

    protected getContainer(){
        return this.element;
    }

    @Override
    protected render(){
        const style = `width:${this.width};height:${this.height};`;
        return h( this.tagName, {style, class:this.className} );
    }
}