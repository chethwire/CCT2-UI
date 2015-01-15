'use strict';

describe('Directive: toolbar', function () {

    // load the directive's module
    beforeEach(module('security.login.toolbar','security'));


    var toolbar, $rootScope, security, scope, $compile, $httpBackend;

    beforeEach(inject(function (_$rootScope_, _$compile_, _security_, _$httpBackend_) {
        $rootScope = _$rootScope_;
        security = _security_;
        $compile = _$compile_;
        $httpBackend = _$httpBackend_;
        $templateCache.put('views/toolbar.html');

        toolbar = $compile('<login-toolbar></login-toolbar>')($rootScope);
        $rootScope.$digest();
        scope = toolbar.scope();
        angular.element(document.body).append(toolbar);

    }));

    afterEach(function () {
        toolbar.remove();
    });

    it('should attach stuff to the scope', inject(function () {

        expect(scope.currentUser).toBeDefined();
        expect(scope.isAuthenticated).toBe(security.isAuthenticated);
        expect(scope.login).toBe(security.redirectToLogin);
        expect(scope.logout).toBe(security.logout);
    }));

    it('should not be visible when user is not authenticated', function () {
        $rootScope.$digest();
        expect(toolbar.find('a:hidden').text()).toBe('Log out');

    });
    it('should display logout when user is authenticated', function () {
        security.currentUser = {};
        $rootScope.$digest();
        expect(toolbar.find('a:visible').text()).toBe('Log out');
        //expect(toolbar.find('button:hidden').text()).toBe('Log in');
    });
    it('should call logout when the logout button is clicked', function () {
        $httpBackend.whenGET('views/toolbar.html').respond('<div></div>');
        spyOn(scope, 'logout');
        toolbar.find('a.logout').click();
        expect(scope.logout).toHaveBeenCalled();
    });
});
