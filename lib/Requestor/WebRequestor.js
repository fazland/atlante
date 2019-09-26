const Headers = require('./Headers');
const Blob = 'undefined' !== typeof window ? window.Blob : undefined;

/**
 * @memberOf Fazland.Atlante.Requestor
 *
 * @implements RequestorInterface
 */
class WebRequestor {
    /**
     * Constructor.
     *
     * @param {string} baseUrl
     * @param {Function} [xmlHttp = XMLHttpRequest]
     */
    constructor(baseUrl, xmlHttp = XMLHttpRequest) {
        /**
         * @type {string}
         *
         * @private
         */
        this._baseUrl = baseUrl;

        /**
         * @type {Function}
         *
         * @private
         */
        this._xmlHttp = xmlHttp;
    }

    /**
     * @inheritdoc
     */
    async request(method, path, headers = {}, requestData = null) {
        if (-1 === path.indexOf('://')) {
            const url = new URL(path, this._baseUrl);
            path = url.href;
        }

        /** @type {XMLHttpRequest} */
        const xmlHttp = new this._xmlHttp();
        let contentTypeSet = false;
        xmlHttp.open(method, path);

        for (const [ key, value ] of Object.entries(headers)) {
            xmlHttp.setRequestHeader(key, value);

            if ('content-type' === key.toLowerCase()) {
                contentTypeSet = true;
            }
        }

        if (requestData && 'string' !== typeof requestData && ! (undefined !== Blob && requestData instanceof Blob)) {
            requestData = JSON.stringify(requestData);
        }

        if (! contentTypeSet) {
            xmlHttp.setRequestHeader('Content-Type', 'application/json');
        }

        return new Promise(resolve => {
            xmlHttp.onreadystatechange = () => {
                if(xmlHttp.readyState !== this._xmlHttp.DONE) {
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

                let data = xmlHttp.responseText;
                if ((headers.get('content-type') || 'text/html').match(/^application\/json/)) {
                    try {
                        data = JSON.parse(data);
                    } catch (e) {
                        // Do nothing
                    }
                }

                resolve({
                    status: xmlHttp.status,
                    statusText: xmlHttp.statusText,
                    headers: headers,
                    data,
                });
            };

            xmlHttp.send(requestData);
        });
    }
}

module.exports = WebRequestor;
