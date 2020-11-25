"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require('lodash');
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_commons_node_2 = require("pip-services3-commons-node");
const pip_services3_commons_node_3 = require("pip-services3-commons-node");
const pip_services3_components_node_1 = require("pip-services3-components-node");
const pip_services3_rpc_node_1 = require("pip-services3-rpc-node");
class DataDogMetricsClient extends pip_services3_rpc_node_1.RestClient {
    constructor(config) {
        super();
        this._defaultConfig = pip_services3_commons_node_1.ConfigParams.fromTuples("connection.protocol", "https", "connection.host", "api.datadoghq.com", "connection.port", 443, "credential.internal_network", "true");
        this._credentialResolver = new pip_services3_components_node_1.CredentialResolver();
        if (config)
            this.configure(config);
        this._baseRoute = "api/v1";
    }
    configure(config) {
        config = this._defaultConfig.override(config);
        super.configure(config);
        this._credentialResolver.configure(config);
    }
    setReferences(refs) {
        super.setReferences(refs);
        this._credentialResolver.setReferences(refs);
    }
    open(correlationId, callback) {
        this._credentialResolver.lookup(correlationId, (err, credential) => {
            if (err) {
                callback(err);
                return;
            }
            if (credential == null || credential.getAccessKey() == null) {
                err = new pip_services3_commons_node_2.ConfigException(correlationId, "NO_ACCESS_KEY", "Missing access key in credentials");
                callback(err);
                return;
            }
            this._headers = this._headers || {};
            this._headers['DD-API-KEY'] = credential.getAccessKey();
            super.open(correlationId, callback);
        });
    }
    convertTags(tags) {
        if (tags == null)
            return null;
        let builder = "";
        for (let key in tags) {
            if (builder != "")
                builder += ",";
            builder += key + ":" + tags[key];
        }
        return builder;
    }
    convertPoints(points) {
        let result = _.map(points, (p) => {
            let time = (p.time || new Date()).getTime() / 1000;
            return [
                pip_services3_commons_node_3.StringConverter.toString(time),
                pip_services3_commons_node_3.StringConverter.toString(p.value)
            ];
        });
        return result;
    }
    convertMetric(metric) {
        let tags = metric.tags;
        if (metric.service) {
            tags = tags || {};
            tags.service = metric.service;
        }
        let result = {
            "metric": metric.metric,
            "type": metric.type || 'gauge',
            "points": this.convertPoints(metric.points),
        };
        if (tags)
            result['tags'] = this.convertTags(tags);
        if (metric.host)
            result['host'] = metric.host;
        if (metric.interval)
            result['interval'] = metric.interval;
        return result;
    }
    convertMetrics(metrics) {
        let series = _.map(metrics, (m) => { return this.convertMetric(m); });
        return {
            series: series
        };
    }
    sendMetrics(correlationId, metrics, callback) {
        let data = this.convertMetrics(metrics);
        // Commented instrumentation because otherwise it will never stop sending logs...
        //let timing = this.instrument(correlationId, "datadog.send_metrics");
        this.call("post", "series", null, null, data, (err, result) => {
            //timing.endTiming();
            this.instrumentError(correlationId, "datadog.send_metrics", err, result, callback);
        });
    }
}
exports.DataDogMetricsClient = DataDogMetricsClient;
//# sourceMappingURL=DataDogMetricsClient.js.map