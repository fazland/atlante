const HttpException = require('../Exception/HttpException');
const NoTokenAvailableException = require('../Exception/NoTokenAvailableException');
const NotFoundHttpException = require('../Exception/NotFoundHttpException');
const Mutex = require('../Utils/Mutex');

require('@jymfony/util/lib/Platform');
require('@jymfony/util/lib/is');
require('@jymfony/util/lib/Object/filter');

function EventHandlers() {}
EventHandlers.prototype = Object.create(null);

/**
 * @memberOf Fazland.Atlante.Api
 * @implements ClientInterface
 */
class Client {
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
         * Empty promise used as mutex.
         *
         * @type {Mutex}
         *
         * @protected
         */
        this._tokenMutex = new Mutex();

        /**
         * @type {StorageInterface}
         *
         * @private
         */
        this._tokenStorage = tokenStorage;

        /**
         * Event listeners collection.
         *
         * @type {EventHandlers}
         *
         * @private
         */
        this._events = new EventHandlers();
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
        return new Client.ContextualClient(tokenStorage, this._requestor, this._tokenStorage, this._config);
    }

    /**
     * @inheritdoc
     */
    async request(method, path, requestData, headers = {}) {
        try {
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
            this._filterResponse(response);

            return response;
        } catch (e) {
            switch (true) {
                case e instanceof NoTokenAvailableException:
                    this._emit('error', e);
                    break;

                default:
                    throw e;
            }
        }
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
            this._filterResponse(response);
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
     * @inheritdoc
     */
    on(type, listener) {
        const events = this._events;
        const existing = events[type];

        if (! isFunction(listener)) {
            throw new TypeError('"listener" argument must be a function');
        }

        if (!existing) {
            // Optimize the case of one listener. Don't need the extra array object.
            events[type] = listener;
        } else {
            if (isFunction(existing)) {
                // Adding the second element, need to change to array.
                events[type] = [ existing, listener ];
            } else {
                // If we've already got an array, just append.
                existing.push(listener);
            }
        }

        return this;
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
     * @param {Response} response
     *
     * @protected
     */
    _filterResponse(response) {
        if (200 <= response.status && 300 > response.status) {
            return;
        }

        switch (response.status) {
            case 404:
                throw new NotFoundHttpException(response);

            case 400:
            case 401:
            case 403:
            default:
                throw new HttpException(response.statusText, response);
        }
    }

    /**
     * Emits an event.
     *
     * @param {string} type
     * @param {*} args
     *
     * @returns {boolean}
     *
     * @protected
     */
    _emit(type, ...args) {
        let doError = ('error' === type);

        const events = this._events;
        if (events) {
            doError = (doError && ! events.error);
        } else if (! doError) {
            return true;
        }

        // If there is no 'error' event listener then throw.
        if (doError) {
            const er = args[0];

            if (er instanceof Error) {
                throw er; // Unhandled 'error' event
            } else {
                // At least give some kind of context to the user
                const err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
                err.context = er;

                throw err;
            }
        }

        const handler = events[type];
        if (! handler) {
            return false;
        }

        if (isFunction(handler)) {
            handler.apply(this, args);
        } else {
            for (const h of handler) {
                h.apply(this, args);
            }
        }

        return true;
    }
}

if (global.__jymfony && global.__jymfony.autoload) {
    Client.ContextualClient = Fazland.Atlante.Api.ContextualClient;
}

module.exports = Client;
