/**
 * @memberOf Atlante.Storage
 *
 * @see ItemInterface.d.ts
 */
class ItemInterface {
    /**
     * @returns {string}
     */
    get key() { }

    /**
     * @returns {*}
     */
    get() { }

    /**
     * @returns {boolean}
     */
    get isHit() { }

    /**
     * @param {*} value
     *
     * @returns {ItemInterface}
     */
    set(value) { }

    /**
     * @param {null|undefined|Date} expiration
     *
     * @returns {ItemInterface}
     */
    expiresAt(expiration) { }

    /**
     * Sets the expiration time for this item.
     *
     * @param {undefined|int} time
     *
     * @returns {ItemInterface}
     */
    expiresAfter(time) { }
}

module.exports = ItemInterface;
