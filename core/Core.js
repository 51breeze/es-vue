const Plugin = require('es-javascript/index');
const Builder = require('es-javascript/core/Builder');
const Token = require('es-javascript/core/Token');
const Polyfill = require('es-javascript/core/Polyfill');
const Constant = require('es-javascript/core/Constant');
const ClassBuilder = require('es-javascript/core/ClassBuilder');
const JSXClassBuilder = require('es-javascript/core/JSXClassBuilder');
const JSXTransform = require('es-javascript/core/JSXTransform');

Constant.REFS_DECLARE_PRIVATE_NAME = 'esPrivate'
Constant.REFS_DECLARE_PRIVATE_STATIC = 'esStcPrivate'

module.exports={
    Plugin,
    Builder,
    Polyfill,
    Constant,
    Token,
    ClassBuilder,
    JSXClassBuilder,
    JSXTransform
}