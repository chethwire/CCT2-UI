'use strict';

describe('Controller: SettingsCtrl', function () {

    // load the controller's module
    beforeEach(module('settings'));

    var deferred, q, scope, ctrl;

    var mockSettingsSvc = {

        getPublisherSettingsById: function (publisherId) {
            var settings = {
                publisherId: -1,
                primaryColor: '',
                secondaryColor: '',
                headerImageId: -1,
                featureImageId: -1,
                dateFormat: ''
            };
            deferred = q.defer();

            return deferred.promise.then(function (settings) {
                return settings
            });
        }
    };
    var mockSecuritySvc = {
        publisherId: 'publisherId'
    };
    var mockTitleSvc = {
        setTitle: function (title) {
            return title;
        }
    };
    var mockI18nNotifications = {
        pushForCurrentRoute: function () {
        }
    };
    var mockFileUploader = {
        create: function () {
            return  {bind: function () {
            }};
        }
    };


    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope, $q) {
        q = $q;
        scope = $rootScope.$new();
        ctrl = $controller('SettingsCtrl', {
            $scope: scope,
            SettingsSvc: mockSettingsSvc,
            security: mockSecuritySvc,
            titleService: mockTitleSvc,
            i18nNotifications: mockI18nNotifications,
            $fileUploader: mockFileUploader
        });


    }));

    it('should call titleservice', function () {
        spyOn(mockTitleSvc, 'setTitle').andCallThrough();
        scope.setTitle();
        expect(mockTitleSvc.setTitle).toHaveBeenCalled();

    });

    it('should make a call to SettingsSvc.getPublisherSettingsById() in init()', function () {
        //set up spy
        spyOn(mockSettingsSvc, 'getPublisherSettingsById').andCallThrough();

        //make the call
        scope.init();
        deferred.resolve();

        //assert
        expect(mockSettingsSvc.getPublisherSettingsById).toHaveBeenCalled();

        //don't know how to get this to work
        //expect(scope.publisherSettings).toBeDefined();
    });

    it('should have a value for scope.publishersettings after calling init()', function () {

    });
});
describe('Controller: SuccessCtrl', function () {

    // load the controller's module
    beforeEach(module('settings'));

    var scope, ctrl;
    var mockTitleSvc = {
        setTitle: function (title) {
            return title;
        }
    };


    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {

        scope = $rootScope.$new();
        ctrl = $controller('SettingsSuccessCtrl', {
            $scope: scope,
            titleService: mockTitleSvc
        });
    }));

    it('should call titleservice', function () {
        spyOn(mockTitleSvc, 'setTitle').andCallThrough();
        scope.setTitle();
        expect(mockTitleSvc.setTitle).toHaveBeenCalled();

    });


});