package web.ui;

import web.components.Component;

@Import(Avatar = "element-ui/packages/avatar")
@Embed('element-ui/lib/theme-chalk/avatar.css')
@Define('slot', 'default');
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
