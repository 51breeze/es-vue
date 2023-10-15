# es-vue

es-vue 是为 EaseScript 提供的一个插件。主要集成了 VUE 的实现，使用类组件的开发方式来统一WEB组件的语法，默认集成了Element UI, 开箱即用不需要单独配置或者引用。如果使用的是VUE3则引用的是element-plus否则为element-ui。
所有资源的打包都是按需加载打包，即只有使用了的资源才会被收集。

## 一、与VUE差异化

1、所有vue模板语法不支持

2、style 标签的scoped不支持

3、所有指令及事件修饰符不支持

4、组件PROPS属性允许在类中进行手动赋值，赋值后的属性会与上级的数据流断开引用，相当于给属性赋初始值。

5、使用 EaseScript JSX 语法编写组件UI

```vue
<template>
    <div v-if="condition">模板语法不支持</div>
</template>
<style scoped>
     /*scoped 暂不支持*/
</style>
```

## 二、组件类

### WEB基础组件

web.components.Component  //WEB基础组件

web.components.Viewport  //视口组件，与vue router-view 一致

web.components.Router  //路由组件，与vue router 一致

web.components.Link  //路由组件，与vue router-link 一致

web.components.KeepAlive  //路由组件，与vue KeepAlive 一致

web.Application //应用入组件

### UI 组件

web.ui.*  //所有 element ui 组件， 具体该当请查看 element ui 官网

## 三、语法指令

指令主要用来如何组织呈现ui元素, 指令的声明是在根元素上采用xmlns的形式进行命名空间的定义，如果没有定义默认会隐式定义。指令分为动作指令、内容指令和事件指令,这些指令与VUE指令类似;

_动作指令_: @directives::if,elseif,else,for,each,show

for,each 都用作循环，each 只能用作数组提高性能。

_内容指令_：@slots, Namespace(命名空间标识符, 方便引用组件)

_事件指令_：@events，@natives, @binding

_隐式定义的单字指令_: d=@directives, e=@events，n=@natives, b=@binding, s=@slots

_隐式定义的默认指令_: direct=@directives，on=@events，native=@natives, bind=@binding, slot=@slots


### 定义指令语法

_xmlns:d="指令"_

xmlns 声明属性的命名空间, d 引用指令名, 可以指定任意的标识符

### 指令的使用

if,elseif,else,for,each,show 可以定义在元素属性上，也可以包裹元素。

_包裹元素写法_:

```
<d:if condition={this.one}>
    <div>1</div>
</d:if>
<d:elseif condition={this.two}>
    <div>2</div>
</d:elseif>
<d:else>
    <div>...</div>
</d:else>
<d:show condition={true}>
    <div>show</div>
</d:show>
<d:for name="this.list" item="item" key="key">
    <div>{item}</div>
</d:for>
<d:each name="[1,2,3]" item="item" key="key">
    <div>{item}</div>
</d:for>
```


_元素属性上的写法_:

```
<div d:if={this.one}>1</div>
<div d:elseif={this.two}>2</div>
<div d:else>...</div>
<div d:show={true}>show</div>
<div d:for="(item, key) in this.list">{item}</div>
<div d:each="(item, key) in [1,2,3]">{item}</div>
```


```ts
package com.views;
import web.components.Component
class Home extends Component{
  @Override
  render(){
	 return <div xmlns:d="@directives" xmlns:s="@slots" xmlns:ui="web.ui">
        <ui:Skeleton>
            <s:template>
                <ui:SkeletonItem variant = "circle"></ui:SkeletonItem>
            </s:template>
        </ui:Skeleton>
     </div>
  }
```

以下代码与上面的一致

```ts
package com.views;
import web.components.Component
class Home extends Component{
  @Override
  render(){
	 return <div>
        <ui:Skeleton>
            <s:template>
                    <ui:SkeletonItem variant = "circle"></ui:SkeletonItem>
            </s:template>
        </ui:Skeleton>
     </div>
  }
```

添加事件

```ts
package com.views;
import web.components.Component
class Home extends Component{

    onClick(e){
        //to do....
    }

    @Override
    render(){
        return <div>
            <ui:Button on:click={onClick}>Click</ui:Button>
        </div>
    }
```


## 四、编写组件

### 1、关于EaseScript语法

请查看 EaseScript 部分

### 2、定义一个Home组件

```ts
package com.views;
import web.components.Component
class Home extends Component{

    //声明Props属性，只有公开的属性或者setter才能接收外部传来的数据
    title:string='Hello';

    //声明Props属性，只有公开的属性或者setter才能接收外部传来的数据
    set name(key){
        this.key = key;
    }

    @Reactive
    private key:string // 声明一个私有属性并标为响应式

    onClick(e){
        //to do....
    }

    @Override
    render(){
        return <div>
            <ui:Button on:click={onClick}>Click</ui:Button>
            <div>{title}</div>
        </div>
    }
```