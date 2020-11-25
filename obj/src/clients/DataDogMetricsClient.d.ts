import { ConfigParams } from 'pip-services3-commons-node';
import { IReferences } from 'pip-services3-commons-node';
import { RestClient } from 'pip-services3-rpc-node';
import { DataDogMetric } from './DataDogMetric';
export declare class DataDogMetricsClient extends RestClient {
    private _defaultConfig;
    private _credentialResolver;
    constructor(config?: ConfigParams);
    configure(config: ConfigParams): void;
    setReferences(refs: IReferences): void;
    open(correlationId: string, callback: (err: any) => void): void;
    private convertTags;
    private convertPoints;
    private convertMetric;
    private convertMetrics;
    sendMetrics(correlationId: string, metrics: DataDogMetric[], callback: (err: any) => void): void;
}
