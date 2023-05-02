"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateParser = void 0;
const duration_1 = require("./duration");
/**
 * Component responsible for parsing the string and adding data to the Duration model
 *
 * 3 types of parsing
 * -normal
 * -weeks
 * -agreements, with '-'
 */
class DateParser {
    constructor(debug = false) {
        this.debug = debug;
        // init empty maps
        this.dayMap = this.createDayMap();
        this.timeMap = this.createTimeMap();
    }
    createDayMap() {
        const dayMap = new Map();
        dayMap.set(duration_1.Duration.DESIGNATORS.YEAR, 0);
        dayMap.set(duration_1.Duration.DESIGNATORS.MONTH, 0);
        dayMap.set(duration_1.Duration.DESIGNATORS.DAY, 0);
        return dayMap;
    }
    createTimeMap() {
        const timeMap = new Map();
        timeMap.set(duration_1.Duration.DESIGNATORS.HOUR, 0);
        timeMap.set(duration_1.Duration.DESIGNATORS.MINUTE, 0);
        timeMap.set(duration_1.Duration.DESIGNATORS.SECOND, 0);
        return timeMap;
    }
    parseDayComponent(str) {
        this.dayMap = this.parseComponent(this.dayMap, str);
    }
    parseTimeComponent(str) {
        this.timeMap = this.parseComponent(this.timeMap, str);
    }
    // TODO: P0.5Y
    // TODO:  "PT36H" could be used as well as "P1DT12H"
    parseComponent(map, str) {
        if (this.debug === true)
            console.log('\ncomponent: ' + str);
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
    // throw new RangeError('message')
    build(str) {
        // P signals the start of the duration representation
        // it indicates that the following string represents a duration of time
        // rather than a specific point in time.
        if (!str || str[0] != duration_1.Duration.DESIGNATORS.PERIOD || str.length < 3) {
            throw new RangeError(DateParser.ERR_INVALIDFORMAT);
        }
        str = str.substring(1); // skip P
        if (str.includes(duration_1.Duration.DESIGNATORS.TIME)) {
            const splits = str.split(duration_1.Duration.DESIGNATORS.TIME);
            if (splits.length == 2) {
                this.parseDayComponent(splits[0]);
                this.parseTimeComponent(splits[1]);
            }
            else {
                // invalid
                throw new RangeError(DateParser.ERR_INVALIDFORMAT);
            }
        }
        else {
            // no Time component
            this.parseDayComponent(str);
        }
        return this.createModel();
    }
    createModel() {
        const seconds = this.timeMap.get(duration_1.Duration.DESIGNATORS.SECOND) || 0;
        const minutes = this.timeMap.get(duration_1.Duration.DESIGNATORS.MINUTE) || 0;
        const hours = this.timeMap.get(duration_1.Duration.DESIGNATORS.HOUR) || 0;
        const days = this.dayMap.get(duration_1.Duration.DESIGNATORS.DAY) || 0;
        const months = this.dayMap.get(duration_1.Duration.DESIGNATORS.MONTH) || 0;
        const years = this.dayMap.get(duration_1.Duration.DESIGNATORS.YEAR) || 0;
        return new duration_1.Duration(years, months, days, hours, minutes, seconds);
    }
}
DateParser.ERR_INVALIDFORMAT = 'Invalid format for ISO_8601 Duration';
exports.DateParser = DateParser;
