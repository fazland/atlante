import HttpException from './HttpException';

/**
 * @memberOf Fazland.Atlante.Exception
 */
export default class NotFoundHttpException extends HttpException {
    constructor(response, request) {
        super('Not found', response, request);
    }
}
