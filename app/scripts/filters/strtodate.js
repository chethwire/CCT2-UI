'use strict';

angular.module('strToDateFilter', [])
    .filter('strToDate', function () {
        return function (input) {
            // Feb 3, 2014 10:27:58 AM
//            var date = new Date(input);
//            if (!isNaN(date.getTime())) {
//                return input;
//            } else {
//                return date;
//            }
            if (input) {
                var monthNamesShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                var month = monthNamesShort.indexOf(input.substr(0, 3));

                var regex = /(\d?\d)/g;
                var date = regex.exec(input)[1];
                regex = /(\d\d\d\d)/g;
                var year = regex.exec(input)[1];
                var d = new Date(year, month, date);
                if (!isNaN(d)) {
                    return d;
                } else {
                    return input;
                }
            } else {
                //empty input
                return input;
            }
        };
    });
