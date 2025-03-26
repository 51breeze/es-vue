package karma.pages.design;
import web.components.Component;
import web.ui.Message;
import web.ui.MessageBox;

@Router('/design/home')
@Metadata('首页布局')
class Home extends Component{

   
    private icons:string[] = []

    @Override
    protected async onInitialized():void{
        await this.loadData();
    }

    @Reactive
    private loaded = false;
    async loadData(){
        const layouts = [
  {
    "key": "text",
    "id": "intro",
    "status": false,
    "index": 0,
    "label": "介绍",
    "children": [
      {
        "index": 0,
        "value": `<p><span style="color:rgb(0,0,0);">EaseScript 是一个脚本编译器，目的是用ES6的语法编译成多个不同目标的脚本语言，来减轻开发者的学习成本和开发速度。它与 typescript 类似，同样具有类型推导来约束代码质量但有着不同的语言特性</span></p>`
      }
    ]
  },
  {
    "key": "action",
    "id": "action",
    "index": 1,
    "label": "功能",
    "status": true,
    "children": [
      {
        "index": 0,
        "value": {
          "icon": "",
          "text": "<p>统一语法，多端运行</p>",
          "desc": "使用插件将代码转换为指定的目标语言，对JS语言增强了OOP的编程方式"
        }
      },
      {
        "value": {
          "icon": "",
          "text": "<p>前后端互通，无需请求配置</p>",
          "desc": "通过引用请求的接口类，使用@Http注解符生成对应的请求代码"
        },
        "index": 1
      },
      {
        "value": {
          "icon": "/_nuxt/assets/icon/pack.svg",
          "text": "<p>按需打包加载资源</p>",
          "desc": "只有使用的组件资源才会被打包"
        },
        "index": 2
      },
      {
        "value": {
          "icon": "/_nuxt/assets/icon/infer.svg",
          "text": `<p><span style="color:#000000;">静态类型推导</span></p>`,
          "desc": "在编写代码时会自动根据表达式推导类型"
        },
        "index": 3
      },
      {
        "value": {
          "icon": "/_nuxt/assets/icon/ide.svg",
          "text": `<p><span style="color:#000000;">VSCode IDE支持</span></p>`,
          "desc": "使用VSCode编辑器提供友好的代码提示"
        },
        "index": 4
      },
      {
        "value": {
          "icon": "/_nuxt/assets/icon/table.svg",
          "text": `<p><span style="color:#000000;">数据表结构</span></p>`,
          "desc": "在代码中直接定义表结构并应用到数据模型上，可以推导出表结构的字段类型。当前仅支持生成MySQL数据表"
        },
        "index": 5
      },
      {
        "value": {
          "icon": "/_nuxt/assets/icon/route.svg",
          "text": `<p><span style="color:#000000;">路由自动生成，无需手动配置</span></p>`,
          "desc": "通过指定页面目录或者使用路由注解符自动生成路由配置"
        },
        "index": 6
      },
      {
        "value": {
          "icon": "/_nuxt/assets/icon/association.svg",
          "text": `<p><span style="color:#000000;">编译宏代码块</span></p>`,
          "desc": "针对不同的语言差异，使用编译宏选择性的构建代码"
        },
        "index": 7
      }
    ]
  },
  {
    "key": "cards",
    "id": "card",
    "index": 2,
    "status": true,
    "label": "卡片",
    "children": [
      {
        "key": "code",
        "index": 0,
        "value": `package pages;
                    import web.components.Component
                    class Person extends Component{
                        @Reactive
                        private message:string = 'Hello, world!'
                    
                        @Override
                        render(){
                        return <div>
                                <span class='red'>{this.message}</span>
                            </div>
                        }
                    }
                    <style lang="scss" scoped>
                        .red{
                        color:red;
                        }
                    </style>`
      },
      {
        "key": "desc",
        "index": 1,
        "value": `<h2 style="text-align:center;"><span style="color:hsl(175,100%,48%);">一个WEB组件/页面</span></h2><p>Web 组件实现了 Vue、Nuxt 的支持并默认集成了Element UI。通过类模块的方式开发Web界面显得更加直观灵活。</p><p>组件的数据响应式是通过 <code>@Reactive</code> 注解符定义，这样可以选择性的声明响应式</p><p>组件中声明的公开属性默认具备响应式</p>`
      }
    ]
  },
  {
    "key": "cards",
    "id": "card",
    "index": 3,
    "label": "卡片",
    "status": true,
    "children": [
      {
        "key": "desc",
        "index": 0,
        "value": `<h2 style="text-align:center;"><span style="color:hsl(175,100%,48%);">一个实现了ThinkPHP的后端接口</span></h2><p>后端目前实现了Php、ThinkPHP，在前端需要与后端进行数据交互时，只需要使用 <code>@Http(api.http.Admin, login, data=data)</code> 来发送HTTP请求，并且可以推导后端数据返回类型</p>`
      },
      {
        "key": "code",
        "index": 1,
        "value": `package api.http;
                    import api.model.User;
                    class Admin extends Base{
                        @Post
                        login(){
                            const {account, password} = this.request.post();
                            const user = new User();
                            const result = user.login(account, password);
                            if( result ){
                                session('userinfo', result);
                                return this.success(result);
                            }
                            return this.error(user.errorMsg, 401);
                        }
                    }`
      }
    ]
  },
  {
    "key": "cards",
    "id": "card",
    "index": 4,
    "label": "卡片",
    "status": true,
    "children": [
      {
        "key": "code",
        "index": 0,
        "value": `package api.table;struct table User{
                id: int(11) auto_increment,
                account: varchar(16),
                password: varchar(32),
                create_at:int(11),
                status:int(6),
                PRIMARY KEY(id)
                }`
      },
      {
        "key": "desc",
        "index": 1,
        "value": `<h2 style="text-align:center;"><span style="color:hsl(175,100%,48%);">定义数据表结构</span></h2><p>通过声明表结构类型，可以增强对数据模型的类型推导。在构建代码时会根据表的引用生成相关的SQL表结构</p>`
      }
    ]
  }
];
        this.dataLayouts = layouts;
    }

    @Reactive
    private data={layout:[], dataset:{text:'', code:'', result:'',intro:''}}

    private updateLayout(handle:HTMLElement, newIndex:number, oldIndex:number){
        const id = handle.getAttribute('data-id');
        const fetchObject = (items:string[])=>{
            if(items.length < 2){
                return this.dataLayouts;
            }
            let category = items.shift();
            let at = category.indexOf('[');
            let index = '';
            if(at>0){
                index = category.slice(at+1, -1);
                category = category.substring(0, at);
            }
            let target = this.dataLayouts.find( item=>item.id === category && (!index || item.index==index));
            let key = null;
            while(target && (key=items.shift()) ){
                target = target[key] as any;
            }
            return target;
        }
        if(id){
            const data = fetchObject(id.split('.'));
            if( data is Array ){
                const old = data.find(item=>item.index==newIndex);
                const current = data.find( item=>item.index==oldIndex);
                old.index = oldIndex
                current.index = newIndex
            }
        }
    }

    onSortableChange(event:{item:any, newIndex:number, oldIndex:number}){
        const handle = event.item;
        const newIndex = event.newIndex
        const oldIndex = event.oldIndex
        this.updateLayout(handle, newIndex, oldIndex)
    }

    private sortableInstances:Map<HTMLElement, {destroy:()=>void}> = new Map()


    @Reactive
    private dataLayouts= []

    private defaultLayouts=[
        {key:'text', id:'intro', status:true, index:0, label:'介绍', children:[
            {index:0, value:""},
        ]},
        {key:'action', id:'action', status:true, index:1, label:'功能', children:[
            {index:0, value:""},
        ]},
        {key:'examples', id:"example",status:true,  index:2, label:"示例", children:[
            {key:'code', index:0, value:""},
            {key:'result',index:1, value:""},
        ]},
        {key:'cards', id:"card", index:3,status:true,  label:"卡片", children:[
            {key:'code', index:0, value:""},
            {key:'desc', index:1, value:""},
        ]},
    ]

    handleCommand(data:{key:string,id:string,index:number,label:string}, command:string){

        let maxIndex:number = this.dataLayouts.length + 1

        const mapKey = {
            'intro':'text',
            'example':'examples',
            'card':'cards',
            'action':'action',
        }

        const mapLabel = {
            'intro':'介绍',
            'example':'示例',
            'card':'卡片',
            'action':'功能',
        }

        let item = {
            key:mapKey[command],
            id:command,
            index:maxIndex+1,
            label:mapLabel[command],
            status:true,
            children:[]
        }

        if( item.key ==='action'){
            item.children.push({index:0, value:{icon:'', text:'', desc:''}});
        }else if( item.key ==='text'){
            item.children.push({index:0, value:""});
        }
        else{
            item.children.push({
                    key:'code',
                    index:0,
                    value:""
            });
            if( item.key ==='examples' ){
                item.children.push({
                    key:'result',
                    index:1,
                    value:""
                });
            }else{
                item.children.push({
                    key:'desc',
                    index:1,
                    value:""
                });
            }
        }

        const at = this.dataLayouts.findIndex( item=>item.index == data.index );

        this.dataLayouts.splice(at+1, 0, item);
        this.dataLayouts.forEach( (item,index)=>{
            item.index = index;
        })
    }

    onRemoveBlock(data){
        MessageBox.confirm('确认需要删除吗？', '提示',{
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then( res=>{
            if(res === 'confirm'){
                const at = this.dataLayouts.findIndex( item=>item.index == data.index );
                if(at>=0){
                    this.dataLayouts.splice(at, 1);
                    this.dataLayouts.forEach( (item,index)=>{
                        item.index = index
                    })
                }
            }
        }).catch(()=>null);
    }

    onBlockStatus(data:{status}){
        data.status = !data.status;
        this.forceUpdate();
    }

    createLayoutUi(layouts:{key:string, id:string, children:any[]}[]){

        type ItemType = {key?:string, id?:string, label?:string, status?:boolean, index?:number, value:string | Record, children?:ItemType[]};

        const createTitle=(data:ItemType)=>{
            return <div class="title title-header drag-vertical" xmlns:ui="web.ui">
                <span>{data.label}</span>
                <div class="operation">
                    <ui:Button class="delete" type="danger" text={true} on:click={onRemoveBlock(data)} ><ui:Icon slot:icon name="Delete" /> 删除</ui:Button>
                    <ui:Button text={true} type="danger" on:click={onBlockStatus(data)} ><ui:Icon slot:icon name="View" />{data.status ? '禁用' : '开启'}</ui:Button>
                     <ui:Button  type="primary" class="title-btn"  text={true} on:click={handleCommand(data, 'intro')} ><ui:Icon slot:icon name="Plus" /> 添加</ui:Button>
                    
                </div>
            </div>
        }

        const createActionTitle=(data:ItemType, child:ItemType)=>{
            const remove=()=>{
                const index = data.children.indexOf(child);
                if(index>=0){
                    data.children.splice(index,1);
                    data.children.forEach( (item,index)=>item.index=index);
                }
            }
            const add = ()=>{
                data.children.push({value:{icon:"", text:"", desc:""}});
                data.children.forEach( (item,index)=>item.index=index);
            }
            const setStatus=()=>{
                child.status=!child.status;
            }

            return <div class="title title-header drag-horizontal operation" xmlns:ui="web.ui">
                <ui:Button text={true}  type="danger"  on:click={remove} ><ui:Icon slot:icon name="Delete" /> 删除</ui:Button>
                <ui:Button text={true}  type="danger"  on:click={setStatus} ><ui:Icon slot:icon name="View" />{child.status ? '禁用' : '开启'}</ui:Button>
                <ui:Button text={true} type="primary" class="action-btn"  on:click={add} ><ui:Icon slot:icon name="Plus" /> 添加</ui:Button>
            </div>
        }

        const layoutFactory={
            examples:(data:ItemType, index)=>{
                return <div class="block examples" key={"examples-"+index} xmlns:local="components" xmlns:ui="web.ui"  data-id={`example[${index}]`}>
                    {
                        createTitle(data)
                    }
                    <div class="content" refs="dragContainer" >
                        <d:each name="data.children" item="item" key="index">
                            <div d:if={item.key==='code'} class="examples-code drag-horizontal" data-id={`example[${index}].children`}>
                                <local:CodeEditor b:code={item.value as string} ></local:CodeEditor>
                            </div>
                            <div d:elseif={item.key==='result'} class="examples-result drag-horizontal" data-id={`example[${index}].children`}>
                                <ui:RichTextBalloon b:value={item.value as string} height="100%" width={"auto"}></ui:RichTextBalloon>
                            </div>
                        </d:each>
                    </div>
                </div>
            },
            text:(data:ItemType, index)=>{
                return <div class="text"  key={"text-"+index} xmlns:ui="web.ui" data-id={`intro[${index}]`}>
                    {
                        createTitle(data)
                    }
                    <div class="content">
                        <web.ui.RichTextBalloon d:each="item in data.children" b:value={item.value as string} height="auto" width={"auto"}></web.ui.RichTextBalloon>
                    </div>
                </div>
            },
            cards:(data:ItemType, index)=>{
                return <div class="block cards "  key={"cards-"+index}   xmlns:ui="web.ui" data-id={`card[${index}]`}>
                    {
                        createTitle(data)
                    }
                    <div class="content" refs="dragContainer" data-id={index}>
                        <d:each name="data.children" item="item">
                            <div d:if={item.key==='code'} class="card-code drag-horizontal" data-id={`card[${index}].children`}>
                                {item.value}
                            </div>
                            <div d:elseif={item.key==='desc'}  class="card-desc drag-horizontal" data-id={`card[${index}].children`}>
                                <web.ui.RichTextBalloon b:value={item.value as string} height="100%" width={"auto"}></web.ui.RichTextBalloon>
                            </div>
                        </d:each>
                    </div>
                </div>
            },
            action:(data:ItemType, index)=>{
                const setIcon = (obj:{icon:string}, value:string)=>obj.icon=value;
                return <div class="block cards" key={"action-"+index}  xmlns:ui="web.ui" data-id={`action[${index}]`}>
                    {
                        createTitle(data)
                    }
                    <div class="actions" refs="dragContainer">
                        
                        <d:each name="data.children" item="item" key="index">
                            <div data-id={`action[${index}].children`} ref="daa">
                                {
                                    createActionTitle(data, item as ItemType)
                                }
                                <ui:Form b:value={item.value}>
                                    <ui:FormItem prop="icon" label="图标：">
                                        <div class="select-icon">
                                            <img d:if={(item.value as {icon:string}).icon} src={(item.value as {icon:string}).icon}/>
                                            <ui:Popover placement="right" title="选择图标" trigger="click" width={300}>
                                                <ui:Button slot:reference>选择</ui:Button>
                                                <ul class="icon-list">
                                                    <li d:each="(icon) in icons" on:click={setIcon(item.value as any, icon)} class={icon===(item.value as Record).icon?'active':''} ><img src={icon} /></li>
                                                </ul>
                                            </ui:Popover>
                                        </div>
                                    </ui:FormItem>
                                    <ui:FormItem prop="text" label="文本：">
                                        <div style="width:100%; border:solid 1px #ccc; border-radius:3px;">
                                            <web.ui.RichTextBalloon b:value={(item.value as {text:string}).text} height="100%" width={"auto"}></web.ui.RichTextBalloon>
                                        </div>
                                    </ui:FormItem>
                                    <ui:FormItem prop="desc" label="描述：">
                                        <ui:Input type="textarea" b:value={(item.value as {desc:string}).desc}></ui:Input>
                                    </ui:FormItem>
                                </ui:Form>
                            </div>
                        </d:each>
                       
                    </div>
                </div>
            }
        }

        // return <div><d:each name="layouts" item="child" key="index">
        //     {layoutFactory[child.key](child as ItemType, index)}
        // </d:each></div>

        return layouts.map( (child:ItemType,index)=>{
            return layoutFactory[child.key](child, child.index);
        })
    }

    @Override
    protected onMounted():void{
        console.log(this.getRefs('daa'))
    }

    @Reactive
    private dis = true;

    @Override
    protected render(){
        return <div xmlns:local="components" xmlns:d="@directives" xmlns:s="@slots" xmlns:ui="web.ui" class="design-home">
            <div class="layout" ref="layout">
                {this.createLayoutUi(this.dataLayouts)}
            </div>
            <div class="footer">
                <ui:Button type="primary" class="footer-btn">提交</ui:Button>
            </div>
        </div>
    }

}

<style type="scss" scoped>
    .design-home{
        box-sizing: border-box;
        > .intro{
            border: dashed 1px #dedede;
            padding: 20px;
            margin: 3px;
        }
        > .layout{
            > div{
                border: dashed 1px #dedede;
                padding: 20px;
                margin: 3px;
            }

            > .text{
                > .title{
                    margin-bottom: 8px;
                    display: flex;
                    justify-content: space-between;
                }
            }

            > .block{
                > .title{
                    margin-bottom: 8px;
                    display: flex;
                    justify-content: space-between;
                }
                > .content{
                    display: flex;
                    justify-content: space-between;
                    > div{
                        width: 50%;
                        margin: 3px;
                        border: dashed 1px #dedede;
                        padding: 20px;
                    }
                }
                > .actions{
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    > div{
                        margin: 3px;
                        border: dashed 1px #dedede;
                        padding: 20px;

                        .select-icon{
                            display: flex;
                            align-items: center;
                            > img{
                                padding: 6px;
                                border: 1px solid #ccc;
                                margin-right: 8px;
                                width: 24px;
                            }
                        }

                    }
                }
            }
        }

        > .footer{
            text-align: center;
        }

        .operation{
            text-align: right;
            .el-button{
                &.is-text{
                    padding: 0 3px;
                    margin: 0 8px 0 0;
                }
            }
        }

        .title-header{
            border-bottom: solid 1px rgb(230, 230, 230);
            margin-bottom: 12px;
        }


    }

    .icon-list{
                                
        list-style: none;
        padding: 12px;
        margin: 0;
        display: flex;
        width: 300px;
        flex-wrap: wrap;
        box-sizing: border-box;
        > li{
            padding: 4px;
            margin: 4px;
            display: flex; 
            border: solid 1px #ccc;
            cursor: pointer;
            &:hover{
                border: solid 1px rgb(22, 174, 255);
            }
            &.active{
                border: solid 1px rgb(22, 174, 255);
            }
        }
        
    }

</style>
