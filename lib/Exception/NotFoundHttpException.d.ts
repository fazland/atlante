import HttpException from './HttpException';
import Response from "../Requestor/Response";
import Request from "../Requestor/Request";

declare class NotFoundHttpException extends HttpException {
    constructor(response?: Response, request?: Request);
}

export default NotFoundHttpException;
