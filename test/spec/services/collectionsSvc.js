'use strict';

describe('Service: collectionsSvc', function () {

  // load the service's module
  beforeEach(module('services.collections'));

  // instantiate service
  var Collectionssvc;
  beforeEach(inject(function (_Collectionssvc_) {
      Collectionssvc = _Collectionssvc_;
  }));

  it('should do something', function () {
    expect(!!Collectionssvc).toBe(true);
  });

});
