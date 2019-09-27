/**
 * @memberOf Fazland.Atlante.Storage
 *
 * @see StorageInterface.d.ts
 */
class StorageInterface {
    /**
     * @returns {Promise<ItemInterface>}
     */
    async getItem(key) { }

    /**
     * @returns {Promise<boolean>}
     */
    async hasItem(key) { }

    /**
     * @returns {Promise<boolean>}
     */
    async clear() { }

    /**
     * @param {string} key
     *
     * @returns {Promise<boolean>}
     */
    async deleteItem(key) { }

    /**
     * @param {ItemInterface} item
     *
     * @returns {Promise<boolean>}
     */
    async save(item) { }
}

export default getInterface(StorageInterface);
