'use strict';

describe('Service: httpRequestTracker', function () {

  // load the service's module
  beforeEach(module('cctuiApp'));

  // instantiate service
  var httpRequestTracker;
  beforeEach(inject(function (_httpRequestTracker_) {
    httpRequestTracker = _httpRequestTracker_;
  }));

  it('should do something', function () {
    expect(!!httpRequestTracker).toBe(true);
  });

});
