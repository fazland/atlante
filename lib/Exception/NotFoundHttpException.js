const HttpException = require('./HttpException');

/**
 * @memberOf Atlante.Exception
 */
class NotFoundHttpException extends HttpException {
    constructor(response) {
        super('Not found', response);
    }
}

module.exports = NotFoundHttpException;
