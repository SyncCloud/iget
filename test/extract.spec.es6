//TODO
//describe('iget regex', function () {
//    var extract = require('../lib/extract')({defaultLocale: 'ru'}),
//        str;
//
//    str = extract('sd \niget.en(\'"winter \\\'""is comming"\')\n sdfsd')[0];
//    expect(str).to.equal('en_"winter \'""is comming"');
//
//    str = extract("sd \n iget('отредактировал подзадачу %s', event.childTask.name)('sdfsd')(href='http://google.com')\n sdfs;\ndfsd")[0];
//    expect(str).to.equal('ru_отредактировал подзадачу %s');
//
//});
//
//describe('iget regex', function () {
//    var extract = require('../lib/extract')({defaultLocale: 'ru'});
//
//    it('should correctly extract string between quotes', function() {
//        var str;
//
//        str = extract('sd \niget.en(\'"winter \\\'""is comming"\')\n sdfsd')[0];
//        expect(str).to.equal('en_"winter \'""is comming"');
//
//        str = extract("sd \n iget('отредактировал подзадачу %s', event.childTask.name)('sdfsd')(href='http://google.com')\n sdfs;\ndfsd")[0];
//        expect(str).to.equal('ru_отредактировал подзадачу %s');
//    });
//
//
//    it('should ignore iget\'s without quotes', function () {
//        str = extract("await iget(this.options.iget)")[0];
//    });
//});