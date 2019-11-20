import '@jymfony/util/lib/Async/Mutex';
import '@jymfony/util/lib/Platform';
import '@jymfony/util/lib/is';
import '@jymfony/util/lib/Object/filter';

import Headers from '../Requestor/Headers';
import HttpException from '../Exception/HttpException';
import NoTokenAvailableException from '../Exception/NoTokenAvailableException';
import NotFoundHttpException from '../Exception/NotFoundHttpException';

/**
 * @memberOf Fazland.Atlante.Api
 * @implements ClientInterface
 */
export default class Client {
    /**
     * Constructor.
     *
     * @param {RequestorInterface} requestor Object which performs http requests.
     * @param {StorageInterface} tokenStorage Storage for CLIENT TOKEN.
     * @param {Object.<string, *>} config Configuration values (client_id, secret, ...)
     */
    constructor(requestor, tokenStorage, config) {
        /**
         * @type {RequestorInterface}
         *
         * @protected
         */
        this._requestor = requestor;

        /**
         * @type {Object.<string, *>}
         *
         * @protected
         */
        this._config = config;

        /**
         * Token mutex.
         *
         * @type {__jymfony.Mutex}
         *
         * @protected
         */
        this._tokenMutex = new __jymfony.Mutex();

        /**
         * @type {StorageInterface}
         *
         * @private
         */
        this._tokenStorage = tokenStorage;
    }

    /**
     * @inheritdoc
     */
    get(path, headers = {}) {
        return this.request('GET', path, null, headers);
    }

    /**
     * @inheritdoc
     */
    post(path, requestData, headers = {}) {
        return this.request('POST', path, requestData, headers);
    }

    /**
     * @inheritdoc
     */
    patch(path, requestData, headers = {}) {
        return this.request('PATCH', path, requestData, headers);
    }

    /**
     * @inheritdoc
     */
    mergePatch(path, requestData, headers = {}) {
        return this.patch(path, requestData, Object.assign(headers, { 'Content-Type': 'application/merge-patch+json'}));
    }

    /**
     * @inheritdoc
     */
    withContext(tokenStorage) {
        return new ContextualClient(tokenStorage, this._requestor, this._tokenStorage, this._config);
    }

    /**
     * @inheritdoc
     */
    async request(method, path, requestData, headers = {}) {
        const token = await this._getToken();
        if ('GET' === method && 'HEAD' === method && 'DELETE' === method) {
            requestData = null;
        }

        let acceptHeader = 'application/json';
        if (!!this._config.version) {
            acceptHeader += `; version=${this._config.version}`;
        }

        headers = Object.assign({
            Authorization: `Bearer ${token}`,
            Accept: acceptHeader,
        }, headers);

        const response = await this._requestor.request(method, path, headers, requestData);
        this._filterResponse({
            method,
            url: path,
            headers,
            body: requestData,
        }, response);

        return response;
    }

    /**
     * Gets a valid client token.
     *
     * @param {boolean} [force = false]
     *
     * @returns {Promise<string>}
     */
    async clientToken(force = false) {
        const item = await this._tokenStorage.getItem('fazland_atlante_client_token');
        if (!force && item.isHit) {
            return item.get();
        }

        const response = await this._requestor.request('POST', '/token', {}, {
            grant_type: 'client_credentials',
            client_id: this._config.client_id,
            client_secret: this._config.client_secret,
        });

        try {
            this._filterResponse({
                method: 'POST',
                url: '/token',
                headers: new Headers(),
                body: JSON.stringify({
                    grant_type: 'client_credentials',
                    client_id: this._config.client_id,
                    client_secret: this._config.client_secret,
                }),
            }, response);
        } catch (e) {
            const ex = new NoTokenAvailableException();
            ex.previous = e;

            throw ex;
        }

        const content = response.data;
        const token = content.access_token;

        item.set(token);
        item.expiresAfter(content.expires_in - 60);
        await this._tokenStorage.save(item);

        return token;
    }

    /**
     * Gets the token for the current api client.
     *
     * @returns {Promise<string>}
     *
     * @protected
     */
    _getToken() {
        return this._tokenMutex.runExclusive(async () => {
            return this.clientToken();
        });
    }

    /**
     * Filters a response, eventually throwing an error in case response status is not successful.
     *
     * @param {Request} request
     * @param {Response} response
     *
     * @protected
     */
    _filterResponse(request, response) {
        if (200 <= response.status && 300 > response.status) {
            return;
        }

        switch (response.status) {
            case 404:
                throw new NotFoundHttpException(response, request);

            case 400:
            case 401:
            case 403:
            default:
                throw new HttpException(response.statusText, response, request);
        }
    }
}

/**
 * @internal
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
    }

    /**
     * Authenticates user.
     *
     * @param {string} username
     * @param {string} password
     *
     * @return {Promise<void>}
     */
    authenticate(username, password) {
        return this._tokenMutex.runExclusive(async () => {
            const response = await this._requestor.request('POST', '/token', {}, {
                grant_type: 'password',
                client_id: this._config.client_id,
                client_secret: this._config.client_secret,
                username,
                password,
            });

            await this._storeTokenFromResponse({
                method: 'POST',
                url: '/token',
                headers: new Headers(),
                body: JSON.stringify({
                    grant_type: 'password',
                    client_id: this._config.client_id,
                    client_secret: this._config.client_secret,
                    // Do not include username and password here
                }),
            }, response);
        });
    }

    /**
     * Logs user out.
     *
     * @return {Promise<void>}
     */
    async logout() {
        await this._userTokenStorage.deleteItem('access_token');
        await this._userTokenStorage.deleteItem('refresh_token');
    }

    /**
     * Gets the token.
     *
     * @returns {Promise<string>}
     *
     * @protected
     */
    _getToken() {
        return this._tokenMutex.runExclusive(async () => {
            const item = await this._userTokenStorage.getItem('access_token');
            if (item.isHit) {
                return item.get();
            }

            const refreshItem = await this._userTokenStorage.getItem('refresh_token');
            if (!refreshItem.isHit) {
                return await this.clientToken();
            }

            const response = await this._requestor.request('POST', '/token', {}, {
                grant_type: 'refresh_token',
                client_id: this._config.client_id,
                client_secret: this._config.client_secret,
                refresh_token: refreshItem.get(),
            });

            try {
                await this._storeTokenFromResponse({
                    method: 'POST',
                    url: '/token',
                    headers: new Headers(),
                    body: JSON.stringify({
                        grant_type: 'refresh_token',
                        client_id: this._config.client_id,
                        client_secret: this._config.client_secret,
                        // Do not include the token here
                    }),
                }, response);
            } catch (e) {
                if (e instanceof HttpException && 400 === e.response.status) {
                    await this._userTokenStorage.clear();

                    return null;
                }

                throw e;
            }

            return response.data.access_token;
        });
    }

    async _storeTokenFromResponse(request, response) {
        const item = await this._userTokenStorage.getItem('access_token');
        const refreshItem = await this._userTokenStorage.getItem('refresh_token');

        this._filterResponse(request, response);
        const content = response.data;

        item.set(content.access_token);
        item.expiresAfter(content.expires_in - 60);
        await this._userTokenStorage.save(item);

        refreshItem.set(content.refresh_token);
        await this._userTokenStorage.save(refreshItem);
    }
}
