"use strict";
// TODO: Alternatively, a format for duration based on combined date and time representations may be used by agreement between the communicating parties either in the basic format PYYYYMMDDThhmmss or in the extended format P[YYYY]-[MM]-[DD]T[hh]:[mm]:[ss]. For example, the first duration shown above would be "P0003-06-04T12:30:05". However, individual date and time values cannot exceed their moduli (e.g. a value of 13 for the month or 25 for the hour would not be permissible).
Object.defineProperty(exports, "__esModule", { value: true });
exports.Duration = void 0;
var DESIGNATOR;
(function (DESIGNATOR) {
    DESIGNATOR["PERIOD"] = "P";
    DESIGNATOR["TIME"] = "T";
    DESIGNATOR["YEAR"] = "Y";
    DESIGNATOR["MONTH"] = "M";
    DESIGNATOR["DAY"] = "D";
    DESIGNATOR["HOUR"] = "H";
    DESIGNATOR["MINUTE"] = "M";
    DESIGNATOR["SECOND"] = "S";
})(DESIGNATOR || (DESIGNATOR = {}));
// ISO_8601 DURATION represenation
class Duration {
    // it is lazy: it does not check on constructor, it just initializes its internal variables
    // checks are on parseDuration();
    constructor(debug = false) {
        this.DESIGNATOR = DESIGNATOR;
        this.debug = debug;
        // init empty maps
        this.dayMap = this.createDayMap();
        this.timeMap = this.createTimeMap();
    }
    createDayMap() {
        const dayMap = new Map();
        dayMap.set(this.DESIGNATOR.YEAR, 0);
        dayMap.set(this.DESIGNATOR.MONTH, 0);
        dayMap.set(this.DESIGNATOR.DAY, 0);
        return dayMap;
    }
    createTimeMap() {
        const timeMap = new Map();
        timeMap.set(this.DESIGNATOR.HOUR, 0);
        timeMap.set(this.DESIGNATOR.MINUTE, 0);
        timeMap.set(this.DESIGNATOR.SECOND, 0);
        return timeMap;
    }
    parseDayComponent(str) {
        this.dayMap = this.parseComponent(this.dayMap, str);
        return this;
    }
    parseTimeComponent(str) {
        this.timeMap = this.parseComponent(this.timeMap, str);
        return this;
    }
    // TODO: P0.5Y
    // TODO:  "PT36H" could be used as well as "P1DT12H"
    parseComponent(map, str) {
        if (this.debug === true)
            console.log("\ncomponent: " + str);
        var splits;
        for (const key of map.keys()) {
            // if param is present
            if (str.includes(key)) {
                splits = str.split(key);
                str = splits[1];
                map.set(key, parseFloat(splits[0])); // TODO: parseInt checks?
            }
        }
        if (this.debug === true)
            console.log(map.entries());
        return map;
    }
    parseDuration(str) {
        // P signals the start of the duration representation
        // it indicates that the following string represents a duration of time
        // rather than a specific point in time.
        if (!str || str[0] != this.DESIGNATOR.PERIOD || str.length < 3) {
            return -1;
        }
        str = str.substring(1); // remove P
        if (str.includes(this.DESIGNATOR.TIME)) {
            const splits = str.split(this.DESIGNATOR.TIME);
            if (splits.length == 2) {
                this.parseDayComponent(splits[0]);
                this.parseTimeComponent(splits[1]);
            }
            else {
                // invalid
                return -1;
            }
        }
        else {
            // no Time component
            this.parseDayComponent(str);
        }
        return this.getTotalSeconds();
    }
    getTotalSeconds() {
        const seconds = this.timeMap.get(this.DESIGNATOR.SECOND) || 0;
        const minutes = this.timeMap.get(this.DESIGNATOR.MINUTE) || 0;
        const hours = this.timeMap.get(this.DESIGNATOR.HOUR) || 0;
        const days = this.dayMap.get(this.DESIGNATOR.DAY) || 0;
        const months = this.dayMap.get(this.DESIGNATOR.MONTH) || 0;
        const years = this.dayMap.get(this.DESIGNATOR.YEAR) || 0;
        // the month value cannot be used for the conversion and shall result in an error if not set to 0
        if (months > 0)
            return -1;
        // TODO: months and years are variable!!
        return (seconds +
            minutes * 60 +
            hours * 60 * 60 +
            days * 24 * 60 * 60 +
            months * 30 * 24 * 60 * 60 +
            years * 12 * 30 * 24 * 60 * 60);
    }
}
exports.Duration = Duration;
