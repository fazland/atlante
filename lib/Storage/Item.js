/**
 * @memberOf Fazland.Atlante.Storage
 *
 * @implements ItemInterface
 */
export default class Item {
    constructor() {
        /**
         * @type {string}
         *
         * @private
         */
        this._key = undefined;

        /**
         * @type {*}
         *
         * @private
         */
        this._value = undefined;

        /**
         * @type {boolean}
         *
         * @private
         */
        this._isHit = false;

        /**
         * @type {int}
         *
         * @private
         */
        this._expiry = undefined;

        /**
         * @type {int}
         *
         * @private
         */
        this._defaultLifetime = undefined;
    }

    /**
     * @inheritdoc
     */
    get isHit() {
        return this._isHit;
    }

    /**
     * @inheritdoc
     */
    get key() {
        return this._key;
    }

    /**
     * @inheritdoc
     */
    expiresAt(expiration) {
        if (null === expiration || undefined === expiration) {
            this._expiry = 0 < this._defaultLifetime ? new Date().setTime(new Date().getTime() + (this._defaultLifetime * 1000)) : undefined;
        } else if (expiration instanceof Date) {
            this._expiry = expiration;
        } else {
            throw new Error('Expiration date must an instance of Date or be null or undefined, "' + typeof expiration + '" given');
        }

        return this;
    }

    /**
     * @inheritdoc
     */
    expiresAfter(time) {
        if (null === time || undefined === time) {
            this._expiry = 0 < this._defaultLifetime ? new Date().setTime(new Date().getTime() + (this._defaultLifetime * 1000)) : undefined;
        } else if ('number' === typeof time) {
            this._expiry = new Date().setTime(new Date().getTime() + (time * 1000));
        } else {
            throw new Error('Expiration date must an instance of TimeSpan, a Number or be null or undefined, "' + typeof time + '" given');
        }

        return this;
    }

    /**
     * @inheritdoc
     */
    get() {
        return this._value;
    }

    /**
     * @inheritdoc
     */
    set(value) {
        this._value = value;

        return this;
    }
}
