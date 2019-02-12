import RequestorInterface = require("./RequestorInterface");
import Response = require("./Response");

/**
 * Requestor that can be used in a browser context.
 */
declare class WebRequestor implements RequestorInterface {
    /**
     * Constructor.
     */
    constructor(baseUrl: string);

    /**
     * @inheritdoc
     */
    request<T = any>(method: string, path: string, headers?: any, requestData?: any): Promise<Response<T>>;
}

export = WebRequestor;
