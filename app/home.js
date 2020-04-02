/******/ (function(modules) { // webpackBootstrap
/******/ 	// install a JSONP callback for chunk loading
/******/ 	function webpackJsonpCallback(data) {
/******/ 		var chunkIds = data[0];
/******/ 		var moreModules = data[1];
/******/ 		var executeModules = data[2];
/******/
/******/ 		// add "moreModules" to the modules object,
/******/ 		// then flag all "chunkIds" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0, resolves = [];
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(installedChunks[chunkId]) {
/******/ 				resolves.push(installedChunks[chunkId][0]);
/******/ 			}
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 		for(moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				modules[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(parentJsonpFunction) parentJsonpFunction(data);
/******/
/******/ 		while(resolves.length) {
/******/ 			resolves.shift()();
/******/ 		}
/******/
/******/ 		// add entry modules from loaded chunk to deferred list
/******/ 		deferredModules.push.apply(deferredModules, executeModules || []);
/******/
/******/ 		// run deferred modules when all chunks ready
/******/ 		return checkDeferredModules();
/******/ 	};
/******/ 	function checkDeferredModules() {
/******/ 		var result;
/******/ 		for(var i = 0; i < deferredModules.length; i++) {
/******/ 			var deferredModule = deferredModules[i];
/******/ 			var fulfilled = true;
/******/ 			for(var j = 1; j < deferredModule.length; j++) {
/******/ 				var depId = deferredModule[j];
/******/ 				if(installedChunks[depId] !== 0) fulfilled = false;
/******/ 			}
/******/ 			if(fulfilled) {
/******/ 				deferredModules.splice(i--, 1);
/******/ 				result = __webpack_require__(__webpack_require__.s = deferredModule[0]);
/******/ 			}
/******/ 		}
/******/ 		return result;
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// object to store loaded and loading chunks
/******/ 	// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 	// Promise = chunk loading, 0 = chunk loaded
/******/ 	var installedChunks = {
/******/ 		"app": 0
/******/ 	};
/******/
/******/ 	var deferredModules = [];
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	var jsonpArray = window["webpackJsonp"] = window["webpackJsonp"] || [];
/******/ 	var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
/******/ 	jsonpArray.push = webpackJsonpCallback;
/******/ 	jsonpArray = jsonpArray.slice();
/******/ 	for(var i = 0; i < jsonpArray.length; i++) webpackJsonpCallback(jsonpArray[i]);
/******/ 	var parentJsonpFunction = oldJsonpFunction;
/******/
/******/
/******/ 	// add entry module to deferred list
/******/ 	deferredModules.push([1,"vendors"]);
/******/ 	// run deferred modules when ready
/******/ 	return checkDeferredModules();
/******/ })
/************************************************************************/
/******/ ({

/***/ 1:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__("201c");
__webpack_require__("7NIr");
module.exports = __webpack_require__("LiWt");


/***/ }),

/***/ "LiWt":
/***/ (function(module, exports) {

throw new Error("Module build failed (from ./node_modules/babel-loader/lib/index.js):\nSyntaxError: /home/doubleface/Workspace/cozy-home/src/targets/browser/index.jsx: Unexpected token (80:4)\n\n\u001b[0m \u001b[90m 78 | \u001b[39m  \u001b[36mconst\u001b[39m \u001b[33mApp\u001b[39m \u001b[33m=\u001b[39m require(\u001b[32m'containers/App'\u001b[39m)\u001b[33m.\u001b[39m\u001b[36mdefault\u001b[39m\u001b[0m\n\u001b[0m \u001b[90m 79 | \u001b[39m  render(\u001b[0m\n\u001b[0m\u001b[31m\u001b[1m>\u001b[22m\u001b[39m\u001b[90m 80 | \u001b[39m    \u001b[33m<\u001b[39m\u001b[33mMostRecentCozyClientProvider\u001b[39m client\u001b[33m=\u001b[39m{cozyClient}\u001b[33m>\u001b[39m\u001b[0m\n\u001b[0m \u001b[90m    | \u001b[39m    \u001b[31m\u001b[1m^\u001b[22m\u001b[39m\u001b[0m\n\u001b[0m \u001b[90m 81 | \u001b[39m      \u001b[33m<\u001b[39m\u001b[33mCozyProvider\u001b[39m\u001b[0m\n\u001b[0m \u001b[90m 82 | \u001b[39m        store\u001b[33m=\u001b[39m{store}\u001b[0m\n\u001b[0m \u001b[90m 83 | \u001b[39m        client\u001b[33m=\u001b[39m{cozyClient}\u001b[0m\n    at Parser.raise (/home/doubleface/Workspace/cozy-home/node_modules/@babel/parser/lib/index.js:7013:17)\n    at Parser.unexpected (/home/doubleface/Workspace/cozy-home/node_modules/@babel/parser/lib/index.js:8384:16)\n    at Parser.parseExprAtom (/home/doubleface/Workspace/cozy-home/node_modules/@babel/parser/lib/index.js:9639:20)\n    at Parser.parseExprSubscripts (/home/doubleface/Workspace/cozy-home/node_modules/@babel/parser/lib/index.js:9219:23)\n    at Parser.parseMaybeUnary (/home/doubleface/Workspace/cozy-home/node_modules/@babel/parser/lib/index.js:9199:21)\n    at Parser.parseExprOps (/home/doubleface/Workspace/cozy-home/node_modules/@babel/parser/lib/index.js:9067:23)\n    at Parser.parseMaybeConditional (/home/doubleface/Workspace/cozy-home/node_modules/@babel/parser/lib/index.js:9040:23)\n    at Parser.parseMaybeAssign (/home/doubleface/Workspace/cozy-home/node_modules/@babel/parser/lib/index.js:9000:21)\n    at Parser.parseExprListItem (/home/doubleface/Workspace/cozy-home/node_modules/@babel/parser/lib/index.js:10295:18)\n    at Parser.parseCallExpressionArguments (/home/doubleface/Workspace/cozy-home/node_modules/@babel/parser/lib/index.js:9404:22)\n    at Parser.parseSubscript (/home/doubleface/Workspace/cozy-home/node_modules/@babel/parser/lib/index.js:9310:31)\n    at Parser.parseSubscripts (/home/doubleface/Workspace/cozy-home/node_modules/@babel/parser/lib/index.js:9240:19)\n    at Parser.parseExprSubscripts (/home/doubleface/Workspace/cozy-home/node_modules/@babel/parser/lib/index.js:9229:17)\n    at Parser.parseMaybeUnary (/home/doubleface/Workspace/cozy-home/node_modules/@babel/parser/lib/index.js:9199:21)\n    at Parser.parseExprOps (/home/doubleface/Workspace/cozy-home/node_modules/@babel/parser/lib/index.js:9067:23)\n    at Parser.parseMaybeConditional (/home/doubleface/Workspace/cozy-home/node_modules/@babel/parser/lib/index.js:9040:23)");

/***/ })

/******/ });
//# sourceMappingURL=home.js.map