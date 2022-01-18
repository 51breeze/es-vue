/*
 * Copyright © 2017 EaseScript All rights reserved.
 * Released under the MIT license
 * https://github.com/51breeze/EaseScript
 * @author Jun Ye <664371281@qq.com>
 */
import Component from "./../components/Component.js";
import Class from "./../../core/Class.js";
import Vue from "vue";
var KeepAlive = Vue.component('KeepAlive');
Class.creator(11,KeepAlive,{
	'id':1,
	'global':true,
	'dynamic':false,
	'name':'KeepAlive',
	'inherit':Component
}, false);
export default KeepAlive;