"use strict";
/**
 * Component responsible for handling time conversions
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeConverter = void 0;
const duration_1 = require("./duration");
class TimeConverter {
    static toSeconds(obj, monthsBanned = true) {
        // the month value cannot be used for the conversion and shall result in an error if not set to 0
        if (obj.months > 0 && monthsBanned === true)
            throw new RangeError(duration_1.Duration.ERRORS.BANNED_PARAM);
        // TODO: months and years are variable!!
        return (obj.seconds +
            obj.minutes * 60 +
            obj.hours * 60 * 60 +
            obj.days * 24 * 60 * 60 +
            obj.months * 30 * 24 * 60 * 60 +
            obj.years * 12 * 30 * 24 * 60 * 60);
    }
}
exports.TimeConverter = TimeConverter;
