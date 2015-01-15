'use strict';

angular.module('directives.addRowSearchCond', [])
  .directive('addRowSearchCond', function ( $compile ){
    return function(scope,element,attrs){
      /*scope.searchBoolean={'type':'select',
                              'value':'AND',
                              'values':['OR','AND']};

        scope.searchCondition={'type':'select',
                                'value':'Title',
                                'values':['Title','Abstract','Full Text']
                               };*/


      element.bind('click', function (){
        console.log(scope.searchCondition.value);
        angular.element(document.getElementById('addRows'))
        .append($compile('<input type="text" style="display:inline;"><input type="checkbox" style="display:inline;margin-left:5px;">'
          +'<span>Exact</span><select style="background-color:transparent;height:30px;margin-left:37px;" ng-model='+scope.searchCondition.value+' ng-options="val.value as val.value for val in searchCondition.values"></select>')(scope));
         
          /*<span>Exact</span><select style="background-color:transparent;height:30px;margin-left:37px;" ng-model='+scope.searchCondition.value+'" ng-options="val for val in"'+ scope.searchCondition.values+'"></select>')(scope));
      <select style="width:13%;position:relative;top:-31px;left:384px;" class="form-control" ng-model="' + searchBoolean.value + '" ng-options="option for option in "'+searchBoolean.values+'"></select>    
      <button type="button" style="display:block;margin-top:-58px;margin-left:473px;font-size: 12px;" add-row-search-cond>Add row<i class="icon icon-plus-sign icon-primary"></i></button>')(scope));*/

      });
    

    }


  });