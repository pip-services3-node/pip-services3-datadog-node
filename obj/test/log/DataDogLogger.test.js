"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const DataDogLogger_1 = require("../../src/log/DataDogLogger");
const LoggerFixture_1 = require("../fixtures/LoggerFixture");
let assert = require('chai').assert;
let async = require('async');
suite('DataDogLogger', () => {
    let _logger;
    let _fixture;
    setup((done) => {
        let apiKey = process.env['DATADOG_API_KEY'] || '3eb3355caf628d4689a72084425177ac';
        _logger = new DataDogLogger_1.DataDogLogger();
        _fixture = new LoggerFixture_1.LoggerFixture(_logger);
        let config = pip_services3_commons_node_1.ConfigParams.fromTuples('source', 'test', 'credential.access_key', apiKey);
        _logger.configure(config);
        _logger.open(null, (err) => {
            done(err);
        });
    });
    teardown((done) => {
        _logger.close(null, done);
    });
    test('Log Level', () => {
        _fixture.testLogLevel();
    });
    test('Simple Logging', (done) => {
        _fixture.testSimpleLogging(done);
    });
    test('Error Logging', (done) => {
        _fixture.testErrorLogging(done);
    });
});
//# sourceMappingURL=DataDogLogger.test.js.map