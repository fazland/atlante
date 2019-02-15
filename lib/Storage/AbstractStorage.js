/* eslint-disable no-unused-vars */

const Item = require('./Item');
const JSONMarshaller = require('./Marshaller/JSONMarshaller');

/**
 * @memberOf Fazland.Atlante.Storage
 * @implements StorageInterface
 * @abstract
 */
class AbstractStorage {
    /**
     * Constructor.
     *
     * @param [defaultLifetime = 0]
     */
    constructor(defaultLifetime = 0) {
        /**
         * Create a cache item for the current adapter.
         *
         * @param {string} key
         * @param {*} value
         * @param {boolean} isHit
         *
         * @returns {ItemInterface}
         *
         * @private
         */
        this._createItem = (key, value, isHit) => {
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
    }

    /**
     * @inheritdoc
     */
    async getItem(key) {
        let value;
        let isHit = await this.hasItem(key);

        try {
            if (! isHit || 'undefined' === (value = await this._getItem(key))) {
                value = undefined;
            } else if (undefined === (value = this.marshaller.unmarshall(value))) {
                value = undefined;
                isHit = false;
            }
        } catch (e) {
            console.warn('Failed to unserialize key "' + key + '"');

            value = undefined;
            isHit = false;
        }

        return this._createItem(key, value, isHit);
    }

    /**
     * @inheritdoc
     * @abstract
     */
    async hasItem(key) {
        throw new Error('Must be implemented by subclasses');
    }

    /**
     * @inheritdoc
     */
    async clear() {
        return false;
    }

    /**
     * @inheritdoc
     * @abstract
     */
    async deleteItem(key) {
        throw new Error('Must be implemented by subclasses');
    }

    /**
     * @inheritdoc
     */
    async save(item) {
        const key = item._key;
        let value = item._value;
        let expiry = item._expiry;

        if (expiry && expiry <= ~~(new Date().getTime() / 1000)) {
            await this.deleteItem(key);

            return true;
        }

        try {
            value = this.marshaller.marshall(value);
            if (undefined === value) {
                value = 'undefined';
            }
        } catch (e) {
            console.warn(`Failed to save key "${key}" (${typeof value})`);

            return false;
        }

        if (undefined === expiry && 0 < item._defaultLifetime) {
            expiry = new Date().setTime(new Date().getTime() + (item._defaultLifetime * 1000));
        } else if (undefined === expiry) {
            expiry = null;
        }

        return await this._save(key, value, expiry);
    }

    /**
     * Gets an item from the storage, if not expired.
     *
     * @param {string} key
     *
     * @returns {Promise<string>}
     *
     * @protected
     * @abstract
     */
    async _getItem(key) {
        throw new Error('Must be implemented by subclasses');
    }

    /**
     * Stores an item into the storage.
     *
     * @param key
     * @param value
     * @param expiry
     *
     * @returns {Promise<boolean>}
     *
     * @protected
     * @abstract
     */
    async _save(key, value, expiry) {
        throw new Error('Must be implemented by subclasses');
    }
}

module.exports = AbstractStorage;
