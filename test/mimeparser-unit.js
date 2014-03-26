define(['chai', 'mimeparser'], function(chai, Mimeparser) {
    'use strict';

    var expect = chai.expect;
    chai.Assertion.includeStack = true;

    describe('mimeparser', function() {
        var parser;

        beforeEach(function() {
            parser = new Mimeparser();
        });

        describe('simple message', function() {
            it('should succeed', function(done) {
                var fixture = 'From: Sender Name <sender.name@example.com>\r\nTo: Receiver Name <receiver.name@example.com>\r\nSubject: Hello world!\r\nDate: Fri, 4 Oct 2013 07:17:32 +0000\r\nMessage-Id: <simplemessage@localhost>\r\nContent-Type: text/plain; charset="utf-8"\r\nContent-Transfer-Encoding: quoted-printable\r\n\r\nHi,\r\n\r\nthis is a private conversation. To read my encrypted message below, simply =\r\nopen it in Whiteout Mail.\r\nOpen Whiteout Mail: https://chrome.google.com/webstore/detail/jjgghafhamhol=\r\njigjoghcfcekhkonijg\r\n\r\n';
                parser.onheader = function(node) {
                    expect(node.header).to.deep.equal([
                        'From: Sender Name <sender.name@example.com>',
                        'To: Receiver Name <receiver.name@example.com>',
                        'Subject: Hello world!',
                        'Date: Fri, 4 Oct 2013 07:17:32 +0000',
                        'Message-Id: <simplemessage@localhost>',
                        'Content-Type: text/plain; charset=\"utf-8\"',
                        'Content-Transfer-Encoding: quoted-printable'
                    ]);
                };

                var expectedText = 'Hi,\n\nthis is a private conversation. To read my encrypted message below, simply open it in Whiteout Mail.\nOpen Whiteout Mail: https://chrome.google.com/webstore/detail/jjgghafhamholjigjoghcfcekhkonijg';
                parser.onbody = function(node, chunk) {
                    expect(new TextDecoder('utf-8').decode(chunk)).to.equal(expectedText);
                };

                parser.onend = function() {
                    expect(parser.nodes).to.not.be.empty;
                    expect(new TextDecoder('utf-8').decode(parser.nodes.node.content)).to.equal(expectedText);

                    done();
                };
                parser.write(fixture);
                parser.end();
            });
        });
    });
});