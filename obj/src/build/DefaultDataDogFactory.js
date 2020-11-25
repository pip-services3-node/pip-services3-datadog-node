"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** @module build */
const pip_services3_components_node_1 = require("pip-services3-components-node");
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const DataDogLogger_1 = require("../log/DataDogLogger");
/**
 * Creates DataDog components by their descriptors.
 *
 * @see [[DataDogLogger]]
 */
class DefaultDataDogFactory extends pip_services3_components_node_1.Factory {
    /**
     * Create a new instance of the factory.
     */
    constructor() {
        super();
        this.registerAsType(DefaultDataDogFactory.DataDogLoggerDescriptor, DataDogLogger_1.DataDogLogger);
    }
}
exports.DefaultDataDogFactory = DefaultDataDogFactory;
DefaultDataDogFactory.Descriptor = new pip_services3_commons_node_1.Descriptor("pip-services", "factory", "datadog", "default", "1.0");
DefaultDataDogFactory.DataDogLoggerDescriptor = new pip_services3_commons_node_1.Descriptor("pip-services", "logger", "datadog", "*", "1.0");
//# sourceMappingURL=DefaultDataDogFactory.js.map