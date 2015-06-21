'use strict';

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _get = require('babel-runtime/helpers/get')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Object$defineProperty = require('babel-runtime/core-js/object/define-property')['default'];

var _getIterator = require('babel-runtime/core-js/get-iterator')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

_Object$defineProperty(exports, '__esModule', {
    value: true
});

var _api = require('../api');

var _api2 = _interopRequireDefault(_api);

var _base = require('./base');

var _base2 = _interopRequireDefault(_base);

var RemoteStore = (function (_Store) {
    function RemoteStore() {
        var _ref = arguments[0] === undefined ? {} : arguments[0];

        var url = _ref.url;
        var project = _ref.project;

        _classCallCheck(this, RemoteStore);

        _get(Object.getPrototypeOf(RemoteStore.prototype), 'constructor', this).call(this);
        this._client = (0, _api2['default'])({ url: url, project: project });
        this.fetched = this.update();
    }

    _inherits(RemoteStore, _Store);

    _createClass(RemoteStore, [{
        key: 'update',
        value: function update() {
            var _this = this;

            var _ref2 = arguments[0] === undefined ? {} : arguments[0];

            var url = _ref2.url;
            var project = _ref2.project;

            this._client.configure({ url: url, project: project });
            return this._client.pull().then(function (items) {
                _this._data = {};
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = _getIterator(items), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var item = _step.value;

                        _this._data[item.keyLocale + '_' + item.key] = item.translations;
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator['return']) {
                            _iterator['return']();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
            });
        }
    }, {
        key: 'get',
        value: function get(fromLang, fromStr, toLang) {
            return _get(Object.getPrototypeOf(RemoteStore.prototype), 'get', this).apply(this, arguments);
        }
    }]);

    return RemoteStore;
})(_base2['default']);

exports['default'] = RemoteStore;
module.exports = exports['default'];