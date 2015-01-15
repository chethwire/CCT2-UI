'use strict';

angular.module('directives.clickToEdit', ['services.validate', 'services.collections'])
    .directive('clickToEdit', function (Validate, Collectionssvc) {

        return {
            restrict: "A",

            replace: true,
            templateUrl: '/views/templates/clickToEdit.tpl.html',
            scope: {
                member: "=",
                deleteMember: '&',
                publisherId: '@',
                collection: '='
            },

            controller: function ($scope) {
                $scope.view = {
                    editableValue: $scope.member.id,
                    editorEnabled: false
                };

                $scope.enableEditor = function () {
                    $scope.view.editorEnabled = true;
                    $scope.view.editableValue = $scope.member.id;
                };

                $scope.disableEditor = function () {
                    $scope.view.editorEnabled = false;
                };

                $scope.save = function () {
                    $scope.member.id = $scope.view.editableValue;
                    $scope.member.error = 'Validating ID...';
                    Validate.validateId($scope.member.id, $scope.publisherId).then(function (response) {
                        console.log(response);
                        if (response.data['num-valid'] === 1) {
                            //successfully validated. Update member
                            $scope.member.error = '';
                            $scope.member.uri = response.data['valid-members'][0].uri;
                            $scope.member.id = response.data['valid-members'][0].id;
                            $scope.member.idType = response.data['valid-members'][0].idType;
                            $scope.member.line = response.data['valid-members'][0].line;
                            //$scope.member = response.data['valid-members'][0];
                            //call citation service to get title
                            if ($scope.member.uri) {
                                Collectionssvc.getMemberCitation($scope.member.uri, $scope.publisherId).then(function (citation) {
                                    $scope.member.citation = citation.data.citation;
                                    validateMembers($scope.collection.members,false);
                                });
                            } else {
                                //invalid member

                            }
                        } else {
                            if (response.data['num-invalid'] === 1) {
                                //show error if we got one
                                $scope.member.error = response.data['invalid-members'][0].error;
                                $scope.member.citation = null;
                                $scope.member.uri = null;
                            } else {
                                //we didn't get a valid 'invalid' response so just show generic error
                                $scope.member.error ='Error validating ID';
                                $scope.member.citation = null;
                                $scope.member.uri = null;
                            }
                        }
                    },function(e) {
                        console.log(JSON.stringify(e));
                        $scope.member.error ='Error validating ID';
                    });
                    $scope.disableEditor();
                };
                //Helper functions
                function validateMembers(members, setFilter) {
                    //Get citation for each member
                    asyncLoop(members.length, function (loop) {
                        if (members[loop.iteration()].uri) {
                            Collectionssvc.getMemberCitation(members[loop.iteration()].uri, $scope.publisherId).then(function (response) {
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

            }
        };
    });
