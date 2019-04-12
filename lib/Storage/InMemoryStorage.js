const Item = require('./Item');
const JSONMarshaller = require('./Marshaller/JSONMarshaller');

/**
 * @memberOf Fazland.Atlante.Storage
 * @implements StorageInterface
 */
class InMemoryStorage {
    constructor(defaultLifetime = 0) {
        /**
         * Create a cache item for the current adapter.
         *
         * @param key
         * @param value
         * @param isHit
         *
         * @returns {ItemInterface}
         *
         * @private
         */
        this._createCacheItem = (key, value, isHit) => {
            const item = new Item();
            item._key = key;
            item._value = value;
            item._isHit = isHit;
            item._defaultLifetime = defaultLifetime;

            return item;
        };

        /**
         * @type {MarshallerInterface}
         */
        this.marshaller = new JSONMarshaller();

        /**
         * @type {Object.<string, string>}
         *
         * @private
         */
        this._values = {};

        /**
         * @type {Object.<string, number>}
         *
         * @private
         */
        this._expiries = {};

        /**
         * @type {number}
         *
         * @private
         */
        this._pruneInterval = undefined;
    }

    /**
     * Deletes the expired items.
     *
     * @returns {Promise<boolean>}
     */
    async prune() {
        const time = new Date().getTime();
        let ok = true;
        for (const key of Object.keys(this._expiries)) {
            if (time < this._expiries[key]) {
                continue;
            }

            ok = await this.deleteItem(key) && ok;
        }

        return ok;
    }

    /**
     * @inheritdoc
     */
    async hasItem(key) {
        return undefined !== this._expiries[key] && this._expiries[key] >= new Date().getTime() || ! this.deleteItem(key);
    }

    /**
     * @inheritdoc
     */
    async clear() {
        this._values = {};
        this._expiries = {};
        if (undefined !== this._pruneInterval) {
            clearInterval(this._pruneInterval);
        }

        return true;
    }

    /**
     * @inheritdoc
     */
    async deleteItem(key) {
        delete this._values[key];
        delete this._expiries[key];

        if (undefined !== this._pruneInterval && 0 === Object.keys(this._expiries).length) {
            clearInterval(this._pruneInterval);
            this._pruneInterval = undefined;
        }

        return true;
    }

    /**
     * @inheritdoc
     */
    async getItem(key) {
        let value;
        let isHit = await this.hasItem(key);

        try {
            if (! isHit || 'undefined' === (value = this._values[key])) {
                this._values[key] = value = undefined;
            } else if (undefined === (value = this.marshaller.unmarshall(value))) {
                this._values[key] = value = undefined;
                isHit = false;
            }
        } catch (e) {
            this._values[key] = value = undefined;
            isHit = false;
        }

        return this._createCacheItem(key, value, isHit);
    }

    /**
     * @inheritdoc
     */
    async save(item) {
        const key = item._key;
        let value = item._value;
        let expiry = item._expiry;

        if (expiry && expiry <= new Date().getTime()) {
            await this.deleteItem(key);

            return true;
        }

        try {
            value = this.marshaller.marshall(value);
        } catch (e) {
            return false;
        }

        if (undefined === expiry && 0 < item._defaultLifetime) {
            expiry = new Date().getTime() + (item._defaultLifetime * 1000);
        }

        this._values[key] = value;
        this._expiries[key] = undefined !== expiry ? expiry : Infinity;

        if (undefined === this._pruneInterval) {
            this._pruneInterval = setInterval(this.prune.bind(this), 60000);
        }

        return true;
    }
}

module.exports = InMemoryStorage;
