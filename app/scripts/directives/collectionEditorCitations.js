'use strict';

angular.module('directives.collectionEditorCitations',[])
.directive('collectionEditorCitations', function(){
	// console.log("checking");
	
	return {
		restrict: "E",
		// require: "ngModel",
		scope:{
			// frmt: '=?',
			target: '=',
			citFrm:'=',
			collection:'=',
			getCit: '&'
		},

		template: '<input type="radio" name="artfmt" value="articleDefault" ng-model="artCitFrm" ng-checked="artChk" ng-change="shw()">'
					+ '<span style = "padding-left:10px;">Article Default<br>'
					+ '<span style = "padding-left:20px;">Title<br>'
					+ '<span style = "padding-left:20px;">Type<br>'
					+ '<span style = "padding-left:20px;">Date</span>'
				+ '<input style="position:relative;top:-58px;left:95px;" type="radio" name="frmt2" value="articleFormat2" ng-model="artCitFrm" ng-checked="artChk2" ng-change="shw()">'
					+ '<span style = "position:relative;top:-58px;left:95px;padding-left:10px;">Article Basic <br>'
					+ '<span style = "position:relative;left:75px;">Title<br>'
					+ '<span>Type<br>'
					+ '<span>Author<br>' 
					+ '<span>Date<br></span>'
				+ '<input style="position:relative;top:-95px;left:120px;bottom:-50px;" type = "radio" name="frmt1" value="articleFormat1" ng-model="artCitFrm" ng-checked="artChk1" ng-change="shw()">'
	                + '<span style="position:relative;top:-95px;left:120px;padding-left:10px;">Article Detailed<br>'
	                + '<span style = "padding-left:20px;">Title<br>'
	                + '<span style = "padding-left:20px;">Type<br>'
	                + '<span style = "padding-left:20px;">Author<br>'	                
	                + '<span style = "padding-left:20px;">Date:<span style = "padding-left:10px;"> DOI:<br></span>'
				+ '<input style="position:relative;top:-95px;left:165px" type="radio" name="bkfmt" value="bookDefault" ng-model="bkCitFrm" ng-checked="bkChk" ng-change="shw()">'
					+ '<span style = "position:relative;top:-95px;left:165px;padding-left:10px;">Book Default<br>'
					+ '<span style = "padding-left:20px;">Title<br>'
					+ '<span style = "padding-left:20px;">Type<br>'
					+ '<span style = "padding-left:20px;">Date</span>'
				+ '<input style="position:relative;top:-58px;left:95px;bottom:-50px;" type="radio" name="frmt4" value="bookFormat2" ng-model="bkCitFrm" ng-checked="bkChk2" ng-change="shw()">'
					+ '<span style = "position:relative;top:-58px;left:95px;padding-left:10px;">Book Basic<br>'
					+ '<span style = "position:relative;left:75px;">Title<br>'
					+ '<span>Type<br>'					
					+ '<span>Author<br>' 
					+ '<span>Date<br></span>'
				+ '<input style="position:relative;top:-98px;left:120px;bottom:-50px;" type = "radio" name="frmt3" value="bookFormat1" ng-model="bkCitFrm" ng-checked="bkChk1" ng-change="shw()">'
	                + '<span style="position:relative;top:-98px;left:120px;padding-left:10px;">Book Detailed<br>'
	                + '<span style = "padding-left:20px;">Title<br>'
	                + '<span style = "padding-left:20px;">Type<br>'	                
	                + '<span style = "padding-left:20px;">Author<br>'	                
	                + '<span style = "padding-left:20px;">Date:<span style = "padding-left:10px;">eISBN:<br></span>',	               

	                      
       link: function($scope, element,$attrs){
	       	$scope.selCit;
	       	var node = element.find('input');
	       console.log($scope.artCitFrm);
		   		console.log($scope.bkCitFrm);
	        node.bind('change', function(e) {//e is the event object           
                 // $scope.frmt = e.target.value;
                 
                 $scope.selCit=e.target.value;
                 $scope.$apply();

                $scope.shw=function(){
                	$scope.getCit({citations:$scope.selCit});
                	console.log($scope.artCitFrm);                	
                } 
            });	                 	
       },


       controller: function($scope){	

       console.log($scope.collection);	   	

		   	$scope.$watch("collection",function(newVal,oldVal,scope){
		   		console.log($scope.collection);
		   		console.log(scope.collection);
		   		console.log(newVal.artCitationFmt);
		   		console.log(oldVal.artCitationFmt);
		   		
		   		if($scope.collection.collectionId<0){
		   			$scope.artChk=true;
		   			$scope.bkChk=true;
		   		}
		   		
		   		// if(oldVal.artCitationFmt === newVal.artCitationFmt && oldVal.artCitationFmt === undefined && newVal.artCitationFmt === undefined){
		   		// 	$scope.artChk=true;
		   		// }
		   		// console.log(oldVal.bkCitationFmt);
		   		else {
			   		if(newVal.artCitationFmt === "default" || newVal.artCitationFmt === "articleDefault" ){
			   			$scope.artChk=true;
			   		}
			   		else if(newVal.artCitationFmt === "articleFormat1"){
			   			$scope.artChk1=true;
			   			// $scope.currColl=newVal;
			   			// console.log($scope.currColl.artCitationFmt);		   		
			   		}
			   		else if(newVal.artCitationFmt === "articleFormat2"){
			   			$scope.artChk2=true;
			   		}

			   		// if(oldVal.bkCitationFmt === newVal.bkCitationFmt && oldVal.bkCitationFmt === undefined && newVal.bkCitationFmt === undefined){
			   		// 	$scope.bkChk=true;
			   		// }
			   	    if(newVal.bkCitationFmt === "default" || newVal.bkCitationFmt === "bookDefault"){
			   			$scope.bkChk=true;
			   		}
			   		else if(newVal.bkCitationFmt === "bookFormat1"){
			   			$scope.bkChk1=true;
			   		}
			   		else if (newVal.bkCitationFmt === "bookFormat2"){
			   			$scope.bkChk2=true;
			   		}
			   	}
		   	});
        


       }
       
   };
});