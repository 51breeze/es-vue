var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// lib/index.js
var lib_exports = {};
__export(lib_exports, {
  Plugin: () => Plugin_default2,
  default: () => lib_default,
  getOptions: () => getOptions2
});
module.exports = __toCommonJS(lib_exports);

// node_modules/@easescript/transform/lib/core/Plugin.js
var import_Compilation = __toESM(require("easescript/lib/core/Compilation"));
var import_path6 = __toESM(require("path"));

// node_modules/@easescript/transform/lib/core/Builder.js
var import_Utils20 = __toESM(require("easescript/lib/core/Utils"));

// node_modules/@easescript/transform/lib/core/Context.js
var import_path2 = __toESM(require("path"));
var import_fs2 = __toESM(require("fs"));

// node_modules/@easescript/transform/lib/core/Node.js
var Node = class _Node {
  static is(value) {
    return value ? value instanceof _Node : false;
  }
  static create(type, stack) {
    return new _Node(type, stack);
  }
  constructor(type, stack = null) {
    this.type = type;
    if (stack && stack.node && stack.node.loc) {
      this.loc = stack.node.loc;
    }
  }
};
var Node_default = Node;

// node_modules/@easescript/transform/lib/core/Token.js
var _token = {
  get: () => null,
  create: () => null
};
var Token = class {
  get token() {
    return _token;
  }
  createToken(stack) {
    if (!stack)
      return null;
    const type = stack.toString();
    if (type === "TypeStatement")
      return null;
    if (type === "NewDefinition")
      return null;
    if (type === "CallDefinition")
      return null;
    if (type === "TypeDefinition")
      return null;
    if (type === "TypeGenericDefinition")
      return null;
    if (type === "DeclaratorDeclaration")
      return null;
    return this.token.create(this, stack, type);
  }
  createNode(stack, type) {
    const isString = typeof stack === "string";
    if (!type) {
      type = isString ? stack : stack.toString();
    }
    if (!type)
      return null;
    return Node_default.create(type, isString ? null : stack);
  }
  createIdentifier(value, stack) {
    let node = this.createNode(stack, "Identifier");
    node.value = String(value);
    node.raw = node.value;
    return node;
  }
  createBlockStatement(body) {
    const node = this.createNode("BlockStatement");
    if (Array.isArray(body)) {
      node.body = body;
    } else if (body) {
      throw new Error("BlockStatement body must be array type");
    } else {
      node.body = [];
    }
    return node;
  }
  createBinaryExpression(left, right, operator) {
    const node = this.createNode("BinaryExpression");
    node.left = left;
    node.right = right;
    node.operator = operator;
    return node;
  }
  createAssignmentPattern(left, right) {
    const node = this.createNode("AssignmentPattern");
    node.left = left;
    node.right = right;
    return node;
  }
  createLogicalExpression(left, right, operator = "&&") {
    const node = this.createNode("LogicalExpression");
    node.left = left;
    node.right = right;
    node.operator = operator;
    return node;
  }
  createTemplateLiteral(quasis, expressions) {
    const node = this.createNode("TemplateLiteral");
    node.quasis = quasis;
    node.expressions = expressions;
    return node;
  }
  createTemplateElement(text) {
    const node = this.createNode("TemplateElement");
    node.value = text;
    return node;
  }
  createUpdateExpression(argument, operator, prefix = false) {
    const node = this.createNode("UpdateExpression");
    node.argument = argument;
    node.operator = operator;
    node.prefix = prefix;
  }
  createFunctionExpression(block, params = []) {
    const node = this.createNode("FunctionExpression");
    node.params = params;
    node.body = block;
    return node;
  }
  createFunctionDeclaration(key, block, params = []) {
    const node = this.createFunctionExpression(block, params);
    node.type = "FunctionDeclaration";
    node.key = this.createIdentifier(key);
    return node;
  }
  createArrowFunctionExpression(block, params = []) {
    const node = this.createNode("ArrowFunctionExpression");
    node.params = params;
    node.body = block;
    return node;
  }
  createReturnStatement(argument) {
    const node = this.createNode("ReturnStatement");
    if (argument) {
      node.argument = argument;
    }
    return node;
  }
  createMethodDefinition(key, block, params = []) {
    const node = this.createFunctionExpression(block, params);
    node.type = "MethodDefinition";
    node.key = this.createIdentifier(key);
    return node;
  }
  createObjectExpression(properties2, stack) {
    const node = this.createNode(stack, "ObjectExpression");
    node.properties = properties2 || [];
    return node;
  }
  createArrayExpression(elements, stack) {
    const node = this.createNode(stack, "ArrayExpression");
    node.elements = elements || [];
    return node;
  }
  createObjectPattern(properties2) {
    const node = this.createNode("ObjectPattern");
    node.properties = properties2;
    return node;
  }
  createProperty(key, init, stack) {
    const node = this.createNode(stack, "Property");
    node.key = key;
    node.computed = key.computed;
    node.init = init;
    return node;
  }
  createSpreadElement(argument) {
    const node = this.createNode("SpreadElement");
    node.argument = argument;
    return node;
  }
  createMemberExpression(items, stack) {
    let object = items.shift();
    while (items.length > 1) {
      const _node = this.createNode("MemberExpression");
      _node.object = object;
      _node.property = items.shift();
      object = _node;
    }
    const node = this.createNode(stack, "MemberExpression");
    node.object = object;
    node.property = items.shift();
    return node;
  }
  createComputeMemberExpression(items, stack) {
    const node = this.createMemberExpression(items, stack);
    node.computed = true;
    return node;
  }
  createCallExpression(callee, args, stack) {
    const node = this.createNode(stack, "CallExpression");
    node.callee = callee;
    node.arguments = args;
    return node;
  }
  createNewExpression(callee, args, stack) {
    const node = this.createNode(stack, "NewExpression");
    node.callee = callee;
    node.arguments = args;
    return node;
  }
  createAssignmentExpression(left, right) {
    const node = this.createNode("AssignmentExpression");
    node.left = left;
    node.right = right;
    return node;
  }
  createExpressionStatement(expressions) {
    const node = this.createNode("ExpressionStatement");
    node.expression = expressions;
    return node;
  }
  createMultipleStatement(expressions) {
    const node = this.createNode("MultipleStatement");
    node.expressions = expressions;
    return node;
  }
  createConditionalExpression(test, consequent, alternate) {
    const node = this.createNode("ConditionalExpression");
    node.test = test;
    node.consequent = consequent;
    node.alternate = alternate;
    return node;
  }
  createIfStatement(condition, consequent, alternate) {
    const node = this.createNode("IfStatement");
    node.condition = condition;
    node.consequent = consequent;
    node.alternate = alternate;
    return node;
  }
  createSequenceExpression(items) {
    const node = this.createNode("SequenceExpression");
    node.expressions = items;
    return node;
  }
  createParenthesizedExpression(expression) {
    const node = this.createNode("ParenthesizedExpression");
    node.expression = expression;
    return node;
  }
  createUnaryExpression(argument, operator, prefix = false) {
    const node = this.createNode("UnaryExpression");
    node.argument = argument;
    node.operator = operator;
    node.prefix = prefix;
    return node;
  }
  createVariableDeclaration(kind, items, stack) {
    const node = this.createNode(stack, "VariableDeclaration");
    node.kind = kind;
    node.declarations = items;
    return node;
  }
  createVariableDeclarator(id, init, stack) {
    const node = this.createNode(stack, "VariableDeclarator");
    node.id = id;
    node.init = init;
    return node;
  }
  createLiteral(value, raw, stack) {
    const node = this.createNode(stack, "Literal");
    node.value = value;
    if (raw === void 0) {
      if (typeof value === "string") {
        node.raw = `"${value}"`;
      } else {
        node.raw = String(value);
      }
    } else {
      node.raw = String(value);
    }
    return node;
  }
  createClassDeclaration() {
    const node = this.createNode("ClassDeclaration");
    node.body = this.createBlockStatement();
    return node;
  }
  createPropertyDefinition(key, init, isStatic = false) {
    const node = this.createNode("PropertyDefinition");
    node.key = key;
    node.init = init;
    node.static = isStatic;
    return node;
  }
  createChunkExpression(value, newLine = true, semicolon = false) {
    const node = this.createNode("ChunkExpression");
    node.newLine = newLine;
    node.semicolon = semicolon;
    node.value = value;
    node.raw = value;
    return node;
  }
  createThisExpression(stack) {
    return this.createNode(stack, "ThisExpression");
  }
  createSuperExpression(value, stack) {
    const node = this.createNode(stack, "SuperExpression");
    node.value = value;
    return node;
  }
  createImportDeclaration(source, specifiers, stack) {
    const node = this.createNode(stack, "ImportDeclaration");
    node.source = this.createLiteral(source);
    node.specifiers = specifiers;
    return node;
  }
  createImportSpecifier(local, imported = null, hasAs = false) {
    if (!local)
      return null;
    if (imported && !hasAs) {
      const node = this.createNode("ImportSpecifier");
      node.imported = this.createIdentifier(imported);
      node.local = this.createIdentifier(local);
      return node;
    } else if (hasAs) {
      const node = this.createNode("ImportNamespaceSpecifier");
      node.local = this.createIdentifier(local);
      return node;
    } else {
      const node = this.createNode("ImportDefaultSpecifier");
      node.local = this.createIdentifier(local);
      return node;
    }
  }
  createExportAllDeclaration(source, exported, stack) {
    const node = this.createNode(stack, "ExportAllDeclaration");
    if (exported === "*")
      exported = null;
    node.exported = exported ? this.createIdentifier(exported) : null;
    if (!Node_default.is(source)) {
      node.source = this.createLiteral(source);
    } else {
      node.source = source;
    }
    return node;
  }
  createExportDefaultDeclaration(declaration, stack) {
    const node = this.createNode(stack, "ExportDefaultDeclaration");
    if (!Node_default.is(declaration)) {
      declaration = this.createIdentifier(declaration);
    }
    node.declaration = declaration;
    return node;
  }
  createExportNamedDeclaration(declaration, source = null, specifiers = [], stack = null) {
    const node = this.createNode(stack, "ExportNamedDeclaration");
    if (declaration) {
      node.declaration = declaration;
    } else {
      if (source) {
        if (!Node_default.is(source)) {
          node.source = this.createLiteral(source);
        } else {
          node.source = source;
        }
      }
      if (specifiers.length > 0) {
        node.specifiers = specifiers;
      } else {
        throw new Error(`ExportNamedDeclaration arguments 'declaration' or 'source' must have one`);
      }
    }
    return node;
  }
  createExportSpecifier(local, exported = null, stack = null) {
    const node = this.createNode(stack, "ExportSpecifier");
    if (!Node_default.is(exported || local)) {
      node.exported = this.createIdentifier(exported || local);
    } else {
      node.exported = exported || local;
    }
    if (!Node_default.is(local)) {
      node.local = this.createIdentifier(local);
    } else {
      node.local = local;
    }
    return node;
  }
};
var Token_default = Token;

// node_modules/@easescript/transform/lib/core/Common.js
var import_fs = __toESM(require("fs"));
var import_path = __toESM(require("path"));
var import_Utils = __toESM(require("easescript/lib/core/Utils"));

// node_modules/@easescript/transform/lib/core/Cache.js
function createCache() {
  const records2 = /* @__PURE__ */ new Map();
  function set(key, name, value) {
    let dataset = records2.get(key);
    if (!dataset) {
      records2.set(key, dataset = /* @__PURE__ */ new Map());
    }
    dataset.set(name, value);
    return value;
  }
  function get(key, name) {
    let dataset = records2.get(key);
    return dataset ? dataset.get(name) : null;
  }
  function has(key, name) {
    let dataset = records2.get(key);
    return dataset ? dataset.has(name) : false;
  }
  function del(key, name) {
    let dataset = records2.get(key);
    if (dataset) {
      dataset.delete(name);
      return true;
    }
    return false;
  }
  function clear(key) {
    let dataset = records2.get(key);
    if (dataset) {
      dataset.clear(key);
      return true;
    }
    return false;
  }
  function clearAll() {
    records2.clear();
  }
  return {
    set,
    get,
    has,
    del,
    clear,
    clearAll
  };
}
var records = /* @__PURE__ */ new Map();
function getCacheManager(scope = null) {
  if (scope) {
    let exists = records.get(scope);
    if (!exists) {
      records.set(scope, exists = createCache());
    }
    return exists;
  }
  return createCache();
}

// node_modules/@easescript/transform/lib/core/Common.js
var import_Namespace = __toESM(require("easescript/lib/core/Namespace"));
var import_crypto = require("crypto");
var import_dotenv = __toESM(require("dotenv"));
var import_dotenv_expand = __toESM(require("dotenv-expand"));
var Cache = getCacheManager("common");
var emptyObject = {};
var emptyArray = [];
var annotationIndexers = {
  env: ["name", "value", "expect"],
  runtime: ["platform", "expect"],
  syntax: ["plugin", "expect"],
  plugin: ["name", "expect"],
  version: ["name", "version", "operator", "expect"],
  readfile: ["dir", "load", "suffix", "relative", "lazy", "only", "source"],
  http: ["classname", "action", "param", "data", "method", "config"],
  router: ["classname", "action", "param"],
  alias: ["name", "version"],
  hook: ["type", "version"],
  url: ["source"]
};
var compareOperatorMaps = {
  ">=": "egt",
  "<=": "elt",
  "!=": "neq",
  ">": "gt",
  "<": "lt",
  "=": "eq"
};
var compareOperators = [">=", "<=", "!=", ">", "<", "="];
var beginNumericRE = /^\d+/;
function beginNumericLiteral(value) {
  return beginNumericRE.test(value);
}
function parseMacroAnnotation(annotation) {
  if (!(annotation.isAnnotationDeclaration || annotation.isAnnotationExpression)) {
    return null;
  }
  const annName = annotation.getLowerCaseName();
  const indexes = annotationIndexers[annName];
  if (!indexes) {
    throw new Error(`Annotation arguments is not defined. the '${annName}' annotations.`);
  }
  const args = annotation.getArguments();
  if (!args.length)
    return emptyObject;
  return parseMacroArguments(args, annName, indexes);
}
function parseMacroArguments(args, name, indexes = null) {
  indexes = indexes || annotationIndexers[name];
  const _expect = getAnnotationArgument("expect", args, indexes);
  const expect = _expect ? String(_expect.value).trim() !== "false" : true;
  switch (name) {
    case "runtime":
    case "syntax":
      return {
        value: getAnnotationArgumentValue(args[0]),
        expect
      };
    case "env": {
      const _name = getAnnotationArgument("name", args, indexes);
      const _value = getAnnotationArgument("value", args, indexes);
      if (_value && _name) {
        return {
          name: getAnnotationArgumentValue(_name),
          value: getAnnotationArgumentValue(_value),
          expect
        };
      } else {
        return emptyObject;
      }
    }
    case "version": {
      const name2 = getAnnotationArgument("name", args, indexes);
      const version = getAnnotationArgument("version", args, indexes);
      const operator = getAnnotationArgument("operator", args, indexes);
      if (name2 && version) {
        return {
          name: getAnnotationArgumentValue(name2),
          version: getAnnotationArgumentValue(version),
          operator: getAnnotationArgumentValue(operator) || "elt",
          expect
        };
      } else {
        return emptyObject;
      }
    }
  }
  return null;
}
function parseMacroMethodArguments(args, name) {
  args = args.map((item, index) => {
    let value = null;
    let key = index;
    let assigned = false;
    if (item.isAssignmentExpression) {
      assigned = true;
      key = item.left.value();
      value = item.right.value();
    } else {
      value = item.value();
    }
    return { index, key, value, assigned, stack: item };
  });
  return parseMacroArguments(args, name);
}
function parseReadfileAnnotation(ctx, stack) {
  let args = stack.getArguments();
  let indexes = annotationIndexers.readfile;
  let stackArgs = {};
  let annotArgs = indexes.map((key) => {
    return stackArgs[key] = getAnnotationArgument(key, args, indexes);
  });
  let dirStack = annotArgs[0] && annotArgs[0].stack;
  let [_path, _load, _suffix, _relative, _lazy, _only, _source] = annotArgs.map((item) => {
    return item ? item.value : null;
  });
  if (!_path) {
    return null;
  }
  let dir = String(_path).trim();
  let [load, relative, lazy, only, source] = [_load, _relative, _lazy, _only, _source].map((value) => {
    value = String(value).trim();
    return value == "true" || value === "TRUE";
  });
  let suffixPattern = null;
  if (dir.charCodeAt(0) === 64) {
    dir = dir.slice(1);
    let segs = dir.split(".");
    let precede = segs.shift();
    let latter = segs.pop();
    let options = ctx.plugin[precede];
    if (precede === "options") {
      while (options && segs.length > 0) {
        options = options[segs.shift()];
      }
    }
    if (options && Object.prototype.hasOwnProperty.call(options, latter)) {
      dir = options[latter];
    }
  }
  let rawDir = dir;
  dir = stack.compiler.resolveManager.resolveSource(dir, stack.compilation.file);
  if (!dir) {
    ctx.error(`Readfile not found the '${rawDir}' folders`, dirStack || stack);
    return null;
  }
  if (_suffix) {
    _suffix = String(_suffix).trim();
    if (_suffix.charCodeAt(0) === 47 && _suffix.charCodeAt(_suffix.length - 1) === 47) {
      let index = _suffix.lastIndexOf("/");
      let flags = "";
      if (index > 0 && index !== _suffix.length - 1) {
        flags = _suffix.slice(index);
        _suffix = _suffix(0, index);
      }
      _suffix = suffixPattern = new RegExp(_suffix.slice(1, -1), flags);
    } else {
      _suffix = _suffix.split(",").map((item) => item.trim());
    }
  }
  let extensions = (stack.compiler.options.extensions || []).map((ext) => String(ext).startsWith(".") ? ext : "." + ext);
  if (!extensions.includes(".es")) {
    extensions.push(".es");
  }
  let suffix = _suffix || [...extensions, ".json", ".env", ".js", ".css", ".scss", ".less"];
  const checkSuffix = (file) => {
    if (suffixPattern) {
      return suffixPattern.test(filepath);
    }
    if (suffix === "*")
      return true;
    return suffix.some((item) => file.endsWith(item));
  };
  let files = stack.compiler.resolveFiles(dir).filter(checkSuffix).map(import_Utils.default.normalizePath);
  if (!files.length)
    return null;
  files.sort((a, b) => {
    a = a.replaceAll(".", "/").split("/").length;
    b = b.replaceAll(".", "/").split("/").length;
    return a - b;
  });
  return {
    args: stackArgs,
    dir,
    only,
    suffix,
    load,
    relative,
    source,
    lazy,
    files
  };
}
function parseUrlAnnotation(ctx, stack) {
  const args = stack.getArguments();
  return args.map((arg) => {
    if (arg && arg.resolveFile) {
      const asset = (stack.module || stack.compilation).assets.get(arg.resolveFile);
      if (asset) {
        return {
          id: asset.assign,
          file: asset.file,
          resolve: arg.resolveFile
        };
      }
    }
    return null;
  }).filter(Boolean);
}
function parseEnvAnnotation(ctx, stack) {
  const args = stack.getArguments();
  return args.map((item) => {
    let key = item.assigned ? item.key : item.value;
    let value = ctx.options.metadata.env[key] || process.env[key];
    if (!value && item.assigned) {
      value = item.value;
    }
    let type = typeof value;
    if (value != null && (type === "number" || type === "string" || type === "boolean" || type === "bigint")) {
      return {
        key,
        value
      };
    }
  }).filter(Boolean);
}
function parseHttpAnnotation(ctx, stack) {
  const args = stack.getArguments();
  const indexes = annotationIndexers.http;
  const [moduleClass, actionArg, paramArg, dataArg, methodArg, configArg] = indexes.map((key) => getAnnotationArgument(key, args, indexes));
  const providerModule = moduleClass ? import_Namespace.default.globals.get(moduleClass.value) : null;
  if (!providerModule) {
    ctx.error(`Class '${moduleClass.value}' is not exists.`);
  } else {
    const member = actionArg ? providerModule.getMember(actionArg.value) : null;
    if (!member || !import_Utils.default.isModifierPublic(member) || !(member.isMethodDefinition && !(member.isMethodGetterDefinition || member.isMethodSetterDefinition))) {
      ctx.error(`Method '${moduleClass.value}::${actionArg && actionArg.value}' is not exists.`, actionArg ? actionArg.stack : stack);
    } else {
      return {
        args: {
          data: dataArg,
          param: paramArg,
          config: configArg,
          method: methodArg,
          action: actionArg,
          module: moduleClass
        },
        module: providerModule,
        method: member
      };
    }
  }
  return null;
}
function parseRouterAnnotation(ctx, stack) {
  const args = stack.getArguments();
  const indexes = annotationIndexers.router;
  const [moduleClass, actionArg, paramArg] = indexes.map((key) => getAnnotationArgument(key, args, indexes));
  const module2 = moduleClass ? import_Namespace.default.globals.get(moduleClass.value) : null;
  if (!module2) {
    ctx.error(`Class '${moduleClass.value}' is not exists.`);
  } else {
    if (import_Utils.default.isModule(module2) && module2.isClass && stack.isModuleForWebComponent(module2)) {
      return {
        isWebComponent: true,
        args: {
          module: moduleClass,
          action: actionArg,
          param: paramArg
        },
        module: module2
      };
    } else {
      const method = actionArg ? module2.getMember(actionArg.value) : null;
      if (!method || !import_Utils.default.isModifierPublic(method) || !(method.isMethodDefinition && !(method.isMethodGetterDefinition || method.isMethodSetterDefinition))) {
        ctx.error(`Method '${moduleClass.value}::${actionArg && actionArg.value}' is not exists.`, actionArg ? actionArg.stack : stack);
      } else {
        return {
          isWebComponent: false,
          args: {
            module: moduleClass,
            action: actionArg,
            param: paramArg
          },
          module: module2,
          method
        };
      }
    }
  }
  return null;
}
function parseDefineAnnotation(annotation) {
  const args = annotation.getArguments();
  const data = /* @__PURE__ */ Object.create(null);
  args.forEach((arg) => {
    if (arg.assigned) {
      data[String(arg.key).toLowerCase()] = arg.value;
    } else {
      data[String(arg.value).toLowerCase()] = true;
    }
  });
  return data;
}
function parseHookAnnotation(annotation, pluginVersion = "0.0.0", optionVersion = {}) {
  const args = annotation.getArguments();
  if (args.length >= 1) {
    const [type, version] = getAnnotationArguments(
      args,
      annotationIndexers.hook
    ).map((item) => getAnnotationArgumentValue(item));
    if (version) {
      const result = parseVersionExpression(version, pluginVersion, optionVersion);
      if (result) {
        if (compareVersion(result.left, result.right, result.operator)) {
          return {
            type
          };
        }
      }
      return false;
    } else {
      return {
        type
      };
    }
  } else {
    console.error("[es-transform] Annotations hook missing arguments");
    return false;
  }
}
function parseAliasAnnotation(annotation, pluginVersion, optionVersions = {}) {
  if (!annotation)
    return null;
  const args = annotation.getArguments();
  if (args.length > 0) {
    const indexes = annotationIndexers.alias;
    const [name, version] = getAnnotationArguments(args, indexes).map((arg) => getAnnotationArgumentValue(arg));
    if (name) {
      if (version) {
        const result = parseVersionExpression(version, pluginVersion, optionVersions);
        if (result) {
          if (compareVersion(result.left, result.right, result.operator)) {
            return name;
          }
        }
      } else {
        return name;
      }
    }
  }
  return null;
}
function getModuleAnnotations(module2, allows = [], inheritFlag = true) {
  if (!import_Utils.default.isModule(module2) || !allows.length)
    return emptyArray;
  let key = `getModuleAnnotations:${String(inheritFlag)}:${allows.join("-")}`;
  let old = Cache.get(module2, key);
  if (old)
    return old;
  let result = [];
  module2.getAnnotations((annotation) => {
    if (allows.includes(annotation.getLowerCaseName())) {
      result.push(annotation);
    }
  }, inheritFlag);
  Cache.set(module2, key, result);
  return result;
}
function getMethodAnnotations(methodStack, allows = [], inheritFlag = true) {
  if (!import_Utils.default.isStack(methodStack) || !(methodStack.isMethodDefinition || methodStack.isPropertyDefinition))
    return emptyArray;
  let result = [];
  let key = `getMethodAnnotations:${String(inheritFlag)}:${allows.join("-")}`;
  let old = Cache.get(methodStack, key);
  if (old)
    return old;
  methodStack.findAnnotation(methodStack, (annotation) => {
    if (allows.includes(annotation.getLowerCaseName())) {
      result.push(annotation);
    }
  }, inheritFlag);
  Cache.set(methodStack, key, result);
  return result;
}
function getAnnotationArgument(name, args, indexes = null) {
  name = String(name).toLowerCase();
  let index = args.findIndex((item) => {
    const key = String(item.key).toLowerCase();
    return key === name;
  });
  if (index < 0 && indexes && Array.isArray(indexes)) {
    index = indexes.indexOf(name);
    if (index >= 0) {
      const arg = args[index];
      return arg && !arg.assigned ? arg : null;
    }
  }
  return args[index];
}
function getAnnotationArguments(args, indexes = []) {
  return indexes.map((key) => getAnnotationArgument(key, args, indexes));
}
function getAnnotationArgumentValue(argument) {
  return argument ? argument.value : null;
}
function isRuntime(name, metadata = {}) {
  name = String(name).toLowerCase();
  if (!(name === "client" || name === "server"))
    return false;
  return compare(metadata.platform, name) || compare(process.env.platform, name);
}
function compare(left, right) {
  if (!left || !right)
    return false;
  if (left === right)
    return true;
  left = String(left);
  right = String(right);
  return left.toLowerCase() === right.toLowerCase();
}
function isSyntax(name, value) {
  if (!name)
    return false;
  if (name === value)
    return true;
  return compare(name, value);
}
function isEnv(name, value, options = {}) {
  const metadata = options.metadata || {};
  const env = metadata?.env || {};
  let lower = String(name).toLowerCase();
  if (value !== void 0) {
    if (process.env[name] === value)
      return true;
    if (lower === "mode") {
      if (options.mode === value || "production" === value) {
        return true;
      }
    }
    if (lower === "hot") {
      if (options.hot === value) {
        return true;
      }
    }
    return env[name] === value;
  }
  return false;
}
function toVersion(value) {
  const [a = "0", b = "0", c = "0"] = Array.from(String(value).matchAll(/\d+/g)).map((item) => item ? item[0].substring(0, 2) : "0");
  return [a, b, c].join(".");
}
function compareVersion(left, right, operator = "elt") {
  operator = operator.toLowerCase();
  if (operator === "eq" && left == right)
    return true;
  if (operator === "neq" && left != right)
    return true;
  const toInt = (val) => {
    val = parseInt(val);
    return isNaN(val) ? 0 : val;
  };
  left = String(left).split(".", 3).map(toInt);
  right = String(right).split(".", 3).map(toInt);
  for (let i = 0; i < left.length; i++) {
    let l = left[i] || 0;
    let r = right[i] || 0;
    if (operator === "eq") {
      if (l != r) {
        return false;
      }
    } else {
      if (l != r) {
        if (operator === "gt" && !(l > r)) {
          return false;
        } else if (operator === "egt" && !(l >= r)) {
          return false;
        } else if (operator === "lt" && !(l < r)) {
          return false;
        } else if (operator === "elt" && !(l <= r)) {
          return false;
        } else if (operator === "neq") {
          return true;
        }
        return true;
      }
    }
  }
  return operator === "eq" || operator === "egt" || operator === "elt";
}
function createRoutePath(route, params = {}) {
  if (!route || !route.path || !route.isRoute) {
    throw new Error("route invalid");
  }
  params = Object.assign({}, route.params || {}, params);
  return "/" + route.path.split("/").map((segment, index) => {
    if (segment.charCodeAt(0) === 58) {
      segment = segment.slice(1);
      const optional = segment.charCodeAt(segment.length - 1) === 63;
      if (optional) {
        segment = segment.slice(0, -1);
      }
      if (params[segment]) {
        return params[segment];
      }
      if (!optional) {
        console.error(`[es-transform] Route params the "${segment}" missing default value or set optional. on page-component the "${route.path}"`);
      }
      return null;
    }
    return segment;
  }).filter((val) => !!val).join("/");
}
function getModuleRoutes(module2, allows = ["router"], options = {}) {
  if (!import_Utils.default.isModule(module2) || !module2.isClass)
    return [];
  const routes = [];
  const annotations = getModuleAnnotations(module2, allows);
  if (annotations && annotations.length) {
    annotations.forEach((annotation) => {
      const args = annotation.getArguments();
      let annotName = annotation.getLowerCaseName();
      let method = annotName;
      if (annotName === "router") {
        method = "*";
        const methodArg = getAnnotationArgument("method", args, []);
        if (methodArg) {
          method = String(methodArg.value).toLowerCase();
        }
      }
      const pathArg = getAnnotationArgument("path", args, ["path"]);
      const defaultValue = {};
      const params = args.filter((arg) => !(arg === method || arg === pathArg)).map((item) => {
        return getModuleRouteParamRule(item.assigned ? item.key : item.value, item.stack, defaultValue);
      });
      let withNs = options.routePathWithNamespace?.client;
      let className = module2.getName("/");
      let pathName = pathArg ? pathArg.value : withNs === false ? module2.id : className;
      if (pathName.charCodeAt(0) === 47) {
        pathName = pathName.substring(1);
      }
      if (pathName.charCodeAt(pathName.length - 1) === 47) {
        pathName = pathName.slice(0, -1);
      }
      let segments = [pathName].concat(params);
      let routePath = "/" + segments.join("/");
      let formatRoute = options.formation?.route;
      if (formatRoute) {
        routePath = formatRoute(routePath, {
          pathArg,
          params,
          method,
          defaultParamsValue: defaultValue,
          className: module2.getName()
        }) || routePath;
      }
      routes.push({
        isRoute: true,
        name: className,
        path: routePath,
        params: defaultValue,
        method,
        module: module2
      });
    });
  }
  return routes;
}
function getModuleRouteParamRule(name, annotParamStack, defaultValue = {}) {
  let question = annotParamStack.question || annotParamStack.node.question;
  if (annotParamStack.isAssignmentPattern) {
    if (!question)
      question = annotParamStack.left.question || annotParamStack.left.node.question;
    if (annotParamStack.right.isIdentifier || annotParamStack.right.isLiteral) {
      defaultValue[name] = annotParamStack.right.value();
    } else {
      const gen = new Generator();
      gen.make(this.createToken(annotParamStack.right));
      defaultValue[name] = gen.toString();
    }
  }
  return question ? ":" + name + "?" : ":" + name;
}
function getModuleRedirect(module2) {
  const redirectAnnot = getModuleAnnotations(module2, ["redirect"])[0];
  let redirect = null;
  if (redirectAnnot) {
    const args = redirectAnnot.getArguments();
    if (args[0]) {
      const value = String(args[0].value);
      if (value.startsWith("@")) {
        return value.substring(1);
      }
      if (value.includes("/")) {
        return value;
      }
      const toModule = import_Namespace.default.globals.get(value);
      if (toModule) {
        const routes = getModuleRoutes(toModule);
        const redirectRoute = routes ? routes[0] : null;
        if (redirectRoute) {
          redirect = createRoutePath(redirectRoute);
        } else {
          console.error(`[es-transform] Redirect reference class is not a valid page-component the "${value}"`);
        }
      } else if (value && value.includes(".")) {
        console.error(`[es-transform] Redirect reference class is not exists. the "${value}"`);
      } else if (!value) {
        console.error(`[es-transform] Redirect missing route-path.`);
      }
    }
  }
  return redirect;
}
function parseVersionExpression(expression, pluginVersion = "0.0.0", optionVersions = {}) {
  expression = String(expression).trim();
  const token = compareOperators.find((value) => {
    return expression.includes(value) || expression.includes(compareOperatorMaps[value]);
  });
  if (!token) {
    throw new Error("Version expression operator is invalid. availables:" + compareOperators.join(", "));
  }
  const operation = expression.includes(token) ? token : compareOperatorMaps[token];
  const segs = expression.split(operation, 2).map((val) => val.trim());
  if (!segs[0])
    segs[0] = pluginVersion;
  else if (!segs[1])
    segs[1] = pluginVersion;
  if (segs.length === 2) {
    let left = segs[0];
    let right = segs[1];
    if (!beginNumericLiteral(left)) {
      left = optionVersions[left] || "0.0.0";
    }
    if (!beginNumericLiteral(right)) {
      right = optionVersions[right] || "0.0.0";
    }
    if (left && right) {
      return {
        left: toVersion(left),
        right: toVersion(right),
        operator: compareOperatorMaps[token]
      };
    }
  } else {
    throw new Error("Version expression parse failed");
  }
}
function createFormatImportSpecifiers(stack) {
  return stack.specifiers.map((spec) => {
    if (spec.isImportDefaultSpecifier) {
      return {
        local: spec.value(),
        stack: spec
      };
    } else if (spec.isImportSpecifier) {
      return {
        local: spec.value(),
        imported: spec.imported.value(),
        stack: spec
      };
    } else if (spec.isImportNamespaceSpecifier) {
      return {
        local: spec.value(),
        imported: "*",
        stack: spec
      };
    }
  });
}
function parseImportDeclaration(ctx, stack, context = null, graph = null) {
  let importSource = null;
  if (!context) {
    context = stack.compilation;
  }
  if (!graph && context) {
    graph = ctx.getBuildGraph(context);
  }
  if (stack.source.isLiteral) {
    let compilation = stack.getResolveCompilation();
    let source = stack.getResolveFile() || stack.source.value();
    let specifiers = null;
    let ownerModule = null;
    if (compilation && !compilation.isDescriptorDocument()) {
      source = ctx.getModuleImportSource(source, stack.compilation.file);
      specifiers = createFormatImportSpecifiers(stack);
      ctx.addDepend(compilation);
    } else {
      if (stack.additional && stack.additional.isDeclaratorDeclaration) {
        ownerModule = stack.additional.module;
      }
      let isLocal = import_fs.default.existsSync(source);
      specifiers = createFormatImportSpecifiers(stack);
      source = ctx.getImportAssetsMapping(source, {
        group: "imports",
        source,
        specifiers,
        ctx,
        context
      });
      if (isLocal && source) {
        let asset = ctx.createAsset(source);
        source = ctx.getAssetsImportSource(asset, stack.compilation);
        graph.addAsset(asset);
      }
    }
    if (source) {
      if (specifiers.length > 0) {
        specifiers.forEach((spec) => {
          let local = spec.local;
          if (ownerModule && spec.local === ownerModule.id) {
            local = ctx.getModuleReferenceName(ownerModule, context);
          }
          importSource = ctx.addImport(source, local, spec.imported, spec.stack);
        });
      } else {
        importSource = ctx.addImport(source, null, null, stack.source);
      }
      if (compilation) {
        importSource.setSourceTarget(compilation);
      }
    }
  } else {
    const classModule = stack.description();
    if (classModule && classModule.isModule && ctx.isActiveModule(classModule) && ctx.isNeedBuild(classModule)) {
      let local = stack.alias ? stack.alias.value() : classModule.id;
      let source = ctx.getModuleImportSource(classModule, import_Utils.default.isModule(context) ? context : stack.compilation);
      importSource = ctx.addImport(source, local, null, stack.source);
      importSource.setSourceTarget(classModule);
    }
  }
  if (importSource) {
    importSource.stack = stack;
    if (graph) {
      graph.addImport(importSource);
    }
  }
  return importSource;
}
var allMethods = ["get", "post", "put", "delete", "option", "router"];
function createHttpAnnotationNode(ctx, stack) {
  const result = parseHttpAnnotation(ctx, stack);
  if (!result)
    return null;
  const { param, method, data, config } = result.args;
  const routeConfigNode = createRouteConfigNode(ctx, result.module, result.method, param);
  const createArgNode = (argItem) => {
    if (argItem) {
      if (argItem.stack.isAssignmentPattern) {
        return ctx.createToken(argItem.stack.right);
      } else {
        return ctx.createToken(argItem.stack);
      }
    }
    return null;
  };
  const System = import_Namespace.default.globals.get("System");
  const Http = import_Namespace.default.globals.get("net.Http");
  ctx.addDepend(System, stack.module);
  ctx.addDepend(Http, stack.module);
  const props = {
    data: createArgNode(data),
    options: createArgNode(config),
    method: method && allMethods.includes(method.value) ? ctx.createLiteral(method.value) : null
  };
  const properties2 = Object.keys(props).map((name) => {
    const value = props[name];
    if (value) {
      return ctx.createProperty(ctx.createIdentifier(name), value);
    }
    return null;
  }).filter((item) => !!item);
  let calleeArgs = [
    ctx.createIdentifier(
      ctx.getGlobalRefName(
        stack,
        ctx.getModuleReferenceName(Http, stack.module)
      )
    ),
    routeConfigNode
  ];
  if (properties2.length > 0) {
    calleeArgs.push(ctx.createObjectExpression(properties2));
  }
  return ctx.createCallExpression(
    ctx.createMemberExpression([
      ctx.createIdentifier(
        ctx.getGlobalRefName(
          stack,
          ctx.builder.getModuleReferenceName(System, stack.module)
        )
      ),
      ctx.createIdentifier("createHttpRequest")
    ]),
    calleeArgs,
    stack
  );
}
function createUrlAnnotationNode(ctx, stack) {
  let result = parseUrlAnnotation(ctx, stack);
  if (result.length > 0) {
    let items = result.map((item) => {
      if (item.id)
        return ctx.createIdentifier(item.id);
      return ctx.createLiteral(item.resolve);
    });
    if (items.length > 1) {
      return ctx.createArrayExpression(items);
    } else {
      return items[0];
    }
  }
  return ctx.createLiteral("");
}
function createEmbedAnnotationNode(ctx, stack) {
  let result = parseUrlAnnotation(ctx, stack);
  if (result.length > 0) {
    let items = result.map((item) => {
      if (item.id)
        return ctx.createIdentifier(item.id);
      return ctx.createLiteral(
        ctx.getRelativePath(stack.file, item.resolve)
      );
    });
    if (items.length > 1) {
      return ctx.createArrayExpression(items);
    } else {
      return items[0];
    }
  }
  return ctx.createLiteral("");
}
function createEnvAnnotationNode(ctx, stack) {
  let result = parseEnvAnnotation(ctx, stack);
  if (result.length > 0) {
    let properties2 = result.map((item) => {
      return ctx.createProperty(ctx.createIdentifier(item.key), ctx.createLiteral(item.value));
    });
    return ctx.createObjectExpression(properties2);
  }
  return ctx.createLiteral(null);
}
function createRouterAnnotationNode(ctx, stack) {
  const result = parseRouterAnnotation(ctx, stack);
  if (!result)
    return null;
  if (result.isWebComponent) {
    let route = getModuleRoutes(result.module, ["router"], ctx.options);
    if (route && Array.isArray(route))
      route = route[0];
    if (!route) {
      let routePathNode = ctx.createDefaultRoutePathNode(result.module);
      if (routePathNode) {
        return routePathNode;
      } else {
        return null;
      }
    }
    const paramArg = result.args.param;
    if (!paramArg) {
      return ctx.createLiteral(createRoutePath(route));
    } else {
      const System = import_Namespace.default.globals.get("System");
      const routePath = "/" + route.path.split("/").map((segment) => {
        if (segment.charCodeAt(0) === 58) {
          return "<" + segment.slice(1) + ">";
        }
        return segment;
      }).filter((val) => !!val).join("/");
      let paramNode = ctx.createToken(paramArg.assigned ? paramArg.stack.right : paramArg.stack);
      ctx.addDepend(System, stack.module);
      if (route.params) {
        const defaultParams = ctx.createObjectExpression(
          Object.keys(route.params).map((name) => {
            const value = route.params[name];
            return ctx.createProperty(ctx.createIdentifier(name), ctx.createLiteral(value));
          })
        );
        paramNode = ctx.createCallExpression(
          ctx.createMemberExpression([
            ctx.createIdentifier("Object"),
            ctx.createIdentifier("assign")
          ]),
          [
            defaultParams,
            paramNode
          ]
        );
      }
      return ctx.createCallExpression(
        ctx.createMemberExpression([
          ctx.createIdentifier(
            ctx.getGlobalRefName(
              stack,
              ctx.getModuleReferenceName(System, stack.module)
            ),
            stack
          ),
          ctx.createIdentifier("createHttpRoute", stack)
        ]),
        [
          ctx.createLiteral(routePath),
          paramNode
        ],
        stack
      );
    }
  } else {
    return createRouteConfigNode(ctx, result.module, result.method, result.args.param);
  }
}
function createMainAnnotationNode(ctx, stack) {
  if (!stack || !stack.isMethodDefinition)
    return;
  const main = Array.isArray(stack.annotations) ? stack.annotations.find((stack2) => stack2.getLowerCaseName() === "main") : null;
  if (!main)
    return;
  let callMain = ctx.createCallExpression(
    ctx.createMemberExpression([
      ctx.createIdentifier(stack.module.id),
      ctx.createIdentifier(stack.key.value())
    ])
  );
  const args = main ? main.getArguments() : [];
  const defer = args.length > 0 ? !(String(args[0].value).toLowerCase() === "false") : true;
  if (defer) {
    callMain = ctx.createCallExpression(
      createStaticReferenceNode(ctx, stack, "System", "setImmediate"),
      [
        ctx.createArrowFunctionExpression(callMain)
      ]
    );
  }
  return callMain;
}
function createRouteConfigNode(ctx, module2, method, paramArg) {
  if (!import_Utils.default.isStack(method) || !method.isMethodDefinition) {
    throw new Error(`method invalid`);
  }
  const annotations = method.annotations;
  const annotation = annotations && annotations.find((item) => {
    return allMethods.includes(item.getLowerCaseName());
  });
  const mapNameds = ["path"];
  const args = annotation ? annotation.getArguments() : [];
  const pathArg = annotation ? getAnnotationArgument(mapNameds[0], args, mapNameds) : null;
  const actionName = method.value();
  const value = String(pathArg ? pathArg.value : actionName);
  const defaultParams = [];
  const declareParams = (method.params || []).map((item) => {
    const required = !(item.question || item.isAssignmentPattern);
    const question = required ? "" : "?";
    if (item.isAssignmentPattern) {
      if (item.right.isLiteral) {
        defaultParams.push(ctx.createProperty(ctx.createIdentifier(item.value()), ctx.createToken(item.right)));
      } else {
        item.right.error(10101, item.value());
      }
    }
    return `<${item.value()}${question}>`;
  });
  const uri = declareParams.length > 0 ? [value].concat(declareParams).join("/") : value;
  let url = uri;
  if (uri.charCodeAt(0) !== 47) {
    const withNs = ctx.options.routePathWithNamespace?.server;
    url = withNs ? `/${module2.getName("/")}/${uri}` : `/${module2.id}/${uri}`;
  }
  let allowMethodNode = ctx.createLiteral(annotation ? annotation.getLowerCaseName() : "*");
  let allowMethodNames = annotation ? annotation.getLowerCaseName() : "*";
  if (annotation && annotation.getLowerCaseName() === "router") {
    const allowMethods = args.filter((item) => item !== pathArg);
    if (allowMethods.length > 0) {
      allowMethodNames = allowMethods.map((item) => item.value).join(",");
      allowMethodNode = ctx.createArrayExpression(allowMethods.map((item) => ctx.createLiteral(item.value)));
    } else {
      allowMethodNode = ctx.createLiteral("*");
    }
  }
  let formatRoute = ctx.options.formation?.route;
  if (formatRoute) {
    url = formatRoute(url, {
      action: actionName,
      pathArg: value,
      method: allowMethodNames,
      params: declareParams,
      className: module2.getName()
    }) || url;
  }
  let paramNode = null;
  if (paramArg) {
    if (paramArg.stack.isAssignmentPattern) {
      paramNode = ctx.createToken(paramArg.stack.right);
    } else {
      paramNode = ctx.createToken(paramArg.stack);
    }
  }
  const props = {
    url: ctx.createLiteral(url),
    param: paramNode,
    allowMethod: allowMethodNode
  };
  if (defaultParams.length > 0) {
    props["default"] = ctx.createObjectExpression(defaultParams);
  }
  return ctx.createObjectExpression(
    Object.keys(props).map((name) => {
      const value2 = props[name];
      if (value2) {
        return ctx.createProperty(name, value2);
      }
      return null;
    }).filter((item) => !!item)
  );
}
function createReadfileAnnotationNode(ctx, stack) {
  const result = parseReadfileAnnotation(ctx, stack);
  if (!result)
    return null;
  const addDeps = (source, local) => {
    source = ctx.getSourceFileMappingFolder(source) || source;
    ctx.addImport(source, local);
  };
  const fileMap = {};
  const localeCxt = result.dir.toLowerCase();
  const getParentFile = (pid) => {
    if (fileMap[pid]) {
      return fileMap[pid];
    }
    if (localeCxt !== pid && pid.includes(localeCxt)) {
      return getParentFile(import_path.default.dirname(pid));
    }
    return null;
  };
  const dataset = [];
  const namedMap = /* @__PURE__ */ new Set();
  const only = result.only;
  result.files.forEach((file) => {
    const pid = import_path.default.dirname(file).toLowerCase();
    const named = import_path.default.basename(file, import_path.default.extname(file));
    const id = (pid + "/" + named).toLowerCase();
    const filepath2 = result.relative ? ctx.compiler.getRelativeWorkspacePath(file) : file;
    let item = {
      path: filepath2,
      isFile: import_fs.default.statSync(file).isFile()
    };
    if (item.isFile && result.load) {
      let data = "";
      if (file.endsWith(".env")) {
        const content = import_dotenv.default.parse(import_fs.default.readFileSync(file));
        import_dotenv_expand.default.expand({ parsed: content });
        data = JSON.stringify(content);
      } else {
        if (result.lazy) {
          data = `import('${file}')`;
        } else {
          namedMap.add(file);
          data = ctx.getGlobalRefName(stack, "_" + named.replaceAll("-", "_") + namedMap.size);
          addDeps(file, data);
        }
      }
      item.content = data;
    } else if (result.source) {
      item.content = JSON.stringify(import_fs.default.readFileSync(file));
    }
    const parent = getParentFile(pid);
    if (parent) {
      const children = parent.children || (parent.children = []);
      children.push(item);
    } else {
      fileMap[id + import_path.default.extname(file)] = item;
      dataset.push(item);
    }
  });
  const make = (list) => {
    return list.map((object) => {
      if (only) {
        return object.content ? ctx.createChunkExpression(object.content) : ctx.createLiteral(null);
      }
      const properties2 = [
        ctx.createProperty(
          ctx.createIdentifier("path"),
          ctx.createLiteral(object.path)
        )
      ];
      if (object.isFile) {
        properties2.push(ctx.createProperty(ctx.createIdentifier("isFile"), ctx.createLiteral(true)));
      }
      if (object.content) {
        properties2.push(ctx.createProperty(ctx.createIdentifier("content"), ctx.createChunkExpression(object.content)));
      }
      if (object.children) {
        properties2.push(ctx.createProperty(ctx.createIdentifier("children"), ctx.createArrayExpression(make(object.children))));
      }
      return ctx.createObjectExpression(properties2);
    });
  };
  return ctx.createArrayExpression(make(dataset));
}
function createIdentNode(ctx, stack) {
  if (!stack)
    return null;
  return stack.isIdentifier ? ctx.createIdentifier(stack.value(), stack) : stack.isLiteral ? ctx.createLiteral(stack.value()) : ctx.createToken(stack);
}
function toCamelCase(name) {
  name = String(name);
  if (name.includes("-")) {
    name = name.replace(/-([a-z])/g, (a, b) => b.toUpperCase());
  }
  return name;
}
function toFirstUpperCase(str) {
  return str.substring(0, 1).toUpperCase() + str.substring(1);
}
function createCJSImports(ctx, importManage) {
  let imports = [];
  importManage.getAllImportSource().forEach((importSource) => {
    if (importSource.isExportSource)
      return;
    const properties2 = [];
    importSource.specifiers.forEach((spec) => {
      if (spec.type === "default" || spec.type === "namespace") {
        let requireNode = ctx.createCallExpression(
          ctx.createIdentifier("require"),
          [
            ctx.createLiteral(importSource.sourceId)
          ]
        );
        if (spec.type === "default") {
          const module2 = importSource.getSourceTarget();
          if (import_Utils.default.isCompilation(module2)) {
            requireNode = ctx.createCallExpression(
              createStaticReferenceNode(ctx, null, "Class", "getExportDefault"),
              [
                requireNode
              ]
            );
          }
        }
        const node = ctx.createVariableDeclaration("const", [
          ctx.createVariableDeclarator(
            ctx.createIdentifier(spec.local, importSource.stack),
            requireNode,
            importSource.stack
          )
        ]);
        imports.push(node);
      } else if (spec.type === "specifier") {
        let imported = ctx.createIdentifier(spec.local);
        let local = null;
        if (spec.imported && spec.imported !== spec.local) {
          local = imported;
          imported = ctx.createIdentifier(spec.imported);
        }
        properties2.push(
          ctx.createProperty(
            imported,
            local
          )
        );
      }
    });
    if (properties2.length > 0) {
      const node = ctx.createVariableDeclaration("const", [
        ctx.createVariableDeclarator(
          ctx.createObjectPattern(properties2),
          ctx.createCallExpression(
            ctx.createIdentifier("require"),
            [
              ctx.createLiteral(importSource.sourceId)
            ]
          ),
          importSource.stack
        )
      ]);
      imports.push(node);
    } else if (!(importSource.specifiers.length > 0)) {
      imports.unshift(
        ctx.createExpressionStatement(
          ctx.createCallExpression(
            ctx.createIdentifier("require"),
            [
              ctx.createLiteral(importSource.sourceId)
            ]
          )
        )
      );
    }
  });
  return imports;
}
function createESMImports(ctx, importManage) {
  let imports = [];
  importManage.getAllImportSource().forEach((importSource) => {
    if (importSource.isExportSource)
      return;
    const specifiers = importSource.specifiers.map((spec) => {
      if (spec.type === "default") {
        return ctx.createImportSpecifier(spec.local);
      } else if (spec.type === "specifier") {
        return ctx.createImportSpecifier(spec.local, spec.imported);
      } else if (spec.type === "namespace") {
        return ctx.createImportSpecifier(spec.local, null, true);
      }
    });
    if (importSource.specifiers.length > 0) {
      imports.push(
        ctx.createImportDeclaration(
          importSource.sourceId,
          specifiers,
          importSource.stack
        )
      );
    } else {
      imports.unshift(
        ctx.createImportDeclaration(
          importSource.sourceId,
          specifiers,
          importSource.stack
        )
      );
    }
  });
  return imports;
}
function createCJSExports(ctx, exportManage, graph) {
  let importSpecifiers = /* @__PURE__ */ new Map();
  let imports = [];
  let exports2 = [];
  let declares = [];
  let exportSets = new Set(exportManage.getAllExportSource());
  let properties2 = [];
  let exportAlls = [];
  exportSets.forEach((exportSource) => {
    let importSource = exportSource.importSource;
    let sourceId = importSource ? importSource.sourceId : null;
    if (sourceId) {
      sourceId = ctx.createLiteral(sourceId);
    }
    let specifiers = [];
    graph.addExport(exportSource);
    exportSource.specifiers.forEach((spec) => {
      if (spec.type === "namespace") {
        if (!spec.exported) {
          exportAlls.push(
            ctx.createCallExpression(
              ctx.createIdentifier("require"),
              [
                sourceId
              ],
              spec.stack
            )
          );
        } else {
          properties2.push(
            ctx.createProperty(
              ctx.createIdentifier(spec.exported),
              ctx.createCallExpression(
                ctx.createIdentifier("require"),
                [
                  sourceId
                ]
              ),
              spec.stack
            )
          );
        }
      } else if (spec.type === "default") {
        properties2.push(
          ctx.createProperty(
            ctx.createIdentifier("default"),
            spec.local,
            spec.stack
          )
        );
      } else if (spec.type === "named") {
        if (spec.local.type === "VariableDeclaration") {
          spec.local.declarations.map((decl) => {
            properties2.push(
              ctx.createProperty(
                decl.id,
                decl.init || ctx.createLiteral(null),
                spec.stack
              )
            );
          });
        } else if (spec.local.type === "FunctionDeclaration") {
          declares.push(spec.local);
          properties2.push(
            ctx.createProperty(
              spec.local.key,
              null,
              spec.stack
            )
          );
        }
      } else if (spec.type === "specifier") {
        if (sourceId) {
          let node = ctx.createProperty(
            ctx.createIdentifier(spec.local),
            ctx.createIdentifier(spec.exported),
            spec.stack
          );
          properties2.push(
            ctx.createProperty(
              ctx.createIdentifier(spec.exported),
              null,
              spec.stack
            )
          );
          specifiers.push(node);
        } else {
          let node = ctx.createProperty(
            ctx.createIdentifier(spec.exported),
            ctx.createIdentifier(spec.local),
            spec.stack
          );
          properties2.push(node);
        }
      }
    });
    if (specifiers.length > 0) {
      let dataset = importSpecifiers.get(sourceId);
      if (!dataset) {
        importSpecifiers.set(sourceId, dataset = []);
      }
      dataset.push(...specifiers);
    }
  });
  importSpecifiers.forEach((specifiers, sourceId) => {
    imports.push(
      ctx.createVariableDeclaration("const", [
        ctx.createVariableDeclarator(
          ctx.createObjectPattern(specifiers),
          ctx.createCallExpression(
            ctx.createIdentifier("require"),
            [
              sourceId
            ]
          )
        )
      ])
    );
  });
  if (exportAlls.length > 0 && !properties2.length) {
    if (exportAlls.length === 1) {
      exports2.push(
        ctx.createExpressionStatement(
          ctx.createAssignmentExpression(
            ctx.createChunkExpression("module.exports", false, false),
            exportAlls[0]
          )
        )
      );
    } else {
      let spreads = exportAlls.map((require2) => {
        return ctx.createSpreadElement(
          ctx.createParenthesizedExpression(
            ctx.createLogicalExpression(
              require2,
              ctx.createObjectExpression(),
              "||"
            )
          )
        );
      });
      exports2.push(
        ctx.createExpressionStatement(
          ctx.createAssignmentExpression(
            ctx.createChunkExpression("module.exports", false, false),
            ctx.createObjectExpression(spreads)
          )
        )
      );
    }
  } else if (!exportAlls.length && properties2.length === 1 && properties2[0].key.value === "default") {
    exports2.push(
      ctx.createExpressionStatement(
        ctx.createAssignmentExpression(
          ctx.createChunkExpression("module.exports", false, false),
          properties2[0].init
        )
      )
    );
  } else {
    let spreads = exportAlls.map((require2) => {
      return ctx.createSpreadElement(
        ctx.createParenthesizedExpression(
          ctx.createLogicalExpression(
            require2,
            ctx.createObjectExpression(),
            "||"
          )
        )
      );
    });
    let items = [
      ...spreads,
      ...properties2
    ];
    exports2.push(
      ctx.createExpressionStatement(
        ctx.createAssignmentExpression(
          ctx.createChunkExpression("module.exports", false, false),
          ctx.createObjectExpression(items)
        )
      )
    );
  }
  return { imports, exports: exports2, declares };
}
function createESMExports(ctx, exportManage, graph) {
  let importSpecifiers = /* @__PURE__ */ new Map();
  let exports2 = [];
  let imports = [];
  let declares = [];
  let exportSets = new Set(exportManage.getAllExportSource());
  exportSets.forEach((exportSource) => {
    let importSource = exportSource.importSource;
    let sourceId = importSource ? importSource.sourceId : null;
    let specifiers = [];
    graph.addExport(exportSource);
    exportSource.specifiers.forEach((spec) => {
      if (spec.type === "namespace") {
        exports2.push(
          ctx.createExportAllDeclaration(sourceId, spec.exported, spec.stack)
        );
      } else if (spec.type === "default") {
        exports2.push(
          ctx.createExportDefaultDeclaration(spec.local, spec.stack)
        );
      } else if (spec.type === "named" && !sourceId) {
        exports2.push(
          ctx.createExportNamedDeclaration(spec.local, null, [], spec.stack)
        );
      } else if (spec.type === "specifier") {
        specifiers.push(
          ctx.createExportSpecifier(spec.local, spec.exported, spec.stack)
        );
      }
    });
    if (specifiers.length > 0) {
      let dataset = importSpecifiers.get(sourceId);
      if (!dataset) {
        importSpecifiers.set(sourceId, dataset = []);
      }
      dataset.push(...specifiers);
    }
  });
  importSpecifiers.forEach((specifiers, sourceId) => {
    exports2.push(ctx.createExportNamedDeclaration(null, sourceId, specifiers));
  });
  return { imports, exports: exports2, declares };
}
function isExternalDependency(externals, source, module2 = null) {
  if (Array.isArray(externals) && externals.length > 0) {
    return externals.some((rule) => {
      if (typeof rule === "function") {
        return rule(source, module2);
      } else if (rule instanceof RegExp) {
        return rule.test(source);
      }
      return rule === source;
    });
  }
  return false;
}
function isExcludeDependency(excludes2, source, module2 = null) {
  if (Array.isArray(excludes2) && excludes2.length > 0) {
    return excludes2.some((rule) => {
      if (typeof rule === "function") {
        return rule(source, module2);
      } else if (rule instanceof RegExp) {
        return rule.test(source);
      }
      return rule === source;
    });
  }
  return false;
}
function getMethodOrPropertyAlias(ctx, stack, name = null) {
  if (Cache.has(stack, "getMethodOrPropertyAlias")) {
    return Cache.get(stack, "getMethodOrPropertyAlias");
  }
  let result = getMethodAnnotations(stack, ["alias"]);
  let resolevName = name;
  if (result) {
    const [annotation] = result;
    const value = parseAliasAnnotation(annotation, ctx.plugin.version, ctx.options.metadata.versions);
    if (value) {
      resolevName = value;
    }
  }
  Cache.set(stack, "getMethodOrPropertyAlias", resolevName);
  return resolevName;
}
function getMethodOrPropertyHook(ctx, stack) {
  if (!stack)
    return null;
  if (Cache.has(stack, "getMethodOrPropertyHook")) {
    return Cache.get(stack, "getMethodOrPropertyHook");
  }
  let result = getMethodAnnotations(stack, ["hook"]);
  let invoke = null;
  if (result.length > 0) {
    let annotation = result[0];
    result = parseHookAnnotation(annotation, ctx.plugin.version, ctx.options.metadata.versions);
    if (result) {
      invoke = [
        result.type,
        annotation
      ];
    }
  }
  Cache.set(stack, "getMethodOrPropertyHook", invoke);
  return invoke;
}
function createJSXAttrHookNode(ctx, stack, desc) {
  if (!(stack && stack.isMemberProperty && stack.value && desc))
    return null;
  const hookAnnot = getMethodOrPropertyHook(desc);
  if (hookAnnot) {
    let [type, annotation] = hookAnnot;
    let lower = type && String(type).toLowerCase();
    const hooks = ctx.options.hooks;
    let createdNode = null;
    if (hooks.createJSXAttrValue) {
      createdNode = hooks.createJSXAttrValue({ ctx, type, jsxAttrNode: stack, descriptor: desc, annotation });
    }
    if (!createdNode) {
      if (lower === "compiling:create-route-path") {
        if (stack.value && stack.value.isJSXExpressionContainer) {
          const value = stack.value.description();
          if (value && value.isModule && stack.isModuleForWebComponent(value)) {
            let route = getModuleRoutes(value, ["router"], ctx.options);
            if (route && route[0]) {
              if (Array.isArray(route))
                route = route[0];
              if (route.path) {
                return ctx.createLiteral(createRoutePath(route));
              } else {
                console.error(`[es-transform] Route missing the 'path' property.`);
              }
            }
            return ctx.createLiteral(value.getName("/"));
          }
        }
        return null;
      }
      if (type) {
        const node = ctx.createCallExpression(
          ctx.createMemberExpression([
            ctx.createThisExpression(stack),
            ctx.createIdentifier("invokeHook")
          ]),
          [
            ctx.createLiteral(type),
            ctx.createToken(stack.value),
            ctx.createLiteral(stack.name.value()),
            ctx.createLiteral(desc.module.getName())
          ]
        );
        node.hasInvokeHook = true;
        node.hookAnnotation = annotation;
        return node;
      }
    }
  }
  return null;
}
function createStaticReferenceNode(ctx, stack, className, method) {
  return ctx.createMemberExpression([
    createModuleReferenceNode(ctx, stack, className),
    ctx.createIdentifier(method, stack)
  ]);
}
function createModuleReferenceNode(ctx, stack, className) {
  let gloablModule = import_Namespace.default.globals.get(className);
  if (gloablModule) {
    let context = stack ? stack.module || stack.compilation : null;
    ctx.addDepend(gloablModule, context);
    return ctx.createIdentifier(
      ctx.getModuleReferenceName(gloablModule, context)
    );
  } else {
    throw new Error(`References the '${className}' module is not exists`);
  }
}
function createCommentsNode(ctx, stack) {
  const manifests = ctx.options.manifests || {};
  const enable = ctx.options.comments;
  if (stack.module && (enable || manifests.comments)) {
    const result = stack.parseComments("Block");
    if (result) {
      if (manifests.comments && result.meta) {
        let kind = "class";
        if (stack.isMethodSetterDefinition) {
          kind = "setter";
        } else if (stack.isMethodGetterDefinition) {
          kind = "getter";
        } else if (stack.isMethodDefinition) {
          kind = "method";
        } else if (stack.isPropertyDefinition) {
          kind = "property";
        }
        const vm = ctx.getVModule("manifest.Comments");
        if (vm) {
          let id = stack.module.getName();
          ctx.addDepend(vm);
          let key = stack.value() + ":" + kind;
          if (kind === "class")
            key = "top";
          vm.append(ctx, {
            [id]: { [key]: result.meta }
          });
        }
      }
      if (enable && result.comments.length > 0) {
        return ctx.createChunkExpression(["/**", ...result.comments, "**/"].join("\n"), true);
      }
    }
  }
  return null;
}
var uniqueHashCache = /* @__PURE__ */ Object.create(null);
var uniqueHashResult = /* @__PURE__ */ Object.create(null);
function createUniqueHashId(source, len = 8) {
  let key = source + ":" + len;
  let exists = uniqueHashCache[key];
  if (exists) {
    return exists;
  }
  let value = "";
  let index = 0;
  let _source = source;
  do {
    value = (0, import_crypto.createHash)("sha256").update(_source).digest("hex").substring(0, len);
  } while (uniqueHashResult[value] === true);
  {
    _source = source + ":" + ++index;
  }
  uniqueHashCache[key] = value;
  uniqueHashResult[value] = true;
  return value;
}
async function callAsyncSequence(items, asyncMethod) {
  if (!Array.isArray(items))
    return false;
  if (items.length < 1)
    return false;
  let index = 0;
  items = items.slice(0);
  const callAsync = async () => {
    if (index < items.length) {
      await asyncMethod(items[index], index++);
      await callAsync();
    }
  };
  await callAsync();
}

// node_modules/@easescript/transform/lib/core/ImportSource.js
var import_Utils2 = __toESM(require("easescript/lib/core/Utils"));
var ImportManage = class {
  #records = /* @__PURE__ */ new Map();
  #locals = /* @__PURE__ */ new Map();
  createImportSource(sourceId, local = null, imported = null, stack = null) {
    let key = sourceId;
    if (imported === "*") {
      key += ":*";
    }
    let importSource = this.#records.get(key);
    if (!importSource) {
      this.#records.set(key, importSource = new ImportSource(sourceId));
    }
    if (local) {
      const source = this.#locals.get(local);
      if (source) {
        if (source !== importSource) {
          throw new Error(`declare '${local}' is not redefined`);
        }
      } else {
        this.#locals.set(local, importSource);
      }
      importSource.addSpecifier(local, imported, stack);
    }
    return importSource;
  }
  hasImportSource(sourceId, local = null, isNamespace = false) {
    let key = sourceId;
    if (isNamespace) {
      key += ":*";
    }
    let importSource = this.#records.get(key);
    if (!importSource)
      return false;
    if (local) {
      const source = this.#locals.get(local);
      return importSource === source;
    }
    return true;
  }
  getImportSource(sourceId, isNamespace = false) {
    let key = sourceId;
    if (isNamespace) {
      key += ":*";
    }
    return this.#records.get(key);
  }
  getAllImportSource() {
    return Array.from(this.#records.values()).sort((a, b) => {
      let m1 = a.getSourceTarget();
      let m2 = b.getSourceTarget();
      let a1 = import_Utils2.default.isModule(m1) && m1.getName() === "Class" ? 0 : 1;
      let b1 = import_Utils2.default.isModule(m2) && m2.getName() === "Class" ? 0 : 1;
      return a1 - b1;
    });
  }
};
var ImportSource = class {
  #sourceId = null;
  #specifiers = [];
  #fields = null;
  #stack = null;
  #isExportSource = false;
  #sourceTarget = null;
  #sourceContext = null;
  constructor(sourceId) {
    this.#sourceId = sourceId;
    this.#fields = /* @__PURE__ */ Object.create(null);
  }
  get sourceId() {
    return this.#sourceId;
  }
  get specifiers() {
    return this.#specifiers;
  }
  get stack() {
    return this.#stack;
  }
  set stack(value) {
    this.#stack = value;
  }
  get isExportSource() {
    return this.#isExportSource;
  }
  setSourceTarget(value) {
    if (value) {
      this.#sourceTarget = value;
    }
  }
  getSourceTarget() {
    return this.#sourceTarget;
  }
  setExportSource() {
    this.#isExportSource = true;
  }
  getSpecifier(imported) {
    return this.#fields[imported];
  }
  addSpecifier(local, imported = null, stack = null) {
    if (local) {
      let type = imported ? "specifier" : "default";
      if (imported === "*") {
        type = "namespace";
      }
      let key = local;
      let old = this.#fields[key];
      if (old) {
        if (old.type !== type) {
          console.error("import specifier has inconsistent definitions");
        }
        old.type = type;
        return true;
      }
      let spec = {
        type,
        local,
        imported,
        stack
      };
      this.#fields[key] = spec;
      this.#specifiers.push(spec);
      return true;
    }
  }
};

// node_modules/@easescript/transform/lib/core/ExportSource.js
function getExportType(exported, local) {
  let type = local && typeof local === "string" ? "specifier" : "named";
  if (exported === "default")
    type = "default";
  if (local === "*" || !exported) {
    type = "namespace";
  }
  return type;
}
var ExportManage = class {
  #records = /* @__PURE__ */ new Map();
  #exporteds = /* @__PURE__ */ new Map();
  createExportSource(exported, local = null, importSource = null, stack = null) {
    let key = exported;
    if (!key) {
      key = importSource;
    }
    let old = this.#exporteds.get(key);
    if (old) {
      let oLocal = old.getSpecifier(exported).local;
      let left = Node_default.is(oLocal) && oLocal.type === "Identifier" ? oLocal.value : oLocal;
      let right = Node_default.is(local) && local.type === "Identifier" ? local.value : local;
      if (left !== right || importSource != old.importSource) {
        throw new Error(`Multiple exports with the same name "${exported}"`);
      }
    }
    let exportSource = null;
    if (importSource) {
      exportSource = this.#records.get(importSource);
      if (!exportSource) {
        this.#records.set(importSource, exportSource = new ExportSource(importSource, this));
      }
      this.#exporteds.set(key, exportSource);
    } else {
      exportSource = this.#exporteds.get(key);
      if (!exportSource) {
        this.#exporteds.set(key, exportSource = new ExportSource(null, this));
      }
    }
    exportSource.addSpecifier(exported, local, stack);
    return exportSource;
  }
  bindSource(exported, exportSource) {
    this.#exporteds.set(exported, exportSource);
  }
  hasExportSource(exported) {
    return this.#exporteds.has(exported);
  }
  getExportSource(exported) {
    return this.#exporteds.get(exported);
  }
  getAllExportSource() {
    return Array.from(this.#exporteds.values());
  }
};
var ExportSource = class {
  #importSource = null;
  #specifiers = [];
  #fields = null;
  #stack = null;
  #exportManage = null;
  constructor(importSource, exportManage) {
    this.#importSource = importSource;
    this.#fields = /* @__PURE__ */ Object.create(null);
    this.#exportManage = exportManage;
  }
  get importSource() {
    return this.#importSource;
  }
  get specifiers() {
    return this.#specifiers;
  }
  get stack() {
    return this.#stack;
  }
  set stack(value) {
    this.#stack = value;
  }
  bindExport(exporteds) {
    if (Array.isArray(exporteds)) {
      exporteds.forEach((exported) => {
        this.#exportManage.bindSource(exported, this);
      });
    } else if (typeof exporteds === "string") {
      this.#exportManage.bindSource(exporteds, this);
    }
  }
  getSpecifier(exported) {
    return this.#fields[exported];
  }
  addSpecifier(exported, local = null, stack = null) {
    let type = getExportType(exported, local);
    let old = this.#fields[exported];
    if (old) {
      if (old.type !== type) {
        console.error("export specifier has inconsistent definitions");
      }
      old.type = type;
      return true;
    }
    let spec = {
      type,
      local,
      exported,
      stack
    };
    this.#fields[exported] = spec;
    this.#specifiers.push(spec);
    return true;
  }
};

// node_modules/@easescript/transform/lib/core/VirtualModule.js
var import_Namespace2 = __toESM(require("easescript/lib/core/Namespace"));

// node_modules/@easescript/transform/lib/core/Generator.js
var import_Utils3 = __toESM(require("easescript/lib/core/Utils"));
var import_source_map = __toESM(require("source-map"));
var disabledNewLine = false;
var Generator2 = class {
  #file = null;
  #context = null;
  #sourceMap = null;
  #code = "";
  #line = 1;
  #column = 0;
  #indent = 0;
  constructor(context = null, disableSourceMaps = false) {
    if (context) {
      this.#context = context;
      if (disableSourceMaps !== true) {
        this.#file = context.target.file;
        this.#sourceMap = context.options.sourceMaps ? this.createSourceMapGenerator() : null;
      }
    }
  }
  get file() {
    return this.#file;
  }
  get context() {
    return this.#context;
  }
  get sourceMap() {
    return this.#sourceMap;
  }
  get code() {
    return this.#code;
  }
  get line() {
    return this.#line;
  }
  createSourceMapGenerator() {
    let target = this.context.target;
    let generator = new import_source_map.default.SourceMapGenerator();
    let compi = import_Utils3.default.isModule(target) ? target.compilation : target;
    if (import_Utils3.default.isCompilation(compi) && compi.source) {
      generator.setSourceContent(compi.file, compi.source);
    }
    return generator;
  }
  addMapping(node) {
    if (this.sourceMap) {
      const loc = node.loc;
      if (loc) {
        this.sourceMap.addMapping({
          generated: {
            line: this.#line,
            column: this.getStartColumn()
          },
          source: this.#file,
          original: {
            line: loc.start.line,
            column: loc.start.column
          },
          name: node.type === "Identifier" ? node.value : null
        });
      }
    }
  }
  newBlock() {
    this.#indent++;
    return this;
  }
  endBlock() {
    this.#indent--;
    return this;
  }
  newLine() {
    const len = this.#code.length;
    if (!len)
      return;
    const char = this.#code.charCodeAt(len - 1);
    if (char === 10 || char === 13) {
      return this;
    }
    this.#line++;
    this.#code += "\r\n";
    this.#column = 0;
    return this;
  }
  getStartColumn() {
    if (this.#column === 0) {
      return this.#indent * 4 + 1;
    }
    return this.#column;
  }
  withString(value) {
    if (!value)
      return;
    if (this.#column === 0) {
      this.#column = this.getStartColumn();
      this.#code += "    ".repeat(this.#indent);
    }
    this.#code += value;
    this.#column += value.length || 0;
  }
  withEnd(expr) {
    if (expr) {
      this.withString(expr);
      this.withSemicolon();
    }
    this.newLine();
  }
  withParenthesL() {
    this.withString("(");
  }
  withParenthesR() {
    this.withString(")");
  }
  withBracketL() {
    this.withString("[");
  }
  withBracketR() {
    this.withString("]");
  }
  withBraceL() {
    this.withString("{");
  }
  withBraceR() {
    this.withString("}");
  }
  withSpace() {
    this.withString(" ");
  }
  withDot() {
    this.withString(".");
  }
  withColon() {
    this.withString(":");
  }
  withOperator(value) {
    this.withString(` ${value} `);
  }
  withComma() {
    this.withString(",");
  }
  withSemicolon() {
    const code = this.#code;
    const char = code.charCodeAt(code.length - 1);
    if (char === 59 || char === 10 || char === 13 || char === 32 || char === 125) {
      return this;
    }
    this.withString(";");
    return this;
  }
  withSequence(items, newLine) {
    if (!items)
      return this;
    const len = items.length - 1;
    items.forEach((item, index) => {
      this.make(item);
      if (index < len) {
        this.withString(",");
        if (newLine || item.newLine)
          this.newLine();
      }
    });
    return this;
  }
  make(token) {
    if (!token)
      return;
    switch (token.type) {
      case "ArrayExpression":
      case "ArrayPattern":
        this.withBracketL();
        this.addMapping(token);
        if (token.elements.length > 0) {
          if (token.newLine === true) {
            this.newLine();
            this.newBlock();
          }
          this.withSequence(token.elements, !!token.newLine);
          if (token.newLine === true) {
            this.newLine();
            this.endBlock();
          }
        }
        this.withBracketR();
        break;
      case "ArrowFunctionExpression":
        if (token.async) {
          this.withString("async");
          this.withSpace();
        }
        this.withParenthesL();
        this.withSequence(token.params);
        this.withParenthesR();
        this.withString("=>");
        this.make(token.body);
        break;
      case "AssignmentExpression":
      case "AssignmentPattern":
        this.make(token.left);
        this.addMapping(token);
        if (token.operator) {
          this.withString(token.operator);
        } else {
          this.withString("=");
        }
        this.make(token.right);
        break;
      case "AwaitExpression":
        this.withString("await ");
        this.make(token.argument);
        break;
      case "BinaryExpression":
        this.addMapping(token);
        this.make(token.left);
        this.withOperator(token.operator);
        this.make(token.right);
        break;
      case "BreakStatement":
        this.newLine();
        this.addMapping(token);
        this.withString("break");
        if (token.label) {
          this.withSpace();
          this.make(token.label);
        }
        this.withSemicolon();
        break;
      case "BlockStatement":
        if (token.isWhenStatement) {
          token.body.forEach((item) => this.make(item));
        } else {
          this.withBraceL();
          this.newBlock();
          token.body.length > 0 && this.newLine();
          token.body.forEach((item) => this.make(item));
          this.endBlock();
          token.body.length > 0 && this.newLine();
          this.withBraceR();
        }
        break;
      case "ChunkExpression":
        if (token.value) {
          if (token.newLine !== false) {
            this.newLine();
          }
          let lines = String(token.value).split(/[\r\n]+/);
          lines.forEach((line, index) => {
            this.withString(line);
            if (token.semicolon && index < lines.length) {
              this.withSemicolon();
            }
            if (index < lines.length && token.newLine !== false) {
              this.newLine();
            }
          });
          if (token.semicolon) {
            this.withSemicolon();
          }
          if (token.newLine !== false) {
            this.newLine();
          }
        }
        break;
      case "CallExpression":
        this.addMapping(token);
        this.make(token.callee);
        if (token.isChainExpression) {
          this.withString("?.");
        }
        this.withParenthesL();
        if (token.newLine)
          this.newLine();
        if (token.indentation)
          this.newBlock();
        this.withSequence(token.arguments, token.newLine);
        if (token.indentation)
          this.endBlock();
        if (token.newLine)
          this.newLine();
        this.withParenthesR();
        break;
      case "ClassStatement":
        this.withString("class");
        this.withSpace();
        this.make(token.key);
        if (token.extends) {
          this.withSpace();
          this.withString("extends");
          this.withSpace();
          this.make(token.extends);
        }
        this.make(token.body);
        this.newLine();
        break;
      case "ConditionalExpression":
        this.addMapping(token);
        if (token.newLine)
          this.newLine();
        this.make(token.test);
        this.withOperator("?");
        this.make(token.consequent);
        this.withOperator(":");
        this.make(token.alternate);
        if (token.newLine)
          this.newLine();
        break;
      case "ContinueStatement":
        this.newLine();
        this.addMapping(token);
        this.withString("continue");
        if (token.label) {
          this.withSpace();
          this.make(token.label);
        }
        this.withSemicolon();
        break;
      case "ChainExpression":
        this.make(token.expression);
        break;
      case "DoWhileStatement":
        this.newLine();
        this.withString("do");
        this.make(token.body);
        this.withString("while");
        this.withParenthesL();
        this.make(token.condition);
        this.withParenthesR();
        this.withSemicolon();
        break;
      case "ExpressionStatement":
        this.newLine();
        this.make(token.expression);
        this.withSemicolon();
        break;
      case "MultipleStatement":
        token.expressions.forEach((exp) => this.make(exp));
        this.newLine();
        break;
      case "ExportDefaultDeclaration":
        this.newLine();
        this.addMapping(token);
        this.withString("export default ");
        if (token.declaration.type === "ExpressionStatement") {
          this.make(token.declaration.expression);
        } else {
          this.make(token.declaration);
        }
        this.withSemicolon();
        break;
      case "ExportAllDeclaration":
        this.addMapping(token);
        this.newLine();
        this.withString("export");
        this.withSpace();
        this.withString("*");
        this.withSpace();
        if (token.exported) {
          this.withString("as");
          this.withSpace();
          this.make(token.exported);
          this.withSpace();
        }
        this.withString("from");
        this.withSpace();
        this.make(token.source);
        this.withSemicolon();
        break;
      case "ExportNamedDeclaration":
        this.newLine();
        this.addMapping(token);
        this.withString("export");
        this.withSpace();
        if (token.specifiers && token.specifiers.length > 0) {
          this.withBraceL();
          this.newLine();
          this.newBlock();
          this.withSequence(token.specifiers, true);
          this.endBlock();
          this.newLine();
          this.withBraceR();
        } else if (token.declaration) {
          disabledNewLine = true;
          this.make(token.declaration);
          disabledNewLine = false;
        }
        if (token.source) {
          this.withSpace();
          this.withString("from");
          this.withSpace();
          this.make(token.source);
        }
        this.withSemicolon();
        break;
      case "ExportSpecifier":
        this.addMapping(token);
        this.make(token.local);
        if (token.exported.value !== token.local.value) {
          this.withString(" as ");
          this.make(token.exported);
        }
        break;
      case "ForInStatement":
        this.newLine();
        this.withString("for");
        this.withParenthesL();
        this.make(token.left);
        this.withOperator("in");
        this.make(token.right);
        this.withParenthesR();
        this.make(token.body);
        if (token.body.type !== "BlockStatement") {
          this.withSemicolon();
        }
        break;
      case "ForOfStatement":
        this.newLine();
        this.withString("for");
        this.withParenthesL();
        this.make(token.left);
        this.withOperator("of");
        this.make(token.right);
        this.withParenthesR();
        this.make(token.body);
        if (token.body.type !== "BlockStatement") {
          this.withSemicolon();
        }
        break;
      case "ForStatement":
        this.newLine();
        this.withString("for");
        this.withParenthesL();
        this.make(token.init);
        this.withSemicolon();
        this.make(token.condition);
        this.withSemicolon();
        this.make(token.update);
        this.withParenthesR();
        this.make(token.body);
        if (token.body.type !== "BlockStatement") {
          this.withSemicolon();
        }
        break;
      case "FunctionDeclaration":
      case "MethodDefinition":
      case "MethodGetterDefinition":
      case "MethodSetterDefinition":
        {
          if (token.comments) {
            this.newLine();
            this.make(token.comments);
            this.newLine();
          }
          let isNewLine = token.type === "FunctionDeclaration" || token.kind === "method" || token.kind === "get" || token.kind === "set";
          if (isNewLine && !disabledNewLine && !token.disabledNewLine)
            this.newLine();
          if (token.async) {
            this.withString("async");
            this.withSpace();
          }
          if (token.static && token.kind === "method") {
            this.withString("static");
            this.withSpace();
          }
          if (token.kind === "method") {
            this.make(token.key);
          } else {
            this.withString("function");
            if (token.key && !token.key.computed) {
              this.withSpace();
              this.make(token.key);
            }
          }
          this.withParenthesL();
          this.withSequence(token.params);
          this.withParenthesR();
          this.make(token.body);
          if (isNewLine && !disabledNewLine && !token.disabledNewLine)
            this.newLine();
        }
        break;
      case "FunctionExpression":
        this.addMapping(token);
        if (token.comments) {
          this.newLine();
          this.make(token.comments);
          this.newLine();
        }
        if (token.async) {
          this.withString("async");
          this.withSpace();
        }
        this.withString("function");
        this.withParenthesL();
        this.withSequence(token.params);
        this.withParenthesR();
        this.make(token.body);
        break;
      case "Identifier":
        this.addMapping(token);
        this.withString(token.value);
        break;
      case "IfStatement":
        this.newLine();
        this.withString("if");
        this.withParenthesL();
        this.make(token.condition);
        this.withParenthesR();
        this.make(token.consequent);
        if (token.condition.type !== "BlockStatement") {
          this.withSemicolon();
        }
        if (token.alternate) {
          this.withString("else");
          if (token.alternate.type === "IfStatement") {
            this.withSpace();
          }
          this.make(token.alternate);
          if (token.alternate.type !== "BlockStatement") {
            this.withSemicolon();
          }
        }
        break;
      case "ImportDeclaration":
        this.withString("import");
        this.withSpace();
        let lefts = [];
        let rights = [];
        token.specifiers.forEach((item) => {
          if (item.type === "ImportDefaultSpecifier" || item.type === "ImportNamespaceSpecifier") {
            lefts.push(item);
          } else {
            rights.push(item);
          }
        });
        if (rights.length > 0) {
          if (lefts.length > 0) {
            this.make(lefts[0]);
            this.withComma();
          }
          this.withBraceL();
          this.withSequence(rights);
          this.withBraceR();
          this.withSpace();
          this.withString("from");
          this.withSpace();
        } else if (lefts.length > 0) {
          this.make(lefts[0]);
          this.withSpace();
          this.withString("from");
          this.withSpace();
        }
        this.make(token.source);
        this.withSemicolon();
        this.newLine();
        break;
      case "ImportSpecifier":
        if (token.imported && token.local.value !== token.imported.value) {
          this.make(token.imported);
          this.withOperator("as");
        }
        this.make(token.local);
        break;
      case "ImportNamespaceSpecifier":
        this.withString(" * ");
        this.withOperator("as");
        this.make(token.local);
        break;
      case "ImportDefaultSpecifier":
        this.make(token.local);
        break;
      case "ImportExpression":
        this.withString("import");
        this.withParenthesL();
        this.make(token.source);
        this.withParenthesR();
        break;
      case "LabeledStatement":
        this.newLine();
        this.addMapping(token);
        this.make(token.label);
        this.withString(":");
        this.make(token.body);
        break;
      case "Literal":
        this.addMapping(token);
        if (this.foreSingleQuotationMarks) {
          this.withString(token.raw.replace(/\u0022/g, "'"));
        } else {
          this.withString(token.raw);
        }
        break;
      case "LogicalExpression":
        this.make(token.left);
        this.withOperator(token.operator);
        this.make(token.right);
        break;
      case "MemberExpression":
        this.addMapping(token);
        this.make(token.object);
        if (token.computed) {
          if (token.optional) {
            this.withString("?.");
          }
          this.withBracketL();
          this.make(token.property);
          this.withBracketR();
        } else {
          if (token.optional) {
            this.withString("?.");
          } else {
            this.withString(".");
          }
          this.make(token.property);
        }
        break;
      case "NewExpression":
        this.addMapping(token);
        this.withString("new");
        this.withSpace();
        this.make(token.callee);
        this.withParenthesL();
        this.withSequence(token.arguments);
        this.withParenthesR();
        break;
      case "ObjectExpression":
        this.addMapping(token);
        if (token.comments) {
          this.newLine();
          this.make(token.comments);
          this.newLine();
        }
        this.withBraceL();
        if (token.properties.length > 0) {
          this.newBlock();
          this.newLine();
          this.withSequence(token.properties, true);
          this.newLine();
          this.endBlock();
        }
        this.withBraceR();
        break;
      case "ObjectPattern":
        this.withBraceL();
        this.addMapping(token);
        token.properties.forEach((property, index) => {
          if (property) {
            if (property.type === "RestElement") {
              this.make(property);
            } else {
              this.make(property.key);
              if (property.init && (property.init.type === "AssignmentPattern" || property.key.value !== property.init.value)) {
                this.withColon();
                this.make(property.init);
              }
            }
            if (index < token.properties.length - 1) {
              this.withComma();
            }
          }
        });
        this.withBraceR();
        break;
      case "ParenthesizedExpression":
        if (token.newLine)
          this.newLine();
        this.withParenthesL();
        this.make(token.expression);
        this.withParenthesR();
        if (token.newLine)
          this.newLine();
        break;
      case "Property":
        this.addMapping(token);
        if (token.comments) {
          this.newLine();
          this.make(token.comments);
          this.newLine();
        }
        if (token.computed) {
          this.withBracketL();
          this.make(token.key);
          this.withBracketR();
        } else {
          this.make(token.key);
        }
        if (token.init) {
          this.withColon();
          this.make(token.init);
        }
        break;
      case "PropertyDefinition":
        this.addMapping(token);
        if (token.comments) {
          this.newLine();
          this.make(token.comments);
          this.newLine();
        }
        this.newLine();
        if (token.static) {
          this.withString("static");
          this.withSpace();
        }
        this.make(token.key);
        if (token.init) {
          this.withOperator("=");
          this.make(token.init);
        }
        this.newLine();
        break;
      case "RestElement":
        this.addMapping(token);
        this.withString("...");
        this.withString(token.value);
        break;
      case "ReturnStatement":
        this.addMapping(token);
        this.newLine();
        this.withString("return");
        this.withSpace();
        this.make(token.argument);
        this.withSemicolon();
        break;
      case "SequenceExpression":
        this.withSequence(token.expressions);
        break;
      case "SpreadElement":
        this.withString("...");
        this.addMapping(token);
        this.make(token.argument);
        break;
      case "SuperExpression":
        this.addMapping(token);
        if (token.value) {
          this.withString(token.value);
        } else {
          this.withString("super");
        }
        break;
      case "SwitchCase":
        this.newLine();
        if (token.condition) {
          this.withString("case");
          this.withSpace();
          this.make(token.condition);
        } else {
          this.withString("default");
        }
        this.withSpace();
        this.withColon();
        this.newBlock();
        token.consequent.forEach((item) => this.make(item));
        this.endBlock();
        break;
      case "SwitchStatement":
        this.newLine();
        this.withString("switch");
        this.withParenthesL();
        this.make(token.condition);
        this.withParenthesR();
        this.withBraceL();
        this.newBlock();
        token.cases.forEach((item) => this.make(item));
        this.newLine();
        this.endBlock();
        this.withBraceR();
        break;
      case "TemplateElement":
        this.withString(token.value);
        break;
      case "TemplateLiteral":
        const expressions = token.expressions;
        this.withString("`");
        token.quasis.map((item, index) => {
          const has2 = item.value;
          if (has2) {
            this.make(item);
          }
          if (index < expressions.length) {
            this.withString("$");
            this.withBraceL();
            this.make(expressions[index]);
            this.withBraceR();
          }
        });
        this.withString("`");
        break;
      case "ThisExpression":
        this.addMapping(token);
        this.withString(token.value || "this");
        break;
      case "ThrowStatement":
        this.newLine();
        this.withString("throw");
        this.withSpace();
        this.make(token.argument);
        this.withSemicolon();
        break;
      case "TryStatement":
        this.newLine();
        this.withString("try");
        this.make(token.block);
        this.withString("catch");
        this.withParenthesL();
        this.make(token.param);
        this.withParenthesR();
        this.make(token.handler);
        if (token.finalizer) {
          this.withString("finally");
          this.make(token.finalizer);
        }
        break;
      case "UnaryExpression":
        this.addMapping(token);
        if (token.prefix) {
          this.withString(token.operator);
          if (![33, 43, 45, 126].includes(token.operator.charCodeAt(0))) {
            this.withSpace();
          }
          this.make(token.argument);
        } else {
          this.make(token.argument);
          this.withSpace();
          this.withString(token.operator);
        }
        break;
      case "UpdateExpression":
        this.addMapping(token);
        if (token.prefix) {
          this.withString(token.operator);
          this.make(token.argument);
        } else {
          this.make(token.argument);
          this.withString(token.operator);
        }
        break;
      case "VariableDeclaration":
        this.addMapping(token);
        if (!token.inFor && !disabledNewLine)
          this.newLine();
        this.withString(token.kind);
        this.withSpace();
        this.withSequence(token.declarations);
        if (!token.inFor) {
          this.withSemicolon();
          this.newLine();
        }
        break;
      case "VariableDeclarator":
        this.addMapping(token);
        this.make(token.id);
        if (token.init) {
          this.withOperator("=");
          this.make(token.init);
        }
        break;
      case "WhileStatement":
        this.withString("while");
        this.withParenthesL();
        this.make(token.condition);
        this.withParenthesR();
        this.make(token.body);
        if (token.body.type !== "BlockStatement") {
          this.withSemicolon();
        }
        break;
      case "ClassDeclaration": {
        if (token.comments) {
          this.newLine();
          this.make(token.comments);
          this.newLine();
        }
        this.newLine();
        this.addMapping(token);
        this.withString("class");
        this.withSpace();
        this.make(token.id);
        if (token.extends) {
          this.withSpace();
          this.withString("extends");
          this.make(token.extends);
        }
        this.make(token.body);
        break;
      }
      case "InterfaceDeclaration":
      case "EnumDeclaration":
      case "DeclaratorDeclaration":
      case "PackageDeclaration":
      case "Program":
        token.body.forEach((item) => this.make(item));
        break;
      case "StructTableDeclaration":
        this.genSql(token);
        break;
      case "StructTableMethodDefinition":
        this.make(token.key);
        this.withParenthesL();
        this.withSequence(token.params);
        this.withParenthesR();
        break;
      case "StructTablePropertyDefinition":
        this.withString(" ");
        this.make(token.key);
        if (token.init) {
          if (token.assignment) {
            this.withOperator("=");
            this.make(token.init);
          } else {
            this.withString(" ");
            this.make(token.init);
          }
        }
        break;
      case "StructTableKeyDefinition":
        this.make(token.key);
        this.withString(" ");
        if (token.prefix) {
          this.make(token.prefix);
          this.withString(" ");
        }
        this.make(token.local);
        token.properties.forEach((item) => {
          this.withString(" ");
          this.make(item);
        });
        break;
      case "StructTableColumnDefinition":
        this.make(token.key);
        this.withString(" ");
        token.properties.forEach((item, index) => {
          if (index > 0)
            this.withString(" ");
          this.make(item);
        });
        break;
      case "JSXAttribute":
        {
          let esx = this.#context.options.esx;
          if (esx.raw) {
            this.addMapping(token);
            this.withSpace();
            this.make(token.name);
            if (token.value) {
              this.withString("=");
              this.withString(esx.delimit.attrs.left);
              if (token.value) {
                this.foreSingleQuotationMarks = ops.delimit.attrs.left === '"';
                this.make(token.value);
                this.foreSingleQuotationMarks = false;
              }
              this.withString(ops.delimit.attrs.right);
            }
          } else {
            if (token.parent && token.parent.type === "ObjectExpression") {
              this.make(token.name);
              this.withColon();
              this.make(token.value);
            }
          }
        }
        break;
      case "JSXSpreadAttribute":
        this.addMapping(token);
        this.withString("{...");
        this.make(token.argument);
        this.withString("}");
        break;
      case "JSXNamespacedName":
        this.addMapping(token);
        this.make(token.name);
        break;
      case "JSXExpressionContainer":
        this.addMapping(token);
        if (token.expression) {
          this.withString(token.left || "{");
          this.make(token.expression);
          this.withString(token.right || "}");
        }
        break;
      case "JSXOpeningFragment":
      case "JSXOpeningElement":
        this.addMapping(token);
        this.withString("<");
        this.make(token.name);
        token.attributes.forEach((attribute) => {
          this.make(attribute);
        });
        if (token.selfClosing) {
          this.withString(" />");
        } else {
          this.withString(">");
        }
        break;
      case "JSXClosingFragment":
      case "JSXClosingElement":
        this.addMapping(token);
        this.withString("</");
        this.make(token.name);
        this.withString(">");
        break;
      case "JSXElement":
        this.addMapping(token);
        let has = token.children.length > 0;
        this.make(token.openingElement);
        if (has)
          this.newLine();
        this.newBlock();
        token.children.forEach((child, index) => {
          if (index > 0)
            this.newLine();
          this.make(child);
        });
        this.endBlock();
        if (has)
          this.newLine();
        this.make(token.closingElement);
        this.newLine();
        break;
      case "JSXFragment":
        this.withString("<>");
        this.newLine();
        token.children.forEach((child) => {
          this.make(child);
        });
        this.newLine();
        this.withString("</>");
        this.newLine();
        break;
      case "JSXText":
        this.withString(token.value);
        break;
    }
  }
  genSql(token) {
    this.newLine();
    if (token.comments) {
      this.make(token.comments);
      this.newLine();
    }
    this.withString("create table");
    this.withString(" ");
    this.make(token.id);
    this.withParenthesL();
    this.newLine();
    this.newBlock();
    token.body.forEach((item, index) => {
      if (item.type === "StructTableKeyDefinition" || item.type === "StructTableColumnDefinition") {
        if (index > 0) {
          this.withComma(",");
          this.newLine();
        }
      }
      this.make(item);
    });
    this.endBlock();
    this.newLine();
    this.withParenthesR();
    token.properties.forEach((item) => this.make(item));
    this.withSemicolon();
    this.newLine();
  }
  toString() {
    return this.#code;
  }
};
var Generator_default = Generator2;

// node_modules/@easescript/transform/lib/core/Constant.js
var Constant_exports = {};
__export(Constant_exports, {
  KIND_ACCESSOR: () => KIND_ACCESSOR,
  KIND_CLASS: () => KIND_CLASS,
  KIND_CONST: () => KIND_CONST,
  KIND_ENUM: () => KIND_ENUM,
  KIND_ENUM_PROPERTY: () => KIND_ENUM_PROPERTY,
  KIND_INTERFACE: () => KIND_INTERFACE,
  KIND_METHOD: () => KIND_METHOD,
  KIND_VAR: () => KIND_VAR,
  MODIFIER_ABSTRACT: () => MODIFIER_ABSTRACT,
  MODIFIER_FINAL: () => MODIFIER_FINAL,
  MODIFIER_PRIVATE: () => MODIFIER_PRIVATE,
  MODIFIER_PROTECTED: () => MODIFIER_PROTECTED,
  MODIFIER_PUBLIC: () => MODIFIER_PUBLIC,
  MODIFIER_STATIC: () => MODIFIER_STATIC,
  PRIVATE_NAME: () => PRIVATE_NAME
});
var KIND_CLASS = 1 << 0;
var KIND_INTERFACE = 1 << 1;
var KIND_ENUM = 1 << 2;
var KIND_VAR = 1 << 3;
var KIND_CONST = 1 << 4;
var KIND_METHOD = 1 << 5;
var KIND_ACCESSOR = 1 << 6;
var KIND_ENUM_PROPERTY = 1 << 7;
var MODIFIER_STATIC = 1 << 8;
var MODIFIER_PUBLIC = 1 << 9;
var MODIFIER_PROTECTED = 1 << 10;
var MODIFIER_PRIVATE = 1 << 11;
var MODIFIER_ABSTRACT = 1 << 12;
var MODIFIER_FINAL = 1 << 13;
var PRIVATE_NAME = "_private";

// node_modules/@easescript/transform/lib/core/VirtualModule.js
var VirtualModule = class {
  #id = "";
  #ns = [];
  #file = null;
  #content = "";
  #ext = ".virtual";
  #exports = [];
  #imports = [];
  #changed = true;
  #references = /* @__PURE__ */ new Map();
  #after = false;
  #sourcemap = false;
  #disableCreateClass = false;
  constructor(id, ns) {
    this.#id = id;
    this.#ns = Array.isArray(ns) ? ns : String(ns).split(".");
  }
  set after(value) {
    this.#after = !!value;
  }
  get after() {
    return this.#after;
  }
  get ns() {
    return this.#ns;
  }
  get id() {
    return this.#id;
  }
  get bindModule() {
    return import_Namespace2.default.globals.get(this.getName());
  }
  get file() {
    return this.#file || this.getName("/") + this.#ext;
  }
  set file(value) {
    this.#file = value;
  }
  get ext() {
    return this.#ext;
  }
  set ext(value) {
    this.#ext = value;
  }
  get imports() {
    return this.#imports;
  }
  get exports() {
    return this.#exports;
  }
  get changed() {
    return this.#changed;
  }
  set changed(value) {
    this.#changed = value;
  }
  disableCreateClass() {
    this.#disableCreateClass = true;
  }
  addExport(exported, local = null, importSource = null, stack = null) {
    let has = this.#exports.some((item) => item[0] === exported);
    if (!has) {
      this.#exports.push([exported, local, importSource, stack]);
    }
  }
  addImport(source, local = null, imported = null) {
    let has = this.#imports.some((item) => item[0] === source && item[1] === local);
    if (!has) {
      this.#imports.push([source, local, imported]);
    }
  }
  addReference(className, local = null) {
    local = local || String(className).split(".").pop();
    this.#references.set(className, local);
  }
  getReferenceName(className) {
    return this.#references.get(className);
  }
  getReferences() {
    return this.#references;
  }
  getName(seg = ".") {
    return this.#ns.concat(this.#id).join(seg);
  }
  getSourcemap() {
    return this.#sourcemap;
  }
  setSourcemap(map) {
    this.#sourcemap = map;
  }
  getContent() {
    return this.#content;
  }
  setContent(content) {
    this.#content = content;
    this.#changed = true;
  }
  createImports(ctx, graph) {
    this.#imports.forEach((args) => {
      let [source, local, imported] = args;
      ctx.createRequire(ctx.target, graph, source, local, imported);
    });
  }
  createExports(ctx) {
    let exportName = this.id;
    this.#exports.forEach(([exported, local, importSource, stack]) => {
      if (exported === "default") {
        if (typeof local === "string") {
          exportName = local;
        } else if (local.type === "Identifier") {
          exportName = local.value;
        }
      }
      if (typeof local === "string") {
        local = ctx.createIdentifier(local);
      }
      ctx.addExport(exported, local, importSource, stack);
    });
    return exportName;
  }
  createReferences(ctx) {
    let context = this.bindModule || this;
    this.getReferences().forEach((local, classname) => {
      let module2 = import_Namespace2.default.globals.get(classname);
      if (module2) {
        ctx.addDepend(module2, context);
      } else {
        ctx.error(`[ES-TRANSFORM] References "${classname}" not found.`);
      }
    });
  }
  gen(ctx, graph, body = []) {
    let imports = [];
    let exports2 = [];
    let exportNodes = null;
    let importNodes = null;
    if (ctx.options.module === "cjs") {
      importNodes = createCJSImports(ctx, ctx.imports);
      exportNodes = createCJSExports(ctx, ctx.exports, graph);
    } else {
      importNodes = createESMImports(ctx, ctx.imports);
      exportNodes = createESMExports(ctx, ctx.exports, graph);
    }
    imports.push(...importNodes, ...exportNodes.imports);
    body.push(...exportNodes.declares);
    exports2.push(...exportNodes.exports);
    const generator = new Generator_default(ctx, true);
    const layout = [
      ...imports,
      ctx.createChunkExpression(this.getContent()),
      ...body,
      ...exports2
    ];
    layout.forEach((item) => generator.make(item));
    return generator;
  }
  async build(ctx, graph) {
    if (!this.#changed && graph.code)
      return graph;
    this.#changed = false;
    this.createImports(ctx, graph);
    this.createReferences(ctx);
    let module2 = this.bindModule;
    let emitFile = ctx.options.emitFile;
    let body = [];
    let exportName = this.createExports(ctx);
    if (this.id === "Class" && this.#ns.length === 0) {
      let properties2 = Object.keys(Constant_exports).map((key) => {
        if (key === "PRIVATE_NAME")
          return;
        return ctx.createProperty(
          ctx.createIdentifier(key),
          ctx.createLiteral(Constant_exports[key])
        );
      }).filter(Boolean);
      properties2.sort((a, b) => {
        return a.init.value - b.init.value;
      });
      body.push(
        ctx.createExpressionStatement(
          ctx.createAssignmentExpression(
            ctx.createMemberExpression([
              ctx.createIdentifier("Class"),
              ctx.createIdentifier("constant")
            ]),
            ctx.createObjectExpression(properties2)
          )
        )
      );
    } else if (!this.#disableCreateClass) {
      body.push(
        this.createClassDescriptors(ctx, exportName, this.id)
      );
    }
    if (module2) {
      ctx.createDeclaratorModuleImportReferences(module2, module2, graph);
    }
    ctx.createAllDependencies();
    let generator = this.gen(ctx, graph, body);
    graph.code = generator.code;
    graph.sourcemap = generator.sourceMap ? generator.sourceMap.toJSON() : null;
    this.setSourcemap(graph.sourcemap);
    if (emitFile) {
      graph.outfile = ctx.getOutputAbsolutePath(this);
    }
    return graph;
  }
  createClassDescriptors(ctx, exportName, className) {
    return ctx.createCallExpression(
      createStaticReferenceNode(ctx, null, "Class", "creator"),
      [
        ctx.createIdentifier(exportName),
        ctx.createObjectExpression([
          ctx.createProperty(
            ctx.createIdentifier("m"),
            ctx.createLiteral(KIND_CLASS | MODIFIER_PUBLIC)
          ),
          ctx.createProperty(
            ctx.createIdentifier("name"),
            ctx.createLiteral(className)
          )
        ])
      ]
    );
  }
};
function isVModule(value) {
  return value ? value instanceof VirtualModule : false;
}
function getVirtualModuleManager(VirtualModuleFactory) {
  const virtualization = /* @__PURE__ */ new Map();
  function createVModule(sourceId, factory = VirtualModuleFactory) {
    let isSymbol = typeof sourceId === "symbol";
    if (!isSymbol) {
      sourceId = Array.isArray(sourceId) ? sourceId.join(".") : String(sourceId);
    }
    let old = virtualization.get(sourceId);
    if (old)
      return old;
    if (isSymbol) {
      let vm = new factory(sourceId, []);
      virtualization.set(sourceId, vm);
      return vm;
    } else {
      let segs = sourceId.split(".");
      let vm = new factory(segs.pop(), segs);
      virtualization.set(sourceId, vm);
      return vm;
    }
  }
  function getVModule(sourceId) {
    return virtualization.get(sourceId);
  }
  function hasVModule(sourceId) {
    return virtualization.has(sourceId);
  }
  function getVModules() {
    return Array.from(virtualization.values());
  }
  function setVModule(sourceId, vm) {
    return virtualization.set(sourceId, vm);
  }
  return {
    createVModule,
    isVModule,
    hasVModule,
    setVModule,
    getVModules,
    getVModule
  };
}

// node_modules/@easescript/transform/lib/core/Context.js
var import_Utils4 = __toESM(require("easescript/lib/core/Utils"));
var import_Range = __toESM(require("easescript/lib/core/Range"));
var Context = class _Context extends Token_default {
  static is(value) {
    return value ? value instanceof _Context : false;
  }
  #target = null;
  #dependencies = /* @__PURE__ */ new Map();
  #plugin = null;
  #nodes = /* @__PURE__ */ new Map();
  #imports = new ImportManage();
  #exports = new ExportManage();
  #afterBody = [];
  #beforeBody = [];
  #variables = null;
  #graphs = null;
  #assets = null;
  #virtuals = null;
  #glob = null;
  #cache = null;
  #token = null;
  #table = null;
  #vnodeHandleNode = null;
  constructor(compiOrVModule, plugin2, variables, graphs, assets, virtuals, glob, cache, token, table) {
    super();
    this.#plugin = plugin2;
    this.#target = compiOrVModule;
    this.#variables = variables;
    this.#graphs = graphs;
    this.#assets = assets;
    this.#virtuals = virtuals;
    this.#glob = glob;
    this.#cache = cache;
    this.#token = token;
    this.#table = table;
  }
  get plugin() {
    return this.#plugin;
  }
  get compiler() {
    return this.#plugin.complier;
  }
  get target() {
    return this.#target;
  }
  get options() {
    return this.#plugin.options;
  }
  get imports() {
    return this.#imports;
  }
  get exports() {
    return this.#exports;
  }
  get afterBody() {
    return this.#afterBody;
  }
  get beforeBody() {
    return this.#beforeBody;
  }
  get variables() {
    return this.#variables;
  }
  get graphs() {
    return this.#graphs;
  }
  get assets() {
    return this.#assets;
  }
  get virtuals() {
    return this.#virtuals;
  }
  get cache() {
    return this.#cache;
  }
  get glob() {
    return this.#glob;
  }
  get token() {
    return this.#token;
  }
  get table() {
    return this.#table;
  }
  get dependencies() {
    return this.#dependencies;
  }
  addBuildAfterDep(dep) {
    const ctx = this.plugin.context;
    ctx.addBuildAfterDep(dep);
  }
  createAsset(source) {
    let asset = this.assets.createAsset(source);
    if (asset) {
      asset.initialize(this);
    }
    return asset;
  }
  createStyleAsset(source, index) {
    let asset = this.assets.createStyleAsset(source, index);
    if (asset) {
      asset.initialize(this);
    }
    return asset;
  }
  getVModule(sourceId) {
    return this.virtuals.getVModule(sourceId);
  }
  hasVModule(sourceId) {
    return this.virtuals.hasVModule(sourceId);
  }
  isVModule(module2) {
    if (module2) {
      if (module2.isDeclaratorModule) {
        return this.hasVModule(module2.getName());
      } else if (this.virtuals.isVModule(module2)) {
        return true;
      }
    }
    return false;
  }
  addNodeToAfterBody(node) {
    if (node) {
      let afterBody = this.#afterBody || (this.#afterBody = []);
      afterBody.push(node);
    }
    return node;
  }
  addNodeToBeforeBody(node) {
    if (node) {
      let beforeBody = this.#beforeBody || (this.#beforeBody = []);
      beforeBody.push(node);
    }
    return node;
  }
  addImport(source, local = null, imported = null, stack = null) {
    return this.#imports.createImportSource(source, local, imported, stack);
  }
  getImport(source, isNamespace = false) {
    return this.#imports.getImportSource(source, isNamespace);
  }
  hasImport(source, local = null, isNamespace = false) {
    return this.#imports.hasImportSource(source, local, isNamespace);
  }
  addExport(exported, local = null, importSource = null, stack = null) {
    return this.#exports.createExportSource(exported, local, importSource, stack);
  }
  hasExport(exported) {
    return this.#exports.hasExportSource(exported);
  }
  addDepend(dep, context = null) {
    context = context || this.target;
    let deps = this.#dependencies.get(context);
    if (!deps) {
      this.#dependencies.set(context, deps = /* @__PURE__ */ new Set());
    }
    deps.add(dep);
  }
  getDependencies(context = null) {
    context = context || this.target;
    return this.#dependencies.get(context);
  }
  getAllDependencies() {
    const deps = /* @__PURE__ */ new Set();
    this.#dependencies.forEach((dataset) => {
      dataset.forEach((dep) => deps.add(dep));
    });
    return deps;
  }
  isUsed(module2, context = null) {
    if (!module2)
      return false;
    context = context || this.target;
    let deps = this.#dependencies.get(context);
    if (deps && deps.has(module2)) {
      return true;
    }
    if (this.isVModule(module2))
      return true;
    return module2.compilation === this.target;
  }
  isActiveModule(depModule, context = null) {
    if (!depModule)
      return false;
    context = context || this.target;
    if (!this.isUsed(depModule, context))
      return false;
    if (depModule.isDeclaratorModule) {
      if (this.hasVModule(depModule.getName())) {
        return true;
      }
      if (this.isDeclaratorModuleDependency(depModule)) {
        return true;
      }
      return false;
    } else {
      if (isVModule(depModule))
        return true;
      if (context) {
        return !import_Utils4.default.checkDepend(context, depModule);
      }
      return true;
    }
  }
  isNeedBuild(module2) {
    if (!module2)
      return false;
    if (isVModule(module2))
      return true;
    if (this.cache.has(module2, "isNeedBuild")) {
      return this.cache.has(module2, "isNeedBuild");
    }
    let result = this.compiler.isPluginInContext(this.plugin, module2);
    if (result) {
      const annots = getModuleAnnotations(module2, ["runtime", "syntax"]);
      if (annots.length > 0) {
        result = annots.every((annot) => {
          const data = parseMacroAnnotation(annot);
          if (!data) {
            throw new Error("Annotations parse data exception.");
          }
          const name = annot.getLowerCaseName();
          switch (name) {
            case "runtime":
              return isRuntime(data.value, this.options.metadata || {}) === data.expect;
            case "syntax":
              return isSyntax(data.value, this.plugin.version) === data.expect;
          }
          return false;
        });
      }
    }
    this.cache.has(module2, "isNeedBuild", result);
    return result;
  }
  hasDeclareModule(module2) {
    if (import_Utils4.default.isCompilation(this.target)) {
      if (this.target.modules.has(module2.getName())) {
        return true;
      }
      return this.target.importModuleNameds.has(module2);
    } else if (import_Utils4.default.isModule(this.target)) {
      const vm = this.getVModule(this.target.getName());
      if (vm) {
        return !!vm.getReferenceName(module2.getName());
      }
    }
    return false;
  }
  setNode(stack, node) {
    this.#nodes.set(stack, node);
  }
  getNode(stack) {
    return this.#nodes.get(stack);
  }
  removeNode(stack) {
    this.#nodes.delete(stack);
  }
  getHashId(len = 8) {
    let target = this.#target;
    if (import_Utils4.default.isCompilation(target)) {
      let file = target.file || Array.from(target.modules.values()).map((m) => m.getName()).join(",");
      return createUniqueHashId(file, len);
    } else if (isVModule(target) || import_Utils4.default.isModule(target)) {
      return createUniqueHashId(target.getName(), len);
    } else {
      throw new Error("Invalid target");
    }
  }
  getModuleReferenceName(module2, context = null) {
    let name = null;
    if (isVModule(module2)) {
      let m = module2.bindModule;
      if (!m) {
        name = module2.getName("_");
        return this.getGlobalRefName(null, name);
      } else {
        module2 = m;
      }
    } else if (!import_Utils4.default.isModule(module2)) {
      return null;
    }
    if (!context)
      context = this.target;
    if (import_Utils4.default.isModule(context)) {
      if (context.isDeclaratorModule) {
        const vm = this.getVModule(context.getName());
        if (vm) {
          name = vm.getReferenceName(module2.getName());
        }
      }
      if (!name) {
        name = context.getReferenceNameByModule(module2);
      }
    } else if (import_Utils4.default.isCompilation(context)) {
      name = context.getReferenceName(module2);
    }
    if (this.hasDeclareModule(module2)) {
      return name;
    }
    if (!name) {
      name = module2.getName("_");
    }
    return this.getGlobalRefName(null, name);
  }
  isDeclaratorModuleDependency(module2) {
    if (!import_Utils4.default.isClassType(module2))
      return false;
    if (module2.required && module2.isAnnotationCreated) {
      return true;
    } else if (module2.isDeclaratorModule) {
      return module2.getImportDeclarations().some((item) => {
        if (item.isImportDeclaration && item.source.isLiteral) {
          return item.specifiers.some((spec) => spec.value() === module2.id);
        }
        return false;
      });
    }
    return false;
  }
  isES6ClassModule(module2) {
    const annots = getModuleAnnotations(module2, ["define"], false);
    return annots.some((annot) => {
      const data = parseDefineAnnotation(annot);
      return data.es6class;
    });
  }
  isLoadAssetsRawCode(stack, resolveFile) {
    if (!stack || !resolveFile)
      return false;
    if (!stack.isAnnotationDeclaration)
      return false;
    if (stack.getLowerCaseName() !== "embed")
      return false;
    if (/\.[m|c]?js$/i.test(resolveFile))
      return true;
    return this.compiler.isExtensionFile(resolveFile);
  }
  createDeclaratorModuleImportReferences(module2, context, graph = null) {
    if (!import_Utils4.default.isModule(module2))
      return;
    if (!graph && context) {
      graph = this.getBuildGraph(context);
    }
    this.createRequires(module2, context, graph);
    this.createModuleImportReferences(module2, context, graph);
  }
  createModuleImportReferences(module2, context = null, graph = null) {
    if (!import_Utils4.default.isModule(module2))
      return;
    if (!graph) {
      graph = this.getBuildGraph(module2);
    }
    module2.getImportDeclarations().forEach((item) => {
      if (item.source.isLiteral) {
        parseImportDeclaration(this, item, context || module2, graph);
      }
    });
  }
  resolveAsset(rawAsset, context) {
    if (rawAsset.file) {
      let source = rawAsset.resolve;
      let specifiers = null;
      if (rawAsset.assign) {
        specifiers = [
          {
            local: rawAsset.assign,
            stack: rawAsset.stack
          }
        ];
      }
      source = this.getImportAssetsMapping(source, {
        group: "imports",
        source,
        specifiers,
        ctx: this,
        context
      });
      if (source) {
        let asset = this.createAsset(source);
        asset.file = rawAsset.resolve;
        if (rawAsset.assign) {
          asset.local = rawAsset.assign;
        }
        return { asset, specifiers };
      }
    } else {
      let { index, type, attrs = {} } = rawAsset;
      let lang = attrs.lang || attrs.type || "css";
      let suffix = "file." + lang;
      let _attrs = { ...attrs, index, type, lang, [suffix]: "" };
      if (_attrs.scoped) {
        _attrs.scoped = this.getHashId();
      }
      let source = this.getModuleResourceId(context, _attrs);
      let webpack = this.options.webpack || {};
      if (webpack.enable) {
        source = [...webpack.inlineStyleLoader || [], source].join("!");
      }
      let asset = this.createStyleAsset(source, index);
      asset.code = rawAsset.content;
      asset.attrs = _attrs;
      return { asset };
    }
    return null;
  }
  createAssets(context, graph) {
    const assets = context.assets;
    if (assets && assets.size > 0) {
      assets.forEach((rawAsset) => {
        let { asset, specifiers } = this.resolveAsset(rawAsset, context);
        if (asset) {
          if (graph)
            graph.addAsset(asset);
          let source = this.getAssetsImportSource(asset, context);
          if (source) {
            let importSource = null;
            if (specifiers && specifiers.length > 0) {
              specifiers.forEach((spec) => {
                importSource = this.addImport(source, spec.local, spec.imported);
              });
            } else {
              importSource = this.addImport(source);
            }
            importSource.setSourceTarget(asset);
            if (graph) {
              graph.addImport(importSource);
            }
          }
        }
      });
    }
  }
  createRequires(module2, context, graph) {
    const requires = module2.requires;
    if (requires && requires.size > 0) {
      requires.forEach((item) => {
        let local = item.name;
        if (import_Utils4.default.isStack(item.stack) && item.stack.parentStack && item.stack.parentStack.isAnnotationDeclaration) {
          let additional = item.stack.parentStack.additional;
          if (additional && additional.isDeclaratorDeclaration && additional.module.id === local) {
            local = this.getModuleReferenceName(additional.module, context);
          }
        }
        this.createRequire(
          module2,
          graph,
          item.from,
          local,
          item.namespaced ? "*" : item.key
        );
      });
    }
  }
  createRequire(context, graph, source, local, imported = null) {
    if (!source)
      return;
    let specifiers = [{
      local,
      imported
    }];
    let target = source;
    source = this.getImportAssetsMapping(source, {
      group: "imports",
      source,
      specifiers,
      context: this,
      owner: context
    });
    if (source) {
      let importSource = null;
      if (specifiers.length > 0) {
        specifiers.forEach((spec) => {
          importSource = this.addImport(source, spec.local, spec.imported);
        });
      } else {
        importSource = this.addImport(source);
      }
      if (importSource) {
        importSource.setSourceTarget(target);
      }
      if (importSource && graph) {
        graph.addImport(importSource);
      }
    }
  }
  crateModuleAssets(module2) {
    if (!import_Utils4.default.isModule(module2))
      return;
    const graph = this.getBuildGraph(module2);
    this.createAssets(module2, graph);
    this.createRequires(module2, null, graph);
  }
  crateRootAssets() {
    const compilation = this.target;
    if (compilation) {
      const graph = this.getBuildGraph(compilation);
      this.createAssets(compilation, graph);
      this.createRequires(compilation, null, graph);
    }
  }
  createAllDependencies() {
    const target = this.target;
    const compilation = import_Utils4.default.isCompilation(target) ? target : null;
    this.#dependencies.forEach((deps, moduleOrCompi) => {
      const graph = this.getBuildGraph(moduleOrCompi);
      deps.forEach((depModule) => {
        if (!(import_Utils4.default.isModule(depModule) || isVModule(depModule)))
          return;
        if (depModule === target || compilation && compilation.modules.has(depModule.getName())) {
          return;
        }
        if (moduleOrCompi !== depModule && this.isNeedBuild(depModule)) {
          graph.addDepend(depModule);
          if (!depModule.isDeclaratorModule || this.isVModule(depModule)) {
            const name = this.getModuleReferenceName(depModule, moduleOrCompi);
            const source = this.getModuleImportSource(depModule, moduleOrCompi);
            const importSource = this.addImport(source, name);
            importSource.setSourceTarget(depModule);
            graph.addImport(importSource);
          } else if (depModule.isDeclaratorModule) {
            this.createDeclaratorModuleImportReferences(depModule, moduleOrCompi, graph);
          }
        }
      });
    });
  }
  createModuleDependencies(module2) {
    if (!import_Utils4.default.isModule(module2))
      return;
    let deps = this.getDependencies(module2);
    if (!deps)
      return;
    const graph = this.getBuildGraph(module2);
    const compilation = module2.compilation;
    deps.forEach((depModule) => {
      if (!(import_Utils4.default.isModule(depModule) || isVModule(depModule)))
        return;
      if (compilation && compilation.modules && compilation.modules.has(depModule.getName())) {
        return;
      }
      if (module2 !== depModule && this.isNeedBuild(depModule)) {
        graph.addDepend(depModule);
        if (!depModule.isDeclaratorModule || this.isVModule(depModule)) {
          const name = this.getModuleReferenceName(depModule, module2);
          const source = this.getModuleImportSource(depModule, module2);
          const importSource = this.addImport(source, name);
          importSource.setSourceTarget(depModule);
          graph.addImport(importSource);
        } else if (depModule.isDeclaratorModule) {
          this.createDeclaratorModuleImportReferences(depModule, module2, graph);
        }
      }
    });
  }
  hasBuildGraph(module2) {
    return this.graphs.hasBuildGraph(module2 || this.target);
  }
  getBuildGraph(module2 = null) {
    let compilation = this.target;
    let graphs = this.graphs;
    if (!module2 || compilation === module2) {
      return graphs.createBuildGraph(compilation);
    }
    if (import_Utils4.default.isModule(module2)) {
      if (module2.isDeclaratorModule) {
        const vm = this.getVModule(module2.getName());
        if (vm) {
          return graphs.createBuildGraph(vm, vm);
        }
      }
      let mainModule = compilation.mainModule;
      if (module2 === mainModule) {
        return graphs.createBuildGraph(compilation, module2);
      }
      let graph = graphs.createBuildGraph(module2, module2);
      if (mainModule) {
        let parent = graphs.createBuildGraph(compilation, mainModule);
        parent.addChild(graph);
      }
      return graph;
    } else {
      if (isVModule(module2)) {
        return graphs.createBuildGraph(module2, module2);
      } else {
        throw new Error("Exception module params");
      }
    }
  }
  getGlobalRefName(stack, name, objectKey = null) {
    if (!stack) {
      if (import_Utils4.default.isModule(this.target)) {
        stack = this.target.compilation.stack;
      } else {
        stack = this.target.stack;
      }
      stack = stack || this;
    }
    let variables = this.variables;
    if (objectKey) {
      let key = "getGlobalRefName:" + name;
      if (this.cache.has(objectKey, key)) {
        return this.cache.get(objectKey, key);
      } else {
        let value = variables.hasRefs(stack, name, true) ? variables.genGlobalRefs(stack, name) : variables.getGlobalRefs(stack, name);
        this.cache.set(objectKey, key, value);
        return value;
      }
    }
    return variables.getGlobalRefs(stack, name);
  }
  getLocalRefName(stack, name, objectKey = null) {
    if (!stack) {
      if (import_Utils4.default.isModule(this.target)) {
        stack = this.target.compilation.stack;
      } else {
        stack = this.target.stack;
      }
      stack = stack || this;
    }
    let variables = this.variables;
    if (objectKey) {
      let key = "getLocalRefName:" + name;
      if (this.cache.has(objectKey, key)) {
        return this.cache.get(objectKey, key);
      } else {
        let value = variables.hasRefs(stack, name) ? variables.genLocalRefs(stack, name) : variables.getLocalRefs(stack, name);
        this.cache.set(objectKey, key, value);
        return value;
      }
    }
    return variables.getLocalRefs(stack, name);
  }
  genLocalRefName(stack, name, objectKey = null) {
    if (!stack) {
      if (import_Utils4.default.isModule(this.target)) {
        stack = this.target.compilation.stack;
      } else {
        stack = this.target.stack;
      }
      stack = stack || this;
    }
    let variables = this.variables;
    if (objectKey) {
      let key = "genLocalRefName:" + name;
      if (this.cache.has(objectKey, key)) {
        return this.cache.get(objectKey, key);
      } else {
        let value = variables.genLocalRefs(stack, name);
        this.cache.set(objectKey, key, value);
        return value;
      }
    }
    return variables.genLocalRefs(stack, name);
  }
  genGlobalRefName(stack, name, objectKey = null) {
    if (!stack) {
      if (import_Utils4.default.isModule(this.target)) {
        stack = this.target.compilation.stack;
      } else {
        stack = this.target.stack;
      }
      stack = stack || this;
    }
    let variables = this.variables;
    if (objectKey) {
      let key = "genGlobalRefName:" + name;
      if (this.cache.has(objectKey, key)) {
        return this.cache.get(objectKey, key);
      } else {
        let value = variables.genGlobalRefs(stack, name);
        this.cache.set(objectKey, key, value);
        return value;
      }
    }
    return variables.genGlobalRefs(stack, name);
  }
  getWasLocalRefName(target, name, genFlag = false) {
    let key = genFlag ? "genLocalRefName:" + name : "getLocalRefName:" + name;
    if (this.cache.has(target, key)) {
      return this.cache.get(target, key);
    }
    return null;
  }
  getWasGlobalRefName(target, name, genFlag = false) {
    let key = genFlag ? "genGlobalRefName:" + name : "getGlobalRefName:" + name;
    if (this.cache.has(target, key)) {
      return this.cache.get(target, key);
    }
    return null;
  }
  getImportAssetsMapping(file, options = {}) {
    if (isExcludeDependency(this.options.dependency.excludes, file, this.target)) {
      return null;
    }
    if (!options.group) {
      options.group = "imports";
    }
    if (!options.delimiter) {
      options.delimiter = "/";
    }
    if (typeof file === "string") {
      file = this.replaceImportSource(file);
    }
    return this.resolveImportSource(file, options);
  }
  replaceImportSource(source) {
    if (source.startsWith("${__filename}")) {
      let target = this.target;
      if (isVModule(target)) {
        target = target.bindModule || target;
      }
      let owner = import_Utils4.default.isModule(target) ? target.compilation : target;
      source = source.replace("${__filename}", import_Utils4.default.normalizePath(owner.file));
    }
    return source;
  }
  getSourceFileMappingFolder(file, flag) {
    const result = this.resolveSourceFileMappingPath(file, "folders");
    return flag && !result ? file : result;
  }
  getModuleMappingFolder(module2) {
    if (import_Utils4.default.isModule(module2)) {
      return this.resolveSourceFileMappingPath(module2.getName("/") + ".module", "folders");
    } else if (module2 && module2.file) {
      return this.resolveSourceFileMappingPath(module2.file, "folders");
    }
    return null;
  }
  getAssetsImportSource(asset, context) {
    let source = asset.sourceId;
    if (this.options.emitFile) {
      source = this.getRelativePath(
        asset.outfile,
        this.getOutputAbsolutePath(context)
      );
    }
    return source;
  }
  getModuleImportSource(source, context, sourceId = null) {
    const config = this.options;
    const isString = typeof source === "string";
    if (isString) {
      source = this.replaceImportSource(source);
    }
    if (isString && isExternalDependency(this.options.dependency.externals, source, context)) {
      return source;
    }
    if (isString && source.includes("/node_modules/")) {
      if (import_path2.default.isAbsolute(source))
        return source;
      if (!sourceId) {
        return this.resolveSourceFileMappingPath(source, "imports") || source;
      }
      return sourceId;
    }
    if (isString && !import_path2.default.isAbsolute(source)) {
      return source;
    }
    if (config.emitFile) {
      return this.getOutputRelativePath(source, context);
    }
    return isString ? source : this.getModuleResourceId(source);
  }
  getModuleResourceId(module2, query = {}) {
    return this.compiler.parseResourceId(module2, query);
  }
  resolveSourceFileMappingPath(file, group, delimiter = "/") {
    return this.resolveSourceId(file, group, delimiter);
  }
  resolveSourceId(id, group, delimiter = "/") {
    let glob = this.#glob;
    if (!glob)
      return null;
    let data = { group, delimiter, failValue: null };
    if (typeof group === "object") {
      data = group;
    }
    return glob.dest(id, data);
  }
  resolveImportSource(id, ctx = {}) {
    let glob = this.#glob;
    if (!glob)
      return id;
    const scheme = glob.scheme(id, ctx);
    let source = glob.parse(scheme, ctx);
    let rule = scheme.rule;
    if (!rule) {
      source = id;
    }
    return source;
  }
  genUniFileName(source, suffix = null) {
    source = String(source);
    let query = source.includes("?");
    if (import_path2.default.isAbsolute(source) || query) {
      let file = source;
      if (query) {
        file = source.split("?")[0];
      }
      let ext = import_path2.default.extname(file);
      suffix = suffix || ext;
      return import_path2.default.basename(file, ext) + "-" + createUniqueHashId(source) + suffix;
    }
    return source;
  }
  getPublicDir() {
    return this.options.publicDir || "assets";
  }
  getOutputDir() {
    return this.options.outDir || ".output";
  }
  getOutputExtName() {
    return this.options.outExt || ".js";
  }
  getOutputAbsolutePath(source, secondDir = null) {
    const isStr = typeof source === "string";
    const suffix = this.getOutputExtName();
    let output = this.getOutputDir();
    if (!source)
      return output;
    let key = source;
    if (secondDir) {
      output = import_path2.default.join(output, secondDir);
      key = source + secondDir;
    }
    if (this.cache.has(key, "Context.getOutputAbsolutePath")) {
      return this.cache.get(key, "Context.getOutputAbsolutePath");
    }
    let folder = isStr ? this.getSourceFileMappingFolder(source) : this.getModuleMappingFolder(source);
    let filename = null;
    if (isStr) {
      filename = folder ? import_path2.default.basename(source) : this.compiler.getRelativeWorkspacePath(source, true) || this.genUniFileName(source);
    } else {
      if (import_Utils4.default.isModule(source)) {
        if (source.isDeclaratorModule) {
          const vm = this.getVModule(source.getName()) || source;
          filename = folder ? vm.id : vm.getName("/");
        } else {
          filename = folder ? source.id : source.getName("/");
        }
      } else if (isVModule(source)) {
        filename = folder ? source.id : source.getName("/");
      } else if (source.file) {
        filename = folder ? import_path2.default.basename(source.file) : this.compiler.getRelativeWorkspacePath(source.file) || this.genUniFileName(source.file);
      }
    }
    if (!filename) {
      throw new Error("File name not resolved correctly");
    }
    let info = import_path2.default.parse(filename);
    if (!info.ext || this.compiler.isExtensionName(info.ext)) {
      filename = import_path2.default.join(info.dir, info.name + suffix);
    }
    let result = null;
    if (folder) {
      result = import_Utils4.default.normalizePath(
        import_path2.default.resolve(
          import_path2.default.isAbsolute(folder) ? import_path2.default.join(folder, filename) : import_path2.default.join(output, folder, filename)
        )
      );
    } else {
      result = import_Utils4.default.normalizePath(
        import_path2.default.resolve(
          import_path2.default.join(output, filename)
        )
      );
    }
    if (result.includes("?")) {
      result = import_path2.default.join(import_path2.default.dirname(result), this.genUniFileName(result, import_path2.default.extname(result)));
    }
    this.cache.set(key, "Context.getOutputAbsolutePath", result);
    return result;
  }
  getOutputRelativePath(source, context) {
    return this.getRelativePath(
      this.getOutputAbsolutePath(source),
      this.getOutputAbsolutePath(context)
    );
  }
  getRelativePath(source, context) {
    return "./" + import_Utils4.default.normalizePath(
      import_path2.default.relative(
        import_path2.default.dirname(context),
        source
      )
    );
  }
  getVNodeApi(name) {
    let local = this.getGlobalRefName(null, name);
    this.addImport("vue", local, name);
    return local;
  }
  createDefaultRoutePathNode(module2) {
    if (import_Utils4.default.isModule(module2)) {
      return this.createLiteral("/" + module2.getName("/"));
    }
    return null;
  }
  createVNodeHandleNode(stack, ...args) {
    let handle = this.#vnodeHandleNode;
    if (!handle) {
      let esx = this.options.esx || {};
      let name = esx.handleName || "createVNode";
      if (esx.handleIsThis) {
        handle = this.createMemberExpression([
          this.createThisExpression(),
          this.createIdentifier(name)
        ]);
      } else {
        let local = this.getGlobalRefName(stack, name);
        this.addImport("vue", local, name);
        handle = this.createIdentifier(local);
      }
      this.#vnodeHandleNode = handle;
    }
    return this.createCallExpression(handle, args);
  }
  async emit(buildGraph) {
    let outfile = buildGraph.outfile;
    if (outfile) {
      import_fs2.default.mkdirSync(import_path2.default.dirname(outfile), { recursive: true });
      import_fs2.default.writeFileSync(outfile, buildGraph.code);
      let sourcemap = buildGraph.sourcemap;
      if (sourcemap) {
        import_fs2.default.writeFileSync(outfile + ".map", JSON.stringify(sourcemap));
      }
    }
  }
  error(message, stack = null) {
    if (this.target) {
      let range = stack && stack instanceof import_Range.default ? stack : null;
      if (!range && import_Utils4.default.isStack(stack)) {
        range = this.target.getRangeByNode(stack.node);
      }
      const file = this.target.file;
      if (range) {
        message += ` (${file}:${range.start.line}:${range.start.column})`;
      } else {
        message += `(${file})`;
      }
    }
    import_Utils4.default.error(message);
  }
  warn(message, stack = null) {
    if (this.target) {
      let range = stack && stack instanceof import_Range.default ? stack : null;
      if (!range && import_Utils4.default.isStack(stack)) {
        range = this.target.getRangeByNode(stack.node);
      }
      const file = this.target.file;
      if (range) {
        message += ` (${file}:${range.start.line}:${range.start.column})`;
      } else {
        message += `(${file})`;
      }
    }
    import_Utils4.default.warn(message);
  }
};
var Context_default = Context;

// node_modules/@easescript/transform/lib/core/Variable.js
var import_Utils5 = __toESM(require("easescript/lib/core/Utils"));
var import_Scope = __toESM(require("easescript/lib/core/Scope"));
var REFS_All = 31;
var REFS_TOP = 16;
var REFS_UP_CLASS = 8;
var REFS_UP_FUN = 4;
var REFS_UP = 2;
var REFS_DOWN = 1;
var Manage = class {
  #ctxScope = null;
  #cache = /* @__PURE__ */ new Map();
  constructor(ctxScope) {
    this.#ctxScope = ctxScope;
  }
  get(name) {
    return this.#cache.get(name);
  }
  has(name) {
    return this.#cache.has(name);
  }
  get ctxScope() {
    return this.#ctxScope;
  }
  check(name, scope, flags = REFS_All) {
    if (this.#cache.has(name))
      return true;
    if (!import_Scope.default.is(scope)) {
      return false;
    }
    if (flags === REFS_All) {
      return scope.checkDocumentDefineScope(name, ["class"]);
    }
    if (scope.isDefine(name)) {
      return true;
    }
    let index = 0;
    let flag = 0;
    while (flag < (flags & REFS_All)) {
      flag = Math.pow(2, index++);
      switch (flags & flag) {
        case REFS_DOWN:
          if (scope.declarations.has(name) || scope.hasChildDeclared(name))
            return true;
        case REFS_UP:
          if (scope.isDefine(name))
            return true;
        case REFS_TOP:
          if (scope.isDefine(name) || scope.hasChildDeclared(name))
            return true;
        case REFS_UP_FUN:
          if (scope.isDefine(name, "function"))
            return true;
        case REFS_UP_CLASS:
          if (scope.isDefine(name, "class"))
            return true;
      }
    }
    return false;
  }
  gen(name, scope, flags = REFS_All, begin = 0) {
    let index = begin;
    let value = name;
    while (this.check(value = name + index, scope, flags)) {
      index++;
    }
    this.#cache.set(name, value);
    this.#cache.set(value, value);
    return value;
  }
  getRefs(name, scope, flags = REFS_All) {
    if (scope) {
      if (this.check(name, scope, flags)) {
        return this.gen(name, scope, flags);
      } else {
        this.#cache.set(name, name);
      }
    } else {
      this.#cache.set(name, name);
    }
    return name;
  }
};
function getVariableManager() {
  const records2 = /* @__PURE__ */ new Map();
  function _getVariableManage(ctxScope) {
    let manage = records2.get(ctxScope);
    if (!manage) {
      records2.set(ctxScope, manage = new Manage(ctxScope));
    }
    return manage;
  }
  function hasScopeDefined(context, name, isTop = false, flags = REFS_All) {
    let manage = getVariableManage(context, isTop);
    if (import_Utils5.default.isStack(context)) {
      return manage.check(name, context.scope, flags);
    }
    return false;
  }
  function hasGlobalScopeDefined(context, name) {
    return hasScopeDefined(context, name, true, REFS_All);
  }
  function hasLocalScopeDefined(context, name) {
    return hasScopeDefined(context, name, false, REFS_DOWN | REFS_UP_FUN);
  }
  function hasRefs(context, name, isTop = false) {
    let manage = getVariableManage(context, isTop);
    return manage.has(name);
  }
  function getRefs(context, name, isTop = false, flags = REFS_All) {
    let manage = getVariableManage(context, isTop);
    if (manage.has(name)) {
      return manage.get(name);
    }
    return manage.getRefs(name, import_Utils5.default.isStack(context) ? context.scope : null, flags);
  }
  function getVariableManage(context, isTop = false) {
    if (import_Utils5.default.isStack(context)) {
      let scope = context.scope;
      if (!import_Scope.default.is(scope)) {
        throw new Error("Variable.getRefs scope invalid");
      }
      return _getVariableManage(
        isTop ? scope.getScopeByType("top") : scope.getScopeByType("function") || scope.getScopeByType("top")
      );
    } else {
      return _getVariableManage(context);
    }
  }
  function getGlobalRefs(context, name) {
    return getRefs(context, name, true, REFS_All);
  }
  function getLocalRefs(context, name) {
    return getRefs(context, name, false, REFS_DOWN | REFS_UP_FUN);
  }
  function genRefs(context, name, isTop = false, flags = REFS_DOWN | REFS_UP_FUN) {
    let manage = getVariableManage(context, isTop);
    if (import_Utils5.default.isStack(context)) {
      return manage.gen(name, context.scope, flags);
    } else {
      return manage.gen(name, null, flags);
    }
  }
  function genGlobalRefs(context, name) {
    return genRefs(context, name, true, REFS_All);
  }
  function genLocalRefs(context, name) {
    return genRefs(context, name, false, REFS_DOWN | REFS_UP_FUN);
  }
  function clearAll() {
    records2.clear();
  }
  return {
    getVariableManage,
    getRefs,
    getLocalRefs,
    getGlobalRefs,
    hasRefs,
    hasGlobalScopeDefined,
    hasLocalScopeDefined,
    genGlobalRefs,
    genLocalRefs,
    clearAll
  };
}

// node_modules/@easescript/transform/lib/core/BuildGraph.js
var BuildGraph = class {
  #code = "";
  #sourcemap = null;
  #module = null;
  #dependencies = null;
  #imports = null;
  #assets = null;
  #exports = null;
  #children = null;
  #parent = null;
  #outfile = null;
  constructor(module2) {
    this.#module = module2;
  }
  get module() {
    return this.#module;
  }
  get code() {
    return this.#code;
  }
  set code(value) {
    this.#code = value;
  }
  get sourcemap() {
    return this.#sourcemap;
  }
  set sourcemap(value) {
    this.#sourcemap = value;
  }
  get dependencies() {
    return this.#dependencies;
  }
  get imports() {
    return this.#imports;
  }
  get exports() {
    return this.#exports;
  }
  get assets() {
    return this.#assets;
  }
  get children() {
    return this.#children;
  }
  get parent() {
    return this.#parent;
  }
  get outfile() {
    return this.#outfile;
  }
  set outfile(value) {
    this.#outfile = value;
  }
  addChild(child) {
    if (child.#parent)
      return;
    let children = this.#children;
    if (!children) {
      this.#children = children = /* @__PURE__ */ new Set();
    }
    children.add(child);
    child.#parent = this;
  }
  addImport(importSource) {
    let imports = this.#imports;
    if (!imports) {
      this.#imports = imports = /* @__PURE__ */ new Set();
    }
    imports.add(importSource);
  }
  addExport(exportSource) {
    let exports2 = this.#exports;
    if (!exports2) {
      this.#exports = exports2 = /* @__PURE__ */ new Set();
    }
    exports2.add(exportSource);
  }
  addDepend(module2) {
    let deps = this.#dependencies;
    if (!deps) {
      this.#dependencies = deps = /* @__PURE__ */ new Set();
    }
    deps.add(module2);
  }
  addAsset(asset) {
    let assets = this.#assets;
    if (!assets) {
      this.#assets = assets = /* @__PURE__ */ new Set();
    }
    assets.add(asset);
  }
  findAsset(filter) {
    let assets = this.#assets;
    if (assets) {
      for (let asset of assets) {
        if (filter(asset)) {
          return asset;
        }
      }
    }
    return null;
  }
};
function getBuildGraphManager() {
  const records2 = /* @__PURE__ */ new Map();
  function createBuildGraph(moduleOrCompilation, module2 = null) {
    let old = records2.get(moduleOrCompilation);
    if (old)
      return old;
    let graph = new BuildGraph(module2);
    records2.set(moduleOrCompilation, graph);
    return graph;
  }
  function getBuildGraph(moduleOrCompilation) {
    return records2.get(moduleOrCompilation);
  }
  function setBuildGraph(moduleOrCompilation, graph) {
    return records2.set(moduleOrCompilation, graph);
  }
  function hasBuildGraph(moduleOrCompilation) {
    return records2.has(moduleOrCompilation);
  }
  function clear(compilation) {
    keys.forEach(([value, key]) => {
      if (key === compilation || key.compilation === compilation) {
        records2.delete(key);
      }
    });
  }
  function clearAll() {
    records2.clear();
    mainGraphs.clear();
  }
  return {
    clear,
    clearAll,
    setBuildGraph,
    getBuildGraph,
    createBuildGraph,
    hasBuildGraph
  };
}

// node_modules/@easescript/transform/lib/core/Asset.js
var import_path3 = __toESM(require("path"));
var import_fs3 = __toESM(require("fs"));
var import_Utils6 = __toESM(require("easescript/lib/core/Utils"));
var Asset = class {
  #code = "";
  #type = "";
  #file = null;
  #sourcemap = null;
  #local = null;
  #imported = null;
  #sourceId = null;
  #outfile = null;
  #id = null;
  #changed = true;
  #attrs = null;
  #initialized = false;
  #after = false;
  constructor(sourceFile, type, id = null) {
    this.#type = type;
    this.#file = sourceFile;
    this.#sourceId = sourceFile;
    this.#outfile = sourceFile;
    this.#id = id;
  }
  set after(value) {
    this.#after = !!value;
  }
  get after() {
    return this.#after;
  }
  get code() {
    let code = this.#code;
    if (code)
      return code;
    let file = this.file;
    if (file && import_fs3.default.existsSync(file)) {
      this.#code = import_fs3.default.readFileSync(file).toString("utf8");
    }
    return this.#code;
  }
  set code(value) {
    this.#code = value;
    this.#changed = true;
  }
  get id() {
    return this.#id;
  }
  set id(value) {
    this.#id = value;
  }
  get attrs() {
    return this.#attrs;
  }
  set attrs(value) {
    this.#attrs = value;
  }
  get changed() {
    return this.#changed;
  }
  set changed(value) {
    this.#changed = value;
  }
  get local() {
    return this.#local;
  }
  set local(value) {
    this.#local = value;
  }
  get imported() {
    return this.#imported;
  }
  set imported(value) {
    this.#imported = value;
  }
  get file() {
    return this.#file;
  }
  set file(value) {
    this.#file = value;
  }
  get sourceId() {
    return this.#sourceId;
  }
  set sourceId(value) {
    this.#sourceId = value;
  }
  get type() {
    return this.#type;
  }
  get sourcemap() {
    return this.#sourcemap;
  }
  set sourcemap(value) {
    this.#sourcemap = value;
  }
  get outfile() {
    return this.#outfile;
  }
  set outfile(value) {
    this.#outfile = value;
  }
  initialize(ctx) {
    if (this.#initialized)
      return;
    this.#initialized = true;
    if (!ctx.options.emitFile) {
      return;
    }
    let outDir = ctx.getOutputDir();
    let publicDir = ctx.getPublicDir();
    let file = String(this.file).trim();
    let sourceFile = file;
    let filename = null;
    let folder = ctx.getSourceFileMappingFolder(file + ".assets");
    if (this.type === "style" && file.includes("?")) {
      sourceFile = file.split("?")[0];
      filename = ctx.genUniFileName(file);
    } else {
      filename = import_path3.default.basename(sourceFile);
    }
    let ext = ctx.getOutputExtName();
    if (!filename.endsWith(ext)) {
      filename = import_path3.default.basename(filename, import_path3.default.extname(filename)) + ext;
    }
    if (folder) {
      this.#outfile = import_Utils6.default.normalizePath(import_path3.default.join(outDir, folder, filename));
    } else {
      let relativeDir = ctx.plugin.complier.getRelativeWorkspace(sourceFile);
      if (relativeDir) {
        relativeDir = import_path3.default.dirname(relativeDir);
      }
      if (relativeDir) {
        this.#outfile = import_Utils6.default.normalizePath(import_path3.default.join(outDir, folder || publicDir, relativeDir, filename));
      } else {
        let _filename = ctx.genUniFileName(file) || filename;
        this.#outfile = import_Utils6.default.normalizePath(import_path3.default.join(outDir, folder || publicDir, _filename));
      }
    }
  }
  async build(ctx) {
    if (!this.#changed)
      return;
    if (ctx.options.emitFile) {
      let code = this.code;
      if (ctx.options.module === "cjs") {
        code = `module.exports=${JSON.stringify(code)};`;
      } else {
        code = `export default ${JSON.stringify(code)};`;
      }
      this.code = code;
      ctx.emit(this);
    }
    this.#changed = false;
  }
};
function isAsset(value) {
  return value ? value instanceof Asset : false;
}
function getAssetsManager(AssetFactory) {
  const records2 = /* @__PURE__ */ new Map();
  function createAsset(sourceFile, id = null, type = null) {
    if (!type) {
      type = import_path3.default.extname(sourceFile);
      if (type.startsWith(".")) {
        type = type.substring(1);
      }
    } else {
      type = String(type);
    }
    let key = sourceFile + ":" + type;
    if (id != null) {
      key = sourceFile + ":" + id + ":" + type;
    }
    let asset = records2.get(key);
    if (!asset) {
      records2.set(sourceFile, asset = new AssetFactory(sourceFile, type, id));
    }
    return asset;
  }
  function createStyleAsset(sourceFile, id = null) {
    return createAsset(sourceFile, id, "style");
  }
  function getAsset(sourceFile, id = null, type = "") {
    let key = sourceFile + ":" + type;
    if (id) {
      key = sourceFile + ":" + id + ":" + type;
    }
    return records2.get(key);
  }
  function getStyleAsset(sourceFile, id = null) {
    return getAsset(sourceFile, id, "style");
  }
  function getAssets() {
    return Array.from(records2.values());
  }
  function setAsset(sourceFile, asset, id = null, type = null) {
    if (!type) {
      type = import_path3.default.extname(sourceFile);
      if (type.startsWith(".")) {
        type = type.substring(1);
      }
    } else {
      type = String(type);
    }
    let key = sourceFile + ":" + type;
    if (id != null) {
      key = sourceFile + ":" + id + ":" + type;
    }
    records2.set(key, asset);
  }
  return {
    createAsset,
    createStyleAsset,
    getStyleAsset,
    getAsset,
    setAsset,
    getAssets
  };
}

// node_modules/@easescript/transform/lib/core/TableBuilder.js
var import_path4 = __toESM(require("path"));
var import_fs4 = __toESM(require("fs"));
function normalName(name) {
  return name.replace(/([A-Z])/g, (a, b, i) => {
    return i > 0 ? "_" + b.toLowerCase() : b.toLowerCase();
  });
}
var TableBuilder = class {
  #plugin = null;
  #changed = true;
  #outfile = "";
  #records = /* @__PURE__ */ new Map();
  constructor(plugin2) {
    this.#plugin = plugin2;
    this.#plugin.on("compilation:changed", (compilation) => {
      let mainModule = compilation.mainModule;
      if (mainModule.isStructTable) {
        compilation.modules.forEach((module2) => {
          if (module2.isStructTable) {
            this.removeTable(module2.id);
          }
        });
      }
    });
  }
  createTable(ctx, stack) {
    if (!stack.body.length)
      return false;
    const module2 = stack.module;
    if (this.hasTable(module2.id))
      return false;
    const node = ctx.createNode(stack);
    node.id = ctx.createIdentifier("`" + normalName(stack.id.value()) + "`", stack.id);
    node.properties = [];
    node.body = [];
    stack.body.forEach((item) => {
      const token = createIdentNode(ctx, item);
      if (token) {
        if (item.isStructTablePropertyDefinition) {
          node.properties.push(token);
        } else {
          node.body.push(token);
        }
      }
    });
    let gen = new Generator_default();
    gen.make(node);
    this.#records.set(module2.id, gen.toString());
    this.#changed = true;
    this.build(ctx);
    return true;
  }
  get type() {
    return "";
  }
  get outfile() {
    return this.#outfile;
  }
  set outfile(value) {
    this.#outfile = value;
  }
  getTable(name) {
    return this.#records.get(name);
  }
  hasTable(name) {
    return this.#records.has(name);
  }
  removeTable(name) {
    this.#records.delete(name);
  }
  getTables() {
    return Array.from(this.#records.values());
  }
  async build(ctx) {
    if (!this.#changed)
      return;
    this.#changed = false;
    let file = this.type + ".sql";
    let code = this.getTables().join("\n");
    file = this.outfile || (this.outfile = ctx.getOutputAbsolutePath(file));
    import_fs4.default.mkdirSync(import_path4.default.dirname(file), { recursive: true });
    import_fs4.default.writeFileSync(file, code);
  }
};
function getTableManager() {
  const records2 = /* @__PURE__ */ new Map();
  function getBuilder(type) {
    if (!records2.has(type)) {
      throw new Error(`The '${type}' table builder is not exists.`);
    }
    return records2.get(type);
  }
  function addBuilder(builder) {
    if (builder instanceof TableBuilder) {
      records2.set(builder.type, builder);
    } else {
      throw new Error("Table builder must is extends TableBuilder.");
    }
  }
  function getAllBuilder() {
    return records2;
  }
  return {
    addBuilder,
    getBuilder,
    getAllBuilder
  };
}
var MySql = class extends TableBuilder {
  get type() {
    return "mysql";
  }
};

// node_modules/@easescript/transform/lib/tokens/index.js
var tokens_exports = {};
__export(tokens_exports, {
  AnnotationDeclaration: () => AnnotationDeclaration_default,
  AnnotationExpression: () => AnnotationExpression_default,
  ArrayExpression: () => ArrayExpression_default,
  ArrayPattern: () => ArrayPattern_default,
  ArrowFunctionExpression: () => ArrowFunctionExpression_default,
  AssignmentExpression: () => AssignmentExpression_default,
  AssignmentPattern: () => AssignmentPattern_default,
  AwaitExpression: () => AwaitExpression_default,
  BinaryExpression: () => BinaryExpression_default,
  BlockStatement: () => BlockStatement_default,
  BreakStatement: () => BreakStatement_default,
  CallExpression: () => CallExpression_default,
  ChainExpression: () => ChainExpression_default,
  ClassDeclaration: () => ClassDeclaration_default,
  ConditionalExpression: () => ConditionalExpression_default,
  ContinueStatement: () => ContinueStatement_default,
  Declarator: () => Declarator_default,
  DeclaratorDeclaration: () => DeclaratorDeclaration_default,
  DoWhileStatement: () => DoWhileStatement_default,
  EmptyStatement: () => EmptyStatement_default,
  EnumDeclaration: () => EnumDeclaration_default,
  EnumProperty: () => EnumProperty_default,
  ExportAllDeclaration: () => ExportAllDeclaration_default,
  ExportDefaultDeclaration: () => ExportDefaultDeclaration_default,
  ExportNamedDeclaration: () => ExportNamedDeclaration_default,
  ExportSpecifier: () => ExportSpecifier_default,
  ExpressionStatement: () => ExpressionStatement_default,
  ForInStatement: () => ForInStatement_default,
  ForOfStatement: () => ForOfStatement_default,
  ForStatement: () => ForStatement_default,
  FunctionDeclaration: () => FunctionDeclaration_default,
  FunctionExpression: () => FunctionExpression_default,
  Identifier: () => Identifier_default,
  IfStatement: () => IfStatement_default,
  ImportDeclaration: () => ImportDeclaration_default,
  ImportDefaultSpecifier: () => ImportDefaultSpecifier_default,
  ImportExpression: () => ImportExpression_default,
  ImportNamespaceSpecifier: () => ImportNamespaceSpecifier_default,
  ImportSpecifier: () => ImportSpecifier_default,
  InterfaceDeclaration: () => InterfaceDeclaration_default,
  JSXAttribute: () => JSXAttribute_default,
  JSXCdata: () => JSXCdata_default,
  JSXClosingElement: () => JSXClosingElement_default,
  JSXClosingFragment: () => JSXClosingFragment_default,
  JSXElement: () => JSXElement,
  JSXEmptyExpression: () => JSXEmptyExpression_default,
  JSXExpressionContainer: () => JSXExpressionContainer_default,
  JSXFragment: () => JSXFragment_default,
  JSXIdentifier: () => JSXIdentifier_default,
  JSXMemberExpression: () => JSXMemberExpression_default,
  JSXNamespacedName: () => JSXNamespacedName_default,
  JSXOpeningElement: () => JSXOpeningElement_default,
  JSXOpeningFragment: () => JSXOpeningFragment_default,
  JSXScript: () => JSXScript_default,
  JSXSpreadAttribute: () => JSXSpreadAttribute_default,
  JSXStyle: () => JSXStyle_default,
  JSXText: () => JSXText_default,
  LabeledStatement: () => LabeledStatement_default,
  Literal: () => Literal_default,
  LogicalExpression: () => LogicalExpression_default,
  MemberExpression: () => MemberExpression_default,
  MethodDefinition: () => MethodDefinition_default,
  MethodGetterDefinition: () => MethodGetterDefinition_default,
  MethodSetterDefinition: () => MethodSetterDefinition_default,
  NewExpression: () => NewExpression_default,
  ObjectExpression: () => ObjectExpression_default,
  ObjectPattern: () => ObjectPattern_default,
  PackageDeclaration: () => PackageDeclaration_default,
  ParenthesizedExpression: () => ParenthesizedExpression_default,
  Property: () => Property_default,
  PropertyDefinition: () => PropertyDefinition_default,
  RestElement: () => RestElement_default,
  ReturnStatement: () => ReturnStatement_default,
  SequenceExpression: () => SequenceExpression_default,
  SpreadElement: () => SpreadElement_default,
  StructTableColumnDefinition: () => StructTableColumnDefinition_default,
  StructTableDeclaration: () => StructTableDeclaration_default,
  StructTableKeyDefinition: () => StructTableKeyDefinition_default,
  StructTableMethodDefinition: () => StructTableMethodDefinition_default,
  StructTablePropertyDefinition: () => StructTablePropertyDefinition_default,
  SuperExpression: () => SuperExpression_default,
  SwitchCase: () => SwitchCase_default,
  SwitchStatement: () => SwitchStatement_default,
  TemplateElement: () => TemplateElement_default,
  TemplateLiteral: () => TemplateLiteral_default,
  ThisExpression: () => ThisExpression_default,
  ThrowStatement: () => ThrowStatement_default,
  TryStatement: () => TryStatement_default,
  TypeAssertExpression: () => TypeAssertExpression_default,
  TypeTransformExpression: () => TypeTransformExpression_default,
  UnaryExpression: () => UnaryExpression_default,
  UpdateExpression: () => UpdateExpression_default,
  VariableDeclaration: () => VariableDeclaration_default,
  VariableDeclarator: () => VariableDeclarator_default,
  WhenStatement: () => WhenStatement_default,
  WhileStatement: () => WhileStatement_default
});

// node_modules/@easescript/transform/lib/tokens/AnnotationDeclaration.js
function AnnotationDeclaration_default() {
}

// node_modules/@easescript/transform/lib/tokens/AnnotationExpression.js
function AnnotationExpression_default(ctx, stack) {
  const name = stack.getLowerCaseName();
  switch (name) {
    case "http": {
      return createHttpAnnotationNode(ctx, stack) || ctx.createLiteral(null);
    }
    case "router": {
      return createRouterAnnotationNode(ctx, stack) || ctx.createLiteral(null);
    }
    case "url": {
      return createUrlAnnotationNode(ctx, stack);
    }
    case "env": {
      return createEnvAnnotationNode(ctx, stack);
    }
    case "readfile": {
      return createReadfileAnnotationNode(ctx, stack) || ctx.createLiteral(null);
    }
    default:
      ctx.error(`The '${name}' annotations is not supported.`);
  }
  return null;
}

// node_modules/@easescript/transform/lib/tokens/ArrayExpression.js
function ArrayExpression_default(ctx, stack) {
  const node = ctx.createNode(stack);
  node.elements = stack.elements.map((item) => ctx.createToken(item));
  return node;
}

// node_modules/@easescript/transform/lib/tokens/ArrayPattern.js
function ArrayPattern_default(ctx, stack) {
  const node = ctx.createNode(stack);
  node.elements = stack.elements.map((item) => ctx.createToken(item));
  return node;
}

// node_modules/@easescript/transform/lib/tokens/FunctionExpression.js
function FunctionExpression_default(ctx, stack, type) {
  const node = ctx.createNode(stack, type);
  node.async = stack.async ? true : false;
  node.params = stack.params.map((item) => ctx.createToken(item));
  node.body = ctx.createToken(stack.body);
  return node;
}

// node_modules/@easescript/transform/lib/tokens/ArrowFunctionExpression.js
function ArrowFunctionExpression_default(ctx, stack, type) {
  const node = FunctionExpression_default(ctx, stack, type);
  node.type = type;
  return node;
}

// node_modules/@easescript/transform/lib/tokens/AssignmentExpression.js
var import_Utils7 = __toESM(require("easescript/lib/core/Utils"));
function AssignmentExpression_default(ctx, stack) {
  const desc = stack.left.description();
  const module2 = stack.module;
  const isMember = stack.left.isMemberExpression;
  let isReflect = false;
  let operator = stack.operator;
  if (isMember) {
    if (stack.left.computed) {
      let hasDynamic = desc && desc.isComputeType && desc.isPropertyExists();
      if (!hasDynamic && desc && (desc.isProperty && desc.computed || desc.isPropertyDefinition && desc.dynamic)) {
        hasDynamic = true;
      }
      if (!hasDynamic && !import_Utils7.default.isLiteralObjectType(stack.left.object.type())) {
        isReflect = true;
      }
    } else if (!desc || desc.isAnyType) {
      isReflect = !import_Utils7.default.isLiteralObjectType(stack.left.object.type());
    }
  }
  if (isReflect) {
    let value = ctx.createToken(stack.right);
    let scopeId = module2 ? ctx.createIdentifier(module2.id) : ctx.createLiteral(null);
    let propertyNode = ctx.createLiteral(
      stack.left.property.value(),
      void 0,
      stack.left.property
    );
    if (operator && operator.charCodeAt(0) !== 61 && operator.charCodeAt(operator.length - 1) === 61) {
      operator = operator.slice(0, -1);
      const callee2 = createStaticReferenceNode(ctx, stack, "Reflect", "get");
      const left2 = ctx.createCallExpression(callee2, [
        scopeId,
        ctx.createToken(stack.left.object),
        propertyNode
      ], stack);
      value = ctx.createBinaryExpression(left2, value, operator);
    }
    const callee = createStaticReferenceNode(ctx, stack, "Reflect", "set");
    return ctx.createCallExpression(callee, [
      scopeId,
      ctx.createToken(stack.left.object),
      propertyNode,
      value
    ], stack);
  }
  let left = ctx.createToken(stack.left);
  if (isMember && stack.left.object.isSuperExpression) {
    if (left.type === "CallExpression" && left.callee.type === "MemberExpression" && left.callee.property.value === "callSuperSetter") {
      left.arguments.push(
        ctx.createToken(stack.right)
      );
      return left;
    }
  }
  const node = ctx.createNode(stack);
  node.left = left;
  node.right = ctx.createToken(stack.right);
  node.operator = operator;
  return node;
}

// node_modules/@easescript/transform/lib/tokens/AssignmentPattern.js
function AssignmentPattern_default(ctx, stack) {
  const node = ctx.createNode(stack);
  node.left = ctx.createToken(stack.left);
  node.right = ctx.createToken(stack.right);
  return node;
}

// node_modules/@easescript/transform/lib/tokens/AwaitExpression.js
function AwaitExpression_default(ctx, stack) {
  const node = ctx.createNode(stack);
  node.argument = ctx.createToken(stack.argument);
  return node;
}

// node_modules/@easescript/transform/lib/tokens/BinaryExpression.js
var import_Utils8 = __toESM(require("easescript/lib/core/Utils"));
var globals = ["Array", "Object", "RegExp", "Number", "String", "Function"];
function BinaryExpression_default(ctx, stack) {
  let operator = stack.operator;
  let node = ctx.createNode(stack);
  let right = ctx.createToken(stack.right);
  if (operator === "is" || operator === "instanceof") {
    let type = stack.right.type();
    let origin = !import_Utils8.default.isModule(type) ? import_Utils8.default.getOriginType(type) : type;
    if (!stack.right.hasLocalDefined()) {
      ctx.addDepend(origin, stack.module);
      right = ctx.createIdentifier(
        ctx.getGlobalRefName(
          stack,
          ctx.getModuleReferenceName(origin, stack.module)
        )
      );
    }
    if (operator === "is" && !(origin && globals.includes(origin.id))) {
      return ctx.createCallExpression(
        createStaticReferenceNode(ctx, stack, "System", "is"),
        [
          ctx.createToken(stack.left),
          right
        ],
        stack
      );
    }
    operator = "instanceof";
  }
  node.left = ctx.createToken(stack.left);
  node.right = right;
  node.operator = operator;
  return node;
}

// node_modules/@easescript/transform/lib/tokens/BlockStatement.js
function BlockStatement_default(ctx, stack) {
  const node = ctx.createNode(stack);
  node.body = [];
  ctx.setNode(stack, node);
  for (let child of stack.body) {
    const token = ctx.createToken(child);
    if (token) {
      node.body.push(token);
      if (child.isWhenStatement) {
        const express = token.type === "BlockStatement" ? token.body : [token];
        if (Array.isArray(express)) {
          const last = express[express.length - 1];
          if (last && last.type === "ReturnStatement") {
            break;
          }
        }
      } else if (child.isReturnStatement || child.hasReturnStatement) {
        break;
      }
    }
  }
  ;
  ctx.removeNode(stack);
  return node;
}

// node_modules/@easescript/transform/lib/tokens/BreakStatement.js
function BreakStatement_default(ctx, stack) {
  const node = ctx.createNode(stack);
  node.label = stack.label && ctx.createIdentifier(stack.label.value(), stack.label);
  return node;
}

// node_modules/@easescript/transform/lib/tokens/CallExpression.js
var import_Utils9 = __toESM(require("easescript/lib/core/Utils"));
function CallExpression_default(ctx, stack) {
  const isMember = stack.callee.isMemberExpression;
  const desc = stack.descriptor();
  const module2 = stack.module;
  const isChainExpression = stack.parentStack.isChainExpression;
  if (stack.callee.isSuperExpression) {
    const parent = module2 && module2.inherit;
    if (parent) {
      ctx.addDepend(parent, module2);
      if (!ctx.isActiveModule(parent, stack.module) || ctx.isES6ClassModule(parent)) {
        return null;
      }
    }
  }
  if (isMember && !isChainExpression && (!desc || desc.isType && desc.isAnyType)) {
    const property = stack.callee.computed ? ctx.createToken(stack.callee.property) : ctx.createLiteral(
      stack.callee.property.value()
    );
    const args = [
      module2 ? ctx.createIdentifier(module2.id) : ctx.createLiteral(null),
      ctx.createToken(stack.callee.object),
      property,
      ctx.createArrayExpression(
        stack.arguments.map((item) => ctx.createToken(item))
      )
    ];
    if (stack.callee.object.isSuperExpression) {
      args.push(ctx.createThisExpression());
    }
    return ctx.createCallExpression(
      createStaticReferenceNode(ctx, stack, "Reflect", "call"),
      args,
      stack
    );
  }
  if (stack.callee.isSuperExpression || isMember && stack.callee.object.isSuperExpression && !isChainExpression) {
    return ctx.createCallExpression(
      ctx.createMemberExpression(
        [
          ctx.createToken(stack.callee),
          ctx.createIdentifier("call")
        ]
      ),
      [
        ctx.createThisExpression()
      ].concat(stack.arguments.map((item) => ctx.createToken(item))),
      stack
    );
  }
  const privateChain = ctx.options.privateChain;
  if (privateChain && desc && desc.isMethodDefinition && !(desc.static || desc.module.static)) {
    const modifier = import_Utils9.default.getModifierValue(desc);
    const refModule = desc.module;
    if (modifier === "private" && refModule.children.length > 0) {
      return ctx.createCallExpression(
        ctx.createMemberExpression(
          [
            ctx.createToken(stack.callee),
            ctx.createIdentifier("call")
          ]
        ),
        [isMember ? ctx.createToken(stack.callee.object) : ctx.createThisExpression()].concat(stack.arguments.map((item) => ctx.createToken(item))),
        stack
      );
    }
  }
  if (desc) {
    let type = desc.isCallDefinition ? desc.module : desc;
    if (!isMember && !stack.callee.isSuperExpression && desc.isMethodDefinition)
      type = desc.module;
    if (import_Utils9.default.isTypeModule(type)) {
      ctx.addDepend(desc, module2);
    }
  }
  const node = ctx.createNode(stack);
  node.callee = ctx.createToken(stack.callee);
  node.arguments = stack.arguments.map((item) => ctx.createToken(item));
  node.isChainExpression = isChainExpression;
  return node;
}

// node_modules/@easescript/transform/lib/tokens/ChainExpression.js
function ChainExpression_default(ctx, stack) {
  const node = ctx.createNode(stack);
  node.expression = ctx.createToken(stack.expression);
  return node;
}

// node_modules/@easescript/transform/lib/core/ClassBuilder.js
var import_Namespace3 = __toESM(require("easescript/lib/core/Namespace"));
var modifierMaps = {
  "public": MODIFIER_PUBLIC,
  "protected": MODIFIER_PROTECTED,
  "private": MODIFIER_PRIVATE
};
var kindMaps = {
  "accessor": KIND_ACCESSOR,
  "var": KIND_VAR,
  "const": KIND_CONST,
  "method": KIND_METHOD,
  "enumProperty": KIND_ENUM_PROPERTY
};
var ClassBuilder = class {
  constructor(stack) {
    this.stack = stack;
    this.compilation = stack.compilation;
    this.module = stack.module;
    this.privateProperties = [];
    this.initProperties = [];
    this.body = [];
    this.beforeBody = [];
    this.afterBody = [];
    this.methods = [];
    this.members = [];
    this.construct = null;
    this.implements = [];
    this.inherit = null;
    this.privateSymbolNode = null;
    this.definePrivatePropertyNode = null;
    this.privateName = null;
    this.mainEnter = null;
  }
  create(ctx) {
    ctx.setNode(this.stack, this);
    const module2 = this.module;
    const stack = this.stack;
    this.createInherit(ctx, module2, stack);
    this.createImplements(ctx, module2, stack);
    this.createBody(ctx, module2, stack);
    let methods = this.createMemberDescriptors(ctx, this.methods);
    let members = this.createMemberDescriptors(ctx, this.members);
    let creator = this.createCreator(
      ctx,
      module2,
      this.getModuleDeclarationId(module2),
      this.createClassDescriptor(ctx, module2, methods, members)
    );
    ctx.crateModuleAssets(module2);
    ctx.createModuleImportReferences(module2);
    if (this.mainEnter) {
      ctx.addNodeToAfterBody(
        ctx.createExpressionStatement(
          ctx.createExpressionStatement(this.mainEnter)
        )
      );
    }
    if (this.construct) {
      let exists = this.construct.comments;
      let classComments = createCommentsNode(ctx, stack);
      if (!exists) {
        this.construct.comments = classComments;
      } else if (exists && classComments) {
        exists.value = classComments.value + "\n" + exists.value;
      }
    }
    let expressions = [
      this.construct,
      ...this.beforeBody,
      ...this.body,
      ...this.afterBody,
      ctx.createExpressionStatement(creator)
    ];
    let symbolNode = this.privateSymbolNode;
    if (symbolNode) {
      expressions.unshift(symbolNode);
    }
    this.createExport(ctx, module2);
    ctx.removeNode(this.stack);
    return ctx.createMultipleStatement(expressions);
  }
  getModuleDeclarationId(module2) {
    return module2.id;
  }
  createExport(ctx, module2) {
    if (this.stack.compilation.mainModule === module2) {
      ctx.addExport(
        "default",
        ctx.createIdentifier(
          this.getModuleDeclarationId(module2)
        )
      );
    }
  }
  createBody(ctx, module2, stack) {
    this.createMemebers(ctx, stack);
    this.createIteratorMethodNode(ctx, module2);
    if (!this.construct) {
      this.construct = this.createDefaultConstructor(ctx, this.getModuleDeclarationId(module2), module2.inherit);
    }
    this.checkConstructor(ctx, this.construct, module2);
    this.checkSuperES6Class(ctx, this.construct, module2);
  }
  createInherit(ctx, module2, stack = null) {
    let inherit = module2.inherit;
    if (inherit) {
      ctx.addDepend(inherit, module2);
      if (ctx.isActiveModule(inherit, module2)) {
        this.inherit = ctx.createIdentifier(
          ctx.getModuleReferenceName(inherit, module2)
        );
      }
    }
  }
  createImplements(ctx, module2, stack = null) {
    this.implements = module2.implements.map((impModule) => {
      ctx.addDepend(impModule, module2);
      if (impModule.isInterface && ctx.isActiveModule(impModule, module2) && import_Namespace3.default.globals.get("Iterator") !== impModule) {
        return ctx.createIdentifier(
          ctx.getModuleReferenceName(impModule, module2)
        );
      }
      return null;
    }).filter(Boolean);
  }
  createIteratorMethodNode(ctx, module2) {
    const iteratorType = import_Namespace3.default.globals.get("Iterator");
    if (module2.implements.includes(iteratorType)) {
      const block = ctx.createBlockStatement();
      block.body.push(
        ctx.createReturnStatement(
          ctx.createThisExpression()
        )
      );
      const method = ctx.createMethodDefinition("Symbol.iterator", block);
      method.key.computed = true;
      method.static = false;
      method.modifier = "public";
      method.kind = "method";
      this.members.push(method);
    }
  }
  createPrivateRefsName(ctx) {
    if (!this.privateName && ctx.options.privateChain) {
      this.privateName = ctx.getGlobalRefName(this.stack, PRIVATE_NAME, this.module);
      if (!this.privateSymbolNode) {
        this.privateSymbolNode = this.createPrivateSymbolNode(ctx, this.privateName);
      }
    }
    return this.privateName;
  }
  createPrivateSymbolNode(ctx, name) {
    if (!ctx.options.privateChain)
      return null;
    let isProd = ctx.plugin.options.mode === "production";
    if (isProd) {
      return ctx.createVariableDeclaration(
        "const",
        [
          ctx.createVariableDeclarator(
            ctx.createIdentifier(name),
            ctx.createCallExpression(
              ctx.createIdentifier("Symbol"),
              [
                ctx.createLiteral("private")
              ]
            )
          )
        ]
      );
    } else {
      return ctx.createVariableDeclaration(
        "const",
        [
          ctx.createVariableDeclarator(
            ctx.createIdentifier(name),
            ctx.createCallExpression(
              createStaticReferenceNode(ctx, this.stack, "Class", "getKeySymbols"),
              [
                ctx.createLiteral(ctx.getHashId())
              ]
            )
          )
        ]
      );
    }
  }
  checkSuperES6Class(ctx, construct, module2) {
    const inherit = module2.inherit;
    if (inherit && ctx.isES6ClassModule(inherit)) {
      const wrap = ctx.createFunctionExpression(construct.body);
      construct.body.body.push(ctx.createReturnStatement(ctx.createThisExpression()));
      const block = ctx.createBlockStatement();
      block.body.push(
        ctx.createReturnStatement(
          ctx.createCallExpression(
            createStaticReferenceNode(ctx, this.stack, "Reflect", "apply"),
            [
              wrap,
              ctx.createCallExpression(
                createStaticReferenceNode(ctx, this.stack, "Reflect", "construct"),
                [
                  ctx.createIdentifier(ctx.getModuleReferenceName(inherit, module2)),
                  ctx.createIdentifier("arguments"),
                  ctx.createIdentifier(this.getModuleDeclarationId(module2))
                ]
              )
            ]
          )
        )
      );
      construct.body = block;
    }
  }
  createDefinePrivatePropertyNode(ctx) {
    let exists = this.definePrivatePropertyNode;
    if (exists)
      return exists;
    let privateName = this.createPrivateRefsName(ctx);
    return this.definePrivatePropertyNode = ctx.createExpressionStatement(
      ctx.createCallExpression(
        ctx.createMemberExpression([
          ctx.createIdentifier("Object"),
          ctx.createIdentifier("defineProperty")
        ]),
        [
          ctx.createThisExpression(),
          ctx.createIdentifier(privateName),
          ctx.createObjectExpression([
            ctx.createProperty(
              ctx.createIdentifier("value"),
              ctx.createObjectExpression([])
            )
          ])
        ]
      )
    );
  }
  appendDefinePrivatePropertyNode(ctx, ...propertyNodes) {
    const node = this.createDefinePrivatePropertyNode(ctx);
    if (propertyNodes.length > 0) {
      node.expression.arguments[2].properties[0].init.properties.push(...propertyNodes);
    }
    return node;
  }
  checkNeedInitPrivateNode() {
    return this.privateProperties.length > 0 || this.initProperties.length > 0;
  }
  checkConstructor(ctx, construct, module2) {
    construct.type = "FunctionDeclaration";
    construct.kind = "";
    construct.key.value = this.getModuleDeclarationId(module2);
    if (this.checkNeedInitPrivateNode()) {
      let body = construct.body.body;
      let appendAt = module2.inherit ? 1 : 0;
      let els = [
        ...this.initProperties,
        this.appendDefinePrivatePropertyNode(ctx, ...this.privateProperties)
      ];
      body.splice(appendAt, 0, ...els);
    }
  }
  createInitMemberProperty(ctx, node, stack = null, staticFlag = false) {
    if (staticFlag)
      return;
    if (ctx.options.privateChain && node.modifier === "private") {
      this.privateProperties.push(
        ctx.createProperty(
          node.key,
          node.init || ctx.createLiteral(null)
        )
      );
    } else {
      this.initProperties.push(
        ctx.createExpressionStatement(
          ctx.createAssignmentExpression(
            ctx.createMemberExpression([
              ctx.createThisExpression(),
              node.key
            ]),
            node.init || ctx.createLiteral(null)
          )
        )
      );
    }
    node.init = null;
  }
  createMemebers(ctx, stack) {
    const cache1 = /* @__PURE__ */ new Map();
    const cache2 = /* @__PURE__ */ new Map();
    stack.body.forEach((item) => {
      const child = this.createMemeber(ctx, item, !!stack.static);
      if (!child)
        return;
      const staticFlag = !!(stack.static || child.static);
      const refs = staticFlag ? this.methods : this.members;
      if (child.type === "PropertyDefinition") {
        this.createInitMemberProperty(ctx, child, item, staticFlag);
      }
      if (item.isMethodSetterDefinition || item.isMethodGetterDefinition) {
        const name = child.key.value;
        const dataset = staticFlag ? cache1 : cache2;
        let target = dataset.get(name);
        if (!target) {
          target = {
            isAccessor: true,
            kind: "accessor",
            key: child.key,
            modifier: child.modifier
          };
          dataset.set(name, target);
          refs.push(target);
        }
        if (item.isMethodGetterDefinition) {
          target.get = child;
        } else if (item.isMethodSetterDefinition) {
          target.set = child;
        }
      } else if (item.isConstructor && item.isMethodDefinition) {
        this.construct = child;
      } else {
        refs.push(child);
      }
    });
  }
  createAnnotations(ctx, stack, node, staticFlag = false) {
    if (staticFlag && stack.isMethodDefinition && stack.isEnterMethod && node.modifier === "public" && !this.mainEnter) {
      this.mainEnter = createMainAnnotationNode(ctx, stack);
    }
    return node;
  }
  createMemeber(ctx, stack, staticFlag = false) {
    const node = ctx.createToken(stack);
    if (node) {
      this.createAnnotations(ctx, stack, node, !!(staticFlag || node.static));
    }
    return node;
  }
  createDefaultConstructor(ctx, name, inherit = null, params = []) {
    const block = ctx.createBlockStatement();
    if (inherit && !ctx.isES6ClassModule(inherit)) {
      const se = ctx.createSuperExpression(
        ctx.getModuleReferenceName(inherit, this.module)
      );
      const args = params.length > 0 ? ctx.createArrayExpression(params) : ctx.createIdentifier("arguments");
      block.body.push(
        ctx.createExpressionStatement(
          ctx.createCallExpression(
            ctx.createMemberExpression(
              [
                se,
                ctx.createIdentifier("apply")
              ]
            ),
            [
              ctx.createThisExpression(),
              args
            ]
          )
        )
      );
    }
    return ctx.createMethodDefinition(
      name,
      block,
      params
    );
  }
  createMemberDescriptor(ctx, node) {
    if (node.dynamic && node.type === "PropertyDefinition") {
      return null;
    }
    let key = node.key;
    let kind = kindMaps[node.kind];
    let modifier = node.modifier || "public";
    let properties2 = [];
    let mode = modifierMaps[modifier] | kindMaps[node.kind];
    let _static = node.static;
    if (node.static) {
      mode |= MODIFIER_STATIC;
    }
    if (node.isAbstract) {
      mode |= MODIFIER_ABSTRACT;
    }
    if (node.isFinal) {
      mode |= MODIFIER_FINAL;
    }
    delete node.static;
    if (node.type === "MethodDefinition" || node.kind === "method") {
      node.kind = "";
      if (key.computed) {
        node.key = null;
      }
    }
    node.disabledNewLine = true;
    properties2.push(
      ctx.createProperty(
        ctx.createIdentifier("m"),
        ctx.createLiteral(mode)
      )
    );
    if (kind === KIND_VAR) {
      properties2.push(
        ctx.createProperty(
          ctx.createIdentifier("writable"),
          ctx.createLiteral(true)
        )
      );
    }
    if (!_static && (node.isAccessor || kind === KIND_VAR || kind === KIND_CONST) && modifier === "public") {
      properties2.push(
        ctx.createProperty(
          ctx.createIdentifier("enumerable"),
          ctx.createLiteral(true)
        )
      );
    }
    let isConfigurable = !!node.isConfigurable;
    let createProperty = (key2, value, raw = null) => {
      let node2 = ctx.createProperty(
        ctx.createIdentifier(key2),
        value
      );
      raw = raw || value;
      if (raw.comments) {
        node2.comments = raw.comments;
        raw.comments = null;
      }
      return node2;
    };
    if (node.isAccessor) {
      if (node.get) {
        if (node.get.isConfigurable)
          isConfigurable = true;
        node.get.disabledNewLine = true;
        delete node.get.static;
        properties2.push(createProperty("get", node.get));
      }
      if (node.set) {
        if (node.set.isConfigurable)
          isConfigurable = true;
        node.set.disabledNewLine = true;
        delete node.set.static;
        properties2.push(createProperty("set", node.set));
      }
    } else {
      if (node.type === "PropertyDefinition") {
        if (node.init) {
          properties2.push(createProperty("value", node.init, node));
        }
      } else {
        properties2.push(createProperty("value", node));
      }
    }
    if (isConfigurable) {
      properties2.push(
        ctx.createProperty(
          ctx.createIdentifier("configurable"),
          ctx.createLiteral(true)
        )
      );
    }
    return ctx.createProperty(
      key,
      ctx.createObjectExpression(properties2)
    );
  }
  createClassDescriptor(ctx, module2, methods, members) {
    const properties2 = [];
    let kind = module2.isEnum ? KIND_CLASS : module2.isInterface ? KIND_INTERFACE : KIND_CLASS;
    kind |= MODIFIER_PUBLIC;
    if (module2.static) {
      kind |= MODIFIER_STATIC;
    }
    if (module2.abstract) {
      kind |= MODIFIER_ABSTRACT;
    }
    if (module2.isFinal) {
      kind |= MODIFIER_FINAL;
    }
    properties2.push(
      ctx.createProperty(
        ctx.createIdentifier("m"),
        ctx.createLiteral(kind)
      )
    );
    const ns = module2.namespace && module2.namespace.toString();
    if (ns) {
      properties2.push(
        ctx.createProperty(
          ctx.createIdentifier("ns"),
          ctx.createLiteral(ns)
        )
      );
    }
    properties2.push(
      ctx.createProperty(
        ctx.createIdentifier("name"),
        ctx.createLiteral(module2.id)
      )
    );
    if (module2.dynamic) {
      properties2.push(
        ctx.createProperty(
          ctx.createIdentifier("dynamic"),
          ctx.createLiteral(true)
        )
      );
    }
    if (this.privateName) {
      properties2.push(
        ctx.createProperty(
          ctx.createIdentifier("private"),
          ctx.createIdentifier(this.privateName)
        )
      );
    }
    if (this.implements.length > 0) {
      properties2.push(
        ctx.createProperty(
          ctx.createIdentifier("imps"),
          ctx.createArrayExpression(this.implements)
        )
      );
    }
    if (this.inherit) {
      properties2.push(
        ctx.createProperty(
          ctx.createIdentifier("inherit"),
          this.inherit
        )
      );
    }
    if (methods) {
      properties2.push(
        ctx.createProperty(
          ctx.createIdentifier("methods"),
          methods
        )
      );
    }
    if (members) {
      properties2.push(
        ctx.createProperty(
          ctx.createIdentifier("members"),
          members
        )
      );
    }
    return ctx.createObjectExpression(properties2);
  }
  createCreator(ctx, module2, className, description) {
    const args = [
      ctx.createIdentifier(className || module2.id),
      description
    ];
    return ctx.createCallExpression(
      createStaticReferenceNode(ctx, this.stack, "Class", "creator"),
      args
    );
  }
  createMemberDescriptors(ctx, members) {
    if (!members.length)
      return;
    return ctx.createObjectExpression(
      members.map((node) => this.createMemberDescriptor(ctx, node)).filter(Boolean)
    );
  }
};
var ClassBuilder_default = ClassBuilder;

// node_modules/@easescript/transform/lib/tokens/ClassDeclaration.js
function ClassDeclaration_default(ctx, stack) {
  const builder = new ClassBuilder_default(stack);
  return builder.create(ctx);
}

// node_modules/@easescript/transform/lib/tokens/ConditionalExpression.js
function ConditionalExpression_default(ctx, stack) {
  const node = ctx.createNode(stack);
  node.test = ctx.createToken(stack.test);
  node.consequent = ctx.createToken(stack.consequent);
  node.alternate = ctx.createToken(stack.alternate);
  return node;
}

// node_modules/@easescript/transform/lib/tokens/ContinueStatement.js
function ContinueStatement_default(ctx, stack) {
  const node = ctx.createNode(stack);
  node.label = ctx.createToken(stack.label);
  return node;
}

// node_modules/@easescript/transform/lib/tokens/Declarator.js
function Declarator_default(ctx, stack) {
  const node = ctx.createNode(stack, "Identifier");
  node.value = node.raw = stack.value();
  return node;
}

// node_modules/@easescript/transform/lib/tokens/DeclaratorDeclaration.js
function DeclaratorDeclaration_default(ctx, stack) {
}

// node_modules/@easescript/transform/lib/tokens/DoWhileStatement.js
function DoWhileStatement_default(ctx, stack) {
  const node = ctx.createNode(stack);
  node.condition = ctx.createToken(stack.condition);
  node.body = ctx.createToken(stack.body);
  return node;
}

// node_modules/@easescript/transform/lib/tokens/EmptyStatement.js
function EmptyStatement_default() {
}

// node_modules/@easescript/transform/lib/core/EnumBuilder.js
var import_Namespace4 = __toESM(require("easescript/lib/core/Namespace.js"));
var EnumBuilder = class extends ClassBuilder_default {
  create(ctx) {
    ctx.setNode(this.stack, this);
    const module2 = this.module;
    const stack = this.stack;
    this.createInherit(ctx, module2, stack);
    this.createImplements(ctx, module2, stack);
    this.createBody(ctx, module2, stack);
    let methods = this.createMemberDescriptors(ctx, this.methods);
    let members = this.createMemberDescriptors(ctx, this.members);
    let creator = this.createCreator(
      ctx,
      module2,
      module2.id,
      this.createClassDescriptor(ctx, module2, methods, members)
    );
    ctx.crateModuleAssets(module2);
    ctx.createModuleImportReferences(module2);
    if (stack.compilation.mainModule === module2) {
      ctx.addExport("default", ctx.createIdentifier(module2.id));
    }
    ctx.removeNode(this.stack);
    let expressions = [
      this.construct,
      ...this.beforeBody,
      ...this.body,
      ...this.afterBody,
      ctx.createExpressionStatement(creator)
    ];
    let symbolNode = this.privateSymbolNode;
    if (symbolNode) {
      expressions.unshift(symbolNode);
    }
    return ctx.createMultipleStatement(expressions);
  }
  createEnumExpression(ctx) {
    let stack = this.stack;
    const name = stack.value();
    const init = ctx.createAssignmentExpression(
      ctx.createIdentifier(name, stack),
      ctx.createObjectExpression()
    );
    const properties2 = stack.properties.map((item) => {
      const initNode = ctx.createMemberExpression([
        ctx.createIdentifier(name, item.key),
        ctx.createLiteral(
          item.key.value(),
          void 0,
          item.key
        )
      ]);
      initNode.computed = true;
      const initAssignmentNode = ctx.createAssignmentExpression(
        initNode,
        ctx.createLiteral(
          item.init.value(),
          item.init.value(),
          item.init
        )
      );
      const left = ctx.createMemberExpression([
        ctx.createIdentifier(name),
        initAssignmentNode
      ]);
      left.computed = true;
      return ctx.createAssignmentExpression(
        left,
        ctx.createLiteral(
          item.key.value(),
          void 0,
          item.key
        )
      );
    });
    properties2.push(ctx.createIdentifier(name));
    return ctx.createVariableDeclaration("var", [
      ctx.createVariableDeclarator(
        ctx.createIdentifier(name, stack),
        ctx.createParenthesizedExpression(
          ctx.createSequenceExpression([init, ...properties2])
        )
      )
    ]);
  }
  createBody(ctx, module2, stack) {
    this.createMemebers(ctx, stack);
    if (!this.construct) {
      this.construct = this.createDefaultConstructor(ctx, module2.id, module2.inherit);
    }
    this.checkConstructor(ctx, this.construct, module2);
  }
  createInherit(ctx, module2, stack = null) {
    let inherit = module2.inherit;
    if (inherit) {
      ctx.addDepend(inherit, stack.module);
      if (ctx.isActiveModule(inherit, stack.module)) {
        this.inherit = ctx.createIdentifier(
          ctx.getModuleReferenceName(inherit, module2),
          stack.inherit
        );
      }
    }
    if (!this.inherit) {
      const inherit2 = import_Namespace4.default.globals.get("Enumeration");
      ctx.addDepend(inherit2, stack.module);
      this.inherit = ctx.createIdentifier(
        ctx.getModuleReferenceName(inherit2, module2)
      );
    }
  }
  createMemebers(ctx, stack) {
    let methods = this.methods;
    stack.properties.forEach((item) => {
      const child = this.createMemeber(ctx, item);
      if (child) {
        methods.push(child);
      }
    });
    super.createMemebers(ctx, stack);
  }
};
var EnumBuilder_default = EnumBuilder;

// node_modules/@easescript/transform/lib/tokens/EnumDeclaration.js
function EnumDeclaration_default(ctx, stack) {
  const builder = new EnumBuilder_default(stack);
  if (stack.isExpression) {
    return builder.createEnumExpression(ctx);
  } else {
    return builder.create(ctx);
  }
}

// node_modules/@easescript/transform/lib/tokens/EnumProperty.js
function EnumProperty_default(ctx, stack) {
  const node = ctx.createNode(stack, "PropertyDefinition");
  node.static = true;
  node.key = ctx.createToken(stack.key);
  node.init = ctx.createToken(stack.init);
  node.modifier = "public";
  node.kind = "enumProperty";
  return node;
}

// node_modules/@easescript/transform/lib/tokens/ExportAllDeclaration.js
function ExportAllDeclaration_default(ctx, stack) {
  if (stack.getResolveJSModule() || !stack.source) {
    return null;
  }
  let source = stack.source.value();
  const compilation = stack.getResolveCompilation();
  if (compilation && compilation.stack) {
    ctx.addDepend(compilation);
    source = ctx.getModuleImportSource(stack.getResolveFile(), stack.compilation.file);
  } else {
    source = ctx.getModuleImportSource(source, stack.compilation.file);
  }
  let importSource = ctx.getImport(source, true);
  if (!importSource) {
    importSource = ctx.addImport(source, null, "*");
    importSource.setExportSource();
    importSource.setSourceTarget(compilation);
  }
  ctx.addExport(stack.exported ? stack.exported.value() : null, "*", importSource, stack);
}

// node_modules/@easescript/transform/lib/tokens/ExportDefaultDeclaration.js
function ExportDefaultDeclaration_default(ctx, stack) {
  let declaration = ctx.createToken(stack.declaration);
  if (declaration) {
    ctx.addExport("default", declaration, null, stack);
  }
}

// node_modules/@easescript/transform/lib/tokens/ExportNamedDeclaration.js
function ExportNamedDeclaration_default(ctx, stack) {
  if (stack.getResolveJSModule()) {
    return null;
  }
  let exportSource = null;
  if (stack.declaration) {
    const decl = stack.declaration;
    if (decl.isVariableDeclaration) {
      let decls = decl.declarations.map((decl2) => decl2.id.value());
      exportSource = ctx.addExport(decls.shift(), ctx.createToken(decl), null, decl);
      exportSource.bindExport(decls);
    } else if (decl.isFunctionDeclaration) {
      exportSource = ctx.addExport(decl.key.value(), ctx.createToken(decl), null, decl);
    } else {
      throw new Error(`Export declaration type only support 'var' or 'function'`);
    }
  } else if (stack.specifiers && stack.specifiers.length > 0) {
    let source = null;
    if (stack.source) {
      source = stack.source.value();
      let compilation = stack.getResolveCompilation();
      if (compilation && compilation.stack) {
        ctx.addDepend(compilation);
        source = ctx.getModuleImportSource(stack.getResolveFile(), stack.compilation.file);
      } else {
        source = ctx.getModuleImportSource(source, stack.compilation.file);
      }
      let importSource = ctx.getImport(source);
      if (!importSource) {
        importSource = ctx.addImport(source);
        importSource.setExportSource();
        importSource.setSourceTarget(compilation);
      }
      source = importSource;
    }
    stack.specifiers.forEach((spec) => {
      let exported = spec.exported || spec.local;
      exportSource = ctx.addExport(exported.value(), spec.local.value(), source, spec);
    });
  }
  if (exportSource) {
    exportSource.stack = stack;
  }
}

// node_modules/@easescript/transform/lib/tokens/ExportSpecifier.js
function ExportSpecifier_default(ctx, stack) {
  const node = ctx.createNode(stack);
  node.exported = ctx.createToken(stack.exported);
  node.local = ctx.createToken(stack.local);
  return node;
}

// node_modules/@easescript/transform/lib/tokens/ExpressionStatement.js
function ExpressionStatement_default(ctx, stack) {
  const node = ctx.createNode(stack);
  node.expression = ctx.createToken(stack.expression);
  return node;
}

// node_modules/@easescript/transform/lib/tokens/ForInStatement.js
function ForInStatement_default(ctx, stack) {
  const node = ctx.createNode(stack);
  node.left = ctx.createToken(stack.left);
  node.right = ctx.createToken(stack.right);
  node.body = ctx.createToken(stack.body);
  return node;
}

// node_modules/@easescript/transform/lib/tokens/ForOfStatement.js
var import_Utils10 = __toESM(require("easescript/lib/core/Utils"));
function ForOfStatement_default(ctx, stack) {
  const type = import_Utils10.default.getOriginType(stack.right.type());
  if (import_Utils10.default.isLocalModule(type) || stack.right.type().isAnyType) {
    const node2 = ctx.createNode(stack, "ForStatement");
    const obj = ctx.getLocalRefName(stack, "_i");
    const res = ctx.getLocalRefName(stack, "_v");
    const init = ctx.createToken(stack.left);
    const object = ctx.createAssignmentExpression(
      ctx.createIdentifier(obj),
      ctx.createCallExpression(
        createStaticReferenceNode(ctx, stack, "System", "getIterator"),
        [
          ctx.createToken(stack.right)
        ],
        stack.right
      )
    );
    init.declarations.push(ctx.createIdentifier(res));
    init.declarations.push(object);
    const condition = ctx.createChunkExpression(`${obj} && (${res}=${obj}.next()) && !${res}.done`, false);
    node2.init = init;
    node2.condition = condition;
    node2.update = null;
    node2.body = ctx.createToken(stack.body);
    const block = node2.body;
    const assignment = ctx.createExpressionStatement(
      ctx.createAssignmentExpression(
        ctx.createIdentifier(init.declarations[0].id.value),
        ctx.createMemberExpression([
          ctx.createIdentifier(res),
          ctx.createIdentifier("value")
        ])
      )
    );
    block.body.splice(0, 0, assignment);
    return node2;
  }
  const node = ctx.createNode(stack);
  node.left = ctx.createToken(stack.left);
  node.right = ctx.createToken(stack.right);
  node.body = ctx.createToken(stack.body);
  return node;
}

// node_modules/@easescript/transform/lib/tokens/ForStatement.js
function ForStatement_default(ctx, stack) {
  const node = ctx.createNode(stack);
  node.init = ctx.createToken(stack.init);
  node.condition = ctx.createToken(stack.condition);
  node.update = ctx.createToken(stack.update);
  node.body = ctx.createToken(stack.body);
  return node;
}

// node_modules/@easescript/transform/lib/tokens/FunctionDeclaration.js
function FunctionDeclaration_default(ctx, stack, type) {
  const node = FunctionExpression_default(ctx, stack, type);
  if (stack.key) {
    let name = stack.key.value();
    if (stack.isMethodDefinition && !stack.isConstructor) {
      name = getMethodOrPropertyAlias(ctx, stack, name) || name;
    }
    node.key = ctx.createIdentifier(name, stack.key);
  }
  return node;
}

// node_modules/@easescript/transform/lib/tokens/Identifier.js
var import_Utils11 = __toESM(require("easescript/lib/core/Utils"));
function Identifier_default(ctx, stack) {
  const desc = stack.parentStack && stack.parentStack.isImportSpecifier ? null : stack.descriptor();
  const module2 = stack.module;
  if (import_Utils11.default.isStack(desc) && (desc.isDeclaratorVariable || desc.isDeclaratorFunction)) {
    let imports = desc.imports;
    if (Array.isArray(imports)) {
      imports.forEach((item) => {
        if (item.source.isLiteral) {
          parseImportDeclaration(ctx, item, module2 || stack.compilation);
        }
      });
    }
  }
  if (desc && (desc.isPropertyDefinition || desc.isMethodDefinition || desc.isEnumProperty) && !(stack.parentStack.isProperty && stack.parentStack.key === stack)) {
    const privateChain = ctx.options.privateChain;
    const ownerModule = desc.module;
    const isStatic = !!(desc.static || ownerModule.static || desc.isEnumProperty);
    const property = ctx.createIdentifier(stack.value(), stack);
    const modifier = import_Utils11.default.getModifierValue(desc);
    var object = isStatic ? ctx.createIdentifier(ownerModule.id) : ctx.createThisExpression();
    if (privateChain && desc.isPropertyDefinition && modifier === "private" && !isStatic) {
      object = ctx.createMemberExpression([
        object,
        ctx.createIdentifier(
          ctx.getGlobalRefName(stack, PRIVATE_NAME, stack.module),
          stack
        )
      ]);
      object.computed = true;
      return ctx.createMemberExpression([object, property], stack);
    } else {
      return ctx.createMemberExpression([object, property], stack);
    }
  }
  if (desc !== stack.module && import_Utils11.default.isClassType(desc)) {
    ctx.addDepend(desc, stack.module);
    if (!stack.hasLocalDefined()) {
      return ctx.createIdentifier(
        ctx.getGlobalRefName(
          stack,
          ctx.getModuleReferenceName(desc, module2)
        ),
        stack
      );
    }
  }
  return ctx.createIdentifier(stack.value(), stack);
}

// node_modules/@easescript/transform/lib/tokens/IfStatement.js
function IfStatement_default(ctx, stack) {
  const node = ctx.createNode(stack);
  node.condition = ctx.createToken(stack.condition);
  node.consequent = ctx.createToken(stack.consequent);
  node.alternate = ctx.createToken(stack.alternate);
  return node;
}

// node_modules/@easescript/transform/lib/tokens/ImportDeclaration.js
function ImportDeclaration_default(ctx, stack) {
  let module2 = stack.additional ? stack.additional.module : null;
  parseImportDeclaration(ctx, stack, module2 || stack.compilation);
  return null;
}

// node_modules/@easescript/transform/lib/tokens/ImportDefaultSpecifier.js
function ImportDefaultSpecifier_default(ctx, stack) {
  const node = ctx.createNode(stack);
  node.local = stack.local ? ctx.createToken(stack.local) : ctx.createIdentifier(stack.value(), stack);
  return node;
}

// node_modules/@easescript/transform/lib/tokens/ImportExpression.js
function ImportExpression_default(ctx, stack) {
  const node = ctx.createNode(stack);
  const desc = stack.description();
  if (desc) {
    const source = ctx.getModuleImportSource(desc, stack.compilation.file, stack.source.value());
    node.source = ctx.createLiteral(source, void 0, stack.source);
  } else {
    node.source = ctx.createToken(stack.source);
  }
  return node;
}

// node_modules/@easescript/transform/lib/tokens/ImportNamespaceSpecifier.js
function ImportNamespaceSpecifier_default(ctx, stack) {
  const node = ctx.createNode(stack);
  node.local = stack.local ? ctx.createToken(stack.local) : ctx.createIdentifier(stack.value(), stack);
  return node;
}

// node_modules/@easescript/transform/lib/tokens/ImportSpecifier.js
function ImportSpecifier_default(ctx, stack) {
  const node = ctx.createNode(stack);
  node.imported = node.createToken(stack.imported);
  node.local = stack.local ? ctx.createToken(stack.local) : ctx.createIdentifier(stack.value(), stack);
  return node;
}

// node_modules/@easescript/transform/lib/core/InterfaceBuilder.js
var modifierMaps2 = {
  "public": MODIFIER_PUBLIC,
  "protected": MODIFIER_PROTECTED,
  "private": MODIFIER_PRIVATE
};
var kindMaps2 = {
  "accessor": KIND_ACCESSOR,
  "var": KIND_VAR,
  "const": KIND_CONST,
  "method": KIND_METHOD,
  "enumProperty": KIND_ENUM_PROPERTY
};
var InterfaceBuilder = class extends ClassBuilder_default {
  create(ctx) {
    ctx.setNode(this.stack, this);
    const module2 = this.module;
    const stack = this.stack;
    this.createInherit(ctx, module2, stack);
    this.createImplements(ctx, module2, stack);
    this.createBody(ctx, module2, stack);
    let methods = this.createMemberDescriptors(ctx, this.methods);
    let members = this.createMemberDescriptors(ctx, this.members);
    let creator = this.createCreator(
      ctx,
      module2,
      module2.id,
      this.createClassDescriptor(ctx, module2, methods, members)
    );
    ctx.crateModuleAssets(module2);
    ctx.createModuleImportReferences(module2);
    if (stack.compilation.mainModule === module2) {
      ctx.addExport("default", ctx.createIdentifier(module2.id));
    }
    ctx.removeNode(this.stack);
    let expressions = [
      this.construct,
      ...this.beforeBody,
      ...this.body,
      ...this.afterBody,
      ctx.createExpressionStatement(creator)
    ];
    let symbolNode = this.privateSymbolNode;
    if (symbolNode) {
      expressions.unshift(symbolNode);
    }
    return ctx.createMultipleStatement(expressions);
  }
  createBody(ctx, module2, stack) {
    this.createMemebers(ctx, stack);
    if (!this.construct) {
      this.construct = this.createDefaultConstructor(ctx, module2.id, module2.inherit);
    }
    this.checkConstructor(ctx, this.construct, module2);
  }
  createMemberDescriptor(ctx, node) {
    if (node.dynamic && node.type === "PropertyDefinition") {
      return null;
    }
    let key = node.key;
    let modifier = node.modifier || "public";
    let properties2 = [];
    let mode = modifierMaps2[modifier] | kindMaps2[node.kind];
    if (node.static) {
      mode |= MODIFIER_STATIC;
    }
    if (node.isAbstract) {
      mode |= MODIFIER_ABSTRACT;
    }
    if (node.isFinal) {
      mode |= MODIFIER_FINAL;
    }
    properties2.push(
      ctx.createProperty(
        ctx.createIdentifier("m"),
        ctx.createLiteral(mode)
      )
    );
    if (node.isAccessor) {
      if (node.get) {
        properties2.push(
          ctx.createProperty(
            ctx.createIdentifier("get"),
            ctx.createLiteral(true)
          )
        );
      }
      if (node.set) {
        properties2.push(
          ctx.createProperty(
            ctx.createIdentifier("set"),
            ctx.createLiteral(true)
          )
        );
      }
    }
    return ctx.createProperty(
      key,
      ctx.createObjectExpression(properties2)
    );
  }
};
var InterfaceBuilder_default = InterfaceBuilder;

// node_modules/@easescript/transform/lib/tokens/InterfaceDeclaration.js
function InterfaceDeclaration_default(ctx, stack) {
  const builder = new InterfaceBuilder_default(stack);
  return builder.create(ctx);
}

// node_modules/@easescript/transform/lib/tokens/JSXAttribute.js
var import_Namespace5 = __toESM(require("easescript/lib/core/Namespace"));
function JSXAttribute_default(ctx, stack) {
  let ns = null;
  if (stack.hasNamespaced) {
    const xmlns = stack.getXmlNamespace();
    if (xmlns) {
      ns = xmlns.value.value();
    } else {
      const nsStack = stack.getNamespaceStack();
      const ops2 = stack.compiler.options;
      ns = ops2.jsx.xmlns.default[nsStack.namespace.value()] || ns;
    }
  }
  const node = ctx.createNode(stack);
  node.namespace = ns;
  let name = null;
  let value = stack.value ? ctx.createToken(stack.value) : ctx.createLiteral(true);
  if (stack.isMemberProperty) {
    const eleClass = stack.jsxElement.getSubClassDescription();
    const propsDesc = stack.getAttributeDescription(eleClass);
    const resolveName = getMethodOrPropertyAlias(ctx, propsDesc);
    if (resolveName) {
      name = resolveName.includes("-") ? ctx.createLiteral(resolveName) : ctx.createIdentifier(resolveName);
    }
    const invoke = createJSXAttrHookNode(ctx, stack, propsDesc);
    if (invoke)
      value = invoke;
  }
  if (!name) {
    name = ctx.createToken(stack.hasNamespaced ? stack.name.name : stack.name);
  }
  if (ns === "@binding" && stack.value) {
    const desc = stack.value.description();
    let has = false;
    if (desc) {
      has = (desc.isPropertyDefinition || desc.isTypeObjectPropertyDefinition) && !desc.isReadonly || desc.isMethodGetterDefinition && desc.module && desc.module.getMember(desc.key.value(), "set");
    }
    if (!has && stack.value.isJSXExpressionContainer) {
      let expression = stack.value.expression;
      if (expression) {
        if (expression.isTypeAssertExpression) {
          expression = expression.left;
        }
        if (expression.isMemberExpression) {
          const objectType = import_Namespace5.default.globals.get("Object");
          has = objectType && objectType.is(expression.object.type());
        }
      }
    }
    if (!has) {
      stack.value.error(1e4, stack.value.raw());
    }
  }
  node.name = name;
  node.value = value;
  return node;
}

// node_modules/@easescript/transform/lib/tokens/JSXCdata.js
function JSXCdata_default(ctx, stack) {
  let value = stack.value();
  if (value) {
    value = value.replace(/[\r\n]+/g, "").replace(/\u0022/g, '\\"');
    if (value) {
      return ctx.createLiteral(value);
    }
  }
  return null;
}

// node_modules/@easescript/transform/lib/tokens/JSXClosingElement.js
function JSXClosingElement_default(ctx, stack) {
  const node = ctx.createNode(stack);
  node.name = ctx.createToken(stack.name);
  return node;
}

// node_modules/@easescript/transform/lib/tokens/JSXClosingFragment.js
function JSXClosingFragment_default(ctx, stack) {
  return ctx.createNode(stack);
}

// node_modules/@easescript/transform/lib/core/ESX.js
var import_Namespace6 = __toESM(require("easescript/lib/core/Namespace"));
var import_Utils12 = __toESM(require("easescript/lib/core/Utils"));
function createFragmentVNode(ctx, children, props = null) {
  const items = [
    ctx.createIdentifier(ctx.getVNodeApi("Fragment")),
    props ? props : ctx.createLiteral(null),
    children
  ];
  let node = ctx.createCallExpression(
    ctx.createIdentifier(ctx.getVNodeApi("createVNode")),
    items
  );
  node.isElementVNode = true;
  node.isFragmentVNode = true;
  return node;
}
function createWithDirectives(ctx, node, directives) {
  const array = ctx.createArrayExpression(directives);
  array.newLine = true;
  return ctx.createCallExpression(
    ctx.createIdentifier(
      ctx.getVNodeApi("withDirectives")
    ),
    [
      node,
      array
    ]
  );
}
function createCommentVNode(ctx, text, asBlock = false) {
  let args = [
    ctx.createLiteral(text)
  ];
  if (asBlock) {
    args.push(ctx.createLiteral(true));
  }
  return ctx.createCallExpression(
    ctx.createIdentifier(ctx.getVNodeApi("createCommentVNode")),
    args
  );
}
function createSlotNode(ctx, stack, ...args) {
  if (stack.isSlot && stack.isSlotDeclared) {
    const slots = ctx.createCallExpression(
      ctx.createMemberExpression([
        ctx.createThisExpression(),
        ctx.createIdentifier("getAttribute")
      ]),
      [
        ctx.createLiteral("slots")
      ]
    );
    const node = ctx.createCallExpression(
      ctx.createIdentifier(
        ctx.getVNodeApi("renderSlot")
      ),
      [slots].concat(args)
    );
    node.isSlotNode = true;
    node.isRenderSlot = true;
    return node;
  } else {
    const node = ctx.createCallExpression(
      ctx.createIdentifier(ctx.getVNodeApi("withCtx")),
      args
    );
    node.isSlotNode = true;
    return node;
  }
}
function createWithCtxNode(ctx, node) {
  return ctx.createCallExpression(
    ctx.createIdentifier(ctx.getVNodeApi("withCtx")),
    [
      node
    ]
  );
}
function createForMapNode(ctx, object, element, item, key, index, stack) {
  const params = [item];
  if (key) {
    params.push(key);
  }
  if (index) {
    params.push(index);
  }
  if (element.type === "ArrayExpression" && element.elements.length === 1) {
    element = element.elements[0];
  }
  const node = ctx.createArrowFunctionExpression(element, params);
  return ctx.createCallExpression(
    createStaticReferenceNode(ctx, stack, "System", "forMap"),
    [
      object,
      node
    ]
  );
}
function createForEachNode(ctx, refs, element, item, key, stack) {
  const args = [item];
  if (key) {
    args.push(key);
  }
  if (element.type === "ArrayExpression" && element.elements.length === 1) {
    element = element.elements[0];
  }
  const node = ctx.createCallExpression(
    ctx.createMemberExpression([
      refs,
      ctx.createIdentifier("map")
    ]),
    [
      ctx.createArrowFunctionExpression(element, args)
    ]
  );
  return node;
}
function getComponentDirectiveAnnotation(module2) {
  if (!import_Utils12.default.isModule(module2))
    return null;
  const annots = getModuleAnnotations(module2, ["define"]);
  for (let annot of annots) {
    const args = annot.getArguments();
    if (compare(getAnnotationArgumentValue(args[0]), "directives")) {
      if (args.length > 1) {
        return [module2, getAnnotationArgumentValue(args[1]), annot];
      } else {
        return [module2, module2.getName("-"), annot];
      }
    }
  }
  return null;
}
var directiveInterface = null;
function isDirectiveInterface(module2) {
  if (!import_Utils12.default.isModule(module2))
    return false;
  directiveInterface = directiveInterface || import_Namespace6.default.globals.get("web.components.Directive");
  if (directiveInterface && directiveInterface.isInterface) {
    return directiveInterface.type().isof(module2);
  }
  return false;
}
function getComponentEmitAnnotation(module2) {
  if (!import_Utils12.default.isModule(module2))
    return null;
  const dataset = /* @__PURE__ */ Object.create(null);
  const annots = getModuleAnnotations(module2, ["define"]);
  annots.forEach((annot) => {
    const args = annot.getArguments();
    if (args.length > 1) {
      let value = getAnnotationArgumentValue(args[0]);
      let _args = args;
      let _key = null;
      let isEmits = compare(value, "emits");
      let isOptions = compare(value, "options");
      if (isEmits) {
        _args = args.slice(1);
        _key = "emits";
      } else if (isOptions) {
        _args = args.slice(2);
        _key = getAnnotationArgumentValue(args[1]);
      }
      _key = String(_key).toLowerCase();
      if (_key === "emits") {
        let skip = _args.length > 1 ? _args[_args.length - 1] : null;
        if (skip && skip.assigned && String(skip.key).toLowerCase() === "type") {
          if (skip.value !== "--literal") {
            skip = null;
          }
        } else {
          skip = null;
        }
        _args.forEach((arg) => {
          if (arg === skip || !arg)
            return;
          if (arg.assigned) {
            dataset[arg.key] = arg.value;
          } else {
            dataset[arg.value] = arg.value;
          }
        });
      }
    }
  });
  return dataset;
}
function createChildNode(ctx, stack, childNode, prev = null) {
  if (!childNode)
    return null;
  const cmd = [];
  let content = [childNode];
  if (!stack.directives || !(stack.directives.length > 0)) {
    return {
      cmd,
      child: stack,
      content
    };
  }
  const directives = stack.directives.slice(0).sort((a, b) => {
    const bb = b.name.value().toLowerCase();
    const aa = a.name.value().toLowerCase();
    const v1 = bb === "each" || bb === "for" ? 1 : 0;
    const v2 = aa === "each" || aa === "for" ? 1 : 0;
    return v1 - v2;
  });
  while (directives.length > 0) {
    const directive = directives.shift();
    const name = directive.name.value().toLowerCase();
    const valueArgument = directive.valueArgument;
    if (name === "each" || name === "for") {
      let refs = ctx.createToken(valueArgument.expression);
      let item = ctx.createIdentifier(valueArgument.declare.item);
      let key = ctx.createIdentifier(valueArgument.declare.key || "key");
      let index = valueArgument.declare.index;
      if (index) {
        index = ctx.createIdentifier(index);
      }
      if (name === "each") {
        content[0] = createForEachNode(
          ctx,
          refs,
          content[0],
          item,
          key,
          stack
        );
      } else {
        content[0] = createForMapNode(
          ctx,
          refs,
          content[0],
          item,
          key,
          index,
          stack
        );
      }
      content[0].isForNode = true;
      content[0] = createFragmentVNode(ctx, content[0]);
      cmd.push(name);
    } else if (name === "if") {
      const node = ctx.createNode("ConditionalExpression");
      node.test = ctx.createToken(valueArgument.expression);
      node.consequent = content[0];
      content[0] = node;
      cmd.push(name);
    } else if (name === "elseif") {
      if (!prev || !(prev.cmd.includes("if") || prev.cmd.includes("elseif"))) {
        directive.name.error(1114, name);
      } else {
        cmd.push(name);
      }
      const node = ctx.createNode("ConditionalExpression");
      node.test = ctx.createToken(valueArgument.expression);
      node.consequent = content[0];
      content[0] = node;
    } else if (name === "else") {
      if (!prev || !(prev.cmd.includes("if") || prev.cmd.includes("elseif"))) {
        directive.name.error(1114, name);
      } else {
        cmd.push(name);
      }
    }
  }
  return {
    cmd,
    child: stack,
    content
  };
}
function getCascadeConditional(elements) {
  if (elements.length < 2) {
    throw new Error("Invaild expression");
  }
  let lastElement = elements.pop();
  while (elements.length > 0) {
    const _last = elements.pop();
    if (_last.type === "ConditionalExpression") {
      _last.alternate = lastElement;
      lastElement = _last;
    } else {
      throw new Error("Invaild expression");
    }
  }
  return lastElement;
}
function createChildren(ctx, children, data, stack) {
  let content = [];
  let len = children.length;
  let index = 0;
  let last = null;
  let result = null;
  let next = () => {
    if (index < len) {
      const child = children[index++];
      const childNode = createChildNode(
        ctx,
        child,
        ctx.createToken(child),
        last
      ) || next();
      if (child.hasAttributeSlot) {
        const attributeSlot = child.openingElement.attributes.find((attr) => attr.isAttributeSlot);
        if (attributeSlot) {
          const name = attributeSlot.name.value();
          const scopeName = attributeSlot.value ? ctx.createToken(
            attributeSlot.parserSlotScopeParamsStack()
          ) : null;
          let childrenNodes = childNode.content;
          if (childrenNodes.length === 1 && childrenNodes[0].type === "ArrayExpression") {
            childrenNodes = childrenNodes[0];
          } else {
            childrenNodes = ctx.createArrayExpression(childrenNodes);
          }
          const params = scopeName ? [
            ctx.createAssignmentExpression(
              scopeName,
              ctx.createObjectExpression()
            )
          ] : [];
          data.slots[name] = createSlotNode(
            ctx,
            child,
            ctx.createArrowFunctionExpression(childrenNodes, params)
          );
          return next();
        }
      } else if (child.isSlot && !child.isSlotDeclared) {
        const name = child.openingElement.name.value();
        data.slots[name] = childNode.content[0];
        return next();
      } else if (child.isDirective) {
        childNode.cmd.push(
          child.openingElement.name.value().toLowerCase()
        );
      }
      return childNode;
    }
    return null;
  };
  const push = (data2, value) => {
    if (value) {
      if (Array.isArray(value)) {
        data2.push(...value);
      } else {
        data2.push(value);
      }
    }
  };
  while (true) {
    result = next();
    if (last) {
      let value = null;
      const hasIf = last.cmd.includes("if");
      if (hasIf) {
        if (result && result.cmd.includes("elseif")) {
          result.cmd = last.cmd.concat(result.cmd);
          result.content = last.content.concat(result.content);
        } else if (result && result.cmd.includes("else")) {
          value = getCascadeConditional(last.content.concat(result.content));
          result.ifEnd = true;
        } else {
          if (result)
            result.ifEnd = true;
          last.content.push(createCommentVNode(ctx, "end if"));
          value = getCascadeConditional(last.content);
        }
      } else if (!(last.ifEnd && last.cmd.includes("else"))) {
        value = last.content;
      }
      push(content, value);
    }
    last = result;
    if (!result)
      break;
  }
  if (content.length > 1) {
    content = content.reduce((acc, item) => {
      if ((item.type === "Literal" || item.isScalarType && item.isExpressionContainer) && acc.length > 0) {
        let index2 = acc.length - 1;
        let last2 = acc[index2];
        if (item.type === last2.type && last2.type === "Literal") {
          last2.value += item.value;
          last2.raw = `"${last2.value}"`;
          return acc;
        } else if (last2.type === "Literal" || last2.isScalarType && last2.isExpressionContainer) {
          const node = ctx.createBinaryExpression(
            last2,
            item,
            "+"
          );
          node.isMergeStringNode = true;
          node.isScalarType = true;
          acc.splice(index2, 1, node);
          return acc;
        }
      }
      acc.push(item);
      return acc;
    }, []);
  }
  return content.map((child) => createNormalChildrenVNode(ctx, child, stack));
}
function createNormalChildrenVNode(ctx, vnode, stack) {
  let node = vnode;
  if (vnode.isExpressionContainer && !vnode.isExplicitVNode) {
    node = ctx.createCallExpression(
      createStaticReferenceNode(ctx, stack, "web.components.Component", "normalVNode"),
      [
        vnode
      ]
    );
    node.isElementVNode = true;
  }
  return node;
}
function createGetEventValueNode2(ctx, name = "e") {
  return ctx.createCallExpression(
    ctx.createMemberExpression([
      ctx.createThisExpression(),
      ctx.createIdentifier("getBindEventValue")
    ]),
    [
      ctx.createIdentifier(name)
    ]
  );
}
function createDirectiveArrayNode(ctx, name, expression, ...args) {
  const elems = [
    ctx.createIdentifier(ctx.getVNodeApi(name)),
    expression,
    ...args
  ];
  return ctx.createArrayExpression(elems);
}
function createResolveAttriubeDirective(ctx, attrDirective) {
  if (!attrDirective.value)
    return;
  return ctx.createCallExpression(
    createStaticReferenceNode(ctx, attrDirective, "web.components.Component", "resolveDirective"),
    [
      ctx.createToken(attrDirective.parserAttributeValueStack()),
      attrDirective.module ? ctx.createThisExpression() : ctx.createLiteral(null)
    ]
  );
}
function createAttributeBindingEventNode(ctx, attribute, valueTokenNode) {
  if (attribute.value && attribute.value.isJSXExpressionContainer) {
    const expr = attribute.value.expression;
    if (expr.isAssignmentExpression || expr.isSequenceExpression) {
      return ctx.createArrowFunctionExpression(valueTokenNode);
    } else if (!expr.isFunctionExpression) {
      if (expr.isCallExpression) {
        const isBind = expr.callee.isMemberExpression && expr.callee.property.value() === "bind" && expr.arguments.length > 0 && expr.arguments[0].isThisExpression;
        if (!isBind && valueTokenNode && valueTokenNode.type === "CallExpression") {
          valueTokenNode.arguments.push(ctx.createIdentifier("...args"));
          return ctx.createArrowFunctionExpression(
            valueTokenNode,
            [
              ctx.createIdentifier("...args")
            ]
          );
        }
      } else if (expr.isMemberExpression || expr.isIdentifier) {
        const desc = expr.description();
        const isMethod = desc && (desc.isMethodDefinition && !desc.isAccessor);
        if (isMethod) {
          return ctx.createCallExpression(
            ctx.createMemberExpression([
              valueTokenNode,
              ctx.createIdentifier("bind")
            ]),
            [ctx.createThisExpression()]
          );
        }
      }
    }
  }
  return valueTokenNode;
}
function getBinddingEventName(stack) {
  const bindding = getMethodAnnotations(stack, ["bindding"]);
  if (bindding.length > 0) {
    const [annot] = bindding;
    const args = annot.getArguments();
    return getAnnotationArgumentValue(args[0]);
  }
  return null;
}
function createElementPropsNode(ctx, data, stack, excludes2 = null) {
  const items = [];
  Object.entries(data).map((item) => {
    const [key, value] = item;
    if (key === "slots" || key === "directives" || key === "keyProps") {
      return;
    }
    if (excludes2 && excludes2.includes(key)) {
      return;
    }
    if (value) {
      if (key === "props" || key === "attrs" || key === "on") {
        if (Array.isArray(value)) {
          items.push(...value);
        } else {
          throw new Error(`Invalid ${key}`);
        }
      } else {
        if (value.type === "Property") {
          items.push(value);
        } else {
          throw new Error(`Invalid ${key}`);
        }
      }
    }
  });
  const props = items.length > 0 ? ctx.createObjectExpression(items) : null;
  if (props && stack && stack.isComponent) {
    const desc = stack.description();
    if (desc && import_Utils12.default.isModule(desc)) {
      let has = getModuleAnnotations(desc, ["hook"]).some((annot) => {
        let result = parseHookAnnotation(annot, ctx.plugin.version, ctx.options.metadata.versions);
        return result && result.type === "polyfills:props";
      });
      if (has) {
        return createComponentPropsHookNode(ctx, props, ctx.createLiteral(desc.getName()));
      }
    }
  }
  return props;
}
function createComponentPropsHookNode(ctx, props, className) {
  return ctx.createCallExpression(
    ctx.createMemberExpression([
      ctx.createThisExpression(),
      ctx.createIdentifier("invokeHook")
    ]),
    [
      ctx.createLiteral("polyfills:props"),
      props,
      className
    ]
  );
}
function createAttributes(ctx, stack, data) {
  const ssr = !!ctx.options.ssr;
  const pushEvent = (name, node, category) => {
    if (ssr && category === "on")
      return;
    let events = data[category] || (data[category] = []);
    if (!Node_default.is(name)) {
      name = String(name);
      name = name.includes(":") ? ctx.createLiteral(name) : ctx.createIdentifier(name);
    }
    let property = ctx.createProperty(name, node);
    if (property.key.computed) {
      property.computed = true;
      property.key.computed = false;
    }
    if (category === "on") {
      if (property.computed) {
        property.key = ctx.createTemplateLiteral([
          ctx.createTemplateElement("on")
        ], [
          ctx.createCallExpression(
            createStaticReferenceNode(ctx, stack, "System", "firstUpperCase"),
            [
              property.key
            ]
          )
        ]);
      } else {
        property.key.value = "on" + toFirstUpperCase(property.key.value);
        if (property.key.type === "Literal") {
          property.key.raw = `"${property.key.value}"`;
        }
      }
    }
    events.push(property);
  };
  const createPropertyNode = (propName, propValue) => {
    return ctx.createProperty(
      propName.includes("-") ? ctx.createLiteral(propName) : ctx.createIdentifier(propName),
      propValue
    );
  };
  let isComponent = stack.isComponent || stack.isWebComponent;
  let nodeType = !isComponent ? stack.openingElement.name.value().toLowerCase() : null;
  let binddingModelValue = null;
  let afterDirective = null;
  let custom = null;
  if (nodeType === "input") {
    afterDirective = "vModelText";
  } else if (nodeType === "select") {
    afterDirective = "vModelSelect";
  } else if (nodeType === "textarea") {
    afterDirective = "vModelText";
  }
  const forStack = stack.getParentStack((stack2) => {
    return stack2.scope.isForContext || !(stack2.isJSXElement || stack2.isJSXExpressionContainer);
  }, true);
  const inFor = forStack && forStack.scope && forStack.scope.isForContext ? true : false;
  const descModule = stack.isWebComponent ? stack.description() : null;
  const definedEmits = getComponentEmitAnnotation(descModule);
  const getDefinedEmitName = (name) => {
    if (definedEmits && Object.prototype.hasOwnProperty.call(definedEmits, name)) {
      name = toCamelCase(definedEmits[name]);
    }
    return name;
  };
  stack.openingElement.attributes.forEach((item) => {
    if (item.isAttributeXmlns)
      return;
    if (item.isAttributeDirective) {
      if (item.isAttributeDirective) {
        const name2 = item.name.value();
        if (compare(name2, "show")) {
          data.directives.push(
            createDirectiveArrayNode(
              ctx,
              "vShow",
              ctx.createToken(item.valueArgument.expression)
            )
          );
        } else if (compare(name2, "custom")) {
          data.directives.push(
            createResolveAttriubeDirective(
              ctx,
              item
            )
          );
        }
      }
      return;
    } else if (item.isJSXSpreadAttribute) {
      if (item.argument) {
        data.props.push(
          ctx.createSpreadElement(
            ctx.createToken(item.argument),
            item
          )
        );
      }
      return;
    } else if (item.isAttributeSlot) {
      return;
    }
    let value = ctx.createToken(item);
    if (!value)
      return;
    let ns = value.namespace;
    let name = value.name.value;
    let propName = name;
    let propValue = value.value;
    let attrLowerName = name.toLowerCase();
    if (ns === "@events" || ns === "@natives") {
      name = getDefinedEmitName(name);
    }
    if (ns && ns.includes("::")) {
      let [seg, className] = ns.split("::", 2);
      ns = seg;
      name = createStaticReferenceNode(ctx, item, className, name);
      name.computed = true;
      custom = name;
    }
    let isDOMAttribute = false;
    if (item.isMemberProperty) {
      let attrDesc = item.getAttributeDescription(stack.getSubClassDescription());
      if (attrDesc) {
        isDOMAttribute = getMethodAnnotations(attrDesc, ["domattribute"]).length > 0;
      }
    }
    if (ns === "@events" || ns === "@natives") {
      pushEvent(name, createAttributeBindingEventNode(ctx, item, propValue), "on");
      return;
    } else if (ns === "@binding") {
      binddingModelValue = propValue;
      if (!binddingModelValue || !(binddingModelValue.type === "MemberExpression" || binddingModelValue.type === "Identifier")) {
        binddingModelValue = null;
        if (item.value && item.value.isJSXExpressionContainer) {
          const stack2 = item.value.expression;
          if (stack2 && stack2.isMemberExpression && !stack2.optional) {
            binddingModelValue = ctx.createCallExpression(
              createStaticReferenceNode(ctx, stack2, "Reflect", "set"),
              [
                stack2.module ? ctx.createIdentifier(stack2.module.id) : ctx.createLiteral(null),
                ctx.createToken(stack2.object),
                stack2.computed ? ctx.createToken(stack2.property) : ctx.createLiteral(stack2.property.value()),
                ctx.createIdentifier("value")
              ],
              stack2
            );
            binddingModelValue.isReflectSetter = true;
          }
        }
      }
    }
    if (item.isMemberProperty) {
      if (ns === "@binding" && attrLowerName === "value") {
        data.props.push(
          createPropertyNode(
            propName,
            propValue
          )
        );
        propName = "modelValue";
      }
      if (!isDOMAttribute) {
        data.props.push(
          createPropertyNode(
            propName,
            propValue
          )
        );
        if (ns !== "@binding")
          return;
      }
    }
    if (attrLowerName === "type" && nodeType === "input" && propValue && propValue.type === "Literal") {
      const value2 = propValue.value.toLowerCase();
      if (value2 === "checkbox") {
        afterDirective = "vModelCheckbox";
      } else if (value2 === "radio") {
        afterDirective = "vModelRadio";
      }
    }
    if (ns === "@binding") {
      const createBinddingParams = (getEvent = false) => {
        return [
          binddingModelValue.isReflectSetter ? binddingModelValue : ctx.createAssignmentExpression(
            binddingModelValue,
            getEvent ? createGetEventValueNode2(ctx) : ctx.createIdentifier("e")
          ),
          [
            ctx.createIdentifier("e")
          ]
        ];
      };
      if (custom && binddingModelValue) {
        pushEvent(custom, ctx.createArrowFunctionExpression(
          ...createBinddingParams(!stack.isWebComponent)
        ), "on");
      } else if ((stack.isWebComponent || afterDirective) && binddingModelValue) {
        let eventName = propName;
        if (propName === "modelValue") {
          eventName = "update:modelValue";
        }
        if (item.isMemberProperty) {
          let _name = getBinddingEventName(item.description());
          if (_name) {
            eventName = toCamelCase(_name);
          }
        }
        pushEvent(
          getDefinedEmitName(eventName),
          ctx.createArrowFunctionExpression(
            ...createBinddingParams()
          ),
          "on"
        );
      } else if (binddingModelValue) {
        pushEvent(
          ctx.createIdentifier("input"),
          ctx.createArrowFunctionExpression(
            ...createBinddingParams(true)
          ),
          "on"
        );
      }
      if (afterDirective && binddingModelValue) {
        data.directives.push(
          createDirectiveArrayNode(ctx, afterDirective, binddingModelValue)
        );
      }
      return;
    }
    if (!ns && (attrLowerName === "ref" || attrLowerName === "refs")) {
      name = propName = "ref";
      let useArray = inFor || attrLowerName === "refs";
      if (useArray) {
        propValue = ctx.createArrowFunctionExpression(
          ctx.createCallExpression(
            ctx.createMemberExpression([
              ctx.createThisExpression(),
              ctx.createIdentifier("setRefNode")
            ]),
            [
              value.value,
              ctx.createIdentifier("node"),
              ctx.createLiteral(true)
            ]
          ),
          [
            ctx.createIdentifier("node")
          ]
        );
      }
    }
    if (name === "class" || name === "staticClass") {
      if (propValue && propValue.type !== "Literal") {
        propValue = ctx.createCallExpression(
          ctx.createIdentifier(
            ctx.getVNodeApi("normalizeClass")
          ),
          [
            propValue
          ]
        );
      }
    } else if (name === "style" || name === "staticStyle") {
      if (propValue && !(propValue.type === "Literal" || propValue.type === "ObjectExpression")) {
        propValue = ctx.createCallExpression(
          ctx.createIdentifier(
            ctx.getVNodeApi("normalizeStyle")
          ),
          [propValue]
        );
      }
    } else if (attrLowerName === "key" || attrLowerName === "tag") {
      name = attrLowerName;
    }
    const property = createPropertyNode(
      propName,
      propValue
    );
    switch (name) {
      case "class":
      case "style":
      case "key":
      case "tag":
      case "ref":
        data[name] = property;
        break;
      default:
        if (item.isMemberProperty) {
          data.props.push(property);
        } else {
          data.attrs.push(property);
        }
    }
  });
  if (!data.key) {
    data.key = createElementKeyPropertyNode(ctx, stack);
  }
}
function createElementKeyPropertyNode(ctx, stack) {
  const keys2 = ctx.options.esx.complete.keys;
  const fills = Array.isArray(keys2) && keys2.length > 0 ? keys2 : null;
  const all = keys2 === true;
  if (fills || all) {
    let key = null;
    let direName = null;
    let isForContext = false;
    if (all || fills.includes("for") || fills.includes("each")) {
      if (!stack.isDirective && stack.directives && Array.isArray(stack.directives)) {
        let directive = stack.directives.find((directive2) => ["for", "each"].includes(directive2.name.value().toLowerCase()));
        if (directive) {
          isForContext = true;
          direName = directive.name.value().toLowerCase();
          let valueArgument = directive.valueArgument;
          if (valueArgument) {
            key = valueArgument.declare.index || valueArgument.declare.key;
          }
        }
      }
      if (!direName && stack.parentStack.isDirective && ["for", "each"].includes(stack.parentStack.openingElement.name.value())) {
        const attrs = stack.parentStack.openingElement.attributes;
        const argument = {};
        isForContext = true;
        direName = stack.parentStack.openingElement.name.value().toLowerCase();
        attrs.forEach((attr) => {
          argument[attr.name.value()] = attr.value.value();
        });
        key = argument["index"] || argument["key"];
      }
    }
    if (fills && fills.includes("condition")) {
      if (!stack.isDirective && stack.directives && Array.isArray(stack.directives)) {
        let directive = stack.directives.find((directive2) => ["if", "elseif", "else"].includes(directive2.name.value().toLowerCase()));
        if (directive) {
          direName = directive.name.value().toLowerCase();
        }
      }
      if (!isForContext && stack.parentStack.isDirective && ["if", "elseif", "else"].includes(stack.parentStack.openingElement.name.value())) {
        direName = stack.parentStack.openingElement.name.value().toLowerCase();
      }
    }
    if (all || fills.includes(direName)) {
      return ctx.createProperty(
        ctx.createIdentifier("key"),
        isForContext ? ctx.createBinaryExpression(
          ctx.createLiteral(getDepth(stack) + "."),
          ctx.createIdentifier(key || "key"),
          "+"
        ) : ctx.createLiteral(getDepth(stack))
      );
    }
  }
}
function createComponentDirectiveProperties(ctx, stack, data, callback = null) {
  if (stack) {
    let desc = stack.description();
    let parentIsComponentDirective = getComponentDirectiveAnnotation(desc);
    if (!parentIsComponentDirective) {
      parentIsComponentDirective = isDirectiveInterface(desc);
    }
    if (parentIsComponentDirective) {
      ctx.addDepend(desc);
      let [direModule, direName] = parentIsComponentDirective;
      let node = createResolveComponentDirective(ctx, stack, data, direModule, direName, false, callback);
      if (node) {
        data.directives.push(node);
      }
      if (stack.jsxRootElement !== stack) {
        createComponentDirectiveProperties(ctx, stack.parentStack, data, callback);
      }
      return true;
    }
  }
  return false;
}
function createCustomDirectiveProperties(ctx, stack, data, callback = null) {
  const node = createResolveComponentDirective(ctx, stack, data, null, null, true, callback);
  let res = false;
  if (node) {
    res = true;
    data.directives.push(node);
  }
  if (stack.parentStack && stack.parentStack.isDirective && stack.jsxRootElement !== stack.parentStack) {
    let dName = stack.parentStack.openingElement.name.value().toLowerCase();
    if (dName === "custom") {
      return createCustomDirectiveProperties(ctx, stack.parentStack, data, callback) || res;
    }
  }
  return res;
}
function createResolveComponentDirective(ctx, stack, data, direModule = null, direName = null, isCustom = false, callback = null) {
  const props = [];
  const has = (items, name) => items && items.some((prop) => prop.key.value === name);
  let expression = null;
  let modifier = null;
  let directive = direModule ? ctx.createIdentifier(ctx.getModuleReferenceName(direModule)) : null;
  stack.openingElement.attributes.forEach((attr) => {
    if (attr.isAttributeXmlns || attr.isAttributeDirective)
      return;
    const name = attr.name.value();
    const lower = name.toLowerCase();
    if (lower === "name" && isCustom) {
      let value = attr.value;
      if (value && value.isJSXExpressionContainer) {
        value = value.expression;
      }
      if (value) {
        if (value.isLiteral) {
          directive = ctx.createToken(value);
        } else {
          let desc = value.descriptor();
          let result = null;
          let isMember = desc && (desc.isMethodDefinition || desc.isPropertyDefinition);
          if (isMember) {
            result = getComponentDirectiveAnnotation(desc.module);
          } else {
            result = getComponentDirectiveAnnotation(desc);
          }
          if (result) {
            [direModule, direName] = result;
            ctx.addDepend(direModule);
            if (isMember) {
              directive = ctx.createToken(value);
            } else {
              directive = ctx.createIdentifier(ctx.getModuleReferenceName(direModule, stack.module));
            }
          } else if (isDirectiveInterface(desc)) {
            ctx.addDepend(desc);
            direName = module.getName("-");
            directive = ctx.createIdentifier(ctx.getModuleReferenceName(direModule, stack.module));
          }
        }
        if (!directive) {
          direName = attr.value.value();
        }
      } else {
        const range = stack.compilation.getRangeByNode(attr.name.node);
        console.warn(`No named value directive was specified.\r
 at ${stack.file}(${range.end.line}:${range.end.column})`);
      }
      return;
    }
    if (lower === "value") {
      expression = attr.value ? ctx.createToken(attr.value) : ctx.createLiteral(false);
      return;
    }
    if (lower === "modifier") {
      modifier = attr.value ? ctx.createToken(attr.value) : ctx.createObjectExpression();
      return;
    }
    const attrNode = ctx.createToken(attr);
    if (attrNode) {
      const property = ctx.createProperty(
        attrNode.name,
        attrNode.value
      );
      property.loc = attrNode.loc;
      if (!has(data.attrs, name)) {
        property.isInheritDirectiveProp = true;
        data.attrs.push(property);
      }
      if (callback) {
        callback(property);
      }
    }
  });
  if (direName) {
    props.push(ctx.createProperty(
      ctx.createIdentifier("name"),
      ctx.createLiteral(direName)
    ));
  }
  if (directive) {
    props.push(ctx.createProperty(
      ctx.createIdentifier("directiveClass"),
      directive
    ));
  }
  props.push(ctx.createProperty(
    ctx.createIdentifier("value"),
    expression || this.createLiteralNode(false)
  ));
  if (modifier) {
    props.push(properties.push(
      ctx.createProperty(
        ctx.createIdentifier("modifiers"),
        modifier
      )
    ));
  }
  const object = ctx.createObjectExpression(props);
  const node = ctx.createCallExpression(
    createStaticReferenceNode(ctx, stack, "web.components.Component", "resolveDirective"),
    [
      object,
      ctx.createThisExpression()
    ]
  );
  node.isInheritComponentDirective = true;
  return node;
}
function createSlotElementNode(ctx, stack, children) {
  const openingElement = ctx.createToken(stack.openingElement);
  const args = [ctx, stack];
  let props = null;
  let params = [];
  if (stack.isSlotDeclared) {
    args.push(ctx.createLiteral(stack.openingElement.name.value()));
    if (openingElement.attributes.length > 0) {
      const properties2 = openingElement.attributes.map((attr) => {
        return ctx.createProperty(
          attr.name,
          attr.value
        );
      });
      props = ctx.createObjectExpression(properties2);
    } else {
      props = ctx.createObjectExpression();
    }
    args.push(props);
  } else if (stack.openingElement.attributes.length > 0) {
    const attribute = stack.openingElement.attributes[0];
    if (attribute.value) {
      const stack2 = attribute.parserSlotScopeParamsStack();
      params.push(
        ctx.createAssignmentExpression(
          ctx.createToken(stack2),
          ctx.createObjectExpression()
        )
      );
    }
  }
  if (children) {
    if (Array.isArray(children) && children.length === 0) {
      children = null;
    } else if (children.type === "ArrayExpression" && children.elements.length === 0) {
      children = null;
    }
    if (children) {
      args.push(ctx.createArrowFunctionExpression(children, params));
    }
  }
  return createSlotNode(...args);
}
function createDirectiveElementNode(ctx, stack, children) {
  const openingElement = stack.openingElement;
  const name = openingElement.name.value().toLowerCase();
  switch (name) {
    case "custom":
    case "show":
      return children;
    case "if":
    case "elseif": {
      const condition = ctx.createToken(stack.attributes[0].parserAttributeValueStack());
      const node = ctx.createNode("ConditionalExpression");
      node.test = condition;
      node.consequent = children;
      return node;
    }
    case "else":
      return children;
    case "for":
    case "each": {
      const attrs = stack.openingElement.attributes;
      const argument = {};
      attrs.forEach((attr) => {
        if (attr.name.value() === "name") {
          argument["refs"] = ctx.createToken(attr.parserAttributeValueStack());
        } else {
          argument[attr.name.value()] = ctx.createIdentifier(attr.value.value());
        }
      });
      let item = argument.item || ctx.createIdentifier("item");
      let key = argument.key || ctx.createIdentifier("key");
      let node = name === "for" ? createForMapNode(ctx, argument.refs, children, item, key, argument.index, stack) : createForEachNode(ctx, argument.refs, children, item, key, stack);
      node.isForNode = true;
      return createFragmentVNode(ctx, node);
    }
  }
  return null;
}
function createElementNode(ctx, stack, data, children) {
  let name = null;
  if (stack.isComponent) {
    if (stack.jsxRootElement === stack && stack.parentStack.isProgram) {
      name = ctx.createLiteral("div");
    } else {
      const desc = stack.description();
      if (import_Utils12.default.isModule(desc)) {
        ctx.addDepend(desc, stack.module);
        name = ctx.createIdentifier(
          ctx.getModuleReferenceName(desc, stack.module)
        );
      } else {
        name = ctx.createIdentifier(
          stack.openingElement.name.value(),
          stack.openingElement.name
        );
      }
    }
  } else {
    name = ctx.createLiteral(stack.openingElement.name.value());
  }
  data = createElementPropsNode(ctx, data, stack);
  if (children) {
    return ctx.createVNodeHandleNode(stack, name, data || ctx.createLiteral(null), children);
  } else if (data) {
    return ctx.createVNodeHandleNode(stack, name, data);
  } else {
    return ctx.createVNodeHandleNode(stack, name);
  }
}
function getDepth(stack) {
  let parentStack = stack.parentStack;
  while (parentStack) {
    if (parentStack.isJSXElement || parentStack.isJSXExpressionContainer || parentStack.isMethodDefinition || parentStack.isBlockStatement || parentStack.isProgram)
      break;
    parentStack = parentStack.parentStack;
  }
  if (parentStack && (parentStack.isJSXElement || parentStack.isJSXExpressionContainer)) {
    const index = stack.childIndexAt;
    const prefix = getDepth(parentStack);
    return prefix ? prefix + "." + index : index;
  }
  return stack.childIndexAt;
}
function getChildren(stack) {
  return stack.children.filter((child) => {
    return !(child.isJSXScript && child.isScriptProgram || child.isJSXStyle);
  });
}
function makeNormalChildren(ctx, children) {
  if (!children.length)
    return null;
  let childNods = ctx.createArrayExpression(children);
  let num = 0;
  childNods.newLine = children.some((item) => {
    if (item.type === "Literal" || item.type === "Identifier") {
      num++;
    }
    return item.type === "CallExpression" || item.type === "ConditionalExpression" || item.isFragmentVNode;
  });
  if (num > 1) {
    childNods.newLine = true;
  }
  return childNods;
}
function createElement(ctx, stack) {
  let data = {
    directives: [],
    slots: {},
    attrs: [],
    props: []
  };
  let isRoot = stack.jsxRootElement === stack;
  let children = getChildren(stack);
  let childNodes = makeNormalChildren(ctx, createChildren(ctx, children, data, stack));
  let desc = stack.description();
  let componentDirective = getComponentDirectiveAnnotation(desc);
  let nodeElement = null;
  if (stack.isDirective && stack.openingElement.name.value().toLowerCase() === "custom") {
    componentDirective = true;
  } else if (stack.isComponent && isDirectiveInterface(desc)) {
    componentDirective = true;
  }
  if (componentDirective) {
    if (childNodes) {
      if (childNodes.type == "ArrayExpression") {
        if (childNodes.elements.length === 1) {
          return childNodes.elements[0];
        } else {
          return createFragmentVNode(ctx, childNodes);
        }
      }
    }
    return childNodes;
  }
  if (stack.parentStack && stack.parentStack.isDirective) {
    let dName = stack.parentStack.openingElement.name.value().toLowerCase();
    if (dName === "show") {
      const condition = stack.parentStack.openingElement.attributes[0];
      data.directives.push(
        createDirectiveArrayNode(
          ctx,
          "vShow",
          ctx.createToken(condition.parserAttributeValueStack())
        )
      );
    } else if (dName === "custom") {
      createCustomDirectiveProperties(ctx, stack.parentStack, data);
    }
  } else {
    createComponentDirectiveProperties(ctx, stack.parentStack, data);
  }
  if (!stack.isJSXFragment && !(isRoot && stack.openingElement.name.value() === "root")) {
    createAttributes(ctx, stack, data);
  }
  const isWebComponent = stack.isWebComponent && !(stack.compilation.JSX && stack.parentStack.isProgram);
  if (isWebComponent) {
    const properties2 = [];
    if (childNodes) {
      properties2.push(ctx.createProperty(
        ctx.createIdentifier("default"),
        createWithCtxNode(
          ctx,
          ctx.createArrowFunctionExpression(childNodes)
        )
      ));
      childNodes = null;
    }
    if (data.slots) {
      for (let key in data.slots) {
        properties2.push(
          ctx.createProperty(
            ctx.createIdentifier(key),
            data.slots[key]
          )
        );
      }
    }
    if (properties2.length > 0) {
      childNodes = ctx.createObjectExpression(properties2);
    }
  }
  if (stack.isSlot) {
    nodeElement = createSlotElementNode(ctx, stack, childNodes);
  } else if (stack.isDirective) {
    if (childNodes && childNodes.type == "ArrayExpression") {
      if (childNodes.elements.length === 1) {
        childNodes = childNodes.elements[0];
      } else {
        childNodes = createFragmentVNode(ctx, childNodes);
      }
    }
    nodeElement = createDirectiveElementNode(ctx, stack, childNodes);
  } else {
    if (stack.isJSXFragment || isRoot && !isWebComponent && stack.openingElement.name.value() === "root") {
      if (Array.isArray(childNodes) && childNodes.length === 1) {
        nodeElement = childNodes[0];
      } else {
        nodeElement = createFragmentVNode(ctx, childNodes);
      }
    } else {
      nodeElement = createElementNode(ctx, stack, data, childNodes);
    }
  }
  if (nodeElement && data.directives && data.directives.length > 0) {
    nodeElement = createWithDirectives(ctx, nodeElement, data.directives);
  }
  nodeElement.hasKeyAttribute = !!data.key;
  nodeElement.hasRefAttribute = !!data.ref;
  return nodeElement;
}

// node_modules/@easescript/transform/lib/tokens/JSXElement.js
function JSXElement(ctx, stack) {
  if (!ctx.options.esx.enable)
    return;
  return createElement(ctx, stack);
}

// node_modules/@easescript/transform/lib/tokens/JSXEmptyExpression.js
function JSXEmptyExpression_default(ctx, stack) {
  return null;
}

// node_modules/@easescript/transform/lib/tokens/JSXExpressionContainer.js
var import_Namespace7 = __toESM(require("easescript/lib/core/Namespace"));
var import_Utils13 = __toESM(require("easescript/lib/core/Utils"));
function checkVNodeType(type) {
  if (!type || type.isAnyType)
    return false;
  if (type.isUnionType) {
    return type.elements.some((el) => checkVNodeType(el.type()));
  }
  let origin = import_Utils13.default.getOriginType(type);
  if (origin && import_Utils13.default.isModule(origin)) {
    if (origin.isWebComponent() || import_Namespace7.default.globals.get("VNode").is(origin)) {
      return true;
    }
  }
  return false;
}
function JSXExpressionContainer_default(ctx, stack) {
  let node = ctx.createToken(stack.expression);
  if (node) {
    let isExplicitVNode = false;
    let type = stack.expression.type();
    let isScalar = stack.expression.isLiteral || import_Utils13.default.isScalar(type);
    if (type && !isScalar) {
      isExplicitVNode = checkVNodeType(type);
    }
    node.isExplicitVNode = isExplicitVNode;
    node.isScalarType = isScalar;
    node.isExpressionContainer = true;
  }
  return node;
}

// node_modules/@easescript/transform/lib/tokens/JSXFragment.js
var JSXFragment_default = JSXElement;

// node_modules/@easescript/transform/lib/tokens/JSXIdentifier.js
function JSXIdentifier_default(ctx, stack) {
  var name = stack.value();
  if (stack.parentStack.parentStack.isJSXAttribute) {
    if (name.includes("-")) {
      return ctx.createIdentifier(toCamelCase(name), stack);
    }
  }
  const node = ctx.createNode(stack, "Identifier");
  node.value = name;
  node.raw = name;
  return node;
}

// node_modules/@easescript/transform/lib/tokens/JSXMemberExpression.js
function JSXMemberExpression_default(ctx, stack) {
  const node = ctx.createNode(stack);
  node.object = ctx.createToken(stack.object);
  node.property = ctx.createToken(stack.property);
  return node;
}

// node_modules/@easescript/transform/lib/tokens/JSXNamespacedName.js
function JSXNamespacedName_default(ctx, stack) {
  const node = ctx.createNode(stack);
  node.name = ctx.createToken(stack.name);
  node.namespace = ctx.createToken(stack.namespace);
  const xmlns = stack.getXmlNamespace();
  if (xmlns) {
    node.value = xmlns.value.value();
  } else {
    const ops2 = stack.compiler.options;
    node.value = ops2.jsx.xmlns.default[stack.namespace.value()] || null;
  }
  node.raw = node.value;
  return node;
}

// node_modules/@easescript/transform/lib/tokens/JSXOpeningElement.js
function JSXOpeningElement_default(ctx, stack) {
  const node = ctx.createNode(stack);
  node.attributes = stack.attributes.map((attr) => ctx.createToken(attr));
  node.selfClosing = !!stack.selfClosing;
  if (stack.parentStack.isComponent) {
    const desc = stack.parentStack.description();
    if (desc) {
      if (stack.hasNamespaced && desc.isFragment) {
        node.name = ctx.createIdentifier(desc.id, stack.name);
      } else {
        node.name = ctx.createIdentifier(ctx.getModuleReferenceName(desc, stack.module), stack.name);
      }
    } else {
      node.name = ctx.createIdentifier(stack.name.value(), stack.name);
    }
  } else {
    node.name = ctx.createLiteral(stack.name.value(), void 0, stack.name);
  }
  return node;
}

// node_modules/@easescript/transform/lib/tokens/JSXOpeningFragment.js
function JSXOpeningFragment_default(ctx, stack) {
  return ctx.createNode(stack);
}

// node_modules/@easescript/transform/lib/tokens/JSXScript.js
function JSXScript_default(ctx, stack) {
  const node = ctx.createNode(stack);
  node.openingElement = ctx.createToken(stack.openingElement);
  node.closingElement = ctx.createToken(stack.closingElement);
  node.body = (stack.body || []).map((child) => ctx.createToken(child));
}

// node_modules/@easescript/transform/lib/tokens/JSXSpreadAttribute.js
function JSXSpreadAttribute_default(ctx, stack) {
  const node = ctx.createNode(stack);
  node.argument = ctx.createToken(stack.argument);
  return node;
}

// node_modules/@easescript/transform/lib/tokens/JSXStyle.js
function JSXStyle_default(ctx, stack) {
  return null;
}

// node_modules/@easescript/transform/lib/tokens/JSXText.js
function JSXText_default(ctx, stack) {
  let value = stack.value();
  if (value) {
    value = value.replace(/\s+/g, " ").replace(/(\u0022|\u0027)/g, "\\$1");
    if (value) {
      return ctx.createLiteral(value);
    }
  }
  return null;
}

// node_modules/@easescript/transform/lib/tokens/LabeledStatement.js
function LabeledStatement_default(ctx, stack) {
  const node = ctx.createNode(stack);
  node.label = ctx.createIdentifier(stack.label.value(), stack.label);
  node.body = ctx.createToken(stack.body);
  return node;
}

// node_modules/@easescript/transform/lib/tokens/Literal.js
function Literal_default(ctx, stack) {
  const node = ctx.createNode(stack);
  node.raw = stack.raw();
  const code = node.raw.charCodeAt(0);
  if (code === 34 || code === 39) {
    node.value = node.raw.slice(1, -1);
  } else {
    node.value = stack.value();
  }
  return node;
}

// node_modules/@easescript/transform/lib/tokens/LogicalExpression.js
function LogicalExpression_default(ctx, stack) {
  const node = ctx.createNode(stack);
  node.left = ctx.createToken(stack.left);
  node.right = ctx.createToken(stack.right);
  node.operator = stack.operator;
  return node;
}

// node_modules/@easescript/transform/lib/tokens/MemberExpression.js
var import_Utils14 = __toESM(require("easescript/lib/core/Utils"));
function addImportReference(ctx, desc, module2) {
  if (import_Utils14.default.isStack(desc) && (desc.isDeclaratorVariable || desc.isDeclaratorFunction)) {
    let imports = desc.imports;
    if (Array.isArray(imports)) {
      imports.forEach((item) => {
        if (item.source.isLiteral) {
          parseImportDeclaration(ctx, item, module2);
        }
      });
    }
  }
}
function MemberExpression(ctx, stack) {
  const refsName = stack.getReferenceName();
  if (refsName) {
    return ctx.createIdentifier(refsName, stack);
  }
  const module2 = stack.module;
  const description = stack.descriptor();
  const objectType = stack.object.type();
  if (description && description.isModule && objectType && !objectType.isLiteralObjectType && import_Utils14.default.isTypeModule(description)) {
    ctx.addDepend(description, stack.module);
  } else {
    const objectDescriptor = stack.object.descriptor();
    if (import_Utils14.default.isTypeModule(objectDescriptor)) {
      ctx.addDepend(objectDescriptor, stack.module);
    } else {
      addImportReference(ctx, objectDescriptor, module2 || stack.compilation);
      addImportReference(ctx, description, module2 || stack.compilation);
    }
  }
  if (!description || import_Utils14.default.isType(description) && description.isAnyType && !stack.optional) {
    let isReflect = true;
    if (description) {
      isReflect = false;
      let hasDynamic = description.isComputeType && description.isPropertyExists();
      if (!hasDynamic && !import_Utils14.default.isLiteralObjectType(objectType)) {
        isReflect = true;
      }
    }
    if (isReflect) {
      return ctx.createCallExpression(
        createStaticReferenceNode(ctx, stack, "Reflect", "get"),
        [
          module2 ? ctx.createIdentifier(module2.id) : ctx.createLiteral(null),
          ctx.createToken(stack.object),
          stack.computed ? ctx.createToken(stack.property) : ctx.createLiteral(stack.property.value())
        ],
        stack
      );
    }
  }
  const resolveName = getMethodOrPropertyAlias(ctx, description);
  const privateChain = ctx.options.privateChain;
  if (privateChain && description && description.isMethodDefinition && !(description.static || description.module.static)) {
    const modifier = import_Utils14.default.getModifierValue(description);
    const refModule = description.module;
    if (modifier === "private" && refModule.children.length > 0) {
      let property = resolveName ? ctx.createIdentifier(resolveName, stack.property) : ctx.createToken(stack.property);
      return ctx.createMemberExpression(
        [
          ctx.createIdentifier(module2.id),
          ctx.createIdentifier("prototype"),
          property
        ],
        stack
      );
    }
  }
  if (objectType && !objectType.isLiteralObjectType && import_Utils14.default.isClassType(description)) {
    ctx.addDepend(description, stack.module);
    if (!stack.hasMatchAutoImporter) {
      return ctx.createIdentifier(
        ctx.getModuleReferenceName(description, module2),
        stack
      );
    }
  }
  if (stack.object.isSuperExpression) {
    let property = resolveName ? ctx.createIdentifier(resolveName, stack.property) : ctx.createToken(stack.property);
    if (description && description.isMethodGetterDefinition) {
      if (property.type === "Identifier") {
        property = ctx.createLiteral(
          property.value,
          void 0,
          stack.property
        );
      }
      const args = [
        ctx.createIdentifier(module2.id),
        ctx.createThisExpression(),
        property
      ];
      return ctx.createCallExpression(
        createStaticReferenceNode(ctx, stack, "Class", "callSuperGetter"),
        args
      );
    } else if (description && description.isMethodSetterDefinition) {
      if (property.type === "Identifier") {
        property = ctx.createLiteral(
          property.value,
          void 0,
          stack.property
        );
      }
      const args = [
        ctx.createIdentifier(module2.id),
        ctx.createThisExpression(),
        property
      ];
      return ctx.createCallExpression(
        createStaticReferenceNode(ctx, stack, "Class", "callSuperSetter"),
        args
      );
    } else {
      return ctx.createMemberExpression([
        ctx.createToken(stack.object),
        ctx.createIdentifier("prototype"),
        property
      ]);
    }
  }
  let propertyNode = resolveName ? ctx.createIdentifier(resolveName, stack.property) : ctx.createToken(stack.property);
  if (privateChain && description && description.isPropertyDefinition && !(description.static || description.module.static)) {
    const modifier = import_Utils14.default.getModifierValue(description);
    if ("private" === modifier) {
      const object = ctx.createMemberExpression([
        ctx.createToken(stack.object),
        ctx.createIdentifier(
          ctx.getGlobalRefName(stack, PRIVATE_NAME, stack.module)
        )
      ]);
      object.computed = true;
      return ctx.createMemberExpression([
        object,
        propertyNode
      ]);
    }
  }
  if (description && (!description.isAccessor && description.isMethodDefinition)) {
    const pStack = stack.getParentStack((stack2) => !!(stack2.jsxElement || stack2.isBlockStatement || stack2.isCallExpression || stack2.isExpressionStatement));
    if (pStack && pStack.jsxElement) {
      return ctx.createCallExpression(
        ctx.createMemberExpression([
          ctx.createToken(stack.object),
          propertyNode,
          ctx.createIdentifier("bind")
        ]),
        [ctx.createThisExpression()]
      );
    }
  }
  const node = ctx.createNode(stack);
  node.computed = !!stack.computed;
  node.optional = !!stack.optional;
  node.object = ctx.createToken(stack.object);
  node.property = propertyNode;
  return node;
}
var MemberExpression_default = MemberExpression;

// node_modules/@easescript/transform/lib/tokens/MethodDefinition.js
var import_Utils15 = __toESM(require("easescript/lib/core/Utils"));
function MethodDefinition_default(ctx, stack, type) {
  const node = FunctionDeclaration_default(ctx, stack, type);
  node.async = stack.expression.async ? true : false;
  node.static = !!stack.static;
  node.modifier = import_Utils15.default.getModifierValue(stack);
  node.kind = "method";
  node.isAbstract = !!stack.isAbstract;
  node.isFinal = !!stack.isFinal;
  node.comments = createCommentsNode(ctx, stack, node);
  return node;
}

// node_modules/@easescript/transform/lib/tokens/MethodGetterDefinition.js
function MethodGetterDefinition_default(ctx, stack, type) {
  const node = MethodDefinition_default(ctx, stack, type);
  node.kind = "get";
  return node;
}

// node_modules/@easescript/transform/lib/tokens/MethodSetterDefinition.js
function MethodSetterDefinition_default(ctx, stack, type) {
  const node = MethodDefinition_default(ctx, stack, type);
  node.kind = "set";
  return node;
}

// node_modules/@easescript/transform/lib/tokens/NewExpression.js
var import_Utils16 = __toESM(require("easescript/lib/core/Utils"));
function NewExpression_default(ctx, stack) {
  let desc = stack.callee.type();
  desc = import_Utils16.default.getOriginType(desc);
  if (desc !== stack.module && import_Utils16.default.isTypeModule(desc)) {
    ctx.addDepend(desc, stack.module);
  }
  const node = ctx.createNode(stack);
  node.callee = ctx.createToken(stack.callee);
  node.arguments = stack.arguments.map((item) => ctx.createToken(item));
  return node;
}

// node_modules/@easescript/transform/lib/tokens/ObjectExpression.js
function ObjectExpression_default(ctx, stack) {
  const node = ctx.createNode(stack);
  node.properties = stack.properties.map((item) => ctx.createToken(item));
  return node;
}

// node_modules/@easescript/transform/lib/tokens/ObjectPattern.js
function ObjectPattern_default(ctx, stack) {
  const node = ctx.createNode(stack);
  node.properties = stack.properties.map((item) => ctx.createToken(item));
  return node;
}

// node_modules/@easescript/transform/lib/tokens/PackageDeclaration.js
function PackageDeclaration_default(ctx, stack) {
  const node = ctx.createNode(stack);
  node.body = [];
  ctx.setNode(stack, node);
  stack.body.forEach((item) => {
    if (item.isClassDeclaration || item.isEnumDeclaration || item.isInterfaceDeclaration || item.isStructTableDeclaration) {
      let child = ctx.createToken(item);
      if (child) {
        node.body.push(child);
      }
    }
  });
  ctx.removeNode(stack);
  return node;
}

// node_modules/@easescript/transform/lib/tokens/ParenthesizedExpression.js
function ParenthesizedExpression_default(ctx, stack) {
  if (stack.parentStack.isExpressionStatement) {
    return ctx.createToken(stack.expression);
  }
  const node = ctx.createNode(stack);
  node.expression = ctx.createToken(stack.expression);
  return node;
}

// node_modules/@easescript/transform/lib/tokens/Property.js
function Property_default(ctx, stack) {
  const node = ctx.createNode(stack);
  node.computed = !!stack.computed;
  node.key = ctx.createToken(stack.key);
  node.init = ctx.createToken(stack.init);
  return node;
}

// node_modules/@easescript/transform/lib/tokens/PropertyDefinition.js
var import_Utils17 = __toESM(require("easescript/lib/core/Utils"));
function PropertyDefinition_default(ctx, stack) {
  let init = null;
  if (stack.annotations && stack.annotations.length > 0) {
    let items = [];
    stack.annotations.forEach((annot) => {
      const name = annot.getLowerCaseName();
      if (name === "readfile") {
        items.push(
          createReadfileAnnotationNode(ctx, annot) || ctx.createLiteral(null)
        );
      } else if (name === "embed") {
        items.push(
          createEmbedAnnotationNode(ctx, annot)
        );
      } else if (name === "env") {
        items.push(
          createEnvAnnotationNode(ctx, annot)
        );
      } else if (name === "url") {
        items.push(
          createUrlAnnotationNode(ctx, annot)
        );
      }
    });
    if (items.length > 0) {
      init = items.length > 1 ? ctx.createArrayExpression(items) : items[0];
    }
  }
  const node = ctx.createNode(stack);
  const decl = ctx.createToken(stack.declarations[0]);
  node.modifier = import_Utils17.default.getModifierValue(stack);
  node.static = !!stack.static;
  node.kind = stack.kind;
  node.key = decl.id;
  node.init = init || decl.init;
  node.dynamic = stack.dynamic;
  node.isAbstract = !!stack.isAbstract;
  node.isFinal = !!stack.isFinal;
  node.comments = createCommentsNode(ctx, stack, node);
  return node;
}

// node_modules/@easescript/transform/lib/tokens/RestElement.js
function RestElement_default(ctx, stack) {
  const node = ctx.createNode(stack);
  node.value = stack.value();
  node.raw = node.value;
  return node;
}

// node_modules/@easescript/transform/lib/tokens/ReturnStatement.js
function ReturnStatement_default(ctx, stack) {
  const node = ctx.createNode(stack);
  node.argument = ctx.createToken(stack.argument);
  return node;
}

// node_modules/@easescript/transform/lib/tokens/SequenceExpression.js
function SequenceExpression_default(ctx, stack) {
  const node = ctx.createNode(stack);
  node.expressions = stack.expressions.map((item) => ctx.createToken(item));
  return node;
}

// node_modules/@easescript/transform/lib/tokens/SpreadElement.js
function SpreadElement_default(ctx, stack) {
  const node = ctx.createNode(stack);
  node.argument = ctx.createToken(stack.argument);
  return node;
}

// node_modules/@easescript/transform/lib/tokens/StructTableColumnDefinition.js
function StructTableColumnDefinition_default(ctx, stack) {
  const node = ctx.createNode(stack);
  node.key = ctx.createIdentifier("`" + stack.key.value() + "`", stack.key);
  node.properties = [];
  const type = stack.typename ? ctx.createToken(stack.typename) : ctx.createIdentifier("varchar(255)");
  const unsigned = stack.unsigned ? ctx.createIdentifier("unsigned") : null;
  const notnull = !stack.question ? ctx.createIdentifier("not null") : null;
  node.properties.push(type);
  if (unsigned) {
    node.properties.push(unsigned);
  }
  if (notnull) {
    node.properties.push(notnull);
  }
  {
    (stack.properties || []).forEach((item) => {
      node.properties.push(createIdentNode(ctx, item));
    });
  }
  return node;
}

// node_modules/@easescript/transform/lib/tokens/StructTableDeclaration.js
function StructTableDeclaration_default(ctx, stack) {
  ctx.table.getAllBuilder().forEach(
    (build) => build.createTable(ctx, stack)
  );
}

// node_modules/@easescript/transform/lib/tokens/StructTableKeyDefinition.js
function StructTableKeyDefinition_default(ctx, stack) {
  const node = ctx.createNode(stack);
  node.key = createIdentNode(ctx, stack.key);
  const key = stack.key.value().toLowerCase();
  node.prefix = key === "primary" || key === "key" ? null : ctx.createIdentifier("key");
  node.local = ctx.createToken(stack.local);
  node.properties = (stack.properties || []).map((item) => createIdentNode(ctx, item));
  return node;
}

// node_modules/@easescript/transform/lib/tokens/StructTableMethodDefinition.js
var import_Namespace8 = __toESM(require("easescript/lib/core/Namespace"));
function createNode(ctx, item, isKey = false, toLower = false, type = null) {
  if (!item)
    return null;
  if (type === "enum") {
    if (item.isIdentifier || item.isMemberExpression) {
      const type2 = import_Namespace8.default.globals.get(item.value());
      const list = [];
      if (type2 && type2.isModule && type2.isEnum) {
        Array.from(type2.descriptors.keys()).forEach((key) => {
          const items = type2.descriptors.get(key);
          const item2 = items.find((item3) => item3.isEnumProperty);
          if (item2) {
            list.push(ctx.createLiteral(item2.init.value()));
          }
        });
      }
      return list;
    }
  }
  if (item.isIdentifier) {
    let value = item.value();
    if (toLower)
      value = value.toLowerCase();
    return ctx.createIdentifier(isKey ? "`" + value + "`" : value, item);
  }
  return item.isLiteral ? ctx.createLiteral(item.value()) : ctx.createToken(item);
}
function StructTableMethodDefinition_default(ctx, stack) {
  const node = ctx.createNode(stack);
  const name = stack.key.value().toLowerCase();
  if (name === "text" || name === "longtext" || name === "tinytext" || name === "mediumtext") {
    return ctx.createIdentifier(stack.key.value(), stack.key);
  }
  const key = stack.key.isMemberExpression ? stack.key.property : stack.key;
  node.key = createNode(ctx, key, false);
  const isKey = stack.parentStack.isStructTableKeyDefinition;
  node.params = (stack.params || []).map((item) => createNode(ctx, item, isKey, false, name)).flat().filter(Boolean);
  return node;
}

// node_modules/@easescript/transform/lib/tokens/StructTablePropertyDefinition.js
function StructTablePropertyDefinition_default(ctx, stack) {
  const node = ctx.createNode(stack);
  node.assignment = !!stack.assignment;
  node.key = createIdentNode(ctx, stack.key);
  node.init = createIdentNode(ctx, stack.init);
  return node;
}

// node_modules/@easescript/transform/lib/tokens/SuperExpression.js
function SuperExpression_default(ctx, stack) {
  const node = ctx.createNode(stack);
  const parent = stack.module.inherit;
  node.value = ctx.getModuleReferenceName(parent, stack.module);
  node.raw = node.value;
  return node;
}

// node_modules/@easescript/transform/lib/tokens/SwitchCase.js
function SwitchCase_default(ctx, stack) {
  const node = ctx.createNode(stack);
  node.condition = ctx.createToken(stack.condition);
  node.consequent = stack.consequent.map((item) => ctx.createToken(item));
  return node;
}

// node_modules/@easescript/transform/lib/tokens/SwitchStatement.js
function SwitchStatement_default(ctx, stack) {
  const node = ctx.createNode(stack);
  node.condition = ctx.createToken(stack.condition);
  node.cases = stack.cases.map((item) => ctx.createToken(item));
  return node;
}

// node_modules/@easescript/transform/lib/tokens/TemplateElement.js
function TemplateElement_default(ctx, stack) {
  const node = ctx.createNode(stack);
  node.raw = stack.raw();
  node.value = node.raw;
  node.tail = stack.tail;
  return node;
}

// node_modules/@easescript/transform/lib/tokens/TemplateLiteral.js
function TemplateLiteral_default(ctx, stack) {
  const node = ctx.createNode(stack);
  node.quasis = stack.quasis.map((item) => ctx.createToken(item));
  node.expressions = stack.expressions.map((item) => ctx.createToken(item));
  return node;
}

// node_modules/@easescript/transform/lib/tokens/ThisExpression.js
function ThisExpression_default(ctx, stack) {
  const node = ctx.createNode(stack);
  return node;
}

// node_modules/@easescript/transform/lib/tokens/ThrowStatement.js
function ThrowStatement_default(ctx, stack) {
  const node = ctx.createNode(stack);
  node.argument = ctx.createToken(stack.argument);
  return node;
}

// node_modules/@easescript/transform/lib/tokens/TryStatement.js
function TryStatement_default(ctx, stack) {
  const node = ctx.createNode(stack);
  node.block = ctx.createToken(stack.block);
  node.param = ctx.createToken(stack.param);
  node.handler = ctx.createToken(stack.handler);
  node.finalizer = ctx.createToken(stack.finalizer);
  return node;
}

// node_modules/@easescript/transform/lib/tokens/TypeAssertExpression.js
function TypeAssertExpression_default(ctx, stack) {
  return ctx.createToken(stack.left);
}

// node_modules/@easescript/transform/lib/tokens/TypeTransformExpression.js
function TypeTransformExpression_default(ctx, stack) {
  return ctx.createToken(stack.expression);
}

// node_modules/@easescript/transform/lib/tokens/UnaryExpression.js
var import_Utils18 = __toESM(require("easescript/lib/core/Utils"));
function UnaryExpression_default(ctx, stack) {
  const operator = stack.operator;
  const prefix = stack.prefix;
  if (operator === "delete" && stack.argument.isMemberExpression) {
    const desc = stack.argument.description();
    if (desc && desc.isAnyType) {
      const hasDynamic = desc && desc.isComputeType && desc.isPropertyExists();
      if (!hasDynamic && !import_Utils18.default.isLiteralObjectType(stack.argument.object.type())) {
        const property = stack.argument.computed ? ctx.createToken(stack.argument.property) : ctx.createLiteral(
          stack.argument.property.value(),
          void 0,
          stack.argument.property
        );
        return ctx.createCallExpression(
          createStaticReferenceNode(ctx, stack, "Reflect", "deleteProperty"),
          [
            ctx.createToken(stack.argument.object),
            property
          ]
        );
      }
    }
  }
  const node = ctx.createNode(stack);
  node.argument = ctx.createToken(stack.argument);
  node.operator = operator;
  node.prefix = prefix;
  return node;
}

// node_modules/@easescript/transform/lib/tokens/UpdateExpression.js
var import_Utils19 = __toESM(require("easescript/lib/core/Utils"));
function UpdateExpression_default(ctx, stack) {
  const node = ctx.createNode(stack);
  const operator = stack.operator;
  const prefix = stack.prefix;
  const isMember = stack.argument.isMemberExpression;
  if (isMember) {
    const desc = stack.argument.description();
    const module2 = stack.module;
    const scopeId = module2 ? module2.id : null;
    let isReflect = false;
    if (stack.argument.computed) {
      const hasDynamic = desc && desc.isComputeType && desc.isPropertyExists();
      if (!hasDynamic && !import_Utils19.default.isLiteralObjectType(stack.argument.object.type())) {
        isReflect = true;
      }
    } else if (desc && desc.isAnyType) {
      isReflect = !import_Utils19.default.isLiteralObjectType(stack.argument.object.type());
    }
    if (isReflect) {
      const method = operator === "++" ? "incre" : "decre";
      const callee = createStaticReferenceNode(ctx, stack, "Reflect", method);
      return ctx.createCallExpression(callee, [
        ctx.createIdentifier(scopeId),
        ctx.createToken(stack.argument.object),
        ctx.createLiteral(stack.argument.property.value()),
        ctx.createLiteral(!!prefix)
      ], stack);
    }
  }
  node.argument = ctx.createToken(stack.argument);
  node.operator = operator;
  node.prefix = prefix;
  return node;
}

// node_modules/@easescript/transform/lib/tokens/VariableDeclaration.js
function VariableDeclaration_default(ctx, stack) {
  const node = ctx.createNode(stack);
  node.inFor = stack.flag;
  node.kind = stack.kind;
  node.declarations = [];
  stack.declarations.forEach((item) => {
    const variable = ctx.createToken(item);
    if (variable) {
      node.declarations.push(variable);
    }
  });
  if (!node.declarations.length) {
    return null;
  }
  return node;
}

// node_modules/@easescript/transform/lib/tokens/VariableDeclarator.js
function VariableDeclarator_default(ctx, stack) {
  if (!stack.flag && !stack.parentStack.isPropertyDefinition && !(stack.id.isArrayPattern || stack.id.isObjectPattern)) {
    const pp = stack.parentStack.parentStack;
    if (pp && !(pp.isExportNamedDeclaration || pp.isExportDefaultDeclaration || pp.isExportSpecifier || pp.isForInStatement || pp.isForStatement || pp.isForOfStatement) && !stack.useRefItems.size) {
      if (!stack.init)
        return null;
    }
  }
  const node = ctx.createNode(stack);
  node.inFor = stack.flag;
  if (stack.id.isIdentifier) {
    let name = stack.id.value();
    if (stack.parentStack && stack.parentStack.isPropertyDefinition) {
      name = getMethodOrPropertyAlias(ctx, stack.parentStack) || name;
    }
    node.id = ctx.createIdentifier(name, stack.id);
  } else {
    node.id = ctx.createToken(stack.id);
  }
  node.init = ctx.createToken(stack.init);
  return node;
}

// node_modules/@easescript/transform/lib/tokens/WhenStatement.js
function WhenStatement_default(ctx, stack) {
  const check = (stack2) => {
    if (stack2.isLogicalExpression) {
      if (stack2.isAndOperator) {
        return check(stack2.left) && check(stack2.right);
      } else {
        return check(stack2.left) || check(stack2.right);
      }
    } else if (!stack2.isCallExpression) {
      throw new Error(`Macro condition must is an call expression`);
    }
    const name = stack2.value();
    const lower = name.toLowerCase();
    const argument = parseMacroMethodArguments(stack2.arguments, lower);
    if (!argument) {
      ctx.error(`The '${name}' macro is not supported`, stack2);
      return;
    }
    switch (lower) {
      case "runtime":
        return isRuntime(argument.value, ctx.options.metadata) === argument.expect;
      case "syntax":
        return isSyntax(ctx.plugin.name, argument.value) === argument.expect;
      case "env":
        {
          if (argument.name && argument.value) {
            return isEnv(argument.name, argument.value, ctx.options) === argument.expect;
          } else {
            ctx.error(`Missing name or value arguments. the '${name}' annotations.`, stack2);
          }
        }
        break;
      case "version":
        {
          if (argument.name && argument.version) {
            let versions = ctx.options.metadata.versions || {};
            let left = argument.name === ctx.plugin.name ? ctx.plugin.version : versions[argument.name];
            let right = argument.version;
            return compareVersion(left, right, argument.operator) === argument.expect;
          } else {
            ctx.error(`Missing name or value arguments. the '${name}' annotations.`, stack2);
          }
        }
        break;
      default:
    }
  };
  const node = ctx.createToken(check(stack.condition) ? stack.consequent : stack.alternate);
  node && (node.isWhenStatement = true);
  return node;
}

// node_modules/@easescript/transform/lib/tokens/WhileStatement.js
function WhileStatement_default(ctx, stack) {
  const node = ctx.createNode(stack);
  node.condition = ctx.createToken(stack.condition);
  node.body = ctx.createToken(stack.body);
  return node;
}

// node_modules/@easescript/transform/lib/core/Builder.js
var import_glob_path = __toESM(require("glob-path"));
async function buildProgram(ctx, compilation, graph) {
  let root = compilation.stack;
  if (!root) {
    throw new Error("Build program failed");
  }
  let body = [];
  let externals = [];
  let imports = [];
  let exports2 = [];
  let emitFile = ctx.options.emitFile;
  ctx.setNode(root, body);
  root.body.forEach((item) => {
    if (item.isClassDeclaration || item.isEnumDeclaration || item.isInterfaceDeclaration || item.isStructTableDeclaration || item.isPackageDeclaration) {
      const child = ctx.createToken(item);
      if (child) {
        body.push(child);
      }
    }
  });
  if (root.imports && root.imports.length > 0) {
    root.imports.forEach((item) => {
      if (item.isImportDeclaration) {
        ctx.createToken(item);
      }
    });
  }
  if (root.externals.length > 0) {
    root.externals.forEach((item) => {
      if (item.isImportDeclaration) {
        ctx.createToken(item);
      } else {
        const node = ctx.createToken(item);
        if (node) {
          externals.push(node);
        }
      }
    });
  }
  ctx.removeNode(root);
  if (root.exports.length > 0) {
    root.exports.forEach((item) => {
      ctx.createToken(item);
    });
  }
  ctx.crateRootAssets();
  ctx.createAllDependencies();
  let exportNodes = null;
  let importNodes = null;
  if (ctx.options.module === "cjs") {
    importNodes = createCJSImports(ctx, ctx.imports);
    exportNodes = createCJSExports(ctx, ctx.exports, graph);
  } else {
    importNodes = createESMImports(ctx, ctx.imports);
    exportNodes = createESMExports(ctx, ctx.exports, graph);
  }
  imports.push(...importNodes, ...exportNodes.imports);
  body.push(...exportNodes.declares);
  exports2.push(...exportNodes.exports);
  let layout = [
    ...imports,
    ...ctx.beforeBody,
    ...body,
    ...ctx.afterBody,
    ...externals,
    ...exports2
  ];
  if (layout.length > 0) {
    let generator = new Generator_default(ctx);
    layout.forEach((item) => generator.make(item));
    graph.code = generator.code;
    graph.sourcemap = generator.sourceMap ? generator.sourceMap.toJSON() : null;
    if (emitFile) {
      graph.outfile = ctx.getOutputAbsolutePath(compilation.mainModule || compilation);
    }
  }
}
function getTokenManager(options) {
  let _createToken = options.transform.createToken;
  let _tokens = options.transform.tokens;
  let getToken = (type) => {
    return tokens_exports[type];
  };
  let createToken = (ctx, stack, type) => {
    const token = getToken(type);
    if (!token) {
      throw new Error(`Token '${type}' is not exists.`);
    }
    try {
      return token(ctx, stack, type);
    } catch (e) {
      console.error(e);
    }
  };
  if (_tokens && typeof _tokens === "object" && Object.keys(_tokens).length > 0) {
    getToken = (type) => {
      if (Object.prototype.hasOwnProperty.call(_tokens, type)) {
        return _tokens[type];
      }
      return tokens_exports[type];
    };
  }
  if (_createToken && typeof _createToken === "function") {
    createToken = (ctx, stack, type) => {
      try {
        return _createToken(ctx, stack, type);
      } catch (e) {
        console.error(e);
      }
    };
  }
  return {
    get: getToken,
    create: createToken
  };
}
function createBuildContext(plugin2, records2 = /* @__PURE__ */ new Map()) {
  let assets = getAssetsManager(Asset);
  let virtuals = getVirtualModuleManager(VirtualModule);
  let variables = getVariableManager();
  let graphs = getBuildGraphManager();
  let token = getTokenManager(plugin2.options);
  let cache = getCacheManager();
  let table = getTableManager();
  let buildAfterDeps = /* @__PURE__ */ new Set();
  let glob = null;
  let resolve = plugin2.options.resolve || {};
  let imports = resolve?.imports || {};
  table.addBuilder(new MySql(plugin2));
  Object.keys(imports).forEach((key) => {
    glob = glob || (glob = new import_glob_path.default());
    glob.addRuleGroup(key, imports[key], "imports");
  });
  let folders = resolve?.folders || {};
  Object.keys(folders).forEach((key) => {
    glob = glob || (glob = new import_glob_path.default());
    glob.addRuleGroup(key, folders[key], "folders");
  });
  function makeContext(compiOrVModule) {
    return new Context_default(
      compiOrVModule,
      plugin2,
      variables,
      graphs,
      assets,
      virtuals,
      glob,
      cache,
      token,
      table
    );
  }
  async function build(compiOrVModule) {
    if (records2.has(compiOrVModule)) {
      return records2.get(compiOrVModule);
    }
    let ctx = makeContext(compiOrVModule);
    let buildGraph = ctx.getBuildGraph(compiOrVModule);
    records2.set(compiOrVModule, buildGraph);
    if (isVModule(compiOrVModule)) {
      await compiOrVModule.build(ctx, buildGraph);
    } else {
      if (!compiOrVModule.parserDoneFlag) {
        await compiOrVModule.ready();
      }
      await buildProgram(ctx, compiOrVModule, buildGraph);
    }
    if (ctx.options.emitFile) {
      await buildAssets(ctx, buildGraph);
      await ctx.emit(buildGraph);
    }
    invokeAfterTask();
    return buildGraph;
  }
  async function buildDeps(compiOrVModule) {
    if (records2.has(compiOrVModule)) {
      return records2.get(compiOrVModule);
    }
    let ctx = makeContext(compiOrVModule);
    let buildGraph = ctx.getBuildGraph(compiOrVModule);
    records2.set(compiOrVModule, buildGraph);
    if (isVModule(compiOrVModule)) {
      await compiOrVModule.build(ctx, buildGraph);
    } else {
      if (!compiOrVModule.parserDoneFlag) {
        await compiOrVModule.ready();
      }
      await buildProgram(ctx, compiOrVModule, buildGraph);
    }
    if (ctx.options.emitFile) {
      await buildAssets(ctx, buildGraph);
      await ctx.emit(buildGraph);
    }
    await callAsyncSequence(getBuildDeps(ctx), async (dep) => {
      if (isVModule(dep) && dep.after) {
        addBuildAfterDep(dep);
      } else {
        await buildDeps(dep);
      }
    });
    invokeAfterTask();
    return buildGraph;
  }
  async function buildAssets(ctx, buildGraph) {
    let assets2 = buildGraph.assets;
    if (!assets2)
      return;
    let items = Array.from(assets2.values()).map((asset) => {
      if (asset.after) {
        addBuildAfterDep(asset);
        return null;
      } else {
        return asset;
      }
    }).filter(Boolean);
    await Promise.all(items.map((asset) => asset.build(ctx)));
  }
  function getBuildDeps(ctx) {
    const deps = /* @__PURE__ */ new Set();
    ctx.dependencies.forEach((dataset) => {
      dataset.forEach((dep) => {
        if (import_Utils20.default.isModule(dep)) {
          if (!dep.isStructTable && dep.isDeclaratorModule) {
            dep = ctx.getVModule(dep.getName());
            if (dep) {
              deps.add(dep);
            }
          } else if (dep.compilation) {
            deps.add(dep.compilation);
          }
        } else if (isVModule(dep)) {
          deps.add(dep);
        } else if (import_Utils20.default.isCompilation(dep)) {
          deps.add(dep);
        }
      });
    });
    return Array.from(deps.values());
  }
  function addBuildAfterDep(dep) {
    buildAfterDeps.add(dep);
  }
  let waitingBuildAfterDeps = /* @__PURE__ */ new Set();
  function invokeAfterTask() {
    if (buildAfterDeps.size < 1)
      return;
    buildAfterDeps.forEach((dep) => {
      waitingBuildAfterDeps.add(dep);
    });
    buildAfterDeps.clear();
    setImmediate(async () => {
      if (waitingBuildAfterDeps.size > 0) {
        let deps = Array.from(waitingBuildAfterDeps.values());
        waitingBuildAfterDeps.clear();
        await callAsyncSequence(deps, async (dep) => {
          if (isAsset(dep)) {
            await dep.build(makeContext(dep));
          } else {
            records2.delete(dep);
            await buildDeps(dep);
          }
        });
      }
    });
  }
  return {
    build,
    buildDeps,
    buildAssets,
    buildAfterDeps,
    getBuildDeps,
    addBuildAfterDep,
    assets,
    virtuals,
    variables,
    graphs,
    glob,
    cache,
    table,
    token,
    makeContext
  };
}

// node_modules/@easescript/transform/lib/core/Polyfill.js
var import_Utils21 = __toESM(require("easescript/lib/core/Utils"));
var import_fs5 = __toESM(require("fs"));
var import_path5 = __toESM(require("path"));
var TAGS_REGEXP = /(?:[\r\n]+|^)\/\/\/(?:\s+)?<(references|namespaces|export|import|createClass)\s+(.*?)\/>/g;
var ATTRS_REGEXP = /(\w+)(?:[\s+]?=[\s+]?([\'\"])([^\2]*?)\2)?/g;
function parsePolyfillModule(file, createVModule) {
  let content = import_fs5.default.readFileSync(file).toString();
  let references = [];
  let namespace = "";
  let requires = [];
  let exportName = null;
  let disableCreateClass = false;
  content = content.replace(TAGS_REGEXP, function(a, b, c) {
    const items = c.matchAll(ATTRS_REGEXP);
    const attr = {};
    if (items) {
      for (let item of items) {
        let [, key, , value] = item;
        if (value)
          value = value.trim();
        attr[key] = value || true;
      }
    }
    switch (b) {
      case "references":
        if (attr["from"]) {
          references.push({
            from: attr["from"],
            local: attr["name"]
          });
        }
        break;
      case "namespaces":
        if (attr["name"]) {
          namespace = attr["name"];
        }
        break;
      case "export":
        if (attr["name"]) {
          exportName = attr["name"];
        }
        break;
      case "import":
        if (attr["from"]) {
          requires.push({
            local: attr["name"],
            from: attr["from"],
            imported: attr["key"] || (attr["namespaced"] ? "*" : void 0)
          });
        }
        break;
      case "createClass":
        if (attr["value"] == "false") {
          disableCreateClass = true;
        }
    }
    return "";
  });
  const info = import_path5.default.parse(file);
  let id = namespace ? `${namespace}.${info.name}` : info.name;
  let vm = createVModule(id);
  if (disableCreateClass) {
    vm.disableCreateClass();
  }
  requires.forEach((item) => {
    const local = item.local ? item.local : import_path5.default.parse(item.from).name;
    vm.addImport(item.from, local, item.imported);
  });
  references.forEach((item) => {
    const from = String(item.from);
    const local = item.local ? item.local : from.split(".").pop();
    vm.addReference(from, local);
  });
  if (exportName) {
    vm.addExport("default", exportName);
  } else {
    vm.addExport("default", vm.id);
  }
  vm.file = import_Utils21.default.normalizePath(file);
  vm.setContent(content);
}
function createPolyfillModule(dirname, createVModule) {
  if (!import_path5.default.isAbsolute(dirname)) {
    dirname = import_path5.default.join(__dirname, dirname);
  }
  if (!import_fs5.default.existsSync(dirname)) {
    throw new Error(`Polyfills directory does not exists. on '${dirname}'`);
  }
  import_fs5.default.readdirSync(dirname).forEach((filename) => {
    const filepath2 = import_path5.default.join(dirname, filename);
    if (import_fs5.default.statSync(filepath2).isFile()) {
      parsePolyfillModule(filepath2, createVModule);
    } else if (import_fs5.default.statSync(filepath2).isDirectory()) {
      createPolyfillModule(filepath2, createVModule);
    }
  });
}

// node_modules/@easescript/transform/lib/core/Plugin.js
var import_events = __toESM(require("events"));
function defineError(complier) {
  if (defineError.loaded || !complier || !complier.diagnostic)
    return;
  defineError.loaded = true;
  let define = complier.diagnostic.defineError;
  define(1e4, "", [
    "\u7ED1\u5B9A\u7684\u5C5E\u6027(%s)\u5FC5\u987B\u662F\u4E00\u4E2A\u53EF\u8D4B\u503C\u7684\u6210\u5458\u5C5E\u6027",
    "Binding the '%s' property must be an assignable members property"
  ]);
  define(10101, "", [
    "\u8DEF\u7531\u53C2\u6570(%s)\u7684\u9ED8\u8BA4\u503C\u53EA\u80FD\u662F\u4E00\u4E2A\u6807\u91CF",
    "Route params the '%s' defalut value can only is a literal type."
  ]);
}
var plugins = /* @__PURE__ */ new Set();
var processing = /* @__PURE__ */ new Map();
async function execute(compilation, asyncBuildHook) {
  if (processing.has(compilation)) {
    return await new Promise((resolve) => {
      processing.get(compilation).push(resolve);
    });
  } else {
    let queues = [];
    processing.set(compilation, queues);
    let result = await asyncBuildHook(compilation);
    while (queues.length > 0) {
      let resolve = queues.shift();
      resolve(result);
    }
    processing.delete(compilation);
    return result;
  }
}
var Plugin = class _Plugin extends import_events.default {
  static is(value) {
    return value ? value instanceof _Plugin : false;
  }
  #name = null;
  #options = null;
  #initialized = false;
  #context = null;
  #complier = null;
  #version = "0.0.0";
  #records = /* @__PURE__ */ new Map();
  constructor(name, version, options = {}) {
    super();
    plugins.add(this);
    this.#name = name;
    this.#version = version;
    this.#options = options;
    if (options.mode) {
      options.metadata.env.NODE_ENV = options.mode;
    }
  }
  get initialized() {
    return this.#initialized;
  }
  //插件名
  get name() {
    return this.#name;
  }
  //插件选项
  get options() {
    return this.#options;
  }
  //插件版本
  get version() {
    return this.#version;
  }
  //构建缓存，存在缓存中的不会构建
  get records() {
    return this.#records;
  }
  //编译器对象
  get complier() {
    return this.#complier;
  }
  //用于构建的上下文对象
  get context() {
    return this.#context;
  }
  //开发模式下调用，用来监听文件变化时删除缓存
  watch() {
    this.complier.on("onChanged", (compilation) => {
      this.records.delete(compilation);
      let cache = this.context.cache;
      if (cache) {
        compilation.modules.forEach((module2) => cache.clear(module2));
        cache.clear(compilation);
      }
      this.emit("compilation:changed", compilation);
    });
  }
  async init() {
    this.#context = createBuildContext(this, this.records);
    createPolyfillModule(
      import_path6.default.join(__dirname, "./polyfills"),
      this.#context.virtuals.createVModule
    );
  }
  //构建前调用。
  async beforeStart(complier) {
    if (this.#initialized)
      return;
    this.#initialized = true;
    this.#complier = complier;
    defineError(complier);
    await this.init();
    if (this.options.mode === "development") {
      this.watch();
    }
  }
  //当任务处理完成后调用。在加载插件或者打包插件时会调用这个方法，用来释放一些资源
  async afterDone() {
  }
  //构建所有依赖文件
  async run(compilation) {
    if (!import_Compilation.default.is(compilation)) {
      throw new Error("compilation is invalid");
    }
    if (!this.initialized) {
      await this.beforeStart(compilation.compiler);
    }
    if (compilation.isDescriptorDocument()) {
      throw new Error(`Build entry file cannot is descriptor. on the "${compilation.file}"`);
    }
    return await execute(compilation, this.context.buildDeps);
  }
  //构建单个文件
  async build(compilation, vmId = null) {
    if (!import_Compilation.default.is(compilation)) {
      throw new Error("compilation is invalid");
    }
    if (!this.initialized) {
      await this.beforeStart(compilation.compiler);
    }
    if (!vmId && compilation.isDescriptorDocument()) {
      let mainModule = compilation.mainModule;
      if (mainModule) {
        if (mainModule.isDeclaratorModule) {
          let vm = this.context.virtuals.getVModule(mainModule.getName());
          if (vm) {
            compilation = vm;
          } else {
            throw new Error(`Not resolved virtual module, need to specify the virtual module-id. on the "${compilation.file}"`);
          }
        }
      }
    } else if (vmId) {
      let vm = this.context.virtuals.getVModule(vmId);
      if (vm) {
        compilation = vm;
      } else {
        throw new Error(`The '${vmId}' virtual module does not exists.`);
      }
    }
    return await execute(compilation, this.context.build);
  }
};
var Plugin_default = Plugin;

// lib/core/Builder.js
var import_Utils26 = __toESM(require("easescript/lib/core/Utils"));

// lib/core/Context.js
var import_Utils23 = __toESM(require("easescript/lib/core/Utils"));

// lib/core/Common.js
var import_Utils22 = __toESM(require("easescript/lib/core/Utils"));
function hasStyleScoped(compilation) {
  if (!import_Utils22.default.isCompilation(compilation))
    return false;
  return compilation.jsxStyles.some((style) => {
    return style.openingElement.attributes.some((attr) => {
      if (compare(attr.name.value(), "scoped")) {
        if (!attr.value)
          return true;
        return !compare(attr.value.value(), "false");
      }
    });
  });
}

// lib/core/Context.js
var EXCLUDE_STYLE_RE = /[\\\/]style[\\\/](css|index)$/i;
var Context2 = class extends Context_default {
  #staticHoisted = /* @__PURE__ */ new Set();
  addStaticHoisted(node) {
    if (node) {
      if (node.isStaticHoistedNode) {
        return node;
      }
      let local = `__hoisted_${this.#staticHoisted.size}__`;
      local = this.createIdentifier(this.getGlobalRefName(null, local));
      this.#staticHoisted.add(this.createVariableDeclaration("const", [
        this.createVariableDeclarator(local, node)
      ]));
      local.isStaticHoistedNode = true;
      return local;
    }
    return null;
  }
  get staticHoistedItems() {
    return Array.from(this.#staticHoisted.values());
  }
  getAvailableOriginType(type) {
    if (type) {
      const originType = import_Utils23.default.getOriginType(type);
      switch (originType.id) {
        case "String":
        case "Number":
        case "Array":
        case "Function":
        case "Object":
        case "Boolean":
        case "RegExp":
          return originType.id;
        default:
      }
    }
    return null;
  }
  resolveImportSource(id, ctx = {}) {
    const ui = this.options.ui;
    if (ui.style === "none") {
      if (EXCLUDE_STYLE_RE.test(id)) {
        return { source: false };
      }
    }
    const glob = this.glob;
    const scheme = glob.scheme(id, ctx);
    let source = glob.parse(scheme, ctx);
    let rule = scheme.rule;
    if (rule) {
      if (source && Array.isArray(ctx.specifiers)) {
        let fully = ui.fully;
        if (fully && "element-plus" === source) {
          ctx.specifiers.forEach((item) => {
            if (item.imported) {
              if (item.imported != "*" && !item.imported.startsWith("El")) {
                item.imported = `El${toCamelCase(item.imported.value)}`;
              }
            } else {
              let pos = id.lastIndexOf("/");
              let basename = toCamelCase(id.substring(pos + 1));
              item.imported = `El${basename}`;
            }
          });
        }
      }
    } else {
      source = id;
    }
    return source;
  }
  createDefaultRoutePathNode(module2) {
    if (import_Utils23.default.isModule(module2)) {
      return this.createLiteral(
        this.plugin.makeCode.getDefaultRoutePath(module2)
      );
    }
    return null;
  }
};
var Context_default2 = Context2;

// lib/tokens/index.js
var tokens_exports2 = {};
__export(tokens_exports2, {
  ClassDeclaration: () => ClassDeclaration_default2,
  JSXElement: () => JSXElement2,
  JSXFragment: () => JSXFragment_default2
});

// lib/core/ClassBuilder.js
var ClassBuilder_default2 = ClassBuilder_default;

// lib/core/ESXClassBuilder.js
var import_Utils24 = __toESM(require("easescript/lib/core/Utils"));
var hotRecords = /* @__PURE__ */ new Map();
var removeNewlineRE = /[\r\n\t]/g;
var ESXClassBuilder = class extends ClassBuilder_default2 {
  #injectProperties = [];
  #provideProperties = [];
  #privateReactives = [];
  #exportVueComponentNode = null;
  #styleScopeId = void 0;
  #props = [];
  createInitMemberProperty(ctx, node, stack, staticFlag = false) {
    const reactiveAnnotation = !staticFlag && node.modifier === "private" && getMethodAnnotations(stack, ["reactive"])[0];
    if (reactiveAnnotation) {
      this.#privateReactives.push(
        [
          node.key.value,
          ctx.createObjectExpression([
            ctx.createProperty(
              ctx.createIdentifier("get"),
              this.createReactiveWrapNode(ctx, node.key.value, node.init, false),
              node.key.stack
            ),
            ctx.createProperty(
              ctx.createIdentifier("set"),
              this.createReactiveWrapNode(ctx, node.key.value, null, true),
              node.key.stack
            )
          ])
        ]
      );
      return true;
    }
    super.createInitMemberProperty(ctx, node, stack, staticFlag);
  }
  createMemeberAccessor(ctx, child, stack, reactiveFlag) {
    const target = {
      get: this.createGetterNode(ctx, child.key.value, false, false, reactiveFlag),
      set: this.createSetterNode(ctx, child.key.value, false, reactiveFlag),
      modifier: child.modifier,
      isAccessor: true
    };
    target.init = child.init;
    target.key = target.get.key;
    target.kind = "accessor";
    if (!child.injector) {
      this.createComponentProps(ctx, child, stack);
    }
    return target;
  }
  createMemeber(ctx, stack, staticFlag = false) {
    const child = super.createMemeber(ctx, stack, staticFlag);
    if (child && !child.static) {
      if (child.modifier === "public") {
        if (child.type === "PropertyDefinition") {
          const reactiveFlag = child.injector ? !!getMethodAnnotations(stack, ["reactive"])[0] : true;
          const target = this.createMemeberAccessor(ctx, child, stack, reactiveFlag);
          if (!child.injector) {
            this.createComponentProps(ctx, child, stack);
          }
          return target;
        } else if (child.type === "MethodSetterDefinition") {
          this.createComponentProps(ctx, child, stack);
        }
      } else if (child.type === "PropertyDefinition" && child.modifier !== "private") {
        this.privateProperties.push(
          ctx.createProperty(child.key, child.init || ctx.createLiteral(null))
        );
        const reactiveFlag = !!getMethodAnnotations(stack, ["reactive"])[0];
        return this.createMemeberAccessor(ctx, child, stack, reactiveFlag);
      }
      if (child.type === "MethodGetterDefinition" || child.type === "MethodDefinition") {
        const opts = ctx.plugin.options;
        if (opts.hot && opts.mode !== "production") {
          child.isConfigurable = true;
        }
      }
    }
    return child;
  }
  createComponentProps(ctx, node, stack) {
    if (node.modifier !== "public" || !(node.type === "PropertyDefinition" || node.type === "MethodSetterDefinition"))
      return;
    if (stack.isMethodSetterDefinition || stack.isPropertyDefinition) {
      if (node.injector) {
        return;
      }
    }
    const propName = node.key.value;
    let originType = null;
    if (node.type === "MethodSetterDefinition") {
      let _type = null;
      if (stack.params[0]) {
        _type = stack.params[0].type();
        originType = ctx.getAvailableOriginType(_type);
      }
      if ((!_type || _type.isAnyType) && stack.module) {
        const desc = stack.module.getDescriptor(propName, (desc2) => !!desc2.isMethodGetterDefinition);
        if (desc) {
          originType = ctx.getAvailableOriginType(desc.type());
        }
      }
    } else {
      originType = ctx.getAvailableOriginType(stack.type());
    }
    const properties2 = [
      ctx.createProperty(
        ctx.createIdentifier("type"),
        originType ? ctx.createIdentifier(originType) : ctx.createLiteral(null)
      )
    ];
    if (node.init) {
      if (node.init.type !== "Literal") {
        properties2.push(
          ctx.createProperty(
            ctx.createIdentifier("default"),
            ctx.createArrowFunctionExpression(
              ctx.createParenthesizedExpression(node.init)
            )
          )
        );
      } else {
        properties2.push(
          ctx.createProperty(
            ctx.createIdentifier("default"),
            node.init
          )
        );
      }
    }
    this.#props.push(ctx.createProperty(
      ctx.createIdentifier(propName),
      ctx.createObjectExpression(properties2)
    ));
  }
  createAnnotations(ctx, stack, node, staticFlag) {
    node = super.createAnnotations(ctx, stack, node, staticFlag);
    const annotations = stack.annotations;
    if (staticFlag || !annotations)
      return;
    if (!stack.isConstructor && stack.isMethodDefinition && !stack.isAccessor) {
      const provider = getMethodAnnotations(stack, ["provider"])[0];
      if (provider) {
        const args = provider.getArguments();
        this.#provideProperties.push(this.createAddProviderNode(ctx, args[0] ? args[0].value : node.key.value, node.key.value, true));
        node.provider = true;
      }
    } else if (stack.isMethodGetterDefinition || stack.isPropertyDefinition) {
      const provider = getMethodAnnotations(stack, ["provider"])[0];
      if (provider) {
        const args = provider.getArguments();
        this.#provideProperties.push(this.createAddProviderNode(ctx, args[0] ? args[0].value : node.key.value, node.key.value, false));
        node.provider = true;
      }
    }
    if (stack.isMethodSetterDefinition || stack.isPropertyDefinition) {
      const injector = getMethodAnnotations(stack, ["injector"])[0];
      if (injector) {
        const injectorArgs = injector.getArguments();
        const name = node.key.value;
        let from = name;
        if (injectorArgs.length > 0) {
          from = injectorArgs[0].value || from;
        }
        this.#injectProperties.push(this.createInjectPropertyNode(ctx, name, from, node.init || null));
        node.injector = true;
      }
    }
    node.required = !!getMethodAnnotations(stack, ["required"])[0];
    return node;
  }
  createInjectPropertyNode(ctx, name, from, value) {
    const args = [
      ctx.createLiteral(name)
    ];
    if (from !== name) {
      args.push(ctx.createLiteral(from));
    }
    if (value) {
      if (args.length === 1) {
        args.push(ctx.createChunkExpression("void 0", false));
      }
      args.push(Node_default.is(value) ? value : ctx.createLiteral(value));
    }
    return ctx.createExpressionStatement(
      ctx.createCallExpression(
        ctx.createMemberExpression([
          ctx.createThisExpression(),
          ctx.createIdentifier("inject")
        ]),
        args
      )
    );
  }
  createAddProviderNode(ctx, key, name, isMethod) {
    const target = isMethod ? ctx.createMemberExpression([
      ctx.createThisExpression(),
      ctx.createIdentifier(name)
    ]) : ctx.createArrowFunctionExpression(ctx.createMemberExpression([
      ctx.createThisExpression(),
      ctx.createIdentifier(name)
    ]));
    return ctx.createExpressionStatement(
      ctx.createCallExpression(
        ctx.createMemberExpression([
          ctx.createThisExpression(),
          ctx.createIdentifier("provide")
        ]),
        [
          ctx.createLiteral(key),
          isMethod ? ctx.createCallExpression(
            ctx.createMemberExpression([
              target,
              ctx.createIdentifier("bind")
            ]),
            [
              ctx.createThisExpression()
            ]
          ) : target
        ]
      )
    );
  }
  createReactiveWrapNode(ctx, name, init, isset = false) {
    const callArgs = [
      ctx.createLiteral(name)
    ];
    const args = [];
    if (isset) {
      args.push(ctx.createIdentifier("value"));
      callArgs.push(ctx.createIdentifier("value"));
    } else if (init) {
      if (init.type === "ObjectExpression") {
        init = ctx.createParenthesizedExpression(init);
      }
      callArgs.push(ctx.createChunkExpression("void 0", false));
      callArgs.push(ctx.createArrowFunctionExpression(init));
    }
    return ctx.createArrowFunctionExpression(ctx.createCallExpression(
      ctx.createMemberExpression([
        ctx.createThisExpression(),
        ctx.createIdentifier("reactive")
      ]),
      callArgs
    ), args);
  }
  createGetterNode(ctx, name, value, required, reactive) {
    const args = [
      ctx.createLiteral(name)
    ];
    if (value) {
      args.push(ctx.createChunkExpression("void 0", false));
      args.push(ctx.createArrowFunctionExpression(value.type === "ObjectExpression" ? ctx.createParenthesizedExpression(value) : value));
    }
    const block = ctx.createBlockStatement();
    if (reactive) {
      block.body.push(ctx.createReturnStatement(
        ctx.createCallExpression(
          ctx.createMemberExpression([
            ctx.createThisExpression(),
            ctx.createIdentifier("reactive")
          ]),
          args
        )
      ));
    } else {
      const privateName = this.createPrivateRefsName(ctx);
      const memberNode = ctx.createMemberExpression([
        ctx.createThisExpression(),
        ctx.createIdentifier(privateName)
      ]);
      memberNode.computed = true;
      block.body.push(
        ctx.createReturnStatement(ctx.createMemberExpression([
          memberNode,
          ctx.createIdentifier(name)
        ]))
      );
    }
    const node = ctx.createMethodDefinition(name, block);
    node.kind = "get";
    node.isAccessor = true;
    node.required = required;
    return node;
  }
  createSetterNode(ctx, name, required, reactive) {
    const block = ctx.createBlockStatement();
    if (reactive) {
      block.body.push(ctx.createExpressionStatement(
        ctx.createCallExpression(
          ctx.createMemberExpression([
            ctx.createThisExpression(),
            ctx.createIdentifier("reactive")
          ]),
          [
            ctx.createLiteral(name),
            ctx.createIdentifier("value")
          ]
        )
      ));
    } else {
      const privateName = this.createPrivateRefsName(ctx);
      const memberNode = ctx.createMemberExpression([
        ctx.createThisExpression(),
        ctx.createIdentifier(privateName)
      ]);
      memberNode.computed = true;
      block.body.push(
        ctx.createExpressionStatement(
          ctx.createAssignmentExpression(
            ctx.createMemberExpression([memberNode, ctx.createIdentifier(name)]),
            ctx.createIdentifier("value")
          )
        )
      );
    }
    const node = ctx.createMethodDefinition(name, block, [ctx.createIdentifier("value")]);
    node.kind = "set";
    node.isAccessor = true;
    node.required = required;
    return node;
  }
  createDefaultConstructor(ctx, methodName, inherit = null, params = []) {
    if (this.isSkinClass) {
      return super.createDefaultConstructor(ctx, methodName, inherit, params);
    }
    const block = ctx.createBlockStatement();
    if (inherit) {
      let callSuper = ctx.createSuperExpression("SuperExpression");
      callSuper.value = ctx.getModuleReferenceName(inherit);
      if (this.stack.isModuleForWebComponent(inherit)) {
        const propsNode = ctx.createMemberExpression([
          ctx.createIdentifier("arguments"),
          ctx.createLiteral(0)
        ]);
        propsNode.computed = true;
        params = [propsNode];
      }
      block.body.push(ctx.createExpressionStatement(
        ctx.createCallExpression(
          ctx.createMemberExpression(
            [
              callSuper,
              ctx.createIdentifier("call")
            ]
          ),
          [
            ctx.createThisExpression()
          ].concat(params)
        )
      ));
    }
    const node = ctx.createMethodDefinition(methodName, block);
    node.isDefaultConstructMethod = true;
    return node;
  }
  checkNeedInitPrivateNode() {
    if (this.#privateReactives.length > 0)
      return true;
    return super.checkNeedInitPrivateNode();
  }
  checkConstructor(ctx, construct, module2) {
    super.checkConstructor(ctx, construct, module2);
    if (this.#privateReactives.length > 0) {
      let privateName = this.createPrivateRefsName(ctx);
      const privateNode = ctx.createComputeMemberExpression([
        ctx.createThisExpression(),
        ctx.createIdentifier(privateName)
      ]);
      construct.body.body.push(ctx.createExpressionStatement(
        ctx.createCallExpression(
          ctx.createMemberExpression([
            ctx.createIdentifier("Object"),
            ctx.createIdentifier("defineProperties")
          ]),
          [
            privateNode,
            ctx.createObjectExpression(this.#privateReactives.map((item) => {
              const [key, property] = item;
              return ctx.createProperty(ctx.createIdentifier(key), property);
            }))
          ]
        )
      ));
    }
    const injectAndProvide = this.#provideProperties.concat(this.#injectProperties);
    if (injectAndProvide.length > 0) {
      this.#provideProperties.length = 0;
      this.#injectProperties.length = 0;
      construct.body.body.push(...injectAndProvide);
    }
    this.#exportVueComponentNode = ctx.createExpressionStatement(
      this.createCreateVueComponentNode(
        ctx,
        "createComponent",
        [
          ctx.createIdentifier(this.getModuleDeclarationId(module2)),
          this.createVueComponentOptionsNode(
            ctx,
            module2.id,
            module2
          )
        ]
      )
    );
  }
  getCodeSections(compilation) {
    let jsx = "";
    let style = "";
    let script = compilation.source;
    let offset = 0;
    const substring = (stack) => {
      let len = stack.node.end - stack.node.start;
      let start = stack.node.start - offset;
      let end = stack.node.end - offset;
      script = script.substring(0, start) + script.substring(end, script.length);
      offset += len;
    };
    compilation.jsxElements.forEach((stack) => {
      jsx += stack.raw();
      substring(stack);
    });
    compilation.jsxStyles.forEach((stack) => {
      style += stack.raw();
      substring(stack);
    });
    style = style.replace(removeNewlineRE, "");
    jsx = jsx.replace(removeNewlineRE, "");
    script = script.replace(removeNewlineRE, "");
    return { jsx, style, script };
  }
  createHMRHotAcceptNode(ctx, moduleId) {
    const opts = ctx.plugin.options;
    if (!opts.hot || opts.mode === "production")
      return null;
    if (ctx.__createHMRFlag)
      return;
    ctx.__createHMRFlag = true;
    const compilation = this.compilation;
    const records2 = hotRecords.get(compilation);
    const sections = this.getCodeSections(compilation);
    let onlyRender = false;
    if (records2) {
      onlyRender = records2.script === sections.script && records2.style === sections.style && records2.jsx !== sections.jsx;
    }
    hotRecords.set(compilation, sections);
    const hmrHandler = opts.hmrHandler || "module.hot";
    const hashIdNode = ctx.createLiteral(ctx.getHashId());
    moduleId = ctx.createIdentifier(moduleId);
    ctx.afterBody.push(ctx.createIfStatement(
      ctx.createChunkExpression(hmrHandler, false, false),
      ctx.createBlockStatement([
        ctx.createExpressionStatement(
          ctx.createCallExpression(
            ctx.createChunkExpression(hmrHandler + ".accept", false, false)
          )
        ),
        ctx.createIfStatement(
          ctx.createUnaryExpression(
            ctx.createCallExpression(
              createStaticReferenceNode(ctx, this.stack, "dev.tools.HMR", "createRecord"),
              [
                hashIdNode,
                moduleId
              ]
            ),
            "!",
            true
          ),
          ctx.createBlockStatement([
            ctx.createCallExpression(
              createStaticReferenceNode(ctx, this.stack, "dev.tools.HMR", onlyRender ? "rerender" : "reload"),
              [
                hashIdNode,
                moduleId
              ]
            )
          ])
        )
      ])
    ));
  }
  createCreateVueComponentNode(ctx, methodName, args = []) {
    return ctx.createCallExpression(
      createStaticReferenceNode(
        ctx,
        this.stack,
        "web.components.Component",
        methodName
      ),
      args
    );
  }
  createVueComponentOptionsNode(ctx, name, module2) {
    const properties2 = [
      ctx.createProperty(
        ctx.createIdentifier("name"),
        ctx.createLiteral(`es-${name}`)
      )
    ];
    const options = ctx.plugin.options;
    const vueOpts = options.vue || {};
    const makeOptions = vueOpts.makeOptions || {};
    if (makeOptions.file) {
      properties2.push(
        ctx.createProperty(
          ctx.createIdentifier("__file"),
          ctx.createLiteral(this.compilation.file)
        )
      );
    }
    if (makeOptions.vccOpts) {
      properties2.push(
        ctx.createProperty(
          ctx.createIdentifier("__vccOpts"),
          ctx.createLiteral(true)
        )
      );
    }
    if (makeOptions.asyncSetup) {
      const asyncSetup = makeOptions.asyncSetup;
      const ssr = !!options.ssr;
      if (asyncSetup.mode !== "none") {
        let enable = asyncSetup.mode === "all" || ssr && asyncSetup.mode === "ssr" || !ssr && asyncSetup.mode === "nossr";
        if (enable && asyncSetup.filter && typeof asyncSetup.filter === "function") {
          enable = asyncSetup.filter(module2.getName(), this.compilation.file);
        }
        if (enable) {
          properties2.push(
            ctx.createProperty(
              ctx.createIdentifier("__asyncSetup"),
              ctx.createLiteral(true)
            )
          );
        }
      }
    }
    let scopeId = this.getStyleScopeId(ctx);
    if (scopeId) {
      properties2.push(
        ctx.createProperty(
          ctx.createIdentifier("__scopeId"),
          ctx.createLiteral(
            vueOpts.scopePrefix + scopeId
          )
        )
      );
    }
    if (options.hot !== false && options.mode !== "production") {
      properties2.push(
        ctx.createProperty(
          ctx.createIdentifier("__hmrId"),
          ctx.createLiteral(
            ctx.getHashId()
          )
        )
      );
    }
    if (options.ssr && makeOptions.ssrContext !== false) {
      const file = ctx.compiler.getRelativeWorkspace(this.compilation.file);
      if (file) {
        properties2.push(
          ctx.createProperty(
            ctx.createIdentifier("__ssrContext"),
            ctx.createLiteral(
              import_Utils24.default.normalizePath(file)
            )
          )
        );
      }
    }
    properties2.push(
      ...this.getModuleDefineOptions(ctx, this.module)
    );
    if (this.#props.length > 0) {
      properties2.push(
        ctx.createProperty(
          ctx.createIdentifier("props"),
          ctx.createObjectExpression(this.#props)
        )
      );
    }
    return ctx.createObjectExpression(properties2);
  }
  getStyleScopeId(ctx) {
    let present = this.#styleScopeId;
    if (present === void 0) {
      if (hasStyleScoped(this.compilation)) {
        present = this.#styleScopeId = ctx.getHashId();
      } else {
        present = this.#styleScopeId = null;
      }
    }
    return present;
  }
  getModuleDefineOptions(ctx, module2) {
    const results = /* @__PURE__ */ Object.create(null);
    getModuleAnnotations(module2, ["define"]).forEach((annot) => {
      const args = annot.getArguments();
      if (!args.length)
        return;
      let value = String(args[0].value).toLowerCase();
      if (value === "emits" || value === "options") {
        const _args = value === "emits" ? args.slice(1) : args.slice(2);
        const key = value === "emits" ? "emits" : args[1].value;
        if (String(key) === "props") {
          console.error(`[ES-VUE] Options 'props' should declared as properties in the component class`);
        } else {
          let obj = /* @__PURE__ */ Object.create(null);
          let arr = [];
          let literal = null;
          let maybeLiteralType = _args.length > 1 ? _args[_args.length - 1] : null;
          if (maybeLiteralType && String(maybeLiteralType.key).toLowerCase() === "type") {
            literal = maybeLiteralType.value === "--literal";
            if (!literal) {
              maybeLiteralType = null;
            }
          } else {
            maybeLiteralType = null;
          }
          _args.forEach((arg) => {
            if (arg === maybeLiteralType)
              return;
            if (arg.assigned) {
              obj[arg.key] = arg.value;
            } else {
              arr.push(arg.value);
            }
          });
          if (results[key]) {
            if (!results[key].literal) {
              const oldO = results[key].obj;
              const oldA = results[key].arr;
              Object.keys(obj).forEach((key2) => {
                if (!oldO.hasOwnProperty(key2)) {
                  oldO[key2] = obj[key2];
                }
              });
              arr.forEach((val) => {
                if (!oldA.includes(val)) {
                  oldA.push(val);
                }
              });
            }
          } else {
            results[key] = { obj, arr, literal };
          }
        }
      }
    });
    let keys2 = Object.keys(results);
    if (keys2.length > 0) {
      return keys2.map((key) => {
        const target = results[key];
        let literal = target.literal;
        let arrayNode = null;
        let objectNode = null;
        let keys3 = Object.keys(target.obj);
        if (keys3.length > 0) {
          objectNode = ctx.createObjectExpression(keys3.map((key2) => {
            return ctx.createProperty(
              ctx.createIdentifier(key2),
              ctx.createLiteral(target.obj[key2])
            );
          }));
        }
        if (target.arr.length > 0) {
          arrayNode = ctx.createArrayExpression(
            target.arr.map((val) => {
              return ctx.createLiteral(val);
            })
          );
        }
        let propertyNode = arrayNode || objectNode;
        if (arrayNode && objectNode) {
          propertyNode = ctx.createCallExpression(
            ctx.createMemberExpression([
              ctx.createIdentifier("Object"),
              ctx.createIdentifier("assign")
            ]),
            [arrayNode, objectNode]
          );
        } else if (literal && arrayNode) {
          if (arrayNode.elements.length === 1) {
            propertyNode = arrayNode.elements[0];
          }
        }
        return ctx.createProperty(ctx.createIdentifier(key), propertyNode);
      });
    }
    return [];
  }
  createExport(ctx, module2) {
    if (this.stack.compilation.mainModule === module2) {
      let id = this.getModuleDeclarationId(module2);
      this.createHMRHotAcceptNode(ctx, id);
      ctx.addExport(
        "default",
        this.#exportVueComponentNode || ctx.createIdentifier(id)
      );
    }
  }
};
var ESXClassBuilder_default = ESXClassBuilder;

// lib/tokens/ClassDeclaration.js
function ClassDeclaration_default2(ctx, stack) {
  if (stack.isModuleForWebComponent(stack.module)) {
    const builder = new ESXClassBuilder_default(stack);
    return builder.create(ctx);
  } else {
    const builder = new ClassBuilder_default2(stack);
    return builder.create(ctx);
  }
}

// lib/core/ESXOptimize.js
var import_Namespace9 = __toESM(require("easescript/lib/core/Namespace"));
var import_Utils25 = __toESM(require("easescript/lib/core/Utils"));
var Cache2 = getCacheManager("common");
var hasStyleScopedKey = Symbol("hasStyleScoped");
var ELEMENT_TEXT = 1;
var ELEMENT_CLASS = 2;
var ELEMENT_STYLE = 4;
var ELEMENT_PROPS = 8;
var ELEMENT_FULL_PROPS = 16;
var ELEMENT_STABLE_FRAGMENT = 64;
var ELEMENT_NEED_PATCH = 512;
var ELEMENT_DYNAMIC_SLOTS = 1024;
var ELEMENT_HOISTED = -1;
var ELEMENT_BAIL = -2;
function addPatchFlag(data, flag, isProps = false) {
  if ((data.patchFlag & flag) !== flag) {
    if (data.hasDynamicKeys && isProps && flag !== ELEMENT_FULL_PROPS) {
      return;
    }
    if (flag === ELEMENT_HOISTED) {
      data.patchFlag = ELEMENT_HOISTED;
    } else if (flag === ELEMENT_BAIL) {
      data.patchFlag = ELEMENT_BAIL;
    } else {
      data.patchFlag |= flag;
    }
  }
}
function isOpenBlock(stack) {
  const isRoot = stack.jsxRootElement === stack;
  if (isRoot)
    return true;
  if (stack.isDirective || stack.directives && stack.directives.length > 0) {
    let isShowDirective = false;
    if (!stack.isDirective && stack.directives.length === 1) {
      isShowDirective = compare(stack.directives[0].name.value(), "show");
    }
    return !isShowDirective;
  } else if (stack.parentStack && stack.parentStack.isDirective) {
    let isShowDirective = compare(stack.parentStack.openingElement.name.value(), "show");
    return !isShowDirective;
  } else {
    const desc = stack.descriptor();
    if (desc) {
      const type = desc.type();
      if (import_Utils25.default.isModule(type)) {
        return import_Namespace9.default.globals.get("web.components.Fragment").is(type);
      }
    }
  }
  return false;
}
function createDirectiveDescriptor(ctx, stack, child, prev = null) {
  if (!child)
    return null;
  const cmd = [];
  if (!stack.directives || !(stack.directives.length > 0)) {
    return {
      cmd,
      stack,
      child
    };
  }
  const directives = stack.directives.slice(0).sort((a, b) => {
    const bb = b.name.value().toLowerCase();
    const aa = a.name.value().toLowerCase();
    const v1 = bb === "each" || bb === "for" ? 1 : 0;
    const v2 = aa === "each" || aa === "for" ? 1 : 0;
    return v1 - v2;
  });
  while (directives.length > 0) {
    const directive = directives.shift();
    const name = directive.name.value().toLowerCase();
    const valueArgument = directive.valueArgument;
    if (name === "each" || name === "for") {
      let refs = ctx.createToken(valueArgument.expression);
      let item = ctx.createIdentifier(valueArgument.declare.item);
      let key = ctx.createIdentifier(valueArgument.declare.key || "key");
      let index = valueArgument.declare.index;
      if (index) {
        index = ctx.createIdentifier(index);
      }
      if (name === "each") {
        child = createForEachNode(
          ctx,
          refs,
          child,
          item,
          key,
          stack
        );
      } else {
        child = createForMapNode(
          ctx,
          refs,
          child,
          item,
          key,
          index,
          stack
        );
      }
      child.isForNode = true;
      child = createFragmentVNode2(ctx, child);
      cmd.push(name);
    } else if (name === "if") {
      child = ctx.createConditionalExpression(ctx.createToken(valueArgument.expression), child);
      cmd.push(name);
    } else if (name === "elseif") {
      if (!prev || !(prev.cmd.includes("if") || prev.cmd.includes("elseif"))) {
        directive.name.error(1114, name);
      } else {
        cmd.push(name);
      }
      child = ctx.createConditionalExpression(ctx.createToken(valueArgument.expression), child);
    } else if (name === "else") {
      if (!prev || !(prev.cmd.includes("if") || prev.cmd.includes("elseif"))) {
        directive.name.error(1114, name);
      } else {
        cmd.push(name);
      }
    }
  }
  return {
    cmd,
    stack,
    child
  };
}
function mergeConditionalNode(conditionExp, alternate) {
  if (conditionExp.type !== "ConditionalExpression") {
    throw new Error("Invaild expression");
  }
  conditionExp.alternate = alternate;
  alternate.top = conditionExp.top || conditionExp;
  return alternate;
}
function createChildren2(ctx, children, data, stack, isWebComponent) {
  let content = [];
  let len = children.length;
  let index = 0;
  let last = null;
  let result = null;
  let pureStaticChild = true;
  let next = () => {
    if (index < len) {
      const childStack = children[index++];
      const descriptor = createDirectiveDescriptor(
        ctx,
        childStack,
        ctx.createToken(childStack),
        last
      ) || next();
      if (pureStaticChild) {
        if (childStack.directives && childStack.directives.length > 0) {
          pureStaticChild = false;
        } else if (descriptor.child) {
          pureStaticChild = isPureStaticChild(descriptor.child);
        }
      }
      if (childStack.hasAttributeSlot) {
        pureStaticChild = false;
        const attributeSlot = childStack.openingElement.attributes.find((attr) => attr.isAttributeSlot);
        if (attributeSlot) {
          let name = attributeSlot.name.value();
          let scopeName = attributeSlot.value ? ctx.createToken(
            attributeSlot.parserSlotScopeParamsStack()
          ) : null;
          let childrenNodes = ctx.createArrayExpression(descriptor.child ? [descriptor.child] : []);
          let params = scopeName ? [
            ctx.createAssignmentExpression(
              scopeName,
              ctx.createObjectExpression()
            )
          ] : [];
          let slotFn = ctx.createArrowFunctionExpression(childrenNodes, params);
          if (isPureStaticChild(descriptor.child)) {
            slotFn = ctx.addStaticHoisted(slotFn);
          }
          let renderSlots = createSlotNode(
            ctx,
            childStack,
            slotFn
          );
          data.slots[name] = renderSlots;
          return next();
        }
      } else if (childStack.isSlot && !childStack.isSlotDeclared) {
        pureStaticChild = false;
        const name = childStack.openingElement.name.value();
        data.slots[name] = descriptor.child;
        return next();
      } else if (childStack.isDirective) {
        pureStaticChild = false;
        descriptor.cmd.push(
          childStack.openingElement.name.value().toLowerCase()
        );
      }
      return descriptor;
    }
    return null;
  };
  while (true) {
    result = next();
    if (last) {
      let value = null;
      const hasIf = last.cmd.includes("if");
      if (hasIf) {
        if (result && result.cmd.includes("elseif")) {
          result.cmd = last.cmd.concat(result.cmd);
          result.child = mergeConditionalNode(last.child, result.child);
        } else if (result && result.cmd.includes("else")) {
          value = mergeConditionalNode(last.child, result.child).top;
          result.ifEnd = true;
        } else {
          if (result)
            result.ifEnd = true;
          value = mergeConditionalNode(last.child, createCommentVNode(ctx, "end if", true)).top;
        }
      } else if (!(last.ifEnd && last.cmd.includes("else"))) {
        value = last.child;
      }
      if (value) {
        content.push(value);
      }
    }
    last = result;
    if (!result)
      break;
  }
  data.pureStaticChild = pureStaticChild;
  if (content.length > 1) {
    content = content.reduce((acc, item) => {
      if ((item.type === "Literal" || item.isScalarType && item.isExpressionContainer) && acc.length > 0) {
        let index2 = acc.length - 1;
        let last2 = acc[index2];
        if (item.type === last2.type && last2.type === "Literal") {
          last2.value += item.value;
          last2.raw = `"${last2.value}"`;
          return acc;
        } else if (last2.type === "Literal" || last2.isScalarType && last2.isExpressionContainer) {
          const node = ctx.createBinaryExpression(
            last2,
            item,
            "+"
          );
          node.isMergeStringNode = true;
          node.isScalarType = true;
          acc.splice(index2, 1, node);
          return acc;
        }
      }
      acc.push(item);
      return acc;
    }, []);
  }
  return content;
}
function createAttributes2(ctx, stack, data) {
  const ssr = !!ctx.options.ssr;
  const pushEvent = (name, node, category) => {
    if (ssr && category === "on")
      return;
    let events = data[category] || (data[category] = []);
    if (!Node_default.is(name)) {
      name = String(name);
      name = name.includes(":") ? ctx.createLiteral(name) : ctx.createIdentifier(name);
    }
    let property = ctx.createProperty(name, node);
    if (property.key.computed) {
      property.computed = true;
      property.key.computed = false;
    }
    if (category === "on") {
      if (property.computed) {
        property.key = ctx.createTemplateLiteral([
          ctx.createTemplateElement("on")
        ], [
          ctx.createCallExpression(
            createStaticReferenceNode(ctx, stack, "System", "firstUpperCase"),
            [
              property.key
            ]
          )
        ]);
      } else {
        property.key.value = "on" + toFirstUpperCase(property.key.value);
        if (property.key.type === "Literal") {
          property.key.raw = `"${property.key.value}"`;
        }
      }
    }
    events.push(property);
  };
  const createPropertyNode = (propName, propValue) => {
    return ctx.createProperty(
      propName.includes("-") ? ctx.createLiteral(propName) : ctx.createIdentifier(propName),
      propValue
    );
  };
  let isComponent = stack.isComponent || stack.isWebComponent;
  let nodeType = !isComponent ? stack.openingElement.name.value().toLowerCase() : null;
  let binddingModelValue = null;
  let afterDirective = null;
  let custom = null;
  if (nodeType === "input") {
    afterDirective = "vModelText";
  } else if (nodeType === "select") {
    afterDirective = "vModelSelect";
  } else if (nodeType === "textarea") {
    afterDirective = "vModelText";
  }
  const forStack = stack.getParentStack((stack2) => {
    return stack2.scope.isForContext || !(stack2.isJSXElement || stack2.isJSXExpressionContainer);
  }, true);
  const inFor = forStack && forStack.scope && forStack.scope.isForContext ? true : false;
  const descModule = stack.isWebComponent ? stack.description() : null;
  const definedEmits = getComponentEmitAnnotation(descModule);
  const getDefinedEmitName = (name) => {
    if (definedEmits && Object.prototype.hasOwnProperty.call(definedEmits, name)) {
      name = toCamelCase(definedEmits[name]);
    }
    return name;
  };
  let pureStaticAttributes = true;
  stack.openingElement.attributes.forEach((item) => {
    if (item.isAttributeXmlns)
      return;
    if (item.isAttributeDirective) {
      if (item.isAttributeDirective) {
        pureStaticAttributes = false;
        const name2 = item.name.value();
        if (compare(name2, "show")) {
          data.directives.push(
            createDirectiveArrayNode(
              ctx,
              "vShow",
              ctx.createToken(item.valueArgument.expression)
            )
          );
        } else if (compare(name2, "custom")) {
          data.directives.push(
            createResolveAttriubeDirective(
              ctx,
              item
            )
          );
        }
      }
      return;
    } else if (item.isJSXSpreadAttribute) {
      if (item.argument) {
        pureStaticAttributes = false;
        data.props.push(
          ctx.createSpreadElement(
            ctx.createToken(item.argument),
            item
          )
        );
        addPatchFlag(data, ELEMENT_FULL_PROPS, true);
      }
      return;
    } else if (item.isAttributeSlot) {
      return;
    }
    let value = ctx.createToken(item);
    if (!value)
      return;
    let ns = value.namespace;
    let name = value.name.value;
    let propName = name;
    let propValue = value.value;
    let attrLowerName = name.toLowerCase();
    if (propValue && propValue.isExpressionContainer && propValue.type !== "Literal") {
      pureStaticAttributes = false;
    }
    if (ns === "@events" || ns === "@natives") {
      pureStaticAttributes = false;
      name = getDefinedEmitName(name);
    }
    if (ns && ns.includes("::")) {
      let [seg, className] = ns.split("::", 2);
      ns = seg;
      name = createStaticReferenceNode(ctx, item, className, name);
      name.computed = true;
      custom = name;
    }
    let isDOMAttribute = false;
    if (item.isMemberProperty) {
      let attrDesc = item.getAttributeDescription(stack.getSubClassDescription());
      if (attrDesc) {
        isDOMAttribute = getMethodAnnotations(attrDesc, ["domattribute"]).length > 0;
      }
    }
    if (ns === "@events" || ns === "@natives") {
      pushEvent(name, createAttributeBindingEventNode(ctx, item, propValue), "on");
      return;
    } else if (ns === "@binding") {
      pureStaticAttributes = false;
      binddingModelValue = propValue;
      if (!binddingModelValue || !(binddingModelValue.type === "MemberExpression" || binddingModelValue.type === "Identifier")) {
        binddingModelValue = null;
        if (item.value && item.value.isJSXExpressionContainer) {
          const stack2 = item.value.expression;
          if (stack2 && stack2.isMemberExpression && !stack2.optional) {
            binddingModelValue = ctx.createCallExpression(
              createStaticReferenceNode(ctx, stack2, "Reflect", "set"),
              [
                stack2.module ? ctx.createIdentifier(stack2.module.id) : ctx.createLiteral(null),
                ctx.createToken(stack2.object),
                stack2.computed ? ctx.createToken(stack2.property) : ctx.createLiteral(stack2.property.value()),
                ctx.createIdentifier("value")
              ],
              stack2
            );
            binddingModelValue.isReflectSetter = true;
          }
        }
      }
    }
    let bindValuePropName = null;
    if (item.isMemberProperty) {
      if (ns === "@binding" && attrLowerName === "value") {
        bindValuePropName = propName;
        data.props.push(
          createPropertyNode(
            propName,
            propValue
          )
        );
        propName = "modelValue";
      }
      if (!isDOMAttribute) {
        data.props.push(
          createPropertyNode(
            propName,
            propValue
          )
        );
      }
    }
    if (propValue && propValue.type != "Literal" && (ns !== "@binding" || item.isMemberProperty || propValue.isExpressionContainer)) {
      if (bindValuePropName) {
        data.keyProps.push(ctx.createLiteral(bindValuePropName));
      }
      data.keyProps.push(ctx.createLiteral(propName));
      addPatchFlag(data, ELEMENT_PROPS, true);
    }
    if (item.isMemberProperty && !isDOMAttribute && ns !== "@binding") {
      return;
    }
    if (attrLowerName === "type" && nodeType === "input" && propValue && propValue.type === "Literal") {
      const value2 = propValue.value.toLowerCase();
      if (value2 === "checkbox") {
        afterDirective = "vModelCheckbox";
        pureStaticAttributes = false;
      } else if (value2 === "radio") {
        afterDirective = "vModelRadio";
        pureStaticAttributes = false;
      }
    }
    if (ns === "@binding") {
      const createBinddingParams = (getEvent = false) => {
        return [
          binddingModelValue.isReflectSetter ? binddingModelValue : ctx.createAssignmentExpression(
            binddingModelValue,
            getEvent ? createGetEventValueNode(ctx) : ctx.createIdentifier("e")
          ),
          [
            ctx.createIdentifier("e")
          ]
        ];
      };
      if (custom && binddingModelValue) {
        pushEvent(custom, ctx.createArrowFunctionExpression(
          ...createBinddingParams(!stack.isWebComponent)
        ), "on");
      } else if ((stack.isWebComponent || afterDirective) && binddingModelValue) {
        let eventName = propName;
        if (propName === "modelValue") {
          eventName = "update:modelValue";
        }
        if (item.isMemberProperty) {
          let _name = getBinddingEventName(item.description());
          if (_name) {
            eventName = toCamelCase(_name);
          }
        }
        pushEvent(
          getDefinedEmitName(eventName),
          ctx.createArrowFunctionExpression(
            ...createBinddingParams()
          ),
          "on"
        );
      } else if (binddingModelValue) {
        pushEvent(
          ctx.createIdentifier("input"),
          ctx.createArrowFunctionExpression(
            ...createBinddingParams(true)
          ),
          "on"
        );
      }
      if (afterDirective && binddingModelValue) {
        data.directives.push(
          createDirectiveArrayNode(ctx, afterDirective, binddingModelValue)
        );
      }
      return;
    }
    if (!ns && (attrLowerName === "ref" || attrLowerName === "refs")) {
      pureStaticAttributes = false;
      name = propName = "ref";
      let useArray = inFor || attrLowerName === "refs";
      if (useArray) {
        propValue = ctx.createArrowFunctionExpression(
          ctx.createCallExpression(
            ctx.createMemberExpression([
              ctx.createThisExpression(),
              ctx.createIdentifier("setRefNode")
            ]),
            [
              value.value,
              ctx.createIdentifier("node"),
              ctx.createLiteral(true)
            ]
          ),
          [
            ctx.createIdentifier("node")
          ]
        );
      }
    }
    if (name === "class" || name === "staticClass") {
      if (propValue && propValue.type !== "Literal") {
        propValue = ctx.createCallExpression(
          ctx.createIdentifier(
            ctx.getVNodeApi("normalizeClass")
          ),
          [
            propValue
          ]
        );
      }
    } else if (name === "style" || name === "staticStyle") {
      if (propValue && !(propValue.type === "Literal" || propValue.type === "ObjectExpression")) {
        propValue = ctx.createCallExpression(
          ctx.createIdentifier(
            ctx.getVNodeApi("normalizeStyle")
          ),
          [propValue]
        );
      }
    } else if (attrLowerName === "key" || attrLowerName === "tag") {
      name = attrLowerName;
    }
    const property = createPropertyNode(
      propName,
      propValue
    );
    switch (name) {
      case "class":
        if (item.value && !item.value.isLiteral && !isComponent) {
          addPatchFlag(data, ELEMENT_CLASS, true);
        }
      case "style":
        if (item.value && !item.value.isLiteral && !isComponent) {
          addPatchFlag(data, ELEMENT_STYLE, true);
        }
      case "ref":
      case "key":
      case "tag":
        data[name] = property;
        break;
      default:
        if (item.isMemberProperty) {
          data.props.push(property);
        } else {
          data.attrs.push(property);
        }
    }
  });
  if (!data.key) {
    data.key = createElementKeyPropertyNode(ctx, stack);
  }
  data.pureStaticAttributes = pureStaticAttributes;
}
function createTextVNode(ctx, node, flags = null) {
  let args = [
    node
  ];
  if (flags !== null) {
    args.push(ctx.createLiteral(flags));
  }
  let text = ctx.createCallExpression(
    ctx.createIdentifier(ctx.getVNodeApi("createTextVNode")),
    args
  );
  text.isTextVNode = true;
  return text;
}
function createFragmentVNode2(ctx, children, props, flags, disableStack = true) {
  const openBlock = ctx.createCallExpression(
    ctx.createIdentifier(
      ctx.getVNodeApi("openBlock")
    ),
    disableStack ? [
      ctx.createLiteral(true)
    ] : []
  );
  const nodeFlags = flags > 0 ? ctx.createLiteral(flags) : null;
  const args = [
    ctx.createIdentifier(ctx.getVNodeApi("Fragment")),
    props ? props : ctx.createLiteral(null),
    children
  ];
  if (nodeFlags) {
    args.push(nodeFlags);
  }
  const createVNode = ctx.createCallExpression(
    ctx.createIdentifier(
      ctx.getVNodeApi("createElementBlock")
    ),
    args
  );
  const node = ctx.createParenthesizedExpression(
    ctx.createSequenceExpression([openBlock, createVNode])
  );
  node.isElementVNode = true;
  node.isFragmentVNode = true;
  return node;
}
function createElementBlockVNode(ctx, stack, isComponent, args, disableStack) {
  stack = stack && stack.openingElement ? stack.openingElement.name : null;
  let openBlockArgs = [];
  if (disableStack) {
    openBlockArgs.push(ctx.createLiteral(true));
  }
  let openBlock = ctx.createCallExpression(
    ctx.createIdentifier(
      ctx.getVNodeApi("openBlock")
    ),
    openBlockArgs
  );
  let callee = ctx.createCallExpression(
    ctx.createIdentifier(ctx.getVNodeApi(isComponent ? "createBlock" : "createElementBlock")),
    args,
    stack
  );
  let node = ctx.createParenthesizedExpression(
    ctx.createSequenceExpression([
      openBlock,
      callee
    ])
  );
  node.isElementBlockVNode = true;
  node.isElementVNode = true;
  return node;
}
function createElementVNode(ctx, stack, isComponent, args, data) {
  stack = stack && stack.openingElement ? stack.openingElement.name : null;
  let node = ctx.createCallExpression(
    ctx.createIdentifier(
      ctx.getVNodeApi(isComponent ? "createVNode" : "createElementVNode")
    ),
    args,
    stack
  );
  node.isElementVNode = true;
  return node;
}
var excludes = ["patchFlag", "hasMultipleChildNodes", "pureStaticAttributes", "pureStaticChild"];
function makeElementVNode(ctx, stack, data, childNodes, isBlock) {
  let isComponent = stack.isComponent;
  let name = null;
  let props = data.keyProps;
  let patchFlag = data.patchFlag;
  let desc = null;
  if (isComponent) {
    desc = stack.descriptor();
    if (import_Utils25.default.isModule(desc)) {
      ctx.addDepend(desc);
      name = ctx.createIdentifier(
        ctx.getModuleReferenceName(desc, stack.module)
      );
    } else {
      name = ctx.createIdentifier(
        stack.openingElement.name.value()
      );
    }
  } else {
    name = ctx.createLiteral(stack.openingElement.name.value());
  }
  if (!isBlock && data.patchFlag === ELEMENT_HOISTED && data["class"] && stack.isModuleForWebComponent(stack.module)) {
    let scopeId = Cache2.get(stack.compilation, hasStyleScopedKey);
    if (scopeId == null) {
      if (hasStyleScoped(stack.compilation)) {
        Cache2.set(stack.compilation, hasStyleScopedKey, scopeId = ctx.getHashId());
      } else {
        Cache2.set(stack.compilation, hasStyleScopedKey, scopeId = "");
      }
    }
    if (scopeId) {
      scopeId = String(ctx.options.vue.scopePrefix || "") + scopeId;
      data.attrs.push(
        ctx.createProperty(
          ctx.createLiteral(scopeId),
          ctx.createLiteral(1)
        )
      );
    }
  }
  let dataObject = createElementPropsNode(ctx, data, stack, excludes);
  let items = [name, null, null, null, null];
  let pos = 1;
  if (dataObject) {
    if (data.pureStaticAttributes && data.patchFlag !== ELEMENT_HOISTED) {
      dataObject = ctx.addStaticHoisted(dataObject);
    }
    pos = 2;
    items[1] = dataObject;
  }
  if (childNodes) {
    pos = 3;
    items[2] = childNodes;
  }
  if (patchFlag) {
    pos = 4;
    items[3] = ctx.createLiteral(patchFlag);
  }
  if (props && props.length > 0) {
    pos = 5;
    items[4] = ctx.addStaticHoisted(
      ctx.createArrayExpression(props)
    );
  }
  const args = items.slice(0, pos).map((item) => item || ctx.createLiteral(null));
  if (isBlock) {
    return createElementBlockVNode(ctx, stack, isComponent, args, false);
  } else {
    return createElementVNode(ctx, stack, isComponent, args, data);
  }
}
function createNormalVNode(ctx, childNode, toTextNode = false, disableHoisted = false, stack = null) {
  let node = childNode;
  if (childNode.type === "Literal") {
    if (toTextNode) {
      node = createTextVNode(ctx, childNode, ELEMENT_HOISTED);
      node.isTextVNode = true;
      node.isElementVNode = true;
      node.pureStaticChild = true;
    }
  } else if (childNode.isExpressionContainer || childNode.isMergeStringNode) {
    if (childNode.isScalarType) {
      node = createTextVNode(ctx, node, ELEMENT_TEXT);
    } else if (!childNode.isExplicitVNode) {
      node = ctx.createCallExpression(
        createStaticReferenceNode(ctx, stack, "web.components.Component", "normalVNode"),
        [
          childNode
        ]
      );
    }
    node.pureStaticChild = false;
    node.isElementVNode = true;
  }
  if (!disableHoisted && node && node.pureStaticChild && !node.isStaticHoistedNode) {
    node = ctx.addStaticHoisted(node);
  }
  return node;
}
function makeChildrenNodes(ctx, children, toTextNode = false, disableHoisted = false, stack = null) {
  if (!children.length)
    return null;
  let num = 0;
  let newLine = false;
  let childNods = ctx.createArrayExpression(children.map((child) => {
    if (child.type === "Literal" || child.type === "Identifier" || child.isTextVNode) {
      num++;
    }
    if (!newLine) {
      if (child.type === "CallExpression" || child.type === "ConditionalExpression" || child.isFragmentVNode) {
        newLine = true;
      }
    }
    return createNormalVNode(ctx, child, toTextNode, disableHoisted, stack);
  }));
  childNods.newLine = newLine;
  if (num > 1) {
    childNods.newLine = true;
  }
  return childNods;
}
function isPureStaticChild(node) {
  if (!node)
    return true;
  return !!(node.type === "Literal" || node.pureStaticChild);
}
function isWholePureStaticChildren(children) {
  return children.length === 0 || children.every((item) => isPureStaticChild(item));
}
function createDirectiveElementNode2(ctx, stack, children) {
  const openingElement = stack.openingElement;
  const name = openingElement.name.value().toLowerCase();
  switch (name) {
    case "custom":
    case "show":
      return children;
    case "if":
    case "elseif": {
      const condition = ctx.createToken(stack.attributes[0].parserAttributeValueStack());
      const node = ctx.createNode("ConditionalExpression");
      node.test = condition;
      node.consequent = children;
      return node;
    }
    case "else":
      return children;
    case "for":
    case "each": {
      const attrs = stack.openingElement.attributes;
      const argument = {};
      attrs.forEach((attr) => {
        if (attr.name.value() === "name") {
          argument["refs"] = ctx.createToken(attr.parserAttributeValueStack());
        } else {
          argument[attr.name.value()] = ctx.createIdentifier(attr.value.value());
        }
      });
      let item = argument.item || ctx.createIdentifier("item");
      let key = argument.key || ctx.createIdentifier("key");
      let node = name === "for" ? createForMapNode(ctx, argument.refs, children, item, key, argument.index, stack) : createForEachNode(ctx, argument.refs, children, item, key, stack);
      node.isForNode = true;
      return createFragmentVNode2(ctx, node);
    }
  }
  return null;
}
function createSlotElementNode2(ctx, stack, children, pureStaticChildWhole = false) {
  const openingElement = ctx.createToken(stack.openingElement);
  const args = [ctx, stack];
  let props = null;
  let params = [];
  if (stack.isSlotDeclared) {
    args.push(ctx.createLiteral(stack.openingElement.name.value()));
    if (openingElement.attributes.length > 0) {
      const properties2 = openingElement.attributes.map((attr) => {
        return ctx.createProperty(
          attr.name,
          attr.value
        );
      });
      props = ctx.createObjectExpression(properties2);
    } else {
      props = ctx.createObjectExpression();
    }
    args.push(props);
  } else if (stack.openingElement.attributes.length > 0) {
    const attribute = stack.openingElement.attributes[0];
    if (attribute.value) {
      const stack2 = attribute.parserSlotScopeParamsStack();
      params.push(
        ctx.createAssignmentExpression(
          ctx.createToken(stack2),
          ctx.createObjectExpression()
        )
      );
    }
  }
  if (children) {
    let slotFn = ctx.createArrowFunctionExpression(children, params);
    if (pureStaticChildWhole) {
      slotFn = ctx.addStaticHoisted(slotFn);
    }
    args.push(slotFn);
  }
  return createSlotNode(...args);
}
function createElement2(ctx, stack) {
  let data = {
    directives: [],
    slots: {},
    attrs: [],
    props: [],
    keyProps: []
  };
  let isRoot = stack.jsxRootElement === stack;
  let isWebComponent = stack.isWebComponent;
  let rawChildren = getChildren(stack);
  let children = createChildren2(ctx, rawChildren, data, stack, isWebComponent);
  let desc = stack.descriptor();
  let componentDirective = getComponentDirectiveAnnotation(desc, true);
  let hasDynamicSlots = false;
  let nodeElement = null;
  if (stack.isDirective && stack.openingElement.name.value().toLowerCase() === "custom") {
    componentDirective = true;
  } else if (stack.isComponent && isDirectiveInterface(desc)) {
    componentDirective = true;
  }
  if (componentDirective) {
    if (children.length > 1) {
      return createFragmentVNode2(
        ctx,
        makeChildrenNodes(ctx, children, true, false, stack),
        null,
        ELEMENT_STABLE_FRAGMENT,
        false
      );
    } else {
      return children[0];
    }
  }
  if (isWebComponent && import_Utils25.default.isModule(desc)) {
    let fullname = desc.getName();
    if (fullname === "web.components.KeepAlive") {
      hasDynamicSlots = true;
    }
  }
  let hasInheritDirectiveAttr = false;
  if (stack.parentStack && stack.parentStack.isDirective) {
    let dName = stack.parentStack.openingElement.name.value().toLowerCase();
    if (dName === "show") {
      const condition = stack.parentStack.openingElement.attributes[0];
      data.directives.push(
        createDirectiveArrayNode(
          ctx,
          "vShow",
          ctx.createToken(condition.parserAttributeValueStack())
        )
      );
    } else if (dName === "custom") {
      hasInheritDirectiveAttr = createCustomDirectiveProperties(ctx, stack.parentStack, data, (prop) => {
        if (prop.isInheritDirectiveProp) {
          data.keyProps.push(ctx.createLiteral(prop.key.value));
          addPatchFlag(data, ELEMENT_PROPS);
        }
      });
    }
  } else {
    hasInheritDirectiveAttr = createComponentDirectiveProperties(ctx, stack.parentStack, data, (prop) => {
      if (prop.isInheritDirectiveProp) {
        data.keyProps.push(ctx.createLiteral(prop.key.value));
        addPatchFlag(data, ELEMENT_PROPS);
      }
    });
  }
  if (!stack.isJSXFragment && !(isRoot && stack.openingElement.name.value() === "root")) {
    createAttributes2(ctx, stack, data);
  }
  if (hasInheritDirectiveAttr) {
    data.pureStaticAttributes = false;
  }
  let normalDirectives = [];
  if (data.directives && data.directives.length > 0) {
    normalDirectives = data.directives.filter((dire) => !dire.isInheritComponentDirective);
    if (normalDirectives.length > 0) {
      addPatchFlag(data, ELEMENT_NEED_PATCH);
    }
  }
  let pureStaticChild = data.pureStaticChild && isWholePureStaticChildren(children);
  let isBlock = hasDynamicSlots || isOpenBlock(stack);
  let isStaticHoisted = !(isWebComponent || stack.isDirective || stack.isSlot || isBlock || normalDirectives.length > 0) && data.pureStaticAttributes && pureStaticChild;
  if (!isWebComponent) {
    if (data.ref && children.length > 1) {
      addPatchFlag(data, ELEMENT_NEED_PATCH, true);
    }
  }
  if (isStaticHoisted) {
    addPatchFlag(data, ELEMENT_HOISTED);
  }
  if (hasDynamicSlots) {
    addPatchFlag(data, ELEMENT_DYNAMIC_SLOTS);
  }
  if (stack.isSlot) {
    nodeElement = createSlotElementNode2(
      ctx,
      stack,
      makeChildrenNodes(ctx, children, true, isStaticHoisted, stack),
      isStaticHoisted
    );
  } else if (stack.isDirective) {
    let childNodes = children[0];
    if (children.length > 1) {
      childNodes = createFragmentVNode2(
        ctx,
        makeChildrenNodes(ctx, children, true, false, stack),
        null,
        ELEMENT_STABLE_FRAGMENT,
        false
      );
    }
    nodeElement = createDirectiveElementNode2(ctx, stack, childNodes);
  } else {
    if (stack.isJSXFragment || isRoot && !isWebComponent && stack.openingElement.name.value() === "root") {
      if (children.length > 1) {
        nodeElement = createFragmentVNode2(
          ctx,
          makeChildrenNodes(ctx, children, true, false, stack),
          null,
          ELEMENT_STABLE_FRAGMENT,
          false
        );
      } else {
        nodeElement = children[0];
      }
    } else {
      let childNodes = null;
      if (isWebComponent) {
        let properties2 = [];
        if (children.length > 0) {
          let slotFn = ctx.createArrowFunctionExpression(
            makeChildrenNodes(ctx, children, true, pureStaticChild, stack)
          );
          if (pureStaticChild) {
            slotFn = ctx.addStaticHoisted(slotFn);
          }
          properties2.push(ctx.createProperty(
            ctx.createIdentifier("default"),
            createWithCtxNode(ctx, slotFn)
          ));
        }
        if (data.slots) {
          for (let key in data.slots) {
            properties2.push(
              ctx.createProperty(
                ctx.createIdentifier(key),
                data.slots[key]
              )
            );
          }
        }
        if (properties2.length > 0) {
          if ((data.patchFlag & ELEMENT_DYNAMIC_SLOTS) === ELEMENT_DYNAMIC_SLOTS) {
            properties2.push(ctx.createProperty(
              ctx.createIdentifier("_"),
              ctx.createLiteral(2)
            ));
          } else {
            properties2.push(ctx.createProperty(
              ctx.createIdentifier("_"),
              ctx.createLiteral(1)
            ));
          }
          childNodes = ctx.createObjectExpression(properties2);
        }
      } else if (children.length > 0) {
        if (children.length > 1 || !isStaticHoisted) {
          childNodes = makeChildrenNodes(ctx, children, true, false, stack);
        } else {
          childNodes = children[0];
          if (childNodes && !isStaticHoisted && childNodes.pureStaticChild) {
            childNodes = ctx.addStaticHoisted(childNodes);
          }
        }
      }
      nodeElement = makeElementVNode(ctx, stack, data, childNodes, isBlock);
    }
  }
  if (nodeElement && data.directives && data.directives.length > 0) {
    nodeElement = createWithDirectives(ctx, nodeElement, data.directives);
    nodeElement.isWithDirective = true;
    nodeElement.isElementVNode = true;
  }
  nodeElement.pureStaticChild = isStaticHoisted;
  nodeElement.hasKeyAttribute = !!data.key;
  return nodeElement;
}

// lib/tokens/JSXElement.js
function JSXElement2(ctx, stack) {
  if (!ctx.options.esx.enable)
    return;
  if (ctx.options.vue.optimize) {
    return createElement2(ctx, stack);
  }
  return createElement(ctx, stack);
}

// lib/tokens/JSXFragment.js
var JSXFragment_default2 = JSXElement2;

// lib/core/Builder.js
var import_glob_path2 = __toESM(require("glob-path"));
async function buildProgram2(ctx, compilation, graph) {
  let root = compilation.stack;
  if (!root) {
    throw new Error("Build program failed");
  }
  let body = [];
  let externals = [];
  let imports = [];
  let exports2 = [];
  let emitFile = ctx.options.emitFile;
  ctx.setNode(root, body);
  root.body.forEach((item) => {
    if (item.isClassDeclaration || item.isEnumDeclaration || item.isInterfaceDeclaration || item.isStructTableDeclaration || item.isPackageDeclaration) {
      const child = ctx.createToken(item);
      if (child) {
        body.push(child);
      }
    }
  });
  if (root.imports && root.imports.length > 0) {
    root.imports.forEach((item) => {
      if (item.isImportDeclaration) {
        ctx.createToken(item);
      }
    });
  }
  if (root.externals.length > 0) {
    root.externals.forEach((item) => {
      if (item.isImportDeclaration) {
        ctx.createToken(item);
      } else {
        const node = ctx.createToken(item);
        if (node) {
          externals.push(node);
        }
      }
    });
  }
  ctx.removeNode(root);
  if (root.exports.length > 0) {
    root.exports.forEach((item) => {
      ctx.createToken(item);
    });
  }
  ctx.crateRootAssets();
  ctx.createAllDependencies();
  let exportNodes = null;
  let importNodes = null;
  if (ctx.options.module === "cjs") {
    importNodes = createCJSImports(ctx, ctx.imports);
    exportNodes = createCJSExports(ctx, ctx.exports, graph);
  } else {
    importNodes = createESMImports(ctx, ctx.imports);
    exportNodes = createESMExports(ctx, ctx.exports, graph);
  }
  imports.push(...importNodes, ...exportNodes.imports);
  body.push(...exportNodes.declares);
  exports2.push(...exportNodes.exports);
  let layout = [
    ...imports,
    ...ctx.staticHoistedItems,
    ...ctx.beforeBody,
    ...body,
    ...ctx.afterBody,
    ...externals,
    ...exports2
  ];
  if (layout.length > 0) {
    let generator = new Generator_default(ctx);
    layout.forEach((item) => generator.make(item));
    graph.code = generator.code;
    graph.sourcemap = generator.sourceMap ? generator.sourceMap.toJSON() : null;
    if (emitFile) {
      graph.outfile = ctx.getOutputAbsolutePath(compilation.mainModule || compilation);
    }
  }
}
var tokensSets = Object.assign({}, tokens_exports, tokens_exports2);
function getTokenManager2(options) {
  let _createToken = options.transform.createToken;
  let _tokens = options.transform.tokens;
  let getToken = (type) => {
    return tokensSets[type];
  };
  let createToken = (ctx, stack, type) => {
    const token = getToken(type);
    if (!token) {
      throw new Error(`Token '${type}' is not exists.`);
    }
    try {
      return token(ctx, stack, type);
    } catch (e) {
      console.error(e);
    }
  };
  if (_tokens && typeof _tokens === "object" && Object.keys(_tokens).length > 0) {
    getToken = (type) => {
      if (Object.prototype.hasOwnProperty.call(_tokens, type)) {
        return _tokens[type];
      }
      return tokensSets[type];
    };
  }
  if (_createToken && typeof _createToken === "function") {
    createToken = (ctx, stack, type) => {
      try {
        return _createToken(ctx, stack, type);
      } catch (e) {
        console.error(e);
      }
    };
  }
  return {
    get: getToken,
    create: createToken
  };
}
function createBuildContext2(plugin2, records2 = /* @__PURE__ */ new Map()) {
  let assets = getAssetsManager(Asset);
  let virtuals = getVirtualModuleManager(VirtualModule);
  let variables = getVariableManager();
  let graphs = getBuildGraphManager();
  let token = getTokenManager2(plugin2.options);
  let cache = getCacheManager();
  let table = getTableManager();
  let buildAfterDeps = /* @__PURE__ */ new Set();
  let glob = null;
  let resolve = plugin2.options.resolve || {};
  let imports = resolve?.imports || {};
  table.addBuilder(new MySql(plugin2));
  Object.keys(imports).forEach((key) => {
    glob = glob || (glob = new import_glob_path2.default());
    glob.addRuleGroup(key, imports[key], "imports");
  });
  let folders = resolve?.folders || {};
  Object.keys(folders).forEach((key) => {
    glob = glob || (glob = new import_glob_path2.default());
    glob.addRuleGroup(key, folders[key], "folders");
  });
  function makeContext(compiOrVModule) {
    return new Context_default2(
      compiOrVModule,
      plugin2,
      variables,
      graphs,
      assets,
      virtuals,
      glob,
      cache,
      token,
      table
    );
  }
  async function build(compiOrVModule) {
    if (records2.has(compiOrVModule)) {
      return records2.get(compiOrVModule);
    }
    let ctx = makeContext(compiOrVModule);
    let buildGraph = ctx.getBuildGraph(compiOrVModule);
    records2.set(compiOrVModule, buildGraph);
    if (isVModule(compiOrVModule)) {
      await compiOrVModule.build(ctx, buildGraph);
    } else {
      if (!compiOrVModule.parserDoneFlag) {
        await compiOrVModule.ready();
      }
      await buildProgram2(ctx, compiOrVModule, buildGraph);
    }
    if (ctx.options.emitFile) {
      await buildAssets(ctx, buildGraph);
      await ctx.emit(buildGraph);
    }
    invokeAfterTask();
    return buildGraph;
  }
  async function buildDeps(compiOrVModule) {
    if (records2.has(compiOrVModule)) {
      return records2.get(compiOrVModule);
    }
    let ctx = makeContext(compiOrVModule);
    let buildGraph = ctx.getBuildGraph(compiOrVModule);
    records2.set(compiOrVModule, buildGraph);
    if (isVModule(compiOrVModule)) {
      await compiOrVModule.build(ctx, buildGraph);
    } else {
      if (!compiOrVModule.parserDoneFlag) {
        await compiOrVModule.ready();
      }
      await buildProgram2(ctx, compiOrVModule, buildGraph);
    }
    if (ctx.options.emitFile) {
      await buildAssets(ctx, buildGraph);
      await ctx.emit(buildGraph);
    }
    await callAsyncSequence(getBuildDeps(ctx), async (dep) => {
      if (isVModule(dep) && dep.after) {
        addBuildAfterDep(dep);
      } else {
        await buildDeps(dep);
      }
    });
    invokeAfterTask();
    return buildGraph;
  }
  async function buildAssets(ctx, buildGraph) {
    let assets2 = buildGraph.assets;
    if (!assets2)
      return;
    let items = Array.from(assets2.values()).map((asset) => {
      if (asset.after) {
        addBuildAfterDep(asset);
        return null;
      } else {
        return asset;
      }
    }).filter(Boolean);
    await Promise.all(items.map((asset) => asset.build(ctx)));
  }
  function getBuildDeps(ctx) {
    const deps = /* @__PURE__ */ new Set();
    ctx.dependencies.forEach((dataset) => {
      dataset.forEach((dep) => {
        if (import_Utils26.default.isModule(dep)) {
          if (!dep.isStructTable && dep.isDeclaratorModule) {
            dep = ctx.getVModule(dep.getName());
            if (dep) {
              deps.add(dep);
            }
          } else if (dep.compilation) {
            deps.add(dep.compilation);
          }
        } else if (isVModule(dep)) {
          deps.add(dep);
        } else if (import_Utils26.default.isCompilation(dep)) {
          deps.add(dep);
        }
      });
    });
    return Array.from(deps.values());
  }
  function addBuildAfterDep(dep) {
    buildAfterDeps.add(dep);
  }
  let waitingBuildAfterDeps = /* @__PURE__ */ new Set();
  function invokeAfterTask() {
    if (buildAfterDeps.size < 1)
      return;
    buildAfterDeps.forEach((dep) => {
      waitingBuildAfterDeps.add(dep);
    });
    buildAfterDeps.clear();
    setImmediate(async () => {
      if (waitingBuildAfterDeps.size > 0) {
        let deps = Array.from(waitingBuildAfterDeps.values());
        waitingBuildAfterDeps.clear();
        await callAsyncSequence(deps, async (dep) => {
          if (isAsset(dep)) {
            await dep.build(makeContext(dep));
          } else {
            records2.delete(dep);
            await buildDeps(dep);
          }
        });
      }
    });
  }
  return {
    build,
    buildDeps,
    buildAssets,
    buildAfterDeps,
    getBuildDeps,
    addBuildAfterDep,
    assets,
    virtuals,
    variables,
    graphs,
    glob,
    cache,
    token
  };
}

// lib/core/MakeCode.js
var import_dotenv2 = __toESM(require("dotenv"));
var import_fs6 = __toESM(require("fs"));
var import_path7 = __toESM(require("path"));
var import_dotenv_expand2 = __toESM(require("dotenv-expand"));
var import_Utils27 = __toESM(require("easescript/lib/core/Utils"));
var MakeCode = class extends Token_default {
  #plugin = null;
  #resolvePageDir = void 0;
  constructor(plugin2) {
    super();
    this.#plugin = plugin2;
  }
  get plugin() {
    return this.#plugin;
  }
  get options() {
    return this.#plugin.options;
  }
  get compiler() {
    return this.#plugin.complier;
  }
  get token() {
    return this.#plugin.context.token;
  }
  getPageDir() {
    let pageDir = this.#resolvePageDir;
    if (pageDir !== void 0)
      return pageDir;
    pageDir = this.options.pageDir;
    if (pageDir) {
      pageDir = this.compiler.resolveManager.resolveSource(pageDir);
    } else {
      pageDir = null;
    }
    this.#resolvePageDir = pageDir;
    return pageDir;
  }
  getProjectConfig() {
    const projectConfigFile = this.options.projectConfigFile;
    if (projectConfigFile) {
      if (projectConfigFile.endsWith(".env")) {
        const mode = this.options.mode || "production";
        const env = {};
        const files = [
          projectConfigFile,
          `${projectConfigFile}.${mode}`
        ];
        files.forEach((file) => {
          const filePath = this.compiler.resolveManager.resolveFile(file);
          if (!filePath)
            return;
          Object.assign(env, import_dotenv2.default.parse(import_fs6.default.readFileSync(filePath)));
        });
        import_dotenv_expand2.default.expand({ parsed: env });
        return `export default ${JSON.stringify(env)};`;
      } else {
        const file = this.compiler.resolveManager.resolveFile(projectConfigFile);
        if (file) {
          return `export * as default from "${file}";`;
        } else {
          console.error(`[ES-VUE] Not resolved project config file the "${projectConfigFile}"`);
        }
      }
    }
    return "export default {};";
  }
  async getPageRoutes() {
    const pageDir = this.options.pageDir;
    if (!pageDir) {
      return "export default [];";
    }
    const files = [];
    const pageExcludeRegular = this.options.pageExcludeRegular;
    const readdir = (dir2) => {
      if (!import_fs6.default.existsSync(dir2)) {
        return;
      }
      const items = import_fs6.default.readdirSync(dir2);
      if (items) {
        items.forEach((file) => {
          if (file === "." || file === "..")
            return;
          let filepath2 = import_path7.default.join(dir2, file);
          if (import_fs6.default.statSync(filepath2).isDirectory()) {
            readdir(filepath2);
          } else if (this.compiler.checkFileExt(filepath2)) {
            filepath2 = this.compiler.normalizePath(filepath2);
            if (pageExcludeRegular && pageExcludeRegular.test(filepath2)) {
              return;
            }
            files.push(filepath2);
          }
        });
      }
    };
    const dir = this.getPageDir();
    if (!dir) {
      console.error(`[ES-VUE] Not resolved page dir the "${pageDir}"`);
    }
    if (!dir || !import_fs6.default.existsSync(dir) || !import_fs6.default.statSync(dir).isDirectory()) {
      return "export default [];";
    }
    readdir(dir);
    const pagesModule = /* @__PURE__ */ new Set();
    const routesData = {};
    await callAsyncSequence(files, async (file) => {
      let compilation = await this.compiler.createCompilation(file);
      if (compilation) {
        await compilation.ready();
        const module2 = compilation.mainModule;
        if (module2 && !module2.isDeclaratorModule && module2.isWebComponent()) {
          pagesModule.add(module2);
        }
      }
    });
    const pages = Array.from(pagesModule).sort((a, b) => {
      a = a.file.split("/").length;
      b = b.file.split("/").length;
      return a - b;
    });
    const pageCxts = this.compiler.getWorkspaceFolders().map((file) => file.toLowerCase());
    const getParentRoute = (pid) => {
      if (routesData[pid]) {
        return routesData[pid];
      }
      if (pid && !pageCxts.includes(pid) && pageCxts.some((ctx) => pid.includes(ctx))) {
        return getParentRoute(import_path7.default.dirname(pid));
      }
      return null;
    };
    const metadata = /* @__PURE__ */ new Map();
    pages.forEach((pageModule) => {
      const pid = import_path7.default.dirname(pageModule.file).toLowerCase();
      const id = (pid + "/" + pageModule.id).toLowerCase();
      let routes = this.getModuleRoute(pageModule, true);
      let metakey = "__meta" + metadata.size;
      metadata.set(pageModule, metakey);
      routes.forEach((route) => {
        let item = {
          path: route.path || "/" + pageModule.getName("/"),
          name: route.name || pageModule.getName("/"),
          meta: metakey,
          redirect: getModuleRedirect(pageModule),
          component: `()=>import('${this.compiler.parseResourceId(pageModule)}')`
        };
        const parent = getParentRoute(pid);
        if (parent) {
          const children = parent.children || (parent.children = []);
          children.push(item);
        } else {
          routesData[id] = item;
        }
      });
    });
    const make = (items, level = 0) => {
      let indentChar = "    ";
      let top = indentChar.repeat(level);
      let code2 = `[
`;
      code2 += items.map((item) => {
        let ident = indentChar.repeat(level + 2);
        const code3 = Object.entries(item).map((attr) => {
          let [key, value] = attr;
          if (!value)
            return false;
          if (key === "component" || key === "meta") {
            return `${ident}${key}:${value}`;
          } else if (key === "children") {
            return `${ident}${key}:${make(value, level + 2)}`;
          }
          return `${ident}${key}:${JSON.stringify(value)}`;
        }).filter((val) => val).join(",\n");
        return `${indentChar}${top}{
${code3}
${indentChar}${top}}`;
      }).join(",\n");
      code2 += `
${top}]`;
      return code2;
    };
    const code = make(Object.values(routesData));
    const imports = [];
    metadata.forEach((key, module2) => {
      imports.push(`import ${key} from "${module2.file}?callhook&action=metadata&id=${module2.getName()}";
`);
    });
    return `${imports.join("")}export default ${code};`;
  }
  getDefaultRoutePath(module2) {
    const pageDir = this.getPageDir();
    let name = "/" + module2.getName("/");
    if (pageDir) {
      let baseName = "/" + import_path7.default.basename(pageDir) + "/";
      if (name.includes(baseName)) {
        let [_, last] = name.split(baseName, 2);
        return "/" + last;
      }
    }
    return name;
  }
  getModuleRoute(module2, isPage = false) {
    if (!module2)
      return [];
    if (!module2.isModule || !module2.isClass || module2.isDeclaratorModule)
      return [];
    let routes = getModuleRoutes(module2);
    if (routes && routes.length > 0)
      return routes;
    if (!isPage) {
      const pageDir = this.getPageDir();
      if (pageDir) {
        const pageExcludeRegular = this.options.pageExcludeRegular;
        let isExclude = pageExcludeRegular ? pageExcludeRegular.test(module2.file) : false;
        if (!isExclude) {
          isPage = module2.file.includes(pageDir);
        }
      }
    }
    if (isPage) {
      const name = module2.getName("/");
      return [{
        path: this.getDefaultRoutePath(module2),
        name
      }];
    }
    return [];
  }
  makeModuleMetadata(module2) {
    const metadataAnnot = getModuleAnnotations(module2, ["metadata"])[0];
    const imports = /* @__PURE__ */ new Set();
    const body = [];
    const metadata = {};
    let requireSelfFlag = false;
    if (metadataAnnot) {
      const checkDep = (stack) => {
        if (stack.isIdentifier) {
          const desc = stack.descriptor();
          if (desc && desc.isVariableDeclarator && desc.parentStack) {
            if (desc.init) {
              checkDep(desc.init);
            }
            body.push(desc.parentStack);
          } else if (desc && desc.isStack && desc.parentStack && desc.parentStack.isImportDeclaration) {
            imports.add(desc.parentStack);
          } else if (desc && desc.isDeclaratorFunction) {
            desc.imports.forEach((im) => {
              imports.add(im);
            });
          }
        } else if (stack.isMemberExpression) {
          if (stack.object.isMemberExpression) {
            checkDep(stack.object);
          } else {
            const desc = stack.object.descriptor();
            if (desc && desc.isModule) {
              if (desc.isClass) {
                let curImpStack = null;
                if (module2.imports.has(desc.id)) {
                  const stacks = module2.getStacks();
                  for (let ms of stacks) {
                    if (ms.isClassDeclaration) {
                      curImpStack = ms.imports.find((s) => s.descriptor() === desc);
                    }
                  }
                }
                if (curImpStack) {
                  imports.add(curImpStack);
                } else if (desc === module2) {
                  requireSelfFlag = true;
                }
              }
            } else if (desc && desc.isStack && desc.parentStack && desc.parentStack.isImportDeclaration) {
              imports.add(desc.parentStack);
            }
          }
        } else if (stack.isCallExpression) {
          checkDep(stack.callee);
        }
      };
      metadataAnnot.getArguments().forEach((item, index) => {
        if (item.assigned) {
          checkDep(item.stack.right);
          metadata[item.key] = this.createToken(item.stack.right);
        } else if (index === 0) {
          checkDep(item.stack);
          metadata.title = this.createToken(item.stack);
        } else {
          if (!item.stack.isIdentifier) {
            throw new ReferenceError("[es-vue] Metadata defined parameters except the first must take the form of key-value pairs");
          } else {
            checkDep(item.stack);
            metadata[item.stack.value()] = this.createToken(item.stack);
          }
        }
      });
    }
    const gen = new Generator_default();
    if (requireSelfFlag) {
      gen.make(this.createChunkNode(`import ${module2.getName("_")} from "${this.compiler.parseResourceId(module2)}"`));
    }
    if (imports.size > 0) {
      imports.forEach((stack) => {
        const node = this.createToken(stack);
        if (node) {
          if (!stack.source.isLiteral) {
            const desc = stack.descriptor();
            if (desc && desc.isModule && desc.isClass) {
              node.specifiers.forEach((spec) => {
                spec.local.value = desc.getName("_");
              });
            }
          }
          gen.make(node);
        }
      });
    }
    if (body.length > 0) {
      body.forEach((stack) => {
        gen.make(this.createToken(stack));
      });
    }
    const keys2 = Object.keys(metadata);
    if (keys2.length === 0 && body.length === 0) {
      return `export default {};`;
    }
    const decl = this.createVariableDeclaration("const", [
      this.createVariableDeclarator(this.createIdentifier("__$$metadata"), this.createObjectExpression(
        keys2.map(
          (key) => this.createProperty(this.createLiteral(key), metadata[key])
        )
      ))
    ]);
    gen.make(decl);
    return `${gen.toString()}
export default __$$metadata;`;
  }
  getModuleMetadata(compilation, query = {}) {
    let module2 = compilation.mainModule;
    if (query.id && module2.getName() !== query.id) {
      module2 = null;
    }
    if (!module2) {
      module2 = Array.from(compilation.modules.values()).find((m) => m.getName() === query.id && m.isModule && m.isClass && !m.isDeclaratorModule);
    }
    if (import_Utils27.default.isModule(module2)) {
      return this.makeModuleMetadata(module2);
    }
    return `export default {};`;
  }
};

// lib/core/Plugin.js
var import_path8 = __toESM(require("path"));
var import_Compilation2 = __toESM(require("easescript/lib/core/Compilation"));
function defineError2(complier) {
  if (defineError2.loaded || !complier || !complier.diagnostic)
    return;
  defineError2.loaded = true;
  let define = complier.diagnostic.defineError;
  define(11e3, "", [
    '\u5BF9\u975E\u5143\u7D20\u6839\u8282\u70B9\u7684\u7EC4\u4EF6\u4F7F\u7528"show"\u6307\u4EE4\u65F6\uFF0C\u65E0\u6CD5\u6309\u9884\u671F\u8FD0\u884C\u3002',
    "Runtime directive used on component with non-element root node. The 'show' directives will not function as intended"
  ]);
  define(11001, "", [
    "\u6307\u4EE4\u7EC4\u4EF6\u7684\u5B50\u7EA7\u53EA\u80FD\u662F\u4E00\u4E2AVNode\u7684\u7C7B\u578B",
    "Child of directive-component can only is of a VNode"
  ]);
  define(11002, "", [
    "JSX\u4E0D\u652F\u6301\u52A8\u6001\u5C5E\u6027\u540D",
    "Dynamic property name is not supported in JSX. this property will be removed."
  ]);
  define(11003, "", [
    "\u51FD\u6570\u4E2D\u5F15\u7528\u7684\u7EC4\u4EF6\u4E0D\u662F\u6807\u8BC6\u7B26",
    "The component references in a function is not an identifier"
  ]);
}
function setImports(imports, name, value, force = false) {
  if (force || !Object.prototype.hasOwnProperty.call(imports, name) || imports[name] === void 0) {
    imports[name] = value;
  }
}
function genMapping(options) {
  const ui = options.ui;
  const imports = options.resolve.imports;
  if (ui.style === "none") {
    setImports(imports, "element-plus/*/components/*/style/***", false);
    setImports(imports, "element-plus/theme-chalk/***", false);
    setImports(imports, "#es-vue-web-application-style", false, true);
  } else if (ui.style === "scss") {
    setImports(imports, "element-plus/lib/components/*/style/css", resolveComponent(options, "{0}/style/index"));
    setImports(imports, "#es-vue-web-application-style", "element-plus/theme-chalk/src/index.scss");
  } else {
    setImports(imports, "#es-vue-web-application-style", "element-plus/theme-chalk/index.css");
  }
  if (ui.module === "esm") {
    setImports(imports, "element-plus/lib/components/**", "element-plus/es/components/{...}/{basename}/index");
    setImports(imports, "element-plus/lib/components/**/*.*", "element-plus/es/components/{...}/index");
    if (ui.style === "scss") {
      setImports(imports, "element-plus/lib/components/*/style/css", resolveComponent(options, "{0}/style/index"));
    } else if (ui.style === "none") {
      setImports(imports, "element-plus/lib/components/*/style/*", false, true);
    } else {
      setImports(imports, "element-plus/lib/components/*/style/css", resolveComponent(options, "{0}/style/css"));
    }
  }
}
function mergeOptions(options) {
  const imports = options.resolve.imports || (options.resolve.imports = {});
  const ui = options.ui || (options.ui = {});
  if (ui.fully) {
    if (ui.style === "none") {
      setImports(imports, "element-plus/*/components/*/style/***", false, true);
      setImports(imports, "element-plus/theme-chalk/***", false, true);
      setImports(imports, "#es-vue-web-application-style", false, true);
    } else if (ui.style === "scss") {
      setImports(imports, "#es-vue-web-application-style", "element-plus/theme-chalk/src/index.scss");
    } else {
      setImports(imports, "#es-vue-web-application-style", "element-plus/theme-chalk/index.css");
    }
  } else {
    genMapping(options);
  }
  if (options.pageExcludeRegular) {
    if (!(options.pageExcludeRegular instanceof RegExp)) {
      throw new Error("Options.pageExcludeRegular invalid. must is regexp type.");
    }
  }
  return options;
}
function resolveComponent(options, name) {
  const flag = options.ui.module === "esm";
  return `element-plus/${flag ? "es" : "lib"}/components/${name}`;
}
function addFullyImports(glob) {
  const library = "element-plus";
  glob.addRule(/^(element-plus\/(lib|es)\/components)\//i, (id) => {
    if (id.endsWith("/style/index") || id.endsWith("/style/css") || id.includes("/lib/theme-chalk/")) {
      return false;
    }
    return library;
  }, 0, "imports");
}
var Plugin2 = class extends Plugin_default {
  #context = null;
  #makeCode = null;
  constructor(name, version, options) {
    super(name, version, mergeOptions(options));
  }
  get context() {
    return this.#context;
  }
  get makeCode() {
    let makeCode = this.#makeCode;
    if (makeCode === null) {
      this.#makeCode = makeCode = new MakeCode(this);
    }
    return makeCode;
  }
  init() {
    defineError2(this.complier);
    this.#context = createBuildContext2(this, this.records);
    createPolyfillModule(
      import_path8.default.join(__dirname, "./polyfills"),
      this.#context.virtuals.createVModule
    );
    if (this.options.ui.fully) {
      addFullyImports(this.#context.glob);
    }
  }
  async resolveRoutes(compilation) {
    if (!import_Compilation2.default.is(compilation)) {
      throw new Error("compilation is invalid");
    }
    if (!this.initialized) {
      await this.beforeStart(compilation.compiler);
    }
    if (!compilation.parserDoneFlag) {
      await compilation.ready();
    }
    let module2 = compilation.mainModule;
    if (module2) {
      return this.makeCode.getModuleRoute(module2);
    }
    return [];
  }
  async callHook(compilation, query = {}) {
    if (!this.initialized) {
      await this.beforeStart(compilation.compiler);
    }
    if (query.action === "config") {
      return this.makeCode.getProjectConfig(compilation, query);
    } else if (query.action === "route") {
      return await this.makeCode.getPageRoutes(compilation, query);
    } else if (query.action === "metadata") {
      return this.makeCode.getModuleMetadata(compilation, query);
    } else {
      throw new Error(`Callhook "${query.action}" is not supported`);
    }
  }
};
var Plugin_default2 = Plugin2;

// node_modules/@easescript/transform/lib/index.js
var import_merge = __toESM(require("lodash/merge"));
var defaultConfig = {
  webpack: {
    enable: false,
    inlineStyleLoader: []
  },
  //esm cjs
  module: "esm",
  emitFile: false,
  outExt: ".js",
  outDir: ".output",
  publicDir: "asstes",
  strict: true,
  babel: false,
  sourceMaps: false,
  hot: false,
  routePathWithNamespace: {
    server: false,
    client: true
  },
  mode: "production",
  metadata: {
    env: {
      NODE_ENV: "production"
    },
    versions: {}
  },
  transform: {
    createToken: null,
    tokens: null
  },
  formation: {
    route: null
  },
  context: {
    include: null,
    exclude: null,
    only: false
  },
  hooks: {
    createJSXAttrValue: ({ ctx, type, jsxAttrNode, descriptor, annotation }) => null
  },
  esx: {
    enable: true,
    raw: false,
    handleName: "createVNode",
    handleIsThis: false,
    complete: {
      //['for','each','condition','*']
      keys: false
    },
    delimit: {
      expression: {
        left: "{{",
        right: "}}"
      },
      attrs: {
        left: '"',
        right: '"'
      }
    },
    component: {
      prefix: "",
      resolve: null
    }
  },
  comments: false,
  manifests: {
    comments: false,
    annotations: false
  },
  privateChain: true,
  resolve: {
    imports: {},
    folders: {}
  },
  dependency: {
    externals: [],
    includes: [],
    excludes: []
  }
};
function getOptions(...options) {
  return (0, import_merge.default)(
    {},
    defaultConfig,
    ...options
  );
}

// package.json
var package_default = {
  name: "@easescript/es-vue",
  version: "0.0.1",
  description: "Code Transform To VUE For EaseScript Plugin",
  main: "dist/index.js",
  typings: "dist/types/typings.json",
  scripts: {
    dev: "npm run build && jasmine ./test/index.js",
    jasmine: "jasmine ./test/index.js",
    run: "jasmine babel-node ./test/.output/Index.js",
    test: "npm run dev & npm run run",
    build: "npm run manifest && node ./scripts/build.js",
    karma: "node ./scripts/build.js && karma start",
    webpack: "node ./scripts/build.js && webpack-dev-server --hot",
    manifest: "esc -o lib/types -f lib/types/index.d.es --manifest --scope es-vue --inherit @easescript/es-javascript"
  },
  repository: {
    type: "git",
    url: "git+https://github.com/51breeze/es-javascript.git"
  },
  keywords: [
    "es",
    "javascript",
    "web"
  ],
  author: "Jun Ye",
  license: "MIT",
  bugs: {
    url: "https://github.com/51breeze/es-vue/issues"
  },
  homepage: "https://github.com/51breeze/es-vue#readme",
  dependencies: {
    "@easescript/es-javascript": "latest"
  },
  devDependencies: {
    "@babel/core": "^7.18.6",
    "@babel/plugin-transform-runtime": "^7.18.6",
    "@babel/preset-env": "^7.18.6",
    "@babel/runtime": "^7.19.4",
    "@babel/runtime-corejs3": "^7.17.9",
    "@ckeditor/ckeditor5-alignment": "^41.1.0",
    "@ckeditor/ckeditor5-build-classic": "^41.1.0",
    "@ckeditor/ckeditor5-build-inline": "^41.1.0",
    "@ckeditor/ckeditor5-code-block": "^41.1.0",
    "@ckeditor/ckeditor5-dev-utils": "^39.2.0",
    "@ckeditor/ckeditor5-editor-balloon": "^41.1.0",
    "@ckeditor/ckeditor5-editor-decoupled": "^41.1.0",
    "@ckeditor/ckeditor5-editor-multi-root": "^41.1.0",
    "@ckeditor/ckeditor5-font": "^41.1.0",
    "@ckeditor/ckeditor5-html-embed": "^41.1.0",
    "@ckeditor/ckeditor5-html-support": "^41.1.0",
    "@ckeditor/ckeditor5-markdown-gfm": "^41.1.0",
    "@ckeditor/ckeditor5-source-editing": "^41.1.0",
    "@ckeditor/ckeditor5-theme-lark": "^41.1.0",
    "@ckeditor/ckeditor5-vue": "^5.1.0",
    "@vitejs/plugin-vue": "^5.0.4",
    "@vue/babel-helper-vue-jsx-merge-props": "^1.2.1",
    "@vue/babel-preset-jsx": "^1.2.4",
    "@vue/compiler-sfc": "^3.2.31",
    "babel-loader": "^8.2.3",
    "css-loader": "^6.5.1",
    dotenv: "^16.3.1",
    "dotenv-expand": "^10.0.0",
    easescript: "latest",
    "easescript-cli": "latest",
    "element-plus": "^2.4.1",
    "es-loader": "latest",
    "file-loader": "^6.2.0",
    "html-webpack-plugin": "^5.5.0",
    i18n: "^0.15.1",
    jasmine: "^3.10.0",
    "jasmine-es6": "^0.4.3",
    karma: "^6.3.9",
    "karma-chrome-launcher": "^3.1.0",
    "karma-cli": "^2.0.0",
    "karma-coverage": "^2.1.0",
    "karma-jasmine": "^4.0.1",
    "karma-webpack": "^5.0.0",
    "less-loader": "^11.1.3",
    "mini-css-extract-plugin": "^2.4.5",
    npm: "^10.2.1",
    pinia: "^2.1.7",
    "postcss-loader": "^7.3.3",
    "raw-loader": "^4.0.2",
    requirejs: "^2.3.6",
    sass: "^1.57.1",
    "sass-loader": "^13.2.0",
    "style-loader": "^3.3.1",
    "url-loader": "^4.1.1",
    vue: "^3.2.40",
    "vue-i18n": "^9.8.0",
    "vue-loader": "^17.0.0",
    "vue-router": "^4.1.5",
    "vue-template-compiler": "^2.7.14",
    webpack: "^5.65.0",
    "webpack-cli": "^4.9.1",
    "webpack-dev-server": "^4.6.0"
  },
  esconfig: {
    scope: "es-vue",
    typings: [
      "dist/types/web/components",
      "dist/types/web/events",
      "dist/types/web/Application.d.es",
      "dist/types/web/Store.es",
      "dist/types/web/Lang.es",
      "dist/types/hmr.d.es",
      "dist/types/vue.d.es"
    ],
    inherits: [
      "es-javascript"
    ]
  }
};

// lib/index.js
var defaultConfig2 = {
  crossDependenciesCheck: true,
  hmrHandler: "module.hot",
  ssr: false,
  pageDir: "pages",
  localeDir: "locales",
  pageExcludeRegular: null,
  projectConfigFile: ".env",
  webpack: {
    enable: false,
    inlineStyleLoader: []
  },
  resolve: {
    imports: {},
    folders: {}
  },
  metadata: {
    platform: "client",
    versions: {
      vue: "3.0.0"
    }
  },
  ui: {
    fully: false,
    //none sass css
    style: "sass",
    //esm cjs
    module: "cjs"
  },
  vue: {
    optimize: true,
    makeOptions: {
      file: false,
      ssrContext: true,
      vccOpts: false,
      asyncSetup: {
        mode: "none",
        //none ssr nossr all,
        filter: null
      }
    },
    scopePrefix: "data-v-",
    exposes: {
      globals: ["Math", "Date"],
      exposeFilter: (name) => !["window", "document"].includes(name)
    }
  },
  importSourceQuery: {
    enabled: false,
    test: null,
    types: ["component", "styles"],
    query: {
      vue: ""
    }
  }
};
function plugin(options = {}) {
  return new Plugin_default2(
    package_default.esconfig.scope,
    package_default.version,
    getOptions2(options)
  );
}
function getOptions2(...options) {
  return getOptions(defaultConfig2, ...options);
}
var lib_default = plugin;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Plugin,
  getOptions
});
