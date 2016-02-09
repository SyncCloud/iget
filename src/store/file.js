import fs from 'fs';
import debug from 'debug';
import Store from './base';

const log = debug('iget:store:file');

export default class FileStore extends Store {

  constructor({file, debug=false}) {
    super();
    this._debug = debug;
    this._setSourceFile(file);
    log(`created in ${debug ? 'debug' : 'production'} mode with file ${file}`);
  }

  async _prepareAsync() {
    await this._fillFromFileAsync();
  }

  _checkFile(file) {
    if (!fs.existsSync(file)) {
      throw Error(`Localization file not found on ${file}`)
    }
  }

  _setSourceFile(file) {
    this._checkFile(file);
    this._file = file;
  }

  _fillFromFileAsync() {
    if (this._debug) {
      this._data = JSON.parse(fs.readFileSync(this._file, 'utf8'));
    } else {
      this._data = require(this._file);
    }

    log(`loaded locales from ${this._file} `, this._data);
  }
}

