"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataDogCounters = void 0;
/** @module count */
/** @hidden */
let os = require('os');
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_components_node_1 = require("pip-services3-components-node");
const pip_services3_components_node_2 = require("pip-services3-components-node");
const DataDogMetricsClient_1 = require("../clients/DataDogMetricsClient");
const DataDogMetricType_1 = require("../clients/DataDogMetricType");
/**
 * Performance counters that send their metrics to DataDog service.
 *
 * DataDog is a popular monitoring SaaS service. It collects logs, metrics, events
 * from infrastructure and applications and analyze them in a single place.
 *
 * ### Configuration parameters ###
 *
 * - connection(s):
 *   - discovery_key:         (optional) a key to retrieve the connection from [[https://pip-services3-node.github.io/pip-services3-components-node/interfaces/connect.idiscovery.html IDiscovery]]
 *     - protocol:            (optional) connection protocol: http or https (default: https)
 *     - host:                (optional) host name or IP address (default: api.datadoghq.com)
 *     - port:                (optional) port number (default: 443)
 *     - uri:                 (optional) resource URI or connection string with all parameters in it
 * - credential:
 *     - access_key:          DataDog client api key
 * - options:
 *   - retries:               number of retries (default: 3)
 *   - connect_timeout:       connection timeout in milliseconds (default: 10 sec)
 *   - timeout:               invocation timeout in milliseconds (default: 10 sec)
 *
 * ### References ###
 *
 * - <code>\*:logger:\*:\*:1.0</code>         (optional) [[https://pip-services3-node.github.io/pip-services3-components-node/interfaces/log.ilogger.html ILogger]] components to pass log messages
 * - <code>\*:counters:\*:\*:1.0</code>         (optional) [[https://pip-services3-node.github.io/pip-services3-components-node/interfaces/count.icounters.html ICounters]] components to pass collected measurements
 * - <code>\*:discovery:\*:\*:1.0</code>        (optional) [[https://pip-services3-node.github.io/pip-services3-components-node/interfaces/connect.idiscovery.html IDiscovery]] services to resolve connection
 *
 * @see [[https://pip-services3-node.github.io/pip-services3-rpc-node/classes/services.restservice.html RestService]]
 * @see [[https://pip-services3-node.github.io/pip-services3-rpc-node/classes/services.commandablehttpservice.html CommandableHttpService]]
 *
 * ### Example ###
 *
 *     let counters = new DataDogCounters();
 *     counters.configure(ConfigParams.fromTuples(
 *         "credential.access_key", "827349874395872349875493"
 *     ));
 *
 *     counters.open("123", (err) => {
 *         ...
 *     });
 *
 *     counters.increment("mycomponent.mymethod.calls");
 *     let timing = counters.beginTiming("mycomponent.mymethod.exec_time");
 *     try {
 *         ...
 *     } finally {
 *         timing.endTiming();
 *     }
 *
 *     counters.dump();
 */
class DataDogCounters extends pip_services3_components_node_1.CachedCounters {
    /**
     * Creates a new instance of the performance counters.
     */
    constructor() {
        super();
        this._client = new DataDogMetricsClient_1.DataDogMetricsClient();
        this._logger = new pip_services3_components_node_2.CompositeLogger();
        this._opened = false;
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
        this._source = config.getAsStringWithDefault("source", this._source);
        this._instance = config.getAsStringWithDefault("instance", this._instance);
    }
    /**
     * Sets references to dependent components.
     *
     * @param references 	references to locate the component dependencies.
     */
    setReferences(references) {
        this._logger.setReferences(references);
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
        return this._opened;
    }
    /**
     * Opens the component.
     *
     * @param correlationId 	(optional) transaction id to trace execution through call chain.
     * @param callback 			callback function that receives error or null no errors occured.
     */
    open(correlationId, callback) {
        if (this._opened) {
            if (callback)
                callback(null);
            return;
        }
        this._opened = true;
        this._client.open(correlationId, callback);
    }
    /**
     * Closes component and frees used resources.
     *
     * @param correlationId 	(optional) transaction id to trace execution through call chain.
     * @param callback 			callback function that receives error or null no errors occured.
     */
    close(correlationId, callback) {
        this._opened = false;
        this._client.close(correlationId, callback);
    }
    convertCounter(counter) {
        switch (counter.type) {
            case pip_services3_components_node_1.CounterType.Increment:
                return [{
                        metric: counter.name,
                        type: DataDogMetricType_1.DataDogMetricType.Gauge,
                        host: this._instance,
                        service: this._source,
                        points: [{ time: counter.time, value: counter.count }]
                    }];
            case pip_services3_components_node_1.CounterType.LastValue:
                return [{
                        metric: counter.name,
                        type: DataDogMetricType_1.DataDogMetricType.Gauge,
                        host: this._instance,
                        service: this._source,
                        points: [{ time: counter.time, value: counter.last }]
                    }];
            case pip_services3_components_node_1.CounterType.Interval:
            case pip_services3_components_node_1.CounterType.Statistics:
                return [
                    {
                        metric: counter.name + ".min",
                        type: DataDogMetricType_1.DataDogMetricType.Gauge,
                        host: this._instance,
                        service: this._source,
                        points: [{ time: counter.time, value: counter.min }]
                    },
                    {
                        metric: counter.name + ".average",
                        type: DataDogMetricType_1.DataDogMetricType.Gauge,
                        host: this._instance,
                        service: this._source,
                        points: [{ time: counter.time, value: counter.average }]
                    },
                    {
                        metric: counter.name + ".max",
                        type: DataDogMetricType_1.DataDogMetricType.Gauge,
                        host: this._instance,
                        service: this._source,
                        points: [{ time: counter.time, value: counter.max }]
                    }
                ];
        }
        return null;
    }
    convertCounters(counters) {
        let metrics = [];
        for (let counter of counters) {
            let data = this.convertCounter(counter);
            if (data != null && data.length > 0)
                metrics.push(...data);
        }
        return metrics;
    }
    /**
     * Saves the current counters measurements.
     *
     * @param counters      current counters measurements to be saves.
     */
    save(counters) {
        let metrics = this.convertCounters(counters);
        if (metrics.length == 0)
            return;
        this._client.sendMetrics('datadog-counters', metrics, (err) => {
            if (err)
                this._logger.error("datadog-counters", err, "Failed to push metrics to DataDog");
        });
    }
}
exports.DataDogCounters = DataDogCounters;
//# sourceMappingURL=DataDogCounters.js.map