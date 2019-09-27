import AbstractStorage from './AbstractStorage';

const getCookie = (key) => {
    const name = key + '=';
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';')
        .map(str => str.trim());

    for (const c of ca) {
        if (0 === c.indexOf(name)) {
            return c.substring(name.length, c.length);
        }
    }

    return undefined;
};

/**
 * @memberOf Fazland.Atlante.Storage
 *
 * @implements StorageInterface
 */
export default class CookieStorage extends AbstractStorage {
    constructor(cookieDomain = undefined, defaultLifetime = 0) {
        super(defaultLifetime);

        /**
         * @type {string}
         *
         * @private
         */
        this._cookieDomain = cookieDomain;
    }

    /**
     * @inheritdoc
     */
    async hasItem(key) {
        return !! document.cookie.match(new RegExp('(^|;)\\s*'+key+'='));
    }

    /**
     * @inheritdoc
     */
    async deleteItem(key) {
        document.cookie = key + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/' +
            (this._cookieDomain ? ';domain='+this._cookieDomain : '');

        return true;
    }

    /**
     * @inheritdoc
     */
    async _getItem(key) {
        return getCookie(key);
    }

    /**
     * @inheritdoc
     */
    async _save(key, value, expiry) {
        const d = new Date();
        d.setTime(expiry);

        document.cookie = key + '=' + value + ';' +
            'expires='+ d.toUTCString() + ';path=/' +
            (this._cookieDomain ? ';domain='+this._cookieDomain : '')
        ;

        return true;
    }
}
