'use strict';

angular.module('directives.filterMenu', [])
    .directive('filterMenu', function () {
        return {
            templateUrl: '/views/templates/filterMenu.tpl.html',
            restrict: 'E',
            scope:false,
            link: function (scope, element, attributes) {
                //initialize filament-sticky
                element.find('.fixedsticky').fixedsticky();

                var keywordInput = element.find('#keyword');
                keywordInput.click(function (e) {
                    //alert('stopping props');
                    e.stopPropagation();
                });
                var startDateInput = element.find('#startDate');
                startDateInput.click(function (e) {
                    //alert('stopping props');
                    e.stopPropagation();
                });
                var endDateInput = element.find('#endDate');
                endDateInput.click(function (e) {
                    //alert('stopping props');
                    e.stopPropagation();
                });
                var publishedCheckbox = element.find('#publishedCheckbox');
                publishedCheckbox.click(function (e) {
                    //alert('stopping props');
                    e.stopPropagation();
                });
                var unpublishedCheckbox = element.find('#unpublishedCheckbox');
                unpublishedCheckbox.click(function (e) {
                    //alert('stopping props');
                    e.stopPropagation();
                });
                /*Stop datepicker from closing dropdown menu*/
                $(document).on('click.dropdown touchstart.dropdown.data-api', '#ui-datepicker-div, .ui-datepicker-prev, .ui-datepicker-next', function (e) { e.stopPropagation() });




            }
        };
    });
