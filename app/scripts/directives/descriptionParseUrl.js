'use strict';

angular.module('directives.descriptionParseUrl', [])
.directive('descriptionParseUrl', function(){

	var descUrlPat = /(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/gi;

	return{
		restrict: 'A',
		require: 'ngModel',
		replace: 'true',
		scope: {ngModel: '=ngModel'},

		link: function compile(scope, element, attrs) {
			scope.$watch('ngModel', function(value){
				var urlName;
				console.log(value);
				angular.forEach(value.match(descUrlPat), function(url){
					console.log(url);
					urlName=url.split(".").splice(1,1);
					value = value.replace(url, "<a style='text-transform:capitalize;' target='_blank' href='" + url + "'>" + urlName + "</a>");				
				});
				
				console.log(value);
				element.html(value);
			});
		}
	};
});