declare class Headers {
    /**
     * Sets an header.
     */
    set(name: string, value: string | string[]): Headers;

    /**
     * Gets an header by name.
     */
    get(name: string): string | string[] | undefined;

    /**
     * Checks whether an header is present.
     */
    has(name: string): boolean;

    /**
     * Removes an header.
     */
    remove(name: string): Headers;

    /**
     * Adds an header.
     */
    add(name: string, value: string | string[]): Headers;
}

export default Headers;
