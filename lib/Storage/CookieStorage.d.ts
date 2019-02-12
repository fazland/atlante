import AbstractStorage = require("./AbstractStorage");

declare class CookieStorage extends AbstractStorage {
    constructor(cookieDomain?: string, defaultLifetime?: number);

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

export = CookieStorage;
