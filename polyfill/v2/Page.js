///<references from='web.components.Component'/>
///<namespaces name='web.components' />
function Page(props){
    Component.call(this, props)
}
Page.prototype = Object.create( Component.prototype );
Page.prototype.constructor = Page;