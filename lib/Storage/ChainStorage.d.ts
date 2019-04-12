import StorageInterface = require("./StorageInterface");
import ItemInterface = require("./ItemInterface");

declare class ChainStorage implements StorageInterface {
    private _storages: StorageInterface[];
    /**
     * Constructor.
     */
    constructor(storages?: StorageInterface[]);

    /**
     * Adds a storage to the chain.
     */
    addStorage(storage: StorageInterface): void;

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
     * Chain-call storages.
     */
    private _call(method: string, ...args: any[]): Promise<any>;
}

export = ChainStorage;
