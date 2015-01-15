describe('E2E: Testing Routes', function () {
    var ptor = protractor.getInstance();


    it('should go to the /login path when / is accessed and user has no login cookie',function() {
        ptor.get('/');
    });

    it('should go to the /collections path when / is accessed and user has a valid login cookie',function () {
        ptor.get('/');
    });

});