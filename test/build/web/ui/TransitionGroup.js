import Transition from "./Transition.js";
import Vue from "vue";
import Class from "./../../core/Class.js";
/*
 * Copyright © 2017 EaseScript All rights reserved.
 * Released under the MIT license
 * https://github.com/51breeze/EaseScript
 * @author Jun Ye <664371281@qq.com>
 */




var TransitionGroup = Vue.component('TransitionGroup');
Class.creator(18,TransitionGroup,{
	'id':1,
	'global':true,
	'dynamic':false,
	'name':'TransitionGroup',
	'inherit':Transition
}, false);
export default TransitionGroup;