package web.ui

import web.components.Component
import ImageViewer from 'element-plus/lib/components/image-viewer'
import 'element-plus/lib/components/image-viewer/style/css'

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
