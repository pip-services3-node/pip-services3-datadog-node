"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const DataDogCounters_1 = require("../../src/count/DataDogCounters");
const CountersFixture_1 = require("../fixtures/CountersFixture");
suite('DataDogCounters', () => {
    let _counters;
    let _fixture;
    setup((done) => {
        let apiKey = process.env['DATADOG_API_KEY'] || '3eb3355caf628d4689a72084425177ac';
        _counters = new DataDogCounters_1.DataDogCounters();
        _fixture = new CountersFixture_1.CountersFixture(_counters);
        let config = pip_services3_commons_node_1.ConfigParams.fromTuples('source', 'test', 'credential.access_key', apiKey);
        _counters.configure(config);
        _counters.open(null, (err) => {
            done(err);
        });
    });
    teardown((done) => {
        _counters.close(null, done);
    });
    test('Simple Counters', (done) => {
        _fixture.testSimpleCounters(done);
    });
    test('Measure Elapsed Time', (done) => {
        _fixture.testMeasureElapsedTime(done);
    });
});
//# sourceMappingURL=DataDogCounters.test.js.map