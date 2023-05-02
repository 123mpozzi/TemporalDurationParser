"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseDuration = exports.isDigit = void 0;
function isDigit(character) {
    if (character >= '0' && character <= '9') {
        return true;
    }
    else {
        return false;
    }
}
exports.isDigit = isDigit;
// P[n]Y[n]M[n]DT[n]H[n]M[n]S  or  P[n]W
// For example ‘PT1M1.2S’ converts to 61,2 seconds
function parseDuration(durationStr) {
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
exports.parseDuration = parseDuration;
//parseDuration("PT1M1.2S");
parseDuration('P3Y0M14DT12H30M55S'); //('P3Y0M1DT12H')
// three years, six months, four days, twelve hours, thirty minutes, and five seconds
//parseDuration("P3Y6M0DT12H30M5S");
