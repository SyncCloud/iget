# iget
Client for internal i18n project. Widely used in templates

## Usage

### From code
```js

// initialize a translator from a i18n dictionary file with translate languate
const iget = await require('iget')({
 file: path.join(__dirname, 'dic.json'),
 lang: 'de'
});

// get localized string in your template like this
iget('Hello') // output: 'Hallo'

// You can specify a language of a key explictly
iget.de('Hallo')

// change translation language (NOTE: this operation is immutable)
const igetDe = iget.lang('en')

// will translate to English now, but `iget` variable works as previously
igetDe('Hallo') // output: 'Hello'
```

### Collect all strings in a project
```
gulp locale-push
```
Will send to an i18n server all strings you have used inside `iget(*)` expressions. See [gulp-iget](https://github.com/SyncCloud/gulp-iget) project for more info
### Make translations in UI
Coming soon... 

### Check translations before release
```
gulp locale-check
```
Will check if there are untranslated strings and fail. Looks at `languages: ['en', 'de']` option for tranlation check
