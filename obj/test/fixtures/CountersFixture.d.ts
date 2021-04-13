import { CachedCounters } from 'pip-services3-components-node';
export declare class CountersFixture {
    private _counters;
    constructor(counters: CachedCounters);
    testSimpleCounters(done: any): void;
    testMeasureElapsedTime(done: any): void;
}
