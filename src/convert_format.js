"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseDuration = void 0;
const duration_1 = require("./duration");
// TODO: rename file? also in .json files!
// TODO: global const bad practice? (clutter env, security in browser, .., make an object?)
// P3Y0M14DT12H30M55S
// P3Y0M14D [T] 12H30M55S
// P3Y0M14D     12H30M55S
// TODO: pretty docs (also returns types, see typescript)
// Parse ISO_8601 Durations
// https://en.wikipedia.org/wiki/ISO_8601#Durations
function parseDuration(str) {
    // it is lazy: it does not check on constructor, it just initializes its internal variables
    const duration = new duration_1.Duration();
    // P signals the start of the duration representation
    // it indicates that the following string represents a duration of time
    // rather than a specific point in time.
    if (!str || str[0] != duration.PERIOD_DESIGNATOR || str.length < 3) {
        return -1;
    }
    str = str.substring(1); // remove P
    if (str.includes(duration.TIME_DESIGNATOR)) {
        const splits = str.split(duration.TIME_DESIGNATOR);
        if (splits.length == 2) {
            duration.parseDayComponent(splits[0]);
            duration.parseTimeComponent(splits[1]);
        }
        else {
            // invalid
            return -1;
        }
    }
    else {
        // no Time component
        duration.parseDayComponent(str);
    }
    return duration.getTotalSeconds();
}
exports.parseDuration = parseDuration;
//parseDuration("PT1M1.2S");
console.log(parseDuration('P3Y14DT12H30M55S'));
//console.log(dayMap.entries())
console.log(parseDuration("PT1M1.2S"));
//parseDuration('P3Y0M14DT12H30M55S');//('P3Y0M1DT12H')
// three years, six months, four days, twelve hours, thirty minutes, and five seconds
//parseDuration("P3Y6M0DT12H30M5S");
