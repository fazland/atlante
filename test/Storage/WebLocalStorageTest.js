const LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./scratch');

const WebLocalStorage = require('../../lib/Storage/WebLocalStorage');
const AdapterTestCase = require('./AdapterTestCase');

describe('[Storage] WebLocalStorage', function () {
    AdapterTestCase.shouldPassAdapterTests.call(this);

    this.testBasicUsageWithLongKeys = undefined;
    this._createCachePool = (defaultLifetime = undefined) => {
        return new WebLocalStorage(defaultLifetime);
    };

    this.run();
});
