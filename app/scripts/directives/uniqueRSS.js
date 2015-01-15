'use strict';

angular.module('directives.uniqueRss', ['services.collections', 'security.service'])
    .directive('uniqueRss', ['Collectionssvc', 'security', '$timeout', function (Collectionssvc, security, $timeout) {
        return {
            require: 'ngModel',
            scope: false,
            link: function (scope, element, attrs, ngModelCtrl) {
                var original;
                var nameHasChanged = false;

                // Create a cache to store all of the current collections so we don't have to make a server call for every letter typed into the input to validate
                // initialize as false until async request finishes
                var rssCache = false;
                Collectionssvc.getCollections(security.publisherId).then(function (result) {
                    rssCache = result;
                }, function (x) {
                    //failed request to server
                });

                ngModelCtrl.$formatters.unshift(function (modelValue) {
                    original = modelValue;
                    return modelValue;
                });

                ngModelCtrl.$parsers.push(function (viewValue) {
                    var slug = getSlug(viewValue);
                    if (slug === scope.originalRSSId) {
                        scope.publishForm.rssId.$setValidity("rssId", true);
                    } else {

                        // Iterate through rssCache to check if rssId exists
                        var exists = false;
                        for (var key in rssCache) {
                            if (rssCache[key].rssId === slug) {
                                exists = true;
                                break;
                            }
                        }

                        if (!exists) {
                            ngModelCtrl.$setValidity('rssId', true);
                        }
                        else {
                            ngModelCtrl.$setValidity('rssId', false);
                        }


                    }
                    //truncate to limit chars
                    slug = slug.substring(0, 200);
                    return slug;
                });

                //watch for name changes to update rss/lp fields
                scope.$watch('collection.name', function (name) {
                    // Only want this functionality when creating, not editing collection
                    if (!scope.editing) {
                        //don't make any changes if we're changing the title and not editing
                        if (name && name !== scope.originalName) {
                            nameHasChanged = true;
                        }
                        if (name && nameHasChanged) {

                            var slug = getSlug(name).substring(0, 200);
                            scope.collection.rssId = slug;

                            $timeout(function () {
                                // anything you want can go here and will safely be run on the next digest.


                                if (scope.originalRSSId === slug) {
                                    //if it's equal to the original, that's ok, but this should only happen when editing

                                    scope.publishForm.rssId.$setValidity("rssId", true);

                                } else {

                                    scope.publishForm.rssId.$setViewValue(slug);


                                    // Iterate through rssCache to check if rssId exists
                                    var exists = false;
                                    for (var key in rssCache) {
                                        if (rssCache[key].rssId === slug) {
                                            exists = true;
                                            break;
                                        }
                                    }

                                    if (!exists) {
                                        scope.publishForm.rssId.$setValidity("rssId", true);
                                    } else {
                                        scope.publishForm.rssId.$setValidity("rssId", false);
                                    }
                                    if (!scope.editing) {
                                        scope.collection.rssId = slug;
                                    }

                                }
                            });
                        }


                    }
                });
            }


        };
    }]);
