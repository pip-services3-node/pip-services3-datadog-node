import { ConfigParams } from 'pip-services3-commons-node';
import { IReferences } from 'pip-services3-commons-node';
import { RestClient } from 'pip-services3-rpc-node';
import { DataDogLogMessage } from './DataDogLogMessage';
export declare class DataDogLogClient extends RestClient {
    private _defaultConfig;
    private _credentialResolver;
    constructor(config?: ConfigParams);
    configure(config: ConfigParams): void;
    setReferences(refs: IReferences): void;
    open(correlationId: string, callback: (err: any) => void): void;
    private convertTags;
    private convertMessage;
    private convertMessages;
    sendLogs(correlationId: string, messages: DataDogLogMessage[], callback: (err: any) => void): void;
}
