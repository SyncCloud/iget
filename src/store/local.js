'use strict';

import fs from 'fs';
import debug from 'debug';

const log = debug('iget:store:local');

class LocalStore {

    constructor({file, debug=false}) {
        this._checkFile(file);
        this._debug = debug;
        this._file = file;
        this.update();
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

    dic(lang, str) {
        if (!str) {
            return this.dic('en', arguments[0]);
        } else {
            return this._data[`${lang}_${str}`] || {};
        }
    }

    /**
     * Возвращает перевод строки
     * @param fromLang Язык строки-источника
     * @param fromStr Строка для перевода
     * @param toLang Язык перевода
     */
    get(fromLang, fromStr, toLang) {
        if (arguments.length !== 3) {
            throw new Error('must call with 3 arguments');
        }
        return this.dic(fromLang, fromStr)[toLang] || fromStr;
    }
}

export default LocalStore;