'use strict';
angular.module('directives.fileupload', [])

// It is attached to an element which will be assigned to a class "ng-file-over" or ng-file-over="className"
    .directive('ngFileOver', function () {
        return {
            restrict: "EA",
            link: function ($scope, $element, $attrs) {
                $scope.$on('file:addoverclass', function () {
                    $element.addClass($attrs.ngFileOver || 'ng-file-over');
                });
                $scope.$on('file:removeoverclass', function () {
                    $element.removeClass($attrs.ngFileOver || 'ng-file-over');
                });
            }
        };
    })


    // It is attached to an element that catches the event drop file
    .directive('ngFileDrop', function () {
        return {
            restrict: "EA",
            // don't use drag-n-drop files in IE9, because not File API support
            link: !window.File ? angular.noop : function ($scope, $element) {
                $element
                    .bind('drop', function (event) {
                        var dataTransfer = event.dataTransfer ? event.dataTransfer : event.originalEvent.dataTransfer; // jQuery fix;
                        event.preventDefault();
                        $scope.$broadcast('file:removeoverclass');
                        $scope.$emit('csvfile:add', dataTransfer.files);
                    })
                    .bind('dragover', function (event) {
                        var dataTransfer = event.dataTransfer ? event.dataTransfer : event.originalEvent.dataTransfer; // jQuery fix;
                        event.preventDefault();
                        dataTransfer.dropEffect = 'copy';
                        $scope.$broadcast('file:addoverclass');
                    })
                    .bind('dragleave', function () {
                        $scope.$broadcast('file:removeoverclass');
                    });
            }
        };
    })


    // It is attached to <input type="file" /> element
    .directive('ngFileSelect', function () {
        return {
            restrict: "EA",
            link: function ($scope, $element) {

                if (!window.File || !window.FormData) {
                    $element.removeAttr('multiple');
                }


                /**
                 * had to move this binding into the view since it was no longer being picked up after the styling changes
                 *
                 $element.bind('change', function () {
                    $scope.$emit('file:add', this.files ? this.files : this);
                });
                 */

                //style button
                var input = $('<div>').append($element.eq(0).clone()).html();

                var className = '';
                if (!!$element.attr('class')) {
                    className = ' ' + $element.attr('class');
                }
                //replace input field with Bootstrap button. The input will still be there, it will just float
                //above and be transparent

                $element.replaceWith('<a class="file-input-wrapper btn btn-primary' + className + '">Browse' + input + '</a>');
                // Add the styles before the first stylesheet
                // This ensures they can be easily overridden with developer styles
                var cssHtml = '<style>' +
                    '.file-input-wrapper { overflow: hidden; position: relative; cursor: pointer; z-index: 1; }' +
                    '.file-input-wrapper input[type=file], .file-input-wrapper input[type=file]:focus, .file-input-wrapper input[type=file]:hover { position: absolute; top: 0; left: 0; cursor: pointer; opacity: 0; filter: alpha(opacity=0); z-index: 99; outline: 0; }' +
                    '.file-input-name { margin-left: 8px; }' +
                    '</style>';
                $('link[rel=stylesheet]').eq(0).before(cssHtml);


            }

        };
    });

