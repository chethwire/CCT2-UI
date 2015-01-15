'use strict';
// Based loosely around work by Witold Szczerba - https://github.com/witoldsz/angular-http-auth
angular.module('security.service', [
        'security.retryQueue',    // Keeps track of failed requests that need to be retried once the user logs in
        'security.login',         // Contains the login form template and controller
        'utils.Xml2js',
        'config'



    ])

    .factory('security', ['$http', '$q', '$location', 'securityRetryQueue', 'Xml2js', 'AUTH_BASE_URL', 'API_BASE_URL', function ($http, $q, $location, queue, Xml2js, AUTH_BASE_URL, API_BASE_URL) {

        // Redirect to the given url (defaults to '/')
        function redirect(url) {
            url = url || '/';
            $location.path(url);
        }

        function redirectToLoginForm() {
            $location.path('/login');
        }


        // Register a handler for when an item is added to the retry queue
        queue.onItemAddedCallbacks.push(function (retryItem) {
            if (queue.hasMore()) {
                //service.showLogin();
                service.redirectToLogin();
            }
        });

        // The public API of the service
        var service = {

            // Get the first reason for needing a login
            getLoginReason: function () {
                return queue.retryReason();
            },

            //redirect to login screen
            redirectToLogin: function () {
                redirectToLoginForm();
            },

            setLogin: function (login, keepMeLoggedIn, username) {
                //set cookie and publisherId
                var cookie = login.login;
                var publisherId = login.publisherId;

                service.publisherId = publisherId;
                service.currentUser = username;
                if (keepMeLoggedIn) {
                    $.cookie('login', cookie, {expires: 30, path: '/'});
                    $.cookie('user', username, {expires: 30, path: '/'});
                    $.cookie('publisherId', publisherId, {expires: 30, path: '/'});
                } else {
                    $.cookie('login', cookie, {path: '/'});
                    $.cookie('user', username, {path: '/'});
                    $.cookie('publisherId', publisherId, {path: '/'});
                }
            },

            // Attempt to authenticate a user by the given email and password and return the success object (or failure)
            login: function (email, password) {


                var url = AUTH_BASE_URL + '?user=' + email + '&code=' + password;
                return $http.get(url).then(function (response) {
                    return response;

                }, function (response) {
                    //request failed
                    //service.loginResponse = '';
                    console.log(JSON.stringify(response));
                    return response;
                });
            },


            // Logout the current user and redirect
            logout: function (redirectTo) {
                service.currentUser = null;
                $.removeCookie('login', { path: '/' });
                $.removeCookie('user', { path: '/' });
                $.removeCookie('publisherId', {path: '/'});
                redirect(redirectTo);

            },

            // Ask the backend to see if a user is already authenticated - this may be from a previous session.
            requestCurrentUser: function () {
                if (service.isAuthenticated()) {
                    return $q.when(service.currentUser);
                } else {
                    //check if login cookie exists, and if so, validate with ac service and get current user
                    var cookie = $.cookie('login');
                    if (cookie !== null) {
                        var url = API_BASE_URL + '?action=  &publisherId=' + $.cookie('publisherId');
                        //var url = 'http://www.google.com/asdf';

                        var request = $http.get(url);
                        return request.then(function (response) {

                            //check if we get a valid 20x response, if so assume valid cookie
                            //if(response.status >= 200 && response.status <= 299) {

                            //}
                            service.currentUser = $.cookie('user');
                            service.publisherId = $.cookie('publisherId');

                        }, function(response) {
                            //failed
                            service.currentUser = '';
                            service.publisherId = '';
                        });

                    } else {

                        service.currentUser = '';
                        service.publisherId = '';
                        return $q.when(service.currentUser);
                    }

                }
            },

            // Information about the current user
            currentUser: null,
            publisherId: null,
            // Is the current user authenticated?
            isAuthenticated: function () {

                if(service.currentUser) {
                    return true;
                }
                return false;
            },

            // Is the current user an administrator?
            isAdmin: function () {
                return !!(service.currentUser && service.currentUser.admin);
            }
        };

        return service;
    }]);