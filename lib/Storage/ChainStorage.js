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
    async getItem(key) {
        let item;
        for (const storage of this._storages) {
            try {
                item = await storage.getItem(key);
                if (! item.isHit) {
                    continue;
                }

                break;
            } catch (e) {
                // Continue to the next storage.
            }
        }

        if (undefined === item) {
            throw new Error('No available storage.');
        }

        return item;
    }

    /**
     * @inheritdoc
     */
    async hasItem(key) {
        for (const storage of this._storages) {
            try {
                if (await storage.hasItem(key)) {
                    return true;
                }
            } catch (e) {
                // Continue to the next storage.
            }
        }

        return false;
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
