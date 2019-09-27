/**
 * Storage interface
 */
import ItemInterface from './ItemInterface';

declare interface StorageInterface {
    /**
     * Returns a Item representing the specified key.
     *
     * This method must always return a ItemInterface object, even in case of
     * a miss. It MUST NOT return null.
     */
    getItem(key: string): Promise<ItemInterface>;

    /**
     * Confirms if the storage contains specified item.
     *
     * Note: This method MAY avoid retrieving the value for performance reasons.
     * This could result in a race condition with ItemInterface.get(). To avoid
     * such situation use ItemInterface.isHit instead.
     */
    hasItem(key: string): Promise<boolean>;

    /**
     * Deletes all items in the storage.
     */
    clear(): Promise<boolean>;

    /**
     * Removes the item from the storage.
     */
    deleteItem(key: string): Promise<boolean>;

    /**
     * Persists a cache item.
     */
    save(item: ItemInterface): Promise<boolean>;
}

export default StorageInterface;
