import StorageInterface = require("./StorageInterface");
import MarshallerInterface = require("./Marshaller/MarshallerInterface");
import ItemInterface = require("./ItemInterface");

declare class InMemoryStorage implements StorageInterface {
    public marshaller: MarshallerInterface;

    constructor(defaultLifetime?: number);

    /**
     * Deletes the expired items.
     */
    prune(): Promise<boolean>;

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
}

export = InMemoryStorage;
