const HttpException = require('./HttpException');

/**
 * @memberOf Fazland.Atlante.Exception
 */
class NotFoundHttpException extends HttpException {
    constructor(response) {
        super('Not found', response);
    }
}

module.exports = NotFoundHttpException;
