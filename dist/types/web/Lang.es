package web{

    class Lang{

        static private _langDefaultClass:class<Lang> = Lang;
        static protected const instances:Map<any, Lang> = new Map();

        static use<T extends class<Lang>>(langClass?:T){
            langClass = langClass||_langDefaultClass;
            let instance = instances.get(langClass)
            if( !instance ){
                instances.set(langClass, instance =new langClass() )
                instance.create();
            }
            return instance;
        }

        static setClass<T extends class<Lang>>( langClass:T ){
            _langDefaultClass = langClass;
        }

        static fetch(locale:string, langClass:class<Lang>=null){
            return use(langClass).fetch(locale)
        }

        static format(locale:string, data:{}, langClass:class<Lang>=null){
            return use(langClass).format(locale, data);
        }

        static getLocale<T extends class<Lang>>(langClass:T=null, defaultValue='zh-CN'){
            if(langClass){
                const obj = instances.get(langClass);
                return obj ? obj.getLocale() : defaultValue;
            }
            const obj = Array.from(instances.values())
            return obj.length>0 ? obj[0].getLocale() : defaultValue;
        }

        static setLocale<T extends class<Lang>>(value:string, langClass:T=null){
            if(langClass){
                const obj = instances.get(langClass);
                return obj ? obj.setLocale(value) : false;
            }
            instances.forEach( obj=>{
                obj.setLocale(value);
            });
            return instances.size>0;
        }

        private _qureyLanguageField = 'lang';

        get qureyLanguageField(){
            return this._qureyLanguageField;
        }

        set qureyLanguageField(value:string){
            this._qureyLanguageField = value;
        }

        private messages = {};
        protected create(){
            type T1 = typeof this.getLocaleFiles();
            const list = this.getLocaleFiles();
            const every = (list:T1, group:string='')=>{
                list.forEach(file=>{
                    const index = file.path.lastIndexOf('/')
                    let name = file.path.slice(index+1);
                    if(file.isFile) {
                        name = name.slice(0,name.lastIndexOf('.'))
                        if(typeof file.content === 'object'){
                            this.add(group ? group+'.'+name : name, file.content as any)
                        }
                    }else if( file.children && file.children.length>0 ){
                        every(file.children, group ? group+'.'+name : name)
                    }
                });
            }
            every(list);
        }

        protected detectLanguage(){
            let language = this.qureyLanguage();
            if(language){
                return language;
            }
            when( Env(platform, 'client') ){
                language = window.navigator.language || window.navigator.userLanguage;
                if(language){
                    return language
                }
                const languages = window.navigator.languages;
                if(languages && Array.isArray(languages) ){
                    return languages[0];
                }
            }
            return 'zh-CN';
        }

        protected qureyLanguage(){
            when( Env(platform, 'client') ){
                let search = location.search;
                let field = this.qureyLanguageField;
                if(search){
                    const params = new URLSearchParams(search);
                    if(params.has(field)){
                        return params.get(field);
                    }
                }
                search = location.hash;
                const index = search.indexOf('?');
                if(index>=0){
                    const params = new URLSearchParams(search.slice(index));
                    if(params.has(field)){
                        return params.get(field);
                    }
                }
            }
            return null;
        }

        protected getLocaleFiles():annotation.ReadfileResult{
            return @Readfile('@options.localeDir', load=true, relative=true);
        }

        protected getRefs(target:object, segs:string[], createFlag=false){
            for(let i=0;i<segs.length;i++){
                const name = segs[i];
                if(target.hasOwnProperty(name)){
                    target = target[name];
                }else{
                    if(createFlag){
                        target = target[name] = {}
                    }else{
                        return null;
                    }
                }
            }
            return target;
        }

        protected getSegs(locale:string){
            locale = locale.toLowerCase();
            return locale.split('.');
        }

        protected getCommonKey(){
            return 'common';
        }

        protected getLocaleKey(name:string){
            name = this._localeMap[name] || name;
            return name.toLowerCase();
        }

        private _defaultLocale:string = 'zh-CN';
        private _currentLocale:string = null;
        private _localeMap = {};

        setLocaleMap(data:{[key:string]:string}){
            this._localeMap = data;
        }

        setLocale(locale:string){
            this._currentLocale = locale;
        }

        getLocale(){
            let value = this._currentLocale;
            if(value=== null){
                this._currentLocale = value = this.detectLanguage();
            }
            return value || this.defaultLocale;
        }

        set defaultLocale(locale:string){
            this._defaultLocale = locale;
        }

        get defaultLocale(){
            return this._defaultLocale;
        }

        add(locale:string, message:{[key:string]:any}){
            const segs = this.getSegs(locale);
            const object = this.getRefs(this.messages, segs, true) as {};
            if(object){
                this.merge(object, message);
            }
        }

        merge(target:{[key:string]:any}, message:{[key:string]:any}){
            for(let name in message){
                if(System.isObject(message[name])){
                    target[name.toLowerCase()] = this.merge({}, message[name]);
                }else{
                    target[name.toLowerCase()] = message[name];
                }
            }
            return target;
        }

        fetch(name:string, assigned:string = null):string|null{
            const segs = this.getSegs(name);
            const prop = segs.pop();
            const current = assigned || this.getLocale();

            let locales = this.messages[this.getLocaleKey(current)] || {};
            let object = this.getRefs(locales, segs);
            if(object && object.hasOwnProperty(prop)){
                return object[prop];
            }

            const key = this.getCommonKey();
            if(key){
                let commons:{} = locales[key] || {};
                if(commons.hasOwnProperty(prop)){
                    return commons[prop];
                }

                commons=this.messages[key] || {};
                if(commons.hasOwnProperty(prop)){
                    return commons[prop];  
                }
            }

            const de = this.defaultLocale;
            if(de && de !== current){
                return this.fetch(name, de)
            }

            return name;
        }

        format(name:string, data:any):string|null{
            let value = this.fetch(name) as string;
            if( value !== name ){
                value = String(value) as string;
                const isObject = System.isObject(data);
                return value.replaceAll(/(\$|\@)\{(\w+)\}/g, (a, p:string, b:string)=>{
                    if(p.charCodeAt(0)===64){
                        return this.format(b, data);
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