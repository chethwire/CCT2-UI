'use strict';

describe('Service: localizedMessages', function () {

  // load the service's module
  beforeEach(module('cctuiApp'));

  // instantiate service
  var localizedMessages;
  beforeEach(inject(function (_localizedMessages_) {
    localizedMessages = _localizedMessages_;
  }));

  it('should do something', function () {
    expect(!!localizedMessages).toBe(true);
  });

});
