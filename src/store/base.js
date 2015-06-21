'use strict';

export default class Store {
    constructor({data}={}) {
        this._data = data || {};
    }
    update({data}={}) {
        this._data = data;
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