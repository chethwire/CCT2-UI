'use strict';

describe('Service: fileUploader', function () {

  // load the service's module
  beforeEach(module('files'));

  // instantiate service
  var $fileUploader;
  beforeEach(inject(function (_$fileUploader_) {
      $fileUploader = _$fileUploader_;
  }));

  it('should do something', function () {
    expect(!!$fileUploader).toBe(true);
  });

});
