'use strict';

describe('Service: xml2js', function () {

    // load the service's module
    beforeEach(module('utils.Xml2js'));

    // instantiate service
    var Xml2js;
    beforeEach(inject(function (_Xml2js_) {
        Xml2js = _Xml2js_;
    }));

    it('should do parse xml into valid JSON', function () {
        var xml = '<?xml version="1.0" encoding="UTF-8"?><ac:runtime-response xmlns:ac="http://schema.highwire.org/Access"><ac:authentication><ac:identity runtime-id="urn:ac.highwire.org:guest:identity" type="guest"><ac:privilege runtime-id="urn:ac.highwire.org:guest:privilege" type="privilege-set" privilege-set="GUEST" /><ac:credentials method="guest" /></ac:identity><ac:error name="ignore-cookie" module="username-password"><ac:text>Invalid login token cookie: org.highwire.session.SessionTokenException: java.lang.IllegalArgumentException: illegal char  </ac:text></ac:error></ac:authentication><ac:authorization target="service" id="1"><ac:unauthorized reason="access-denied" /></ac:authorization><ac:authz-candidate-details target="service" id="1"><ac:unauthorized reason="access-denied" /></ac:authz-candidate-details><ac:http-response><ac:cookie name="login" age-maximum="0" version="0" path="/"></ac:cookie></ac:http-response></ac:runtime-response>';
        var json = Xml2js.xml_str2json(xml);

        expect(json['runtime-response']['authentication']).toBeDefined();
    });

});
