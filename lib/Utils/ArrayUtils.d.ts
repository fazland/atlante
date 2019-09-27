declare class ArrayUtils {
    /**
     * Recursively converts all the keys to camel case.
     */
    static toCamelCaseKeys(input: { [key: string]: any }): { [key: string]: any };

    /**
     * Recursively converts all the keys to snake case.
     */
    static toSnakeCaseKeys(input: { [key: string]: any }): { [key: string]: any };

    /**
     * Sort an object by keys.
     */
    static ksort(input: { [key: string]: any }): { [key: string]: any };

    /**
     * Shuffle array elements
     */
    static shuffle(input: any[]): any[];

    /**
     * Computes the difference between two objects.
     */
    static computePatchObject(originalData: { [key: string]: any }, newData: { [key: string]: any }): { [key: string]: any };
}

export default ArrayUtils;
