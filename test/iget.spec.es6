import i18n from '../src/index';
import path from 'path';
import api from '../src/api';

describe('iget', function () {
    const dic = require('./dic');

    it('should switch between langs', async function() {
        let iget = await i18n({file: path.join(__dirname, 'dic.json')});

        expect(iget.ru('Привет')).to.equal('Hi');
        expect(iget('Cancel')).to.equal('Cancel');
        iget = iget.lang('ru'); //immutable
        expect(iget.ru('Привет')).to.equal('Привет');
        expect(iget('Cancel')).to.equal('Отмена');
    });

    it('should use default strings lang', async function() {
        let iget = await i18n({file: path.join(__dirname, 'dic.json'), stringsLang: 'ru', locales: ['ru', 'en', 'de']});

        expect(iget('Привет')).to.equal('Hi');
        expect(iget.en('Cancel')).to.equal('Cancel');
        iget = iget.lang('ru'); //immutable
        expect(iget('Привет')).to.equal('Привет');
        expect(iget.en('Cancel')).to.equal('Отмена');
        iget = iget.lang('de'); //immutable
        expect(iget('Привет')).to.equal('Hallo');
    });

    it('should support formatting', async function() {
        let iget = await i18n({file: path.join(__dirname, 'dic.json')});

        expect(iget.ru('Привет, %s', 'Nick')).to.equal('Hi, Nick');
    });

    describe.skip('remote store', function() {
        const host = 'http://localhost:3000';
        const project = 'iget-tests';

        before(async function() {
            await api({host, project}).push({
                en: {
                    'Hi': {}
                }
            });
        });

        it('should tranlate Hi to Hi', async function() {
            const iget = await i18n({host, project});

            expect(iget('Hi')).to.equal('Hi');
        });

        it('should reuse stores with same url&project', async function() {
            const iget1 = await i18n({host, project});
            const iget2 = await i18n({host, project});
        	assert(iget1._store === iget2._store, 'stores instances must be the same')
        });

    });

    it('should fail init without store', async function() {

    });

    it('should init with custom store', async function() {

    });
});
