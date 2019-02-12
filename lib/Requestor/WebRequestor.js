const Headers = require('./Headers');

/**
 * @memberOf Atlante.Requestor
 * @implements RequestorInterface
 */
class WebRequestor {
    /**
     * Constructor.
     *
     * @param {string} baseUrl
     */
    constructor(baseUrl) {
        /**
         * @type {string}
         *
         * @private
         */
        this._baseUrl = baseUrl;
    }

    /**
     * @inheritdoc
     */
    async request(method, path, headers = {}, requestData = null) {
        if (-1 === path.indexOf('://')) {
            const url = new URL(path, this._baseUrl);
            path = url.href;
        }

        const xmlHttp = new XMLHttpRequest();
        let contentTypeSet = false;
        xmlHttp.open(method, path);

        for (const [ key, value ] of Object.entries(headers)) {
            xmlHttp.setRequestHeader(key, value);

            if ('content-type' === key.toLowerCase()) {
                contentTypeSet = true;
            }
        }

        if (requestData && 'string' !== typeof requestData) {
            requestData = JSON.stringify(requestData);
        }

        if (! contentTypeSet) {
            xmlHttp.setRequestHeader('Content-Type', 'application/json');
        }

        return new Promise(resolve => {
            xmlHttp.onreadystatechange = () => {
                if(xmlHttp.readyState !== XMLHttpRequest.DONE) {
                    return;
                }

                const headers = xmlHttp.getAllResponseHeaders()
                    .split('\r\n')
                    .reduce((res, val) => {
                        if (! val) {
                            return res;
                        }

                        val = val.split(': ');
                        return res.add(val[0], val[1]);
                    }, new Headers())
                ;

                resolve({
                    status: xmlHttp.status,
                    statusText: xmlHttp.statusText,
                    headers: headers,
                    data: headers.get('content-type').match(/^application\/json/) ? JSON.parse(xmlHttp.responseText) : xmlHttp.responseText,
                });
            };

            xmlHttp.send(requestData);
        });
    }
}

module.exports = WebRequestor;
