import AbstractStorage from './AbstractStorage';

/**
 * @memberOf Fazland.Atlante.Storage
 *
 * @implements StorageInterface
 */
export default class WebLocalStorage extends AbstractStorage {
    /**
     * @inheritdoc
     */
    async hasItem(key) {
        let item;
        try {
            item = localStorage.getItem(key);
        } catch (e) {
            return false;
        }

        if (null === item) {
            return false;
        }

        try {
            item = this.marshaller.unmarshall(item);
            const expiry = item.expiry;

            return null === expiry || expiry >= new Date().getTime();
        } catch (e) {
            return false;
        }
    }

    /**
     * @inheritdoc
     */
    async clear() {
        localStorage.clear();
        return true;
    }

    /**
     * @inheritdoc
     */
    async deleteItem(key) {
        localStorage.removeItem(key);

        return true;
    }

    /**
     * @inheritdoc
     */
    async _getItem(key) {
        let item;
        if (! (item = localStorage.getItem(key)) || ! (item = this.marshaller.unmarshall(item))) {
            return undefined;
        }

        return item.value;
    }

    /**
     * @inheritdoc
     */
    async _save(key, value, expiry) {
        localStorage.setItem(key, this.marshaller.marshall({ value, expiry }));

        return true;
    }
}
