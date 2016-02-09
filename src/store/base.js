export default class Store {

    constructor({data}={}) {
        this._data = data || {};
    }

    dic(lang, str) {
        if (!str) {
            return this.dic('en', arguments[0]);
        } else {
            return this._data[`${lang}_${str}`] || {};
        }
    }

    async _prepareAsync() {

    }

    async prepareAsync() {
      await this._prepareAsync();
      this._prepared = true
    }

    /**
     * Возвращает перевод строки
     * @param sourceLang Язык строки-источника
     * @param str Строка для перевода
     * @param targetLang Язык перевода
     */
    get(sourceLang, str, targetLang) {
        if(!this._prepared) {
          throw new Error(`${this.constructor.name} is not prepared yet. call prepareAsync`);
        }
        if (arguments.length !== 3) {
            throw new Error('must call with 3 arguments');
        }
        return this.dic(sourceLang, str)[targetLang] || str;
    }
}