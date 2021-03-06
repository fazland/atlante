const WebRequestor = Fazland.Atlante.Requestor.WebRequestor;
const Argument = Jymfony.Component.Testing.Argument.Argument;
const Prophet = Jymfony.Component.Testing.Prophet;
const XMLHttpRequest = Fazland.Atlante.Stubs.XmlHttpRequest;

const { expect } = require('chai');

describe('[Requestor] WebRequestor', function () {
    beforeEach(() => {
        /**
         * @type {Jymfony.Component.Testing.Prophet}
         *
         * @private
         */
        this._prophet = new Prophet();

        /**
         * @type {Jymfony.Component.Testing.Prophecy.ObjectProphecy|Fazland.Atlante.Stubs.XMLHttpRequest}
         * @private
         */
        const xmlHttp = this._xmlHttp = this._prophet.prophesize(XMLHttpRequest);

        // Base methods.
        this._xmlHttp.open(Argument.cetera()).willReturn();
        this._xmlHttp.setRequestHeader(Argument.cetera()).willReturn();
        this._xmlHttp.getAllResponseHeaders(Argument.cetera()).willReturn('');
        this._xmlHttp.send(Argument.cetera()).will(function () {
            const o = this.reveal();
            o.readyState = XMLHttpRequest.DONE;
            o.onreadystatechange();
        });

        const construct = function () { return xmlHttp.reveal(); };
        construct.DONE = XMLHttpRequest.DONE;

        /**
         * @type {Fazland.Atlante.Requestor.WebRequestor}
         *
         * @private
         */
        this._requestor = new WebRequestor('https://localhost/', construct);
    });

    afterEach(() => {
        this._prophet.checkPredictions();
    });

    it ('should prepend base path', async () => {
        this._xmlHttp.open('GET', 'https://localhost/resource/subresource').shouldBeCalled();
        await this._requestor.request('GET', 'resource/subresource');
    });

    it ('should set content-type header if not set', async () => {
        this._xmlHttp.setRequestHeader('Content-Type', 'application/json').shouldBeCalled();
        await this._requestor.request('GET', 'resource/subresource');
    });

    it ('should not set content-type header if set', async () => {
        this._xmlHttp.setRequestHeader('Content-Type', 'application/json').shouldNotBeCalled();
        this._xmlHttp.setRequestHeader('Content-Type', 'application/octet-stream').shouldBeCalled();

        await this._requestor.request('GET', 'resource/subresource', { 'Content-Type': 'application/octet-stream' });
    });

    it ('should automatically encodes to JSON a non-string object', async () => {
        this._xmlHttp.send(JSON.stringify({ foo: 'bar' }))
            .shouldBeCalled()
            .will(function () {
                const o = this.reveal();
                o.readyState = XMLHttpRequest.DONE;
                o.onreadystatechange();
            });

        await this._requestor.request('GET', 'resource/subresource', {}, { foo: 'bar' });
    });

    it ('should parse response headers correctly', async () => {
        this._xmlHttp.getAllResponseHeaders(Argument.cetera())
            .willReturn('Content-Type: application/octet-stream\r\nDate: 12 Jan 2019 02:00:00 GMT\r\n');

        const response = await this._requestor.request('GET', 'resource/subresource');
        expect(response.headers.get('Content-Type')).to.be.eq('application/octet-stream');
        expect(response.headers.get('Date')).to.be.eq('12 Jan 2019 02:00:00 GMT');
    });

    it ('should set report status and statusText correctly', async () => {
        this._xmlHttp.send(null).will(function () {
            const o = this.reveal();
            o.status = 418;
            o.statusText = 'I\'m a teapot';
            o.readyState = XMLHttpRequest.DONE;
            o.onreadystatechange();
        });

        const response = await this._requestor.request('GET', 'resource/subresource');
        expect(response.status).to.be.eq(418);
        expect(response.statusText).to.be.eq('I\'m a teapot');
    });
});
