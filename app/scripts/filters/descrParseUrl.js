'use strict';

angular.module('filters.descrParseUrl', [])
   .filter('descrParseUrl', function() {
	   	var urlPattern = /(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/gi;
	   	var urlName="";
	    var url;
	    
	    return function (text) {
	        url = text.match(urlPattern);
	        var txtArr = text.split(/[\s\n]+/);
	        if(url !== null){	        	
        		for(var i = 0; i < url.length; i++){
        		 	var tmp = url[i].toString().split(/[//.]+/);
                    urlName = tmp[tmp.length-2];
                   	txtArr[txtArr.indexOf(url[i])]=txtArr[txtArr.indexOf(url[i])].replace(url[i], "<a style='text-transform:capitalize;' target='_blank' href='" + url[i] + "'>" +urlName+"</a>");
        			}
                console.log(txtArr.join(" "));
                return txtArr.join(" ");        	
		    }
		    else {
		    	// console.log(text);
		    	return text;
		    }
	    };
   });