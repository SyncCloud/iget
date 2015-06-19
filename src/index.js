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

        locales.forEach((lang) => {
            this.translate[lang] = (...args) => {
                return this.translate.apply(this, [lang].concat(args))
            };
        });
        this.translate.lang = (toLang) => {
            this._resultLang = toLang;
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

export default function({store, file, url, locales=['en', 'ru']}={}) {
    if (!store && file) {
        store = new LocalStore({file});
    } else if (!store && url) {
        store = new LocalStore({file});
    } else if (!store) {
        throw new Error('store should be defined or file/url parameter')
    }

    const tr = new Translator({locales, store});

    return tr.translate;
}