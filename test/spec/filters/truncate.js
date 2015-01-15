'use strict';

describe('Filter: truncate', function () {

    // load the filter's module
    beforeEach(module('truncateFilters'));

    // initialize a new instance of the filter before each test
    var truncate;
    beforeEach(inject(function ($filter) {
        truncate = $filter('truncate');
    }));

    it('should return the input truncated to the specified length"', function () {
        //100 chars
        var text = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
        expect(truncate(text, 50).length).toBe(50);
    });
    it('should return the input truncated to the default length if length is not specified"', function () {
        //100 chars
        var text = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
        expect(truncate(text).length).toBe(10);
    });
    it('should return the input string if the length is less than the specified truncate length', function () {
        var nineChars = 'aaaaaaaaa';
        var elevenChars = 'aaaaaaaaaaa';
        expect(truncate(nineChars).length).toBe(9);
        expect(truncate(elevenChars, 20).length).toBe(11);
    });

});
