const isObject = (arg) => null !== arg && 'object' === typeof arg;

/**
 * @internal
 */
class ArrayUtils {
    /**
     * Recursively converts all the keys to camel case.
     *
     * @param {Object.<string, *>} input
     *
     * @return {Object.<string, *>}
     */
    static toCamelCaseKeys(input) {
        return Array.from(Object.entries(input))
            .reduce((res, val) => (
                res[
                    val[0].toString().replace(/(?!^)_([a-zA-Z])/g, matches => matches[1].toUpperCase())
                ] = isObject(val[1]) ?
                    ArrayUtils.toCamelCaseKeys(val[1])
                    : (Array.isArray(val[1]) ? [ ...val[1] ] : val[1])
                , res
            ), Array.isArray(input) ? [] : {})
        ;
    }

    /**
     * Sort an object by keys.
     *
     * @param {Object.<string, *>} obj
     *
     * @returns {Object.<string, *>}
     */
    static ksort(obj) {
        return Array.from(Object.entries(obj))
            .sort((a, b) => collator.compare(a[0], b[0]))
            .reduce((res, val) => (res[val[0]] = obj[val[0]], res), {})
        ;
    }
}

module.exports = ArrayUtils;
