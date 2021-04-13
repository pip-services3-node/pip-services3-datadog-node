"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataDogLogClient = void 0;
/** @module clients */
const _ = require('lodash');
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_commons_node_2 = require("pip-services3-commons-node");
const pip_services3_commons_node_3 = require("pip-services3-commons-node");
const pip_services3_components_node_1 = require("pip-services3-components-node");
const pip_services3_rpc_node_1 = require("pip-services3-rpc-node");
class DataDogLogClient extends pip_services3_rpc_node_1.RestClient {
    constructor(config) {
        super();
        this._defaultConfig = pip_services3_commons_node_1.ConfigParams.fromTuples("connection.protocol", "https", "connection.host", "http-intake.logs.datadoghq.com", "connection.port", 443, "credential.internal_network", "true");
        this._credentialResolver = new pip_services3_components_node_1.CredentialResolver();
        if (config)
            this.configure(config);
        this._baseRoute = "v1";
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
    convertMessage(message) {
        let result = {
            "timestamp": pip_services3_commons_node_3.StringConverter.toString(message.time || new Date()),
            "status": message.status || "INFO",
            "ddsource": message.source || 'pip-services',
            //            "source": message.source || 'pip-services',
            "service": message.service,
            "message": message.message,
        };
        if (message.tags)
            result['ddtags'] = this.convertTags(message.tags);
        if (message.host)
            result['host'] = message.host;
        if (message.logger_name)
            result['logger.name'] = message.logger_name;
        if (message.thread_name)
            result['logger.thread_name'] = message.thread_name;
        if (message.error_message)
            result['error.message'] = message.error_message;
        if (message.error_kind)
            result['error.kind'] = message.error_kind;
        if (message.error_stack)
            result['error.stack'] = message.error_stack;
        return result;
    }
    convertMessages(messages) {
        return _.map(messages, (m) => { return this.convertMessage(m); });
    }
    sendLogs(correlationId, messages, callback) {
        let data = this.convertMessages(messages);
        // Commented instrumentation because otherwise it will never stop sending logs...
        //let timing = this.instrument(correlationId, "datadog.send_logs");
        this.call("post", "input", null, null, data, (err, result) => {
            //timing.endTiming();
            this.instrumentError(correlationId, "datadog.send_logs", err, result, callback);
        });
    }
}
exports.DataDogLogClient = DataDogLogClient;
//# sourceMappingURL=DataDogLogClient.js.map