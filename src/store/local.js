'use strict';

import fs from 'fs';
import debug from 'debug';
import Store from './base';

const log = debug('iget:store:local');

class LocalStore extends Store {

    constructor({file, debug=false}) {
        super();
        this._checkFile(file);
        this._debug = debug;
        this._file = file;
        this.fetched = this.update();
        log(`created in ${debug?'debug':'production'} mode with file ${file}`);
    }

    _checkFile(file) {
        if (!fs.existsSync(file)) {
            throw Error(`Localization file not found on ${file}`)
        }
    }

    update(file) {
        if (file) {
            this._checkFile(file);
            this._file = file;
        }

        if (this._debug) {
            this._data = JSON.parse(fs.readFileSync(this._file, 'utf8'));
        } else {
            this._data = require(this._file);
        }
        log(`loaded locales from ${this._file} `, this._data);
    }
}

export default LocalStore;