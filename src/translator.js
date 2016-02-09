import {vsprintf} from 'sprintf';

export default function translator({store, languages=[], lang='en', defaultKeysLanguage='en'}) {
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