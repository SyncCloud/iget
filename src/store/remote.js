'use strict';

import api from '../api';
import Store from './base';

class RemoteStore extends Store {
    constructor({url, project}={}) {
        super();
        this._client = api({url, project});
        this.fetched = this.update();
    }
    update({url, project}={}) {
        this._client.configure({url, project});
        return this._client.pull().then((items)=>{
            this._data = {};
            for (let item of items) {
                this._data[item.keyLocale + '_' +item.key] = item.translations;
            }
        })
    }
    get(fromLang, fromStr, toLang) {
        return super.get.apply(this, arguments);
    }
}

export default RemoteStore;