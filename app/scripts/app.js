angular.module('cctuiApp', [
        'collections',
        'settings',
        'filters.htmlToPlaintext',
        'rss',
        'health',
        'services.collections',
        'services.crud',
        'services.i18nNotifications',
        'services.notifications',
        'services.httpRequestTracker',
        'ngRoute',
        'titleService',
        'security.service',
        'wu.masonry',
        'truncateFilters',
        'angulartics',
        'angulartics.google.analytics',
        '$strap.directives',
        'ui.sortable',
        'ui.bootstrap',
        'strToDateFilter',
        'filters.pgStart',
        'filters.descrParseUrl',        
        'ngSanitize'

    ])

/**
 * Configure HTML5 URL Mode (enable or disable hashbang URLS)
 */
    .config(['$httpProvider','$routeProvider', '$locationProvider', '$compileProvider', '$provide', 'ENV', 'VERSION', function ($httpProvider,$routeProvider, $locationProvider, $compileProvider, $provide, ENV, VERSION) {

        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
        //default route
        // $routeProvider.otherwise({redirectTo: '/collections'});
        $routeProvider.otherwise({redirectTo: '/collections/manage/rules'});

        //enable html5
        $locationProvider.html5Mode(true);

        //enable blobs for rss download
        var oldWhiteList = $compileProvider.aHrefSanitizationWhitelist()
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|file|blob):|data:image\//);

        //exception handling
        $provide.decorator("$exceptionHandler", function ($delegate) {
            return function (exception, cause) {
                $delegate(exception, cause);
                //log errors to bugsense.com only if not development
                /*if (ENV !== 'dev') {
                    bugsense.notify(exception, {  version: VERSION });
                }*/
            };
        });
     //alert(“change”);

    }])
    .controller('AppCtrl', ['$scope', 'i18nNotifications', '$log', '$location', 'VERSION', '$route', '$routeParams', '$rootScope', function ($scope, i18nNotifications, $log, $location, VERSION, $route, $routeParams, $rootScope) {
       
        $rootScope.$on('$routeChangeStart', function(event, next, current){
            //console.log(next);
            //console.log(current);
            //window.history.back();
              /*$rootScope.showLoginSelector=false;
               if (security.isAuthenticated()) {
                    $rootScope.showLoginSelector=true;
                    $location.path()==='/login';
                }
               console.log($scope.showLoginSelector);
               console.log('CHANGING' + $location.path());*/

       });

        $scope.notifications = i18nNotifications;

        $scope.removeNotification = function (notification) {
            i18nNotifications.remove(notification);
        };

        $scope.$on('$routeChangeError', function (event, current, previous, rejection) {
            i18nNotifications.pushForCurrentRoute('errors.route.changeError', 'danger', {}, {rejection: rejection});
            $log.error('Route change error: ' + rejection);
        });
        //used to set dynamically include views based on location (ie. don't show header for landing page
        $scope.isActive = function (viewLocation) {
            return viewLocation === $location.path();
        };

        $scope.setStyle = function () {
            if ($scope.isActive('/collections')) {
                return {'padding-top': '0px', 'margin-bottom': '0px'};
            } else {
                return {'padding-top': '70px', 'margin-bottom': '20px'};
            }
        };
        $scope.setNavbarStyle = function () {
            if ($scope.isActive('/collections')) {
                return {'margin-bottom': '0px'};
            } else {
                return {'margin-bottom': '20px'};
            }
        };
        $scope.version = VERSION;
        $scope.currentYear = new Date().getFullYear();
    }])
    .controller('FooterCtrl', ['$scope', 'VERSION', function ($scope, VERSION) {

    }])
    .controller('HeaderCtrl', ['$scope', '$location', '$route', 'security', 'notifications', 'httpRequestTracker',
        function ($scope, $location, $route, security, notifications, httpRequestTracker) {
            $scope.location = $location;
            $scope.isAuthenticated = security.isAuthenticated;
            $scope.isAdmin = security.isAdmin;


            $scope.home = function () {
                if (security.isAuthenticated()) {
                    $location.path('/collections');

                } else {
                    $location.path('/login');
                }
            };


            $scope.hasPendingRequests = function () {
                return httpRequestTracker.hasPendingRequests();
            };

        }]);


//TODO: move those messages to a separate module
angular.module('cctuiApp').constant('I18N.MESSAGES', {
    'errors.route.changeError': 'Route change error',
    'crud.user.save.success': "A user with id '{{id}}' was saved successfully.",
    'crud.user.remove.success': "A user with id '{{id}}' was removed successfully.",
    'crud.user.remove.error': "Something went wrong when removing user with id '{{id}}'.",
    'crud.user.save.error': "Something went wrong when saving a user...",
    'crud.project.save.success': "A project with id '{{id}}' was saved successfully.",
    'crud.project.remove.success': "A project with id '{{id}}' was removed successfully.",
    'crud.project.save.error': "Something went wrong when saving a project...",
    'login.reason.notAuthorized': "You do not have the necessary access permissions.  Do you want to login as someone else?",
    'login.reason.notAuthenticated': "You must be logged in to access this part of the application.",
    'login.error.invalidCredentials': "Login failed.  Please check your credentials and try again.",
    'login.error.serverError': "There was a problem with authenticating: {{exception}}.",
    'collections.crud.error': "There was a problem with your request: {{exception}}.",
    'collections.csv.error': 'There was a problem parsing your CSV file: {{exception}}.',
    'collections.rss.error': 'There was a problem generating your RSS feed: {{exception}}.',
    'generic.serverError': "An unknown error has occurred."
});

angular.module('cctuiApp').run(['security', 'titleService', function (security, titleService) {
    titleService.setSuffix(' | CCT');

    /**
     *       Get the current user when the application starts
     *       (in case they are still logged in from a previous session)
     */
    //security.requestCurrentUser();

    /**
     * don't URI encode cookies
     */
    $.cookie.raw = true;

}]);

