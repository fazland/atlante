import AbstractStorage = require("./AbstractStorage");

declare class ProvidedTokenStorage extends AbstractStorage {
    private _accessToken?: string;
    private _refreshToken?: string;

    /**
     * Constructor.
     *
     * @param {string|undefined} accessToken
     * @param {string|undefined} refreshToken
     */
    constructor(accessToken?: string|undefined, refreshToken?: string|undefined);

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
    _getItem(key: string): Promise<any>;

    /**
     * @inheritdoc
     */
    _save(key: string, value: any, expiry: Date): Promise<boolean>;
}

export = ProvidedTokenStorage;
