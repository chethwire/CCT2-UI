'use strict';

angular.module('filters.htmlToPlaintext', [])
    .filter('htmlToPlaintext', function () {
        // Strip out HTML tags
        return function (text) {

        	// console.log(String(text).replace(/<(?:.|\n)*?>/gm, ''));
            return String(text).replace(/<(?:.|\n)*?>/gm, '');
        }

    });
