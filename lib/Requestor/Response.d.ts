declare interface Response<T = any> {
    readonly data: T;
    readonly status: number;
    readonly statusText: string;
    readonly headers: Headers;
}

export default Response;
