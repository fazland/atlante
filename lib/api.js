module.exports = {
    Api: {
        Client: require('./Api/Client'),
        ContextualClient: require('./Api/ContextualClient'),
    },
    Exception: {
        HttpException: require('./Exception/HttpException'),
        NotFoundHttpException: require('./Exception/NotFoundHttpException'),
    },
    Requestor: {
        Headers: require('./Requestor/Headers'),
        WebRequestor: require('./Requestor/WebRequestor'),
    },
    Storage: {
        Marshaller: {
            JSONMarshaller: require('./Storage/Marshaller/JSONMarshaller'),
            NullMarshaller: require('./Storage/Marshaller/NullMarshaller'),
        },
        CookieStorage: require('./Storage/CookieStorage'),
        Item: require('./Storage/Item'),
        ProvidedTokenStorage: require('./Storage/ProvidedTokenStorage'),
        WebLocalStorage: require('./Storage/WebLocalStorage'),
    },
};
