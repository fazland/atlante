import HttpMessage from "./HttpMessage";

declare interface Response<T = any> extends HttpMessage {
    readonly data: T;
    readonly status: number;
    readonly statusText: string;
}

export default Response;
