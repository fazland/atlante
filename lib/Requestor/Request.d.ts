import HttpMessage from "./HttpMessage";

declare interface Request<T = any> extends HttpMessage {
    readonly body?: T;
    readonly method: string;
    readonly url: string;
}

export default Request;
