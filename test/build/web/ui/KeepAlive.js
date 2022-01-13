import Component from "./../components/Component.js";
import Vue from "vue";
import Class from "./../../core/Class.js";
/*
 * Copyright © 2017 EaseScript All rights reserved.
 * Released under the MIT license
 * https://github.com/51breeze/EaseScript
 * @author Jun Ye <664371281@qq.com>
 */




var KeepAlive = Vue.component('KeepAlive');
Class.creator(12,KeepAlive,{
	'id':1,
	'global':true,
	'dynamic':false,
	'name':'KeepAlive',
	'inherit':Component
}, false);
export default KeepAlive;