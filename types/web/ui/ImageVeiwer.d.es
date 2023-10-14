package web.ui

import web.components.Component

@Import(ImageViewer = "element-ui/packages/image/src/image-viewer.vue")
@Embed('element-ui/lib/theme-chalk/image.css')

/** Image Component */
declare final class ImageViewer extends Component {
  /** Image source */
  urlList: string[]
  maskClosable: boolean = true;
  appendToBody: boolean = true;
  initialIndex: number = 0;
  zIndex: number
  onSwitch: (index?:number)=>void;
  onClose: ()=>void;
}
