'use strict';

import i18n from '../src/index';
import path from 'path';

describe('iget', function () {
    const dic = require('./dic');

    it('should switch between langs', function *() {
        const iget = i18n({file: path.join(__dirname, 'dic.json')});

        expect(iget.ru('Привет')).to.equal('Hi');
        expect(iget('Cancel')).to.equal('Cancel');
        iget.lang('ru');
        expect(iget.ru('Привет')).to.equal('Привет');
        expect(iget('Cancel')).to.equal('Отмена');

    });

    it('should fail init without store', function *() {

    });

    it('should init with custom store', function*() {

    });

});