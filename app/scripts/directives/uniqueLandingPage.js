'use strict';
/*
This directive will load all collections for a publisher, and validate whether or not that landing page has already been used
 */
angular.module('directives.uniqueLandingPage', ['services.collections', 'security.service'])
    .directive('uniqueLandingPage', ['Collectionssvc', 'security', '$timeout', function (Collectionssvc, security, $timeout) {
        return {
            require: 'ngModel',
            scope: false,
            link: function (scope, element, attrs, ngModelCtrl) {
                var original;
                var nameHasChanged = false;

                // Create a cache to store all of the current collections so we don't have to make a server call for every letter typed into the input to validate
                // initialize as false until async request finishes
                var lpCache = false;
                Collectionssvc.getCollections(security.publisherId).then(function (result) {
                    lpCache = result;
                }, function (x) {
                    //failed request to server
                });


                ngModelCtrl.$formatters.unshift(function (modelValue) {
                    original = modelValue;
                    return modelValue;
                });

                ngModelCtrl.$parsers.push(function (viewValue) {
                    var slug = getSlug(viewValue);

                    // Iterate through lpCache to check if landingPageId exists
                    var exists = false;
                    for (var key in lpCache) {
                        if (lpCache[key].landingPageId === slug) {
                            exists = true;
                            break;
                        }
                    }

                    if (!exists) {
                        ngModelCtrl.$setValidity('landingPageId', true);
                    } else if (exists && slug === scope.originalLPId) {
                        //we have a returned collection, but it is the same name so that's ok
                        ngModelCtrl.$setValidity('landingPageId', true);
                    } else {
                        ngModelCtrl.$setValidity('landingPageId', false);
                    }

                    //truncate to limit chars
                    slug = slug.substring(0, 200);
                    return slug;
                });

                //watch for name changes to update rss/lp fields based on collection name
                scope.$watch('collection.name', function (name) {


                    // Only want this functionality when creating, not editing collection
                    if (!scope.editing) {
                        if (name && name !== scope.originalName) {
                            nameHasChanged = true;
                        }
                        if (name && nameHasChanged) {

                            var slug = getSlug(name).substring(0, 200);
                            scope.collection.landingPageId = slug;
                            $timeout(function () {
                                // anything you want can go here and will safely be run on the next digest.

                                if (scope.originalLPId === slug) {
                                    //if it's equal to the original, that's ok, but this should only happen when editing

                                    scope.publishForm.landingPageId.$setValidity("landingPageId", true);

                                } else {
                                    if (!scope.editing) {
                                        scope.publishForm.landingPageId.$setViewValue(slug);
                                    }

                                    // Iterate through lpCache to check if landingPageId exists
                                    var exists = false;
                                    for (var key in lpCache) {
                                        if (lpCache[key].landingPageId === slug) {
                                            exists = true;
                                            break;
                                        }
                                    }
                                    if (!exists) {
                                        scope.publishForm.landingPageId.$setValidity("landingPageId", true);
                                    } else {
                                        scope.publishForm.landingPageId.$setValidity("landingPageId", false);
                                    }
                                    if (!scope.editing) {
                                        scope.collection.landingPageId = slug;
                                    }

                                }
                            });
                        }
                    }
                });
            }


        };
    }]);
