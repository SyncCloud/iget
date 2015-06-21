'use strict';

import $url from 'url';
import $q from 'bluebird';
import debug from 'debug';

const request = $q.promisify(require('request'));
const log = debug('iget:api');

export default function(options) {
    return new Client(options);
}

class Client {
    constructor({url, project}) {
        if (!url || !project) {
            throw new Error('url or project must be defined');
        }
        this.configure({url, project});
    }
    configure({url, project}) {
        if (url) {
            this._baseUrl = url;
        }
        if (project) {
            this._project = project;
        }
    }
    push (data) {
        const url = $url.resolve(this._baseUrl, `/api/items/${this._project}`);
        log(`pushing to ${url}`, data);
        return request({
            method: 'POST',
            url,
            json: true,
            auth: {
                user: 'api',
                pass: ' '
            },
            body: data
        }).get(1).then((data) => {
            log(`returned from POST ${url} `, data);
            return data;
        });
    }

    pull() {
        const url = $url.resolve(this._baseUrl, `/api/items/${this._project}`);
        log(`pulling from ${url}`);
        return request({
            url,
            json: true,
            auth: {
                user: 'api',
                pass: ' '
            }
        }).get(1).then((data) => {
            log(`returned from GET ${url} `, data);
            return data;
        });
    }
}

