'use strict';

describe('Service: titleService', function () {

    // load the service's module
    beforeEach(module('titleService'));

    // instantiate service
    var titleService;
    beforeEach(inject(function (_titleService_) {
        titleService = _titleService_;
    }));

    it('should set a title without a suffix', function () {
        var title = "new title";
        titleService.setTitle(title);

        expect(titleService.getTitle()).toEqual(title);
    });

    it('should allow specification of a suffix', function () {
        var suffix = " :: new suffix";
        titleService.setSuffix(suffix);
        expect(titleService.getSuffix()).toEqual(suffix);
    });
    it('should set the title, including the suffix', function () {
        var title = "new title";
        var suffix = " :: new suffix";
        titleService.setSuffix(suffix);
        titleService.setTitle(title);
        expect(titleService.getTitle()).toEqual(title + suffix);
    });

});
