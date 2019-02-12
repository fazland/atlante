declare class HttpException extends Error {
    /**
     * Response received by the API.
     */
    readonly response: Response|undefined;
}

export = HttpException;
