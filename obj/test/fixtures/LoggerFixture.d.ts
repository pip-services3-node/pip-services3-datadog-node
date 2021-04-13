import { CachedLogger } from 'pip-services3-components-node';
export declare class LoggerFixture {
    private _logger;
    constructor(logger: CachedLogger);
    testLogLevel(): void;
    testSimpleLogging(done: any): void;
    testErrorLogging(done: any): void;
}
