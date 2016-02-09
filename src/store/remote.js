import Client from '../remote-client';
import Store from './base';

class RemoteStore extends Store {
  constructor(options) {
    super();
    this._client = new Client(options);
  }

  async _prepareAsync() {
    await this._fillFromServerAsync();
  }

  async _fillFromServerAsync() {
    const items = await this._client.pull();
    this._data = {};
    for (let item of items) {
      this._data[item.keyLocale + '_' + item.key] = item.translations;
    }
  }
}

export default RemoteStore;