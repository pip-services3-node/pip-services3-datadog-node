const _ = require('lodash');

import { ConfigParams } from 'pip-services3-commons-node';
import { ConfigException } from 'pip-services3-commons-node';
import { IReferences } from 'pip-services3-commons-node';
import { StringConverter } from 'pip-services3-commons-node';
import { CredentialResolver } from 'pip-services3-components-node';
import { RestClient, } from 'pip-services3-rpc-node';

import { DataDogLogMessage } from './DataDogLogMessage';

export class DataDogLogClient extends RestClient {
    private _defaultConfig: ConfigParams = ConfigParams.fromTuples(
        "connection.protocol", "https",
        "connection.host", "http-intake.logs.datadoghq.com",
        "connection.port", 443,
        "credential.internal_network", "true"
    );
    private _credentialResolver: CredentialResolver = new CredentialResolver();

    public constructor(config?: ConfigParams) {
        super();

        if (config) this.configure(config);
        this._baseRoute = "v1";
    }   

    public configure(config: ConfigParams): void {
        config = this._defaultConfig.override(config);
        super.configure(config);
        this._credentialResolver.configure(config);
    }

    public setReferences(refs: IReferences): void {
        super.setReferences(refs);
        this._credentialResolver.setReferences(refs);
    }

    public open(correlationId: string, callback: (err: any) => void): void {
        this._credentialResolver.lookup(correlationId, (err, credential) => {
            if (err) {
                callback(err);
                return;
            }

            if (credential == null || credential.getAccessKey() == null) {
                err = new ConfigException(correlationId, "NO_ACCESS_KEY", "Missing access key in credentials");
                callback(err);
                return;
            }

            this._headers = this._headers || {};
            this._headers['DD-API-KEY'] = credential.getAccessKey();

            super.open(correlationId, callback);
        });    
    }

    private convertTags(tags: any[]): string {
        if (tags == null) return null;

        let builder: string = "";

        for (let key in tags) {
            if (builder != "")
                builder += ",";
            builder += key + ":" + tags[key];
        }
        return builder;
    }

    private convertMessage(message: DataDogLogMessage): any {
        let result = {
            "timestamp": StringConverter.toString(message.time || new Date()),
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

    private convertMessages(messages: DataDogLogMessage[]): any[] {
        return _.map(messages, (m) => {return this.convertMessage(m);});
    }

    public sendLogs(correlationId: string, messages: DataDogLogMessage[],
        callback: (err: any) => void): void {
        let data = this.convertMessages(messages);

        // Commented instrumentation because otherwise it will never stop sending logs...
        //let timing = this.instrument(correlationId, "datadog.send_logs");
        this.call("post", "input", null, null, data, (err, result) => {
            //timing.endTiming();
            this.instrumentError(correlationId, "datadog.send_logs", err, result, callback);
        });
    }
}