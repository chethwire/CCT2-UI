'use strict';

/**
 * apparently testing directives that use templateURL is tricky
 * trying this:   http://www.portlandwebworks.com/blog/testing-angularjs-directives-handling-external-templates
 */

describe('Directive: filterMenu', function () {

    // load the directive's module
    beforeEach(module('directives.filterMenu', 'views/templates/filterMenu.tpl.html'));

    var $compile, $rootScope, template;

    beforeEach(inject(function ($templateCache, _$rootScope_, _$compile_) {
        template = $templateCache.get('views/templates/filterMenu.tpl.html');
        $templateCache.put('/cctUI/templates/filterMenu.tpl.html');

        $compile = _$compile_;
        $rootScope = _$rootScope_;


    }));

    it('should prevent dropdown from closing when input is clicked', inject(function () {
        var element = $compile('<filter-menu></filter-menu>')($rootScope);

        var e = element.html();
        expect(e).toMatch('asdf');

    }));
});
