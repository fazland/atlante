declare class HttpException extends Error {
    /**
     * Constructor.
     */
    constructor(message?: string, response?: Response);

    /**
     * Response received by the API.
     */
    readonly response: Response|undefined;
}

export default HttpException;
