'use strict';

var _Object$defineProperty = require('babel-runtime/core-js/object/define-property')['default'];

var _Promise = require('babel-runtime/core-js/promise')['default'];

_Object$defineProperty(exports, '__esModule', {
    value: true
});

var _storeIndex = require('./store/index');

var _sprintf = require('sprintf');

var STORE_CACHE = {};

exports['default'] = function (_ref) {
    var store = _ref.store;
    var file = _ref.file;
    var url = _ref.url;
    var project = _ref.project;
    var stringsLang = _ref.stringsLang;
    var _ref$locales = _ref.locales;
    var locales = _ref$locales === undefined ? ['en', 'ru'] : _ref$locales;
    var _ref$lang = _ref.lang;
    var lang = _ref$lang === undefined ? 'en' : _ref$lang;

    if (!store && file) {
        store = new _storeIndex.LocalStore({ file: file });
    } else if (!store && url && project) {
        if (STORE_CACHE[url + project]) {
            store = STORE_CACHE[url + project];
        } else {
            store = new _storeIndex.RemoteStore({ url: url, project: project });
            STORE_CACHE[url + project] = store;
        }
    } else if (!store) {
        throw new Error('store should be defined or file/url parameter');
    }

    var translate = translator({ locales: locales, lang: lang, store: store, stringsLang: stringsLang });

    if (store.fetched && store.fetched.then) {
        return store.fetched.then(function () {
            return translate;
        });
    } else {
        return _Promise.resolve(translate);
    }
};

function translator(_ref2) {
    var _this = this;

    var store = _ref2.store;
    var _ref2$locales = _ref2.locales;
    var locales = _ref2$locales === undefined ? [] : _ref2$locales;
    var _ref2$lang = _ref2.lang;
    var lang = _ref2$lang === undefined ? 'en' : _ref2$lang;
    var _ref2$stringsLang = _ref2.stringsLang;
    var stringsLang = _ref2$stringsLang === undefined ? 'en' : _ref2$stringsLang;

    var fn = translate.bind(this, stringsLang);

    //fill with language extensions .en, .de and etc
    locales.forEach(function (lang) {
        fn[lang] = function () {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            return translate.apply(_this, [lang].concat(args));
        };
    });

    fn._store = store; //for test purposes

    //switch translation language is IMMUTABLE
    fn.lang = function (toLang) {
        return translator({ store: store, lang: toLang, locales: locales, stringsLang: stringsLang });
    };

    return fn;

    function translate(strLang, str) {
        var translated = store.get(strLang, str, lang);
        if (arguments.length > 2) {
            var args = new Array(arguments.length - 2);

            for (var i = 0; i < arguments.length - 2; i++) {
                args[i] = arguments[i + 2];
            }

            return (0, _sprintf.vsprintf)(translated, args);
        } else {
            return translated;
        }
    }
}
module.exports = exports['default'];