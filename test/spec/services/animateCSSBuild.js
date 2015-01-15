'use strict';

describe('Service: animateCSSBuild', function () {

  // load the service's module
  beforeEach(module('ngAnimate-animate.css'));

  // instantiate service
  var animateCSSBuild;
  beforeEach(inject(function (_animateCSSBuild_) {
    animateCSSBuild = _animateCSSBuild_;
  }));

  it('should do something', function () {
    expect(!!animateCSSBuild).toBe(true);
  });

});
