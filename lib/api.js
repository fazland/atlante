/* eslint-disable sort-imports */

import Client from './Api/Client';

import HttpException from './Exception/HttpException';
import NotFoundHttpException from './Exception/NotFoundHttpException';
import NoTokenAvailableException from './Exception/NoTokenAvailableException';

import Headers from './Requestor/Headers';
import WebRequestor from './Requestor/WebRequestor';

import JSONMarshaller from './Storage/Marshaller/JSONMarshaller';
import NullMarshaller from './Storage/Marshaller/NullMarshaller';

import AbstractStorage from './Storage/AbstractStorage';
import CookieStorage from './Storage/CookieStorage';
import ChainStorage from './Storage/ChainStorage';
import InMemoryStorage from './Storage/InMemoryStorage';
import Item from './Storage/Item';
import ProvidedTokenStorage from './Storage/ProvidedTokenStorage';
import WebLocalStorage from './Storage/WebLocalStorage';

import ArrayUtils from './Utils/ArrayUtils';

export default {
    Api: { Client },
    Exception: {
        HttpException,
        NotFoundHttpException,
        NoTokenAvailableException,
    },
    Requestor: {
        Headers,
        WebRequestor,
    },
    Storage: {
        Marshaller: { JSONMarshaller, NullMarshaller },
        AbstractStorage,
        ChainStorage,
        CookieStorage,
        InMemoryStorage,
        Item,
        ProvidedTokenStorage,
        WebLocalStorage,
    },
    Utils: { ArrayUtils },
};
