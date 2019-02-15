import ContextualClientInterface = require('./ContextualClientInterface');
import StorageInterface = require('../Storage/StorageInterface');
import Response = require('../Requestor/Response');
import ClientInterface = require('./ClientInterface');
import RequestorInterface = require('../Requestor/RequestorInterface');

declare class Client implements ClientInterface {
    /**
     * Empty promise used as mutex.
     */
    protected _tokenMutex: Promise<void>;

    constructor(requestor: RequestorInterface, tokenStorage: StorageInterface, config: any);

    /**
     * @inheritdoc
     */
    request<T = any>(method: string, path: string, requestData?: any): Promise<Response<T>>;

    /**
     * @inheritdoc
     */
    get<T = any>(path: string): Promise<Response<T>>;

    /**
     * @inheritdoc
     */
    post<T = any>(path: string, requestData?: any): Promise<Response<T>>;

    /**
     * @inheritdoc
     */
    patch<T = any>(path: string, requestData?: any): Promise<Response<T>>;

    /**
     * @inheritdoc
     */
    mergePatch<T = any>(path: string, requestData?: any): Promise<Response<T>>;

    /**
     * @inheritdoc
     */
    withContext(tokenStorage: StorageInterface): ContextualClientInterface;

    /**
     * @inheritdoc
     */
    on(type: string, listener: Function): void;

    /**
     * Emits an event
     */
    protected _emit(type: string, ...args: any[]): void;

    /**
     * Filters a response, eventually throwing an error in case response status is not successful.
     */
    protected _filterResponse(response: Response): void;

    /**
     * Acquires mutex for token requests.
     */
    protected _acquireMutex(): Promise<Function>;
}

export = Client;
