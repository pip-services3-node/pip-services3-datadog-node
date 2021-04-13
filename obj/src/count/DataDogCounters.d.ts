import { ConfigParams } from 'pip-services3-commons-node';
import { IReferenceable } from 'pip-services3-commons-node';
import { IReferences } from 'pip-services3-commons-node';
import { IOpenable } from 'pip-services3-commons-node';
import { CachedCounters } from 'pip-services3-components-node';
import { Counter } from 'pip-services3-components-node';
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
export declare class DataDogCounters extends CachedCounters implements IReferenceable, IOpenable {
    private _client;
    private _logger;
    private _opened;
    private _source;
    private _instance;
    private _requestRoute;
    /**
     * Creates a new instance of the performance counters.
     */
    constructor();
    /**
     * Configures component by passing configuration parameters.
     *
     * @param config    configuration parameters to be set.
     */
    configure(config: ConfigParams): void;
    /**
     * Sets references to dependent components.
     *
     * @param references 	references to locate the component dependencies.
     */
    setReferences(references: IReferences): void;
    /**
     * Checks if the component is opened.
     *
     * @returns true if the component has been opened and false otherwise.
     */
    isOpen(): boolean;
    /**
     * Opens the component.
     *
     * @param correlationId 	(optional) transaction id to trace execution through call chain.
     * @param callback 			callback function that receives error or null no errors occured.
     */
    open(correlationId: string, callback: (err: any) => void): void;
    /**
     * Closes component and frees used resources.
     *
     * @param correlationId 	(optional) transaction id to trace execution through call chain.
     * @param callback 			callback function that receives error or null no errors occured.
     */
    close(correlationId: string, callback: (err: any) => void): void;
    private convertCounter;
    private convertCounters;
    /**
     * Saves the current counters measurements.
     *
     * @param counters      current counters measurements to be saves.
     */
    protected save(counters: Counter[]): void;
}
