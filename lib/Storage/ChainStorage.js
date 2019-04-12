/**
 * @memberOf Fazland.Atlante.Storage
 * @implements StorageInterface
 */
class ChainStorage {
    /**
     * Constructor.
     *
     * @param {StorageInterface[]} [storages = []]
     */
    constructor(storages = []) {
        /**
         * @type {StorageInterface[]}
         *
         * @private
         */
        this._storages = storages;
    }

    /**
     * Adds a storage to the chain.
     *
     * @param {StorageInterface} storage
     */
    addStorage(storage) {
        this._storages.push(storage);
    }

    /**
     * @inheritdoc
     */
    getItem(key) {
        return this._call('getItem', key);
    }

    /**
     * @inheritdoc
     */
    hasItem(key) {
        return this._call('hasItem', key);
    }

    /**
     * @inheritdoc
     */
    clear() {
        return this._call('clear');
    }

    /**
     * @inheritdoc
     */
    deleteItem(key) {
        return this._call('deleteItem', key);
    }

    /**
     * @inheritdoc
     */
    save(item) {
        return this._call('save', item);
    }

    /**
     * Chain-call storages.
     *
     * @param {string} method
     * @param {any[]} args
     *
     * @return {Promise<any>}
     *
     * @private
     */
    async _call(method, ...args) {
        for (const storage of this._storages) {
            try {
                return await storage[method](...args);
            } catch (e) {
                // Continue to the next storage.
            }
        }

        throw new Error('No available storage.');
    }
}

module.exports = ChainStorage;
