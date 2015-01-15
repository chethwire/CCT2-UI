'use strict';

angular.module('filters.pgStart', [])
    .filter('pgStart', function () {
    	return function (input,start){
    		start=+start;
    		// console.log(input);
    		return input.slice(start);
    	}

    });