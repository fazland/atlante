import MarshallerInterface = require('./Marshaller/MarshallerInterface');
import StorageInterface = require('./StorageInterface');
import ItemInterface = require('./ItemInterface');

declare abstract class AbstractStorage implements StorageInterface {
    public marshaller: MarshallerInterface;

    constructor(defaultLifetime?: number);

    /**
     * @inheritdoc
     */
    getItem(key: string): Promise<ItemInterface>;

    /**
     * @inheritdoc
     */
    hasItem(key: string): Promise<boolean>;

    /**
     * @inheritdoc
     */
    clear(): Promise<boolean>;

    /**
     * @inheritdoc
     */
    deleteItem(key: string): Promise<boolean>;

    /**
     * @inheritdoc
     */
    save(item: ItemInterface): Promise<boolean>;

    /**
     * Gets an item from the storage, if not expired.
     */
    protected abstract _getItem(key: string): Promise<string>

    /**
     * Stores an item into the storage.
     */
    protected abstract _save(key: string, value: string, expiry: Date): Promise<boolean>;
}

export = AbstractStorage;
