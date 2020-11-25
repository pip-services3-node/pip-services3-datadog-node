"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** @module log */
/** @hidden */
const _ = require('lodash');
const os = require('os');
const pip_services3_components_node_1 = require("pip-services3-components-node");
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const DataDogLogClient_1 = require("../clients/DataDogLogClient");
/**
 * Logger that dumps execution logs to DataDog service.
 *
 * DataDog is a popular monitoring SaaS service. It collects logs, metrics, events
 * from infrastructure and applications and analyze them in a single place.
 *
 * ### Configuration parameters ###
 *
 * - level:             maximum log level to capture
 * - source:            source (context) name
 * - connection:
 *     - discovery_key:         (optional) a key to retrieve the connection from [[https://rawgit.com/pip-services-node/pip-services3-components-node/master/doc/api/interfaces/connect.idiscovery.html IDiscovery]]
 *     - protocol:              (optional) connection protocol: http or https (default: https)
 *     - host:                  (optional) host name or IP address (default: http-intake.logs.datadoghq.com)
 *     - port:                  (optional) port number (default: 443)
 *     - uri:                   (optional) resource URI or connection string with all parameters in it
 * - credential:
 *     - access_key:      DataDog client api key
 * - options:
 *     - interval:        interval in milliseconds to save log messages (default: 10 seconds)
 *     - max_cache_size:  maximum number of messages stored in this cache (default: 100)
 *     - reconnect:       reconnect timeout in milliseconds (default: 60 sec)
 *     - timeout:         invocation timeout in milliseconds (default: 30 sec)
 *     - max_retries:     maximum number of retries (default: 3)
 *
 * ### References ###
 *
 * - <code>\*:context-info:\*:\*:1.0</code>      (optional) [[https://rawgit.com/pip-services-node/pip-services3-components-node/master/doc/api/classes/info.contextinfo.html ContextInfo]] to detect the context id and specify counters source
 * - <code>\*:discovery:\*:\*:1.0</code>         (optional) [[https://rawgit.com/pip-services-node/pip-services3-components-node/master/doc/api/interfaces/connect.idiscovery.html IDiscovery]] services to resolve connection
 *
 * ### Example ###
 *
 *     let logger = new DataDogLogger();
 *     logger.configure(ConfigParams.fromTuples(
 *         "credential.access_key", "827349874395872349875493"
 *     ));
 *
 *     logger.open("123", (err) => {
 *         ...
 *     });
 *
 *     logger.error("123", ex, "Error occured: %s", ex.message);
 *     logger.debug("123", "Everything is OK.");
 */
class DataDogLogger extends pip_services3_components_node_1.CachedLogger {
    /**
     * Creates a new instance of the logger.
     */
    constructor() {
        super();
        this._client = new DataDogLogClient_1.DataDogLogClient();
        this._instance = os.hostname();
    }
    /**
     * Configures component by passing configuration parameters.
     *
     * @param config    configuration parameters to be set.
     */
    configure(config) {
        super.configure(config);
        this._client.configure(config);
        this._instance = config.getAsStringWithDefault("instance", this._instance);
    }
    /**
     * Sets references to dependent components.
     *
     * @param references 	references to locate the component dependencies.
     */
    setReferences(references) {
        super.setReferences(references);
        this._client.setReferences(references);
        let contextInfo = references.getOneOptional(new pip_services3_commons_node_1.Descriptor("pip-services", "context-info", "default", "*", "1.0"));
        if (contextInfo != null && this._source == null)
            this._source = contextInfo.name;
        if (contextInfo != null && this._instance == null)
            this._instance = contextInfo.contextId;
    }
    /**
     * Checks if the component is opened.
     *
     * @returns true if the component has been opened and false otherwise.
     */
    isOpen() {
        return this._timer != null;
    }
    /**
     * Opens the component.
     *
     * @param correlationId 	(optional) transaction id to trace execution through call chain.
     * @param callback 			callback function that receives error or null no errors occured.
     */
    open(correlationId, callback) {
        if (this.isOpen()) {
            callback(null);
            return;
        }
        this._client.open(correlationId, (err) => {
            if (err == null) {
                this._timer = setInterval(() => { this.dump(); }, this._interval);
            }
            callback(err);
        });
    }
    /**
     * Closes component and frees used resources.
     *
     * @param correlationId 	(optional) transaction id to trace execution through call chain.
     * @param callback 			callback function that receives error or null no errors occured.
     */
    close(correlationId, callback) {
        this.save(this._cache, (err) => {
            if (this._timer)
                clearInterval(this._timer);
            this._cache = [];
            this._timer = null;
            this._client.close(correlationId, callback);
        });
    }
    // private convertStatus(level: number): string {
    //     switch (level) {
    //         case LogLevel.Fatal:
    //             return DataDogStatus.Emergency;
    //         case LogLevel.Error:
    //             return DataDogStatus.Error;
    //         case LogLevel.Warn:
    //             return DataDogStatus.Warn;
    //         case LogLevel.Info:
    //             return DataDogStatus.Info;
    //         case LogLevel.Debug:
    //             return DataDogStatus.Debug;
    //         case LogLevel.Trace:
    //             return DataDogStatus.Debug;
    //         default:
    //             return DataDogStatus.Info;
    //     }
    // }
    convertMessage(message) {
        let result = {
            time: message.time || new Date(),
            tags: {
                correlation_id: message.correlation_id
            },
            host: this._instance,
            service: message.source || this._source,
            status: message.level,
            message: message.message
        };
        if (message.error) {
            result.error_kind = message.error.type;
            result.error_message = message.error.message;
            result.error_stack = message.error.stack_trace;
        }
        return result;
    }
    /**
     * Saves log messages from the cache.
     *
     * @param messages  a list with log messages
     * @param callback  callback function that receives error or null for success.
     */
    save(messages, callback) {
        if (!this.isOpen() || messages.length == 0) {
            if (callback)
                callback(null);
            return;
        }
        let data = _.map(messages, (m) => { return this.convertMessage(m); });
        this._client.sendLogs("datadog-logger", data, callback);
    }
}
exports.DataDogLogger = DataDogLogger;
//# sourceMappingURL=DataDogLogger.js.map