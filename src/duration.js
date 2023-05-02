"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Duration = void 0;
// ISO_8601 DURATION represenation
class Duration {
    constructor() {
        this.PERIOD_DESIGNATOR = 'P';
        this.TIME_DESIGNATOR = 'T';
        this.YEAR_DESIGNATOR = 'Y';
        this.MONTH_DESIGNATOR = 'M';
        this.DAY_DESIGNATOR = 'D';
        this.HOUR_DESIGNATOR = 'H';
        this.MINUTE_DESIGNATOR = 'M';
        this.SECOND_DESIGNATOR = 'S';
        // init empty maps
        this.dayMap = this.createDayMap();
        this.timeMap = this.createTimeMap();
    }
    createDayMap() {
        const dayMap = new Map();
        dayMap.set(this.YEAR_DESIGNATOR, 0);
        dayMap.set(this.MONTH_DESIGNATOR, 0);
        dayMap.set(this.DAY_DESIGNATOR, 0);
        return dayMap;
    }
    createTimeMap() {
        const timeMap = new Map();
        timeMap.set(this.HOUR_DESIGNATOR, 0);
        timeMap.set(this.MINUTE_DESIGNATOR, 0);
        timeMap.set(this.SECOND_DESIGNATOR, 0);
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
        console.log(str);
        var splits;
        for (const key of map.keys()) {
            // if param is present
            if (str.includes(key)) {
                splits = str.split(key);
                str = splits[1];
                map.set(key, parseInt(splits[0])); // TODO: parseInt checks?
            }
        }
        console.log(map.entries()); // TODO: remove: debug
        return map;
    }
    getTotalSeconds() {
        const seconds = this.timeMap.get(this.SECOND_DESIGNATOR) || 0;
        const minutes = this.timeMap.get(this.MINUTE_DESIGNATOR) || 0;
        const hours = this.timeMap.get(this.HOUR_DESIGNATOR) || 0;
        const days = this.dayMap.get(this.DAY_DESIGNATOR) || 0;
        const months = this.dayMap.get(this.MONTH_DESIGNATOR) || 0;
        const years = this.dayMap.get(this.YEAR_DESIGNATOR) || 0;
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
