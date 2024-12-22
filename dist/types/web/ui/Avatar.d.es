package web.ui;

import web.components.Component;

import Avatar from 'element-plus/lib/components/avatar'
import 'element-plus/lib/components/avatar/style/css'

@Define('slot', 'default');
@Define(emits, error)

/** Avatar Component */
declare final class Avatar extends Component {
  icon: string;

  size: string | number;

  shape: string;

  src: string;

  error: () => false;

  srcSet: string;

  alt: string;

  fit: string;
}
