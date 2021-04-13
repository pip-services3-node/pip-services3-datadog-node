"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerFixture = void 0;
let assert = require('chai').assert;
const pip_services3_components_node_1 = require("pip-services3-components-node");
class LoggerFixture {
    constructor(logger) {
        this._logger = logger;
    }
    testLogLevel() {
        assert.isTrue(this._logger.getLevel() >= pip_services3_components_node_1.LogLevel.None);
        assert.isTrue(this._logger.getLevel() <= pip_services3_components_node_1.LogLevel.Trace);
    }
    testSimpleLogging(done) {
        this._logger.setLevel(pip_services3_components_node_1.LogLevel.Trace);
        this._logger.fatal("987", null, "Fatal error message");
        this._logger.error("987", null, "Error message");
        this._logger.warn("987", "Warning message");
        this._logger.info("987", "Information message");
        this._logger.debug("987", "Debug message");
        this._logger.trace("987", "Trace message");
        this._logger.dump();
        setTimeout(done, 1000);
    }
    testErrorLogging(done) {
        try {
            // Raise an exception
            throw new Error();
        }
        catch (ex) {
            this._logger.fatal("123", ex, "Fatal error");
            this._logger.error("123", ex, "Recoverable error");
            assert.isNotNull(ex);
        }
        this._logger.dump();
        setTimeout(done, 1000);
    }
}
exports.LoggerFixture = LoggerFixture;
//# sourceMappingURL=LoggerFixture.js.map