'use strict';
angular.module('settings', [
        'services.settings',
        'titleService',
        'security.authorization',
        'services.crud',
        'services.i18nNotifications',
        'directives.fileupload',
        'config',
        'ngRoute'

    ])
    .config(['$routeProvider', 'securityAuthorizationProvider', function ($routeProvider, securityAuthorizationProvider) {
        $routeProvider
            .when('/settings', {
                templateUrl: 'views/settings.html',
                controller: 'SettingsCtrl',
                resolve: {
                    authenticatedUser: securityAuthorizationProvider.requireAuthenticatedUser
                }
            })
            .when('/settings/success', {
                templateUrl: '/views/settings.success.html',
                controller: 'SettingsSuccessCtrl',
                resolve: {
                    authenticatedUser: securityAuthorizationProvider.requireAuthenticatedUser
                }
            })
    }])
    .controller('SettingsSuccessCtrl', ['$scope', 'titleService', function ($scope, titleService) {
        $scope.setTitle = function() {titleService.setTitle('Success')};
    }])
    .controller('SettingsCtrl', ['$scope', 'SettingsSvc', 'i18nNotifications', 'titleService', '$location', 'security', '$fileUploader', 'API_BASE_URL', function ($scope, SettingsSvc, i18nNotifications, titleService, $location, security,$fileUploader,API_BASE_URL) {
        $scope.setTitle = function() {titleService.setTitle('Settings')};
        $scope.publisherId = security.publisherId;
        $scope.apiBaseUrl = API_BASE_URL;

        $scope.init = function () {
            SettingsSvc.getPublisherSettingsById($scope.publisherId).then(function (settings) {
                $scope.publisherSettings = settings;

            }, function (x) {
                //if we get here there was a problem with the request to the server
                i18nNotifications.pushForCurrentRoute('collections.crud.error', 'danger', {exception: x});
            });
        };
        $scope.init();

        $scope.addPublisherSettings = function (form) {
            if (form.$valid) {
                //add as new

                $scope.publisherSettings.publisherId = $scope.publisherId;

                //TODO Remove these references completely, but are required currently in service
                $scope.publisherSettings.primaryColor = "";
                $scope.publisherSettings.secondaryColor = "";
                $scope.publisherSettings.dateFormat = "MM/dd/yyyy";
                $scope.publisherSettings.headerImageId="";


                SettingsSvc.add($scope.publisherSettings)
                    .then(function (result) {
                        if (result.status === 201) {
                            //success
                            SettingsSvc.reset();
                            $location.path("/settings/success");
                        } else {
                            i18nNotifications.pushForCurrentRoute('collections.crud.error', 'danger', {exception: result});
                            console.log(result);
                        }
                    }, function (x) {
                        //if we get here there was a problem with the request to the server
                        i18nNotifications.pushForCurrentRoute('collections.crud.error', 'danger', {exception: x});
                    });


            } else {
                //form invalid. View should show required fields
            }
        };

    }]);

