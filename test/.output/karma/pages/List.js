import "element-plus/lib/components/infinite-scroll/style/css";
import "element-plus/lib/components/dialog/style/css";
import "element-plus/lib/components/form/style/css";
import "element-plus/lib/components/form-item/style/css";
import "element-plus/lib/components/input/style/css";
import "element-plus/lib/components/loading/style/css";
import "element-plus/lib/components/transfer/style/css";
import "element-plus/lib/components/calendar/style/css";
import "element-plus/lib/components/upload/style/css";
import "element-plus/lib/components/image/style/css";
import "element-plus/lib/components/badge/style/css";
import "element-plus/lib/components/card/style/css";
import "element-plus/lib/components/carousel/style/css";
import "element-plus/lib/components/carousel-item/style/css";
import "element-plus/lib/components/tooltip/style/css";
import "element-plus/lib/components/popover/style/css";
import "element-plus/lib/components/popconfirm/style/css";
import "element-plus/lib/components/drawer/style/css";
import "element-plus/lib/components/tabs/style/css";
import "element-plus/lib/components/tab-pane/style/css";
import "element-plus/lib/components/steps/style/css";
import "element-plus/lib/components/step/style/css";
import "element-plus/lib/components/menu/style/css";
import "element-plus/lib/components/sub-menu/style/css";
import "element-plus/lib/components/menu-item/style/css";
import "element-plus/lib/components/page-header/style/css";
import "element-plus/lib/components/avatar/style/css";
import "element-plus/lib/components/breadcrumb/style/css";
import "element-plus/lib/components/breadcrumb-item/style/css";
import "element-plus/lib/components/backtop/style/css";
import "element-plus/lib/components/tag/style/css";
import "element-plus/lib/components/skeleton-item/style/css";
import "element-plus/lib/components/skeleton/style/css";
import "element-plus/lib/components/result/style/css";
import "element-plus/lib/components/progress/style/css";
import "element-plus/lib/components/pagination/style/css";
import "element-plus/lib/components/empty/style/css";
import "element-plus/lib/components/collapse/style/css";
import "element-plus/lib/components/collapse-item/style/css";
import "element-plus/lib/components/descriptions/style/css";
import "element-plus/lib/components/descriptions-item/style/css";
import "element-plus/lib/components/date-picker/style/css";
import "element-plus/lib/components/color-picker/style/css";
import "element-plus/lib/components/cascader/style/css";
import "element-plus/lib/components/timeline/style/css";
import "element-plus/lib/components/timeline-item/style/css";
import "element-plus/lib/components/time-picker/style/css";
import "element-plus/lib/components/checkbox-group/style/css";
import "element-plus/lib/components/checkbox/style/css";
import "element-plus/lib/components/input-number/style/css";
import "element-plus/lib/components/option/style/css";
import "element-plus/lib/components/table/style/css";
import "element-plus/lib/components/dropdown/style/css";
import "element-plus/lib/components/dropdown-menu/style/css";
import "element-plus/lib/components/dropdown-item/style/css";
import "element-plus/lib/components/table-column/style/css";
import "element-plus/lib/components/button/style/css";
import "element-plus/lib/components/tree/style/css";
import "element-plus/lib/components/notification/style/css";
import "element-plus/lib/components/message-box/style/css";
import "element-plus/lib/components/message/style/css";
import "./../../asstes/karma/pages/List-52102aa4.js";
import Class from "./../../Class.js";
import {createVNode,withCtx,withDirectives} from "vue";
import Component from "./../../web/components/Component.js";
import Reflect from "./../../Reflect.js";
import Message from "element-plus/lib/components/message";
import MessageBox from "element-plus/lib/components/message-box";
import Notification from "element-plus/lib/components/notification";
import TreeCom from "element-plus/lib/components/tree";
import web_ui_Icon from "./../../web/ui/Icon.js";
import web_ui_Button from "element-plus/lib/components/button";
import web_ui_Table,{ElTableColumn as web_ui_TableColumn} from "element-plus/lib/components/table";
import web_ui_Dropdown,{ElDropdownItem as web_ui_DropdownItem,ElDropdownMenu as web_ui_DropdownMenu} from "element-plus/lib/components/dropdown";
import {ElOption as web_ui_Option} from "element-plus/lib/components/select";
import web_ui_Select from "./../../web/ui/Select.js";
import web_ui_InputNumber from "element-plus/lib/components/input-number";
import web_ui_Checkbox,{ElCheckboxGroup as web_ui_CheckboxGroup} from "element-plus/lib/components/checkbox";
import web_ui_TimePicker from "element-plus/lib/components/time-picker";
import web_ui_Timeline,{ElTimelineItem as web_ui_TimelineItem} from "element-plus/lib/components/timeline";
import web_ui_Cascader from "element-plus/lib/components/cascader";
import web_ui_ColorPicker from "element-plus/lib/components/color-picker";
import web_ui_DatePicker from "element-plus/lib/components/date-picker";
import web_ui_Descriptions,{ElDescriptionsItem as web_ui_DescriptionsItem} from "element-plus/lib/components/descriptions";
import web_ui_Collapse,{ElCollapseItem as web_ui_CollapseItem} from "element-plus/lib/components/collapse";
import web_ui_Empty from "element-plus/lib/components/empty";
import web_ui_Pagination from "element-plus/lib/components/pagination";
import web_ui_Progress from "element-plus/lib/components/progress";
import web_ui_Result from "element-plus/lib/components/result";
import web_ui_Skeleton,{ElSkeletonItem as web_ui_SkeletonItem} from "element-plus/lib/components/skeleton";
import web_ui_Tag from "element-plus/lib/components/tag";
import web_ui_Backtop from "element-plus/lib/components/backtop";
import web_ui_Breadcrumb,{ElBreadcrumbItem as web_ui_BreadcrumbItem} from "element-plus/lib/components/breadcrumb";
import web_ui_Avatar from "element-plus/lib/components/avatar";
import web_ui_PageHeader from "element-plus/lib/components/page-header";
import web_ui_Menu,{ElMenuItem as web_ui_MenuItem,ElSubMenu as web_ui_MenuSubitem} from "element-plus/lib/components/menu";
import web_ui_Steps,{ElStep as web_ui_Step} from "element-plus/lib/components/steps";
import web_ui_Tabs,{ElTabPane as web_ui_TabPane} from "element-plus/lib/components/tabs";
import web_ui_Drawer from "element-plus/lib/components/drawer";
import web_ui_Popconfirm from "element-plus/lib/components/popconfirm";
import web_ui_Popover from "element-plus/lib/components/popover";
import web_ui_Tooltip from "element-plus/lib/components/tooltip";
import web_ui_Carousel,{ElCarouselItem as web_ui_CarouselItem} from "element-plus/lib/components/carousel";
import System from "./../../System.js";
import web_ui_Card from "element-plus/lib/components/card";
import web_ui_Badge from "element-plus/lib/components/badge";
import web_ui_Image from "element-plus/lib/components/image";
import web_ui_Upload from "element-plus/lib/components/upload";
import web_ui_Calendar from "element-plus/lib/components/calendar";
import web_ui_Transfer from "element-plus/lib/components/transfer";
import DirectiveTop from "./../components/DirectiveTop.js";
import Foreach from "./../components/Foreach.js";
import Loading from "element-plus/lib/components/loading";
import web_ui_Input from "element-plus/lib/components/input";
import web_ui_Form,{ElFormItem as web_ui_FormItem} from "element-plus/lib/components/form";
import web_ui_RichText from "./../../web/ui/RichText.js";
import web_ui_Dialog from "element-plus/lib/components/dialog";
import dev_tools_HMR from "./../../dev/tools/HMR.js";
import web_ui_InfiniteScroll from "element-plus/lib/components/infinite-scroll";
import MyDirective from "./../components/MyDirective.js";
const _private = Class.getKeySymbols("16bb4f81");
function List(props){
    Component.call(this,props);
    Object.defineProperty(this,_private,{
        value:{}
    });
    Object.defineProperties(this[_private],{
        items:{
            get:()=>this.reactive("items",void 0,()=>[{
                name:'zhangshan',
                phone:'123456',
                id:1
            },{
                name:'lisi',
                phone:'123456',
                id:2
            }]),
            set:(value)=>this.reactive("items",value)
        },
        formData:{
            get:()=>this.reactive("formData",void 0,()=>({
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
            })),
            set:(value)=>this.reactive("formData",value)
        },
        showDialog:{
            get:()=>this.reactive("showDialog",void 0,()=>false),
            set:(value)=>this.reactive("showDialog",value)
        },
        selectedData:{
            get:()=>this.reactive("selectedData",void 0,()=>({
                $index:0,
                row:{},
                flag:true
            })),
            set:(value)=>this.reactive("selectedData",value)
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
            value:function onMounted(){},
            configurable:true
        },
        items:{
            m:2056,
            writable:true,
            value:[{
                name:'zhangshan',
                phone:'123456',
                id:1
            },{
                name:'lisi',
                phone:'123456',
                id:2
            }]
        },
        formData:{
            m:2056,
            writable:true,
            value:{
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
            }
        },
        showDialog:{
            m:2056,
            writable:true,
            value:false
        },
        selectedData:{
            m:2056,
            writable:true,
            value:{
                $index:0,
                row:{},
                flag:true
            }
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
            },
            configurable:true
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
            },
            configurable:true
        },
        handleCommand:{
            m:544,
            value:function handleCommand(obj){
                const [target,flag] = obj;
                this[_private].showDialog=true;
                Reflect.set(List,target,"flag",flag);
                this[_private].selectedData=target;
            },
            configurable:true
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
            },
            configurable:true
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
            },
            configurable:true
        },
        loadList:{
            m:2080,
            value:function loadList(){
                console.log('----loadList------',this[_private].formData.infiniteCount);
                this[_private].formData.infiniteCount+=2;
            },
            configurable:true
        },
        render:{
            m:544,
            value:function render(){
                console.log(this[_private].formData.infiniteCount,'---------infiniteCount-------------');
                return createVNode("div",null,[
                    createVNode(web_ui_Button,{
                        type:"primary"
                    },{
                        default:withCtx(()=>[
                            createVNode(web_ui_Icon,null,{
                                default:withCtx(()=>[
                                    createVNode("plus")
                                ])
                            }),
                            "button ",
                            createVNode(web_ui_Icon,{
                                name:"Plus"
                            })
                        ])
                    })
                ].concat(
                    createVNode(web_ui_Table,{
                        data:this[_private].items
                    },{
                        default:withCtx(()=>[
                            createVNode(web_ui_TableColumn,{
                                prop:"name",
                                label:"姓名"
                            }),
                            createVNode(web_ui_TableColumn,{
                                prop:"phone",
                                label:"手机号"
                            }),
                            createVNode(web_ui_TableColumn,null,{
                                header:withCtx(()=>[
                                    createVNode("span",null,["操作"])
                                ]),
                                default:withCtx((item={})=>[
                                    createVNode(web_ui_Dropdown,{
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
                                        dropdown:()=>[createVNode(web_ui_DropdownMenu,null,{
                                            default:withCtx(()=>[
                                                createVNode(web_ui_DropdownItem,{
                                                    command:[item,true]
                                                },{
                                                    default:withCtx(()=>["编辑"])
                                                }),
                                                createVNode(web_ui_DropdownItem,{
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
                    createVNode(web_ui_Select,{
                        modelValue:this[_private].formData.select,
                        size:"large",
                        "onUpdate:modelValue":(e)=>this[_private].formData.select=e
                    },{
                        default:withCtx(()=>[
                            createVNode(web_ui_Option,{
                                label:"CN",
                                value:"CN"
                            }),
                            createVNode(web_ui_Option,{
                                label:"US",
                                value:"US"
                            })
                        ])
                    }),
                    createVNode(web_ui_InputNumber),
                    createVNode("div",{
                        class:"container"
                    },[
                        createVNode(web_ui_Checkbox,{
                            value:this[_private].formData.checkAll,
                            modelValue:this[_private].formData.checkAll,
                            indeterminate:this[_private].formData.isIndeterminate,
                            "onUpdate:modelValue":(e)=>this[_private].formData.checkAll=e,
                            onChange:this.handleCheckAllChange.bind(this)
                        })
                    ]),
                    createVNode(web_ui_CheckboxGroup,{
                        modelValue:this[_private].formData.checkedCities,
                        "onUpdate:modelValue":(e)=>this[_private].formData.checkedCities=e
                    },{
                        default:withCtx(()=>this[_private].formData.cities.map((item,key)=>createVNode(web_ui_Checkbox,{
                            label:item,
                            key:item
                        },{
                            default:withCtx(()=>[item])
                        })))
                    }),
                    this.createTree(),
                    createVNode(web_ui_TimePicker,{
                        modelValue:this[_private].formData.timeValue,
                        "onUpdate:modelValue":(e)=>this[_private].formData.timeValue=e
                    }),
                    createVNode(web_ui_Timeline,null,{
                        default:withCtx(()=>[
                            createVNode(web_ui_TimelineItem,{
                                timestamp:"2023-01-01"
                            },{
                                default:withCtx(()=>["Event start "])
                            }),
                            createVNode(web_ui_TimelineItem,{
                                timestamp:"2023-05-01"
                            },{
                                default:withCtx(()=>["Event end "])
                            })
                        ])
                    }),
                    createVNode(web_ui_Cascader,{
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
                    createVNode(web_ui_ColorPicker,{
                        modelValue:"#409EFF"
                    }),
                    createVNode(web_ui_DatePicker,{
                        modelValue:this[_private].formData.datePickerValue,
                        "onUpdate:modelValue":(e)=>this[_private].formData.datePickerValue=e
                    }),
                    createVNode(web_ui_Descriptions,{
                        title:"User"
                    },{
                        default:withCtx(()=>[
                            createVNode(web_ui_DescriptionsItem,{
                                label:"Description"
                            },{
                                default:withCtx(()=>["Description Item "])
                            })
                        ])
                    }),
                    createVNode(web_ui_Collapse,{
                        value:this[_private].formData.collapseValue,
                        modelValue:this[_private].formData.collapseValue,
                        "onUpdate:modelValue":(e)=>this[_private].formData.collapseValue=e
                    },{
                        default:withCtx(()=>[
                            createVNode(web_ui_CollapseItem,{
                                title:"title 1",
                                name:"1"
                            },{
                                default:withCtx(()=>[
                                    createVNode("div",null,["Consistent with real life: in line with the process and logic of real life, and comply with languages and habits that the users are used to; "])
                                ])
                            }),
                            createVNode(web_ui_CollapseItem,{
                                title:"title 2",
                                name:"2"
                            },{
                                default:withCtx(()=>[
                                    createVNode("div",null,["Operation feedback: enable the users to clearly perceive their operations by style updates and interactive effects; "])
                                ])
                            })
                        ])
                    }),
                    createVNode(web_ui_Empty,{
                        description:"Not Data"
                    }),
                    createVNode(web_ui_Pagination,{
                        total:100
                    }),
                    createVNode(web_ui_Progress,{
                        percentage:50
                    }),
                    createVNode(web_ui_Result,{
                        title:"Success",
                        subTitle:"Please follow the instructions"
                    },{
                        extra:()=>[createVNode(web_ui_Button,{
                            type:"primary"
                        },{
                            default:withCtx(()=>["Back"])
                        })]
                    }),
                    createVNode(web_ui_Skeleton),
                    createVNode(web_ui_Skeleton,{
                        style:"--el-skeleton-circle-size: 100px"
                    },{
                        template:withCtx(()=>[
                            createVNode(web_ui_SkeletonItem,{
                                variant:"circle"
                            })
                        ])
                    }),
                    createVNode(web_ui_Tag,null,{
                        default:withCtx(()=>["Tag"])
                    }),
                    createVNode(web_ui_Backtop,{
                        right:20,
                        bottom:100
                    }),
                    createVNode(web_ui_PageHeader,null,{
                        breadcrumb:()=>[createVNode(web_ui_Breadcrumb,{
                            separator:"/"
                        },{
                            default:withCtx(()=>[
                                createVNode(web_ui_BreadcrumbItem,{
                                    to:"{ path: '/' }"
                                },{
                                    default:withCtx(()=>["homepage"])
                                }),
                                createVNode(web_ui_BreadcrumbItem,null,{
                                    default:withCtx(()=>[
                                        createVNode("a",{
                                            href:"/"
                                        },["promotion management"])
                                    ])
                                }),
                                createVNode(web_ui_BreadcrumbItem,null,{
                                    default:withCtx(()=>["promotion list"])
                                }),
                                createVNode(web_ui_BreadcrumbItem,null,{
                                    default:withCtx(()=>["promotion detail"])
                                })
                            ])
                        })],
                        content:()=>[createVNode("div",{
                            style:"display:flex;align-items: center;"
                        },[
                            createVNode(web_ui_Avatar,{
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
                            createVNode(web_ui_Tag,null,{
                                default:withCtx(()=>["Default"])
                            })
                        ])]
                    }),
                    createVNode(web_ui_Menu,{
                        mode:"horizontal"
                    },{
                        default:withCtx(()=>[
                            createVNode(web_ui_MenuItem,{
                                index:"1"
                            },{
                                default:withCtx(()=>["A"])
                            }),
                            createVNode(web_ui_MenuSubitem,{
                                index:"2"
                            },{
                                default:withCtx(()=>[
                                    createVNode(web_ui_MenuItem,{
                                        index:"2-1"
                                    },{
                                        default:withCtx(()=>["B-A"])
                                    }),
                                    createVNode(web_ui_MenuItem,{
                                        index:"2-2"
                                    },{
                                        default:withCtx(()=>["B-B"])
                                    })
                                ]),
                                title:()=>[createVNode("span",null,["B"])]
                            })
                        ])
                    }),
                    createVNode(web_ui_Steps,null,{
                        default:withCtx(()=>[
                            createVNode(web_ui_Step,{
                                title:"Step 1"
                            }),
                            createVNode(web_ui_Step,{
                                title:"Step 2"
                            })
                        ])
                    }),
                    createVNode(web_ui_Tabs,null,{
                        default:withCtx(()=>[
                            createVNode(web_ui_TabPane,{
                                label:"User",
                                name:"first"
                            },{
                                default:withCtx(()=>["User"])
                            }),
                            createVNode(web_ui_TabPane,{
                                label:"Config",
                                name:"second"
                            },{
                                default:withCtx(()=>["Config"])
                            }),
                            createVNode(web_ui_TabPane,{
                                label:"Role",
                                name:"third"
                            },{
                                default:withCtx(()=>["Role"])
                            }),
                            createVNode(web_ui_TabPane,{
                                label:"Task",
                                name:"fourth"
                            },{
                                default:withCtx(()=>["Task"])
                            })
                        ])
                    }),
                    createVNode(web_ui_Button,{
                        type:"primary",
                        style:"margin-left: 16px",
                        onClick:()=>this[_private].formData.drawer=true
                    },{
                        default:withCtx(()=>["Open Drawer "])
                    }),
                    createVNode(web_ui_Drawer,{
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
                    createVNode(web_ui_Popconfirm,{
                        title:"Are you sure to delete this?"
                    },{
                        reference:()=>[createVNode(web_ui_Button,null,{
                            default:withCtx(()=>["Delete"])
                        })]
                    }),
                    createVNode(web_ui_Popover,{
                        placement:"top-start",
                        title:"Title",
                        width:200,
                        trigger:"hover",
                        content:"this is content, this is content, this is content"
                    },{
                        reference:()=>[createVNode(web_ui_Button,null,{
                            default:withCtx(()=>["Hover to activate"])
                        })]
                    }),
                    createVNode(web_ui_Tooltip,{
                        effect:"dark",
                        content:"Top Left prompts info",
                        placement:"top-start",
                        class:"box-item"
                    },{
                        default:withCtx(()=>[
                            createVNode(web_ui_Button,null,{
                                default:withCtx(()=>["top-start"])
                            })
                        ])
                    }),
                    createVNode(web_ui_Carousel,{
                        height:"150px"
                    },{
                        default:withCtx(()=>System.forMap(4,(item,key)=>createVNode(web_ui_CarouselItem,{
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
                    createVNode(web_ui_Card,{
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
                            createVNode(web_ui_Button,{
                                text:true,
                                class:"button"
                            },{
                                default:withCtx(()=>["Operation button"])
                            })
                        ])]
                    }),
                    createVNode(web_ui_Badge,{
                        value:12
                    },{
                        default:withCtx(()=>[
                            createVNode(web_ui_Button,null,{
                                default:withCtx(()=>["comments"])
                            })
                        ])
                    }),
                    createVNode(web_ui_Image,{
                        src:"https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
                    }),
                    createVNode(web_ui_Upload,{
                        action:"http://ww.com"
                    },{
                        default:withCtx(()=>[
                            createVNode(web_ui_Button,null,{
                                default:withCtx(()=>["Click upload"])
                            })
                        ])
                    }),
                    createVNode(web_ui_Calendar),
                    createVNode(web_ui_Transfer,{
                        modelValue:this[_private].formData.transferOptions,
                        data:this.getTransferOptions(),
                        "onUpdate:modelValue":(e)=>this[_private].formData.transferOptions=e
                    }),
                    withDirectives(createVNode("ul",{
                        "infinite-scroll-disabled":this[_private].formData.infiniteCount > 20,
                        "infinite-scroll-distance":5,
                        class:"infinite-list",
                        style:"overflow: auto"
                    },System.forMap(this[_private].formData.infiniteCount,(i,key)=>createVNode("li",{
                        key:i,
                        class:"infinite-list-item"
                    },[
                        "infinite-scroll ",
                        i
                    ]))),[
                        Component.resolveDirective({
                            name:"infinite-scroll",
                            directiveClass:web_ui_InfiniteScroll,
                            value:this.loadList.bind(this)
                        },this)
                    ]),
                    createVNode(DirectiveTop),
                    createVNode(Foreach),
                    withDirectives(createVNode("div",null,["loadding... "]),[
                        Component.resolveDirective({
                            name:Loading.directive,
                            value:true
                        },this)
                    ]),
                    withDirectives(createVNode("div",null,["MyDirective..."]),[
                        Component.resolveDirective({
                            name:"karma-components-MyDirective",
                            directiveClass:MyDirective,
                            value:true
                        },this)
                    ]),
                    createVNode(web_ui_Pagination,{
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
                    createVNode(web_ui_Dialog,{
                        modelValue:this[_private].showDialog,
                        title:this[_private].selectedData.flag ? "编辑" : '删除',
                        lockScroll:false,
                        "onUpdate:modelValue":(e)=>this[_private].showDialog=e
                    },{
                        default:withCtx(()=>[
                            this[_private].selectedData.flag ? [
                                createVNode(web_ui_Form,{
                                    onValue:(e)=>this[_private].selectedData.row=e
                                },{
                                    default:withCtx(()=>[
                                        createVNode(web_ui_FormItem,{
                                            label:"姓名",
                                            prop:"name"
                                        },{
                                            default:withCtx(()=>[
                                                createVNode(web_ui_Input,{
                                                    modelValue:this[_private].selectedData.row.name,
                                                    "onUpdate:modelValue":(e)=>this[_private].selectedData.row.name=e
                                                })
                                            ])
                                        }),
                                        createVNode(web_ui_FormItem,{
                                            label:"手机",
                                            prop:"phone"
                                        },{
                                            default:withCtx(()=>[
                                                createVNode(web_ui_Input,{
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
                            createVNode(web_ui_RichText)
                        )),
                        footer:()=>[createVNode("div",null,[
                            createVNode(web_ui_Button,{
                                onClick:()=>this[_private].showDialog=false
                            },{
                                default:withCtx(()=>["取 消"])
                            }),
                            createVNode(web_ui_Button,{
                                type:"primary",
                                onClick:this.saveEdit.bind(this)
                            },{
                                default:withCtx(()=>["确 定"])
                            })
                        ])]
                    })
                ));
            },
            configurable:true
        }
    }
});
if(module.hot){
    module.hot.accept();
    if(!dev_tools_HMR.createRecord("16bb4f81",List)){
        dev_tools_HMR.reload("16bb4f81",List)
    }
}
export default Component.createComponent(List,{
    name:"es-List",
    __hmrId:"16bb4f81"
});