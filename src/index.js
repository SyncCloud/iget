'use strict';

import {LocalStore, RemoteStore} from './store/index';
import {vsprintf} from 'sprintf';

const STORE_CACHE = {};

export default function({store, file, url, project, stringsLang, locales=['en', 'ru'], lang='en'}) {
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

    const translate = translator({locales, lang, store, stringsLang});

    if (store.fetched && store.fetched.then) {
        return store.fetched
            .then(() => {
                return translate;
            });
    } else {
        return Promise.resolve(translate);
    }
}

function translator({store, locales=[], lang='en', stringsLang='en'}) {
    let fn = translate.bind(this, stringsLang);

    //fill with language extensions .en, .de and etc
    locales.forEach((lang) => {
        fn[lang] = (...args) => {
            return translate.apply(this, [lang].concat(args))
        };
    });

    fn._store = store; //for test purposes

    //switch translation language is IMMUTABLE
    fn.lang = (toLang) => {
        return translator({store, lang: toLang, locales, stringsLang});
    };

    return fn;

    function translate(strLang, str) {
        const translated = store.get(strLang, str, lang);
        if (arguments.length > 2) {
            const args = new Array(arguments.length - 2);

            for (var i = 0; i < arguments.length - 2; i++) {
                args[i] = arguments[i + 2];
            }

            return vsprintf(translated, args)
        } else {
            return translated;
        }
    }


}