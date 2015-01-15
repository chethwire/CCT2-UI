angular.module('security.login.form', [
        'services.localizedMessages',
        'ngRoute',
        'security.service',
        'directives.autofill'

    ])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/login', {
                templateUrl: '/views/loginForm.html',
                controller: 'LoginFormController'
            })
        ;
    }])
    .controller('LoginFormController', ['$scope', 'security', 'localizedMessages', 'titleService', '$location', '$rootScope', function ($scope, security, localizedMessages, titleService, $location, $rootScope) {
        titleService.setTitle('Please Login');
           
         
        if(!security.isAuthenticated())
        {
                //model for this form
                $rootScope.user = {};

                //any error message from failing to log in
                $scope.authError = null;

                $rootScope.keepMeLoggedIn = true;
                $rootScope.authorizedLogins = [];
                $rootScope.showLoginSelector = false;

                // The reason that we are being asked to login - for instance because we tried to access something to which we are not authorized
                // We could do something different for each reason here but to keep it simple...
                $scope.authReason = null;
                if (security.getLoginReason()) {
                    $scope.authReason = (security.isAuthenticated()) ? localizedMessages.get('login.reason.notAuthorized') : localizedMessages.get('login.reason.notAuthenticated');

                }
                //attempt to authenticate the user specified in form's model
                $scope.login = function () {
                    //clear previous security errors
                    $scope.authError = null;


                    //try to log in
                    security.login($rootScope.user.email, $rootScope.user.password, $rootScope.keepMeLoggedIn).then(function (loginResponse) {
                            if (loginResponse.status >= 200 && loginResponse.status <= 299) {
                                if (loginResponse.data.success.length === 0) {
                                    //if we get here no authenticated logins returned
                                    $scope.authError = localizedMessages.get('login.error.invalidCredentials');
                                } else {
                                    //at least one authenticated login
                                    if (loginResponse.data.success.length > 1) {
                                        //multiple authenticated logins -- show login selector
                                        //only show authorized logins
                                        for (var i = 0; i < loginResponse.data.success.length; i++) {
                                            //check if login is authorized then add to authorizedUsers scope value
                                            if (loginResponse.data.success[i].isAuthorized && loginResponse.data.success[i].isAuthenticated) {
                                                $rootScope.authorizedLogins.push(loginResponse.data.success[i]);
                                               // console.log($rootScope.authorizedLogins[i]);
                                            }
                                        }
                                        //once we're out of the loop make sure we actually found more than one authorized user; otherwise just auto select the only valid login or display error if none found
                                        if ($rootScope.authorizedLogins.length > 1) {
                                            //display login selector
                                            $rootScope.showLoginSelector = true;
                                        } else if ($rootScope.authorizedLogins.length === 1) {
                                            //only one authorized login -- auto select
                                            security.setLogin($rootScope.authorizedLogins[0], $rootScope.keepMeLoggedIn, $rootScope.user.email);
                                        } else {
                                            //no authorized logins found -- error
                                            $scope.authError = localizedMessages.get('login.error.invalidCredentials');
                                        }
                                    } else {
                                        //just one authenticated login. Make sure login is authorized then auto select valid login
                                        if (loginResponse.data.success[0].isAuthorized && loginResponse.data.success[0].isAuthenticated) {
                                            //user is authorized
                                            security.setLogin(loginResponse.data.success[0], $rootScope.keepMeLoggedIn, $scope.user.email);
                                            // $location.path('/collections');
                                            $location.path('/collections/manage/rules');
                                        } else {
                                            $scope.authError = localizedMessages.get('login.error.invalidCredentials');
                                        }
                                    }
                                }
                            }
                            else {
                                //status other than 20x returned
                                $scope.authError = localizedMessages.get('login.error.invalidCredentials');
                            }
                        }
                        , function (x) {
                            //if we get here there was a problem with the request to the server
                            $scope.authError = localizedMessages.get('login.error.invalidCredentials');
                        });
                };
           }


           $scope.selectLogin = function (login) {
                security.setLogin(login, $rootScope.keepMeLoggedIn, $rootScope.user.email);
                // $location.path('/collections');
                $location.path('/collections/manage/rules');
                $scope.$apply();
            }

    


    }]);

