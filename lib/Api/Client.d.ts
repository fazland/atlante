import ClientInterface from './ClientInterface';
import ContextualClientInterface from './ContextualClientInterface';
import Request from "../Requestor/Request";
import Response from '../Requestor/Response';
import RequestorInterface from '../Requestor/RequestorInterface';
import StorageInterface from '../Storage/StorageInterface';

declare interface ClientConfig {
    client_id: string;
    client_secret: string;
    version?: string;
}

declare class ContextualClient extends Client implements ContextualClientInterface {
    constructor(tokenStorage: StorageInterface, requestor: RequestorInterface, clientTokenStorage: StorageInterface, config: ClientConfig);

    /**
     * Authenticates user.
     */
    authenticate(username: string, password: string): Promise<void>;

    /**
     * Logs user out.
     */
    logout(): Promise<void>;
}

declare class Client implements ClientInterface {
    /**
     * Token mutex.
     */
    protected _tokenMutex: __jymfony.Mutex;

    constructor(requestor: RequestorInterface, tokenStorage: StorageInterface, config: ClientConfig);

    /**
     * @inheritdoc
     */
    request<T = any>(method: string, path: string, requestData?: any, headers?: {}): Promise<Response<T>>;

    /**
     * @inheritdoc
     */
    get<T = any>(path: string, headers?: {}): Promise<Response<T>>;

    /**
     * @inheritdoc
     */
    post<T = any>(path: string, requestData?: any, headers?: {}): Promise<Response<T>>;

    /**
     * @inheritdoc
     */
    patch<T = any>(path: string, requestData?: any, headers?: {}): Promise<Response<T>>;

    /**
     * @inheritdoc
     */
    mergePatch<T = any>(path: string, requestData?: any, headers?: {}): Promise<Response<T>>;

    /**
     * @inheritdoc
     */
    withContext(tokenStorage: StorageInterface): ContextualClientInterface;

    /**
     * Filters a response, eventually throwing an error in case response status is not successful.
     */
    protected _filterResponse(request: Request, response: Response): void;

    /**
     * Gets the token for the current api client.
     */
    protected _getToken(): Promise<string>;
}

export default Client;
