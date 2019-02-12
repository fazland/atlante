import ContextualClientInterface = require('./ContextualClientInterface');
import Client = require('./Client');
import StorageInterface = require('../Storage/StorageInterface');
import RequestorInterface = require('../Requestor/RequestorInterface');

declare class ContextualClient extends Client implements ContextualClientInterface {
    constructor(
        tokenStorage: StorageInterface,
        requestor: RequestorInterface,
        clientTokenStorage: StorageInterface,
        config: any
    );

    /**
     * Authenticates user.
     */
    authenticate(username: string, password: string): Promise<void>;
}

export = ContextualClient;
