import Response from './Response';

declare interface RequestorInterface {
    /**
     * Performs a request.
     * Returns a response with parsed data, if no error is present.
     */
    request<T = any>(method: string, path: string, headers?: any, requestData?: any): Promise<Response<T>>;
}

export default RequestorInterface;
