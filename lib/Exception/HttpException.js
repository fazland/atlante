/**
 * @memberOf Fazland.Atlante.Exception
 */
class HttpException extends Error {
    /**
     * Constructor.
     *
     * @param {string}   [message = '']
     * @param {Response} [response]
     */
    constructor(message = '', response = undefined) {
        super(message);

        /**
         * @type {undefined|Response}
         *
         * @private
         */
        this._response = response;
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

module.exports = HttpException;
