'use strict';

describe('Controller: CollectionsCtrl', function () {

    // load the controller's module
    beforeEach(module('collections', 'cctuiApp'));


    var createController, Collectionssvc, userInfo, titleService, i18nNotifications, $q, scope, deferred, $httpBackend;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope, _$q_, _$httpBackend_) {
        scope = $rootScope.$new();
        $httpBackend = _$httpBackend_;

        $q = _$q_;

        i18nNotifications = {
            pushForCurrentRoute: function () {

            }
        };
        titleService = {
            setTitle: function (title) {
                return title;
            }
        };


        Collectionssvc = {
            collections: [
                {
                    collectionName: "collection1"
                }
            ],

            getCollections: function () {
                deferred = $q.defer();
                return deferred.promise;
            },
            getCollection: function () {
                return {};
            }
        };
        var params = {
            $scope: scope,
            titleService: titleService,
            i18nNotifications: i18nNotifications,
            Collectionssvc: Collectionssvc
        };
        createController = function () {
            return $controller('CollectionsCtrl', params)
        };
        userInfo = '<?xml version="1.0" encoding="UTF-8"?><ac:runtime-response xmlns:ac="http://schema.highwire.org/Access"><ac:authentication><ac:identity runtime-id="urn:ac.highwire.org:guest:identity" type="guest"><ac:privilege runtime-id="urn:ac.highwire.org:guest:privilege" type="privilege-set" privilege-set="GUEST" /><ac:credentials method="guest" /></ac:identity><ac:identity runtime-id="1e10999c-b8c8-4b8d-b37a-b4af4cc30db4" type="individual" user-id="664" subcode="aacrjnl_subdev" customer-number="TEAM" display-name="HighWire Home Team" email="jsalgado@highwire.stanford.edu"><ac:privilege runtime-id="6d4bfd43-c21e-424e-a92d-1e9056dfd598" type="subscription" user-id="664" status="ACTIVE" expiration="9999-12-31T23:59:59.999-08:00" privilege-set="BAACRCPC" /><ac:privilege runtime-id="8d1e530e-e746-490f-8e0d-e841fcf6fea7" type="subscription" user-id="664" status="ACTIVE" expiration="9999-12-31T23:59:59.999-08:00" privilege-set="BAACRCRO" /><ac:privilege runtime-id="53c50983-1de2-4f56-aabf-d96070add819" type="subscription" user-id="664" status="ACTIVE" expiration="9999-12-31T23:59:59.999-08:00" privilege-set="BAMJCAN" /><ac:privilege runtime-id="a644f365-cff4-4b96-956e-f0f1d37031b4" type="subscription" user-id="664" status="ACTIVE" expiration="9999-12-31T23:59:59.999-08:00" privilege-set="BCANDISC" /><ac:privilege runtime-id="349b077c-19b8-4d99-b99b-502e755d2fe7" type="subscription" user-id="664" status="ACTIVE" expiration="9999-12-31T23:59:59.999-08:00" privilege-set="BCANPREV" /><ac:privilege runtime-id="840f7f4e-c71c-487e-a171-9d6489cdd315" type="subscription" user-id="664" status="ACTIVE" expiration="9999-12-31T23:59:59.999-08:00" privilege-set="BCANRES" /><ac:privilege runtime-id="e439fd44-88f8-49ca-9b99-3d6948a6c415" type="subscription" user-id="664" status="ACTIVE" expiration="9999-12-31T23:59:59.999-08:00" privilege-set="BCEBP" /><ac:privilege runtime-id="1637e8d6-0833-47cd-86e5-c8cfaedf7f5f" type="subscription" user-id="664" status="ACTIVE" expiration="9999-12-31T23:59:59.999-08:00" privilege-set="BCELLGD" /><ac:privilege runtime-id="e9e9d7ad-773b-4147-bec5-44bcf368e10e" type="subscription" user-id="664" status="ACTIVE" expiration="9999-12-31T23:59:59.999-08:00" privilege-set="BCLINCANRE" /><ac:privilege runtime-id="df5dd41f-1b7c-4018-ad79-12dac60a56ac" type="subscription" user-id="664" status="ACTIVE" expiration="9999-12-31T23:59:59.999-08:00" privilege-set="BJCANRES" /><ac:privilege runtime-id="f04850b3-cbc0-4ffa-a05d-fcee4e0df0f4" type="subscription" user-id="664" status="ACTIVE" expiration="9999-12-31T23:59:59.999-08:00" privilege-set="BMOLCANRES" /><ac:privilege runtime-id="341d5d39-8d26-4863-a12f-614be1e14c16" type="subscription" user-id="664" status="ACTIVE" expiration="9999-12-31T23:59:59.999-08:00" privilege-set="BMOLCANTHE" /><ac:privilege runtime-id="fb7b5f57-45ab-4d44-91d0-6f4e13f2c631" type="subscription" user-id="664" status="ACTIVE" expiration="9999-12-31T23:59:59.999-08:00" privilege-set="NCME" /><ac:privilege runtime-id="3924f9e1-7638-4727-a2c6-7fe715e58d38" type="privilege-set" privilege-set="AUTHUSER" /><ac:credentials method="username">ddt</ac:credentials></ac:identity><ac:message name="logged-in" module="username-password" /></ac:authentication><ac:authorization target="service" id="1"><ac:authorized identity="1e10999c-b8c8-4b8d-b37a-b4af4cc30db4" privilege="3924f9e1-7638-4727-a2c6-7fe715e58d38" /></ac:authorization><ac:authz-candidate-details target="service" id="1"><ac:unauthorized reason="access-denied" /></ac:authz-candidate-details><ac:authz-candidate-details target="service" id="1"><ac:authorized identity="1e10999c-b8c8-4b8d-b37a-b4af4cc30db4" privilege="3924f9e1-7638-4727-a2c6-7fe715e58d38" /></ac:authz-candidate-details><ac:http-response><ac:cookie name="login" age-maximum="-1" version="0" path="/">authn%3A1378692312%3A%7BAES%7DrGo2N%2BTq2xKwgWHo3k64fSHUo5OBGd%2BiKI03QfuNC5m53S7EbaGtGjVg3tJ%2F1gx4%3AA3xIw9lxqZpm8ZhGpKZb7w%3D%3D</ac:cookie></ac:http-response></ac:runtime-response>';

        $httpBackend.when('POST', 'http://localhost:3000/runtime').respond(200, userInfo);

    }));

    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it('should call getCollections on the collections service when init is called', function () {

        spyOn(Collectionssvc, 'getCollections').andCallThrough();
        var controller = createController();
        $httpBackend.flush();
        expect(Collectionssvc.getCollections).toHaveBeenCalled();
    });
    it('should call pushForCurrentRoute to display error notification if getCollections() fails', function () {
        spyOn(i18nNotifications, 'pushForCurrentRoute');
        var controller = createController();
        scope.init();
        $httpBackend.flush();
        deferred.reject('because');
        scope.$apply();
        expect(i18nNotifications.pushForCurrentRoute).toHaveBeenCalled();
    });
    it('should call title service', function () {
        spyOn(titleService, 'setTitle').andCallThrough();
        var controller = createController();
        $httpBackend.flush();
        expect(titleService.setTitle).toHaveBeenCalled();
    });

    it('should call collectionsCount when collections returned', function () {
        spyOn(Collectionssvc, 'getCollections').andCallThrough();
        var controller = createController();
        scope.init();
        deferred.resolve([
            {}
        ]);
        $httpBackend.flush();

        expect(scope.collectionsCount).toBe(1);
    });

});

describe('CollectionsSuccessCtrl', function () {

    // load the controller's module
    beforeEach(module('collections','cctuiApp'));
        var CollectionsCtrl, service, titleService , createCollection,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope, Collectionssvc, _titleService_, i18nNotifications) {
        scope = $rootScope.$new();
        service = Collectionssvc;
        titleService = {
            setTitle: function (title) {
                return title;
            }
        };
        var params = {
            $scope: scope,
            titleService: titleService,
            i18nNotifications: i18nNotifications,
            collectionsSvc: service
        };
        createCollection = function() {return $controller('CollectionsCtrl', params)};
    }));

    it('should call title service', function () {
        spyOn(titleService, 'setTitle').andCallThrough();
        var ctrl = createCollection();
        expect(titleService.setTitle).toHaveBeenCalled();
    });
});


