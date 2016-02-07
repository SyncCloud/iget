import {LocalStore, RemoteStore} from './store/index';
import {vsprintf} from 'sprintf';
import fs from 'fs';
import path from 'path';
import _ from 'lodash';

const STORE_CACHE = {};
/**
 *
 * @param store {Store} store for iget data (file, remote and etc)
 * @param file {String} path to file with iget data (local store)
 * @param server {Object} remote server configuration (remote store)
 * @param defaultKeysLanguage {String} language of iget string if no language was not specified directly
 * @param languages {Array} list of translation languages
 * @param lang {String} language of translated string
 * @returns {Promise}
 */
export default function (options = {}) {
    const sideBySideOptions = searchForSidebysideConfig() || searchPackageJsonSection() || {};
    options = _.merge(options, sideBySideOptions);

    let {
        store,
        file,
        server,
        defaultKeysLanguage,
        languages=['en', 'ru'],
        lang='en',
        ...other
    } = options;

    if (!server) {
        server = {host: other.url, project: other.project};
    }

    if (!languages) {
        languages = other.locales;
    }

    if (!defaultKeysLanguage) {
        defaultKeysLanguage = other.stringsLang;
    }

    if (!store && file) {
        store = new LocalStore({file});
    } else if (!store && server.host && server.project) {
        if (STORE_CACHE[server.host + server.project]) {
            store = STORE_CACHE[server.host + server.project];
        } else {
            store = new RemoteStore(server);
            STORE_CACHE[server.host + server.project] = store;
        }
    } else if (!store) {
        throw new Error('store should be defined or file/url parameter')
    }

    const translate = translator({languages, lang, store, defaultKeysLanguage});

    if (store.fetched && store.fetched.then) {
        return store.fetched
            .then(() => {
                return translate;
            });
    } else {
        return Promise.resolve(translate);
    }
}

function translator({store, languages=[], lang='en', defaultKeysLanguage='en'}) {
    let fn = translate.bind(this, defaultKeysLanguage);

    //fill with language extensions .en, .de and etc
    languages.forEach((lang) => {
        fn[lang] = (...args) => {
            return translate.apply(this, [lang].concat(args))
        };
    });

    fn._store = store; //for test purposes

    //switch translation language is IMMUTABLE
    fn.lang = (toLang) => {
        return translator({store, lang: toLang, languages, defaultKeysLanguage});
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

const SIDEBYSIDE_CONFIG_NAME = '.iget';

function searchForSidebysideConfig() {
    const configPath = path.join(process.cwd(), SIDEBYSIDE_CONFIG_NAME);

    if (fs.existsSync(configPath)) {
        const content = fs.readFileSync(configPath);
        try {
            return JSON.parse(content);
        } catch (err) {
            throw new Error(`failed to parse ${configPath}: ${err.toString()}`);
        }
    }
}

function searchPackageJsonSection() {
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    if (fs.existsSync(packageJsonPath)) {
        return require(packageJsonPath).iget;
    }
}