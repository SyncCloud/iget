'use strict';

import i18n from '../src/index';
import path from 'path';
import api from '../src/api';

describe('iget', function () {
    const dic = require('./dic');

    it('should switch between langs', function *() {
        let iget = yield i18n({file: path.join(__dirname, 'dic.json')});

        expect(iget.ru('Привет')).to.equal('Hi');
        expect(iget('Cancel')).to.equal('Cancel');
        iget = iget.lang('ru'); //immutable
        expect(iget.ru('Привет')).to.equal('Привет');
        expect(iget('Cancel')).to.equal('Отмена');
    });

    describe('remote store', function() {
        const url = 'http://localhost:3000';
        const project = 'iget-tests';

        before(function *() {
            yield api({url, project}).push({
                en: {
                    'Hi': {}
                }
            });
        });

        it('should tranlate Hi to Hi', function *() {
            const iget = yield i18n({url, project});

            expect(iget('Hi')).to.equal('Hi');
        });

        it('should reuse stores with same url&project', function *() {
            const iget1 = yield i18n({url, project});
            const iget2 = yield i18n({url, project});
        	assert(iget1._store === iget2._store, 'stores instances must be the same')
        });

    });

    it('should fail init without store', function *() {

    });

    it('should init with custom store', function *() {

    });
});