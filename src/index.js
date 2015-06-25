'use strict';

import {LocalStore, RemoteStore} from './store';

class Translator {
    constructor({store, locales=[], lang='en'}) {
        this._store = store;
        this._resultLang = lang;
        this.extendTranslateMethods(locales);
    }

    extendTranslateMethods(locales) {
        this.translate = this.translate.bind(this);
        this.translate._store = this._store; //for test purposes
        locales.forEach((lang) => {
            this.translate[lang] = (...args) => {
                return this.translate.apply(this, [lang].concat(args))
            };
        });
        //immutable
        this.translate.lang = (toLang) => {
            return new Translator({store: this._store, lang: toLang, locales}).translate;
        }
    }
    translate(strLang, str) {
        if (arguments.length == 1) {
            str = strLang;
            strLang = 'en';
        }
        return this._store.get(strLang, str, this._resultLang);
    }
}

const STORE_CACHE = {};

export default function({store, file, url, project, locales=['en', 'ru'], lang='en'}) {
    if (!store && file) {
        store = new LocalStore({file});
    } else if (!store && url && project) {
        if (STORE_CACHE[url+project]) {
            store = STORE_CACHE[url+project];
        } else {
            store = new RemoteStore({url, project});
            STORE_CACHE[url+project] = store;
        }
    } else if (!store) {
        throw new Error('store should be defined or file/url parameter')
    }

    const tr = new Translator({locales, lang, store});

    if (store.fetched && store.fetched.then) {
        return store.fetched
            .then(() => {
                return tr.translate;
            });
    } else {
        return Promise.resolve(tr.translate);
    }

}