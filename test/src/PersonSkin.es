<s:Component 
xmlns:s="web.components"
xmlns:cmd="@directives" 
xmlns:d="@directives" 
xmlns:slot="@slots" 
xmlns:te="@events::web.ui.TransitionEvent"
xmlns:ui="web.ui"
>

   <script>

       address:string='address';

      get name():string{
        return this.data<string>('name');
      }

      set name(value:string){
         this.data('name',value);
      }

      get list():string[]{
          return ['one','two','three','four','five']
      }

      onChange(e){

          this.address = e.target.value +'---';
         
      }

       set value(val:string){
          
            this.data('value', val)
        }

        get value():string{
            return this.data<string>('value') || '9999';
        }

        beforeEnter(){
            console.log('=========PersonSkin=====enter')
        }

        isShow = true;

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

    <div class="" ref='iss'>
       <div>item =====PersonSkin====  {name} =====</div>
    </div>

    <input bind:value={value} on:change={onChange} />

    <input value={this.value} />

    <slot:foot props={this.list}>
        <div>===============the is foot slot ==============</div>
    </slot:foot>

    <div d:show="this.isShow">the is property {this.address}</div>

     <button on:click={this.isShow = !this.isShow}>
        Toggle
    </button>

    <web.ui.TransitionGroup name="fade" te:BEFORE_ENTER={this.beforeEnter}>
        <p d:if="this.isShow" key="1" >hello</p>
        <p d:if="this.isShow" key="2" >hello</p>
        <p d:if="this.isShow" key="3" >hello</p>
    </web.ui.TransitionGroup>


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



</s:Component>
