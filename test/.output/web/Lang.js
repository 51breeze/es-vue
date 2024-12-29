import Class from "./../Class.js";
import _common1 from "D:/tools/es-vue/test/src/locales/common.json";
import _zh_CN2 from "D:/tools/es-vue/test/src/locales/zh-CN.es";
import _Home3 from "D:/tools/es-vue/test/src/locales/us-en/Home.es";
import _common4 from "D:/tools/es-vue/test/src/locales/zh-cn/common.es";
import _Home5 from "D:/tools/es-vue/test/src/locales/zh-cn/Home.es";
import System from "./../System.js";
const _private = Class.getKeySymbols("3e89d133");
function Lang(){
    Object.defineProperty(this,_private,{
        value:{
            _qureyLanguageField:'lang',
            messages:{},
            _defaultLocale:'zh-CN',
            _currentLocale:null,
            _localeMap:{}
        }
    });
}
Class.creator(Lang,{
    m:513,
    ns:"web",
    name:"Lang",
    private:_private,
    methods:{
        _langDefaultClass:{
            m:2312,
            writable:true,
            value:Lang
        },
        instances:{
            m:1296,
            value:new Map()
        },
        use:{
            m:800,
            value:function use(langClass){
                langClass=langClass || Lang._langDefaultClass;
                let instance = Lang.instances.get(langClass);
                if(!instance){
                    Lang.instances.set(langClass,instance=new langClass());
                    instance.create();
                }
                return instance;
            }
        },
        setClass:{
            m:800,
            value:function setClass(langClass){
                Lang._langDefaultClass=langClass;
            }
        },
        fetch:{
            m:800,
            value:function fetch(locale,langClass=null){
                return Lang.use(langClass).fetch(locale);
            }
        },
        format:{
            m:800,
            value:function format(locale,data,langClass=null){
                return Lang.use(langClass).format(locale,data);
            }
        },
        getLocale:{
            m:800,
            value:function getLocale(langClass=null,defaultValue='zh-CN'){
                if(langClass){
                    const obj = Lang.instances.get(langClass);
                    return obj ? obj.getLocale() : defaultValue;
                }
                const obj = Array.from(Lang.instances.values());
                return obj.length > 0 ? obj[0].getLocale() : defaultValue;
            }
        },
        setLocale:{
            m:800,
            value:function setLocale(value,langClass=null){
                if(langClass){
                    const obj = Lang.instances.get(langClass);
                    return obj ? obj.setLocale(value) : false;
                }
                Lang.instances.forEach((obj)=>{
                    obj.setLocale(value);
                });
                return Lang.instances.size > 0;
            }
        }
    },
    members:{
        _qureyLanguageField:{
            m:2056,
            writable:true
        },
        qureyLanguageField:{
            m:576,
            enumerable:true,
            get:function qureyLanguageField(){
                return this[_private]._qureyLanguageField;
            },
            set:function qureyLanguageField(value){
                this[_private]._qureyLanguageField=value;
            }
        },
        messages:{
            m:2056,
            writable:true
        },
        create:{
            m:1056,
            value:function create(){
                const list = this.getLocaleFiles();
                const every = (list,group='')=>{
                    list.forEach((file)=>{
                        const index = file.path.lastIndexOf('/');
                        let name = file.path.slice(index + 1);
                        if(file.isFile){
                            name=name.slice(0,name.lastIndexOf('.'));
                            this.add(group ? group + '.' + name : name,file.content);
                        }else 
                        if(file.children && file.children.length > 0){
                            every(file.children,group ? group + '.' + name : name);
                        }
                    });
                }
                every(list);
            }
        },
        detectLanguage:{
            m:1056,
            value:function detectLanguage(){
                let language = this.qureyLanguage();
                if(language){
                    return language;
                }
                return 'zh-CN';
            }
        },
        qureyLanguage:{
            m:1056,
            value:function qureyLanguage(){
                return null;
            }
        },
        getLocaleFiles:{
            m:1056,
            value:function getLocaleFiles(){
                return [{
                    path:"locales/common.env",
                    isFile:true,
                    content:
                    {"name":"123","start":"开始日期","db":"test","host":"http://wwww.com:123"}
                },{
                    path:"locales/common.json",
                    isFile:true,
                    content:
                    _common1
                },{
                    path:"locales/zh-CN.es",
                    isFile:true,
                    content:
                    _zh_CN2
                },{
                    path:"locales/us-en/Home.es",
                    isFile:true,
                    content:
                    _Home3
                },{
                    path:"locales/zh-cn/common.es",
                    isFile:true,
                    content:
                    _common4
                },{
                    path:"locales/zh-cn/Home.es",
                    isFile:true,
                    content:
                    _Home5
                }];
            }
        },
        getRefs:{
            m:1056,
            value:function getRefs(target,segs,createFlag=false){
                for(let i = 0;i < segs.length;i++){
                    const name = segs[i];
                    if(target.hasOwnProperty(name)){
                        target=target[name];
                    }else{
                        if(createFlag){
                            target=target[name]={}
                        }else{
                            return null;
                        }
                    }
                }
                return target;
            }
        },
        getSegs:{
            m:1056,
            value:function getSegs(locale){
                locale=locale.toLowerCase();
                return locale.split('.');
            }
        },
        getCommonKey:{
            m:1056,
            value:function getCommonKey(){
                return 'common';
            }
        },
        getLocaleKey:{
            m:1056,
            value:function getLocaleKey(name){
                name=this[_private]._localeMap[name] || name;
                return name.toLowerCase();
            }
        },
        _defaultLocale:{
            m:2056,
            writable:true
        },
        _currentLocale:{
            m:2056,
            writable:true
        },
        _localeMap:{
            m:2056,
            writable:true
        },
        setLocaleMap:{
            m:544,
            value:function setLocaleMap(data){
                this[_private]._localeMap=data;
            }
        },
        setLocale:{
            m:544,
            value:function setLocale(locale){
                this[_private]._currentLocale=locale;
            }
        },
        getLocale:{
            m:544,
            value:function getLocale(){
                let value = this[_private]._currentLocale;
                if(value === null){
                    this[_private]._currentLocale=value=this.detectLanguage();
                }
                return value || this.defaultLocale;
            }
        },
        defaultLocale:{
            m:576,
            enumerable:true,
            get:function defaultLocale(){
                return this[_private]._defaultLocale;
            },
            set:function defaultLocale(locale){
                this[_private]._defaultLocale=locale;
            }
        },
        add:{
            m:544,
            value:function add(locale,message){
                const segs = this.getSegs(locale);
                const object = this.getRefs(this[_private].messages,segs,true);
                if(object){
                    this.merge(object,message);
                }
            }
        },
        merge:{
            m:544,
            value:function merge(target,message){
                for(let name in message){
                    if(System.isObject(message[name])){
                        target[name.toLowerCase()]=this.merge({},message[name]);
                    }else{
                        target[name.toLowerCase()]=message[name];
                    }
                }
                return target;
            }
        },
        fetch:{
            m:544,
            value:function fetch(name,assigned=null){
                const segs = this.getSegs(name);
                const prop = segs.pop();
                const current = assigned || this.getLocale();
                let locales = this[_private].messages[this.getLocaleKey(current)] || {}
                let object = this.getRefs(locales,segs);
                if(object && object.hasOwnProperty(prop)){
                    return object[prop];
                }
                const key = this.getCommonKey();
                if(key){
                    let commons = locales[key] || {}
                    if(commons.hasOwnProperty(prop)){
                        return commons[prop];
                    }
                    commons=this[_private].messages[key] || {}
                    if(commons.hasOwnProperty(prop)){
                        return commons[prop];
                    }
                }
                const de = this.defaultLocale;
                if(de && de !== current){
                    return this.fetch(name,de);
                }
                return name;
            }
        },
        format:{
            m:544,
            value:function format(name,data){
                let value = this.fetch(name);
                if(value !== name){
                    value=String(value);
                    const isObject = System.isObject(data);
                    return value.replaceAll(/(\$|\@)\{(\w+)\}/g,(a,p,b)=>{
                        if(p.charCodeAt(0) === 64){
                            return this.format(b,data);
                        }
                        if(isObject){
                            return String(data[b]) || a;
                        }else{
                            return String(data);
                        }
                    });
                }
                return value;
            }
        }
    }
});
export default Lang;