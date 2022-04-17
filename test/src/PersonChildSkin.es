<s:Component 
xmlns:s="web.components"
xmlns:cmd="@directives" 
xmlns:d="@directives" 
xmlns:slot="@slots" 
xmlns:te="@events::web.events.TransitionEvent"
xmlns:ui="web.ui"
>

   <script>

       @Injector(foot)
       footValue = {name:'default value'};

   </script>

   <div>
         the is Injector foot-----
        {this.footValue.name}
        <ui:Input bind:value={this.footValue.name} ></ui:Input>
   </div>


</s:Component>
