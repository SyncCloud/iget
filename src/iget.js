import _ from 'lodash';
import FileStore from './store/file';
import RemoteStore from './store/remote';
import config from './configuration';
import translator from './translator';
import Client from './remote-client';
import extract from './extract';
import assert from 'assert';

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
async function iget(options = {}) {
  options = _.merge({}, _.omit(iget.globalConfig, 'server', 'store'), options);

  let {
    store,
    defaultKeysLanguage,
    languages,
    lang,
    ...other
    } = options;

  assert(store, '`store` options is missing');
  assert(languages, '`languages` options is missing');
  assert(lang, '`lang` options is missing');
  assert(defaultKeysLanguage, '`defaultKeysLanguage` options is missing');

  const translate = translator({languages, lang, store, defaultKeysLanguage});

  await store.prepareAsync();

  return translate;
}

iget.extract = function(content, options = {}) {
  return extract(_.merge({defaultKeysLanguage: iget.globalConfig.defaultKeysLanguage}, options))(content);
};

iget.globalConfig = _.merge({}, config.defaults, config.fetchSideBySide() || config.fetchPackageJson());

iget.mergeGlobalConfig = function (conf = {}) {
  _.merge(iget.globalConfig, conf);
};

iget.setGlobalConfig = function (conf) {
  if (conf) {
    iget.globalConfig = conf;
  }
};

iget.local = async function ({file, debug, ...other} = {}) {
  assert(file, '`file` option is expected');

  const store = new FileStore({file, debug});

  return iget({store, ...other});
};

iget.remote = async function (options = {}) {
  const {host, port, project, ...other} = _.merge({}, iget.globalConfig.server || {}, options);
  assert(host, '`host` option is expected');
  assert(project, '`project` option is expected');

  const store = new RemoteStore({host, port, project});

  return iget({store, ...other});
};

iget.createRemoteClient = function (options) {
  options = _.merge({}, iget.globalConfig.server || {}, options);
  return new Client(_.pick(options, 'host', 'port', 'project', 'auth'));
};

export default iget;
