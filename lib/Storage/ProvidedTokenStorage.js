const AbstractStorage = require('./AbstractStorage');
const NullMarshaller = require('./Marshaller/NullMarshaller');

class ProvidedTokenStorage extends AbstractStorage {
    /**
     * Constructor.
     *
     * @param {string|undefined} accessToken
     * @param {string|undefined} refreshToken
     */
    constructor(accessToken = undefined, refreshToken = undefined) {
        super();

        /**
         * @type {string}
         *
         * @private
         */
        this._accessToken = accessToken;

        /**
         * @type {string}
         *
         * @private
         */
        this._refreshToken = refreshToken;
        this.marshaller = new NullMarshaller();
    }

    /**
     * @inheritdoc
     */
    async hasItem(key) {
        return ('access_token' === key && undefined !== this._accessToken) ||
            ('refresh_token' === key && undefined !== this._refreshToken);
    }

    /**
     * @inheritdoc
     */
    async clear() {
        this._accessToken = undefined;
        this._refreshToken = undefined;

        return true;
    }

    /**
     * @inheritdoc
     */
    async deleteItem(key) {
        switch (key) {
            case 'access_token':
                this._accessToken = undefined;
                break;

            case 'refresh_token':
                this._refreshToken = undefined;
                break;
        }

        return true;
    }

    /**
     * @inheritdoc
     */
    async _getItem(key) {
        switch (key) {
            case 'access_token':
                return this._accessToken;

            case 'refresh_token':
                return this._refreshToken;
        }

        return undefined;
    }

    /**
     * @inheritdoc
     */
    async _save(key, value, expiry) { // eslint-disable-line no-unused-vars
        switch (key) {
            case 'access_token':
                this._accessToken = value;
                return true;

            case 'refresh_token':
                this._refreshToken = value;
                return true;
        }

        return false;
    }
}

module.exports = ProvidedTokenStorage;
