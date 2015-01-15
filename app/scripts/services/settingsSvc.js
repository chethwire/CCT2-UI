'use strict';

angular.module('services.settings', ['services.crud', 'security'])
    .factory('Crud', function (crud) {
        return crud();
    })

    .service('SettingsSvc', ['Crud', function (Crud) {
        //private object
        var publisherSettingsObj = {
            publisherId: -1,
            primaryColor: '',
            secondaryColor: '',
            headerImageId: -1,
            featureImageId: -1,
            dateFormat: '',
            defaultLandingPagePath: ''
        };
        return {
            getPublisherSettingsById: function (publisherId) {
                return Crud.getPublisherSettingsByPublisherId(publisherId);

            },
            add: function (settings) {
                return Crud.addPublisherSettings(settings);
            },
            reset: function () {
                publisherSettingsObj = {
                    publisherId: -1,
                    primaryColor: '',
                    secondaryColor: '',
                    headerImageId: -1,
                    featureImageId: -1,
                    dateFormat: '',
                    defaultLandingPagePath: ''
                };
            }
        };
    }]
    );