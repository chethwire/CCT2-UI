angular.module('collections',
        [
            'titleService',
            'security.authorization',
            'services.crud',
            'services.collections',
            'services.catalog',
            'services.validate',
            'files',
            'services.settings',
            'directives.fileupload',
            'directives.datePicker',
            'directives.filterMenu',
            'directives.addRowSearchCond',
            'directives.uniqueLandingPage',
            'directives.uniqueRss',
            'directives.collectionEditor',
            'directives.charLimit',
            'directives.clickToEdit',
            'directives.collectionEditorCitations',
            'directives.descriptionParseUrl',            
            'ui.date',
            'services.i18nNotifications',
            'ngRoute',
            'ngAnimate',
            'ngCookies',
            'ngResource',
            'config',            
            'ui.select2',
            'ngSanitize'
        ])

/**
* Each section or module of the site can also have its own routes. AngularJS
* will handle ensuring they are all available at run-time, but splitting it
* this way makes each module more "self-contained".
*/
    .config(['$routeProvider', 'securityAuthorizationProvider', function ($routeProvider, securityAuthorizationProvider) {
        $routeProvider
            .when('/collections', {
                templateUrl: '/views/collections.html',
                controller: 'CollectionsCtrl',
                resolve: {
                    authenticatedUser: securityAuthorizationProvider.requireAuthenticatedUser
                }
            })
            /*.when('/collections/create', {
                templateUrl: '/views/collections.create.html',
                controller: 'CollectionsCreateCtrl',
                resolve: {
                    authenticatedUser: securityAuthorizationProvider.requireAuthenticatedUser
                }
            })*/
            .when('/collections/manage', {
                templateUrl: '/views/collections.manage.html',
                controller: 'CollectionsManageCtrl',
                resolve: {
                    authenticatedUser: securityAuthorizationProvider.requireAuthenticatedUser
                }
            })
            .when('/collections/manage/rules', {
                templateUrl: '/views/collections.manage.rules.html',
                controller: 'CollectionsRulesCtrl',
                resolve: {
                    authenticatedUser: securityAuthorizationProvider.requireAuthenticatedUser
                }
            })
            .when('/collections/publish', {
                templateUrl: '/views/collections.publish.html',
                controller: 'CollectionsPublishCtrl',
                resolve: {
                    authenticatedUser: securityAuthorizationProvider.requireAuthenticatedUser
                }
            })
            .when('/collections/success/:collectionId', {
                templateUrl: '/views/collections.success.html',
                controller: 'CollectionsSuccessCtrl',
                resolve: {
                    authenticatedUser: securityAuthorizationProvider.requireAuthenticatedUser
                }
            })
            .when('/collections/edit/:collectionId', {
                templateUrl: '/views/collections.edit.html',
                controller: 'CollectionsEditCtrl',
                resolve: {
                    authenticatedUser: securityAuthorizationProvider.requireAuthenticatedUser
                }
            })
            .when('/collections/details/:collectionId', {
                templateUrl: '/views/collections.html',
                controller: 'CollectionsCtrl',
                resolve: {
                    authenticatedUser: securityAuthorizationProvider.requireAuthenticatedUser
                }
            })
            .when('/collections/editmembers/:collectionId', {
                templateUrl: '/views/collections.editmembers.html',
                controller: 'CollectionsEditMembersCtrl',
                resolve: {
                    authenticatedUser: securityAuthorizationProvider.requireAuthenticatedUser
                }
            })
        ;
    }])
    .controller('CollectionsCtrl', ['$scope','$rootScope', 'titleService', 'Collectionssvc', 'i18nNotifications', '$location', 'API_BASE_URL', 'security', '$anchorScroll', 'SettingsSvc', 'CatalogSvc', '$routeParams','$cookies', function ($scope, $rootScope, titleService, Collectionssvc, i18nNotifications, $location, API_BASE_URL, security, $anchorScroll, SettingsSvc, CatalogSvc, $routeParams, $cookies) {

        titleService.setTitle('Collections');

        $scope.collectionsCount = -1;
        $scope.selectedCollection = undefined;
        $scope.view = "cardView"; //cardView, listView, detailsView
        $scope.previousView = "listView";
        $scope.sortField = "dateAdded";
        $scope.reverse = true;
        $scope.currentKeyword = undefined;
        $scope.keywords = [];
        $scope.apiBaseUrl = API_BASE_URL;
        $scope.searchText = '';
        $scope.currentDate = {};
        $scope.statuses = {"Published": true, "Unpublished": true};
        $scope.publisherId = security.publisherId;
        $rootScope.artCit;
        $rootScope.bookCit;
        // $cookies.landingPgUrl;
        $rootScope.landingPgUrl;
        $cookies.collDescr;


        //on browser back from a particular collection details page, go back to entire collections page which has cardView
        $rootScope.$on('$routeChangeStart', function(event, next, current){
            if(next.templateUrl === '/views/loginForm.html' && $scope.view === "detailsView")
            {
               $location.path('/collections');
               $scope.view = "cardView";
            }
        });

        //construct RSS Feed URL
        var port = $location.port();
        var webBaseUrl = $location.protocol() + '://' + $location.host();
        if (port !== 80 ) {
            webBaseUrl = webBaseUrl + ':'+ $location.port();
        }
        $scope.webBaseUrl = webBaseUrl;

        $scope.updateSearch = function (searchText) {
            $scope.searchText = searchText;
        };
        $scope.removeDate = function () {
            $scope.currentDate = {};
        };

        $scope.select2Options = {
            'multiple': true,
            'simple_tags': false,
            'tokenSeparators': [",", "|"],
            'maximumInputLength': 100,
            'maximumSelectionSize': 10,
            'tags': []//can be empty list
        };
        $scope.startDateOptions = {
            changeYear: true,
            changeMonth: true,
            yearRange: '1900:-0'
        };
        $scope.endDateOptions = {
            changeYear: true,
            changeMonth: true,
            yearRange: '1900:-0'

        };
        $scope.collectionFilter = function (collection) {

            var statusMatch = false;

            if ((collection.status === "Published" && $scope.statuses.Published) || (collection.status === "Unpublished" && $scope.statuses.Unpublished)) {
                statusMatch = true;
            }

            var dateMatch = false;
            if (!$scope.currentDate.endDate && !$scope.currentDate.startDate) {
                dateMatch = true;
            } else {
                //check dates
                var startDate = new Date($scope.currentDate.startDate);
                startDate = startDate.setHours(0, 0, 0, 0);
                var endDate = new Date($scope.currentDate.endDate);
                endDate = endDate.setHours(23, 59, 59, 999);
                var dateAdded = new Date(collection.dateAdded);
                dateAdded = dateAdded.setHours(0, 0, 0, 1);

                //prevent dates earlier than startDate in endDate picker
                $scope.endDateOptions = {
                    changeYear: true,
                    changeMonth: true,
                    yearRange: '1900:-0',
                    minDate: new Date(startDate)
                };

                if (!endDate) {
                    if (dateAdded >= startDate) {
                        dateMatch = true;
                    }
                } else {
                    //we have both start and end
                    if (dateAdded >= startDate && dateAdded <= endDate) {
                        dateMatch = true;
                    }
                }


            }

            var keywordMatch = false;
            if ($scope.keywords.length < 1) {
                //if keywords array is empty, return all collections
                keywordMatch = true;
            } else {
                for (var i in $scope.keywords) {
                    if (collection.description.toLowerCase().indexOf($scope.keywords[i].toLowerCase()) !== -1 || collection.name.toLowerCase().indexOf($scope.keywords[i].toLowerCase()) !== -1) {
                        keywordMatch = true;
                    }
                }

                //return (collection.name.toLowerCase().indexOf($scope.searchText.toLowerCase()) !== -1 || collection.description.toLowerCase().indexOf($scope.searchText.toLowerCase()) !== -1);

            }

            return (dateMatch && keywordMatch && statusMatch);
        };


        $scope.init = function () {


            Collectionssvc.getCollections().then(function (collections) {

                //$rootScope.collections = collections;
                //we're going to instead put these in a basic array for now to better work with angular filters

                var collectionsArray = [];
                var collectionsName = [];//Array to push collection names
                                
                var count = 0;               
                
                for (var i in collections) {
                    // get collection count and also generate a true date field for sorting
                    count++;
                    var dateStr = collections[i].dateAdded;
                    var d = Date.parse(dateStr);
                    collections[i].dateAdded = d;
                                        
                    //collections[i].individualPrice = getIndividualPrice(collections[i].path,security.publisherId);
                    collectionsArray.push(collections[i]);
                    collectionsName.push(collections[i].name);                                          
                }
                $scope.collectionsCount = count;
                $rootScope.collections = collectionsArray;                
                $rootScope.collectionsName=collectionsName;
                $cookies.collNames = $rootScope.collectionsName;             
                
                //show details view if collectionId is present
                if (!isNaN($routeParams.collectionId)) {
                    //console.log($routeParams.collectionId);
                    var id = parseInt($routeParams.collectionId);
                    $scope.showDetails(id);
                }
                if (count < 1) {
                    $scope.hasCollections = "false";
                } else {
                    $scope.hasCollections = "true";
                }
            }, function (x) {
                //if we get here there was a problem with the request to the server
                i18nNotifications.pushForCurrentRoute('collections.crud.error', 'warning', {exception: x});
            });


            SettingsSvc.getPublisherSettingsById($scope.publisherId).then(function (settings) {
                $scope.publisherSettings = settings;

            }, function (x) {
                //if we get here there was a problem with the request to the server
                i18nNotifications.pushForCurrentRoute('collections.crud.error', 'danger', {exception: x});
            });


        };

        $scope.showDetails = function (collectionId) {
            var collection = getCollectionById(collectionId);
            var expCitation = false;//Parameter set to false to remove "expand=true" parameter from citations URL to speed the citations page load. This can be changed to true if expand=true is required in URL
            var incrCount = 5;
            var allCitations = [];
            var remResults = collection.members.length%incrCount;
            console.log(collection.members.length);
            console.log(remResults);
            $scope.previousView = $scope.view;
            var collectionKeywords=[];
            $scope.collectionKeywords=new Array();
            $cookies.collNames = $rootScope.collectionsName;
            $cookies.collDescr=collection.description;
           console.log($cookies.collNames);
            $rootScope.collection=collection;
             console.log(collection);


            // Get collection citations
            if (collection) {
                if (collection.acsUrl) {
                    if (collection.members.length === 1){
                          Collectionssvc.getCollectionCitations(collection.acsUrl, security.publisherId, 1, 1, expCitation).then(function (citation) {
                               collection.citation = citation.data.citations;
                               // console.log(collection.citation.length);
                           }, function (x) {
                        // Failed to get citation
                            console.log(x);
                        });  
                    }
                    else if (remResults !== 0){
                        for(var i=1;i <= collection.members.length-remResults; i+=incrCount){
                            Collectionssvc.getCollectionCitations(collection.acsUrl, security.publisherId, i, incrCount, expCitation).then(function (citation) {
                               if(incrCount>1){
                                    for(var j = 1 ; j<=incrCount;j++){
                                        allCitations.push(citation.data.citations[j-1]);
                                        // console.log(allCitations);
                                    }
                                }
                                else {
                                    allCitations.push(citation.data.citations);
                                }
                            }, function (x) {
                            // Failed to get citation
                                console.log(x);
                            });
                        }
                        if (remResults > 1){
                            for(var i = collection.members.length-remResults+1;i<=collection.members.length;i++){
                                Collectionssvc.getCollectionCitations(collection.acsUrl, security.publisherId, i, 1, expCitation).then(function (citation) {
                                   allCitations.push(citation.data.citations[0]);
                                   // console.log(allCitations);
                                }, function (x) {
                                // Failed to get citation
                                    console.log(x);
                                });
                            }
                        }
                        else{
                            Collectionssvc.getCollectionCitations(collection.acsUrl, security.publisherId, collection.members.length, 1, expCitation).then(function (citation) {
                                   // console.log(citation.data.citations.data);
                                   allCitations.push(citation.data.citations[0]);
                                   // console.log(allCitations);
                            }, function (x) {
                                // Failed to get citation
                                console.log(x);
                            });
                        }
                        collection.citation=allCitations;                        
                    }
                    else {
                        for(var i=1;i <= collection.members.length; i+=incrCount){
                            Collectionssvc.getCollectionCitations(collection.acsUrl, security.publisherId, i, incrCount, expCitation).then(function (citation) {
                               if(incrCount>1){
                                    for(var j = 1 ; j<=incrCount;j++){
                                        allCitations.push(citation.data.citations[j-1]);
                                        // console.log(allCitations);
                                    }
                                }
                                else {
                                    allCitations.push(citation.data.citations);
                                }
                            }, function (x) {
                            // Failed to get citation
                                console.log(x);
                            });
                        }
                        collection.citation=allCitations;
                    }
                        
                       
                }
                              

                // Get price from ecommerce catalog
                //TODO remove hard coded publisherId
                //collection.individualPrice = '';
                //CATALOG LOG FOR E-COMMERCE
                /*CatalogSvc.getPrice(collection.path, security.publisherId).then(function (catalogResponse) {
                    //check if an array -- currently service returns all products when a product is not found. This is not good.
                    if (catalogResponse.data.data['product-item']) {
                        collection.ecommerceEnabled = true;
                        collection.individualPrice = catalogResponse.data.data['product-item'].price.amount;
                    } else {
                        collection.ecommerceEnabled = false;
                    }
                }, function (x) {
                    // Failed to get catalog price
                    console.log(x);
                    collection.ecommerceEnabled = false;
                });*/
// collection.individualPrice = getIndividualPrice(collection.path,security.publisherId);

                $scope.selectedCollection = collection;

                //PAGINATION
                $scope.showPgn=false;
                $scope.pgSize=10;
                $scope.currentPg=0;
                if ($scope.selectedCollection.members.length >10){
                    $scope.showPgn=true;
                }
                

                
                console.log($scope.selectedCollection);
                if($scope.selectedCollection.keywords.length>=1){
                    for(var i = 0;i<$scope.selectedCollection.keywords.length;i++){
                        collectionKeywords.push($scope.selectedCollection.keywords[i].text);
                    }                    
                }
                $rootScope.selectedCollection = $scope.selectedCollection;
                // console.log(collection);
                $scope.collectionKeywords=collectionKeywords.toString();
                console.log($scope.collectionKeywords);


                //scroll to top of page and load detailsView
                $anchorScroll();

                $scope.setViewType("detailsView");

            }
        };
        $scope.closeCollectionDetails = function () {
            $scope.selectedCollection = undefined;

            $scope.setViewType($scope.previousView);
        };
        $scope.setViewType = function (viewType) {
            $scope.view = viewType;
            //$scope.$apply();
        };
        $scope.sort = function (fieldName) {
            if ($scope.sortField === fieldName) {
                $scope.reverse = !$scope.reverse;
            } else {
                $scope.sortField = fieldName;
                $scope.reverse = false;
            }

            //reset view to re-initialize masonry layout. This could be improved later, likely by using a plugin that supports sorting (ex: Isotope plugin)
            $scope.previousView = $scope.view;
            $scope.setViewType("emptyView");
            $scope.setViewType($scope.previousView)


        };

        $scope.isSortUp = function (fieldName) {
            return $scope.sortField === fieldName && !$scope.reverse;
        };
        $scope.isSortDown = function (fieldName) {
            return $scope.sortField === fieldName && $scope.reverse;
        };

        $scope.addKeyword = function (keyword) {
            var index = $scope.keywords.indexOf(keyword);
            if (index < 0) {
                $scope.keywords.push(keyword);
            }
        };
        $scope.setKeywordInputFocus = function () {
            $('#keyword').val('');
            setTimeout(function () {
                $('#keyword').eq(0).focus();
            }, 500);
        };
        $scope.removeKeyword = function (keyword) {
            var index = $scope.keywords.indexOf(keyword);
            $scope.keywords.splice(index, 1);
        };


        $scope.init();


        function getCollectionById(id) {
            var collection = undefined;
            //this could be improved to not iterate entire array
            for (var i in $rootScope.collections) {
                var c = $rootScope.collections[i].collectionId;
                if (c === id) {
                    collection = $rootScope.collections[i];
                }
            }
            return collection;
        }

         


    }])
    .controller('CollectionsSuccessCtrl', ['$scope', 'titleService', '$routeParams', function ($scope, titleService, $routeParams) {
        titleService.setTitle('Success');
        $scope.collectionId = $routeParams.collectionId;
        
    }])

    .controller('CollectionsManageCtrl', ['$scope', '$rootScope', '$location', '$http', 'titleService', 'Collectionssvc', '$fileUploader', 'i18nNotifications', 'API_BASE_URL', 'security', 'SettingsSvc', 'Validate', '$timeout','$window', function ($scope, $rootScope, $location, $http, titleService, Collectionssvc, $fileUploader, i18nNotifications, API_BASE_URL, security, SettingsSvc, Validate, $timeout, $window) {

        titleService.setTitle('Manage Collection');
        


    }])
    .controller('CollectionsRulesCtrl', ['$scope', '$rootScope', '$location', '$http', 'titleService', 'Collectionssvc', '$fileUploader', 'i18nNotifications', 'API_BASE_URL', 'security', 'SettingsSvc', 'Validate', '$timeout','$window','$q','$filter', function ($scope, $rootScope, $location, $http, titleService, Collectionssvc, $fileUploader, i18nNotifications, API_BASE_URL, security, SettingsSvc, Validate, $timeout, $window, $q, $filter) {

        titleService.setTitle('Manage Collection - Rules');

        $scope.isCollCurr = false;
        $rootScope.existColl = {};
        $scope.selColl = undefined;

        //COLLECTION PAGINATION
        $scope.showPgn=false;
        $scope.pgSize=5;
        $scope.currentPg=0;
        //COLLECTION MEMBERS PAGINATION
        // $scope.showPgnMem=false;
        $scope.pgSizeMem=5;
        $scope.currentPgMem=0;

        var resp;
        $scope.selColl=undefined;
        $scope.selMem=undefined;
        $scope.collIncl=undefined;
        $scope.collMemIncl=undefined;
        $scope.collExcl=undefined;
        $scope.collMemExcl=undefined;
        $scope.collMemCnt=0;
        $scope.memCnt=0;
        $scope.cnt=0;
        $scope.collMemLen=0;
        $scope.collSelMem=undefined;
        //Content Pane Accordion
        $scope.collChk=false;
        //Rules Pane Accordion
        $scope.doiRuleOpen=false;
        $scope.collRuleOpen=false;
        $scope.subjRuleOpen=false;
        $scope.searchRuleOpen=false;
        $scope.subSearch=['Geomorphology','Rocks','Sedimentary','Granite','Sedimentary Rocks'];
        $scope.searchBoolean={'type':'select',
                              'value':'AND',
                              'values':['OR','AND']};
        $scope.searchContent=[
                              {'type':'Journal','checked':'false'},
                              {'type':'Books','checked':'false'},
                              {'type':'Figures','checked':'false'},
                              {'type':'Data Supplements','checked':'false'},
                              {'type':'PAP','checked':'false'}
                              ];

        $scope.searchCondition={'type':'select',
                                'value':'Title',
                                'values':['Title','Abstract','Full Text']
                               };
                                
        var memCnt=0;

        function getColl(){
            return $http.get("/ExistColl.json");
        }

        $scope.setCollView = function () {
            $scope.isCollCurr = true;
           
            var resp = getColl();
            // console.log(resp);
            resp.then (function (response){
               // console.log(response.data);
                if (response.data){
                    $rootScope.existColl = response.data;
                    // console.log($rootScope.existColl.length);
                    angular.forEach($rootScope.existColl, function (item){
                        item.isAdded=false;
                        item.Open=false;                        
                        //COLLECTION MEMBERS PAGINATION
                        if (item.itemMem.length > $scope.pgSizeMem){                            
                            item.pgn=true;
                        }
                        else {                           
                            item.pgn=false;
                        }                       
                    });                    
                    angular.forEach($rootScope.existColl.itemMem, function (item){                        
                        item.isAdded=false;                        
                    });                   
                    // COLLECTION PAGINATION
                    if($rootScope.existColl.length > $scope.pgSize){
                        $scope.showPgn=true;
                    }
                    else {
                        $scope.showPgn=false;
                    }
                }
            },function (x) {
               console.log (JSON.stringify(x));   
              });               
        }    
        

        $scope.setCollView();    



        $scope.chkBox = function (coll,$event){            
            $event.stopPropagation();
        }

        $scope.getSelColl = function (start, index){ 
            console.log($rootScope.existColl);
            console.log(index);
            console.log(start+index);
            $scope.collChk=false;           
            $scope.selColl = $filter('filter')($rootScope.existColl, {checked: true});            
            console.log($scope.selColl.length);
            console.log($scope.selColl);


            if($rootScope.existColl[start+index].checked === true){
                console.log($rootScope.existColl[start+index]);
               $rootScope.existColl[start+index].Open=false;
                angular.forEach($rootScope.existColl[start+index].itemMem, function (item){                
                    item.checked=true;
                });
            } 
            else if ($rootScope.existColl[start+index].checked === false){
                
                angular.forEach($rootScope.existColl[start+index].itemMem, function (item){                
                    item.checked=false;
                });
            }          
        }
        

        $scope.getSelMem = function (coll,index){
            $scope.selMem = $filter('filter')(coll.itemMem, {checked: true});
            console.log($scope.selMem);
        }

        $scope.shwCollIncl = function (){            
            $scope.collIncl = $scope.selColl;
            console.log($scope.collIncl);
            var tmp;
            $scope.collMemCnt=0;
            angular.forEach($scope.collIncl, function (item){
                item.isAdded=true;
                $scope.collRuleOpen=true;
                angular.forEach(item.itemMem, function (mem){
                    if(mem.checked===true){
                        mem.isAdded=true;                         
                        $scope.collMemCnt++;                         
                    }
                });

                            
            });
            $scope.collMemCnt = $scope.collMemCnt + $scope.memCnt;

            /*angular.forEach($rootScope.existColl, function (item){
                angular.forEach(item.itemMem, function (mem){
                    if(mem.checked===true){
                        mem.isAdded=true;                         
                        $scope.collMemCnt++;                         
                    }
                });
            });*/
            console.log($scope.collMemCnt);                             
        }

        $scope.shwMemIncl = function (coll){
            $scope.memCnt = 0;
            angular.forEach(coll.itemMem, function (mem){
                if (mem.checked){
                mem.isAdded=true;
                $scope.memCnt++;
            }
            });
            $scope.collMemCnt = $scope.collMemCnt + $scope.memCnt;
            console.log($scope.memCnt);
            console.log($scope.collMemCnt);
        }
        
        $scope.shwCollExcl = function(index){
            
            $scope.selColl[index].checked=false;
            $scope.selColl[index].isAdded=false;
            
            angular.forEach($scope.selColl[index].itemMem,function (item){
                $scope.collMemCnt--;
                item.checked=false;
                item.isAdded=false;
            });
            if ($scope.selColl.length <= 1){
                $scope.collRuleOpen=false;
            }
            var tmp = $scope.collIncl.splice(index,1);       
           
        }

        $scope.shwCollMemExcl = function (coll,index){
            $scope.cnt=0;

            $scope.cnt++;
            $scope.collMemLen = coll.itemMem.length - $scope.cnt;
            $scope.collMemCnt--; 
            console.log(coll);
            console.log(index);
            console.log(coll.itemMem.length);            
            coll.itemMem[index].checked=false;
            coll.itemMem[index].isAdded=false;
            $scope.selMem = $filter('filter')(coll.itemMem, {checked: true});
            console.log($scope.selMem.length);
            // coll.itemMem.length--;
          }  

        $scope.shwMemExcl = function (mem){
            $scope.collMemCnt--;
            $scope.memCnt--;
            mem.checked=false;
            mem.isAdded=false;
        }
        $scope.shwSubSearch=function (subjs){
            console.log(subjs);
        }


    }])
    .controller('CollectionsPublishCtrl', ['$scope', '$rootScope', '$http', 'titleService', 'Collectionssvc', 'security', '$location', '$fileUploader', 'i18nNotifications', 'API_BASE_URL', 'SettingsSvc', 'MODCATALOG_BASE_URL', 'CatalogSvc','$cookies', function ($scope, $rootScope, $http, titleService, Collectionssvc, security, $location, $fileUploader, i18nNotifications, API_BASE_URL, SettingsSvc, MODCATALOG_BASE_URL, CatalogSvc,$cookies) {
        titleService.setTitle('Publish Collection');
        $scope.goBack = function () {
            window.history.back();
        };

        $scope.analyzing = false;
        $scope.collectionAction = 'publish'; //publish or update -- this helps us know which buttons and actions to use in collectionEditor template
        var baseUrl = 'http://cct.highwire.org/rss/';
        $scope.collection = Collectionssvc.getCollection();
        var d = new Date(Date.parse($scope.collection.availableStarting));
        $scope.availableStartDate = d;
        // set default value for duration dropdown
        $scope.collection.individualDuration = 0;


        var len = $scope.collection.members.length;
        while (len--) {
            //remove all invalid entries
            if (!$scope.collection.members[len].uri) {
                $scope.collection.members.splice(len, 1);
            }
        }
        if (!$scope.collection.members.length) {
            //collection is empty, not good
            alert('Your collection is empty. Please add some items to your collection first.');
            $location.path("/collections/create");

        }
        $scope.apiBaseUrl = API_BASE_URL;
        $scope.publisherId = security.publisherId;
        $scope.tags = [];
        Collectionssvc.getKeywordsByPublisherId(security.publisherId).then(function (keywords) {
            for (var p in keywords) {
                $scope.tags.push(keywords[p].text);
            }
        });

        //keyword input
        $scope.select2Options = {
            'multiple': true,
            'simple_tags': false,
            'tokenSeparators': [",", "|"],
            'maximumInputLength': 100,
            'maximumSelectionSize': 10,
            'tags': $scope.tags//can be empty list
        };


        SettingsSvc.getPublisherSettingsById($scope.publisherId).then(function (settings) {
            $scope.publisherSettings = settings;
            $scope.collection.primaryColor = settings.primaryColor;
            $scope.collection.secondaryColor = settings.secondaryColor;
            $scope.collection.headerImageId = settings.headerImageId;

        }, function (x) {
            //if we get here there was a problem with the request to the server
            i18nNotifications.pushForCurrentRoute('collections.crud.error', 'danger', {exception: x});
        });

        $scope.bgstyle = function (color) {

            return {backgroundColor: color, color: invertColor(color)};

        };


        function invertColor(hexTripletColor) {
            var color = hexTripletColor;
            color = color.substring(1); // remove #
            color = parseInt(color, 16); // convert to integer
            color = 0xFFFFFF ^ color; // invert three bytes
            color = color.toString(16); // convert to hex
            color = ("000000" + color).slice(-6); // pad with leading zeros
            color = "#" + color; // prepend #
            return color;
        };
        $scope.removeFeatureImage = function () {
            $scope.collection.featureImageId = "";
        }

        // create an uploader with options
        var ts = new Date();
        var uploaderId = 'featureimage-' + ts.getTime(); //prevent duplicate uploads from other uploaders
        var uploader = $fileUploader.create({
            url: API_BASE_URL + '?action=addFile&publisherId=' + security.publisherId,
            autoUpload: true,
            removeAfterUpload: true,
            uploaderId: uploaderId

        });

        // REGISTER HANDLERS

        uploader.bind('afteraddingfile' + uploaderId, function (event, item) {
            console.log('After adding a file', item);
        });

        uploader.bind('afteraddingall' + uploaderId, function (event, items) {
            console.log('After adding all files', items);
        });

        uploader.bind('changedqueue' + uploaderId, function (items) {
            var dummy = $scope.$$phase || $scope.$apply();
        });

        uploader.bind('beforeupload' + uploaderId, function (event, item) {
            console.log('Before upload', item);
        });

        uploader.bind('progress' + uploaderId, function (event, item, progress) {
            console.log('Progress: ' + progress);
        });

        uploader.bind('success' + uploaderId, function (event, xhr, item) {
            console.log('Success: ' + xhr.response);
        });

        uploader.bind('complete' + uploaderId, function (event, xhr, item) {
            console.log(uploaderId);
            console.log('Complete: ' + xhr.response);

            if (xhr.status === 200) {
                var responseObj = JSON.parse(xhr.response);

                var featureImageid = responseObj.data.uploadId;
                var error = responseObj['error-code'];
                if (featureImageid > -1) {
                    $scope.collection.featureImageId = featureImageid;
                } else {
                    //if we get here there was a problem with the request to the server
                    i18nNotifications.pushForCurrentRoute('collections.crud.error', 'danger', {exception: x});
                }
            }

        });

        uploader.bind('progressall' + uploaderId, function (event, progress) {
            console.log('Total progress: ' + progress);
            var dummy = $scope.$$phase || $scope.$apply();
        });

        uploader.bind('completeall' + uploaderId, function (event, items) {
            console.log('All files are transferred');
            var dummy = $scope.$$phase || $scope.$apply();

        });

        $scope.uploader = uploader;

        // create an uploader with options
        var ts = new Date();
        var headerUploadId = 'headerimage-' + ts.getTime(); //prevent duplicate uploads from other uploaders
        var headerUploader = $fileUploader.create({
            //url: 'http://localhost:3000/cyclades/ccts?action=addFile',
            // url: 'http://services-dev-01.highwire.org/ccts?action=addFile',
            url: API_BASE_URL + '?action=addFile&publisherId=' + security.publisherId,
            autoUpload: true,
            removeAfterUpload: true,
            uploaderId: headerUploadId

        });

        // REGISTER HANDLERS

        headerUploader.bind('afteraddingfile' + headerUploadId, function (event, item) {
            console.log('After adding a file', item);
        });

        headerUploader.bind('afteraddingall' + headerUploadId, function (event, items) {
            console.log('After adding all files', items);
        });

        headerUploader.bind('changedqueue' + headerUploadId, function (items) {
            var dummy = $scope.$$phase || $scope.$apply();
        });

        headerUploader.bind('beforeupload' + headerUploadId, function (event, item) {
            console.log('Before upload', item);
        });

        headerUploader.bind('progress' + headerUploadId, function (event, item, progress) {
            console.log('Progress: ' + progress);
        });

        headerUploader.bind('success' + headerUploadId, function (event, xhr, item) {
            console.log('Success: ' + xhr.response);
        });

        headerUploader.bind('complete' + headerUploadId, function (event, xhr, item) {
            console.log(headerUploadId);
            console.log('Complete: ' + xhr.response);

            if (xhr.status === 200) {
                var responseObj = JSON.parse(xhr.response);

                var headerImageId = responseObj.data.uploadId;
                var error = responseObj['error-code'];
                if (headerImageId > -1) {
                    $scope.collection.headerImageId = headerImageId;
                } else {
                    //if we get here there was a problem with the request to the server
                    i18nNotifications.pushForCurrentRoute('collections.crud.error', 'danger', {exception: x});
                }
            }

        });

        headerUploader.bind('progressall' + headerUploadId, function (event, progress) {
            console.log('Total progress: ' + progress);
            var dummy = $scope.$$phase || $scope.$apply();
        });

        headerUploader.bind('completeall' + headerUploadId, function (event, items) {
            console.log('All files are transferred');
            var dummy = $scope.$$phase || $scope.$apply();

        });

        $scope.headerUploader = headerUploader;

        //REMOVE COLLECTION NAME DUPLICATES
        $scope.strInd=function(){
            var collectionsName = $rootScope.collectionsName;//stores all collection names as in $scope.init()
            var editCollName = $scope.collection.name.toLowerCase();
            var collectionsNameLowCase=new Array();
            
            for (var i in $rootScope.collectionsName)                
            {
                // console.log("Check");
                collectionsNameLowCase[i]=$rootScope.collectionsName[i].toLowerCase();                
            }
            $rootScope.indOrg = collectionsNameLowCase.indexOf(editCollName);
        }

        //STORE CITATION FORMATS FOR PUBLISHING COLLECTION
        $rootScope.strFrm=[];
        $scope.citForm = function(citations){
            // var cituri = encodeURIComponent(citations);
            $rootScope.strFrm.push(citations);
            console.log($scope.collection);                           
        }

        $scope.addCollection = function (form) {

            var strNames=$cookies.collNames;
            console.log(strNames);
            console.log($cookies.collNames);
            var dupCnt=0;
            $scope.chkDup=false;
            var collNameArr = strNames.split(",");
            var collectionsNameLowCase=new Array();
      
            for(var i in collNameArr)                
            {
                collectionsNameLowCase[i]=collNameArr[i].toLowerCase();               
            }
            
            if(form.name.$dirty === false){
                 $scope.chkDup=false;                 
            }
            else if(form.name.$dirty){
                var editCollName = $scope.collection.name.toLowerCase();
                var indEditName = collectionsNameLowCase.indexOf(editCollName);
                var indOrgName = $rootScope.indOrg;
                console.log(indOrgName);
                console.log(indEditName);
                /*if (indOrgName >= 0 && indOrgName === indEditName){
                    $scope.chkDup=false;                    
                }
                else {*/
                    for (var i in collectionsNameLowCase)                
                    {
                        if (collectionsNameLowCase[i] === editCollName)//(angular.equals(collectionsNameLowCase[i],editCollName))
                        {
                            
                            dupCnt++;// $scope.chkDup=true;
                            // form.name.$invalid=true;
                            console.log("Name: " + $scope.collection.name);
                            // break;
                        }                
                    }
               // }
               if(dupCnt>0){
                console.log(dupCnt);
                $scope.chkDup=true;
               }
            }


            //CITATION FORMATS
            var strArtForm=["articleDefault","articleFormat1","articleFormat2"];
            var strBkForm=["bookDefault","bookFormat1","bookFormat2"];
            console.log($rootScope.strFrm);
            if ($rootScope.strFrm.length > 0){
                for (var i = 0; i<strArtForm.length;i++){
                    if ($rootScope.strFrm.indexOf(strArtForm[i]) >= 0){
                        $scope.collection.artCitationFmt = $rootScope.strFrm[$rootScope.strFrm.indexOf(strArtForm[i])];
                        break;
                    }
                    else {
                         $scope.collection.artCitationFmt="articleDefault";
                    }
                }
                for (var j = 0; j< strBkForm.length;j++){
                    if ($rootScope.strFrm.indexOf(strBkForm[j]) >= 0){
                        $scope.collection.bkCitationFmt = $rootScope.strFrm[$rootScope.strFrm.indexOf(strBkForm[j])];
                        break;
                    }
                    else{
                        $scope.collection.bkCitationFmt="bookDefault";
                    }
                }                
            }
            else{
                $scope.collection.artCitationFmt="articleDefault";
                $scope.collection.bkCitationFmt="bookDefault";
            }


            if (form.$valid && $scope.chkDup===false) {

                i18nNotifications.removeAll();

                //add as new
                $scope.analyzing = true;
                $scope.collection.status = 'Unpublished';
                $scope.collection.createdBy = security.currentUser;
                $scope.collection.modifiedBy = security.currentUser;
                $scope.collection.publisherId = security.publisherId;


                var acsCollectionPath;

                var availableStarting = '';
                var dateObj = $('#availableStartDate').datepicker("getDate");
// if ($scope.availableStartDate) {
                if (dateObj) {
                    //var monthNames = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                    // "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
                    var month = dateObj.getMonth() + 1;
                    var date = dateObj.getDate();
                    //var month = monthNames[dateObj.getMonth()];
                    var year = dateObj.getFullYear();
                    availableStarting = month + '/' + date + '/' + year;
                }

                $scope.collection.availableStarting = availableStarting;

                //TODO Remove headerImage requirement completely -- needs service change since it's a required param
                $scope.collection.headerImageId = "";

                //clean up keywords array. Reset id's since the select2 plugin is assigning the text to the id parameters. Id is ignored by the service so it doesn't matter what they are anyways.
                for (var i = 0; i < $scope.collection.keywords.length; i++) {
                    $scope.collection.keywords[i].id = i;
                }

                //convert showKeywords back to boolean
                if ($scope.collection.showKeywords) {
                    $scope.collection.showKeywords = true;
                } else {
                    $scope.collection.showKeywords = false;
                }

                

                Collectionssvc.add($scope.collection, $scope.collection.publisherId)
                    .then(function (result) {
                        if (result.status === 201) {
                            //success - collection created in ADMIN db, but not yet created in ACS
                            $scope.collection.collectionId = result.data.data.collectionId;


                            //create collection in ACS
                            Collectionssvc.createCollection($scope.collection.collectionId, $scope.collection.publisherId).then(function (result) {
                                if (result.status === 200) {

                                    acsCollectionPath = result.acsCollection.acsCollectionPath;
                                    $scope.collection.path = acsCollectionPath;

                                    //populate collection
                                    Collectionssvc.populateCollection($scope.collection.collectionId, $scope.collection.publisherId).then(function (result) {
                                        if (result.status === 200) {

                                            //generate RSS feed
                                            Collectionssvc.createRSS($scope.collection.collectionId, $scope.publisherId).then(function (result) {

                                                if (result.status === 200) {

                                                    //index collection
                                                    Collectionssvc.indexCollection($scope.collection, $scope.publisherId).then(function (result) {
                                                        if (result.status === 200) {
                                                            // Set price in ecommerce catalog if not free
                                                            if ($scope.collection.ecommerceEnabled === "true") {
                                                                var catalogProductItem = new Object();
                                                                catalogProductItem.atompath = acsCollectionPath;

                                                                //TODO hardcoded publisher ID
                                                                catalogProductItem.publisher = 'dupjnls';
                                                                catalogProductItem.price = $scope.collection.individualPrice;
                                                                catalogProductItem.duration = $scope.collection.individualDuration;
                                                                catalogProductItem.category = 'collection';
                                                                CatalogSvc.createProductItem(catalogProductItem, security.publisherId).then(function (result) {
                                                                    if (result.status === 200) {
                                                                        //final cleanup and redirect
                                                                        Collectionssvc.reset();
                                                                        $location.path("/collections/success/" + $scope.collection.collectionId);
                                                                    } else {
                                                                        i18nNotifications.pushForCurrentRoute('collections.crud.error', 'danger', {exception: result});
                                                                        console.log(result);
                                                                        $scope.analyzing = false;
                                                                    }

                                                                }, function (x) {
                                                                    i18nNotifications.pushForCurrentRoute('collections.rss.error', 'danger', {exception: x});
                                                                    $scope.analyzing = false;
                                                                });
                                                                //end catalog price
                                                            } else {

                                                                // Free collection. No need to set price in catalog. Final cleanup and redirect
                                                                Collectionssvc.reset();
                                                                $location.path("/collections/success/" + $scope.collection.collectionId);
                                                            }
                                                        } else {
                                                            i18nNotifications.pushForCurrentRoute('collections.crud.error', 'danger', {exception: result});
                                                            console.log(result);
                                                            $scope.analyzing = false;
                                                        }
                                                    }, function (x) {
                                                        //problem with request - INDEXER
                                                        i18nNotifications.pushForCurrentRoute('collections.crud.error', 'danger', {exception: x});
                                                        $scope.analyzing = false;
                                                    });


                                                } else {
                                                    i18nNotifications.pushForCurrentRoute('collections.rss.error', 'danger', {exception: result});
                                                    console.log(result);
                                                    $scope.analyzing = false;
                                                }
                                            }, function (x) {
                                                //problem with request - RSS
                                                i18nNotifications.pushForCurrentRoute('collections.rss.error', 'danger', {exception: x});
                                                $scope.analyzing = false;
                                            });
                                            // end RSS feed


                                        } else {
                                            i18nNotifications.pushForCurrentRoute('collections.crud.error', 'danger', {exception: result});
                                            console.log(result);
                                            $scope.analyzing = false;
                                        }
                                    });


                                } else {
                                    i18nNotifications.pushForCurrentRoute('collections.crud.error', 'danger', {exception: result});
                                    console.log(result);
                                    $scope.analyzing = false;
                                }

                            }, function (x) {
                                //problem with request
                                i18nNotifications.pushForCurrentRoute('collections.crud.error', 'danger', {exception: x});
                                $scope.analyzing = false;
                            });
                            //end collection ACS


                        } else {
                            i18nNotifications.pushForCurrentRoute('collections.crud.error', 'danger', {exception: result});
                            console.log(result);
                            $scope.analyzing = false;
                        }
                    }, function (x) {
                        //if we get here there was a problem with the request to the server
                        i18nNotifications.pushForCurrentRoute('collections.crud.error', 'danger', {exception: x});
                        $scope.analyzing = false;
                    });

            } else {


                //form invalid. View should show required fields
            }
        };

    }])
    .controller('CollectionsEditCtrl', ['$scope', '$rootScope', '$routeParams', 'Collectionssvc', 'security', 'titleService', 'CatalogSvc', 'i18nNotifications', 'API_BASE_URL', '$fileUploader', '$location','$cookies', '$timeout', '$resource' ,function ($scope, $rootScope, $routeParams, Collectionssvc, security, titleService, CatalogSvc, i18nNotifications, API_BASE_URL, $fileUploader, $location, $cookies,$timeout, $resource) {
        titleService.setTitle('Edit Collection');
        var collectionId = $routeParams.collectionId;
        $scope.goBack = function () {
            window.history.back();
        };
        $scope.editing = true;
        $scope.viewType = 'edit'; // 'edit', 'saving', or 'success'
        $scope.publisherId = security.publisherId;
        $scope.apiBaseUrl = API_BASE_URL;
        $scope.collectionAction = 'update'; //publish or update -- this helps us know which buttons and actions to use in collectionEditor template
        $scope.originalRSSId;
        $scope.originalLPId;
        $scope.originalName;
        $scope.availableStartDate;
        $scope.collection = {};
        $scope.collection.showKeywords = false;

        Collectionssvc.getCollectionById(collectionId, security.publisherId).then(function (result) {
            $scope.collection = result;
            console.log($scope.collection);
            $scope.originalName = result.name;
            $scope.originalRSSId = result.rssId;
            $scope.originalLPId = result.landingPageId;
            $scope.collection.individualDuration = result.individualAvailability;

            if (result.availableStarting) {
                var d = new Date(Date.parse(result.availableStarting));
                $scope.availableStartDate = d;
            }

            //convert showKeywords from byte to boolean
            if ($scope.collection.showKeywords) {
                $scope.collection.showKeywords = true;
            } else {
                $scope.collection.showKeywords = false;
            }

            /*CatalogSvc.getPrice($scope.collection.path, security.publisherId).then(function (catalogResponse) {
                var priceStr;
                if (catalogResponse.data.data['product-item']) {
                    priceStr = catalogResponse.data.data['product-item'].price.amount;
                    var price = Number(priceStr.toString().replace(/[^0-9\.]+/g, ""));
                    $scope.collection.individualPrice = price;
                    $scope.originalEcomStatus = true;
                    $scope.collection.ecommerceEnabled = true;
                } else {
                    $scope.collection.individualPrice = 'eCom Disabled';
                    $scope.collection.ecommerceEnabled = false;
                    $scope.originalEcomStatus = false;

                }

            }, function (x) {
                // Failed to get catalog price
                console.log(x);
            });*/
        }, function (x) {
            //if we get here there was a problem with the request to the server

        });

        
        $scope.tags = [];
        Collectionssvc.getKeywordsByPublisherId(security.publisherId).then(function (keywords) {
            for (var p in keywords) {
                $scope.tags.push(keywords[p].text);
            }
        });
        $scope.select2Options = {
            'multiple': true,
            'simple_tags': false,
            'tokenSeparators': [",", "|"],
            'maximumInputLength': 100,
            'maximumSelectionSize': 10,
            'tags': $scope.tags//can be empty list
        };

        // create an uploader with options
        var ts = new Date();
        var uploaderId = 'featureimage-' + ts.getTime(); //prevent duplicate uploads from other uploaders
        var uploader = $fileUploader.create({
            url: API_BASE_URL + '?action=addFile&publisherId=' + security.publisherId,
            autoUpload: true,
            removeAfterUpload: true,
            uploaderId: uploaderId

        });

        // REGISTER HANDLERS

        uploader.bind('afteraddingfile' + uploaderId, function (event, item) {
            console.log('After adding a file', item);
        });

        uploader.bind('afteraddingall' + uploaderId, function (event, items) {
            console.log('After adding all files', items);
        });

        uploader.bind('changedqueue' + uploaderId, function (items) {
            var dummy = $scope.$$phase || $scope.$apply();
        });

        uploader.bind('beforeupload' + uploaderId, function (event, item) {
            console.log('Before upload', item);
        });

        uploader.bind('progress' + uploaderId, function (event, item, progress) {
            console.log('Progress: ' + progress);
        });

        uploader.bind('success' + uploaderId, function (event, xhr, item) {
            console.log('Success: ' + xhr.response);
        });

        uploader.bind('complete' + uploaderId, function (event, xhr, item) {
            console.log(uploaderId);
            console.log('Complete: ' + xhr.response);

            if (xhr.status === 200) {
                var responseObj = JSON.parse(xhr.response);

                var featureImageid = responseObj.data.uploadId;
                var error = responseObj['error-code'];
                if (featureImageid > -1) {
                    $scope.collection.featureImageId = featureImageid;
                } else {
                    //if we get here there was a problem with the request to the server
                    i18nNotifications.pushForCurrentRoute('collections.crud.error', 'danger', {exception: x});
                }
            }

        });

        uploader.bind('progressall' + uploaderId, function (event, progress) {
            console.log('Total progress: ' + progress);
            var dummy = $scope.$$phase || $scope.$apply();
        });

        uploader.bind('completeall' + uploaderId, function (event, items) {
            console.log('All files are transferred');
            var dummy = $scope.$$phase || $scope.$apply();

        });

        $scope.uploader = uploader;

        $scope.removeFeatureImage = function () {
            $scope.collection.featureImageId = "";
        }

        //REMOVE COLLECTION NAME DUPLICATES
        $scope.strInd=function(){
            var collectionsName = $rootScope.collectionsName;//stores all collection names as in $scope.init()
            var editCollName = $scope.collection.name.toLowerCase();
            var collectionsNameLowCase=new Array();
            
            for (var i in $rootScope.collectionsName)                
            {
                // console.log("Check");
                collectionsNameLowCase[i]=$rootScope.collectionsName[i].toLowerCase();                
            }
            $rootScope.indOrg = collectionsNameLowCase.indexOf(editCollName);
        }  

        //STORE CITATION FORMATS
        $rootScope.strFrm=[];
        $scope.citForm = function(citations){
            // var cituri = encodeURIComponent(citations);
            $rootScope.strFrm.push(citations);
            console.log($scope.collection);                           
        }
        

        $scope.updateCollection = function (form) {            
             
            var currDescr=$cookies.collDescr;       
            var strNames=$cookies.collNames;
            var dupCnt=0;
            $scope.chkDup=false;
            var collNameArr = strNames.split(",");
            var collectionsNameLowCase=new Array();
            console.log(strNames);
      
            for(var i in collNameArr)                
            {
                collectionsNameLowCase[i]=collNameArr[i].toLowerCase();               
            }
            
            if(form.name.$dirty === false){
                 $scope.chkDup=false;                 
            }
            else if(form.name.$dirty){
                var editCollName = $scope.collection.name.toLowerCase();
                var indEditName = collectionsNameLowCase.indexOf(editCollName);
                var indOrgName = $rootScope.indOrg;
                console.log(indOrgName);
                console.log(indEditName);
                /*if (indOrgName >= 0 && indOrgName === indEditName){
                    $scope.chkDup=false;                    
                }
                else {*/
                    for (var i in collectionsNameLowCase)                
                    {
                        if (collectionsNameLowCase[i] === editCollName)//(angular.equals(collectionsNameLowCase[i],editCollName))
                        {
                            
                            dupCnt++;// $scope.chkDup=true;
                            // form.name.$invalid=true;
                            console.log("Name: " + $scope.collection.name);
                            // break;
                        }                
                    }
               // }
               if(dupCnt>0){
                console.log(dupCnt);
                $scope.chkDup=true;
               }
            }

            console.log($scope.collection.artCitationFmt);
            

            console.log($scope.chkDup);
            console.log(form.name.$dirty);
            console.log(form.name.$invalid);
            console.log(form.$valid);
            
            //Citation Formats
            console.log($rootScope.strFrm);
            var strArtForm=["articleDefault","articleFormat1","articleFormat2"];
            var strBkForm=["bookDefault","bookFormat1","bookFormat2"];
            $scope.landingPgUrl;
            for (var i = 0; i<strArtForm.length;i++){
                if ($rootScope.strFrm.indexOf(strArtForm[i]) >= 0){
                    $scope.collection.artCitationFmt = $rootScope.strFrm[$rootScope.strFrm.indexOf(strArtForm[i])];
                    break;
                }
            }

            for (var j = 0; j< strBkForm.length;j++){
                if ($rootScope.strFrm.indexOf(strBkForm[j]) >= 0){
                    $scope.collection.bkCitationFmt = $rootScope.strFrm[$rootScope.strFrm.indexOf(strBkForm[j])];
                    break;
                }
            }          

            //console.log($rootScope.collectionsName);
            if (form.$valid && $scope.chkDup===false) {

                i18nNotifications.removeAll();
                $scope.collection.createdBy = security.currentUser;
                $scope.collection.modifiedBy = security.currentUser;
                $scope.collection.publisherId = security.publisherId;

                $scope.viewType = 'saving';
                if (!$scope.collection.featureImageId) {
                    $scope.collection.featureImageId = "";
                }
                var availableStarting = '';
                var dateObj = $('#availableStartDate').datepicker("getDate");
// if ($scope.availableStartDate) {
                if (dateObj) {
                    //availableStarting = $scope.availableStartDate.val();

                    //var monthNames = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                    // "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
                    var month = dateObj.getMonth() + 1;
                    var date = dateObj.getDate();
                    //var month = monthNames[dateObj.getMonth()];
                    var year = dateObj.getFullYear();
                    availableStarting = month + '/' + date + '/' + year;
                }

                $scope.collection.availableStarting = availableStarting;

                //TODO Remove headerImage requirement completely -- needs service change since it's a required param
                $scope.collection.headerImageId = "";

                //clean up keywords array. Reset id's since the select2 plugin is assigning the text to the id parameters. Id is ignored by the service so it doesn't matter what they are anyways.
                for (var i = 0; i < $scope.collection.keywords.length; i++) {
                    $scope.collection.keywords[i].id = i;
                }

                //convert showKeywords back to boolean
                if ($scope.collection.showKeywords) {
                    $scope.collection.showKeywords = true;
                } else {
                    $scope.collection.showKeywords = false;
                }

                console.log($scope.collection);               
                if(currDescr !== $scope.collection.description){          
                    Collectionssvc.save($scope.collection, security.publisherId).then(function (result) {
                        console.log($scope.collection);                   
                            if (result.status === 200) {                         
                                //success
                                Collectionssvc.createRSS($scope.collection.collectionId, $scope.publisherId).then(function (result) {

                                   if (result.status === 200) {
                                //re-index collection
                                    Collectionssvc.indexCollection($scope.collection, security.publisherId).then(function (result) {
                                        if (result.status === 200) {
                                            // Set price in ecommerce catalog if not free
                                            if ($scope.collection.ecommerceEnabled) {
                                                var catalogProductItem = new Object();
                                                catalogProductItem.atompath = $scope.collection.path;

                                                //TODO hardcoded publisher ID
                                                catalogProductItem.publisher = 'dupjnls';
                                                catalogProductItem.price = $scope.collection.individualPrice;
                                                catalogProductItem.duration = $scope.collection.individualDuration;
                                                catalogProductItem.category = 'collection';

                                                if ($scope.originalEcomStatus) {
                                                    //ecom was originally enabled so we need to call updateProductItem
                                                    CatalogSvc.updateProductItem(catalogProductItem, security.publisherId).then(function (result) {
                                                        if (result.status === 200) {
                                                            //final cleanup and redirect
                                                            Collectionssvc.reset();
                                                            $scope.viewType = 'success';
                                                        } else {
                                                            i18nNotifications.pushForCurrentRoute('collections.crud.error', 'danger', {exception: result});
                                                            console.log(result);
                                                            $scope.analyzing = false;
                                                            $scope.viewType = 'edit';
                                                        }

                                                    }, function (x) {
                                                        i18nNotifications.pushForCurrentRoute('collections.rss.error', 'danger', {exception: x});
                                                        $scope.analyzing = false;
                                                        $scope.viewType = 'edit';
                                                    });
                                                } else {
                                                    //new ecom item to call createProductItem
                                                    CatalogSvc.createProductItem(catalogProductItem, security.publisherId).then(function (result) {
                                                        if (result.status === 200) {
                                                            //final cleanup and redirect
                                                            Collectionssvc.reset();
                                                            $scope.viewType = 'success';
                                                        } else {
                                                            i18nNotifications.pushForCurrentRoute('collections.crud.error', 'danger', {exception: result});
                                                            console.log(result);
                                                            $scope.analyzing = false;
                                                            $scope.viewType = 'edit';
                                                        }

                                                    }, function (x) {
                                                        i18nNotifications.pushForCurrentRoute('collections.rss.error', 'danger', {exception: x});
                                                        $scope.analyzing = false;
                                                        $scope.viewType = 'edit';
                                                    });
                                                }
                                                //end catalog price
                                            } else {
                                                //final cleanup and redirect
                                                Collectionssvc.reset();
                                                $scope.viewType = 'success';
                                            }

                                        } else {
                                            i18nNotifications.pushForCurrentRoute('collections.crud.error', 'danger', {exception: result});
                                            console.log(result);
                                            $scope.analyzing = false;
                                        }
                                }, function (x) {
                                    //problem with request - INDEXER
                                    i18nNotifications.pushForCurrentRoute('collections.crud.error', 'danger', {exception: x});
                                    $scope.analyzing = false;
                                });
                            } else {
                                i18nNotifications.pushForCurrentRoute('collections.rss.error', 'danger', {exception: result});
                                console.log(result);
                                $scope.viewType = 'csv';
                            }
                        }, function (x) {
                            //problem with request - RSS
                            i18nNotifications.pushForCurrentRoute('collections.rss.error', 'danger', {exception: x});
                            $scope.viewType = 'csv';
                        });
                        // end RSS feed
                             } else {
                                i18nNotifications.pushForCurrentRoute('collections.crud.error', 'danger', {exception: result});
                                console.log(result);
                                $scope.viewType = 'edit';
                            }
                        },
                        function (x) {
                            //if we get here there was a problem with the request to the server
                            i18nNotifications.pushForCurrentRoute('collections.crud.error', 'danger', {exception: x});
                            $scope.viewType = 'edit';
                        });
                }
                else{
                    Collectionssvc.save($scope.collection, security.publisherId).then(function (result) {
                        console.log($scope.collection);                   
                            if (result.status === 200) {                         
                                //success                               
                                //re-index collection
                                    Collectionssvc.indexCollection($scope.collection, security.publisherId).then(function (result) {
                                        if (result.status === 200) {
                                            // Set price in ecommerce catalog if not free
                                            if ($scope.collection.ecommerceEnabled) {
                                                var catalogProductItem = new Object();
                                                catalogProductItem.atompath = $scope.collection.path;

                                                //TODO hardcoded publisher ID
                                                catalogProductItem.publisher = 'dupjnls';
                                                catalogProductItem.price = $scope.collection.individualPrice;
                                                catalogProductItem.duration = $scope.collection.individualDuration;
                                                catalogProductItem.category = 'collection';

                                                if ($scope.originalEcomStatus) {
                                                    //ecom was originally enabled so we need to call updateProductItem
                                                    CatalogSvc.updateProductItem(catalogProductItem, security.publisherId).then(function (result) {
                                                        if (result.status === 200) {
                                                            //final cleanup and redirect
                                                            Collectionssvc.reset();
                                                            $scope.viewType = 'success';
                                                        } else {
                                                            i18nNotifications.pushForCurrentRoute('collections.crud.error', 'danger', {exception: result});
                                                            console.log(result);
                                                            $scope.analyzing = false;
                                                            $scope.viewType = 'edit';
                                                        }

                                                    }, function (x) {
                                                        i18nNotifications.pushForCurrentRoute('collections.rss.error', 'danger', {exception: x});
                                                        $scope.analyzing = false;
                                                        $scope.viewType = 'edit';
                                                    });
                                                } else {
                                                    //new ecom item to call createProductItem
                                                    CatalogSvc.createProductItem(catalogProductItem, security.publisherId).then(function (result) {
                                                        if (result.status === 200) {
                                                            //final cleanup and redirect
                                                            Collectionssvc.reset();
                                                            $scope.viewType = 'success';
                                                        } else {
                                                            i18nNotifications.pushForCurrentRoute('collections.crud.error', 'danger', {exception: result});
                                                            console.log(result);
                                                            $scope.analyzing = false;
                                                            $scope.viewType = 'edit';
                                                        }

                                                    }, function (x) {
                                                        i18nNotifications.pushForCurrentRoute('collections.rss.error', 'danger', {exception: x});
                                                        $scope.analyzing = false;
                                                        $scope.viewType = 'edit';
                                                    });
                                                }
                                                //end catalog price
                                            } else {
                                                //final cleanup and redirect
                                                Collectionssvc.reset();
                                                $scope.viewType = 'success';
                                            }

                                        } else {
                                            i18nNotifications.pushForCurrentRoute('collections.crud.error', 'danger', {exception: result});
                                            console.log(result);
                                            $scope.analyzing = false;
                                        }
                                }, function (x) {
                                    //problem with request - INDEXER
                                    i18nNotifications.pushForCurrentRoute('collections.crud.error', 'danger', {exception: x});
                                    $scope.analyzing = false;
                                });                            
                             } else {
                                i18nNotifications.pushForCurrentRoute('collections.crud.error', 'danger', {exception: result});
                                console.log(result);
                                $scope.viewType = 'edit';
                            }
                        },
                        function (x) {
                            //if we get here there was a problem with the request to the server
                            i18nNotifications.pushForCurrentRoute('collections.crud.error', 'danger', {exception: x});
                            $scope.viewType = 'edit';
                        });
                }

                                   

            }
            ;
            
        };


    }])
    .controller('CollectionsEditMembersCtrl', ['$scope', '$routeParams', 'Collectionssvc', 'security', 'titleService', 'CatalogSvc', 'i18nNotifications', 'API_BASE_URL', '$fileUploader', '$location', 'Validate', '$timeout', function ($scope, $routeParams, Collectionssvc, security, titleService, CatalogSvc, i18nNotifications, API_BASE_URL, $fileUploader, $location, Validate, $timeout) {
        titleService.setTitle('Edit Collection Members');
        var collectionId = $routeParams.collectionId;
        $scope.collection;
        $scope.newMemberId = '';
        $scope.addingMember = false;
        $scope.uploadedCsv = false;

        $scope.viewType = 'csv'; //csv, uploading, uploadedErrors, uploadedClean, analyzing

        $scope.publisherId = security.publisherId;
        $scope.apiBaseUrl = API_BASE_URL;
        $scope.goBack = function () {
            window.history.back();
        };

        Collectionssvc.getCollectionById(collectionId, security.publisherId).then(function (result) {
            $scope.collection = result;
            validateMembers($scope.collection.members, true, false);


        }, function (x) {
            //if we get here there was a problem with the request to the server

        });

        // create a uploader with options
        var ts = new Date();
        var uploaderId = 'csv-' + ts.getTime(); //prevent duplicate uploads from other uploaders
        var uploader = $fileUploader.create({
            url: API_BASE_URL + '?action=validatecsv&text-query=true&publisherId=' + security.publisherId + '&pubid=' + security.publisherId,
            autoUpload: true,
            removeAfterUpload: true,
            uploaderId: uploaderId
        });

        // REGISTER HANDLERS

        uploader.bind('afteraddingfile' + uploaderId, function (event, item) {
            console.log('After adding a file', item);
            $scope.viewType = 'uploading';
        });

        uploader.bind('afteraddingall' + uploaderId, function (event, items) {
            console.log('After adding all files', items);
        });

        uploader.bind('changedqueue' + uploaderId, function (items) {
            var dummy = $scope.$$phase || $scope.$apply();
        });

        uploader.bind('beforeupload' + uploaderId, function (event, item) {
            console.log('Before upload', item);
            //skip to processing view since Firefox doesn't handle small files well with regards to xhr progress event
            if (isFirefox) {
                $scope.viewType = 'analzying';

                var dummy = $scope.$$phase || $scope.$apply();
            }
        });

        uploader.bind('progress' + uploaderId, function (event, item, progress) {
            console.log('Progress: ' + progress);
        });

        uploader.bind('success' + uploaderId, function (event, xhr, item) {
            console.log('Success: ' + xhr.response);
        });

        uploader.bind('complete' + uploaderId, function (event, xhr, item) {
            console.log(uploaderId);
            //console.log('Complete: ' + xhr.response);

            i18nNotifications.removeAll();
            if (xhr.response) {
                var response = JSON.parse(xhr.response);
                var errorCode = parseInt(response['error-code']);
                var errorMessage = response.data.error;
                var nyxletStatus = response.data.status;
                var validMembers;
                var invalidMembers;
                if (xhr.status !== 200 || errorCode > 0 || nyxletStatus !== 200) {
                    //something went wrong
                    $scope.viewType = 'csv';

                    $scope.validMembersCount = 0;
                    $scope.invalidMembersCount = 0;
                    $scope.$apply();
                    if (errorMessage) {
                        //display returned error message
                        i18nNotifications.pushForCurrentRoute('collections.csv.error', 'danger', {exception: errorMessage});
                    } else {
                        //generic error message
                        i18nNotifications.pushForCurrentRoute('generic.serverError', 'danger');
                    }
                } else {
                    //Validate call was successful. Process results

                    $scope.validMembersCount = response.data['num-valid'];
                    validMembers = response.data['valid-members'];

                    $scope.invalidMembersCount = response.data['num-invalid'];

                    invalidMembers = response.data['invalid-members'];
                    $scope.collection.members = $scope.collection.members.concat(validMembers).concat(invalidMembers);

                    $scope.totalMembers = $scope.validMembersCount + $scope.invalidMembersCount;

                    $scope.uploadErrors = ($scope.invalidMembersCount > 0);

                    $scope.viewType = 'analyzing';

                    // Loop through each member and set order #. For now it will just be line #
                    // Also call citation service and attach citation
                    $scope.collection.members.sort(function (a, b) {
                        return a.line - b.line;
                    });
                    for (var i = 0; i < $scope.collection.members.length; i++) {
                        $scope.collection.members[i].sortOrder = $scope.collection.members[i].line;

                    }
                    validateMembers($scope.collection.members, false, true);
                    $scope.uploadedCsv = true;
                    $scope.$apply();


                }
            } else {
                //didn't get a valid response from server
                //something went wrong
                $scope.viewType = 'csv';
                $scope.validMembers = null;
                $scope.invalidMembers = null;
                $scope.validMembersCount = 0;
                $scope.invalidMembersCount = 0;

                $scope.$apply();
                i18nNotifications.pushForCurrentRoute('generic.serverError', 'danger', {exception: JSON.stringify(xhr)});
            }

        });

        uploader.bind('progressall' + uploaderId, function (event, progress) {
            console.log('Total progress: ' + progress);
            if (progress >= 100) {
                $scope.viewType = 'analyzing';
            }
            var dummy = $scope.$$phase || $scope.$apply();

        });

        uploader.bind('completeall' + uploaderId, function (event, items) {
            console.log('All files are transferred');
            var dummy = $scope.$$phase || $scope.$apply();

        });
        $scope.uploader = uploader;
        //jqueryUI sortable options
        $scope.sortableOptions = {
            cursor: 'move'
        }
        $scope.setFilter = function (filter) {
            //'errors' or 'all'
            $scope.filterType = filter;
        }
        $scope.setFilter('all'); //set initial filter
        $scope.filterByType = function (item) {
            if ($scope.filterType === 'errors') {
                if (item.error) {
                    return true;
                }
            }
            if ($scope.filterType === 'all') {

                return true;

            }
        };
        $scope.isFilteredByError = function () {
            if ($scope.filterType === 'errors') {
                return true;
            } else {
                return false;
            }
        }
        $scope.isFilteredByAll = function () {
            if ($scope.filterType === 'all') {
                return true;
            } else {
                return false;
            }
        }
        $scope.deleteMember = function (member) {
            console.log('deleting member: ' + JSON.stringify(member));
            var index = $scope.collection.members.indexOf(member);
            if (index != -1) {
                $scope.collection.members.splice(index, 1);
            }

        };
        $scope.addNewMember = function () {
            $scope.addingMember = true;
            $scope.addMemberResultString = 'Validating...';
            Validate.validateId($scope.newMemberId, $scope.publisherId).then(function (response) {
                console.log(response);
                if (response.data['num-valid'] === 1) {
                    //successfully validated. Add member to collection.members
                    var memberToAdd = {};
                    memberToAdd.uri = response.data['valid-members'][0].uri;
                    memberToAdd.id = response.data['valid-members'][0].id;
                    memberToAdd.idType = response.data['valid-members'][0].idType;
                    memberToAdd.line = response.data['valid-members'][0].line;

                    //call citation service to get title
                    if (memberToAdd.uri) {
                        Collectionssvc.getMemberCitation(memberToAdd.uri, $scope.publisherId).then(function (citation) {
                            memberToAdd.citation = citation.data.citation;
                            $scope.collection.members.push(memberToAdd);
                            validateMembers($scope.collection.members);
                            $scope.addMemberResultString = 'Successfully added to collection';
                            $timeout(function () {
                                $scope.addingMember = false;
                            }, 3000);

                        });
                    } else {
                        //invalid member. Display error
                        //display this for a few seconds, then show input again
                        $scope.addMemberResultString = 'Unable to get citation';

                        $timeout(function () {
                            $scope.addingMember = false;
                        }, 3000);

                    }
                } else {

                    //didn't validate. Display error
                    if (response.data['num-invalid'] === 1) {
                        //check if we have a valid 'error' message to display
                        $scope.addMemberResultString = response.data['invalid-members'][0].error;
                        $timeout(function () {
                            $scope.addingMember = false;
                        }, 3000);
                    } else {
                        //just display generic error
                        //display this for a few seconds, then show input again
                        $scope.addMemberResultString = 'Unable to get citation';
                        $timeout(function () {
                            $scope.addingMember = false;
                        }, 3000);
                    }

                }
            }, function (e) {
                console.log(JSON.stringify(e));
                //display this for a few seconds, then show input again
                $scope.addMemberResultString = 'Unable to get citation';
                $timeout(function () {
                    $scope.addingMember = false;
                }, 3000);
            });
        };
        $scope.$watch('collection', function (newCollection, oldCollection) {
            //console.log(newMembers);
            //save to local storage each time model changes
            Collectionssvc.saveLocal(newCollection);
            //also update counts
            var validMembersCount = 0;
            var invalidMembersCount = 0;
            if (newCollection) {
                for (var i = 0; i < newCollection.members.length; i++) {
                    if (newCollection.members[i].uri && !newCollection.members[i].error) {
                        //assume it is valid if it has uri
                        validMembersCount++;
                    } else {
                        invalidMembersCount++;
                    }
                }
                $scope.totalMembers = newCollection.members.length;
                $scope.validMembersCount = validMembersCount;
                $scope.invalidMembersCount = invalidMembersCount;
            }


            //update lead text if not a new collection
            if ($scope.totalMembers > 0
                ) {
                if (!$scope.invalidMembersCount > 0) {
                    $scope.lead = '';

                } else {
                    $scope.lead = 'Some of the uploaded items have problems!';

                }
            }
            if ($scope.uploadedCsv) {
                if (!$scope.invalidMembersCount > 0) {
                    $scope.viewType = 'uploadedClean';
                } else {
                    $scope.viewType = 'uploadedErrors';
                }
            }
        }, true);


        $scope.updateCollectionMembers = function () {
            i18nNotifications.removeAll();
            $scope.collection.createdBy = security.currentUser;
            $scope.collection.modifiedBy = security.currentUser;
            $scope.collection.publisherId = security.publisherId;


            $scope.viewType = 'saving';
            if (!$scope.collection.featureImageId) {
                $scope.collection.featureImageId = "";
            }
            var availableStarting = '';
            if ($scope.availableStartDate) {
                //availableStarting = $scope.availableStartDate.val();
                var dateObj = $('#availableStartDate').datepicker("getDate");
                //var monthNames = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                // "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
                var month = dateObj.getMonth() + 1;
                var date = dateObj.getDate();
                //var month = monthNames[dateObj.getMonth()];
                var year = dateObj.getFullYear();
                availableStarting = month + '/' + date + '/' + year;
            }
            $scope.collection.availableStarting = availableStarting;

            //TODO Remove headerImage requirement completely -- needs service change since it's a required param
            $scope.collection.headerImageId = "";


            var len = $scope.collection.members.length;
            console.log(len);
            console.log($scope.collection.members);
            while (len--) {
                //remove all invalid entries
                if ($scope.collection.members[len].error || !$scope.collection.members[len].uri) {
                    $scope.collection.members.splice(len, 1);
                }
            }
            console.log($scope.collection);

            Collectionssvc.updateCollectionMembers($scope.collection, security.publisherId).then(function (result) {
                    if (result.status === 200) {
                        //success, now generate RSS feed
                        //generate RSS feed
                        Collectionssvc.createRSS($scope.collection.collectionId, $scope.publisherId).then(function (result) {

                            if (result.status === 200) {
                                //success, now call synchmembers
                                Collectionssvc.synchMembers($scope.collection.collectionId, $scope.publisherId).then(function (result) {

                                    if (result.status === 200 && result.data.data.collectionStatus === 'Published') {
                                        //success
                                        $location.path("/collections/details/" + collectionId);

                                    } else {
                                        i18nNotifications.pushForCurrentRoute('collections.crud.error', 'danger', {exception: result});
                                        console.log(result);
                                        $scope.viewType = 'csv';
                                    }
                                }, function (x) {
                                    //problem with request - RSS
                                    i18nNotifications.pushForCurrentRoute('collections.crud.error', 'danger', {exception: x});
                                    $scope.viewType = 'csv';
                                });


                            } else {
                                i18nNotifications.pushForCurrentRoute('collections.rss.error', 'danger', {exception: result});
                                console.log(result);
                                $scope.viewType = 'csv';
                            }
                        }, function (x) {
                            //problem with request - RSS
                            i18nNotifications.pushForCurrentRoute('collections.rss.error', 'danger', {exception: x});
                            $scope.viewType = 'csv';
                        });
                        // end RSS feed


                    } else {
                        i18nNotifications.pushForCurrentRoute('collections.crud.error', 'danger', {exception: result});
                        console.log(result);
                        $scope.viewType = 'csv';
                    }
                },
                function (x) {
                    //if we get here there was a problem with the request to the server
                    i18nNotifications.pushForCurrentRoute('collections.crud.error', 'danger', {exception: x});
                    $scope.viewType = 'csv';
                });
        };


        //helpers
        function validateMembers(members, setFilter, setViewType) {
            //Get citation for each member
            asyncLoop(members.length, function (loop) {
                if (members[loop.iteration()].uri) {
                    Collectionssvc.getMemberCitation(members[loop.iteration()].uri, security.publisherId).then(function (response) {
                        members[loop.iteration()].citation = response.data.citation;
                        //check if it's a duplicate
                        for (var i = 0; i < members.length; i++) {
                            if (members[i].uri === members[loop.iteration()].uri && i !== loop.iteration() && i > loop.iteration()) {
                                //duplicate
                                $scope.collection.members[i].error = 'duplicate';
                                $scope.invalidMembersCount++;

                                break;
                            }
                        }
                        loop.next();
                    });
                } else {
                    //invalid member
                    loop.next();
                }
            }, function () {
                console.log('citation cycle ended');
                if (setFilter) {
                    if ($scope.invalidMembersCount) {
                        $scope.setFilter('errors');

                    } else {
                        $scope.setFilter('all');

                    }
                }
                if (setViewType) {
                    if ($scope.invalidMembersCount) {
                        $scope.viewType = 'uploadedErrors';
                    } else {
                        $scope.viewType = 'uploadedClean';
                    }
                }
            });

        }

        function asyncLoop(iterations, func, callback) {
            var index = 0;
            var done = false;
            var loop = {
                next: function () {
                    if (done) {
                        return;
                    }

                    if (index < iterations) {
                        index++;
                        func(loop);

                    } else {
                        done = true;
                        callback();
                    }
                },

                iteration: function () {
                    return index - 1;
                },

                break: function () {
                    done = true;
                    callback();
                }
            };
            loop.next();
            return loop;
        }

    }])

;

