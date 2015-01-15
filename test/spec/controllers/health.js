'use strict';

describe('Controller: HealthCtrl', function () {

    // load the controller's module
    beforeEach(module('cctuiApp'));

    var HealthCtrl, createController,
        $rootScope, $httpBackend;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($injector) {

        // Set up the mock http service responses
        $httpBackend = $injector.get('$httpBackend');


        // Get hold of a scope (ie the root scope)
        $rootScope = $injector.get('$rootScope');
        // The $controller service is used to create instances of controllers
        var $controller = $injector.get('$controller');

        createController = function () {
            return $controller('HealthCtrl', {'$scope': $rootScope});
        }

    }));

    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it('should call getFile service and return ITSALLGOOD if successful', function () {
        var controller = createController();
        $httpBackend.expect('GET', '/svc/getfile?fileId=0&publisherId=doesntmatter')
            .respond({
                "success": true
            });

        $rootScope.$apply();
        $httpBackend.flush();
        expect($rootScope.status).toBe('ITSALLGOOD');


    });
    it('should call getFile service and return THINGSDONTLOOKSOGOOD if not successful', function () {
        var controller = createController();
        $httpBackend.expect('GET', '/svc/getfile?fileId=0&publisherId=doesntmatter')
            .respond(500);

        $rootScope.$apply();
        $httpBackend.flush();
        expect($rootScope.status).toContain('THINGSDONTLOOKSOGOOD');
    });
});
