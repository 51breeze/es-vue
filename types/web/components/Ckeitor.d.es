package web.components;

import web.components.Component;
import ckeditor.core.Editor;
import {debounce} from 'lodash-es';
import {h, markRaw} from 'vue';

@Runtime(client)
class Ckeitor extends Component{

    static SAMPLE_READ_ONLY_LOCK_ID = 'Integration Sample';
    static INPUT_EVENT_DEBOUNCE_WAIT = 300;

    tagName:string = 'div';
    value:string = '';
    disableTwoWayDataBinding:boolean=false;
    readonly:boolean = false;
    config:ckeditor.core.EditorConfig = {};

    protected get editor():class<Editor>{
        return null;
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
			if(this.instance && value !== this.lastEditorData ) {
				this.instance.data.set( value );
			}
	    });
        this.watch('readonly',(value)=>{
			if( value ){
				this.instance.enableReadOnlyMode(Ckeitor.SAMPLE_READ_ONLY_LOCK_ID);
			}else{
				this.instance.disableReadOnlyMode(Ckeitor.SAMPLE_READ_ONLY_LOCK_ID);
			}
		});
    }

    protected setUpEditorEvents() {
        const editor = this.instance;
        const emitDebouncedInputEvent = debounce( evt => {
            if ( this.disableTwoWayDataBinding ) {
                return;
            }
            const data = this.lastEditorData = editor.data.get();
            this.emit( 'update:modelValue', data, evt, editor );
            this.emit( 'input', data, evt, editor );
        }, Ckeitor.INPUT_EVENT_DEBOUNCE_WAIT, { leading: true } );

        
        editor.model.document.on( 'change:data', emitDebouncedInputEvent );
        editor.editing.view.document.on( 'focus', evt => {
            this.emit( 'focus', evt, editor );
        });

        editor.editing.view.document.on( 'blur', evt => {
            this.emit( 'blur', evt, editor );
        });
	}

    @Override
    protected onUnmounted():void{
        if ( this.instance ) {
			this.instance.destroy();
			this.instance = null;
		}
		this.emit( 'destroy', this.instance);
    }

    @Override
    protected onMounted():void{
        const editorConfig = Object.assign({}, this.config);
		if ( this.value ) {
			editorConfig.initialData = this.value;
		}
		this.editor
        .create(this.element, editorConfig)
        .then( editor => {
            this.instance = markRaw( editor );
            this.setUpEditorEvents();
            if ( this.value !== editorConfig.initialData ) {
                editor.data.set( this.value );
            }
            if ( this.readonly ) {
                editor.enableReadOnlyMode( Ckeitor.SAMPLE_READ_ONLY_LOCK_ID);
            }
            this.emit('ready', editor );
        } )
        .catch( error => {
            console.error( error );
        });
    }

    @Override
    protected render(){
        return h( this.tagName );
    }
}