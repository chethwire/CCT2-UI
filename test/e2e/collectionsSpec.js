describe('Collections Page', function () {
    var ptor = protractor.getInstance();

    beforeEach(function () {
        ptor.get('/login');
    });

    it('should log in a user and create a new test collection',function() {
        ptor.findElement(protractor.By.id('inputEmail1')).sendKeys("dukehwtest");
        ptor.findElement(protractor.By.id('inputPassword1')).sendKeys('Myduketest');
        ptor.findElement(protractor.By.id('login-btn')).click();
        ptor.waitForAngular();
        expect(ptor.getCurrentUrl()).toContain('/collections');

        ptor.findElement(protractor.By.linkText('New Collection')).click();
        //ptor.findElement(protractor.By.className('file-input-wrapper')).click();
        ptor.findElement(protractor.By.className('file-input-wrapper')).sendKeys("test.csv");
    });






});