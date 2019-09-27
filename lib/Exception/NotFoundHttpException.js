import HttpException from './HttpException';

/**
 * @memberOf Fazland.Atlante.Exception
 */
export default class NotFoundHttpException extends HttpException {
    constructor(response) {
        super('Not found', response);
    }
}
