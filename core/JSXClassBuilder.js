const Core = require('./Core');
class JSXClassBuilder extends Core.JSXClassBuilder{
    constructor(stack, ctx, type){
        super(stack, ctx, type);
        this.injectProperties = [];
        this.provideProperties = [];
    }

    getReserved(){
        return this.builder.getConfig('reserved') || [];
    }

    createClassMemeberNode(memeberStack){
        var child = super.createClassMemeberNode(memeberStack);
        if( !child.static && child.type==="PropertyDefinition" && child.modifier === "public" && child.kind ==="var" ){  
            const target ={
                get:this.createGetterNode(child.key.value,child.init),
                set:this.createSetterNode(child.key.value),
                modifier:child.modifier,
                isAccessor:true
            }
            target.init = child.init;
            target.key = target.get.key;
            target.kind = 'accessor';
            return target;
        }
        return child;
    }

    createAnnotations(node, memeberStack, isStatic){
        super.createAnnotations(node, memeberStack, isStatic);
        const annotations = memeberStack.annotations;
        if( isStatic || !annotations)return;
        if( !memeberStack.isConstructor && memeberStack.isMethodDefinition ){
            const provider = annotations.find( annotation=>annotation.name.toLowerCase() ==='provider' );
            if( provider ){
                this.provideProperties.push(  this.createAddProviderNode( node.key.value ) );
            }
        }

        if( memeberStack.isMethodSetterDefinition || memeberStack.isPropertyDefinition ){
            const injector = annotations.find( annotation=>annotation.name.toLowerCase() ==='injector' );
            if( injector ){
                const injectorArgs = injector.getArguments();
                const name = node.key.value;
                var from = name;
                if( injectorArgs.length > 0 ){
                    from = injectorArgs[0].value || from;
                }
                this.injectProperties.push( this.createInjectPropertyNode(name, from, node.init || null) ); 
            }
        }
        node.required = annotations.find( annotation=>annotation.name.toLowerCase() ==='required' );
    }

    createInjectPropertyNode(name,from,value){
        const args = [
            this.createLiteralNode(name),
            this.createLiteralNode(from)
        ];

        if( value ){
            args.push( value instanceof Core.Token ? value : this.createLiteralNode(value) );
        }
        return this.createStatementNode(
            this.createCalleeNode(
                this.createMemberNode([
                    this.createThisNode(),
                    this.createIdentifierNode('injectProperty')
                ]),
                args
            )
        );
    }

    createAddProviderNode(name){
        return this.createStatementNode(
            this.createCalleeNode(
                this.createMemberNode([
                    this.createThisNode(),
                    this.createIdentifierNode('addProvider')
                ]),
                [
                    this.createCalleeNode( 
                        this.createMemberNode([
                            this.createThisNode(),
                            this.createIdentifierNode(name),
                            this.createIdentifierNode('bind')
                        ]), 
                        [
                            this.createThisNode()
                        ]
                    )
                ]
            )
        );
    }

    createGetterNode(name, value, required){
        const args = [
            this.createLiteralNode(name)
        ];
        if( value ){
            args.push( this.createChunkNode('void 0', false) )
            args.push( this.createFunctionNode(ctx=>{
                ctx.body=[ctx.createReturnNode(value)]
            }));
        }
        const node = this.createMethodNode(name,ctx=>{
            ctx.body=[
                ctx.createReturnNode( 
                    ctx.createCalleeNode( 
                        ctx.createMemberNode([
                            ctx.createThisNode(),
                            ctx.createIdentifierNode('reactive')
                        ]),
                        args
                    )
                )
            ];
        });
        node.kind = 'get';
        node.isAccessor = true;
        node.required = required;
        return node;
    }

    createSetterNode(name, required){
        const node = this.createMethodNode(name,ctx=>{
            ctx.body=[
                ctx.createStatementNode( 
                    ctx.createCalleeNode( 
                        ctx.createMemberNode([
                            ctx.createThisNode(),
                            ctx.createIdentifierNode('reactive')
                        ]),
                        [
                            this.createLiteralNode(name),
                            this.createIdentifierNode('value')
                        ]
                    )
                )
            ];
        },[ this.createIdentifierNode('value') ]);
        node.kind = 'set';
        node.isAccessor = true;
        node.required = required;
        return node;
    }

    checkConstructMethod(){
        const injectAndProvide = this.injectProperties.concat( this.provideProperties );
        const initBody = [];
        const module = this.module;
        if( injectAndProvide.length > 0 ){
            initBody.push(
                this.createStatementNode(
                    this.createCalleeNode(
                        this.createMemberNode([
                            this.createThisNode(),
                            this.createIdentifierNode('addEventListener')
                        ]),
                        [
                            this.createLiteralNode('onBeforeCreate'),
                            this.createCalleeNode(
                                this.createMemberNode([
                                    this.createParenthesNode(
                                        this.createFunctionNode((ctx)=>{
                                            ctx.body = injectAndProvide;
                                        },[this.createIdentifierNode('e')])
                                    ),
                                    this.createIdentifierNode('bind')
                                ]),
                                [
                                    this.createThisNode()
                                ]
                            )
                        ]
                    )
                )
            );
        }
        
        if( this.construct ){
            initBody.push( 
                this.createStatementNode(
                    this.createCalleeNode(
                        this.createMemberNode([
                            this.createParenthesNode( this.construct ),
                            this.createIdentifierNode('call')
                        ]),
                        [
                            this.createThisNode(),
                            this.createIdentifierNode('options')
                        ]
                    )
                )
            );
        }

        if( initBody.length > 0 ){

            if( !this.construct && this.module.inherit ){
                initBody.push(
                    this.createStatementNode(
                        this.createCalleeNode(
                            this.createMemberNode([
                                this.getModuleReferenceName(this.module.inherit, this.module),
                                this.createIdentifierNode('prototype'),
                                this.createIdentifierNode('_init'),
                                this.createIdentifierNode('call')
                            ]),
                            [
                                this.createThisNode(),
                                this.createIdentifierNode('options')
                            ]
                        )
                    )
                );
            }

            const initMethod = this.createMethodNode('_init',ctx=>{
                    ctx.body = initBody;
                },
                [this.createIdentifierNode('options')]
            );
            initMethod.kind = 'method';
            initMethod.modifier = 'public';
            initMethod.static = false;
            this.members.splice(0,0,initMethod);
        }

        const Component = this.builder.getGlobalModuleById('web.components.Component');
        this.addDepend( Component );
        this.construct = this.createDeclarationNode('const',[
            this.createDeclaratorNode(
                this.createIdentifierNode(module.id),
                this.createCalleeNode(
                    this.createMemberNode([
                        this.createIdentifierNode( this.getModuleReferenceName(Component, module) ),
                        this.createIdentifierNode('createComponent')
                    ]),
                    [
                        this.createOptionNode(module.id)
                    ]
                )
            )
        ]);
    }

    createOptionNode(name){
        const properties = [
            this.createPropertyNode(this.createIdentifierNode('name'), this.createLiteralNode(`es-${name}`) )
        ];
        return this.createObjectNode( properties );
    }

}

module.exports = JSXClassBuilder;