import ItemInterface = require("./ItemInterface");

declare class Item implements ItemInterface {
    /**
     * @inheritdoc
     */
    readonly key: string;

    /**
     * @inheritdoc
     */
    get(): any;

    /**
     * @inheritdoc
     */
    readonly isHit: boolean;

    /**
     * @inheritdoc
     */
    set(value: any): ItemInterface;

    /**
     * @inheritdoc
     */
    expiresAt(expiration: Date | undefined | null): ItemInterface;

    /**
     * @inheritdoc
     */
    expiresAfter(time: number | undefined): ItemInterface;
}

export = Item;
