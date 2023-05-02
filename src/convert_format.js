"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseDuration1 = exports.parseDuration = exports.parseDayComponent1 = exports.parseDayComponent = exports.parseTimeComponent = exports.isDigit = void 0;
function isDigit(character) {
    if (character >= '0' && character <= '9') {
        return true;
    }
    else {
        return false;
    }
}
exports.isDigit = isDigit;
function parseTimeComponent(str) {
}
exports.parseTimeComponent = parseTimeComponent;
const dayParams = ['Y', 'M', 'D'];
const dayMap = new Map();
dayMap.set('Y', 0);
dayMap.set('M', 0);
dayMap.set('D', 0);
const timeMap = new Map();
timeMap.set('H', 0);
timeMap.set('M', 0);
timeMap.set('S', 0);
function parseDayComponent(str) {
    console.log(str);
    var splits;
    for (const key of dayMap.keys()) {
        if (str.includes(key)) {
            splits = str.split(key);
            str = splits[1];
            dayMap.set(key, splits[0]);
        }
        // if false: param is not set
    }
    console.log(dayMap.entries());
    return 1;
}
exports.parseDayComponent = parseDayComponent;
function parseDayComponent1(str) {
    console.log(str);
    str = str.slice(1, str.length); // remove P
    // 3Y0M14D
    // 3Y 0M 14D
    var splits = str.split('Y');
    const years = splits[0];
    splits = splits[1].split('M');
    const months = splits[0];
    splits = splits[1].split('D');
    const days = splits[0];
    console.log(years, months, days);
    return 1;
}
exports.parseDayComponent1 = parseDayComponent1;
// P3Y0M14DT12H30M55S
// P3Y0M14D [T] 12H30M55S
// P3Y0M14D     12H30M55S
function parseDuration(str) {
    if (!str || str[0] != 'P' || str.length < 3) {
        return -1;
    }
    str = str.substring(1); // remove P
    var seconds = 0;
    const durationDesignator = 'P';
    const timeDesignator = 'T';
    const splits = str.split('T');
    if (splits.length == 2) {
        const day = parseDayComponent(splits[0]);
        const time = parseTimeComponent(splits[1]);
    }
    else if (splits.length == 1) { // no Time component
        parseTimeComponent("");
    }
    else {
        return -1;
    }
    //console.log(years, months, days, hours, minutes, seconds);
    return seconds;
}
exports.parseDuration = parseDuration;
// P[n]Y[n]M[n]D T[n]H[n]M[n]S  or  P[n]W
// For example ‘PT1M1.2S’ converts to 61,2 seconds
function parseDuration1(durationStr) {
    // Check initial validness
    // must have at least one element represented after P, eg "P0D"
    if (!durationStr || durationStr[0] !== 'P' || durationStr.length < 3) {
        throw new Error('Invalid duration format');
    }
    const timePart = durationStr.indexOf('T');
    // The month value cannot be used for this conversion and shall result in an error if not set to 0.
    // P3Y6M0D
    let years = 0;
    let months = 0;
    let days = 0;
    // Parse year
    const yearsEnd = durationStr.indexOf('Y');
    if (yearsEnd !== 0)
        years = parseInt(durationStr.slice(yearsEnd - 1, yearsEnd));
    // Parse months
    const monthsEnd = durationStr.indexOf('M');
    if (monthsEnd !== 0)
        months = parseInt(durationStr.slice(monthsEnd - 1, monthsEnd));
    if (monthsEnd < durationStr.indexOf('T') && months !== 0) {
        throw new Error('Invalid duration format: months must be 0');
    }
    // Parse days
    const daysEnd = durationStr.indexOf('D');
    if (daysEnd !== 0) {
        let amount = 2;
        if (!isDigit(durationStr[daysEnd - 2])) {
            amount = 1;
        }
        days = parseInt(durationStr.slice(daysEnd - amount, daysEnd));
    }
    console.log(years, months, days);
    //console.log(years, months, days, hours, minutes, seconds, totalSeconds);*/
    // "P3Y6M1D T12H"
    // P3Y6M4D T12H30M5S
    let hours = 0;
    let minutes = 0;
    let seconds = 0;
    // Parse hours
    const hoursEnd = durationStr.indexOf('H');
    if (hoursEnd !== 0) {
        let amount = 2;
        if (!isDigit(durationStr[hoursEnd - 2])) {
            amount = 1;
        }
        hours = parseInt(durationStr.slice(hoursEnd - amount, hoursEnd));
    }
    // Parse minutes
    const minutesEnd = durationStr.lastIndexOf('M');
    if (minutesEnd !== 0) {
        let amount = 2;
        if (!isDigit(durationStr[minutesEnd - 2])) {
            amount = 1;
        }
        minutes = parseInt(durationStr.slice(minutesEnd - amount, minutesEnd));
    }
    // Parse seconds
    const secondsEnd = durationStr.indexOf('S');
    if (secondsEnd !== 0) {
        let amount = 2;
        if (!isDigit(durationStr[secondsEnd - 2])) {
            amount = 1;
        }
        seconds = parseInt(durationStr.slice(secondsEnd - amount, secondsEnd));
    }
    console.log(years, months, days, hours, minutes, seconds);
    minutes *= 60;
    hours *= 3600;
    days *= 24 * 3600;
    return years + months + days + hours + minutes + seconds;
}
exports.parseDuration1 = parseDuration1;
//parseDuration("PT1M1.2S");
parseDuration('P3Y14DT12H30M55S');
//parseDuration('P3Y0M14DT12H30M55S');//('P3Y0M1DT12H')
// three years, six months, four days, twelve hours, thirty minutes, and five seconds
//parseDuration("P3Y6M0DT12H30M5S");
