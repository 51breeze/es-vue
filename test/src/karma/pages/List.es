package karma.pages;

import web.components.Component
import karma.asserts.ListAssert;

import web.ui.Message;
import web.ui.MessageBox;
import web.ui.Notification;
import web.ui.Tree as TreeCom;
import web.ui.Loading;
import karma.components.MyDirective;
import karma.components.DirectiveTop;
import karma.components.Foreach

class List extends Component{

    constructor(props){
        super(props)
    }

    @Override
    onMounted(){
        when( Env(testframework, 'karma') ){
            new ListAssert(this);
        }
    }

    @Reactive
    private items = [
        {name:'zhangshan',phone:'123456',id:1},
        {name:'lisi',phone:'123456',id:2} 
    ];
    

    @Reactive
    private formData={
        select:'CN',
        cities:['Shanghai', 'Beijing', 'Guangzhou', 'Shenzhen'],
        checkedCities:['Shanghai'],
        timeValue:"",
        infiniteCount:0,
        infiniteCount2:0,
        drawer:false,
        transferOptions:[],
        collapseValue:'1',
        datePickerValue:"",
        checkAll:false,
        isIndeterminate:true
    }

    @Reactive
    private showDialog = false;

    @Reactive
    private selectedData:{$index:number,row:{[key:string]:any}, flag:boolean} = {$index:0, row:{}, flag:true};

    getTransferOptions(){
        return [
            {key:1, label:"option 1"},
            {key:2, label:"option 2"},
            {key:3, label:"option 3"}
        ]
    }

    handleCheckAllChange(value:boolean){
        if( value ){
                this.formData.isIndeterminate = false;
                this.formData.checkAll = true;
                this.formData.checkedCities = this.formData.cities.slice(0);
        }else{
                this.formData.checkAll = false;
                this.formData.checkedCities = [];
        }
    }

    handleCommand(obj:[any,boolean]){
        const  [target,flag] = obj;
        this.showDialog = true;
        target.flag = flag;
        this.selectedData = target;
    }

    saveEdit(){
            this.showDialog = false;
            const flag = this.selectedData.flag;
            const row = this.selectedData.row;
            if( flag ){
                const item = this.items.find( item=>row.id ==item.id )
                if( item ){
                    item.name = row.name;
                    item.phone = row.phone;
                    console.log( item )
                    Message.success('Success');
                }else{
                    Message.error('Error');
                }
            }else{
                MessageBox.confirm('确认要删除吗？').then( (res)=>{
                    const index = this.items.findIndex( item=>row.id ==item.id );
                    this.items.splice(index,1);
                    Notification({title:"tips",message:"删除成功"})
                }).catch( res=>{
                    Message.error('Was Cancel');
                });  
            }
    }


    createTree(){
        const props = {
                label: 'name',
                children: 'zones',
        }

        type Tree = {
                name: string
        };

        type _Node = {
                level:number,
                data:{ name:string }
        }

        let count = 1;
        const handleCheckChange = (
                data:Tree,
                checked: boolean,
                indeterminate: boolean
        ) => {
                console.log(data, checked, indeterminate)
        }

        const loadNode = (node: _Node, resolve: (data: Tree[]) => void) => {
                if (node.level === 0) {
                    return resolve([{ name: 'Root1' }, { name: 'Root2' }])
                }
                if (node.level > 3) return resolve([])

                let hasChild = false
                if (node.data.name === 'region1') {
                    hasChild = true
                } else if (node.data.name === 'region2') {
                    hasChild = false
                } else {
                    hasChild = Math.random() > 0.5
                }

                setTimeout(() => {
                    let data: Tree[] = []
                    if (hasChild) {
                            data = [
                            {
                                name: `zone${count++}`,
                            },
                            {
                                name: `zone${count++}`,
                            },
                            ]
                    } else {
                            data = []
                    }

                    resolve(data)
                }, 500)
        }
        return <TreeCom props={props} load = {loadNode} lazy showCheckbox on:checkChange={handleCheckChange}></TreeCom>
    }


    private loadList(){
        console.log('----loadList------', this.formData.infiniteCount )
        this.formData.infiniteCount+=2;
    }

    

    @Override
    render(){

        console.log(  this.formData.infiniteCount , '---------infiniteCount-------------');

        return <div xmlns:d="@directives" xmlns:dc="@directives::custom" xmlns:s="@slots" xmlns:ui="web.ui">
                <ui:Button type="primary" ><ui:Icon><plus /></ui:Icon> button <ui:Icon name="Plus"/> </ui:Button>
                <ui:Table data = {this.items}>
                    <ui:TableColumn prop = "name" label = "姓名"></ui:TableColumn>
                    <ui:TableColumn prop = "phone" label = "手机号"></ui:TableColumn>
                    <ui:TableColumn>
                            <s:header>
                                <span>操作</span>
                            </s:header>
                            <s:default scope="item">
                                <ui:Dropdown on:command={this.handleCommand.bind(this)}>
                                        <span>更多 <i class="el-icon-arrow-down el-icon--right"></i></span>
                                        <ui:DropdownMenu s:dropdown >
                                            <ui:DropdownItem command = {[item,true]}>编辑</ui:DropdownItem>
                                            <ui:DropdownItem command = {[item,false]}>删除</ui:DropdownItem>
                                        </ui:DropdownMenu>
                                </ui:Dropdown>
                            </s:default>
                    </ui:TableColumn>
                </ui:Table>

                <ui:Select bind:value={this.formData.select} size="large">
                    <ui:Option label = "CN" value = "CN"></ui:Option>
                    <ui:Option label = "US" value = "US"></ui:Option>
                </ui:Select>

                <ui:InputNumber></ui:InputNumber>

                <div class="container">
                    <ui:Checkbox bind:value={this.formData.checkAll} indeterminate={this.formData.isIndeterminate} on:change={handleCheckAllChange.bind(this)} />
                </div>
                <ui:CheckboxGroup bind:value={this.formData.checkedCities}>
                    <d:each name={this.formData.cities} item="item">
                            <ui:Checkbox key={item} label={item}>{item}</ui:Checkbox>
                    </d:each>
                </ui:CheckboxGroup>

                {this.createTree()}

                <ui:TimePicker bind:value={this.formData.timeValue}></ui:TimePicker>

                <ui:Timeline>
                    <ui:TimelineItem timestamp = "2023-01-01">
                            Event start
                    </ui:TimelineItem>
                    <ui:TimelineItem timestamp = "2023-05-01">
                            Event end
                    </ui:TimelineItem>
                </ui:Timeline>

                <ui:Cascader options = {[{
                    value: 'guide',
                    label: 'Guide',
                    children: [
                            {
                            value: 'disciplines',
                            label: 'Disciplines',
                            children: [
                            {
                                value: 'consistency',
                                label: 'Consistency',
                            },
                            {
                                value: 'feedback',
                                label: 'Feedback',
                            },
                            {
                                value: 'efficiency',
                                label: 'Efficiency',
                            },
                            {
                                value: 'controllability',
                                label: 'Controllability',
                            },
                            ],
                            },
                            {
                            value: 'navigation',
                            label: 'Navigation',
                            children: [
                            {
                                value: 'side nav',
                                label: 'Side Navigation',
                            },
                            {
                                value: 'top nav',
                                label: 'Top Navigation',
                            },
                            ],
                            },
                    ],
                    }
                ]}></ui:Cascader>

                <ui:ColorPicker value = "#409EFF"></ui:ColorPicker>
                <ui:DatePicker bind:value={this.formData.datePickerValue}></ui:DatePicker>

                <ui:Descriptions title = "User">
                    <ui:DescriptionsItem label = "Description">
                            Description Item
                    </ui:DescriptionsItem>
                </ui:Descriptions>

                <ui:Collapse bind:value={this.formData.collapseValue}>
                    <ui:CollapseItem title = "title 1" name = "1">
                            <div>
                                Consistent with real life: in line with the process and logic of real
                                life, and comply with languages and habits that the users are used to;
                            </div>
                    </ui:CollapseItem>
                    <ui:CollapseItem title = "title 2" name = "2">
                            <div>
                                Operation feedback: enable the users to clearly perceive their
                                operations by style updates and interactive effects;
                            </div>
                    </ui:CollapseItem>
                </ui:Collapse>

                <ui:Empty description = "Not Data"></ui:Empty>

                <ui:Pagination total = {100}></ui:Pagination>

                <ui:Progress percentage = {50}></ui:Progress>
                <ui:Result title = "Success" subTitle="Please follow the instructions">
                    
                    <ui:Button s:extra type = "primary">Back</ui:Button>
                </ui:Result>

                <ui:Skeleton></ui:Skeleton>
                <ui:Skeleton style="--el-skeleton-circle-size: 100px">
                    <s:template>
                            <ui:SkeletonItem variant = "circle"></ui:SkeletonItem>
                    </s:template>
                </ui:Skeleton>

                <ui:Tag>Tag</ui:Tag>

                <ui:Backtop right={20} bottom={100} />

                <ui:PageHeader>
                
                    <ui:Breadcrumb s:breadcrumb separator="/">
                            <ui:BreadcrumbItem to="{ path: '/' }">homepage</ui:BreadcrumbItem>
                            <ui:BreadcrumbItem><a href="/">promotion management</a></ui:BreadcrumbItem>
                            <ui:BreadcrumbItem>promotion list</ui:BreadcrumbItem>
                            <ui:BreadcrumbItem>promotion detail</ui:BreadcrumbItem>
                    </ui:Breadcrumb>
                    <div s:content style="display:flex;align-items: center;">
                            <ui:Avatar
                                class="mr-3"
                                size={32}
                                src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
                            />
                            <span class="text-large font-600 mr-3"> Title </span>
                            <span
                                class="text-sm mr-2"
                                style="color: var(--el-text-color-regular)"
                            >
                                Sub title
                            </span>
                            <ui:Tag>Default</ui:Tag>
                    </div>

                </ui:PageHeader>

                <ui:Menu mode="horizontal">
                    <ui:MenuItem index = "1">A</ui:MenuItem>
                    <ui:MenuSubitem index = "2">
                            <span s:title>B</span>
                            <ui:MenuItem index = "2-1">B-A</ui:MenuItem>
                            <ui:MenuItem index = "2-2">B-B</ui:MenuItem>
                    </ui:MenuSubitem>
                </ui:Menu>

                <ui:Steps>
                    <ui:Step title = "Step 1"></ui:Step>
                    <ui:Step title = "Step 2"></ui:Step>
                </ui:Steps>

                <ui:Tabs>
                    <ui:TabPane label="User" name="first">User</ui:TabPane>
                    <ui:TabPane label="Config" name="second">Config</ui:TabPane>
                    <ui:TabPane label="Role" name="third">Role</ui:TabPane>
                    <ui:TabPane label="Task" name="fourth">Task</ui:TabPane>
                </ui:Tabs>

                <ui:Button type="primary" style="margin-left: 16px" on:click={this.formData.drawer = true}>
                    Open Drawer
                </ui:Button>
                <ui:Drawer
                    bind:value={this.formData.drawer}
                    title="I am the title"
                    direction="rtl"
                >
                    <span>Hi, there!</span>
                </ui:Drawer>

                <ui:Popconfirm title="Are you sure to delete this?">
                    <ui:Button s:reference>Delete</ui:Button>
                </ui:Popconfirm>

                <ui:Popover
                    placement="top-start"
                    title="Title"
                    width={200}
                    trigger="hover"
                    content="this is content, this is content, this is content"
                >
            
                <ui:Button s:reference>Hover to activate</ui:Button>

                </ui:Popover>

                <ui:Tooltip
                    class="box-item"
                    effect="dark"
                    content="Top Left prompts info"
                    placement="top-start"
                    >
                    <ui:Button>top-start</ui:Button>
                </ui:Tooltip>


                <ui:Carousel height={"150px"}>
                    <ui:CarouselItem d:for="item in 4" key={item}>
                            <h3 class="small justify-center" text="2xl">{item}</h3>
                    </ui:CarouselItem >
                </ui:Carousel>

                <ui:Card class="box-card">
                    <div s:header class="card-header">
                            <span>Card name</span>
                            <ui:Button class="button" text>Operation button</ui:Button>
                    </div>
                    <div d:for="o in 4" key={o} class="text item">{ 'List item ' + o }</div>
                </ui:Card> 

                <ui:Badge value = {12}>
                    <ui:Button>comments</ui:Button>
                </ui:Badge>

                <ui:Image src = "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"></ui:Image>

                <ui:Upload action = "http://ww.com">
                    <ui:Button>Click upload</ui:Button>
                </ui:Upload>

                <ui:Calendar></ui:Calendar>

                <ui:Transfer bind:value={this.formData.transferOptions} data = {this.getTransferOptions()}></ui:Transfer>

                
                <ui:InfiniteScroll value = {this.loadList} disabled = {this.formData.infiniteCount > 20} distance={5}>
                    <ul class="infinite-list" style="overflow: auto">
                            <li d:for="i in this.formData.infiniteCount"  key={i} class="infinite-list-item">infinite-scroll {i}</li>
                    </ul>
                </ui:InfiniteScroll>

                <DirectiveTop />

                <Foreach>
                    
                </Foreach>

                <div d:custom={{name:Loading.directive,value:true}}>
                    loadding...
                </div>
                
                <d:custom name={MyDirective} value={true}>
                    <div>MyDirective...</div>
                </d:custom>

                <ui:Dialog bind:value={this.showDialog} title={this.selectedData.flag?"编辑":'删除'} lockScroll = {false}>
                    <d:if condition={this.selectedData.flag}>
                            <ui:Form bind:value={this.selectedData.row}>
                                <ui:FormItem label = "姓名" prop = "name">
                                        <ui:Input bind:value={this.selectedData.row.name}></ui:Input>
                                </ui:FormItem>
                                <ui:FormItem label = "手机" prop = "phone">
                                        <ui:Input bind:value={this.selectedData.row.phone}></ui:Input>
                                </ui:FormItem>
                            </ui:Form>
                    </d:if>
                    <d:else>
                            确定要删除“{this.selectedData.row.name}”吗？
                    </d:else>

                    <ui:RichText></ui:RichText>

                    <div s:footer>
                            <ui:Button on:click={showDialog = false}>取 消</ui:Button>
                            <ui:Button type="primary" on:click={saveEdit.bind(this)}>确 定</ui:Button>
                    </div>
                </ui:Dialog>

        </div>


    }

}


<style type='scss'>
    .infinite-list {
        height: 300px;
        padding: 0;
        margin: 0;
        list-style: none;
    }
    .infinite-list .infinite-list-item {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 50px;
        background: #ccc;
        margin: 10px;
        color: #000;
    }
    .infinite-list .infinite-list-item + .list-item {
        margin-top: 10px;
    }
</style>