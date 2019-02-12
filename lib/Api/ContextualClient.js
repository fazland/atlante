const Client = require('./Client');

/**
 * @memberOf Fazland.Atlante.Api
 */
class ContextualClient extends Client {
    /**
     * Constructor.
     *
     * @param {StorageInterface} tokenStorage Storage for USER TOKENS.
     * @param {RequestorInterface} requestor Object which performs http requests.
     * @param {StorageInterface} clientTokenStorage Storage for CLIENT TOKEN.
     * @param {Object.<string, *>} config Configuration values (client_id, secret, ...)
     */
    constructor(tokenStorage, requestor, clientTokenStorage, config) {
        super(requestor, clientTokenStorage, config);

        /**
         * @type {StorageInterface}
         *
         * @private
         */
        this._userTokenStorage = tokenStorage;

        /**
         * Empty promise used as mutex.
         *
         * @type {Promise<void>}
         *
         * @private
         */
        this._tokenMutex = Promise.resolve();
    }

    async authenticate(username, password) {
        let resolve;

        await this._tokenMutex;
        this._tokenMutex = new Promise(res => resolve = res);

        const item = await this._userTokenStorage.getItem('access_token');
        const refreshItem = await this._userTokenStorage.getItem('refresh_token');

        try {
            const response = await this._requestor.request('POST', '/token', {}, {
                grant_type: 'password',
                client_id: this._config.client_id,
                client_secret: this._config.client_secret,
                username,
                password,
            });

            this._filterResponse(response);
            const content = response.data;

            item.set(content.access_token);
            item.expiresAfter(content.expires_in - 600);
            await this._userTokenStorage.save(item);

            refreshItem.set(content.refresh_token);
            await this._userTokenStorage.save(refreshItem);
        } catch (e) {
            console.error(e.message);
        } finally {
            resolve();
        }

        return item.get();
    }

    /**
     * Gets the token.
     *
     * @returns {Promise<string>}
     *
     * @protected
     */
    async _getToken() {
        const item = await this._userTokenStorage.getItem('access_token');
        if (item.isHit) {
            return item.get();
        }

        const refreshItem = await this._userTokenStorage.getItem('refresh_token');
        if (! refreshItem.isHit) {
            return '';
        }

        let resolve;

        await this._tokenMutex;
        this._tokenMutex = new Promise(res => {
            resolve = res;
        });

        try {
            const response = await this._requestor.request('POST', '/token', {}, {
                grant_type: 'refresh_token',
                client_id: this._config.client_id,
                client_secret: this._config.client_secret,
                refresh_token: refreshItem.get(),
            });

            this._filterResponse(response);
            const content = response.data;

            item.set(content.access_token);
            item.expiresAfter(content.expires_in - 60);
            await this._userTokenStorage.save(item);

            refreshItem.set(content.refresh_token);
            await this._userTokenStorage.save(refreshItem);
        } catch (e) {
            this._emit('error', e);
        } finally {
            resolve();
        }

        return item.get();
    }
}

if (global.Fazland && global.Fazland.Atlante) {
    Fazland.Atlante.Api.Client.ContextualClient = ContextualClient;
}
Client.ContextualClient = ContextualClient;

module.exports = ContextualClient;
