<s:Component 
xmlns:s="web.components"
xmlns:cmd="@directives" 
xmlns:d="@directives" 
xmlns:slot="@slots" 
xmlns:te="@events::web.events.TransitionEvent"
xmlns:ui="web.ui"
>

   <script>
   
       address:string='addresssss--------999';

       import web.ui.Tag;
       import PersonChildSkin;

       @Provider
       provides(){
           return {
               foot:this.formValue
           }
       };


       formValue = {name:'99999', ids:[],hhh:'',select:''};

      get name():string{
        return this.reactive<string>('name');
      }

      set name(value:string){
         this.reactive('name',value);
      }

      get list():string[]{
          return ['one','two','three','four','five']
      }

      onChange(e){
          this.address = e.target.value +'---';
      }

       set value(val:string){
          
            this.reactive('value', val)
        }

        get value():string{
            return this.reactive<string>('value') || '9999';
        }

        beforeEnter(){
            console.log('=========PersonSkin=====enter', name, isShow )
        }

        @Reactive
        private _isShow = false;

        set isShow(value){
            console.log('---------isShow-------------', value )
            this._isShow = value;
            this.nextTick( ()=>{
                this.forceUpdate()
            })
        }

        get isShow(){
            return this._isShow;
        }

         getTag(){
            //return <div>==========getTag================</div>
            
            return <Tag >
                    <div>sdfsdfsdf</div>
                    <div>==========getTag================</div>
            </Tag>
            
         }

        @Override
        onBeforeUpdate(){
            console.log('-----onBeforeUpdate--', this.formValue.name, this._isShow  )
        }

   </script>

   <style>
      .bg{
          background:url('./assets/logo.png');
      }
   </style>

   <style file="./assets/index.css" />

    <div cmd:if="name" class='bg'>1</div>
    <div cmd:elseif="!(name)">2</div>
    <div cmd:else>399999</div>

    <div cmd:each="item of ['china'].concat(list)">
        <div>{item}</div>
        <div class="ssss">
             <div>
                <span>
                    <slot:default />
                </span>
            </div>
        </div>
    </div>

    <cmd:each name={list} item="item">
        <div>{item}</div>
        <div>6666</div>
    </cmd:each>

    <cmd:for name={list} item="item">
        <div>{item}</div>
    </cmd:for>

    <div class="" ref='iss'>
       <div>item =====PersonSkin====  {name} =====</div>
    </div>

    <div cmd:for="(item,index) in list" >{item}----for---{index}</div>



    <input bind:value={this.formValue.name} on:change={e=>onChange(e)} />

    <input value={this.formValue.name} />

    <ui:Input placeholder="请输入内容" disabled type="text" bind:value={this.formValue.hhh} maxLength={20} readonly={false} />

    <slot:foot props={this.list}>
        <div>===============the is foot slot ==============</div>
    </slot:foot>

    <slot:header list={this.list} address={this.address}>
        <div>===============the is foot slot ============== {this.address}</div>
    </slot:header>

    <div d:show="this.isShow">the is property   {this.address}</div>

     <button on:click={this.isShow = !this.isShow}>
        Toggle
    </button>

     <p d:if="this.isShow" key="166" >hello 66666</p>

    <web.animation.TransitionGroup name="fade" te:BEFORE_ENTER={this.beforeEnter}>
        <p d:if="this.isShow" key="1" >hello</p>
        <p d:if="this.isShow" key="2" >hello</p>
        <p d:if="this.isShow" key="3" >hello</p>
    </web.animation.TransitionGroup>


    <d:if condition="this.isShow">
       <div>the is a group condition</div>
       <div>the is a group condition</div>
       <div>the is a group condition</div>
       <div>the is a group condition</div>
       <div>the is a group condition</div>
       <div>the is a group condition</div>
    </d:if>
    <d:else>
        <div>the is a group elseif</div>
    </d:else>

    <div>
         <d:if condition="this.isShow">
            <div>the is a group condition</div>
            <div>the is a group condition</div>
            <div>the is a group condition</div>
            <div>the is a group condition</div>
            <div>the is a group condition</div>
            <div>the is a group condition</div>
        </d:if>
        <d:else>
            <div>the is a group elseif</div>
        </d:else>
    
    </div>


    <d:each name={this.list} item='item' key='index'>
      <div>====each=={item}={index}</div>
      <div>===22=each=={item}=</div>
    </d:each>

    <d:for name={this.list} item='item' key='keyName' >
      <div>====for==={item},{keyName}</div>
      <div>===222=for==={item},{keyName}</div>
    </d:for>

    <d:show condition="isShow" >
      <div>====show==</div>
      <div>===222=show===</div>
      
    </d:show>

    <ui:CheckboxGroup bind:value={this.formValue.ids}>

        <ui:Checkbox  label={1} >
            A
        </ui:Checkbox>

        <ui:Checkbox  label={2}>
            B
        </ui:Checkbox>

    </ui:CheckboxGroup>

    <ui:Select placeholder="请选择" bind:value={this.formValue.select} disabled>
       <ui:Option value="1" >1</ui:Option>
       <ui:Option value="2"  >2</ui:Option>
    </ui:Select>


    {this.getTag()}

    <PersonChildSkin />





</s:Component>
