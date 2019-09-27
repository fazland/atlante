/**
 * @memberOf Fazland.Atlante.Requestor
 */
class RequestorInterface {
    /**
     * Performs a request.
     * Returns a response with parsed data, if no error is present.
     *
     * @param {string} method
     * @param {string} path
     * @param {Object.<string, *>} [headers = {}]
     * @param {*} [requestData]
     *
     * @returns {Promise<Response>}
     */
    async request(method, path, headers, requestData) { }
}

export default getInterface(RequestorInterface);
