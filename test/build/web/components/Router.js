import Router from "vue-router";
import Component from "./Component.js";
import Vue from "vue";
import Class from "./../../core/Class.js";
/*
 * Copyright © 2017 EaseScript All rights reserved.
 * Released under the MIT license
 * https://github.com/51breeze/EaseScript
 * @author Jun Ye <664371281@qq.com>
 */




Vue.use( Router );
Class.creator(11,Router,{
	'id':1,
	'global':true,
	'dynamic':false,
	'name':'Router'
}, false);
export default Router;