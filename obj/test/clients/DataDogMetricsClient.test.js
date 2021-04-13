"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_commons_node_2 = require("pip-services3-commons-node");
const DataDogMetricsClient_1 = require("../../src/clients/DataDogMetricsClient");
const DataDogMetricType_1 = require("../../src/clients/DataDogMetricType");
let assert = require('chai').assert;
suite('DataDogMetricClient', () => {
    let _client;
    setup((done) => {
        let apiKey = process.env['DATADOG_API_KEY'] || '3eb3355caf628d4689a72084425177ac';
        _client = new DataDogMetricsClient_1.DataDogMetricsClient();
        let config = pip_services3_commons_node_1.ConfigParams.fromTuples('source', 'test', 'credential.access_key', apiKey);
        _client.configure(config);
        _client.open(null, (err) => {
            done(err);
        });
    });
    teardown((done) => {
        _client.close(null, done);
    });
    test('Send Metrics', (done) => {
        let metrics = [
            {
                metric: 'test.metric.1',
                service: 'TestService',
                host: 'TestHost',
                type: DataDogMetricType_1.DataDogMetricType.Gauge,
                points: [{
                        time: new Date(),
                        value: pip_services3_commons_node_2.RandomDouble.nextDouble(0, 100)
                    }]
            },
            {
                metric: 'test.metric.2',
                service: 'TestService',
                host: 'TestHost',
                type: DataDogMetricType_1.DataDogMetricType.Rate,
                interval: 100,
                points: [{
                        time: new Date(),
                        value: pip_services3_commons_node_2.RandomDouble.nextDouble(0, 100)
                    }]
            },
            {
                metric: 'test.metric.3',
                service: 'TestService',
                host: 'TestHost',
                type: DataDogMetricType_1.DataDogMetricType.Count,
                interval: 100,
                points: [{
                        time: new Date(),
                        value: pip_services3_commons_node_2.RandomDouble.nextDouble(0, 100)
                    }]
            }
        ];
        _client.sendMetrics(null, metrics, (err) => {
            assert.isNull(err);
            done(err);
        });
    });
});
//# sourceMappingURL=DataDogMetricsClient.test.js.map