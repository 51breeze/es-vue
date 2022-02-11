package web.ui

import web.components.Component

@Import(ElLoading = "element-ui/packages/loading")
@Embed('element-ui/lib/theme-chalk/loading.css')

/** Loading Component */
class Loading extends Component {

  private instance:Loading = null;

  @Callable
  constructor(options:LoadingOptions){
      var instance = this.instance = ElLoading.service(options);
      this.nextTick( ()=>{
        instance.close();
      });
      return instance;
  }

  /** Close the Loading instance */
  close (): void{
      var instance = this.instance;
      if( instance ){
          this.instance.close();
      }
  }
}

/** Options used in Loading service */
declare interface LoadingOptions {
  /** The DOM node Loading needs to cover. Accepts a DOM object or a string. If it's a string, it will be passed to `document.querySelector` to get the corresponding DOM node */
  target?: HTMLElement | string

  /** Whether to make the mask append to the body element */
  body?: boolean

  /** Whether to show the loading mask in fullscreen */
  fullscreen?: boolean

  /** Whether to disable scrolling on body */
  lock?: boolean

  /** Loading text that displays under the spinner */
  text?: string

  /** Class name of the custom spinner */
  spinner?: string

  /** Background color of the mask */
  background?: string

  /** Custom class name for Loading */
  customClass?: string
}
