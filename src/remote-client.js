import $url from 'url';
import B from 'bluebird';
import debug from 'debug';
import assert from 'assert';
import _ from 'lodash';

const request = B.promisifyAll(require('request'));
const log = debug('iget:api');

export default class Client {
  constructor({host, port = 80, auth, project}) {
    assert(host, '`host` is expected');
    assert(project, '`project` is expected');
    this.configure({host, auth, project});
  }

  configure({host, auth, project}) {
    if (auth !== undefined) {
      assert(_.isObject(auth), 'option `auth` should be an Object {user, password}')
    }

    if (_.isObject(auth)) {
      assert(auth.user, 'auth.user is expected');
      //assert(auth.password, 'auth.password is expected');
    }

    this._auth = auth;

    if (host) {
      this._baseUrl = host.match(/^http/) ? host : 'http://' + host;
    }

    if (project) {
      this._project = project;
    }
  }

  push(data) {
    const url = $url.resolve(this._baseUrl, `/api/items/${this._project}`);
    log(`pushing to ${url}`, data);
    return request.postAsync(url, {
      json: true,
      auth: this._auth,
      body: data
    }).get(1).then((data) => {
      log(`returned from POST ${url} `, data);
      return data;
    }).catch((err) => {
      log(`captured error in POST ${url} `, err);
      throw err;
    });
  }

  pull() {
    const url = $url.resolve(this._baseUrl, `/api/items/${this._project}`);
    log(`pulling from ${url}`);
    return request.getAsync(url, {
      json: true,
      auth: this._auth
    }).get(1).then((data) => {
      log(`returned from GET ${url} `, data);
      return data;
    }).catch((err) => {
      log(`captured error in GET ${url} `, err);
      throw err;
    });
  }
}

