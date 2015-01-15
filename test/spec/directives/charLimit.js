'use strict';

describe('Directive: charLimit', function () {

    var widget, scope;

    beforeEach(function () {
        module('directives.charLimit');
        inject(function ($rootScope) {
            scope = $rootScope;
        });
    });

    function expectView() {
        return expect(widget.$viewValue);
    }

    function enterValue(value) {
        widget.$broadcast('$viewChange', value);
        scope.$digest();
    }

    describe('address zip input', function () {
        beforeEach(inject(function ($compile) {
            $compile('<form name="form"><input type="text" name="testInput"/></form>')(scope);
            widget = scope.form.testInput;
        }));
        it('should play around with zip :)', function () {

            enterValue('12345');
            expect(scope.data.zip).toEqual('12345');
            expect(widget.$error.ZIP).toBeFalsy();

            enterValue('33-456');
            expect(scope.data.zip).toEqual('33-456');
            expect(widget.$error.ZIP).toBeTruthy();

            scope.$apply("data.zip = '77-89'");
            expectView().toEqual('77-89');
            expect(widget.$error.ZIP).toBeTruthy();

            scope.data.zip = '11111';
            scope.$digest();
            expectView().toEqual('11111');
            expect(widget.$error.ZIP).toBeFalsy();

        });
    });
});