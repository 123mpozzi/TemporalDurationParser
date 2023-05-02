"use strict";
// TODO: rename file? also in .json files!
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseDuration = exports.getTotalSeconds = exports.parseTimeComponent = exports.parseDayComponent = exports.isDigit = void 0;
function isDigit(character) {
    if (character >= '0' && character <= '9') {
        return true;
    }
    else {
        return false;
    }
}
exports.isDigit = isDigit;
// TODO: global const bad practice? (clutter env, security in browser, .., make an object?)
const PERIOD_DESIGNATOR = 'P';
const TIME_DESIGNATOR = 'T';
const YEAR_DESIGNATOR = 'Y';
const MONTH_DESIGNATOR = 'M';
const DAY_DESIGNATOR = 'D';
const HOUR_DESIGNATOR = 'H';
const MINUTE_DESIGNATOR = 'M';
const SECOND_DESIGNATOR = 'S';
// map of day component
const dayMap = new Map();
dayMap.set(YEAR_DESIGNATOR, 0);
dayMap.set(MONTH_DESIGNATOR, 0);
dayMap.set(DAY_DESIGNATOR, 0);
// map of time component
const timeMap = new Map();
timeMap.set(HOUR_DESIGNATOR, 0);
timeMap.set(MINUTE_DESIGNATOR, 0);
timeMap.set(SECOND_DESIGNATOR, 0);
function parseDayComponent(str) {
    return parseComponent(dayMap, str);
}
exports.parseDayComponent = parseDayComponent;
function parseTimeComponent(str) {
    return parseComponent(timeMap, str);
}
exports.parseTimeComponent = parseTimeComponent;
function getTotalSeconds(dayMap, timeMap) {
    const seconds = timeMap.get(SECOND_DESIGNATOR) || 0;
    const minutes = timeMap.get(MINUTE_DESIGNATOR) || 0;
    const hours = timeMap.get(HOUR_DESIGNATOR) || 0;
    const days = dayMap.get(DAY_DESIGNATOR) || 0;
    const months = dayMap.get(MONTH_DESIGNATOR) || 0;
    const years = dayMap.get(YEAR_DESIGNATOR) || 0;
    // TODO: months and years are variable!!
    return (seconds +
        minutes * 60 +
        hours * 60 * 60 +
        days * 24 * 60 * 60 +
        months * 30 * 24 * 60 * 60 +
        years * 12 * 30 * 24 * 60 * 60);
}
exports.getTotalSeconds = getTotalSeconds;
// TODO: P0.5Y
// TODO:  "PT36H" could be used as well as "P1DT12H"
function parseComponent(map, str) {
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
    console.log(map.entries());
    return map;
}
// P3Y0M14DT12H30M55S
// P3Y0M14D [T] 12H30M55S
// P3Y0M14D     12H30M55S
// TODO: pretty docs (also returns types, see typescript)
// Parse ISO_8601 Durations
// https://en.wikipedia.org/wiki/ISO_8601#Durations
function parseDuration(str) {
    // P signals the start of the duration representation
    // it indicates that the following string represents a duration of time
    // rather than a specific point in time.
    if (!str || str[0] != PERIOD_DESIGNATOR || str.length < 3) {
        return -1;
    }
    str = str.substring(1); // remove P
    let tmap = timeMap;
    let dmap = dayMap;
    if (str.includes(TIME_DESIGNATOR)) {
        const splits = str.split(TIME_DESIGNATOR);
        if (splits.length == 2) {
            dmap = parseDayComponent(splits[0]);
            tmap = parseTimeComponent(splits[1]);
        }
        else {
            // invalid
            return -1;
        }
    }
    else {
        // no Time component
        dmap = parseDayComponent(str);
    }
    var totalSeconds = 0;
    //console.log(years, months, days, hours, minutes, seconds);
    return getTotalSeconds(dmap, tmap);
}
exports.parseDuration = parseDuration;
//parseDuration("PT1M1.2S");
console.log(parseDuration('P3Y14DT12H30M55S'));
//parseDuration('P3Y0M14DT12H30M55S');//('P3Y0M1DT12H')
// three years, six months, four days, twelve hours, thirty minutes, and five seconds
//parseDuration("P3Y6M0DT12H30M5S");
