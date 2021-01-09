(function(e, a) { for(var i in a) e[i] = a[i]; if(a.__esModule) Object.defineProperty(e, "__esModule", { value: true }); }(exports,
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.activate = void 0;
const coc_nvim_1 = __webpack_require__(1);
const lists_1 = __importDefault(__webpack_require__(2));
async function activate(context) {
    coc_nvim_1.window.showMessage(`coc-finder works!`);
    context.subscriptions.push(coc_nvim_1.commands.registerCommand('coc-finder.Command', async () => {
        coc_nvim_1.window.showMessage(`coc-finder Commands works!`);
    }), coc_nvim_1.listManager.registerList(new lists_1.default(coc_nvim_1.workspace.nvim)), coc_nvim_1.sources.createSource({
        name: 'coc-finder completion source',
        doComplete: async () => {
            const items = await getCompletionItems();
            return items;
        },
    }), coc_nvim_1.workspace.registerKeymap(['n'], 'finder-keymap', async () => {
        coc_nvim_1.window.showMessage(`registerKeymap`);
    }, { sync: false }), coc_nvim_1.workspace.registerAutocmd({
        event: 'InsertLeave',
        request: true,
        callback: () => {
            coc_nvim_1.window.showMessage(`registerAutocmd on InsertLeave`);
        },
    }));
}
exports.activate = activate;
async function getCompletionItems() {
    return {
        items: [
            {
                word: 'TestCompletionItem 1',
                menu: '[coc-finder]',
            },
            {
                word: 'TestCompletionItem 2',
                menu: '[coc-finder]',
            },
        ],
    };
}


/***/ }),
/* 1 */
/***/ ((module) => {

module.exports = require("coc.nvim");;

/***/ }),
/* 2 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const coc_nvim_1 = __webpack_require__(1);
class DemoList extends coc_nvim_1.BasicList {
    constructor(nvim) {
        super(nvim);
        this.name = 'demo_list';
        this.description = 'CocList for coc-finder';
        this.defaultAction = 'open';
        this.actions = [];
        const preferences = coc_nvim_1.workspace.getConfiguration('coc.preferences');
        let jumpCommand = preferences.get('jumpCommand', 'open');
        this.addAction('open', async (item) => {
            coc_nvim_1.window.showMessage(`${item.label}, ${item.data.name}`);
            let fullpath = item.data.location;
            await coc_nvim_1.workspace.jumpTo(coc_nvim_1.Uri.file(fullpath).toString(), null, jumpCommand);
        });
    }
    async loadItems(context) {
        return [
            {
                label: 'coc-finder list item 1',
                data: {
                    location: 'C:\\Users\\admin\\ppData\\Local\\nvim\\autoload\\materia\\common\\options.vim'
                },
            },
            {
                label: 'coc-finder list item 2',
                data: {
                    location: 'C:\\Users\\admin\\ppData\\Local\\nvim\\autoload\\materia\\common\\commands.vim'
                },
            },
        ];
    }
}
exports.default = DemoList;


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	// module exports must be returned from runtime so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })()

));