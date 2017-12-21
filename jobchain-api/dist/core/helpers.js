"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function parseJSON(source) {
    if (typeof source == "object")
        return source;
    if (typeof source == "string") {
        var obj = null;
        try {
            obj = JSON.parse(source);
        }
        catch (error) {
            // TODO: error logging
        }
        return obj;
    }
}
exports.parseJSON = parseJSON;
//# sourceMappingURL=helpers.js.map