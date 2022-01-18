/*
 * Copyright © 2017 EaseScript All rights reserved.
 * Released under the MIT license
 * https://github.com/51breeze/EaseScript
 * @author Jun Ye <664371281@qq.com>
 */
import Component from "./../components/Component.js";
import Class from "./../../core/Class.js";
import Router from "./../components/Router.js";
import Vue from "vue";
Vue.use( Router );
var Link = Vue.component('RouterLink');
Class.creator(9,Link,{
	'id':1,
	'global':true,
	'dynamic':false,
	'name':'Link',
	'inherit':Component
}, false);
export default Link;