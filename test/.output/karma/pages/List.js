import "element-plus/lib/components/loading/style/css";
import "element-plus/lib/components/notification/style/css";
import "element-plus/lib/components/message-box/style/css";
import "element-plus/lib/components/message/style/css";
import "./../../asstes/karma/pages/List-52102aa4.js";
import Class from "./../../Class.js";
import {withCtx,withDirectives} from "vue";
import Component from "./../../web/components/Component.js";
import Reflect from "./../../Reflect.js";
import Message from "element-plus/lib/components/message";
import MessageBox from "element-plus/lib/components/message-box";
import Notification from "element-plus/lib/components/notification";
import System from "./../../System.js";
import Loading from "element-plus/lib/components/loading";
import MyDirective from "./../components/MyDirective.js";
const _private = Class.getKeySymbols("16bb4f81");
function List(props){
    Component.call(this,props);
    Object.defineProperty(this,_private,{
        value:{
            items:[{
                name:'zhangshan',
                phone:'123456',
                id:1
            },{
                name:'lisi',
                phone:'123456',
                id:2
            }],
            formData:{
                select:'CN',
                cities:['Shanghai','Beijing','Guangzhou','Shenzhen'],
                checkedCities:['Shanghai'],
                timeValue:"",
                infiniteCount:0,
                infiniteCount2:0,
                drawer:false,
                page:3,
                transferOptions:[],
                collapseValue:'1',
                datePickerValue:"",
                checkAll:false,
                isIndeterminate:true
            },
            showDialog:false,
            selectedData:{
                $index:0,
                row:{},
                flag:true
            }
        }
    });
}
Class.creator(List,{
    m:513,
    ns:"karma.pages",
    name:"List",
    private:_private,
    inherit:Component,
    members:{
        onMounted:{
            m:544,
            value:function onMounted(){}
        },
        items:{
            m:2056,
            writable:true
        },
        formData:{
            m:2056,
            writable:true
        },
        showDialog:{
            m:2056,
            writable:true
        },
        selectedData:{
            m:2056,
            writable:true
        },
        getTransferOptions:{
            m:544,
            value:function getTransferOptions(){
                return [{
                    key:1,
                    label:"option 1"
                },{
                    key:2,
                    label:"option 2"
                },{
                    key:3,
                    label:"option 3"
                }];
            }
        },
        handleCheckAllChange:{
            m:544,
            value:function handleCheckAllChange(value){
                if(value){
                    this[_private].formData.isIndeterminate=false;
                    this[_private].formData.checkAll=true;
                    this[_private].formData.checkedCities=this[_private].formData.cities.slice(0);
                }else{
                    this[_private].formData.checkAll=false;
                    this[_private].formData.checkedCities=[];
                }
            }
        },
        handleCommand:{
            m:544,
            value:function handleCommand(obj){
                const [target,flag] = obj;
                this[_private].showDialog=true;
                Reflect.set(List,target,"flag",flag);
                this[_private].selectedData=target;
            }
        },
        saveEdit:{
            m:544,
            value:function saveEdit(){
                this[_private].showDialog=false;
                const flag = this[_private].selectedData.flag;
                const row = this[_private].selectedData.row;
                if(flag){
                    const item = this[_private].items.find((item)=>row.id == item.id);
                    if(item){
                        item.name=row.name;
                        item.phone=row.phone;
                        console.log(item);
                        Message.success('Success');
                    }else{
                        Message.error('Error');
                    }
                }else{
                    MessageBox.confirm('确认要删除吗？').then((res)=>{
                        const index = this[_private].items.findIndex((item)=>row.id == item.id);
                        this[_private].items.splice(index,1);
                        Notification({
                            title:"tips",
                            message:"删除成功"
                        });
                    }).catch((res)=>{
                        Message.error('Was Cancel');
                    });
                }
            }
        },
        createTree:{
            m:544,
            value:function createTree(){
                const props = {
                    label:'name',
                    children:'zones'
                }
                let count = 1;
                const handleCheckChange = (data,checked,indeterminate)=>{
                    console.log(data,checked,indeterminate);
                }
                const loadNode = (node,resolve)=>{
                    if(node.level === 0){
                        return resolve([{
                            name:'Root1'
                        },{
                            name:'Root2'
                        }]);
                    }
                    if(node.level > 3)
                    return resolve([]);
                    let hasChild = false;
                    if(node.data.name === 'region1'){
                        hasChild=true;
                    }else 
                    if(node.data.name === 'region2'){
                        hasChild=false;
                    }else{
                        hasChild=Math.random() > 0.5;
                    }
                    setTimeout(()=>{
                        let data = [];
                        if(hasChild){
                            data=[{
                                name:`zone${count++}`
                            },{
                                name:`zone${count++}`
                            }];
                        }else{
                            data=[];
                        }
                        resolve(data);
                    },500);
                }
                return createVNode(TreeCom,{
                    lazy:true,
                    props:props,
                    load:loadNode,
                    showCheckbox:true,
                    onCheckChange:handleCheckChange
                });
            }
        },
        loadList:{
            m:2080,
            value:function loadList(){
                console.log('----loadList------',this[_private].formData.infiniteCount);
                this[_private].formData.infiniteCount+=2;
            }
        },
        render:{
            m:544,
            value:function render(){
                console.log(this[_private].formData.infiniteCount,'---------infiniteCount-------------');
                return createVNode("div",null,[
                    createVNode(Button,{
                        type:"primary"
                    },{
                        default:withCtx(()=>[
                            createVNode(Icon,null,{
                                default:withCtx(()=>[
                                    createVNode("plus")
                                ])
                            }),
                            "button ",
                            createVNode(Icon,{
                                name:"Plus"
                            })
                        ])
                    })
                ].concat(
                    createVNode(Table,{
                        data:this[_private].items
                    },{
                        default:withCtx(()=>[
                            createVNode(TableColumn,{
                                prop:"name",
                                label:"姓名"
                            }),
                            createVNode(TableColumn,{
                                prop:"phone",
                                label:"手机号"
                            }),
                            createVNode(TableColumn,null,{
                                header:withCtx(()=>[
                                    createVNode("span",null,["操作"])
                                ]),
                                default:withCtx((item={})=>[
                                    createVNode(Dropdown,{
                                        onCommand:this.handleCommand.bind(this)
                                    },{
                                        default:withCtx(()=>[
                                            createVNode("span",null,[
                                                "更多 ",
                                                createVNode("i",{
                                                    class:"el-icon-arrow-down el-icon--right"
                                                })
                                            ])
                                        ]),
                                        dropdown:()=>[createVNode(DropdownMenu,null,{
                                            default:withCtx(()=>[
                                                createVNode(DropdownItem,{
                                                    command:[item,true]
                                                },{
                                                    default:withCtx(()=>["编辑"])
                                                }),
                                                createVNode(DropdownItem,{
                                                    command:[item,false]
                                                },{
                                                    default:withCtx(()=>["删除"])
                                                })
                                            ])
                                        })]
                                    })
                                ])
                            })
                        ])
                    }),
                    createVNode(Select,{
                        modelValue:this[_private].formData.select,
                        size:"large",
                        "onUpdate:modelValue":(e)=>this[_private].formData.select=e
                    },{
                        default:withCtx(()=>[
                            createVNode(Option,{
                                label:"CN",
                                value:"CN"
                            }),
                            createVNode(Option,{
                                label:"US",
                                value:"US"
                            })
                        ])
                    }),
                    createVNode(InputNumber),
                    createVNode("div",{
                        class:"container"
                    },[
                        createVNode(Checkbox,{
                            value:this[_private].formData.checkAll,
                            modelValue:this[_private].formData.checkAll,
                            indeterminate:this[_private].formData.isIndeterminate,
                            "onUpdate:modelValue":(e)=>this[_private].formData.checkAll=e,
                            onChange:this.handleCheckAllChange.bind(this)
                        })
                    ]),
                    createVNode(CheckboxGroup,{
                        modelValue:this[_private].formData.checkedCities,
                        "onUpdate:modelValue":(e)=>this[_private].formData.checkedCities=e
                    },{
                        default:withCtx(()=>this[_private].formData.cities.map((item,key)=>createVNode(Checkbox,{
                            label:item,
                            key:item
                        },{
                            default:withCtx(()=>[item])
                        })))
                    }),
                    this.createTree(),
                    createVNode(TimePicker,{
                        modelValue:this[_private].formData.timeValue,
                        "onUpdate:modelValue":(e)=>this[_private].formData.timeValue=e
                    }),
                    createVNode(Timeline,null,{
                        default:withCtx(()=>[
                            createVNode(TimelineItem,{
                                timestamp:"2023-01-01"
                            },{
                                default:withCtx(()=>["Event start "])
                            }),
                            createVNode(TimelineItem,{
                                timestamp:"2023-05-01"
                            },{
                                default:withCtx(()=>["Event end "])
                            })
                        ])
                    }),
                    createVNode(Cascader,{
                        options:[{
                            value:'guide',
                            label:'Guide',
                            children:[{
                                value:'disciplines',
                                label:'Disciplines',
                                children:[{
                                    value:'consistency',
                                    label:'Consistency'
                                },{
                                    value:'feedback',
                                    label:'Feedback'
                                },{
                                    value:'efficiency',
                                    label:'Efficiency'
                                },{
                                    value:'controllability',
                                    label:'Controllability'
                                }]
                            },{
                                value:'navigation',
                                label:'Navigation',
                                children:[{
                                    value:'side nav',
                                    label:'Side Navigation'
                                },{
                                    value:'top nav',
                                    label:'Top Navigation'
                                }]
                            }]
                        }]
                    }),
                    createVNode(ColorPicker,{
                        modelValue:"#409EFF"
                    }),
                    createVNode(DatePicker,{
                        modelValue:this[_private].formData.datePickerValue,
                        "onUpdate:modelValue":(e)=>this[_private].formData.datePickerValue=e
                    }),
                    createVNode(Descriptions,{
                        title:"User"
                    },{
                        default:withCtx(()=>[
                            createVNode(DescriptionsItem,{
                                label:"Description"
                            },{
                                default:withCtx(()=>["Description Item "])
                            })
                        ])
                    }),
                    createVNode(Collapse,{
                        value:this[_private].formData.collapseValue,
                        modelValue:this[_private].formData.collapseValue,
                        "onUpdate:modelValue":(e)=>this[_private].formData.collapseValue=e
                    },{
                        default:withCtx(()=>[
                            createVNode(CollapseItem,{
                                title:"title 1",
                                name:"1"
                            },{
                                default:withCtx(()=>[
                                    createVNode("div",null,["Consistent with real life: in line with the process and logic of real life, and comply with languages and habits that the users are used to; "])
                                ])
                            }),
                            createVNode(CollapseItem,{
                                title:"title 2",
                                name:"2"
                            },{
                                default:withCtx(()=>[
                                    createVNode("div",null,["Operation feedback: enable the users to clearly perceive their operations by style updates and interactive effects; "])
                                ])
                            })
                        ])
                    }),
                    createVNode(Empty,{
                        description:"Not Data"
                    }),
                    createVNode(Pagination,{
                        total:100
                    }),
                    createVNode(Progress,{
                        percentage:50
                    }),
                    createVNode(Result,{
                        title:"Success",
                        subTitle:"Please follow the instructions"
                    },{
                        extra:()=>[createVNode(Button,{
                            type:"primary"
                        },{
                            default:withCtx(()=>["Back"])
                        })]
                    }),
                    createVNode(Skeleton),
                    createVNode(Skeleton,{
                        style:"--el-skeleton-circle-size: 100px"
                    },{
                        template:withCtx(()=>[
                            createVNode(SkeletonItem,{
                                variant:"circle"
                            })
                        ])
                    }),
                    createVNode(Tag,null,{
                        default:withCtx(()=>["Tag"])
                    }),
                    createVNode(Backtop,{
                        right:20,
                        bottom:100
                    }),
                    createVNode(PageHeader,null,{
                        breadcrumb:()=>[createVNode(Breadcrumb,{
                            separator:"/"
                        },{
                            default:withCtx(()=>[
                                createVNode(BreadcrumbItem,{
                                    to:"{ path: '/' }"
                                },{
                                    default:withCtx(()=>["homepage"])
                                }),
                                createVNode(BreadcrumbItem,null,{
                                    default:withCtx(()=>[
                                        createVNode("a",{
                                            href:"/"
                                        },["promotion management"])
                                    ])
                                }),
                                createVNode(BreadcrumbItem,null,{
                                    default:withCtx(()=>["promotion list"])
                                }),
                                createVNode(BreadcrumbItem,null,{
                                    default:withCtx(()=>["promotion detail"])
                                })
                            ])
                        })],
                        content:()=>[createVNode("div",{
                            style:"display:flex;align-items: center;"
                        },[
                            createVNode(Avatar,{
                                size:32,
                                src:"https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
                                class:"mr-3"
                            }),
                            createVNode("span",{
                                class:"text-large font-600 mr-3"
                            },["Title "]),
                            createVNode("span",{
                                class:"text-sm mr-2",
                                style:"color: var(--el-text-color-regular)"
                            },["Sub title "]),
                            createVNode(Tag,null,{
                                default:withCtx(()=>["Default"])
                            })
                        ])]
                    }),
                    createVNode(Menu,{
                        mode:"horizontal"
                    },{
                        default:withCtx(()=>[
                            createVNode(MenuItem,{
                                index:"1"
                            },{
                                default:withCtx(()=>["A"])
                            }),
                            createVNode(MenuSubitem,{
                                index:"2"
                            },{
                                default:withCtx(()=>[
                                    createVNode(MenuItem,{
                                        index:"2-1"
                                    },{
                                        default:withCtx(()=>["B-A"])
                                    }),
                                    createVNode(MenuItem,{
                                        index:"2-2"
                                    },{
                                        default:withCtx(()=>["B-B"])
                                    })
                                ]),
                                title:()=>[createVNode("span",null,["B"])]
                            })
                        ])
                    }),
                    createVNode(Steps,null,{
                        default:withCtx(()=>[
                            createVNode(Step,{
                                title:"Step 1"
                            }),
                            createVNode(Step,{
                                title:"Step 2"
                            })
                        ])
                    }),
                    createVNode(Tabs,null,{
                        default:withCtx(()=>[
                            createVNode(TabPane,{
                                label:"User",
                                name:"first"
                            },{
                                default:withCtx(()=>["User"])
                            }),
                            createVNode(TabPane,{
                                label:"Config",
                                name:"second"
                            },{
                                default:withCtx(()=>["Config"])
                            }),
                            createVNode(TabPane,{
                                label:"Role",
                                name:"third"
                            },{
                                default:withCtx(()=>["Role"])
                            }),
                            createVNode(TabPane,{
                                label:"Task",
                                name:"fourth"
                            },{
                                default:withCtx(()=>["Task"])
                            })
                        ])
                    }),
                    createVNode(Button,{
                        type:"primary",
                        style:"margin-left: 16px",
                        onClick:()=>this[_private].formData.drawer=true
                    },{
                        default:withCtx(()=>["Open Drawer "])
                    }),
                    createVNode(Drawer,{
                        value:this[_private].formData.drawer,
                        modelValue:this[_private].formData.drawer,
                        title:"I am the title",
                        direction:"rtl",
                        "onUpdate:modelValue":(e)=>this[_private].formData.drawer=e
                    },{
                        default:withCtx(()=>[
                            createVNode("span",null,["Hi, there!"])
                        ])
                    }),
                    createVNode(Popconfirm,{
                        title:"Are you sure to delete this?"
                    },{
                        reference:()=>[createVNode(Button,null,{
                            default:withCtx(()=>["Delete"])
                        })]
                    }),
                    createVNode(Popover,{
                        placement:"top-start",
                        title:"Title",
                        width:200,
                        trigger:"hover",
                        content:"this is content, this is content, this is content"
                    },{
                        reference:()=>[createVNode(Button,null,{
                            default:withCtx(()=>["Hover to activate"])
                        })]
                    }),
                    createVNode(Tooltip,{
                        effect:"dark",
                        content:"Top Left prompts info",
                        placement:"top-start",
                        class:"box-item"
                    },{
                        default:withCtx(()=>[
                            createVNode(Button,null,{
                                default:withCtx(()=>["top-start"])
                            })
                        ])
                    }),
                    createVNode(Carousel,{
                        height:"150px"
                    },{
                        default:withCtx(()=>System.forMap(4,(item,key)=>createVNode(CarouselItem,{
                            key:item
                        },{
                            default:withCtx(()=>[
                                createVNode("h3",{
                                    text:"2xl",
                                    class:"small justify-center"
                                },[item])
                            ])
                        })))
                    }),
                    createVNode(Card,{
                        class:"box-card"
                    },{
                        default:withCtx(()=>System.forMap(4,(o,key)=>createVNode("div",{
                            key:o,
                            class:"text item"
                        },[
                            'List item ' + o
                        ]))),
                        header:()=>[createVNode("div",{
                            class:"card-header"
                        },[
                            createVNode("span",null,["Card name"]),
                            createVNode(Button,{
                                text:true,
                                class:"button"
                            },{
                                default:withCtx(()=>["Operation button"])
                            })
                        ])]
                    }),
                    createVNode(Badge,{
                        value:12
                    },{
                        default:withCtx(()=>[
                            createVNode(Button,null,{
                                default:withCtx(()=>["comments"])
                            })
                        ])
                    }),
                    createVNode(Image,{
                        src:"https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
                    }),
                    createVNode(Upload,{
                        action:"http://ww.com"
                    },{
                        default:withCtx(()=>[
                            createVNode(Button,null,{
                                default:withCtx(()=>["Click upload"])
                            })
                        ])
                    }),
                    createVNode(Calendar),
                    createVNode(Transfer,{
                        modelValue:this[_private].formData.transferOptions,
                        data:this.getTransferOptions(),
                        "onUpdate:modelValue":(e)=>this[_private].formData.transferOptions=e
                    }),
                    createVNode(InfiniteScroll,{
                        value:this.loadList.bind(this),
                        "infinite-scroll-disabled":this[_private].formData.infiniteCount > 20,
                        "infinite-scroll-distance":5
                    },{
                        default:withCtx(()=>[
                            createVNode("ul",{
                                class:"infinite-list",
                                style:"overflow: auto"
                            },System.forMap(this[_private].formData.infiniteCount,(i,key)=>createVNode("li",{
                                key:i,
                                class:"infinite-list-item"
                            },[
                                "infinite-scroll ",
                                i
                            ])))
                        ])
                    }),
                    createVNode(DirectiveTop),
                    createVNode(Foreach),
                    withDirectives(createVNode("div",null,["loadding... "]),[
                        Component.resolveDirective({
                            name:Loading.directive,
                            value:true
                        },this)
                    ]),
                    withDirectives(createVNode("div",{
                        name:MyDirective,
                        value:true
                    },["MyDirective..."]),[
                        Component.resolveDirective({},this)
                    ]),
                    createVNode(Pagination,{
                        total:50,
                        pageSize:10,
                        currentPage:this[_private].formData.page,
                        "onUpdate:currentPage":(e)=>this[_private].formData.page=e
                    }),
                    createVNode("div",null,[
                        "=====currentPage ======="
                    ].concat(
                        this[_private].formData.page,
                        "========="
                    )),
                    createVNode(Dialog,{
                        modelValue:this[_private].showDialog,
                        title:this[_private].selectedData.flag ? "编辑" : '删除',
                        lockScroll:false,
                        "onUpdate:modelValue":(e)=>this[_private].showDialog=e
                    },{
                        default:withCtx(()=>[
                            this[_private].selectedData.flag ? [
                                createVNode(Form,{
                                    onValue:(e)=>this[_private].selectedData.row=e
                                },{
                                    default:withCtx(()=>[
                                        createVNode(FormItem,{
                                            label:"姓名",
                                            prop:"name"
                                        },{
                                            default:withCtx(()=>[
                                                createVNode(Input,{
                                                    modelValue:this[_private].selectedData.row.name,
                                                    "onUpdate:modelValue":(e)=>this[_private].selectedData.row.name=e
                                                })
                                            ])
                                        }),
                                        createVNode(FormItem,{
                                            label:"手机",
                                            prop:"phone"
                                        },{
                                            default:withCtx(()=>[
                                                createVNode(Input,{
                                                    modelValue:this[_private].selectedData.row.phone,
                                                    "onUpdate:modelValue":(e)=>this[_private].selectedData.row.phone=e
                                                })
                                            ])
                                        })
                                    ])
                                })
                            ] : [
                                "确定要删除“"
                            ].concat(
                                this[_private].selectedData.row.name,
                                "”吗？ "
                            )
                        ].concat(
                            createVNode(RichText)
                        )),
                        footer:()=>[createVNode("div",null,[
                            createVNode(Button,{
                                onClick:()=>this[_private].showDialog=false
                            },{
                                default:withCtx(()=>["取 消"])
                            }),
                            createVNode(Button,{
                                type:"primary",
                                onClick:this.saveEdit.bind(this)
                            },{
                                default:withCtx(()=>["确 定"])
                            })
                        ])]
                    })
                ));
            }
        }
    }
});
export default List;