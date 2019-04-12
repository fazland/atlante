const InMemoryStorage = require('../../lib/Storage/InMemoryStorage');
const AdapterTestCase = require('./AdapterTestCase');

describe('[Storage] InMemoryStorage', function () {
    AdapterTestCase.shouldPassAdapterTests.call(this);

    this.testBasicUsageWithLongKeys = undefined;
    this._createCachePool = (defaultLifetime = undefined) => {
        return new InMemoryStorage(defaultLifetime);
    };

    this.run();
});
