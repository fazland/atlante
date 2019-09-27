import AbstractStorage from './AbstractStorage';

/**
 * @implements StorageInterface
 */
declare class WebLocalStorage extends AbstractStorage {
    /**
     * @inheritdoc
     */
    hasItem(key: string): Promise<boolean>;

    /**
     * @inheritdoc
     */
    deleteItem(key: string): Promise<boolean>;

    /**
     * @inheritdoc
     */
    protected _getItem(key: string): Promise<string>;

    /**
     * @inheritdoc
     */
    protected _save(key: string, value: string, expiry: Date): Promise<boolean>;
}

export default WebLocalStorage;
