/** @module build */
import { Factory } from 'pip-services3-components-node';
import { Descriptor } from 'pip-services3-commons-node';
/**
 * Creates DataDog components by their descriptors.
 *
 * @see [[DataDogLogger]]
 */
export declare class DefaultDataDogFactory extends Factory {
    static readonly Descriptor: Descriptor;
    static readonly DataDogLoggerDescriptor: Descriptor;
    /**
     * Create a new instance of the factory.
     */
    constructor();
}
