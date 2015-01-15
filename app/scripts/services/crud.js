'use strict';
angular.module('services.crud',
        [
            'config'
        ])
    .factory('crud', function ($http, API_BASE_URL, CITATION_BASE_URL, INDEXER_BASE_URL) {
        return function () {

            //a constructor for new resources
            var Resource = function (data) {
                angular.extend(this, data);
            };

            // Resource.saveCitForm = function(citName, collectionId, publisherId){
            //     return $http({
            //         method: 'POST',
            //         url: API_BASE_URL + '?action=getCollection&collectionId=' + collectionId + '&publisherId=' + publisherId,
            //         data: $.param({articleCitationFormat: citName}),
            //         headers: {'Content-Type': 'application/json'}
            //     })
            //         .then(function (response){
            //             console.log(citName);
            //             return new Resource(response);
            //         },
            //         function (response){
            //             return new Resource(response);
            //         });
            // };

            Resource.update = function (data, publisherId) {
                console.log(data);
                return $http({
                    method: 'POST',

                    url: API_BASE_URL + '?action=updateCollection&publisherId=' + publisherId,
                    data: data,
                    headers: {'Content-Type': 'application/json'}
                })
                    .then(function (response) {
                        console.log(response);
                        return new Resource(response);
                    },
                    function (response) {
                        //request failed
                        return new Resource(response);
                    });

            };
            Resource.updateCollectionMembers = function (collection, publisherId) {
                return $http({
                    method: 'POST',
                    url: API_BASE_URL + '?action=updateCollectionMembers&collectionId=' + collection.collectionId + '&publisherId=' + publisherId,
                    data: collection,
                    headers: {'Content-Type': 'application/json'}

                })
                    .then(
                    function (response) {
                        return new Resource(response);
                    },
                    function (response) {
                        //request failed
                        return new Resource(response);
                    });

            };
            Resource.add = function (data, publisherId) {
                return $http({
                    method: 'POST',
                    url: API_BASE_URL + '?action=addCollection&publisherId=' + publisherId,
                    data: data,
                    headers: {'Content-Type': 'application/json'}
                })
                    .then(
                    function (response) {
                        return new Resource(response);
                    },
                    function (response) {
                        //request failed
                        return new Resource(response);
                    });
            };
            Resource.indexCollection = function (cctsObj, publisherId) {
                return $http({
                    method: 'POST',
                    url: INDEXER_BASE_URL + '/index?publisherId=' + publisherId,
                    data: cctsObj,
                    headers: {'Content-Type': 'application/json'}
                })
                    .then(
                    function (response) {
                        return new Resource(response);
                    },
                    function (response) {
                        //request failed
                        return new Resource(response);
                    });
            };
            Resource.addPublisherSettings = function (data) {
                return $http({
                    method: 'POST',
                    url: API_BASE_URL + '?action=addPublisherSettings&publisherId=' + data.publisherId,
                    data: data,
                    headers: {'Content-Type': 'application/json'}

                })
                    .then(
                    function (response) {
                        return new Resource(response);
                    },
                    function (response) {
                        //request failed
                        return new Resource(response);
                    });
            };
            Resource.getCollectionByLandingPageId = function (landingPageId, publisherId) {
                return $http({
                    method: 'GET',
                    //cache: true,
                    url: API_BASE_URL + '?action=getCollectionByLandingPageId&landingPageId=' + landingPageId + '&publisherId=' + publisherId

                })
                    .then(
                    //success handler
                    function (response) {
                        //check that we received data. We could have received 204 - no content
                        if (response.status === 204) {
                            //return nothing
                            return null;
                        }
                        return new Resource(response.data.data.collections[0]);
                    }
                );
            };
            Resource.synchMembers = function (collectionId, publisherId) {
                return $http({
                    method: 'GET',
                    url: API_BASE_URL + '?action=synchmembers&collectionId=' + collectionId + '&publisherId=' + publisherId

                })
                    .then(
                    //success handler
                    function (response) {

                        return new Resource(response);
                    }
                );
            };
            Resource.getCollectionById = function (collectionId, publisherId) {
                return $http({
                    method: 'GET',
                    url: API_BASE_URL + '?action=getCollection&collectionId=' + collectionId + '&publisherId=' + publisherId

                })
                    .then(
                    //success handler
                    function (response) {
                        //check that we received data. We could have received 204 - no content
                        if (response.status === 204) {
                            //return nothing
                            return null;
                        }
                        return new Resource(response.data.data.collections[0]);
                    }
                );
            };
            Resource.getCollectionByRssId = function (rssId, publisherId) {
                return $http({
                    method: 'GET',
                    url: API_BASE_URL + '?action=getCollectionByRssId&rssId=' + rssId + '&publisherId=' + publisherId

                })
                    .then(
                    //success handler
                    function (response) {
                        //check that we received data. We could have received 204 - no content
                        if (response.status === 204) {
                            //return nothing
                            return null;
                        }
                        return new Resource(response.data.data.collections[0]);
                    }
                );
            };
            Resource.getFile = function (uploadId, publisherId) {
                return $http({
                    method: 'GET',
                    url: API_BASE_URL + '?action=getFile&fileId=' + uploadId + '&publisherId=' + publisherId

                })
                    .then(
                    //success handler
                    function (response) {
                        //check that we received data. We could have received 204 - no content
                        if (response.status === 204) {
                            //return nothing
                            return null;
                        }
                        return new Resource(response);
                    }
                );
            };
            Resource.createCollection = function (collectionId, publisherId) {
                return $http({
                    method: 'GET',
                    url: API_BASE_URL + '?action=createCollection&collectionId=' + collectionId + '&publisherId=' + publisherId

                })
                    .then(
                    //success handler
                    function (response) {
                        return new Resource(response.data.data);
                    }
                );
            };
            Resource.createRSS = function (collectionId, publisherId) {
                return $http({
                    method: 'GET',
                    url: API_BASE_URL + '?action=generateFeed&collectionId=' + collectionId + '&publisherId=' + publisherId

                })
                    .then(
                    //success handler
                    function (response) {
                        console.log(response.data.data);
                        return new Resource(response.data.data);
                    }
                );
            };
            Resource.populateCollection = function (collectionId, publisherId) {
                return $http({
                    method: 'GET',
                    url: API_BASE_URL + '?action=populateCollection&collectionId=' + collectionId + '&publisherId=' + publisherId

                })
                    .then(
                    //success handler
                    function (response) {
                        return new Resource(response.data.data);
                    }
                );
            };
            Resource.getCollectionsByPublisherId = function (data) {
                return $http({
                    method: 'GET',
                    url: API_BASE_URL + '?action=getCollectionsByPublisherId&publisherId=' + data

                })
                    .then(
                    //success handler
                    function (response) {
                        return new Resource(response.data.data.collections);
                    }
                );
            };
            Resource.getKeywordsByPublisherId = function (data) {
                return $http({
                    method: 'GET',
                    url: API_BASE_URL + '?action=getKeywords&publisherId=' + data

                })
                    .then(
                    //success handler
                    function (response) {
                        return new Resource(response.data.data.keywords);
                    }
                );
            };
            Resource.getCollectionCitations = function (acsUrl, publisherId, startCnt, maxResults) {
                return $http({
                    method: 'GET',
                    url: CITATION_BASE_URL + '?uri=' + acsUrl + '%3Fsort=atom.created_at%26startindex=' + startCnt + '%26sort-order=asc%26max-results=' + maxResults + '&publisherId=' + publisherId
                })
                    .then(
                    //success handler
                    function (response) {
                        return new Resource(response.data);
                    }
                );
            };
            /*Resource.getCollectionCitations = function (acsUrl, publisherId, maxResults) {
                return $http({
                    method: 'GET',
                    url: CITATION_BASE_URL + '?uri=' + acsUrl + '%3Fsort=atom.created_at%26sort-order=asc%26max-results=' + maxResults + '&publisherId=' + publisherId
                })
                    .then(
                    //success handler
                    function (response) {
                        return new Resource(response.data);
                    }
                );
            };*/
            Resource.getCollectionCitationsExpanded = function (acsUrl, publisherId, maxResults) {
                return $http({
                    method: 'GET',
                    url: CITATION_BASE_URL + '?uri=' + acsUrl + '%3Fsort=atom.created_at%26sort-order=asc%26expand=true%26max-results=' + maxResults + '&publisherId=' + publisherId
                })
                    .then(
                    //success handler
                    function (response) {
                        return new Resource(response.data);
                    }
                );
            };
            Resource.getMemberCitation = function (atomUri, publisherId) {
                return $http({
                    method: 'GET',
                    url: CITATION_BASE_URL + '?policy=atomCitation&uri=' + atomUri + '%3Fexpand=true' + '&publisherId=' + publisherId
                }).then(function (response) {
                        //success handler
                        return new Resource(response.data);
                    });
            };
            Resource.getPublisherSettingsByPublisherId = function (data) {
                return $http({
                    method: 'GET',
                    url: API_BASE_URL + '?action=getPublisherSettingsByPublisherId&publisherId=' + data
                })
                    .then(
                    //success handler
                    function (response) {
                        return new Resource(response.data.data.publisherSettings);
                    }
                );
            };

            return Resource;
        };
    });
