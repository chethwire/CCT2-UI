'use strict';

describe('Service: authorization', function () {

  // load the service's module
  beforeEach(module('security.authorization'));

  // instantiate service
  var securityAuthorization;
  beforeEach(inject(function (_securityAuthorization_) {
      securityAuthorization = _securityAuthorization_;
  }));

  it('should do something', function () {
    expect(!!securityAuthorization).toBe(true);
  });

});
