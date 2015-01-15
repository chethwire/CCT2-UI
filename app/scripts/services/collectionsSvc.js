'use strict';
angular.module('mock.collections', []).factory('Collections', function () {
    var collectionObj = {};
    return {
        getCollectionByLandingPageId: function (slug, publisherId) {
            return collectionObj;
        }
    }
});

angular.module('services.collections', ['services.crud', 'security', 'LocalStorageModule', 'settings'])
    .factory('Crud', function (crud) {
        return crud();
    })

    .service('Collectionssvc', ['Crud', 'security', 'localStorageService', 'INDEXER_INSTANCE', function (Crud, security, localStorageService, INDEXER_INSTANCE) {
        //private object
        var collectionObj = {
            collectionId: -1,
            name: '',
            publisherId: -1,
            description: '',
            rssFeedAlias: '',
            availableStarting: '',
            individualPrice: '',
            individualDuration: '',
            institutionalPrice: '',
            institutionalDuration: '',
            status: '',
            createdBy: '',
            datedAdded: '',
            modifiedBy: '',
            modifiedOn: '',
            primaryColor: '',
            secondaryColor: '',
            headerImageId: '',
            featureImageId: '',
            dateFormat: 'MM/dd/yyyy',
            landingPageId: '',
            rssId: '',
            members: [],
            ecommerceEnabled: false,
            showKeywords: false,
            keywords: [],
            path: []
        };
        return {

            // saveCitForm: function(citName, collectionId, publisherId){
            //     return Crud.saveCitForm(citName,collectionId,publisherId);
            // },

            getCollection: function () {
                var localCollection = localStorageService.get('collection');
                if (localCollection !== null) {
                    //return persisted collection
                    return localCollection;
                } else {
                    //return empty collection
                    return collectionObj;
                }

            },

            getCollectionById: function (collectionId, publisherId) {
                return Crud.getCollectionById(collectionId, publisherId);
            },
            //CITATIONS CALL 
            /*getCollectionCitations: function (acsUrl, publisherId, maxResults, expCitation) {
                if (expCitation === false)
                {
                    return Crud.getCollectionCitations(acsUrl, publisherId, maxResults);
                }
                else
                {
                    return Crud.getCollectionCitationsExpanded(acsUrl, publisherId, maxResults);
                }
            },*/
            //CITATIONS CALL WITH STARTINDEX AND MAXRESULTS VARYING
            getCollectionCitations: function (acsUrl, publisherId, startCnt, maxResults, expCitation) {
                if (expCitation === false)
                {
                    return Crud.getCollectionCitations(acsUrl, publisherId, startCnt, maxResults);
                }
                else
                {
                    return Crud.getCollectionCitationsExpanded(acsUrl, publisherId, startCnt, maxResults);
                }
            },

            getMemberCitation: function (atomUri, publisherId) {
                return Crud.getMemberCitation(atomUri, publisherId);
            },
            getCollectionByLandingPageId: function (landingPageId, publisherId) {
                return Crud.getCollectionByLandingPageId(landingPageId, publisherId);
            },
            getCollectionByRssId: function (rssId, publisherId) {
                return Crud.getCollectionByRssId(rssId, publisherId);
            },
            createCollection: function (collectionId, publisherId) {
                return Crud.createCollection(collectionId, publisherId);
            },
            createRSS: function (collectionId, publisherId) {
                return Crud.createRSS(collectionId, publisherId);
            },
            getFile: function (uploadId, publisherId) {
                return Crud.getFile(uploadId, publisherId);
            },
            populateCollection: function (collectionId, publisherId) {
                return Crud.populateCollection(collectionId, publisherId);
            },
            save: function (collection, publisherId) {
                return Crud.update(collection, publisherId);
            },
            updateCollectionMembers: function (collection, publisherId) {
                return Crud.updateCollectionMembers(collection, publisherId);
            },
            synchMembers: function (collectionId, publisherId) {
                return Crud.synchMembers(collectionId, publisherId);
            },
            saveLocal: function (collection) {
                /**
                 * Save to local storage to persist through browser refresh
                 */
                localStorageService.add('collection', JSON.stringify(collection));

            },
            add: function (collection, publisherId) {
                return Crud.add(collection, publisherId);
            },
            getCollections: function () {
                return Crud.getCollectionsByPublisherId(security.publisherId);
            },
            getKeywordsByPublisherId: function (publisherId) {
                return Crud.getKeywordsByPublisherId(publisherId);
            },
            indexCollection: function (collection, publisherId) {

                //build the index object to POST
                var cctsObj = {};
                var ccts = {};
                ccts.cct = [];
                var cctObj = {};

                //convert keyword array into pipe "|" delimited string
                var keywords = []
                for (var i = 0; i < collection.keywords.length; i++) {
                    keywords.push(collection.keywords[i].text);
                }
                var keywordsStr = keywords.toString().replace(/,/g, "|");

                cctObj.cctid = collection.collectionId.toString();
                cctObj.instance = INDEXER_INSTANCE;
                cctObj.uri = collection.path;
                cctObj.groupcode = collection.publisherId;
                cctObj.keywords = keywordsStr;
                ccts.cct.push(cctObj);
                cctsObj.ccts = ccts;
                return Crud.indexCollection(cctsObj, publisherId);
            },

            reset: function () {
                collectionObj = {
                    collectionId: -1,
                    name: '',
                    publisherId: -1,
                    description: '',
                    rssFeedAlias: '',
                    availableStarting: '',
                    individualPrice: '',
                    individualDuration: '',
                    institutionalPrice: '',
                    institutionalDuration: '',
                    status: '',
                    createdBy: '',
                    datedAdded: '',
                    modifiedBy: '',
                    modifiedOn: '',
                    primaryColor: '',
                    secondaryColor: '',
                    headerImageId: '',
                    featureImageId: '',
                    dateFormat: 'MM/dd/yyyy',
                    landingPageId: '',
                    rssId: '',
                    members: [],
                    ecommerceEnabled: false,
                    showKeywords: false,
                    keywords: [],
                    path: ''
                };
                this.saveLocal(collectionObj);
            }
        };
    }]
    );