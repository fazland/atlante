/**
 * @memberOf Fazland.Atlante.Exception
 */
export default class HttpException extends Error {
    /**
     * Constructor.
     *
     * @param {string}   [message = '']
     * @param {Response} [response]
     * @param {Request}  [request]
     */
    constructor(message = '', response = undefined, request = undefined) {
        super(message);

        /**
         * @type {undefined|Request}
         *
         * @private
         */
        this._request = request;

        /**
         * @type {undefined|Response}
         *
         * @private
         */
        this._response = response;
    }

    /**
     * Gets the request, if set.
     *
     * @returns {undefined|Request}
     */
    get request() {
        return this._request;
    }

    /**
     * Gets the response, if set.
     *
     * @returns {undefined|Response}
     */
    get response() {
        return this._response;
    }
}
