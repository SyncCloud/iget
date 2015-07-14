'use strict';

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

Object.defineProperty(exports, '__esModule', {
    value: true
});

var Store = (function () {
    function Store() {
        var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

        var data = _ref.data;

        _classCallCheck(this, Store);

        this._data = data || {};
    }

    _createClass(Store, [{
        key: 'update',
        value: function update() {
            var _ref2 = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

            var data = _ref2.data;

            this._data = data;
        }
    }, {
        key: 'dic',
        value: function dic(lang, str) {
            if (!str) {
                return this.dic('en', arguments[0]);
            } else {
                return this._data[lang + '_' + str] || {};
            }
        }
    }, {
        key: 'get',

        /**
         * Возвращает перевод строки
         * @param fromLang Язык строки-источника
         * @param fromStr Строка для перевода
         * @param toLang Язык перевода
         */
        value: function get(fromLang, fromStr, toLang) {
            if (arguments.length !== 3) {
                throw new Error('must call with 3 arguments');
            }
            return this.dic(fromLang, fromStr)[toLang] || fromStr;
        }
    }]);

    return Store;
})();

exports['default'] = Store;
module.exports = exports['default'];