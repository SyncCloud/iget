'use strict';

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Object$defineProperty = require('babel-runtime/core-js/object/define-property')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

_Object$defineProperty(exports, '__esModule', {
    value: true
});

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var request = _bluebird2['default'].promisify(require('request'));
var log = (0, _debug2['default'])('iget:api');

exports['default'] = function (options) {
    return new Client(options);
};

var Client = (function () {
    function Client(_ref) {
        var url = _ref.url;
        var project = _ref.project;

        _classCallCheck(this, Client);

        if (!url || !project) {
            throw new Error('url or project must be defined');
        }
        this.configure({ url: url, project: project });
    }

    _createClass(Client, [{
        key: 'configure',
        value: function configure(_ref2) {
            var url = _ref2.url;
            var project = _ref2.project;

            if (url) {
                this._baseUrl = url;
            }
            if (project) {
                this._project = project;
            }
        }
    }, {
        key: 'push',
        value: function push(data) {
            var url = _url2['default'].resolve(this._baseUrl, '/api/items/' + this._project);
            log('pushing to ' + url, data);
            return request({
                method: 'POST',
                url: url,
                json: true,
                auth: {
                    user: 'api',
                    pass: ' '
                },
                body: data
            }).get(1).then(function (data) {
                log('returned from POST ' + url + ' ', data);
                return data;
            });
        }
    }, {
        key: 'pull',
        value: function pull() {
            var url = _url2['default'].resolve(this._baseUrl, '/api/items/' + this._project);
            log('pulling from ' + url);
            return request({
                url: url,
                json: true,
                auth: {
                    user: 'api',
                    pass: ' '
                }
            }).get(1).then(function (data) {
                log('returned from GET ' + url + ' ', data);
                return data;
            });
        }
    }]);

    return Client;
})();

module.exports = exports['default'];