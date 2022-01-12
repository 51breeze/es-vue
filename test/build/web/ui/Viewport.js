import Component from "./../components/Component.js";
import Vue from "vue";
import Class from "./../../core/Class.js";
import Router from "./../components/Router.js";
/*
 * Copyright © 2017 EaseScript All rights reserved.
 * Released under the MIT license
 * https://github.com/51breeze/EaseScript
 * @author Jun Ye <664371281@qq.com>
 */




Vue.use( Router );
var Viewport = Vue.component('RouterView');
Class.creator(12,Viewport,{
	'id':1,
	'global':true,
	'dynamic':false,
	'name':'Viewport',
	'inherit':Component
}, false);
export default Viewport;