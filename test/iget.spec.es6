import {local, remote} from '../src/iget';
import path from 'path';
import Client from '../src/remote-client';
import sinon from 'sinon';

describe('iget', function () {
    const dic = require('./dic');

    it('should switch between langs', async function() {
        let iget = await local({file: path.join(__dirname, 'dic.json'), languages: ['ru', 'en', 'de']});
        expect(iget.ru('Привет')).to.equal('Hi');
        expect(iget('Cancel')).to.equal('Cancel');
        iget = iget.lang('ru'); //immutable
        expect(iget.ru('Привет')).to.equal('Привет');
        expect(iget('Cancel')).to.equal('Отмена');
    });

    it('should use default strings lang', async function() {
        let iget = await local({file: path.join(__dirname, 'dic.json'), defaultKeysLanguage: 'ru', languages: ['ru', 'en', 'de']});

        expect(iget('Привет')).to.equal('Hi');
        expect(iget.en('Cancel')).to.equal('Cancel');
        iget = iget.lang('ru'); //immutable
        expect(iget('Привет')).to.equal('Привет');
        expect(iget.en('Cancel')).to.equal('Отмена');
        iget = iget.lang('de'); //immutable
        expect(iget('Привет')).to.equal('Hallo');
    });

    it('should support formatting', async function() {
        let iget = await local({file: path.join(__dirname, 'dic.json'), languages: ['ru', 'en']});

        expect(iget.ru('Привет, %s', 'Nick')).to.equal('Hi, Nick');
    });

    describe('remote store', function() {
        const host = 'http://localhost:3000';
        const project = 'iget-tests';

        sinon.stub(require('request'), 'get')
            .yields(null, null, [{
                key: 'Hi',
                keyLocale: 'en',
                translations: {
                    'en': 'Hi',
                    'ru': 'Привет'
                }
            }]);

        it('should tranlate Hi to Hi', async function() {
            const iget = await remote({host, project});

            expect(iget('Hi')).to.equal('Hi');
        });
    });
});
