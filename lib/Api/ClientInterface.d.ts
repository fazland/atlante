import ContextualClientInterface = require('./ContextualClientInterface');
import StorageInterface = require('../Storage/StorageInterface');
import Response = require('../Requestor/Response');

declare interface ClientInterface {
    /**
     * Adds an event listener.
     */
    on(type: string, listener: Function): void;

    /**
     * Performs a request to the API service using the given method.
     *
     * Request data should be either a string, an array or an object.
     * If not a string will be JSON-encoded.
     * The parameter is ignored on GET, HEAD and DELETE requests.
     *
     * In case of an error, the "error" event SHOULD be emitted.
     * If no handler has been registered the error MUST be thrown.
     *
     * @throws {NoTokenAvailableException} When no token could be provided for the request.
     */
    request<T = any>(method: string, path: string, requestData?: any, headers?: {}): Promise<void|Response<T>>;

    /**
     * Performs a request to the API service using a GET method.
     */
    get<T = any>(path: string, headers?: {}): Promise<Response<T>>;

    /**
     * Performs a request to the API service using a POST method.
     */
    post<T = any>(path: string, requestData?: any, headers?: {}): Promise<Response<T>>;

    /**
     * Performs a request to the API service using a PATCH method.
     */
    patch<T = any>(path: string, requestData?: any, headers?: {}): Promise<Response<T>>;

    /**
     * Performs a request to the API service using a PATCH method with merge patch header set.
     */
    mergePatch<T = any>(path: string, requestData?: any, headers?: {}): Promise<Response<T>>;

    /**
     * Gets a context-aware client.
     */
    withContext(tokenStorage: StorageInterface): ContextualClientInterface;
}

export = ClientInterface;
