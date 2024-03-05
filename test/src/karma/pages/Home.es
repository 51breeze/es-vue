package karma.pages;

import web.components.Component
import karma.asserts.HomeAssert;

import stores.UserStore;
import web.Store;
import web.Lang;

import VList from '../vue/list.es';



class Home extends Component{

      @Provider
      list:{label:string}[] = [];

      @Reactive
      fromData = {account:'account',password:'password',check:'checked',type:'email'}

      @reactive
      private _title:string='Home page';

      @Provider('homePage')
      providesss(){
            return [1];
      }

      protected response = 'null'

      set title(value:string){
            console.trace(this.toString(), '-------set title------', this.title,  value)
            this._title = value;
      }

      get title(){
            return this._title;
      }

      addItem(item:{label:string}){
            this.list.push( item );
      }

      setType(value){
            this.fromData.type = value;
      }

      @Override
      onMounted(){
            when( Env(testframework, 'karma') ){
                  const assert = new HomeAssert(this);
            }
            const header = this.getRefs('editor-header')
            this.layout = {
                  header:header,
                  main:this.getRefs('editor-main')
            };

            const store = UserStore.use();
            store.info = {add:123, name:'zhangsan'}
            store.fetch()
      }


      @Reactive
      private text:string = 'Hello,worlds'

      @Reactive
      private text2:string = 'Hello,worlds 22222'

      @Reactive
      private data = {}

      @Reactive
      private layout = {}


      get spreadData(){
            return {
                 items:this.list,
                 title:this.title,
                 fromData:this.fromData
            }
      }

      @Override
      render(){

            console.log('------Home page render-----------', this.title, this.list, this.fromData)

            return <div data-title="home" xmlns:local="karma.components" xmlns:ui="web.ui"  xmlns:d="@directives" xmlns:s="@slots">
                  <h5 ref='title'>{title}</h5>
                  <local:List ref='list' {...spreadData} ></local:List>
                  <local:Slot ref="slot-component-1" items = {list}>
                        <div>footer default children</div>
                  </local:Slot>
                  <local:Slot ref="slot-component-2" items = {list}>
                        <s:head>
                             <h3>Slot component: definition</h3>
                        </s:head>

                        <s:content scope="scope">
                              <div d:for="(item,index) in scope.items" ref='slot-item'>definition: {item.label}</div>
                        </s:content>
                        
                  </local:Slot>
                  <local:Directive></local:Directive>

                  {

                  // <div>
                  //       <ui:RichText bind:value={text}></ui:RichText>
                  // </div>

                  //  <div>
                  //       <ui:RichTextInline bind:value={text2}></ui:RichTextInline>
                  // </div>

                  // <div>
                  //       <ui:RichTextBalloonBlock bind:value={text2}></ui:RichTextBalloonBlock>
                  // </div>


                  //  <div>
                  //       <ui:RichTextDocument bind:value={text2}></ui:RichTextDocument>
                  // </div>

                  }

                  <div ref="editor-main">
                        editor-main
                  </div>

                  <div>
                        <ui:RichTextDocument bind:value={text2}></ui:RichTextDocument>
                   </div>


                   <div>
                       <ui:RichTextMultiroot layout={layout} bind:value={data}></ui:RichTextMultiroot>
                   </div>

                 
                  <div ref="editor-header">
                        editor-header
                  </div>

                  <div>{Lang.fetch('home.start')}</div>



            </div>
      }

}