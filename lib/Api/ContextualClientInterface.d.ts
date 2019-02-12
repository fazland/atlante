import ClientInterface = require('./ClientInterface');

declare interface ContextualClientInterface extends ClientInterface {
    /**
     * Authenticates user.
     */
    authenticate(username: string, password: string): Promise<void>;
}

export = ContextualClientInterface;
