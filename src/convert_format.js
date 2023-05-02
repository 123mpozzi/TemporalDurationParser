"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const duration_1 = require("./duration");
// TODO: rename file? also in .json files!
// TODO: global const bad practice? (clutter env, security in browser, .., make an object?)
// P3Y0M14DT12H30M55S
// P3Y0M14D [T] 12H30M55S
// P3Y0M14D     12H30M55S
// TODO: pretty docs (also returns types, see typescript)
// Parse ISO_8601 Durations
// https://en.wikipedia.org/wiki/ISO_8601#Durations
const dur1 = new duration_1.Duration();
//const dur2 = new Duration().parseDayComponent('3Y14.5DT12H30M55S');
const dur2 = new duration_1.Duration();
//parseDuration("PT1M1.2S");
// TODO: try laziness: parse one string and CHECK, parse another and CHECK, and so on!
//console.log(dur1.parseDuration('P3Y14DT12H30M55S'));
//console.log(dayMap.entries())
console.log(dur1.parseDuration("PT1M1.2S"));
console.log(dur2.parseDuration("PT1M1S"));
//console.log(dur1.parseDayComponent("PT1M1.2S"));
//parseDuration('P3Y0M14DT12H30M55S');//('P3Y0M1DT12H')
// three years, six months, four days, twelve hours, thirty minutes, and five seconds
//parseDuration("P3Y6M0DT12H30M5S");
