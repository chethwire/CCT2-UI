'use strict';

describe('Filter: strToDate', function () {

  // load the filter's module
  beforeEach(module('clientApp'));

  // initialize a new instance of the filter before each test
  var strToDate;
  beforeEach(inject(function ($filter) {
    strToDate = $filter('strToDate');
  }));

  it('should return the input prefixed with "strToDate filter:"', function () {
    var text = 'angularjs';
    expect(strToDate(text)).toBe('strToDate filter: ' + text);
  });

});
