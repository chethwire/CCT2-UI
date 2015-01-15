describe('Login Page', function () {
    var ptor = protractor.getInstance();

    beforeEach(function () {
        ptor.get('/login');
    });

    it('should load the login page', function () {
        expect(ptor.findElement(protractor.By.id('login-btn')).getText()).toBe('Log-in');
    });

    it('should log in a user and redirect to collections', function () {
        ptor.findElement(protractor.By.id('inputEmail1')).sendKeys("dukehwtest");
        ptor.findElement(protractor.By.id('inputPassword1')).sendKeys('Myduketest');
        ptor.findElement(protractor.By.id('login-btn')).click();
        ptor.waitForAngular();
        expect(ptor.getCurrentUrl()).toContain('/collections');
    });








});