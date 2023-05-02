"use strict";
// TODO: Alternatively, a format for duration based on combined date and time representations may be used by agreement between the communicating parties either in the basic format PYYYYMMDDThhmmss or in the extended format P[YYYY]-[MM]-[DD]T[hh]:[mm]:[ss]. For example, the first duration shown above would be "P0003-06-04T12:30:05". However, individual date and time values cannot exceed their moduli (e.g. a value of 13 for the month or 25 for the hour would not be permissible).
Object.defineProperty(exports, "__esModule", { value: true });
exports.Duration = void 0;
const dateParser_1 = require("./dateParser");
const timeConverter_1 = require("./timeConverter");
/**
 * Model component representing an ISO_8601 Duration
 */
var DESIGNATORS;
(function (DESIGNATORS) {
    DESIGNATORS["PERIOD"] = "P";
    DESIGNATORS["TIME"] = "T";
    DESIGNATORS["YEAR"] = "Y";
    DESIGNATORS["MONTH"] = "M";
    DESIGNATORS["DAY"] = "D";
    DESIGNATORS["HOUR"] = "H";
    DESIGNATORS["MINUTE"] = "M";
    DESIGNATORS["SECOND"] = "S";
})(DESIGNATORS || (DESIGNATORS = {}));
// TODO: weeks!! W
// TODO: represent everything internally via variables(days,weeks,seconds), and then try to parse the different formats (1: standard, 2: via weeks, 3: via 'agreement' -> the one with '-')
// ISO_8601 DURATION represenation
class Duration {
    // it is lazy: it does not check on constructor, it just initializes its internal variables
    // checks are on parseDuration();
    constructor(years, months, days, hours, minutes, seconds) {
        this.years = years;
        this.months = months;
        this.days = days;
        this.hours = hours;
        this.minutes = minutes;
        this.seconds = seconds;
    }
    static fromObj(obj) {
        return new Duration(obj.years, obj.months, obj.days, obj.hours, obj.minutes, obj.seconds);
    }
    static from(str) {
        return new dateParser_1.DateParser().build(str);
    }
    toSeconds(monthsBanned = true) {
        return timeConverter_1.TimeConverter.toSeconds(this);
    }
}
Duration.DESIGNATORS = DESIGNATORS;
exports.Duration = Duration;
