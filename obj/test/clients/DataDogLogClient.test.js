"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const DataDogLogClient_1 = require("../../src/clients/DataDogLogClient");
const DataDogStatus_1 = require("../../src/clients/DataDogStatus");
let assert = require('chai').assert;
let async = require('async');
suite('DataDogLogClient', () => {
    let _client;
    setup((done) => {
        let apiKey = process.env['DATADOG_API_KEY'] || '3eb3355caf628d4689a72084425177ac';
        _client = new DataDogLogClient_1.DataDogLogClient();
        let config = pip_services3_commons_node_1.ConfigParams.fromTuples('source', 'test', 'credential.access_key', apiKey);
        _client.configure(config);
        _client.open(null, (err) => {
            done(err);
        });
    });
    teardown((done) => {
        _client.close(null, done);
    });
    test('Send Logs', (done) => {
        let messages = [
            {
                time: new Date(),
                service: 'TestService',
                host: 'TestHost',
                status: DataDogStatus_1.DataDogStatus.Debug,
                message: 'Test trace message'
            },
            {
                time: new Date(),
                service: 'TestService',
                host: 'TestHost',
                status: DataDogStatus_1.DataDogStatus.Info,
                message: 'Test info message'
            },
            {
                time: new Date(),
                service: 'TestService',
                host: 'TestHost',
                status: DataDogStatus_1.DataDogStatus.Error,
                message: 'Test error message',
                error_kind: 'Exception',
                error_stack: 'Stack trace...'
            },
            {
                time: new Date(),
                service: 'TestService',
                host: 'TestHost',
                status: DataDogStatus_1.DataDogStatus.Emergency,
                message: 'Test fatal message',
                error_kind: 'Exception',
                error_stack: 'Stack trace...'
            },
        ];
        _client.sendLogs(null, messages, (err) => {
            assert.isNull(err);
            done(err);
        });
    });
});
//# sourceMappingURL=DataDogLogClient.test.js.map