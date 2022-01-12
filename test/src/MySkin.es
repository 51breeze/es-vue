<s:Skin 
    xmlns:s="web"
    xmlns:cmd="@directives" 
    xmlns:slot="@slots" 
    >

   <script>

    @HostComponent(MyView)

    get name():string{
        return this.hostComponent.name;
    }

    set name(value:string){
        this.data('name',value);
    }

    get list():string[]{
        return ['one','two','three','four','five']
    }

    onChange(){
       
    }

    set value(val:string){
      
        this.data('value', val)
    }

    get value():string{
        return this.data<string>('value') || '9999';
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

    <div class="" ref='iss'>
       <div>item =====MySkin====  {name} =====</div>
    </div>

    <input bind:value={value} on:change={onChange} />

    <input value={this.value} />

    <slot:foot props={this.list}>
        <div>===============the is foot slot ==============</div>
    </slot:foot>

</s:Skin>
