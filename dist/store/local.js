'use strict';

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _get = require('babel-runtime/helpers/get')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Object$defineProperty = require('babel-runtime/core-js/object/define-property')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

_Object$defineProperty(exports, '__esModule', {
    value: true
});

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _base = require('./base');

var _base2 = _interopRequireDefault(_base);

var log = (0, _debug2['default'])('iget:store:local');

var LocalStore = (function (_Store) {
    function LocalStore(_ref) {
        var file = _ref.file;
        var _ref$debug = _ref.debug;
        var debug = _ref$debug === undefined ? false : _ref$debug;

        _classCallCheck(this, LocalStore);

        _get(Object.getPrototypeOf(LocalStore.prototype), 'constructor', this).call(this);
        this._checkFile(file);
        this._debug = debug;
        this._file = file;
        this.fetched = this.update();
        log('created in ' + (debug ? 'debug' : 'production') + ' mode with file ' + file);
    }

    _inherits(LocalStore, _Store);

    _createClass(LocalStore, [{
        key: '_checkFile',
        value: function _checkFile(file) {
            if (!_fs2['default'].existsSync(file)) {
                throw Error('Localization file not found on ' + file);
            }
        }
    }, {
        key: 'update',
        value: function update(file) {
            if (file) {
                this._checkFile(file);
                this._file = file;
            }

            if (this._debug) {
                this._data = JSON.parse(_fs2['default'].readFileSync(this._file, 'utf8'));
            } else {
                this._data = require(this._file);
            }
            log('loaded locales from ' + this._file + ' ', this._data);
        }
    }]);

    return LocalStore;
})(_base2['default']);

exports['default'] = LocalStore;
module.exports = exports['default'];