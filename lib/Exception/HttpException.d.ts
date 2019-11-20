import Request from "../Requestor/Request";
import Response from "../Requestor/Response";

declare class HttpException extends Error {
    /**
     * Constructor.
     */
    constructor(message?: string, response?: Response, request?: Request);

    /**
     * Request sent to the API.
     */
    readonly request: Request|undefined;

    /**
     * Response received by the API.
     */
    readonly response: Response|undefined;
}

export default HttpException;
