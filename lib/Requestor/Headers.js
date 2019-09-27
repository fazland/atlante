/**
 * @memberOf Fazland.Atlante.Requestor
 */
export default class Headers {
    constructor() {
        /**
         * @type {Object.<string, string[]>}
         *
         * @private
         */
        this._headers = {};

        /**
         * @type {Object.<string, string>}
         *
         * @private
         */
        this._headersName = {};
    }

    /**
     * Sets an header.
     *
     * @param {string} name
     * @param {string|string[]} value
     *
     * @returns {this}
     */
    set(name, value) {
        const lowerName = name.toLowerCase();

        this._headers[lowerName] = Array.isArray(value) ? value : [ value ];
        this._headersName[lowerName] = name;

        return this;
    }

    /**
     * Gets an header by name.
     *
     * @param {string} name
     *
     * @returns {undefined|string|string[]}
     */
    get(name) {
        if (! this.has(name)) {
            return undefined;
        }

        const lowerName = name.toLowerCase();
        const hdr = this._headers[lowerName];

        return 1 === hdr.length ? hdr[0] : hdr;
    }

    /**
     * Checks whether an header is present.
     *
     * @param {string} name
     *
     * @returns {boolean}
     */
    has(name) {
        const lowerName = name.toLowerCase();

        return this._headers.hasOwnProperty(lowerName);
    }

    /**
     * Removes an header.
     *
     * @param {string} name
     *
     * @returns {this}
     */
    remove(name) {
        const lowerName = name.toLowerCase();

        delete this._headers[lowerName];
        delete this._headersName[lowerName];

        return this;
    }

    /**
     * Adds an header.
     *
     * @param {string} name
     * @param {string|string[]} value
     *
     * @returns {this}
     */
    add(name, value) {
        if (! this.has(name)) {
            return this.set(name, value);
        }

        const lowerName = name.toLowerCase();

        value = ! Array.isArray(value) ? [ value ] : value;
        this._headers[lowerName] = [ ...this._headers[lowerName], ...value ];

        return this;
    }
}
